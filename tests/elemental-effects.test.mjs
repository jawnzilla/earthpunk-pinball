import assert from 'node:assert/strict';
import {
  ELEMENTAL_BUDGETS,
  advanceElementalBodyResidual,
  advanceElementalRuntime,
  checkEarthLinkCrossing,
  createElementalRuntime,
  consumeRootSling,
  consumeSlurryBind,
  consumeSteamPressure,
  onHardBounce,
  onMiniBallBounce,
  onMiniBallContact,
  onMiniBallStructureContact,
  onStructureContact,
  onWindEchoStructureContact,
  resolveElementalBodyContact,
  resolveMiniBallStructureDamage,
  resolveWindEchoStructureDamage,
  selectEarliestSweptContact,
  sweptCircleContact,
  rewindElementalBodyToContact
} from '../src/elemental-effects.mjs';

const effects = (element, stacks) => ({ [element]: { stacks, timer: 360 } });
const step = (runtime, elementEffects, position, velocity, count, dt = 1 / 120) => {
  const events = [];
  for (let index = 0; index < count; index += 1) events.push(...advanceElementalRuntime(runtime, { effects: elementEffects, position: { x: position.x + index * velocity.x * dt, y: position.y + index * velocity.y * dt }, velocity, dt }));
  return events;
};

{
  const runtime = createElementalRuntime();
  assert.deepEqual(runtime, { fireTrail: [], thermalLanceTrail: [], miniBalls: [], waterSplitUsed: false, windEcho: null, earthHits: [], earthLink: null, rootSling: null, slurryBind: null, steamPressure: null, hybridUsed: new Set() });
  assert.equal(ELEMENTAL_BUDGETS.fire.maxSegments, 12);
  assert.equal(ELEMENTAL_BUDGETS.water.maxBounces, 3);
  assert.equal(ELEMENTAL_BUDGETS.wind.maxDistance, 900);
  assert.equal(ELEMENTAL_BUDGETS.earth.linkLifetime, .9);
}

{
  const runtime = createElementalRuntime();
  const earthWind = { Earth: { stacks: 3 }, Wind: { stacks: 3 } };
  const event = onStructureContact(runtime, { effects: earthWind, objectId: 'crate-root', position: { x: 12, y: 34 }, normal: { x: 3, y: 4 } });
  assert.deepEqual(event, { type: 'root-sling', objectId: 'crate-root', assist: 1.2 });
  assert.deepEqual(runtime.rootSling, { objectId: 'crate-root', x: 0.6, y: 0.8, assist: 1.2 });
  onStructureContact(runtime, { effects: earthWind, objectId: 'crate-second', position: { x: 40, y: 50 }, normal: { x: -1, y: 0 } });
  assert.deepEqual(runtime.rootSling, { objectId: 'crate-root', x: 0.6, y: 0.8, assist: 1.2 });
  const consumed = consumeRootSling(runtime, { mass: .032 });
  assert.equal(consumed.objectId, 'crate-root');
  assert.ok(Math.abs(consumed.impulse.x - .02304) < 1e-12);
  assert.ok(Math.abs(consumed.impulse.y - .03072) < 1e-12);
  assert.equal(consumed.assist, 1.2);
  assert.equal(runtime.rootSling, null);
  assert.equal(consumeRootSling(runtime, { mass: .032 }), null);
}

{
  const runtime = createElementalRuntime();
  const waterEarth = { Water: { stacks: 3 }, Earth: { stacks: 3 } };
  assert.deepEqual(onStructureContact(runtime, { effects: waterEarth, objectId: 'copper-pipe', material: 'copper' }), { type: 'slurry-bind', objectId: 'copper-pipe', response: 'redirect' });
  assert.deepEqual(runtime.slurryBind, { objectId: 'copper-pipe', pending: false });
  assert.deepEqual(onStructureContact(runtime, { effects: waterEarth, objectId: 'stone-plug', material: 'stone', normal: { x: 0, y: -1 } }), { type: 'slurry-bind-contact', objectId: 'stone-plug', redirect: true });
  assert.equal(consumeSlurryBind(runtime, { material: 'stone', velocity: { x: 3, y: 4 }, normal: { x: 0, y: -1 } }).tangentVelocity.y, 0);
  assert.equal(consumeSlurryBind(runtime, { material: 'stone', velocity: { x: 3, y: 4 }, normal: { x: 0, y: -1 } }), null);
}

