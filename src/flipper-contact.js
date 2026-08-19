import { selectEarliestContact } from './contact-manifold.js';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function segmentAt(flipper, angle, lengthBonus = 0) {
  const length = flipper.length + lengthBonus;
  return {
    x1: flipper.pivotX,
    y1: flipper.pivotY,
    x2: flipper.pivotX + Math.cos(angle) * length,
    y2: flipper.pivotY + Math.sin(angle) * length,
    width: flipper.width,
    material: 'rubber'
  };
}

export function sweptSegmentContact(ball, segment, radius) {
  const startX = Number.isFinite(ball.prevX) ? ball.prevX : ball.x;
  const startY = Number.isFinite(ball.prevY) ? ball.prevY : ball.y;
  const velocityX = ball.x - startX;
  const velocityY = ball.y - startY;
  if (Math.hypot(velocityX, velocityY) < 0.01 || !Number.isFinite(radius) || radius <= 0) return null;

  // Analytic point-vs-capsule sweep: the segment is expanded by the ball
  // radius, so the first hit is either the parallel strip or an endpoint cap.
  // This keeps CCD independent of travel distance and removes the old capped
  // sample loop that could tunnel through a rail on a large fixed step.
  const dx = segment.x2 - segment.x1;
  const dy = segment.y2 - segment.y1;
  const lengthSquared = dx * dx + dy * dy;
  if (lengthSquared < 0.000001) return null;
  const length = Math.sqrt(lengthSquared);
  const candidates = [];
  const cross = (ax, ay, bx, by) => ax * by - ay * bx;
  const startOffsetX = startX - segment.x1;
  const startOffsetY = startY - segment.y1;
  const lineOffset = cross(dx, dy, startOffsetX, startOffsetY);
  const lineVelocity = cross(dx, dy, velocityX, velocityY);
  if (Math.abs(lineVelocity) > 0.000001) {
    for (const signedRadius of [-radius * length, radius * length]) {
      const t = (signedRadius - lineOffset) / lineVelocity;
      if (t >= 0 && t <= 1) {
        const hitX = startX + velocityX * t;
        const hitY = startY + velocityY * t;
        const projection = ((hitX - segment.x1) * dx + (hitY - segment.y1) * dy) / lengthSquared;
        if (projection >= 0 && projection <= 1) candidates.push(t);
      }
    }
  }
  for (const endpoint of [{ x: segment.x1, y: segment.y1 }, { x: segment.x2, y: segment.y2 }]) {
    const offsetX = startX - endpoint.x;
    const offsetY = startY - endpoint.y;
    const a = velocityX * velocityX + velocityY * velocityY;
    const b = 2 * (offsetX * velocityX + offsetY * velocityY);
    const c = offsetX * offsetX + offsetY * offsetY - radius * radius;
    const discriminant = b * b - 4 * a * c;
    if (discriminant >= 0) {
      const root = Math.sqrt(discriminant);
      for (const t of [(-b - root) / (2 * a), (-b + root) / (2 * a)]) {
        if (t >= 0 && t <= 1) candidates.push(t);
      }
    }
  }
  if (!candidates.length) return null;
  const t = Math.min(...candidates);
  return { x: startX + velocityX * t, y: startY + velocityY * t, t };
}

export function sweptFlipperContact(ball, flipper, radius, { lengthBonus = 0 } = {}) {
  const startX = Number.isFinite(ball.prevX) ? ball.prevX : ball.x;
  const startY = Number.isFinite(ball.prevY) ? ball.prevY : ball.y;
  const previousAngle = Number.isFinite(flipper.previousAngle) ? flipper.previousAngle : flipper.angle;
  const tipTravel = Math.abs(flipper.angle - previousAngle) * (flipper.length + lengthBonus);
  const ballTravel = Math.hypot(ball.x - startX, ball.y - startY);
  if (Math.max(ballTravel, tipTravel) < 0.01) return null;
  const queryRadius = radius + Math.min(10, tipTravel * 0.28);
  // Sample the rotating blade at radius-sized arc intervals. Three poses are
  // enough for ordinary motion but can skip a stationary ball during a large
  // angular jump; keep the query bounded for pathological review inputs.
  const angularSteps = Math.min(64, Math.max(2, Math.ceil(tipTravel / Math.max(2, queryRadius * 0.45))));
  const angles = Array.from({ length: angularSteps + 1 }, (_, index) => previousAngle + (flipper.angle - previousAngle) * (index / angularSteps));
  for (let angleIndex = 0; angleIndex < angles.length; angleIndex += 1) {
    const angle = angles[angleIndex];
    const poseT = angleIndex / angularSteps;
    const segment = segmentAt(flipper, angle, lengthBonus);
    const dx = segment.x2 - segment.x1;
    const dy = segment.y2 - segment.y1;
    const lengthSquared = dx * dx + dy * dy || 1;
    const projection = clamp(((ball.x - segment.x1) * dx + (ball.y - segment.y1) * dy) / lengthSquared, 0, 1);
    const closestX = segment.x1 + projection * dx;
    const closestY = segment.y1 + projection * dy;
    if (Math.hypot(ball.x - closestX, ball.y - closestY) < queryRadius) return { x: ball.x, y: ball.y, t: poseT, segment };
    const swept = sweptSegmentContact({ prevX: startX, prevY: startY, x: ball.x, y: ball.y }, segment, queryRadius);
    if (swept) return { x: swept.x, y: swept.y, t: Math.max(poseT, swept.t), segment };
  }
  return null;
}

