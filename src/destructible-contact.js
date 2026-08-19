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
  const finalDamage = elementalEvent.type === 'steam-fracture'
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
