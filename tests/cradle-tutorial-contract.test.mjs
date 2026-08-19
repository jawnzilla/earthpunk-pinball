import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
assert.match(source, /firstRunCradleTutorialSeen\(\)/);
assert.match(source, /deadlight-cradle-tutorial:v1/);
assert.match(source, /function drawCradleTutorial\(\)/);
assert.match(source, /HOLD HINGE/);
assert.match(source, /CHARGE IMPRINT/);
assert.match(source, /drawCradleTutorial\(\);/);
assert.match(source, /tutorialSeen: firstRunCradleTutorialSeen\(\)/);
assert.match(source, /completeFirstRunCradleTutorial\(\)/);
assert.match(source, /Hinge charged\. Release to launch the probe\./);
assert.match(source, /leftHit && leftEnteredCradle\) \{ imprintFromHinge\('left'\); completeFirstRunCradleTutorial\(\); \}/);
assert.match(source, /rightHit && rightEnteredCradle\) \{ imprintFromHinge\('right'\); completeFirstRunCradleTutorial\(\); \}/);
console.log('cradle-tutorial-contract: first-run hinge cue and completion persistence present');
