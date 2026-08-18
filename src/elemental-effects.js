const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const magnitude = vector => Math.hypot(vector.x, vector.y);
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const cross = (a, b) => a.x * b.y - a.y * b.x;
import { createBall, impactEnergyFromMassSpeed, materialHardness, resolveContact } from './physics-core.js';

export const ELEMENTAL_BUDGETS = Object.freeze({
  fire: Object.freeze({ maxSegments: 12, lifetime: .75, tickInterval: .1, spacing: 9 }),
  water: Object.freeze({ maxBalls: 2, maxBounces: 3, lifetime: 1.25, splitSpeedScale: .72, spreadRadians: .34 }),
  wind: Object.freeze({ maxDistance: 900, lifetime: 1.5, maxHitsPerObject: 1 }),
  earth: Object.freeze({ linkLifetime: .9, powerMultiplier: 1.35 })
});

let nextMiniBallId = 1;

const activeStacks = (effects, element) => Math.max(0, effects?.[element]?.stacks ?? 0);

export function createElementalRuntime() {
  return { fireTrail: [], miniBalls: [], waterSplitUsed: false, windEcho: null, earthHits: [], earthLink: null, hybridUsed: new Set() };
}

const hybridFor = (runtime, effects, objectId) => {
  const active = element => activeStacks(effects, element) > 0;
  const candidates = [
    ['steam-fracture', ['Fire', 'Water'], { objectId, damageMultiplier: 1.35, extraTick: true }],
    ['slurry-bind', ['Water', 'Earth'], { objectId, redirect: true }],
    ['root-sling', ['Earth', 'Wind'], { objectId, impulseAssist: true }],
    ['thermal-lance', ['Fire', 'Wind'], { objectId, burnEcho: true }]
  ];
  const match = candidates.find(([id, elements]) => !runtime.hybridUsed.has(id) && elements.every(active));
  if (!match) return null;
  runtime.hybridUsed.add(match[0]);
  return { type: match[0], ...match[2] };
};

const hasPair = (effects, a, b) => activeStacks(effects, a) > 0 && activeStacks(effects, b) > 0;

function addFireTrail(runtime, effects, position) {
  const stacks = activeStacks(effects, 'Fire');
  if (stacks < 2 || !position || !Number.isFinite(position.x) || !Number.isFinite(position.y)) return;
  const last = runtime.fireTrail[runtime.fireTrail.length - 1];
  if (last && distance(last, position) < ELEMENTAL_BUDGETS.fire.spacing) return;
  runtime.fireTrail.push({ x: position.x, y: position.y, age: 0, tickTimer: ELEMENTAL_BUDGETS.fire.tickInterval, damageEnabled: stacks >= 3 });
  while (runtime.fireTrail.length > ELEMENTAL_BUDGETS.fire.maxSegments) runtime.fireTrail.shift();
}

function advanceFireTrail(runtime, effects, dt, events) {
  const stacks = activeStacks(effects, 'Fire');
  runtime.fireTrail.forEach(segment => {
    segment.age += dt;
    if (stacks >= 3) {
      segment.tickTimer -= dt;
      while (segment.tickTimer <= 0) {
        events.push({ type: 'fire-trail-tick', point: { x: segment.x, y: segment.y }, damageEnabled: true });
        segment.tickTimer += ELEMENTAL_BUDGETS.fire.tickInterval;
      }
    }
  });
  runtime.fireTrail = runtime.fireTrail.filter(segment => segment.age < ELEMENTAL_BUDGETS.fire.lifetime);
}

function advanceMiniBalls(runtime, dt, integrateBodies, contactResolver) {
  runtime.miniBalls.forEach(ball => {
    ball.contactKeys = new Set();
    if (integrateBodies) { ball.x += ball.vx * dt; ball.y += ball.vy * dt; }
    if (contactResolver) contactResolver(ball);
    ball.distance += magnitude({ x: ball.vx, y: ball.vy }) * dt;
    ball.lifetime -= dt;
  });
  runtime.miniBalls = runtime.miniBalls.filter(ball => ball.lifetime > 0 && ball.bouncesRemaining > 0);
}

function advanceWindEcho(runtime, dt, integrateBodies, contactResolver) {
  const echo = runtime.windEcho;
  if (!echo) return;
  if (integrateBodies) { echo.x += echo.vx * dt; echo.y += echo.vy * dt; }
  if (contactResolver) contactResolver(echo);
  echo.distance += magnitude({ x: echo.vx, y: echo.vy }) * dt;
  echo.lifetime -= dt;
  if (echo.lifetime <= 0 || echo.distance >= ELEMENTAL_BUDGETS.wind.maxDistance) runtime.windEcho = null;
}

