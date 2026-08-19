# Physics V2 calibration gate

Status: implementation-ready next slice; no gameplay tuning changed in this tick.

## Why this is the next safe slice

The production path now carries mass, material, relative surface velocity, impact speed, and impact energy through contact resolution. Destructible damage consumes that contact result, while the live table remains intentionally tuned through pixel-space legacy constants. The next bounded change should calibrate those two layers against each other before adding more force sources or visual effects.

This is a tuning/evidence slice, not a new mechanic. It must preserve the current 120 Hz fixed step, swept-contact paths, flipper input, route progression, and elemental rules.

## Current source-of-truth values

From `src/physics-core.js`:

- fixed step: `1/120 s`
- steel: density `7850`, restitution `0.62`, friction `0.18`, hardness `1.00`, drag `0.002`
- rubber: restitution `0.88`, friction `0.72`, hardness `0.35`, drag `0.010`
- timber: restitution `0.28`, friction `0.62`, hardness `0.42`, drag `0.012`
- stone: restitution `0.18`, friction `0.78`, hardness `0.88`, drag `0.018`
- copper: restitution `0.48`, friction `0.32`, hardness `0.72`, drag `0.004`
- water: restitution `0.06`, friction `0.12`, hardness `0.05`, drag `0.080`

The steel ball's default mass is `0.032 kg`. Contact damage is zero below the object threshold and otherwise scales from impact energy, impact speed, ball hardness, object hardness, and active elemental weakness.

## One-variable implementation plan

1. Add a renderer-independent calibration fixture that samples the existing `calibrateContactResponse()` and `calibrateFlipperContactResponse()` seams at the current gameplay speed bands.
2. Record incoming speed, impact speed, outgoing speed, response ratio, impulse magnitude, and impact energy as JSON-like deterministic output. Do not expose it in normal HUD.
3. Compare the measured bands against explicit gates:
   - no stationary/parallel contact manufactures impact energy;
   - outgoing speed is monotonic with incoming speed;
   - rubber response is bouncier than timber and stone;
   - moving flipper contact increases impact speed versus the stationary equivalent;
   - damage remains zero below threshold and positive above threshold;
   - no sample exceeds the live speed cap after the renderer handoff.
4. Only after the fixture is green, tune one material or force constant at a time. Each tuning commit must include before/after numbers and a portrait browser smoke test.

## Evidence required to close the slice

- focused deterministic test is red against the missing calibration fixture, then green;
- full `npm test` is green;
- `node --check` for every changed module and `git diff --check` are green;
- hosted `?review=depth` and `?review=destruction-run` checks pass at exact `320x568` and `390x844`, with no overflow or browser/request errors;
- no claim of final feel or AAA readiness until an observed human-steered run confirms the calibrated bands in motion.

## Explicit non-goals

Do not add a second quick-sim physics model, increase the fixed timestep, replace swept queries with unbounded sampling, add persistent screen flash, or expand the HUD. This gate exists to reduce tuning drift before the next first-principles force/material change.
