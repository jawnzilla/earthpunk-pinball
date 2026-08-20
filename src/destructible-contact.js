export function resolveDestructibleContact(item, contact, {
  elementalEvent = { type: 'none' },
  damageResolver,
  elementEffects = {}
} = {}) {
  if (!item || item.destroyed || item.damageCooldown > 0 || contact?.separating) {
    return { accepted: false, damage: 0, destroyedNow: false, salvageValue: 0, salvageCharge: 0, reason: 'blocked' };
  }
  const damage = damageResolver(contact, {
    objectMaterial: item.material,
    damageScale: item.damageScale,
    threshold: item.threshold,
    weaknesses: item.weaknesses,
    elementEffects
  });
  const finalDamage = ['steam-fracture', 'thermal-lance'].includes(elementalEvent.type)
    ? damage * elementalEvent.damageMultiplier
    : damage;
  if (finalDamage <= 0) return { accepted: false, damage: 0, destroyedNow: false, reason: 'below-threshold' };

  const integrity = Math.max(0, item.integrity - finalDamage);
  const destroyedNow = integrity <= 0;
  const damageStage = destroyedNow
    ? 3
    : Math.min(2, Math.floor((1 - integrity / item.maxIntegrity) * 3) + 1);
  return {
    accepted: true,
    damage: finalDamage,
    integrity,
    damageStage,
    damageCooldown: 8,
    destroyedNow,
    salvageValue: destroyedNow ? item.salvageValue : 0,
    salvageCharge: destroyedNow ? item.salvageCharge : 0,
    reason: destroyedNow ? 'destroyed' : 'damaged'
  };
}

// Fire III trail ticks are a small, reward-free pressure source rather than a
// second collision. Keep the policy deterministic and material-aware so the
// runtime adapter can apply it without inventing another damage model.
export function resolveFireTrailDamage({ maxIntegrity = 0, damageScale = 1, objectMaterial = 'timber', weaknesses = {}, elementEffects = {}, damageCap = .08 } = {}) {
  if (!Number.isFinite(maxIntegrity) || maxIntegrity <= 0) return { damage: 0, materialFactor: 0, elementFactor: 0 };
  const materialFactor = objectMaterial === 'timber' ? 1.25 : objectMaterial === 'stone' ? .55 : objectMaterial === 'copper' ? .8 : 1;
  const fireStacks = Math.max(0, elementEffects.Fire?.stacks ?? 0);
  const elementFactor = 1 + fireStacks * Math.max(0, (weaknesses.Fire ?? 1) - 1) * .35;
  const rawDamage = Math.max(0, damageScale) * .18 * materialFactor * elementFactor;
  return { damage: Math.min(maxIntegrity * Math.max(0, damageCap), rawDamage), materialFactor, elementFactor };
}
