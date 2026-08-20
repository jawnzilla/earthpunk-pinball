# Flipper Feel Calibration Packet

Status: implementation-ready canon, not a claim that the current live tuning is final.

## Scope

Measure the human-steered launch response of the existing Physics V2 flippers before changing solver constants, motor torque, or input behavior. The next implementation slice must change one variable only and preserve collision geometry, fixed timestep, and progression.

## Source of truth

- Production query: `src/flipper-contact.js::sweptFlipperContact()`.
- Production response: `index.html` flipper contact consumer and `physics-core.js` contact response.
- Fixed timestep: `FIXED_DT` in `index.html`; do not multiply the solver timestep for measurement.
- Existing deterministic seam: `summarizeFlipperContact()`, `summarizeFlipperContactSeries()`, and `summarizeFlipperLaunchBalance()`.
- Browser fixture: `?review=flipper-contact` routes through the real renderer and records a moving-flipper contact without pretending that fixture input is human-play evidence.

## Measurement protocol

1. Run the hosted build at exact CSS viewports 320x568 and 390x844.
2. Verify HTTP 200, complete document, canvas presence, `innerWidth === clientWidth === scrollWidth`, and zero console/page/request errors.
3. Capture the `flipper-contact` fixture for deployment health and query continuity.
4. Separately collect 10 human-steered launches per side at the same starting lane. Record `beforeSpeed`, `afterSpeed`, `speedDelta`, `impactSpeed`, `impactEnergy`, and `source=live`.
5. Repeat with a held cradle release and label those samples `mode=catch`; exclude them from launch averages.
6. Repeat the same launch sequence with the review fixture and label it `source=fixture`; never merge fixture and live buckets.

## Gates before tuning

- **Contact continuity:** every fixture run reports one contact and no page/runtime errors.
- **Launch separation:** `summarizeFlipperContactSeries()` ignores `mode=catch` samples.
- **Provenance:** live and fixture summaries remain independent keys in `summarizeFlipperContactSources()`.
- **Response sanity:** live launches have finite values; no negative `afterSpeed`; no sample exceeds the production speed cap.
- **Side symmetry:** compare left/right mean `afterSpeed` and `speedDelta`; a side difference greater than 20% is a tuning investigation, not an excuse to hide one side.
- **Balance report:** call `summarizeFlipperLaunchBalance(samples, { source: 'live' })`; it filters to launches, keeps left/right buckets, reports signed right-minus-left speed delta, and only raises `asymmetric=true` when both sides have samples and either relative mean exceeds the strict `>20%` threshold.
- **Repeatability:** two identical seeded fixture runs serialize to identical JSON.

## One-variable tuning order

1. Measure without changes.
2. If launches are weak on both sides, adjust only the flipper impulse scale.
3. If only fast rotation misses, adjust only angular contact sampling or the existing query-radius policy.
4. If held catches feel wrong, tune only cradle-release handling; do not alter launch response.
5. Re-run all deterministic tests and both exact hosted portrait checks after each change.

## Non-goals

- No new flipper geometry, upgrade, element effect, or HUD work in this packet.
- No claim of AAA/mobile parity from fixture output.
- No use of screenshot appearance as a substitute for velocity/contact telemetry.
- No tuning based solely on a single successful launch.

## Acceptance evidence

The implementation tick that consumes this packet must include the measured before/after values, the exact commit, the Pages workflow URL, fresh hosted checks at both viewports, and a statement of whether the change was retained or reverted.
