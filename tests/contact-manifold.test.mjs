import test from 'node:test';
import assert from 'node:assert/strict';
import { collectRuntimeContactCandidates, contactTiming, normalizeContactCandidate, selectEarliestContact, summarizeContactManifold } from '../src/contact-manifold.js';

test('cross-family manifold selects the earliest valid normalized contact', () => {
  const candidates = [
    normalizeContactCandidate({ t: .42, payload: 'rail' }, { kind: 'segment', order: 'segment' }),
    normalizeContactCandidate({ t: .18, payload: 'flipper' }, { kind: 'flipper', order: 'flipper' }),
    normalizeContactCandidate({ t: .31, payload: 'bumper' }, { kind: 'circle', order: 'circle' })
  ];
  assert.equal(selectEarliestContact(candidates).payload, 'flipper');
  assert.equal(contactTiming(selectEarliestContact(candidates)), .18);
});

test('cross-family manifold uses stable order for equal timing and ignores invalid raw candidates', () => {
  const winner = selectEarliestContact([
    { t: .3, payload: 'segment', kind: 'segment', order: 'segment' },
    { t: .3, payload: 'circle', kind: 'circle', order: 'circle' },
    { t: 1.4, kind: 'invalid' },
    { t: -0.2, kind: 'invalid' },
    null
  ]);
  assert.equal(winner.payload, 'circle');
  assert.deepEqual(summarizeContactManifold([
    { t: .3, kind: 'circle' },
    { t: .6, kind: 'segment' },
    { t: 2, kind: 'ignored' }
  ]), { candidateCount: 2, earliestT: .3, kinds: ['circle', 'segment'] });
});


test('normalization clamps timing without mutating the source candidate', () => {
  const source = { t: 1.4, payload: 'late' };
  const normalized = normalizeContactCandidate(source, { kind: 'circle' });
  assert.equal(normalized.t, 1);
  assert.equal(source.t, 1.4);
  assert.equal(normalizeContactCandidate({ payload: 'missing' }), null);
});

test('runtime adapter exposes one comparable candidate per geometry family', () => {
  const segment = { swept: { t: .44, payload: 'rail' } };
  const candidates = collectRuntimeContactCandidates({
    circle: { swept: { t: .27, payload: 'bumper' } },
    segment,
    flipper: { contact: { t: .12, payload: 'blade' } }
  });
  assert.deepEqual(candidates.map(candidate => candidate.kind), ['circle', 'segment', 'flipper']);
  assert.equal(selectEarliestContact(candidates).payload, 'blade');
  assert.equal(segment.swept.t, .44);
});

for (const path of ['../src/contact-manifold.js']) {
  await import(path);
}