{
  const runtime = createElementalRuntime();
  const fireWater = { Fire: { stacks: 3 }, Water: { stacks: 3 } };
  assert.deepEqual(onStructureContact(runtime, { effects: fireWater, objectId: 'pipe-steam', normal: { x: 3, y: 4 } }), { type: 'steam-fracture', objectId: 'pipe-steam', damageMultiplier: 1.35, extraTick: true });
  assert.deepEqual(runtime.steamPressure, { objectId: 'pipe-steam', x: .6, y: .8, speed: .9 });
  const pulse = consumeSteamPressure(runtime, { mass: .032 });
  assert.equal(pulse.objectId, 'pipe-steam');
  assert.ok(Math.abs(pulse.impulse.x - .01728) < 1e-12);
  assert.ok(Math.abs(pulse.impulse.y - .02304) < 1e-12);
  assert.equal(consumeSteamPressure(runtime, { mass: .032 }), null);
}

{
  const runtime = createElementalRuntime();
  const fireEffects = effects('Fire', 3);
  const events = step(runtime, fireEffects, { x: 0, y: 0 }, { x: 180, y: 0 }, 36);
  assert.ok(runtime.fireTrail.length <= 12);
  assert.ok(runtime.fireTrail.length > 0);
  assert.ok(events.some(event => event.type === 'fire-trail-tick'));
  step(runtime, fireEffects, { x: 0, y: 0 }, { x: 180, y: 0 }, 100);
  assert.ok(runtime.fireTrail.every(segment => segment.age <= .75));
}

{
  const runtime = createElementalRuntime();
  const waterEffects = effects('Water', 3);
  const first = onHardBounce(runtime, { effects: waterEffects, position: { x: 10, y: 20 }, velocity: { x: 120, y: -240 }, impactSpeed: 2.1 });
  assert.equal(first.type, 'water-split');
  assert.equal(runtime.miniBalls.length, 2);
  assert.ok(runtime.miniBalls.every(ball => ball.bouncesRemaining === 3 && ball.lifetime === 1.25));
  advanceElementalRuntime(runtime, { effects: waterEffects, position: { x: 10, y: 20 }, velocity: { x: 0, y: 0 }, dt: .1, integrateBodies: false });
  assert.ok(runtime.miniBalls.every(ball => ball.x === 10 && ball.y === 20));
  assert.ok(runtime.miniBalls.every(ball => ball.distance > 10));
  assert.equal(onHardBounce(runtime, { effects: waterEffects, position: { x: 10, y: 20 }, velocity: { x: 120, y: -240 }, impactSpeed: 3 }).type, 'none');
  assert.equal(onMiniBallBounce(runtime, runtime.miniBalls[0].id).bouncesRemaining, 2);
  advanceElementalRuntime(runtime, { effects: waterEffects, position: { x: 10, y: 20 }, velocity: { x: 0, y: 0 }, dt: 1.25 });
  assert.equal(runtime.miniBalls.length, 0);
}

{
  const runtime = createElementalRuntime();
  const waterEffects = effects('Water', 3);
  onHardBounce(runtime, { effects: waterEffects, position: { x: 10, y: 20 }, velocity: { x: -120, y: 0 }, impactSpeed: 2.1 });
  const ball = runtime.miniBalls[0];
  const first = onMiniBallContact(runtime, ball.id, { normal: { x: 1, y: 0 }, contactKey: 'left-wall' });
  assert.equal(first.counted, true);
  assert.equal(ball.bouncesRemaining, 2);
  assert.ok(ball.vx > 0);
  assert.ok(Math.abs(ball.physicsBody.velocity.x - ball.vx / 100) < 1e-9);
  assert.equal(onMiniBallContact(runtime, ball.id, { normal: { x: 1, y: 0 }, contactKey: 'left-wall' }), null);
  ball.vx = 120;
  assert.equal(onMiniBallContact(runtime, ball.id, { normal: { x: 1, y: 0 }, contactKey: 'separating' }).counted, false);
  assert.equal(ball.bouncesRemaining, 2);
}