function advanceEarthLink(runtime, dt) {
  if (!runtime.earthLink) return;
  runtime.earthLink.lifetime -= dt;
  if (runtime.earthLink.lifetime <= 0) runtime.earthLink = null;
}

export function advanceElementalRuntime(runtime, { effects = {}, position, velocity = { x: 0, y: 0 }, dt = 0, integrateBodies = true, miniBallContactResolver = null, windEchoContactResolver = null } = {}) {
  const safeDt = Math.max(0, Number.isFinite(dt) ? dt : 0);
  const events = [];
  addFireTrail(runtime, effects, position);
  advanceFireTrail(runtime, effects, safeDt, events);
  advanceMiniBalls(runtime, safeDt, integrateBodies, miniBallContactResolver);
  advanceWindEcho(runtime, safeDt, integrateBodies, windEchoContactResolver);
  advanceEarthLink(runtime, safeDt);
  return events;
}

function rotatedVelocity(velocity, angle, speedScale) {
  const speed = magnitude(velocity) * speedScale;
  const baseAngle = Math.atan2(velocity.y, velocity.x);
  return { vx: Math.cos(baseAngle + angle) * speed, vy: Math.sin(baseAngle + angle) * speed };
}

export function onHardBounce(runtime, { effects = {}, position = { x: 0, y: 0 }, velocity = { x: 0, y: 0 }, impactSpeed = 0 } = {}) {
  const events = [];
  if (impactSpeed >= 2 && activeStacks(effects, 'Water') >= 3 && !runtime.waterSplitUsed) {
    runtime.waterSplitUsed = true;
    const spread = ELEMENTAL_BUDGETS.water.spreadRadians;
    runtime.miniBalls = [-spread, spread].map(angle => {
      const launch = rotatedVelocity(velocity, angle, ELEMENTAL_BUDGETS.water.splitSpeedScale);
      return { id: `water-mini-${nextMiniBallId++}`, x: position.x, y: position.y, ...launch, radius: .045, mass: .008, material: 'water', physicsBody: createBall({ x: position.x, y: position.y, vx: launch.vx, vy: launch.vy, mass: .008, radius: .045, material: 'water' }), lifetime: ELEMENTAL_BUDGETS.water.lifetime, bouncesRemaining: ELEMENTAL_BUDGETS.water.maxBounces, distance: 0 };
    });
    events.push({ type: 'water-split', count: runtime.miniBalls.length });
  }
  if (impactSpeed >= 2 && activeStacks(effects, 'Wind') >= 3 && !runtime.windEcho && magnitude(velocity) > 0) {
    runtime.windEcho = { id: 'wind-echo', x: position.x, y: position.y, vx: velocity.x, vy: velocity.y, mass: .012, material: 'rubber', physicsBody: createBall({ x: position.x, y: position.y, vx: velocity.x, vy: velocity.y, mass: .012, radius: .06, material: 'rubber' }), lifetime: ELEMENTAL_BUDGETS.wind.lifetime, distance: 0, ignoredResponses: 1, hitObjects: new Set(), burnTrail: hasPair(effects, 'Fire', 'Wind') };
    events.push({ type: 'wind-echo' });
  }
  return events[0] || { type: 'none' };
}

export function onMiniBallBounce(runtime, id) {
  const ball = runtime.miniBalls.find(item => item.id === id);
  if (!ball) return null;
  ball.bouncesRemaining -= 1;
  if (ball.bouncesRemaining <= 0) runtime.miniBalls = runtime.miniBalls.filter(item => item.id !== id);
  return ball;
}

// Reduced-mask response: the table adapter owns broad-phase detection while
// this module owns deterministic reflection and the three-bounce budget.
export function onMiniBallContact(runtime, id, { normal = { x: 0, y: 0 }, contactKey = 'contact', restitution = .72 } = {}) {
  const ball = runtime.miniBalls.find(item => item.id === id);
  if (!ball || !Number.isFinite(normal.x) || !Number.isFinite(normal.y)) return null;
  if (!ball.contactKeys) ball.contactKeys = new Set();
  if (ball.contactKeys.has(contactKey)) return null;
  ball.contactKeys.add(contactKey);
  const contact = resolveElementalBodyContact(ball, normal, { restitution, surfaceMaterial: 'steel' });
  if (contact.separating) return { type: 'mini-ball-separating-contact', id: ball.id, counted: false, impactSpeed: 0, impactEnergy: 0 };
  const bounced = onMiniBallBounce(runtime, id);
  return bounced
    ? { type: 'mini-ball-bounce', id, counted: true, bouncesRemaining: bounced.bouncesRemaining, impactSpeed: contact.impactSpeed, impactEnergy: contact.impactEnergy }
    : { type: 'mini-ball-bounce', id, counted: true, bouncesRemaining: 0, impactSpeed: contact.impactSpeed, impactEnergy: contact.impactEnergy };
}

