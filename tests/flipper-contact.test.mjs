import test from 'node:test';
import assert from 'node:assert/strict';
import { sweptFlipperContact, sweptSegmentContact } from '../src/flipper-contact.js';

test('moving flipper query detects a ball at an intermediate angle once', () => {
  const flipper = {
    pivotX: 100,
    pivotY: 100,
    length: 100,
    width: 17,
    previousAngle: 0,
    angle: 1.2
  };
  const ball = { prevX: 166, prevY: 145, x: 166, y: 145 };
  const first = sweptFlipperContact(ball, flipper, 8);
  const second = sweptFlipperContact(ball, flipper, 8);
  assert.ok(first, 'the intermediate swept flipper pose should contact the ball');
  assert.deepEqual(second, first, 'the pure query should be deterministic and side-effect free');
  assert.equal(first.segment.material, 'rubber');
});

test('swept segment rejects a path that misses and detects a crossing path', () => {
  const segment = { x1: 100, y1: 100, x2: 200, y2: 100 };
  assert.equal(sweptSegmentContact({ prevX: 120, prevY: 40, x: 120, y: 60 }, segment, 8), null);
  const hit = sweptSegmentContact({ prevX: 120, prevY: 40, x: 120, y: 160 }, segment, 8);
  assert.ok(hit);
  assert.equal(hit.x, 120);
  assert.ok(hit.y > 90 && hit.y < 110);
});

test('stationary ball and stationary flipper do not manufacture contact', () => {
  const flipper = { pivotX: 0, pivotY: 0, length: 100, width: 17, angle: 0, previousAngle: 0 };
  assert.equal(sweptFlipperContact({ prevX: 50, prevY: 50, x: 50, y: 50 }, flipper, 8), null);
});