{
  const miniBall = { x: 0, y: 0, vx: -120, vy: 18, mass: .008, radius: .045, material: 'water' };
  const contact = resolveElementalBodyContact(miniBall, { x: 1, y: 0 }, { restitution: .42 });
  assert.equal(contact.separating, false);
  assert.ok(contact.impactEnergy > 0);
  assert.ok(miniBall.vx > 0);
  assert.equal(miniBall.physicsBody.material, 'water');
  assert.ok(Math.abs(miniBall.vx - 50.4) < 1e-9, `override restitution should return 50.4 px/s, got ${miniBall.vx}`);
}

{
  const runtime = createElementalRuntime();
  onHardBounce(runtime, { effects: effects('Water', 3), position: { x: 10, y: 20 }, velocity: { x: 120, y: 0 }, impactSpeed: 2.1 });
  const ball = runtime.miniBalls[0];
  const startX = ball.x;
  advanceElementalRuntime(runtime, { effects: effects('Water', 3), position: { x: 10, y: 20 }, velocity: { x: 0, y: 0 }, dt: .1 });
  assert.ok(ball.x > startX);
  assert.ok(Math.abs(ball.physicsBody.position.x - ball.x / 100) < 1e-9);
  assert.ok(Math.abs(ball.physicsBody.velocity.x - ball.vx / 100) < 1e-9);
}

{
  const runtime = createElementalRuntime();
  onHardBounce(runtime, { effects: effects('Water', 3), position: { x: 10, y: 20 }, velocity: { x: -120, y: 0 }, impactSpeed: 2.1 });
  const ball = runtime.miniBalls[0];
  const hit = onMiniBallStructureContact(runtime, ball.id, { objectId: 'timber-crate', position: { x: 10, y: 20 }, normal: { x: 1, y: 0 } });
  assert.equal(hit.type, 'mini-ball-structure-contact');
  assert.equal(hit.structure.type, 'none');
  assert.ok(hit.impactSpeed > .8);
  assert.equal(ball.bouncesRemaining, 2);
  assert.equal(onMiniBallStructureContact(runtime, ball.id, { objectId: 'timber-crate', normal: { x: 1, y: 0 } }), null);
}

{
  const below = resolveMiniBallStructureDamage({ impactSpeed: 1.1, impactEnergy: 10, threshold: 1.2, maxIntegrity: 20, damageScale: 10, objectMaterial: 'timber' });
  assert.equal(below.damage, 0);
  const timber = resolveMiniBallStructureDamage({ impactSpeed: 3, impactEnergy: 20, threshold: 1.2, maxIntegrity: 100, damageScale: 1, objectMaterial: 'timber', elementEffects: { Water: { stacks: 3 } }, weaknesses: { Water: .8 } });
  const stone = resolveMiniBallStructureDamage({ impactSpeed: 3, impactEnergy: 20, threshold: 1.2, maxIntegrity: 100, damageScale: 1, objectMaterial: 'stone' });
  assert.ok(timber.materialFactor > stone.materialFactor);
  assert.ok(timber.damage < 22);
  const capped = resolveMiniBallStructureDamage({ impactSpeed: 100, impactEnergy: 1e9, threshold: 1, maxIntegrity: 10, damageScale: 100, objectMaterial: 'timber' });
  assert.equal(capped.damage, 2.2);
  const weakness = resolveMiniBallStructureDamage({ impactSpeed: 3, impactEnergy: 20, threshold: 1.2, maxIntegrity: 100, damageScale: 1, objectMaterial: 'copper', elementEffects: { Water: { stacks: 3 } }, weaknesses: { Water: 2 } });
  assert.equal(weakness.elementFactor, 2.5);
}

