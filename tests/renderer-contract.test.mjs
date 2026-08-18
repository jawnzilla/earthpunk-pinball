import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
assert.match(source, /function drawTargetMaterialCue\(target, index\)/);
assert.match(source, /ctx\.strokeStyle = '#0d1211'/);
assert.match(source, /drawTargetMaterialCue\(target, index\);/);
assert.match(source, /family === 0/);
assert.match(source, /family === 1/);
assert.match(source, /ctx\.strokeRect\(-target\.r \* \.66/);
console.log('renderer-contract: target material cues present');