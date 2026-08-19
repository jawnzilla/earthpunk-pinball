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

// Complete renderer-independent decision/application seam for the late drain.
// The selected contact remains an action for the caller; it must not consume
// stability or charge merely because the emergency query found a blade.
export function resolveDrainRecovery({ candidate = null, tableKind = 'standard', immortal = false, stability = 1, stabilityMax = 3, charge = 0 } = {}) {
  const outcome = decideDrainRecoveryOutcome({ candidate, tableKind, immortal, stability, charge });
  return { outcome, state: applyDrainRecoveryOutcome({ outcome, stability, stabilityMax, charge }) };
}