{
  const runtime = createElementalRuntime();
  const windEffects = effects('Wind', 3);
  const echoEvent = onHardBounce(runtime, { effects: windEffects, position: { x: 0, y: 0 }, velocity: { x: 300, y: -40 }, impactSpeed: 2.4 });
  assert.equal(echoEvent.type, 'wind-echo');
  assert.equal(runtime.windEcho.ignoredResponses, 1);
  const first = onStructureContact(runtime, { effects: windEffects, objectId: 'crate-a', position: { x: 20, y: 10 } });
  assert.equal(first.ignoreResponse, true);
  assert.equal(first.counted, true);
  const duplicate = onStructureContact(runtime, { effects: windEffects, objectId: 'crate-a', position: { x: 20, y: 10 } });
  assert.equal(duplicate.counted, false);
  advanceElementalRuntime(runtime, { effects: windEffects, position: { x: 0, y: 0 }, velocity: { x: 0, y: 0 }, dt: 1.5 });
  assert.equal(runtime.windEcho, null);
}

{
  const runtime = createElementalRuntime();
  onHardBounce(runtime, { effects: effects('Wind', 3), position: { x: 0, y: 0 }, velocity: { x: 300, y: 0 }, impactSpeed: 2.4 });
  const first = onWindEchoStructureContact(runtime, { objectId: 'crate-a', position: { x: 20, y: 0 }, normal: { x: -1, y: 0 } });
  assert.equal(first.ignoreResponse, true);
  assert.ok(first.impactEnergy > 0);
  assert.equal(onWindEchoStructureContact(runtime, { objectId: 'crate-a', normal: { x: -1, y: 0 } }), null);
  const timber = resolveWindEchoStructureDamage({ impactSpeed: 3, impactEnergy: 20, threshold: 1.2, maxIntegrity: 100, damageScale: 1, objectMaterial: 'timber' });
  const stone = resolveWindEchoStructureDamage({ impactSpeed: 3, impactEnergy: 20, threshold: 1.2, maxIntegrity: 100, damageScale: 1, objectMaterial: 'stone' });
  assert.ok(timber.materialFactor > stone.materialFactor);
  assert.ok(resolveWindEchoStructureDamage({ impactSpeed: 100, impactEnergy: 1e9, threshold: 1, maxIntegrity: 10, damageScale: 100 }).damage <= 1.8);
}

{
  const runtime = createElementalRuntime();
  onHardBounce(runtime, { effects: effects('Wind', 3), position: { x: 0, y: 0 }, velocity: { x: 300, y: 0 }, impactSpeed: 2.4 });
  const separating = onWindEchoStructureContact(runtime, { objectId: 'crate-a', normal: { x: 1, y: 0 } });
  assert.equal(separating.type, 'wind-echo-separating-contact');
  assert.equal(separating.counted, false);
  assert.equal(runtime.windEcho.hitObjects.has('crate-a'), false);
  const impact = onWindEchoStructureContact(runtime, { objectId: 'crate-a', normal: { x: -1, y: 0 } });
  assert.equal(impact.type, 'wind-echo-structure-contact');
  assert.equal(impact.counted, true);
}

{
  const runtime = createElementalRuntime();
  const earthEffects = effects('Earth', 3);
  onStructureContact(runtime, { effects: earthEffects, objectId: 'crate-a', position: { x: 20, y: 40 } });
  const second = onStructureContact(runtime, { effects: earthEffects, objectId: 'plug-b', position: { x: 80, y: 40 } });
  assert.equal(second.type, 'earth-link');
  assert.deepEqual(runtime.earthLink.objects, ['crate-a', 'plug-b']);
  const powered = checkEarthLinkCrossing(runtime, { x: 50, y: 80 }, { x: 50, y: 0 });
  assert.equal(powered.powerMultiplier, ELEMENTAL_BUDGETS.earth.powerMultiplier);
  assert.equal(checkEarthLinkCrossing(runtime, { x: 50, y: 80 }, { x: 50, y: 0 }).powerMultiplier, 1);
}

