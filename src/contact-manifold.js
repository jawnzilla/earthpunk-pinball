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
