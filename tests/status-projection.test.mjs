import assert from 'node:assert/strict';
import test from 'node:test';
import { projectActiveStatus } from '../src/status-projection.js';

test('prioritizes two active imprints and canonicalizes Air to Wind', () => {
  const entries = projectActiveStatus({
    elementEffects: {
      Fire: { stacks: 3, timer: 360 },
      Water: { stacks: 2, timer: 240 },
      Air: { stacks: 3, timer: 360 },
    },
    hingeElements: { left: 'Earth', right: 'Wind' },
    hingeLevels: { left: 2, right: 1 },
    boss: { active: true, hp: 4, maxHp: 9 },
  });
  assert.deepEqual(entries.map(entry => [entry.kind, entry.label, entry.value]), [
    ['imprint', 'Fire', 3],
    ['imprint', 'Water', 2],
  ]);
  assert.equal(entries.length, 2);
});

test('falls back to hinges, then boss, without hiding status behind prose', () => {
  const hingeEntries = projectActiveStatus({
    hingeElements: { left: 'Air', right: 'Earth' },
    hingeLevels: { left: 4, right: 1 },
  });
  assert.deepEqual(hingeEntries.map(entry => [entry.label, entry.value]), [['L Wind', 3], ['R Earth', 1]]);
  const bossEntries = projectActiveStatus({ boss: { active: true, hp: 5, maxHp: 12 } });
  assert.deepEqual(bossEntries.map(entry => [entry.kind, entry.label, entry.value]), [['boss', 'WARDEN', '5/12']]);
});

test('ignores expired or empty effects', () => {
  assert.deepEqual(projectActiveStatus({ elementEffects: { Fire: { stacks: 3, timer: 0 }, Water: { stacks: 0, timer: 100 } } }), []);
});
