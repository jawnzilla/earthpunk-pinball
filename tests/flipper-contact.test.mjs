import test from 'node:test';
import assert from 'node:assert/strict';
import { collectDrainRecoveryCandidates, selectDrainRecoveryCandidate, selectEarliestFlipperContact, shortestAngularDelta, sweptFlipperContact, sweptSegmentContact, summarizeFlipperContact, summarizeFlipperContactSeries, summarizeFlipperContactSources } from '../src/flipper-contact.js';

test('moving flipper query detects a ball at an intermediate angle once', () => {
  const flipper = {
    pivotX: 100,
    pivotY: 100,
    length: 100,
    width: 17,
    previousAngle: 0,
    angle: 1.2
  };
  const ball = { prevX: 166, prevY: 145, x: 166, y: 145 };
  const first = sweptFlipperContact(ball, flipper, 8);
  const second = sweptFlipperContact(ball, flipper, 8);
  assert.ok(first, 'the intermediate swept flipper pose should contact the ball');
  assert.deepEqual(second, first, 'the pure query should be deterministic and side-effect free');
  assert.ok(first.t >= 0 && first.t <= 1, 'flipper contacts must expose normalized combined timing');
  assert.equal(first.segment.material, 'rubber');
});

test('moving flipper query does not tunnel across a large angular sweep', () => {
  const flipper = {
    pivotX: 100,
    pivotY: 100,
    length: 100,
    width: 17,
    previousAngle: 0,
    angle: 3
  };
  const ball = { prevX: 154, prevY: 184, x: 154, y: 184 };
  const hit = sweptFlipperContact(ball, flipper, 8);
  assert.ok(hit, 'a stationary ball in the swept arc must not be skipped');
  assert.ok(hit.t >= 0 && hit.t <= 1, 'rotating-only contacts must expose normalized pose timing');
});

test('rotating flipper follows the short arc across the angle seam', () => {
  const delta = shortestAngularDelta(Math.PI - 0.05, -Math.PI + 0.05);
  assert.ok(Math.abs(delta - 0.1) < 1e-9, `expected a 0.1 radian seam crossing, got ${delta}`);
  const flipper = {
    pivotX: 100,
    pivotY: 100,
    length: 100,
    width: 17,
    previousAngle: Math.PI - 0.05,
    angle: -Math.PI + 0.05
  };
  const hit = sweptFlipperContact({ prevX: 0, prevY: 100, x: 0, y: 100 }, flipper, 8);
  assert.ok(hit, 'the seam-crossing blade should still contact its equivalent pose');
  assert.ok(hit.t >= 0 && hit.t <= 1);
});

test('swept segment rejects a path that misses and detects a crossing path', () => {
  const segment = { x1: 100, y1: 100, x2: 200, y2: 100 };
  assert.equal(sweptSegmentContact({ prevX: 120, prevY: 40, x: 120, y: 60 }, segment, 8), null);
  const hit = sweptSegmentContact({ prevX: 120, prevY: 40, x: 120, y: 160 }, segment, 8);
  assert.ok(hit);
  assert.equal(hit.x, 120);
  assert.ok(hit.y > 90 && hit.y < 110);
  assert.ok(hit.t > 0 && hit.t < 1, 'segment sweeps must retain first-contact timing');
});

test('swept segment catches a high-speed narrow crossing beyond the old sample cap', () => {
  const segment = { x1: 100, y1: 100, x2: 200, y2: 100 };
  const hit = sweptSegmentContact({ prevX: 150, prevY: -250, x: 150, y: 350 }, segment, 8);
  assert.ok(hit, 'a 600px fixed-step crossing must not tunnel through a narrow rail');
  assert.ok(hit.y > 90 && hit.y < 110);
});

test('swept segment reports the earliest TOI for a crossing beyond the sample cap', () => {
  const segment = { x1: 100, y1: 100, x2: 200, y2: 100 };
  const hit = sweptSegmentContact({ prevX: 150, prevY: -250, x: 150, y: 850 }, segment, 8);
  assert.ok(hit, 'an 1100px fixed-step crossing must not tunnel through a narrow rail');
  assert.ok(hit.t > 0 && hit.t < 1, 'analytic contact must retain normalized timing');
  assert.ok(Math.abs(hit.y - 92) < 0.001, `expected first contact near y=92, got ${hit.y}`);
});

test('stationary ball and stationary flipper do not manufacture contact', () => {
  const flipper = { pivotX: 0, pivotY: 0, length: 100, width: 17, angle: 0, previousAngle: 0 };
  assert.equal(sweptFlipperContact({ prevX: 50, prevY: 50, x: 50, y: 50 }, flipper, 8), null);
});

