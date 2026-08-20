import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveDestructibleContact } from '../src/destructible-contact.js';

const item = (overrides = {}) => ({
  material: 'timber', damageScale: 13, threshold: 1.2, weaknesses: { Fire: 2 },
  integrity: 18, maxIntegrity: 18, damageCooldown: 0, destroyed: false,
  salvageValue: 55, salvageCharge: .35, ...overrides
});
const resolver = (_contact, options) => options.elementEffects.Fire?.stacks ? 7 : 3;
const contact = { hit: true, impactSpeed: 3, materialA: 'steel' };

test('rejects separating or cooldown contacts without changing reward state', () => {
  assert.equal(resolveDestructibleContact(item({ damageCooldown: 4 }), contact, { damageResolver: resolver }).accepted, false);
  assert.equal(resolveDestructibleContact(item(), { ...contact, separating: true }, { damageResolver: resolver }).reason, 'blocked');
  assert.equal(resolveDestructibleContact(item(), { ...contact, impactSpeed: 1 }, { damageResolver: () => 0 }).reason, 'below-threshold');
});

test('applies deterministic elemental damage and advances one integrity stage', () => {
  const result = resolveDestructibleContact(item(), contact, {
    damageResolver: resolver,
    elementEffects: { Fire: { stacks: 3, timer: 120 } }
  });
  assert.deepEqual(result, {
    accepted: true, damage: 7, integrity: 11, damageStage: 2, damageCooldown: 8,
    destroyedNow: false, salvageValue: 0, salvageCharge: 0, reason: 'damaged'
  });
});

test('applies steam hybrid multiplier and pays salvage exactly on destruction', () => {
  const result = resolveDestructibleContact(item({ integrity: 5 }), contact, {
    elementalEvent: { type: 'steam-fracture', damageMultiplier: 1.35 },
    damageResolver: resolver
  });
  assert.ok(Math.abs(result.damage - 4.05) < 1e-9);
  assert.equal(result.destroyedNow, false);
  const destroyed = resolveDestructibleContact(item({ integrity: 3 }), contact, { damageResolver: resolver });
  assert.equal(destroyed.destroyedNow, true);
  assert.equal(destroyed.damageStage, 3);
  assert.equal(destroyed.salvageValue, 55);
  assert.equal(destroyed.salvageCharge, .35);
  const second = resolveDestructibleContact(item({ integrity: 0, destroyed: true }), contact, { damageResolver: resolver });
  assert.equal(second.salvageValue, 0);
});

test('applies thermal lance multiplier to the contact that creates the burn echo', () => {
  const result = resolveDestructibleContact(item({ integrity: 5 }), contact, {
    elementalEvent: { type: 'thermal-lance', damageMultiplier: 1.2 },
    damageResolver: resolver
  });
  assert.ok(Math.abs(result.damage - 3.6) < 1e-9);
  assert.equal(result.destroyedNow, false);
});

console.log('destructible-contact: threshold, elemental, cooldown, stage, and exactly-once reward contracts passed');
