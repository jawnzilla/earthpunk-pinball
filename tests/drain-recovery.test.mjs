import test from 'node:test';
import assert from 'node:assert/strict';
import { decideDrainRecoveryOutcome } from '../src/drain-recovery.js';

test('drain outcome preserves a selected flipper winner as the first action', () => {
  const candidate = { side: 'right', contact: { t: 0.2 } };
  assert.deepEqual(decideDrainRecoveryOutcome({ candidate }), { kind: 'flipper', candidate });
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