// Shared Physics V2 seam for elemental bodies. The table adapter remains responsible
// for broad-phase geometry; this keeps mass/material/restitution response identical.
export function resolveElementalBodyContact(body, normal, { restitution = null, surfaceMaterial = 'steel' } = {}) {
  const physicsBody = body.physicsBody ?? createBall({ x: body.x, y: body.y, vx: body.vx, vy: body.vy, mass: body.mass ?? .01, radius: body.radius ?? .05, material: body.material ?? 'rubber' });
  physicsBody.position.x = body.x;
  physicsBody.position.y = body.y;
  physicsBody.velocity.x = body.vx;
  physicsBody.velocity.y = body.vy;
  const surface = { material: surfaceMaterial, inverseMass: 0 };
  const contact = resolveContact({ ball: physicsBody, surface, point: physicsBody.position, normal, penetration: 0 });
  body.physicsBody = physicsBody;
  body.vx = physicsBody.velocity.x;
  body.vy = physicsBody.velocity.y;
  return contact;
}

// Reduced-mask structure response: mini-balls may damage a destructible once,
// but never award score, charge, target progress, or chain hits.
export function onMiniBallStructureContact(runtime, id, { objectId, position = { x: 0, y: 0 }, normal = { x: 0, y: 0 }, contactKey = 'structure', restitution = .42 } = {}) {
  const ball = runtime.miniBalls.find(item => item.id === id);
  if (!ball || !objectId) return null;
  const response = onMiniBallContact(runtime, id, { normal, contactKey: `${contactKey}:${objectId}`, restitution });
  if (!response?.counted) return response;
  const structure = onStructureContact(runtime, { objectId, position });
  return { ...response, type: 'mini-ball-structure-contact', objectId, structure };
}

// Renderer-independent reduced-mask damage policy. Water fragments stay capped and reward-free.
export function resolveMiniBallStructureDamage({ impactSpeed = 0, impactEnergy = 0, threshold = 1.2, maxIntegrity = 0, damageScale = 1, objectMaterial = 'timber', weaknesses = {}, elementEffects = {}, ballMaterial = 'water', damageCap = .22 } = {}) {
  if (!Number.isFinite(impactSpeed) || !Number.isFinite(impactEnergy) || impactSpeed < threshold || maxIntegrity <= 0) return { damage: 0, materialFactor: 0, speedFactor: 0, elementFactor: 0 };
  const objectHardness = materialHardness(objectMaterial);
  const ballHardness = materialHardness(ballMaterial);
  const speedFactor = clamp(impactSpeed / Math.max(threshold, 1e-8), .25, 2.5);
  const materialFactor = clamp(ballHardness / Math.max(objectHardness, 1e-8), .05, 2.5);
  const elementFactor = Object.entries(elementEffects).reduce((factor, [element, effect]) => factor * (1 + Math.max(0, effect?.stacks ?? 0) * ((weaknesses[element] ?? 1) - 1) * .5), 1);
  const rawDamage = impactEnergy * damageScale * .06 * speedFactor * materialFactor * elementFactor;
  return { damage: Math.min(maxIntegrity * damageCap, Math.max(0, rawDamage)), materialFactor, speedFactor, elementFactor };
}

export function resolveWindEchoStructureDamage({ impactSpeed = 0, impactEnergy = 0, threshold = 1.4, maxIntegrity = 0, damageScale = 1, objectMaterial = 'timber', weaknesses = {}, elementEffects = {}, damageCap = .18 } = {}) {
  if (!Number.isFinite(impactSpeed) || !Number.isFinite(impactEnergy) || impactSpeed < threshold || maxIntegrity <= 0) return { damage: 0, materialFactor: 0, speedFactor: 0, elementFactor: 0 };
  const objectHardness = materialHardness(objectMaterial);
  const speedFactor = clamp(impactSpeed / Math.max(threshold, 1e-8), .25, 2.5);
  const materialFactor = clamp(.28 / Math.max(objectHardness, 1e-8), .08, 1.2);
  const elementFactor = Object.entries(elementEffects).reduce((factor, [element, effect]) => factor * (1 + Math.max(0, effect?.stacks ?? 0) * ((weaknesses[element] ?? 1) - 1) * .5), 1);
  const rawDamage = impactEnergy * damageScale * .045 * speedFactor * materialFactor * elementFactor;
  return { damage: Math.min(maxIntegrity * damageCap, Math.max(0, rawDamage)), materialFactor, speedFactor, elementFactor };
}