// Flipper contact selection stays renderer-independent so the live resolver can
// later gather both rotating surfaces before mutating ball state. A stable side
// tie-break keeps replay fixtures deterministic when both blades meet at the
// same normalized time.
export function selectEarliestFlipperContact(candidates = []) {
  const ordered = candidates
    .filter(candidate => candidate?.contact && Number.isFinite(candidate.contact.t))
    .map(candidate => ({ ...candidate, t: candidate.contact.t, order: candidate.side || '', source: candidate }));
  return selectEarliestContact(ordered)?.source || null;
}

// Drain recovery runs after the primary manifold has already resolved. Keep
// its emergency sweep deterministic and single-source too: both blades are
// queried from the same post-resolution trajectory, then one winner is
// returned without mutating either flipper or the ball.
export function collectDrainRecoveryCandidates(ball, flippersBySide = {}, radius, { lengthBonus = 0 } = {}) {
  return ['left', 'right'].flatMap(side => {
    const flipper = flippersBySide[side];
    const contact = flipper ? sweptFlipperContact(ball, flipper, radius, { lengthBonus }) : null;
    return contact ? [{ side, flipper, contact }] : [];
  });
}

export function selectDrainRecoveryCandidate(candidates = []) {
  return selectEarliestFlipperContact(candidates);
}

// Keep launch/contact evidence separate from the collision query.
// tuning probes deterministic without teaching the renderer how to infer
// response quality from pixels.
export function summarizeFlipperContact({ side = 'unknown', held = false, beforeVelocity = { x: 0, y: 0 }, afterVelocity = { x: 0, y: 0 }, contact = null } = {}) {
  const speed = velocity => Math.hypot(
    Number.isFinite(velocity?.x) ? velocity.x : 0,
    Number.isFinite(velocity?.y) ? velocity.y : 0
  );
  const beforeSpeed = speed(beforeVelocity);
  const afterSpeed = speed(afterVelocity);
  return {
    side,
    mode: held ? 'catch' : 'launch',
    beforeSpeed,
    afterSpeed,
    speedDelta: afterSpeed - beforeSpeed,
    impactSpeed: Number.isFinite(contact?.impactSpeed) ? contact.impactSpeed : 0,
    impactEnergy: Number.isFinite(contact?.impactEnergy) ? contact.impactEnergy : 0,
    impulseMagnitude: Math.hypot(contact?.impulse?.x || 0, contact?.impulse?.y || 0)
  };
}

// Aggregate real contacts without mixing catch events into launch tuning. The
// result is intentionally descriptive: it does not alter the collision solver.
export function summarizeFlipperContactSeries(samples = [], { source = null } = {}) {
  const launches = samples.filter(sample => sample?.mode === 'launch' && (!source || sample.source === source));
  if (!launches.length) return {
    count: 0,
    meanAfterSpeed: 0,
    meanSpeedDelta: 0,
    minSpeedDelta: 0,
    maxSpeedDelta: 0,
    peakImpactSpeed: 0
  };
  const speedDeltas = launches.map(sample => Number.isFinite(sample.speedDelta) ? sample.speedDelta : 0);
  return {
    count: launches.length,
    meanAfterSpeed: launches.reduce((sum, sample) => sum + (Number.isFinite(sample.afterSpeed) ? sample.afterSpeed : 0), 0) / launches.length,
    meanSpeedDelta: speedDeltas.reduce((sum, delta) => sum + delta, 0) / launches.length,
    minSpeedDelta: Math.min(...speedDeltas),
    maxSpeedDelta: Math.max(...speedDeltas),
    peakImpactSpeed: Math.max(...launches.map(sample => Number.isFinite(sample.impactSpeed) ? sample.impactSpeed : 0))
  };
}

// Keep provenance visible when a review capture and ordinary play are compared
// in the same run. Empty buckets are included deliberately so a missing live
// sample cannot be mistaken for fixture data.
export function summarizeFlipperContactSources(samples = [], { sources = ['live', 'fixture'] } = {}) {
  // Keep the expected provenance contract visible even before a live sample
  // exists; an absent bucket must not look like unrecorded instrumentation.
  const knownSources = [...new Set([
    ...sources.filter(Boolean),
    ...samples.map(sample => sample?.source).filter(Boolean)
  ])];
  return Object.fromEntries(knownSources.map(source => [source, summarizeFlipperContactSeries(samples, { source })]));
}

export { segmentAt as flipperSegmentAt };
