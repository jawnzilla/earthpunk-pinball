import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
assert.match(source, /function drawTargetMaterialCue\(target, index\)/);
assert.match(source, /ctx\.strokeStyle = '#0d1211'/);
assert.match(source, /drawTargetMaterialCue\(target, index\);/);
assert.match(source, /family === 0/);
assert.match(source, /family === 1/);
assert.match(source, /ctx\.strokeRect\(-target\.r \* \.66/);
assert.match(source, /function activateFlipperContactReviewFixture\(\)/);
assert.match(source, /const fixtureNormal = \{ x: Math\.sin\(flipper\.angle\), y: -Math\.cos\(flipper\.angle\) \}/);
assert.match(source, /flipper\.angularVelocity = -8/);
assert.match(source, /contactPoint\.x \+ fixtureNormal\.x \* 12/);
assert.match(source, /review=flipper-contact/);
assert.match(source, /activateFlipperContactReviewFixture\(\);/);
assert.ok(source.indexOf('syncPixelsFromPhysics(ball); ball.lastContact = contact; observeHardBounce(ball, contact); ball.lastFlipperLaunchFactor = .18 + projection * .82; capBallSpeed(ball); state.lastFlipperContact = summarizeFlipperContact') >= 0,
  'flipper telemetry must summarize the capped live velocity');
console.log('renderer-contract: target material cues and flipper review fixture present');