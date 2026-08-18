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
  resolveHybrid
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

console.log('physics-core: all deterministic tests passed');