test('flipper candidate selector chooses earliest timing with stable tie break', () => {
  const right = { side: 'right', contact: { t: .35 } };
  const left = { side: 'left', contact: { t: .35 } };
  const late = { side: 'left', contact: { t: .8 } };
  assert.equal(selectEarliestFlipperContact([late, right, left]), left);
  assert.equal(selectEarliestFlipperContact([]), null);
  assert.equal(selectEarliestFlipperContact([{ side: 'left', contact: null }]), null);
});

test('drain recovery gathers both flippers and selects one deterministic winner', () => {
  const ball = { prevX: 150, prevY: 520, x: 180, y: 548 };
  const flippers = {
    left: { pivotX: 140, pivotY: 540, length: 42, width: 12, previousAngle: -.4, angle: .2 },
    right: { pivotX: 220, pivotY: 540, length: 42, width: 12, previousAngle: Math.PI + .4, angle: Math.PI - .2 }
  };
  const candidates = collectDrainRecoveryCandidates(ball, flippers, 12);
  assert.ok(candidates.length >= 1);
  assert.equal(selectDrainRecoveryCandidate(candidates), selectEarliestFlipperContact(candidates));
  assert.ok(selectDrainRecoveryCandidate(candidates).contact.t >= 0);
});

test('flipper telemetry reports response in stable units', () => {
  const summary = summarizeFlipperContact({
    side: 'left',
    held: false,
    beforeVelocity: { x: 0, y: -240 },
    afterVelocity: { x: 180, y: -420 },
    contact: { impactSpeed: 2.4, impactEnergy: 0.09, impulse: { x: 0.05, y: -0.1 } }
  });
  assert.equal(summary.side, 'left');
  assert.equal(summary.mode, 'launch');
  assert.equal(summary.beforeSpeed, 240);
  assert.ok(summary.afterSpeed > 456 && summary.afterSpeed < 457);
  assert.equal(summary.impactSpeed, 2.4);
  assert.equal(summary.impactEnergy, 0.09);
  assert.ok(summary.impulseMagnitude > 0.111 && summary.impulseMagnitude < 0.112);
  assert.equal(summary.speedDelta, summary.afterSpeed - summary.beforeSpeed);
});

test('flipper telemetry aggregates launches and ignores catches', () => {
  const report = summarizeFlipperContactSeries([
    { mode: 'catch', afterSpeed: 10, speedDelta: 10, impactSpeed: 8 },
    { mode: 'launch', afterSpeed: 400, speedDelta: 120, impactSpeed: 3 },
    { mode: 'launch', afterSpeed: 500, speedDelta: 180, impactSpeed: 5 }
  ]);
  assert.equal(report.count, 2);
  assert.equal(report.meanAfterSpeed, 450);
  assert.equal(report.meanSpeedDelta, 150);
  assert.equal(report.minSpeedDelta, 120);
  assert.equal(report.maxSpeedDelta, 180);
  assert.equal(report.peakImpactSpeed, 5);
  assert.deepEqual(summarizeFlipperContactSeries([]), {
    count: 0,
    meanAfterSpeed: 0,
    meanSpeedDelta: 0,
    minSpeedDelta: 0,
    maxSpeedDelta: 0,
    peakImpactSpeed: 0
  });
});

test('flipper telemetry can separate live play from review fixtures', () => {
  const samples = [
    { mode: 'launch', source: 'live', afterSpeed: 420, speedDelta: 90, impactSpeed: 2 },
    { mode: 'launch', source: 'fixture', afterSpeed: 600, speedDelta: 220, impactSpeed: 4 }
  ];
  assert.equal(summarizeFlipperContactSeries(samples, { source: 'live' }).meanSpeedDelta, 90);
  assert.equal(summarizeFlipperContactSeries(samples, { source: 'fixture' }).meanSpeedDelta, 220);
});

test('flipper telemetry exposes independent provenance buckets', () => {
  const reports = summarizeFlipperContactSources([
    { mode: 'launch', source: 'live', afterSpeed: 420, speedDelta: 90, impactSpeed: 2 },
    { mode: 'catch', source: 'live', afterSpeed: 10, speedDelta: 10, impactSpeed: 8 },
    { mode: 'launch', source: 'fixture', afterSpeed: 600, speedDelta: 220, impactSpeed: 4 }
  ]);
  assert.deepEqual(Object.keys(reports), ['live', 'fixture']);
  assert.equal(reports.live.count, 1);
  assert.equal(reports.live.meanSpeedDelta, 90);
  assert.equal(reports.fixture.count, 1);
  assert.equal(reports.fixture.meanSpeedDelta, 220);
});

test('flipper telemetry keeps missing provenance visible as an empty bucket', () => {
  const reports = summarizeFlipperContactSources([]);
  assert.deepEqual(Object.keys(reports), ['live', 'fixture']);
  assert.equal(reports.live.count, 0);
  assert.equal(reports.fixture.count, 0);
});
