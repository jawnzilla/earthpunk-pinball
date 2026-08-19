# Rotating Flipper CCD Canon

## Status

Implementation-ready research slice for the next physics change. This document does not change the live solver. The current `src/flipper-contact.js` sampler remains the runtime authority until the fixtures below are green against a replacement.

## Problem statement

`sweptFlipperContact()` currently samples a rotating capsule at bounded pose intervals and runs the analytic ball-vs-static-capsule sweep at each pose. That removes linear segment tunneling, but a stationary or slow ball can still be missed between sampled blade poses when angular travel is large. Increasing the sample cap is not a root-cause fix: it trades correctness for unbounded work and still leaves a gap between poses.

## Contract to preserve

- Input remains renderer-independent: ball previous/current pixel positions, flipper pivot/length/width, previous/current angle, and optional length bonus.
- Output remains either `null` or `{ x, y, t, segment }`, with `t` normalized to `[0, 1]`.
- A contact query is pure and deterministic; it must not mutate ball, flipper, or review state.
- The earliest valid contact wins. Equal-time contacts retain the existing stable manifold ordering.
- The live resolver continues to own response, residual fixed-step replay, telemetry, and cradle state.
- The existing analytic static capsule query remains reusable for the zero-angular-motion case.

## Proposed narrow algorithm

1. Normalize the angular delta with `shortestAngularDelta()` and retain the short-arc parameterization already used by the current query.
2. Treat the ball path as `B(t) = B0 + (B1 - B0)t` and the blade as a pivoted segment whose endpoint is `P + R(theta0 + delta*t)L`.
3. Solve the earliest root for distance from `B(t)` to the rotating segment centerline being equal to the combined collision radius. Use a conservative interval solver over normalized time, with explicit endpoint-cap checks.
4. Each interval must return a lower/upper distance bound. Subdivide only while the bound can straddle the collision radius; stop at a fixed maximum depth and report the earliest conservative bracket midpoint.
5. Verify the reported point against the exact capsule at the reported angle before returning. If verification fails, continue with the next bracket rather than manufacturing contact.
6. Keep a bounded fallback to the current sampled query only for numerical-degenerate cases, and expose the fallback in test telemetry rather than silently changing behavior.

The implementation must not use a larger variable physics timestep, renderer pixels, or a second statistical approximation. The fixed-step caller and residual replay stay unchanged.

## Required red/green fixtures before replacing the sampler

- **Stationary-ball rotational crossing:** ball path has zero travel; a blade sweeps across the ball between poses; exact `t` is inside `(0, 1)`.
- **Linear plus rotational crossing:** both ball and blade move; the earliest contact is earlier than either end-pose test.
- **Capsule endpoint contact:** contact occurs at the blade tip, not its centerline strip.
- **Short-arc seam:** previous `PI - epsilon`, current `-PI + epsilon`; no almost-full revolution.
- **No-contact near miss:** minimum distance stays just outside the radius; return `null`.
- **Earliest-time ordering:** two possible blade contacts return the first one and preserve deterministic tie behavior.
- **Degenerate inputs:** zero travel, zero angular delta, invalid radius, and zero-length segment remain safe and deterministic.
- **Performance budget:** a 10,000-query deterministic benchmark records bounded work and does not exceed the current sampler's 64-pose worst-case allocation by more than 2x.

## Acceptance gates

- `node --test tests/flipper-contact.test.mjs` passes with the old sampler removed from the normal path.
- `npm test` passes with no renderer or drain regressions.
- `node --check src/flipper-contact.js` and `git diff --check` pass.
- Existing `?review=flipper-contact` reports both sides, normalized contact timing, and no page/console errors at CSS 320x568 and 390x844.
- Exact hosted checks confirm the deployed module contains the continuous query marker and the same viewport/overflow contract.
- Physics response, input ownership, progression, and visuals are unchanged in this slice.

## Explicit non-goals

Do not tune launch strength, mass, restitution, elemental damage, target layout, or renderer materials in the same change. Do not claim continuous CCD from a source marker or a static test alone; the stationary-ball crossing fixture is the minimum proof.
