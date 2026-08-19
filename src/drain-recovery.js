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
