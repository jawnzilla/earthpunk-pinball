import test from 'node:test';
import assert from 'node:assert/strict';
import { collectDrainRecoveryCandidates, selectDrainRecoveryCandidate } from '../src/flipper-contact.js';
import { applyDrainRecoveryOutcome, decideDrainRecoveryOutcome, drainRecoveryResidualDt, drainRecoveryResidualFraction, resolveDrainRecovery } from '../src/drain-recovery.js';

test('drain outcome preserves a selected flipper winner as the first action', () => {
  const candidate = { side: 'right', contact: { t: 0.2 } };
  assert.deepEqual(decideDrainRecoveryOutcome({ candidate }), { kind: 'flipper', candidate });
});

test('complete drain resolution keeps selected flipper recovery state-owned', () => {
  const candidate = { side: 'left', contact: { t: 0.4 } };
  assert.deepEqual(resolveDrainRecovery({ candidate, stability: 1, stabilityMax: 3, charge: 2.8 }), {
    outcome: { kind: 'flipper', candidate },
    state: { stability: 1, charge: 2.8 },
    residualFraction: 0.4
  });
});

test('drain recovery exposes bounded residual replay timing only for a selected contact', () => {
  assert.equal(drainRecoveryResidualFraction({ contact: { t: 0.25 } }), 0.25);
  assert.equal(drainRecoveryResidualFraction({ contact: { t: 4 } }), 1);
  assert.equal(drainRecoveryResidualFraction({ contact: { t: -1 } }), 0);
  assert.equal(drainRecoveryResidualFraction(null), 1);
});

test('headless drain fixture preserves recovery state and replays the opening remainder', () => {
  const candidate = { side: 'left', contact: { t: 0.25 } };
  const resolution = resolveDrainRecovery({ candidate, stability: 2, stabilityMax: 3, charge: 1.8 });
  assert.deepEqual(resolution.state, { stability: 2, charge: 1.8 });
  assert.equal(drainRecoveryResidualDt(1 / 60, candidate), (1 / 60) * 0.75);
  assert.equal(drainRecoveryResidualDt(1 / 60, null), 0);
});

test('runtime opening fixture selects the earliest real blade and preserves cradle state through replay', () => {
  const ball = { prevX: 150, prevY: 520, x: 180, y: 548, cradleSide: 'right' };
  const flippers = {
    left: { pivotX: 140, pivotY: 540, length: 42, width: 12, previousAngle: -.4, angle: .2 },
    right: { pivotX: 220, pivotY: 540, length: 42, width: 12, previousAngle: Math.PI + .4, angle: Math.PI - .2 }
  };
  const candidates = collectDrainRecoveryCandidates(ball, flippers, 12);
  const candidate = selectDrainRecoveryCandidate(candidates);
  assert.ok(candidates.length >= 1, 'the late opening trajectory must reach at least one blade');
  assert.ok(candidate, 'the deterministic opening resolver must select a blade');
  assert.ok(candidate.contact.t >= 0 && candidate.contact.t <= 1);

  const resolution = resolveDrainRecovery({ candidate, stability: 2, stabilityMax: 3, charge: 2.4 });
  assert.equal(resolution.outcome.kind, 'flipper');
  assert.deepEqual(resolution.state, { stability: 2, charge: 2.4 });
  assert.equal(drainRecoveryResidualDt(1 / 60, candidate), (1 / 60) * (1 - candidate.contact.t));
  assert.equal(ball.cradleSide, 'right', 'recovery selection must not erase existing cradle ownership');
});

test('complete drain resolution applies ordinary recovery state', () => {
  assert.deepEqual(resolveDrainRecovery({ stability: 3, stabilityMax: 3, charge: 2.8 }), {
    outcome: { kind: 'recover', stabilityDelta: -1, chargeDelta: -1, nextStability: 2, nextCharge: 1 },
    state: { stability: 2, charge: 1 },
    residualFraction: 1
  });
});

test('free tables recover without consuming stability and add half charge', () => {
  assert.deepEqual(decideDrainRecoveryOutcome({ tableKind: 'free', stability: 2, charge: 4 }), {
    kind: 'free-pass', stabilityDelta: 0, chargeDelta: 0.5
  });
});

test('immortal tables recover without consuming stability', () => {
  assert.deepEqual(decideDrainRecoveryOutcome({ immortal: true, stability: 1, charge: 2 }), {
    kind: 'immortal', stabilitySet: null, chargeDelta: 0
  });
});

test('standard drain decrements one stability and floors one charge', () => {
  assert.deepEqual(decideDrainRecoveryOutcome({ stability: 3, charge: 2.8 }), {
    kind: 'recover', stabilityDelta: -1, chargeDelta: -1, nextStability: 2, nextCharge: 1
  });
});

test('last standard stability is classified as loss', () => {
  assert.equal(decideDrainRecoveryOutcome({ stability: 1, charge: 0 }).kind, 'loss');
});

test('headless drain fixture applies each non-flipper outcome without renderer state', () => {
  const free = decideDrainRecoveryOutcome({ tableKind: 'free', stability: 2, charge: 4 });
  assert.deepEqual(applyDrainRecoveryOutcome({ outcome: free, stability: 2, charge: 4 }), { stability: 2, charge: 4.5 });

  const immortal = decideDrainRecoveryOutcome({ immortal: true, stability: 1, charge: 2 });
  assert.deepEqual(applyDrainRecoveryOutcome({ outcome: immortal, stability: 1, stabilityMax: 3, charge: 2 }), { stability: 3, charge: 2 });

  const recover = decideDrainRecoveryOutcome({ stability: 3, charge: 2.8 });
  assert.deepEqual(applyDrainRecoveryOutcome({ outcome: recover, stability: 3, charge: 2.8 }), { stability: 2, charge: 1 });

  const loss = decideDrainRecoveryOutcome({ stability: 1, charge: 0 });
  assert.deepEqual(applyDrainRecoveryOutcome({ outcome: loss, stability: 1, charge: 0 }), { stability: 0, charge: 0 });
});
