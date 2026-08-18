import assert from 'node:assert/strict';
import {
  FIXED_DT,
  MATERIALS,
  createBall,
  addElementStack,
  decayElementStacks,
  damageFromContact,
  integrateBall,
  resolveContact,
  resolveHybrid,
  advanceFlipperMotor,
  impactEnergyFromMassSpeed,
  materialHardness,
  applyImpulse,
  calibrateContactResponse,
  calibrateMovingSurfaceResponse
} from '../src/physics-core.mjs';

const approx = (actual, expected, tolerance = 1e-6) => {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} was not within ${tolerance} of ${expected}`);
};

{
  const ball = createBall({ mass: 1, x: 0, y: 0 });
  integrateBall(ball, { gravity: { x: 0, y: 9.81 }, dt: 0.5 });
  approx(ball.position.y, 2.4525, 0.01);
}

{
  const ball = createBall({ mass: 1, vx: 0, vy: -2 });
  const contact = resolveContact({ ball, surface: { material: 'stone' }, point: { x: 0, y: 0 }, normal: { x: 0, y: -1 } });
  assert.equal(contact.separating, true);
  assert.equal(contact.impactEnergy, 0);
  approx(ball.velocity.y, -2);
}

{
  const ball = createBall({ mass: 1, vx: 0, vy: -5 });
  const contact = resolveContact({ ball, surface: { material: 'rubber' }, point: { x: 0, y: 0 }, normal: { x: 0, y: 1 } });
  assert.equal(contact.separating, false);
  assert.ok(contact.impactEnergy > 0);
  assert.ok(ball.velocity.y > 0);
  assert.ok(ball.velocity.y < 5);
  assert.equal(contact.materialA, 'steel');
  assert.equal(contact.materialB, 'rubber');
}

{
  const ball = createBall({ mass: 0.032, vx: 0, vy: -6 });
  const contact = resolveContact({ ball, surface: { material: 'timber' }, point: { x: 0, y: 0 }, normal: { x: 0, y: 1 } });
  const plain = damageFromContact(contact, { objectMaterial: 'timber', threshold: 1.2, damageScale: 1 });
  const fire = damageFromContact(contact, { objectMaterial: 'timber', threshold: 1.2, weaknesses: { Fire: 2 }, elementEffects: { Fire: { stacks: 3 } } });
  assert.ok(fire > plain);
}

assert.equal(MATERIALS.steel.restitution < 1, true);
assert.equal(FIXED_DT, 1 / 120);
assert.equal(impactEnergyFromMassSpeed(.012, 10), .6);
assert.equal(materialHardness('timber'), MATERIALS.timber.hardness);

{
  const samples = calibrateContactResponse({ speeds: [1, 2, 3] });
  assert.deepEqual(samples.map(sample => sample.incomingSpeed), [1, 2, 3]);
  assert.ok(samples.every(sample => sample.impactSpeed === sample.incomingSpeed));
  assert.ok(samples.every(sample => Math.abs(sample.responseRatio - MATERIALS.steel.restitution) < 1e-9));
  assert.ok(samples[0].outgoingSpeed < samples[1].outgoingSpeed);
  assert.ok(samples[1].outgoingSpeed < samples[2].outgoingSpeed);
}

{
  const samples = calibrateMovingSurfaceResponse({ speeds: [4], surfaceSpeeds: [0, 2] });
  assert.deepEqual(samples.map(sample => sample.surfaceSpeed), [0, 2]);
  assert.ok(samples.every(sample => Math.abs(sample.responseRatio - MATERIALS.steel.restitution) < 1e-9));
  assert.ok(samples[1].impactSpeed > samples[0].impactSpeed);
  assert.ok(samples[1].outgoingSpeed > samples[0].outgoingSpeed);
  assert.ok(samples[1].relativeOutgoingSpeed > samples[0].relativeOutgoingSpeed);
}

{
  const light = createBall({ mass: 1 });
  const heavy = createBall({ mass: 2 });
  applyImpulse(light, { x: 4, y: -2 });
  applyImpulse(heavy, { x: 4, y: -2 });
  assert.deepEqual(light.velocity, { x: 4, y: -2 });
  assert.deepEqual(heavy.velocity, { x: 2, y: -1 });
  applyImpulse(heavy, { x: Number.NaN, y: Number.POSITIVE_INFINITY });
  assert.deepEqual(heavy.velocity, { x: 2, y: -1 });
}

{
  const effects = {};
  addElementStack(effects, 'Fire', 5, 3, 10);
  addElementStack(effects, 'Water', 1, 3, 4);
  assert.equal(effects.Fire.stacks, 3);
  assert.deepEqual(resolveHybrid(effects), { id: 'steam-fracture', elements: ['Fire', 'Water'] });
  decayElementStacks(effects, 4);
  assert.equal(effects.Water, undefined);
  assert.equal(effects.Fire.stacks, 3);
  decayElementStacks(effects, 6);
  assert.equal(effects.Fire, undefined);
}

{
  const effects = {};
  addElementStack(effects, 'Unknown', 1);
  assert.deepEqual(effects, {});
}

{
  const motor = { angle: 0, restAngle: 0, activeAngle: -0.7, angularVelocity: 0, inertia: 0.25, stiffness: 26, damping: 6, maxTorque: 12, maxSpeed: 15 };
  const before = motor.angle;
  const first = advanceFlipperMotor(motor, true, 1 / 120);
  assert.ok(first.angle < before);
  assert.ok(first.angularVelocity < 0);
  for (let step = 0; step < 60; step += 1) advanceFlipperMotor(motor, true, 1 / 120);
  assert.ok(Math.abs(motor.angle - motor.activeAngle) < 0.08);
  const beforeReleaseVelocity = motor.angularVelocity;
  const release = advanceFlipperMotor(motor, false, 1 / 120);
  assert.ok(release.angularVelocity > beforeReleaseVelocity);
}

console.log('physics-core: all deterministic tests passed');
