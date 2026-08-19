# Next visual phase — portrait mine ascent

Status: implementation-ready visual packet; no renderer change in this tick.

## Evidence boundary

The current `prototype` HEAD is `e101422ef824bb5162caac19a76aa78f73132e76`. Hosted review routes returned HTTP 200 at exact CSS viewports 320×568 and 390×844 with Canvas present, `innerWidth === clientWidth === scrollWidth`, and zero console/page/request errors. The `upgrade` fixture exposed four visible choices at both sizes; the production `destruction-run` fixture exposed the deployed salvage path. Local browser verification remains blocked by the reproducible `127.0.0.1:8765 ERR_EMPTY_RESPONSE`; no local visual pass is claimed.

This packet deliberately does **not** infer final visual quality from DOM health or from the deterministic fixtures. It is the smallest coherent visual phase to execute next when a fresh still-frame review or human-play capture is available.

## Single phase goal

Make the Generator Well read as a physical, portrait mine-table instrument rather than a decorated flat canvas, while preserving physics, input, progression, and elemental rules.

### Ordered work

1. **Three depth planes:** retain the existing shell and deck, then give the recessed well and foreground flipper/mechanism plane distinct values, edge occlusion, and contact shadows. No persistent full-table color wash.
2. **Authored silhouettes:** upgrade only the major families first: Generator Well, destructible salvage, targets/bumpers, and flippers. Each must use nested geometry plus highlight/shadow cues; no primary object may remain a lone flat circle or stroked line.
3. **One lighting language:** use a restrained warm key from the lower foreground, cool ambient fill in the well, localized elemental emissive accents, and short contact shadows. Avoid global flashes as a substitute for lighting.
4. **HUD hierarchy:** keep objective, score/stability, active imprints, and flipper controls in separate readable bands. Preserve the current active-chip separation at canvas `y=78` and the existing portrait control gutters.
5. **Upgrade treatment:** preserve the four-choice content and behavior, but make identity, effect, cost, and disabled state scan in under one second. The overlay must remain fully visible at 320×568 without scrolling.

## Acceptance gates

- A still frame shows at least three unambiguous depth planes.
- In a grayscale capture, the four major object families remain distinguishable by silhouette and value, not hue alone.
- Every primary object family has at least one nested form and one highlight/shadow cue.
- Localized emissive effects and contact shadows are visible; no persistent table-wide tint is introduced.
- At 320×568, 390×844, and true CSS widths (not merely bitmap dimensions), `scrollWidth === clientWidth`; no HUD/control overlap is present.
- Critical non-canvas HUD text remains at least 12 CSS px; bottom labels retain at least 12 logical canvas pixels of clearance.
- The upgrade fixture fits at 320×568 with at least 16px overlay gutters, four visible choices, touch-safe card heights, and no page errors.
- `npm test`, syntax checks, exact hosted portrait checks, and Pages deployment pass.
- Physics and input behavior are unchanged; specifically, no solver constants, collision geometry, fixed timestep, or progression edits are included in this phase.

## Verification packet for implementation

Capture exact hosted `?review=depth`, `?review=destruction-run`, `?review=active-elements`, and `?review=upgrade` at both portrait sizes before and after. Record file/line anchors, screenshots outside the repository, console/page/request errors, and whether each acceptance gate is observed or only inferred. If a gate fails, fix one visual seam at a time and rerun the full packet.

## Explicit non-goals

No new mechanics, content, elemental combinations, flipper tuning, asset pipeline, narrative layer, or AAA/production-readiness claim belongs in this phase.

## Next decision

Do not begin this phase from source inspection alone. Start with a fresh still-frame verdict identifying the single largest visual gap, then implement the smallest ordered item that addresses that gap.