{
  const runtime = createElementalRuntime();
  const hybridEffects = { Fire: { stacks: 1 }, Water: { stacks: 1 }, Earth: { stacks: 1 }, Wind: { stacks: 1 } };
  assert.deepEqual(onStructureContact(runtime, { effects: hybridEffects, objectId: 'pipe-a' }), { type: 'steam-fracture', objectId: 'pipe-a', damageMultiplier: 1.35, extraTick: true });
  assert.equal(onStructureContact(runtime, { effects: hybridEffects, objectId: 'pipe-b' }).type, 'slurry-bind');
  assert.equal(onStructureContact(runtime, { effects: hybridEffects, objectId: 'pipe-c' }).type, 'root-sling');
  assert.deepEqual(onStructureContact(runtime, { effects: hybridEffects, objectId: 'pipe-d', position: { x: 12, y: 34 } }), { type: 'thermal-lance', objectId: 'pipe-d', burnEcho: true });
  assert.deepEqual(runtime.thermalLanceTrail, [{ x: 12, y: 34, age: 0, lifetime: .65 }]);
  advanceElementalRuntime(runtime, { effects: hybridEffects, position: { x: 0, y: 0 }, velocity: { x: 0, y: 0 }, dt: .65, integrateBodies: false });
  assert.equal(runtime.thermalLanceTrail.length, 0);
  assert.equal(onStructureContact(runtime, { effects: hybridEffects, objectId: 'pipe-e' }).type, 'none');
  const wind = createElementalRuntime();
  const echo = onHardBounce(wind, { effects: { Fire: { stacks: 1 }, Wind: { stacks: 3 } }, position: { x: 0, y: 0 }, velocity: { x: 100, y: 0 }, impactSpeed: 2 });
  assert.equal(echo.type, 'wind-echo');
  assert.equal(wind.windEcho.burnTrail, true);
}

{
  const swept = sweptCircleContact({ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 50, y: 0 }, 4);
  assert.equal(swept.hit, true);
  assert.ok(swept.t > 0 && swept.t < 1);
  assert.ok(Math.abs(swept.t - 0.46) < 1e-9, `expected first entry at t=.46, got ${swept.t}`);
  assert.equal(swept.normal.x, -1);
  assert.equal(sweptCircleContact({ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 50, y: 0 }, 4).hit, false);
}

{
  const runtime = createElementalRuntime();
  onHardBounce(runtime, { effects: effects('Water', 3), position: { x: 0, y: 0 }, velocity: { x: 600, y: 0 }, impactSpeed: 2.1 });
  const ball = runtime.miniBalls[0];
  advanceElementalRuntime(runtime, { effects: effects('Water', 3), position: { x: 0, y: 0 }, velocity: { x: 0, y: 0 }, dt: 1 / 60 });
  const swept = sweptCircleContact({ x: ball.previousX, y: ball.previousY }, { x: ball.x, y: ball.y }, { x: 5, y: 0 }, ball.radius + 2);
  assert.equal(swept.hit, true);
  assert.equal(rewindElementalBodyToContact(ball, swept, 2), true);
  assert.ok(Math.abs(ball.x - (swept.point.x + swept.normal.x * 2)) < 1e-9);
  assert.ok(Math.abs(ball.physicsBody.position.x - ball.x / 100) < 1e-9);
}

{
  const runtime = createElementalRuntime();
  onHardBounce(runtime, { effects: effects('Water', 3), position: { x: 0, y: 0 }, velocity: { x: 600, y: 0 }, impactSpeed: 2.1 });
  const ball = runtime.miniBalls[0];
  advanceElementalRuntime(runtime, { effects: effects('Water', 3), position: { x: 0, y: 0 }, velocity: { x: 0, y: 0 }, dt: 1 / 60 });
  const before = ball.x;
  assert.ok(advanceElementalBodyResidual(ball, 1 / 60, .25) > 0);
  assert.ok(ball.x > before);
  assert.equal(advanceElementalBodyResidual(ball, 1 / 60, 1), 0);
}

{
  const near = { id: 'near', swept: { hit: true, t: 0.2 } };
  const far = { id: 'far', swept: { hit: true, t: 0.8 } };
  const miss = { id: 'miss', swept: { hit: false, t: 0.01 } };
  assert.equal(selectEarliestSweptContact([far, miss, near]), near);
  assert.equal(selectEarliestSweptContact([]), null);
}

console.log('elemental-effects: all deterministic tests passed');