export function onWindEchoStructureContact(runtime, { objectId, position = { x: 0, y: 0 }, normal = { x: 0, y: 0 }, contactKey = 'structure' } = {}) {
  const echo = runtime.windEcho;
  if (!echo || !objectId || !Number.isFinite(normal.x) || !Number.isFinite(normal.y) || echo.hitObjects.has(objectId)) return null;
  echo.hitObjects.add(objectId);
  const length = Math.hypot(normal.x, normal.y) || 1;
  const nx = normal.x / length, ny = normal.y / length;
  const contact = resolveElementalBodyContact(echo, { x: nx, y: ny }, { surfaceMaterial: 'steel' });
  const impactSpeed = contact.impactSpeed;
  const ignoreResponse = echo.ignoredResponses > 0;
  if (ignoreResponse) echo.ignoredResponses -= 1;
  return { type: 'wind-echo-structure-contact', counted: true, ignoreResponse, damage: true, objectId, position: { ...position }, contactKey, impactSpeed, impactEnergy: contact.impactEnergy };
}

export function onStructureContact(runtime, { effects = {}, objectId, position = { x: 0, y: 0 } } = {}) {
  const events = [];
  const echo = runtime.windEcho;
  if (echo && objectId && !echo.hitObjects.has(objectId)) {
    echo.hitObjects.add(objectId);
    const ignoreResponse = echo.ignoredResponses > 0;
    if (ignoreResponse) echo.ignoredResponses -= 1;
    events.push({ type: 'wind-echo-contact', counted: true, ignoreResponse, damage: true, objectId });
  } else if (echo && objectId) {
    events.push({ type: 'wind-echo-contact', counted: false, ignoreResponse: false, damage: false, objectId });
  }
  if (activeStacks(effects, 'Earth') >= 3 && objectId && !runtime.earthHits.some(hit => hit.id === objectId) && runtime.earthHits.length < 2) {
    runtime.earthHits.push({ id: objectId, position: { ...position } });
    if (runtime.earthHits.length === 2) {
      runtime.earthLink = { objects: runtime.earthHits.map(hit => hit.id), a: { ...runtime.earthHits[0].position }, b: { ...runtime.earthHits[1].position }, lifetime: ELEMENTAL_BUDGETS.earth.linkLifetime, crossed: false };
      events.push({ type: 'earth-link', objects: [...runtime.earthLink.objects] });
    }
  }
  if (objectId && hasPair(effects, 'Fire', 'Water') && !runtime.hybridUsed.has('steam-fracture')) {
    runtime.hybridUsed.add('steam-fracture');
    events.push({ type: 'steam-fracture', objectId, damageMultiplier: 1.35, extraTick: true });
  } else if (objectId && hasPair(effects, 'Water', 'Earth') && !runtime.hybridUsed.has('slurry-bind')) {
    runtime.hybridUsed.add('slurry-bind');
    events.push({ type: 'slurry-bind', objectId, response: 'redirect' });
  } else if (objectId && hasPair(effects, 'Earth', 'Wind') && !runtime.hybridUsed.has('root-sling')) {
    runtime.hybridUsed.add('root-sling');
    events.push({ type: 'root-sling', objectId, assist: 1.2 });
  }
  return events[0] || { type: 'none', counted: false, ignoreResponse: false, damage: false };
}

function segmentsIntersect(a, b, c, d) {
  const ab = { x: b.x - a.x, y: b.y - a.y };
  const ac = { x: c.x - a.x, y: c.y - a.y };
  const ad = { x: d.x - a.x, y: d.y - a.y };
  const cd = { x: d.x - c.x, y: d.y - c.y };
  const ca = { x: a.x - c.x, y: a.y - c.y };
  const cb = { x: b.x - c.x, y: b.y - c.y };
  const first = cross(ab, ac) * cross(ab, ad);
  const second = cross(cd, ca) * cross(cd, cb);
  return first <= 0 && second <= 0;
}

export function checkEarthLinkCrossing(runtime, previous, current) {
  if (!runtime.earthLink || runtime.earthLink.crossed) return { powerMultiplier: 1 };
  if (!segmentsIntersect(previous, current, runtime.earthLink.a, runtime.earthLink.b)) return { powerMultiplier: 1 };
  runtime.earthLink.crossed = true;
  return { powerMultiplier: ELEMENTAL_BUDGETS.earth.powerMultiplier, objects: [...runtime.earthLink.objects] };
}
