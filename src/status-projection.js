const ELEMENT_ORDER = ['Fire', 'Water', 'Wind', 'Air', 'Earth'];
const ELEMENT_SYMBOLS = { Fire: '△', Water: '▽', Wind: '≈', Air: '≈', Earth: '◆' };

function canonicalElement(element) {
  return element === 'Air' ? 'Wind' : element;
}

/**
 * Project the run's active status into one bounded, renderer-neutral list.
 * Imprints are the most actionable state, followed by installed hinges and
 * finally the boss integrity readout. Both canvas and DOM consume this list.
 */
export function projectActiveStatus({ hingeElements = {}, hingeLevels = {}, elementEffects = {}, boss = {} } = {}) {
  const entries = [];
  const seen = new Set();
  for (const rawElement of ELEMENT_ORDER) {
    const element = canonicalElement(rawElement);
    if (seen.has(element)) continue;
    const effect = elementEffects[element] || elementEffects[rawElement];
    if (!effect || effect.stacks <= 0 || effect.timer <= 0) continue;
    seen.add(element);
    entries.push({ kind: 'imprint', key: element, label: element, symbol: ELEMENT_SYMBOLS[element], value: Math.max(0, Math.min(3, effect.stacks)), title: `Active ${element} imprint, ${Math.max(0, Math.min(3, effect.stacks))} of 3 stacks` });
  }
  for (const side of ['left', 'right']) {
    const rawElement = hingeElements[side];
    if (!rawElement || entries.length >= 2) continue;
    const element = canonicalElement(rawElement);
    entries.push({ kind: 'hinge', key: `${side}-${element}`, label: `${side[0].toUpperCase()} ${element}`, symbol: side === 'left' ? '◁' : '▷', value: Math.max(0, Math.min(3, hingeLevels[side] || 0)), title: `${side} hinge: ${element} stack ${hingeLevels[side] || 0}` });
  }
  if (boss.active && entries.length < 2) entries.push({ kind: 'boss', key: 'boss', label: 'WARDEN', symbol: '◎', value: `${boss.hp}/${boss.maxHp}`, title: 'Warden armor integrity' });
  return entries.slice(0, 2);
}
