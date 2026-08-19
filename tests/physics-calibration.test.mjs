import assert from 'node:assert/strict';
import test from 'node:test';
import { runPhysicsCalibration } from '../src/physics-calibration.mjs';

test('physics calibration fixture reports deterministic samples and passes all gates', () => {
  const report = runPhysicsCalibration();
  assert.deepEqual(Object.keys(report.gates), [
    'noManufacturedEnergy',
    'monotonicResponse',
    'rubberBouncier',
    'movingFlipperBoost',
    'damageThreshold',
    'speedCap'
  ]);
  assert.ok(Object.values(report.gates).every(Boolean), JSON.stringify(report.gates));
  assert.equal(report.samples.contact.length, 3);
  assert.equal(report.samples.flipper.length, 2);
  assert.equal(report.samples.damage.belowThreshold, 0);
  assert.ok(report.samples.damage.aboveThreshold > 0);
  assert.ok(report.samples.contact.every(sample => sample.outgoingSpeed <= 6));
  assert.ok(report.samples.flipper[1].impactSpeed > report.samples.flipper[0].impactSpeed);
});

test('calibration fixture is repeatable JSON-like data', () => {
  assert.deepEqual(runPhysicsCalibration(), runPhysicsCalibration());
});

console.log('physics-calibration: deterministic response, damage, and speed gates passed');