import test from 'node:test';
import assert from 'node:assert/strict';
import { collectBoundaryContactCandidates } from '../src/boundary-contact.js';
import { collectRuntimeContactCandidates, selectEarliestContact } from '../src/contact-manifold.js';

test('boundary candidates report only penetrated edges with deterministic timing', () => {
  const candidates = collectBoundaryContactCandidates(
    { x: 10, y: 12, r: 4 },
    { left: 18, right: 342, top: 18 }
  );
  assert.deepEqual(candidates.map(candidate => candidate.edge), ['left', 'top']);
  assert.equal(candidates[0].t, 1);
  assert.equal(candidates[0].penetration, 12);
  assert.deepEqual(candidates[1].normal, { x: 0, y: 1 });
});

test('interior swept contacts beat end-of-step boundary recovery', () => {
  const boundaries = collectBoundaryContactCandidates({ x: 10, y: 200, r: 4 }, { left: 18, right: 342, top: 18 });
  const candidates = collectRuntimeContactCandidates({ circle: { swept: { t: .42 } }, boundaries });
  assert.equal(selectEarliestContact(candidates).kind, 'circle');
});