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
  applyAngularImpulse,
  capVelocity,
  calibrateContactResponse,
  calibrateMovingSurfaceResponse,
  calibrateFlipperContactResponse
} from '../src/physics-core.mjs';

const approx = (actual, expected, tolerance = 1e-6) => {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} was not within ${tolerance} of ${expected}`);
};

{
  const malformed = createBall({ mass: -2, radius: Number.NaN, material: 'unobtanium' });
  assert.equal(malformed.mass, 0);
  assert.equal(malformed.inverseMass, 0);
  assert.equal(malformed.angularInertia, 0);
  assert.equal(malformed.radius, 0.08);
  assert.equal(malformed.material, 'steel');
}

{
  const malformedKinematics = createBall({ x: Number.NaN, y: Number.POSITIVE_INFINITY, vx: Number.NEGATIVE_INFINITY, vy: Number.NaN, rotation: Number.NaN, spin: Number.POSITIVE_INFINITY });
  assert.deepEqual(malformedKinematics.position, { x: 0, y: 0 });
  assert.deepEqual(malformedKinematics.velocity, { x: 0, y: 0 });
  assert.equal(malformedKinematics.rotation, 0);
  assert.equal(malformedKinematics.spin, 0);
}

{
  const ball = createBall({ mass: 1, x: 0, y: 0 });
  integrateBall(ball, { gravity: { x: 0, y: 9.81 }, dt: 0.5 });
  approx(ball.position.y, 2.4525, 0.01);
}

{
  const ball = createBall({ mass: 1, x: 0, y: 0 });
  integrateBall(ball, {
    force: { x: Number.NaN, y: Number.POSITIVE_INFINITY },
    gravity: { x: Number.NEGATIVE_INFINITY, y: Number.NaN },
    dt: Number.NaN
  });
  assert.ok(Number.isFinite(ball.position.x));
  assert.ok(Number.isFinite(ball.position.y));
  assert.ok(Number.isFinite(ball.velocity.x));
  assert.ok(Number.isFinite(ball.velocity.y));
  assert.deepEqual(ball.position, { x: 0, y: 0 });
  assert.deepEqual(ball.velocity, { x: 0, y: 0 });
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
  const ball = createBall({ mass: 1, radius: 0.1, x: 0, y: 0, vx: 2, vy: -5 });
  const contact = resolveContact({
    ball,
    surface: { material: 'rubber' },
    point: { x: 0, y: 0.05 },
    normal: { x: 0, y: 1 }
  });
  assert.notEqual(contact.angularImpulse, 0);
  assert.notEqual(ball.spin, 0);
  const previousSpin = ball.spin;
  applyAngularImpulse(ball, Number.NaN);
  assert.equal(ball.spin, previousSpin);
}

{
  const ball = createBall({ mass: 1, spin: 6 });
  const initialRotation = ball.rotation;
  integrateBall(ball, { gravity: { x: 0, y: 0 }, dt: 0.25 });
  assert.ok(ball.rotation > initialRotation);
  assert.ok(ball.spin < 6);
}

{
  const steel = createBall({ mass: 1, material: 'steel', spin: 6 });
  const stone = createBall({ mass: 1, material: 'stone', spin: 6 });
  integrateBall(steel, { gravity: { x: 0, y: 0 }, dt: 1 });
  integrateBall(stone, { gravity: { x: 0, y: 0 }, dt: 1 });
  assert.ok(MATERIALS.stone.rollingResistance > MATERIALS.steel.rollingResistance);
  assert.ok(stone.spin < steel.spin, 'high-resistance material must damp spin faster');
}

{
  const ball = createBall({ mass: 1, vx: 0, vy: 3 });
  const surface = createBall({ mass: 3, vx: 0, vy: 0, material: 'rubber' });
  const beforeMomentum = ball.mass * ball.velocity.y + surface.mass * surface.velocity.y;
  const contact = resolveContact({ ball, surface, point: { x: 0, y: 0 }, normal: { x: 0, y: -1 } });
  const afterMomentum = ball.mass * ball.velocity.y + surface.mass * surface.velocity.y;
  assert.equal(contact.separating, false);
  approx(afterMomentum, beforeMomentum);
  assert.ok(surface.velocity.y > 0);
}

{
  const ball = createBall({ mass: 1, x: 0, y: 0, vx: 0, vy: 3 });
  const surface = createBall({ mass: 3, x: 0, y: 0, vx: 0, vy: 0, material: 'rubber' });
  resolveContact({
    ball,
    surface,
    point: { x: 0, y: 0 },
    normal: { x: 0, y: -1 },
    penetration: 1,
    correctionPercent: 1,
    slop: 0
  });
  approx(ball.position.y, -0.75);
  approx(surface.position.y, 0.25);
}

{
  const ball = createBall({ mass: 0.032, vx: 0, vy: -6 });
  const contact = resolveContact({ ball, surface: { material: 'timber' }, point: { x: 0, y: 0 }, normal: { x: 0, y: 1 } });
  const plain = damageFromContact(contact, { objectMaterial: 'timber', threshold: 1.2, damageScale: 1 });
  const fire = damageFromContact(contact, { objectMaterial: 'timber', threshold: 1.2, weaknesses: { Fire: 2 }, elementEffects: { Fire: { stacks: 3 } } });
  assert.ok(fire > plain);
}

{
  const malformedContact = {
    hit: true,
    separating: false,
    impactSpeed: Number.POSITIVE_INFINITY,
    impactEnergy: Number.NaN,
    materialA: 'steel'
  };
  assert.equal(damageFromContact(malformedContact, {
    objectMaterial: 'unknown',
    damageScale: Number.NaN,
    threshold: Number.NaN,
    weaknesses: { Fire: Number.NaN },
    elementEffects: { Fire: { stacks: Number.POSITIVE_INFINITY } }
  }), 0);
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
  const samples = calibrateFlipperContactResponse({
    incomingNormalSpeeds: [4],
    tangentSpeeds: [0, 1],
    angularVelocities: [0, -8],
    contactPoint: { x: 0.6, y: 0 },
    pivot: { x: 0, y: 0 },
    normal: { x: 0, y: -1 }
  });
  assert.equal(samples.length, 4);
  assert.deepEqual(samples.map(sample => sample.surfaceSpeed), [0, 4.8, 0, 4.8]);
  assert.ok(samples.filter(sample => sample.tangentSpeed === 0).every(sample => Math.abs(sample.responseRatio - MATERIALS.steel.restitution) < 1e-9));
  assert.ok(samples[1].impactSpeed > samples[0].impactSpeed);
  assert.ok(samples[3].outgoingSpeed > samples[2].outgoingSpeed);
  assert.ok(samples.every(sample => sample.impulseMagnitude > 0));
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
  const capped = capVelocity({ x: 480, y: 360 }, 600);
  approx(Math.hypot(capped.x, capped.y), 600);
  approx(capped.x / capped.y, 4 / 3);
  assert.deepEqual(capVelocity({ x: Number.NaN, y: Number.POSITIVE_INFINITY }, 600), { x: 0, y: 0 });
  assert.deepEqual(capVelocity({ x: 3, y: 4 }, 600), { x: 3, y: 4 });
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
