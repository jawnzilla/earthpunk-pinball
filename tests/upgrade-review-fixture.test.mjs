import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('upgrade review fixture is opt-in and routes through the real renderer', async () => {
  const source = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(source, /get\('review'\) !== 'upgrade'/);
  assert.match(source, /showModuleChoices\(\);\s*overlay\.dataset\.reviewFixture = 'upgrade'/);
  assert.match(source, /reset\(\); activateUpgradeReviewFixture\(\); loop\(\);/);
  assert.match(source, /grid-template-rows: repeat\(4, minmax\(58px, 104px\)\)/);
});
