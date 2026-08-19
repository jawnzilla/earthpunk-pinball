// Renderer-independent ordering for contacts that come from different geometry
// families. Resolvers remain owned by the caller; this helper only chooses the
// earliest normalized candidate and never mutates simulation state.
export function selectEarliestContact(candidates = []) {
  const valid = candidates.filter(candidate => Number.isFinite(candidate?.t) && candidate.t >= 0 && candidate.t <= 1);
  if (!valid.length) return null;
  return valid.reduce((earliest, candidate) => {
    if (!earliest) return candidate;
    if (candidate.t < earliest.t) return candidate;
    if (candidate.t > earliest.t) return earliest;
    return String(candidate.order ?? candidate.kind ?? '') < String(earliest.order ?? earliest.kind ?? '') ? candidate : earliest;
  }, null);
}

export function normalizeContactCandidate(candidate, { kind = 'unknown', order = kind } = {}) {
  if (!candidate || !Number.isFinite(candidate.t)) return null;
  return { ...candidate, kind, order, t: Math.max(0, Math.min(1, candidate.t)) };
}

export function contactTiming(candidate) {
  return Number.isFinite(candidate?.t) ? candidate.t : null;
}

export function summarizeContactManifold(candidates = []) {
  const valid = candidates.filter(candidate => Number.isFinite(candidate?.t) && candidate.t >= 0 && candidate.t <= 1);
  return {
    candidateCount: valid.length,
    earliestT: valid.length ? Math.min(...valid.map(candidate => candidate.t)) : null,
    kinds: [...new Set(valid.map(candidate => candidate.kind || 'unknown'))]
  };
}

// Adapt the three live geometry families to one common, non-mutating view.
// The caller still owns resolution; this seam makes it possible to compare
// circle, static-segment, and rotating-flipper timing before a future dispatch
// packet changes ball state.
export function collectRuntimeContactCandidates({ circle = null, segment = null, flipper = null, boundaries = [] } = {}) {
  return [
    normalizeContactCandidate(circle?.swept || circle, { kind: 'circle', order: 'circle' }),
    normalizeContactCandidate(segment?.swept || segment, { kind: 'segment', order: 'segment' }),
    normalizeContactCandidate(flipper?.contact || flipper, { kind: 'flipper', order: 'flipper' }),
    ...boundaries.map(boundary => normalizeContactCandidate(boundary, { kind: 'boundary', order: boundary.order || `boundary-${boundary.edge || 'unknown'}` }))
  ].filter(Boolean);
}
