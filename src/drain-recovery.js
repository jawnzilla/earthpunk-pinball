// Renderer-independent drain outcome policy. Contact selection stays separate;
// this seam owns only the state transition after no recovery flipper wins.
export function decideDrainRecoveryOutcome({ candidate = null, tableKind = 'standard', immortal = false, stability = 1, charge = 0 } = {}) {
  if (candidate) return { kind: 'flipper', candidate };
  if (tableKind === 'free') return { kind: 'free-pass', stabilityDelta: 0, chargeDelta: 0.5 };
  if (immortal) return { kind: 'immortal', stabilitySet: null, chargeDelta: 0 };
  const nextStability = stability - 1;
  return {
    kind: nextStability <= 0 ? 'loss' : 'recover',
    stabilityDelta: -1,
    chargeDelta: -Math.min(Math.max(0, Math.floor(charge)), 1),
    nextStability,
    nextCharge: Math.max(0, Math.floor(charge) - 1)
  };
}

// Headless state application for the live drain seam. Keeping this separate
// from DOM/game-loop code makes the recovery contract executable in tests.
export function applyDrainRecoveryOutcome({ outcome, stability = 1, stabilityMax = 3, charge = 0 } = {}) {
  if (!outcome || outcome.kind === 'flipper') return { stability, charge };
  if (outcome.kind === 'free-pass') return { stability, charge: Math.min(99, charge + outcome.chargeDelta) };
  if (outcome.kind === 'immortal') return { stability: stabilityMax, charge };
  return { stability: outcome.nextStability, charge: outcome.nextCharge };
}

// The emergency opening is queried after the primary manifold. Expose the
// selected blade's normalized contact time so the caller can replay the
// remainder of the same fixed step instead of ending motion at the rescue.
export function drainRecoveryResidualFraction(candidate = null) {
  return Number.isFinite(candidate?.contact?.t)
    ? Math.max(0, Math.min(1, candidate.contact.t))
    : 1;
}

// Keep the fixed-step remainder calculation renderer-independent so a drain
// fixture can prove that rescue contact does not discard the rest of the step.
export function drainRecoveryResidualDt(dt = 0, candidate = null) {
  const safeDt = Number.isFinite(dt) ? Math.max(0, dt) : 0;
  return safeDt * (1 - drainRecoveryResidualFraction(candidate));
}

// Complete renderer-independent decision/application seam for the late drain.
// The selected contact remains an action for the caller; it must not consume
// stability or charge merely because the emergency query found a blade.
export function resolveDrainRecovery({ candidate = null, tableKind = 'standard', immortal = false, stability = 1, stabilityMax = 3, charge = 0 } = {}) {
  const outcome = decideDrainRecoveryOutcome({ candidate, tableKind, immortal, stability, charge });
  return { outcome, state: applyDrainRecoveryOutcome({ outcome, stability, stabilityMax, charge }), residualFraction: drainRecoveryResidualFraction(candidate) };
}
