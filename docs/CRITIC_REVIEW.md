# Deadlight Critic Review — Overhaul tick 16

## Overhaul tick 17 verdict

**Playable hackathon slice: PASS for table-hardware contact readability. AAA-ready: FAIL.** Salvage targets and active bumpers now share the mine-table's restrained contact-light language: material-tinted body values, a consistent upper-left key, and edge accents. This is a renderer-only phase and does not claim full production visual readiness.

### Observed evidence

- `drawStaticContactLight()` is applied to unhit salvage targets and non-edge bumpers after their authored base forms, adding nested value and rim treatment without replacing their silhouettes.
- Local exact 320x568/390x844 Chromium checks pass with canvas, active transition, 52px touch controls, matching document widths, and zero console/page errors.
- Deterministic physics/elemental tests remain green: 2 files, 2 tests, 0 failures.
- Hosted Pages exact 320x568/390x844 checks pass after deployment: HTTP 200, `drawStaticContactLight` served, active Generator Well transition, 52px controls, matching widths, and zero console/page errors. Workflow run `32116001723` completed success.

### Remaining risk / next smallest slice

- The table still relies on procedural Canvas geometry and has not passed a grayscale screenshot audit or physical-device feel test.
- Full-table lighting is still incomplete for route hardware, drain, and sprite-backed surfaces; the static key is intentionally not a dynamic illumination system.
- Next bounded slice: apply the same material/key treatment to the drain and route chutes, or pause renderer work for a true 320/360/390 visual screenshot audit; do not change mechanics in that pass.

## Overhaul tick 16 verdict

**Playable hackathon slice: PASS for directional elemental body readability. AAA-ready: FAIL.** Water mini-balls and Wind echoes now carry a shared motion-driven highlight, edge value, and contact shadow instead of reading as flat dots/lines. This is a narrow renderer phase; the larger mine/tunnel lighting language, full-table elemental collision parity, and physical-device feel remain incomplete.

### Observed evidence

- `drawDirectionalContactLight()` derives the light vector from each body's current velocity and is used by both elemental body families.
- Water fragments now have a visible ground-contact shadow and nested highlight/edge treatment; Wind echoes retain their directional wake and gain a lit core.
- Deterministic tests pass: 2 files, 2 tests, 0 failures. Local exact 320x568/390x844 Chromium checks pass with active transition, 52px controls, matching widths, and zero console/page errors.

### Remaining risk / next smallest slice

- The primary ball and destructibles still use separate renderer paths, so this is not yet a complete table-wide lighting language.
- Hosted Pages exact 320x568/390x844 checks pass after deployment: HTTP 200, active `RUN 1/4`, 52px controls, matching widths, and zero console/page errors. GitHub Actions run `32114306885` completed `success`.
- Next bounded slice: extend the same restrained contact-light language to the primary ball/major table hardware, without changing collision or reward behavior.

## Overhaul tick 15 verdict

**Playable hackathon slice: PASS for the destructible material renderer seam. AAA-ready: FAIL.** Generator Well salvage objects now have a clearer material read: timber, copper, and stone separate through directional value ramps and edge accents instead of palette-only flat fills. This is the smallest coherent visual phase; physics, silhouettes, damage rules, and reward semantics were not changed. The larger mine/tunnel reset, full-table elemental collision parity, hosted evidence, and physical-device feel remain incomplete.

### Observed evidence

- `materialVisual()` and `drawMaterialSheen()` provide distinct base/light/dark/edge cues for destructible materials.
- Crate, pipe, drum, and stone-plug renderers consume the material palette; damage cracks use the material edge cue while integrity-stage dots and destroyed states remain intact.
- Deterministic tests pass: 2 files, 2 tests, 0 failures. Local exact 320x568/390x844 Chromium checks pass with active transition, 52px controls, matching widths, and zero console/page errors.

### Remaining risk / next smallest slice

- The renderer still uses procedural Canvas forms and does not yet provide a complete mine/tunnel lighting language or full grayscale silhouette audit.
- Hosted Pages exact 320x568/390x844 checks pass after deployment: HTTP 200, active transition to `RUN 1/4`, 52px controls, matching widths, and zero console/page errors. Workflow run `32112523087` completed success.
- Next bounded slice: give the primary ball and elemental bodies a shared directional contact-light pass, or extend material-aware destructibles to the other route tables; do not broaden gameplay rewards in the same change.

## Overhaul tick 14 verdict

**Playable hackathon slice: PASS for residual swept travel. AAA-ready: FAIL.** Elemental bodies now preserve the unused portion of a fixed step after a swept destructible contact: rewind, resolve, then replay residual time once. This closes the specific post-contact travel loss identified last tick. The mine/tunnel visual reset, full-table elemental collision parity, and physical-device evidence remain incomplete.

### Observed evidence

- `advanceElementalBodyResidual()` re-integrates Physics V2 using `dt × (1 - swept.t)` and resynchronizes renderer-space coordinates.
- Water and Wind live adapters replay residual time once per resolver callback after a counted destructible response; duplicate contacts and reward-free semantics remain unchanged.
- Deterministic tests pass: 2 files, 2 tests, 0 failures. Local exact 320x568/390x844 Chromium checks pass with active transition, matching widths, 52px descent control, and zero console/page errors.

### Remaining risk / next smallest slice

- Residual replay is intentionally limited to one counted destructible contact per elemental body per fixed step; full multi-contact continuous collision remains future work.
- Hosted Pages exact 320x568/390x844 checks are pending this push.
- Next bounded slice: begin the mine/tunnel material renderer phase (one coherent depth/material pass) rather than broadening gameplay rewards.


## Overhaul tick 13 verdict

**Playable hackathon slice: PASS for swept-contact correction. AAA-ready: FAIL.** Elemental broad-phase hits now rewind fast fragments to the first contact point before solver response, preventing a confirmed mid-step hit from leaving the body embedded in salvage. The mine/tunnel visual reset, full-table elemental collision parity, and physical-device evidence remain incomplete.

### Observed evidence

- `rewindElementalBodyToContact()` updates both renderer-space and Physics V2 positions; deterministic coverage verifies the conversion boundary after a swept hit.
- Both Water mini-ball and Wind echo destructible paths call the correction before their existing structure response, with no changes to reward, score, or primary-ball paths.
- Local exact 320x568/390x844 Chromium checks pass with active transition, 52px controls, matching widths, and zero console/page errors.

### Remaining risk / next smallest slice

- The correction resolves first-contact placement but does not yet carry the remaining fraction of the fixed step after the impulse; high-speed fragments can still lose some post-contact travel.
- Hosted Pages exact 320x568/390x844 checks pass after this push: canvas present, `RUN 1/4` active transition, 52px controls, matching widths, and zero console/page errors. Workflow run `32109250042` completed success.
- Next bounded slice: preserve post-contact residual time for one elemental body only, or begin the mine/tunnel material renderer phase; do not broaden gameplay rewards in the same change.

## Overhaul tick 12 verdict

**Playable hackathon slice: PASS for swept elemental broad-phase. AAA-ready: FAIL.** Fast Water mini-balls and Wind echoes now query their whole fixed-step path against destructibles, removing a concrete tunneling failure mode without widening rewards or changing primary-ball physics. The mine/tunnel visual reset, full-table elemental collision parity, and physical-device evidence remain incomplete.

### Observed evidence

- `sweptCircleContact()` returns the closest point and movement-derived normal for a segment/circle query; a mid-segment hit is covered by deterministic tests.
- Elemental bodies retain `previousX/previousY` before Physics V2 integration, and the live destructible adapters consume the swept path for both Water and Wind.
- Deterministic tests pass: 2 files, 2 tests, 0 failures. Local exact 320x568/390x844 Chromium checks pass with active transition, 52px controls, matching widths, and zero console/page errors.

### Remaining risk / next smallest slice

- Swept queries improve destructible broad phase, but elemental bodies still do not participate in the full table geometry or flippers/targets.
- Hosted Pages exact 320x568/390x844 checks pass after deployment; workflow run `32107753656` completed success.
- Next bounded slice: add contact-time positional correction for swept destructible hits, or begin the mine/tunnel visual/material phase; do not broaden gameplay rewards in the same change.

## Overhaul tick 11 verdict

**Playable hackathon slice: PASS for elemental fixed-step body integration. AAA-ready: FAIL.** Water mini-balls and Wind echoes now use Physics V2 as the authoritative fixed-step integrator with an explicit pixel↔meter boundary. The mine/tunnel visual reset, full elemental broad-phase parity, and physical-device evidence remain incomplete.


## Overhaul tick 11 verdict

**Playable hackathon slice: PASS for elemental fixed-step body integration. AAA-ready: FAIL.** Water mini-balls and Wind echoes now use Physics V2 as the authoritative fixed-step integrator with an explicit pixel↔meter boundary. The mine/tunnel visual reset, full elemental broad-phase parity, and physical-device evidence remain incomplete.

### Observed evidence

- `advanceMiniBalls()` and `advanceWindEcho()` call `integrateBall()` and synchronize renderer-facing pixel fields from the Physics V2 body; no direct elemental `x += vx * dt` integration remains.
- Deterministic tests pass: 2 files, 2 tests, 0 failures, including restitution override and body synchronization assertions.
- Local exact 320x568/390x844 Chromium checks pass with route-to-active transition, 52px controls, matching document widths, and zero console/page errors.

### Remaining risk / next smallest slice

- Elemental bodies still use the table adapter's reduced broad-phase geometry; they are not yet full-table collision participants.
- Hosted Pages exact 320x568/390x844 checks pass after deployment; workflow run `32106419420` completed success.
- Next bounded slice: migrate the reduced elemental wall/object broad-phase adapter to consume body positions directly while retaining the existing ledgers and no-reward semantics.

## Overhaul tick 10 verdict

**Playable hackathon slice: PASS for the shared elemental contact seam. AAA-ready: FAIL.** Water mini-balls and Wind echoes now use the shared Physics V2 body/contact solver for material-aware impulse and impact-energy accounting. The mine/tunnel visual reset, full elemental broad-phase parity, and physical-device evidence remain incomplete.

### Observed evidence

- `resolveElementalBodyContact()` creates/retains explicit Physics V2 bodies with Water/Rubber materials and synchronizes the legacy adapter fields after solver response.
- Deterministic tests pass: 2 files, 2 tests, 0 failures. Local exact 320x568/390x844 checks pass with active transition, matching widths, and zero console/page errors.

### Remaining risk / next smallest slice

- The table adapter still owns reduced broad-phase geometry and pixel-space integration for elemental bodies; this is a solver seam, not full shared fixed-step body integration.
- Hosted Pages exact 320x568/390x844 checks pass after deployment; workflow run `32104750883` completed success.
- Next bounded slice: migrate elemental integration to shared fixed-step body integration while preserving current lifetime, distance, contact-key, and bounce ledgers.

## Overhaul tick 09 verdict

**Playable hackathon slice: PASS for shared elemental impact accounting. AAA-ready: FAIL.** Physics V2 now owns the shared hardness and kinetic-energy primitives consumed by primary contacts, Water mini-balls, and Wind echoes. The mine/tunnel visual reset, full shared Physics V2 bodies for elemental projectiles, and physical-device evidence remain incomplete.

### Observed evidence

- `materialHardness()` and `impactEnergyFromMassSpeed()` are centralized in `src/physics-core.js`; primary contact energy and Wind echo energy now use the same implementation.
- Water mini-ball and Wind echo damage policies consume the Physics V2 material registry, eliminating their duplicated hardness table while preserving their distinct thresholds, scales, and per-hit caps.
- Deterministic tests pass: 2 files, 2 tests, 0 failures. Local exact 320x568/390x844 Playwright checks pass with active transition and zero console/page errors.

### Remaining risk / next smallest slice

- Elemental bodies still use pixel-space reduced kinematics rather than full Physics V2 position/velocity/contact bodies; this slice only consolidates shared accounting at the seam.
- Hosted Pages must be re-verified after the push.
- Next bounded slice: convert Wind echo contact response to a shared Physics V2 contact result while preserving the ignored-first-response and one-hit-per-object ledger.

## Overhaul tick 08 verdict

**Playable hackathon slice: PASS for the Wind echo material-aware seam. AAA-ready: FAIL.** Wind echoes now damage destructibles through a renderer-independent, one-hit-per-object force policy while preserving the ignored-first-response behavior and reward-free semantics. The mine/tunnel visual reset, full shared Physics V2 parity for elemental bodies, and physical-device evidence remain incomplete.

### Observed evidence

- Deterministic tests cover echo impact energy, ignored-first-response, duplicate suppression, timber-vs-stone differentiation, and the 18% integrity cap.
- The live adapter runs echo contacts through the existing destructible mask and emits Wind-specific feedback without score/Charge/target/chain leakage.
- Local and hosted exact 320x568/390x844 Playwright Chromium smoke passes: canvas/touch controls present, active transition succeeds, widths match, touch press is observed, and zero console/page errors. Hosted workflow run `32102356804` completed success.

### Remaining risk / next smallest slice

- Wind echoes still use a reduced kinematic body and duplicated material policy rather than the full Physics V2 contact solver.
- Next bounded slice: consolidate elemental body contact energy into shared Physics V2 material helpers, beginning with Wind echo mass/force conversion.

## Overhaul tick 07 verdict

**Playable hackathon slice: PASS for the material-aware reduced-mask policy. AAA-ready: FAIL.** Mini-ball structure damage is now renderer-independent and explicitly responds to material hardness, impact threshold/energy, elemental weaknesses, and the existing per-hit cap. The larger visual mine/tunnel reset, shared Physics V2 parity for elemental bodies, and physical-device evidence remain incomplete.

### Observed evidence

- `resolveMiniBallStructureDamage()` is covered by deterministic tests for threshold rejection, material differentiation, weakness scaling, and the 22% integrity cap.
- The browser adapter now consumes the policy result while retaining no-score/no-Chain/no-Reward semantics.
- Local exact 320x568 and 390x844 browser checks report canvas/touch controls present, matching CSS/document widths, and zero console/page errors.

### Remaining risk / next smallest slice

- The mini-ball policy currently uses a reduced kinematic body and duplicated hardness constants rather than the full Physics V2 contact solver.
- Hosted Pages must be checked after deployment.
- Next bounded slice: apply the same reduced-mask contact/damage adapter to wind echoes, preserving their ignored-first-response and one-hit-per-object ledger.

## Overhaul tick 06 verdict

**Playable hackathon slice: PASS for the bounded Water structure seam. AAA-ready: FAIL.** Water mini-balls now participate in a deliberately reduced destructible path: deterministic reflected contacts, impact-energy damage, integrity stages, and no score/charge/chain leakage. The larger visual mine/tunnel reset and shared-solver parity for wind echoes remain incomplete.

### Observed evidence

- `onMiniBallStructureContact()` consumes one valid bounce and suppresses duplicate object contacts within the mini-ball step ledger.
- Generator Well destructibles use their existing `r`, threshold, damage scale, and integrity fields; mini-ball damage is capped at 22% of max integrity per valid contact.
- The adapter does not call `hitTarget()`, `chainHit()`, or salvage reward code for mini-ball structure contacts.
- Deterministic module tests, inline syntax, and exact 320x568/390x844 local browser checks pass with zero page/console errors.

### Remaining risk / next smallest slice

- Mini-balls still use a reduced kinematic adapter rather than the full Physics V2 body/contact solver; wind echo remains structure-aware but not shared-solver.
- The hosted build must be checked after deployment before this tick is release-ready.
- Next bounded slice: move the mini-ball object-mask response to a renderer-independent contact adapter with explicit object material and damage tests, then apply the same seam to wind echoes.

## Overhaul tick 05 verdict

**Playable hackathon slice: PASS for the bounded physics seam. AAA-ready: FAIL.** Water split mini-balls now have deterministic reduced-mask wall contacts rather than purely kinematic motion. The contact path is intentionally narrow: it covers table boundary reflection and bounce budgeting, not the full primary-ball gameplay graph. The larger overhaul remains incomplete because destructible contact participation, wind echo shared-solver parity, physical-device feel, and the mine/tunnel visual/material bar still need evidence.

### Observed evidence

- `onMiniBallContact()` reflects only approaching contacts, ignores duplicate contact keys within a fixed step, and consumes exactly one of the three bounce credits on a valid contact.
- The live adapter invokes the contact path during `advanceElementalRuntime()` and clamps wall penetration after a counted response.
- Deterministic test coverage now asserts reflection, separating-contact non-consumption, and duplicate-contact suppression.

### Remaining risk / next smallest slice

- Mini-balls still do not contact destructible objects; adding that requires a reduced object-mask adapter with explicit no-score/no-chain semantics.
- The full browser interaction path still needs exact 320x568 and 390x844 runtime evidence after deployment; no screenshot or console claim is made here without that run.

## Verdict

**Playable hackathon slice: CONDITIONAL PASS. AAA-ready: FAIL.** This tick gives the elemental hybrids their first bounded world consequence: Steam Fracture amplifies the next destructible integrity loss, while the other hybrid pairs now have deterministic one-shot runtime events. The overhaul is not complete: the new runtime gate still needs a clean post-resource-exhaustion test run, mini-balls/echoes are rendered but not yet full shared-solver bodies, and physical-device feel remains unverified.

## Findings

- **Gameplay clarity — PASS/WEAK:** The HUD now exposes route, score, progress, Stability, hinge attunements, and active imprints. Route choices are visible after each completed descent. The remaining weakness is that a player must discover the exact cradle geometry through play; a short animated first-use hint would improve onboarding.
- **Elemental loop — PASS:** Hinge cradling applies stacks, matching targets/generators/relays react, and route modifiers change the gravity field. Fire, Water, Earth, and Air have distinct hooks, but the reactions still share a common feedback language.
- **Visual direction — IMPROVED/WEAK:** Generator Well now has bedrock strata, timber supports, pipework, warm work lamps, a worn deck, foreground drain throat, and distinct crate/pipe/stone/drum silhouettes. It is a better mine read than the previous cyan console wash, but remains procedural Canvas geometry without a full material/animation language.
- **Mobile UX — PASS/WEAK:** Touch controls are dedicated, 48px minimum, keyboard-compatible, and responsive at narrow widths. The route/module list is information-dense on very short screens and needs a focused card carousel or two-step choice flow.
- **Physics/readability — PASS/WEAK:** The primary ball integrates through the Physics V2 material/contact core, the loop is fixed at 120Hz with bounded catch-up, flippers use motor surface velocity, and Generator Well destructibles consume contact energy with material/element modifiers. The remaining weakness is that elemental stacks do not yet produce the full canon Fire/Water/Wind/Earth world events, and physical feel still needs device playtesting.
- **Hybrid consequences — IMPROVED/WEAK:** Fire + Water now changes destructible integrity through a one-shot Steam Fracture modifier; Water + Earth and Earth + Wind have capped event hooks, and Fire + Wind marks the echo as thermal. The latter hooks still need deeper physical response wiring.
- **Delivery — PASS with evidence gap:** Hosted URL responds HTTP 200 and the static build is offline-safe. The browser harness was unavailable in one attempt because of a missing `oci` dependency; a later critic run did verify the hosted 320px layout with `scrollWidth === clientWidth`.

## Current tick evidence

- Physics V2 deterministic tests pass, including motor responsiveness, separating-contact no-bounce behavior, material contact energy, stack caps/expiry, hybrid selection, and material damage.
- Extracted inline module syntax passes `node --check`; the browser module is served from `.js` because Python's default server rejects `.mjs` as `text/plain`.
- Playwright Chromium smoke test passes at exact 320×568 and 390×844: module import, route-to-active transition, touch press/release, overflow, and console/page-error gates.
- Active screenshots show the physics slice did not corrupt rendering. They also visibly confirm the next largest gap: the table is still too dense and cyan/console-led to read as a mine/tunnel.

## Next-pass blockers

1. Add a first-run cradle tutorial that points at the hinge and demonstrates one charged imprint.
2. Split route selection from module selection on short mobile screens; do not force eight dense choices into one panel.
3. Give each elemental reaction a distinct animation/audio cue while preserving offline-safe assets.
4. Playtest on physical phones at 320/360/390 CSS widths and record screenshots plus touch interruption behavior.
5. Add one boss or threat table and one explicit resource/free-pass table so progression is not only a choice screen.
6. Extend the destructible taxonomy to the remaining route tables, then add object-specific collision affordances rather than reusing one shared contact presentation.
7. Implement the first canon elemental world event (Fire trail or Water mini-balls) against the existing capped effect state.
8. Re-run the full deterministic gate after the Windows process-resource blocker clears, then wire mini-balls and wind echo through the shared reduced-mask contact solver.

## Current tick evidence

- Four Generator Well destructibles are present in source and initialized only for that table: `timber-crate`, `copper-pipe`, `stone-plug`, and `salvage-drum`.
- `applyDestructibleContact()` consumes `damageFromContact()` output and exposes integrity stages, cooldown protection, destruction, salvage value, and Charge reward.
- Local and hosted Playwright smoke checks passed at exact 320×568 and 390×844 with no overflow or browser errors.

## Simplified changelog

- Added mobile command-deck HUD and touch-safe flipper buttons.
- Added elemental hinge charge/imprint state and reaction feedback.
- Added route modifier choices: Flooded Sluice, Ember Lift, and Bedrock Shortcut.
- Added route-specific gravity and flipper-kick modifiers.
- Deepened Canvas table rendering with machinery silhouettes, localized glows, and impact cues.
- Kept the build offline-safe with no CDN, remote fonts, fetch/XHR, or WebSocket dependencies.
- Pass 25: added FREE PASS / HAZARD / BOSS route identities and the Active kick tuning contract.
- Pass 26: split route risk and elemental module selection into a reversible two-step mobile flow.
- Pass 27: added the dedicated Blackout Core / Reactor Warden boss table with shield exposure, elemental damage gating, and visible HP pips.
- Pass 28: replaced the flat route list with a compact risk-coded route map and locked high-reward node.
- Pass 29: made route history persistent and Surface Vault a real Charge-gated reward branch.
- Physics pass: added four test presets and separated muted surface rebound from bumper rebound.
- Physics reach pass: added first-contact upward escape, repeat-kick lock, and live peak/launch telemetry.
- Upper-bank pass: added a measurable top-bumper reach objective, target band, score reward, and cooldown.
- Launch-angle pass: added a bounded inward assist on fresh active flipper hits and angle telemetry.
- Physics UX follow-up: exposed launch angle in Tune and bounded the panel for 320x568 screens.
- Target-directed pass: rotates fresh flipper launches toward the nearest upper bumper while preserving speed magnitude.
- Corrective geometry pass: replaced unreachable `y <= 220` logic with actual highest-bumper tier selection and aligned the visual band.
- Progression pass: upper-bank reach now unlocks Surface Vault; 4 Charge remains the fallback.
- Corrective progression pass: route effects now commit only after module confirmation; Change route restores the snapshot.
- Physics UX pass: preset buttons now expose selected state and clear to Custom on slider edits.
- Corrective boss progression pass: Reactor Warden is consumed after one stage; the next table returns to normal unless reselected.
- Flipper contact-power pass: hinge-side active hits are weak dislodges; tip-side hits provide full launch power.
- Aim-assist readability pass: Tune copy now explains target-directed max-turn behavior; cradle-only reticle points toward the nearest unhit salvage target.
- Loop 14 visual pass: authored deck inset hardware and relay gate assets replaced flat interior/gate strokes; outer modal gained a scroll affordance.
- Loop 15: authored the upper-bank reach frame and made the route-decision CTA sticky and visible at mobile viewport entry without changing map scroll isolation or gameplay controls.
- Loop 15 follow-up: replaced the repeated lower edge/flipper machinery gear-and-line treatment with authored `lower-edge-machinery.svg`; retained drain, stability, dynamic accent lamps, and procedural fallback.
- Loop 16 route UX pass: reduced the pre-descent surface to a symbol-only portrait map, current-node tooltip, legend, and CTA; removed the legacy route strip from layout and added compact collision-vs-shell HUD symbols.
- Loop 16 flipper pass: leveled both rest blades and extended the collision-enabled flipper segments to 104 canvas units with width 17 to reduce center-drain misses.
- Loop 17 visual pass: replaced the flat table identity rectangle with authored `table-identity.svg`, retaining dynamic route-kind color and label while preserving the procedural fallback.
- Loop 18 visual pass: added authored `table-identity.svg` integration verification and confirmed the map-only route surface, HUD key, and mobile CTA remain stable.
- Loop 18 reticle pass: replaced the cradle aim arc/ticks with authored `aim-reticle.svg`, preserving target-directed rotation and procedural fallback.
- Loop 18 user-steered correction: disabled canvas text selection and context menus, angled mirrored flippers down 15° at rest, expanded the short-phone map viewport to 350px, and added visible score popups for target, bumper, relay, armor, upper-bank, reaction, and boss scoring events.
- Loop 19 map structure pass: replaced stacked depth rows with a five-lane horizontal route console; depth now progresses left-to-right, each lane is vertically spaced, depth labels and separator rails establish a new navigation grammar, and map clicks remain inspection-only.
- Loop 19 physics/depth pass: added bounded swept-contact detection from `ball.prevX/prevY` to the current position to catch fast tip crossings without changing flipper dimensions, kick, restitution, cradle, or contact-lock rules. Added render-only ball shadow, recessed well halo, velocity-oriented highlight, and richer procedural metal fallback.
- Loop 20 route-feedback pass: split the route panel into an inner map scroll rail and a persistent detail/legend feedback rail. The selected-node tooltip and legend now remain above the CTA, while route depth scrolling stays isolated to one obvious inner map region.
- Loop 20 authored route-console pass: added `assets/sprites/route-console.svg` as a recessed five-lane chassis behind the dynamic route nodes, replacing the flat CSS-only map backdrop with custom rails, sockets, conduit waves, and perimeter hardware.
- Loop 21 control pass: replaced the generic CSS touch-flipper rectangles with authored `assets/sprites/flipper-control.svg` panels while preserving 52px hit targets, bright pressed-state feedback, pointer handlers, and active-play layout.
- Loop 22 HUD pass: replaced the flat `.run-hud` gradient with authored `assets/sprites/hud-rail.svg`, a recessed instrument rail with fasteners, segmented conduits, and restrained emissive accents while preserving route, key, score, and geometry.
- Loop 23 masthead pass: added authored `assets/sprites/masthead-rail.svg` behind the compact header, adding socket rails and conduit accents without increasing header height or changing the HUD/table layout.
- Loop 24 action pass: replaced the generic route-decision `#reset` button treatment with authored `assets/sprites/action-plate.svg`, preserving the 52px sticky CTA, route-map inspection, and physical-chute-only commitment.
- Loop 24 feedback copy pass: compressed the route detail rail from dense prose to short status/affordance lines (`NOW · GENERATOR · TAP OPEN NODE`, `FLOODED SLUICE · LEFT CHUTE`, `FUTURE · VAULT`) while preserving inspection-only map behavior.
- Loop 25 legend pass: replaced the route legend's tiny generic dots with symbol-led status marks (`◉ NOW`, `◇ OPEN`, `· FUTURE`, `× LOCKED`) and added an accessible legend label without changing route behavior.
- Loop 26 modal-copy pass: compressed the route-decision instruction contract to `MAP ABOVE · ENTER DESCENT · OPEN CHUTE COMMITS ROUTE.` and the terminal-state line to `FINAL CHAMBER · CLEAR TABLE FOR SURFACE SIGNAL.`; the map-first route modal continues to suppress duplicate prose.
- Flipper rotating-sweep correction: added bounded continuous-angle contact sampling between `previousAngle` and `angle`, so fast tip crossings are resolved against the actual moving flipper capsule while preserving relative-contact physics, active kick `12`, contact locks, and visual geometry.
- Loop 27 narrow upgrade-modal pass: constrained non-route decision cards to the mobile viewport and reduced the upgrade-choice scroll window at ≤360px, preserving all four choices, 52px minimum button sizing, and leaving the map-first route modal untouched.
- Loop 27 cue pass: moved `SWIPE FOR MORE` from a negative-offset overlay into a dedicated sticky bottom row inside `.choices.upgrade-scroll`, preventing it from crossing visible choice descriptions.
- Loop 27 vertical route-map pass: changed the five-lane map to bottom-to-top depth bands with `column-reverse`, placing D0/current at the bottom and the final depth at the top; narrow-phone bands now fit the available map viewport.
- Loop 28 map-fit pass: compacted the vertical bands at both mobile heights, hid the obsolete swipe cue when all five depths fit, and preserved the authored console chassis/detail/legend hierarchy.
- Loop 28 full-map composition pass: made the route-decision card fill the overlay height and allowed the route panel/viewport to flex into the unused space instead of remaining a half-height panel.
- Flipper posture rollback: restored the pre-flattened extended-blade rest posture (`.16` / `π-.16`, active `.5`) while retaining current 104×17 blades, pivots, swept contact, and late-drain guard.
- Loop 28 audit correction: short-phone `main` now clamps to `100dvh` with no document spill, and the route-map cue is validated against actual scroll range rather than shown by default.
- Loop 29 authored score pass: replaced the plain text score badge with local `score-core.svg`, reduced the live value to a compact number with accessible labeling, and tuned the narrow-phone badge/canvas relationship without changing gameplay physics.
- Loop 29 delayed-audit correction: the active HUD now uses an explicit route-left/score-right two-zone grid; the cryptic decorative/collision key is hidden from the visual layer while its accessible source markup remains.
- Loop 30 symbol-first controls: removed duplicate `HOLD` copy from the visible touch actuators and enlarged directional symbols to `30px`, preserving the authored control plate, 52px targets, and accessible labels.
- Loop 31 authored run-status instrument: added `run-status.svg` behind the masthead stage readout, keeping semantic text while replacing the bare text treatment with a recessed manufactured plate.
- Loop 31 authored lower mid-deck cassette: filled the empty lower-mid active-play band with a visual-only recessed service module, retaining dynamic object visibility and unchanged collision geometry.
- Late-drain flipper correction: added a final shared swept-capsule check immediately before drain resolution, so a genuine end-of-flipper crossing is resolved instead of losing stability.
- Corrective hinge gameplay pass: elemental imprint triggers on cradle entry only, preventing held-flipper refresh farming.
- Relative-contact physics pass: replaced angle/target/escape launch overrides with ball-versus-rotating-flipper contact resolution; rolling velocity and flipper surface velocity now remain in the same solver.
- POP baseline / angle-driven launch pass: default profile is POP; fresh hits inherit the active flipper angle instead of forcing vertical launches.
- Surface Vault identity pass: reward route now has distinct signal-violet styling and `SURFACE VAULT // SIGNAL OPEN` table identity.
- Corrective angle response pass: early/late flipper activation now produces a materially different launch vector.
- Hinge cradle pass: slow held hinge contact settles into a persistent cradle; releasing the flipper rolls the ball out instead of leaving a sticky hinge state.
- Gameplay route pass: post-stage route menu selection removed; reachable exits are physically chosen through opened chutes, with a read-only pre-level branching map.
- Loop 32 corrective clarity pass: added visible graph connectors and consequence labels so each open node communicates its actual route effect before the physical chute commit.
- Loop 32 upgrade composition pass: hid route-only preview content during module selection, expanded the four-choice grid to the full modal viewport, removed obsolete scrolling/cue behavior, and retained 48px minimum taps.
- Loop 32 score contract: all visible score output is rounded to integers before display.
- Loop 32 flipper solver correction: sampled rotating flipper angles against the complete ball segment to catch asynchronous fast-ball tip crossings without artificial geometry or drain barriers.
- Loop 33 authored upper-bank pass: added `bank-target-assembly.svg` behind the upper bank bumpers, replacing the remaining generic rack with a recessed manufactured module while preserving all gameplay geometry.
- Loop 34 authored actuator pass: replaced the remaining Unicode flipper control glyphs with local left/right manufactured SVG symbols, preserving accessible labels, pointer hold behavior, and 52px touch targets.
- Loop 35 mid-deck material pass: rebuilt `mid-deck-cassette.svg` into a deeper service manifold with nested bays, a lit reactor spine, conduits, clamps, and stronger material contrast while preserving render bounds and gameplay geometry.
- Loop 36 route-console icon pass: replaced route-map Unicode glyphs with authored current/free/hazard/boss/reward/future SVG node icons while preserving graph flow, consequences, accessibility, and physical-chute commitment.
- Loop 37 legend pass: replaced the remaining route legend glyphs with compact authored SVG marks while preserving concise labels and route-map geometry.
- Loop 38 depth-field pass: added an authored lower route-console service field with three recessed bays, junction hardware, conduits, and collector panels; preserved graph behavior and physical-chute commitment.
- Loop 39 upper-approach pass: added an authored upper approach manifold with side service modules and a clear central ball corridor; preserved target and collision geometry.
- Loop 40 lower-return pass: added an authored lower return channel with collector plates, ribs, junctions, and a central drain approach; preserved the prior render bounds and gameplay geometry.
- Loop 41 transfer-spine pass: added an authored central transfer corridor with left/right bays, conduit spine, socket details, and junction lamps; preserved target and bumper geometry.
- Loop 42 deck-inset pass: enriched the existing 360×420 middle-deck scaffold with six authored environmental zones while preserving the central ball corridor and gameplay geometry.
- Loop 43 upper-lane pass: enriched the upper approach’s central corridor with static transit rails, telemetry cues, sockets, and a central lamp while preserving the clear ball path.
- Loop 45 lower-return pass: increased lower return-channel information density with rail, socket, conduit, and terminal details while preserving the gameplay-clear corridor.
- Loop 46 cassette pass: differentiated the mid-deck service manifold with asymmetric feed couplers, service sockets, stronger rails, and distinct side-bay silhouettes around the reactor spine.
- Loop 47 upper-manifold pass: added side housing depth, a central launch/intake lane, and a foreground gate/rail layer with localized amber/cyan cues.
- Loop 48 intake-throat pass: added a recessed upper intake silhouette, guide brackets, contact-shadow framing, and localized terminal cues while preserving the ball corridor.
- Loop 49 crown pass: added a local authored upper-crown service insert with side housings, ceiling brackets, central launch corridor, socket indicators, and lower contact rails.
- Loop 50 lower-transfer pass: added a local authored lower-middle panel with left/right service bays, central transfer core, junction lamps, and conduit rails while preserving the ball corridor.
- Loop 51 corridor pass: added a local authored telemetry spine with shallow side rails, six junction markers, segmented telemetry marks, and a localized center indicator while preserving clear travel width.
- Loop 52 drain-throat pass: added a local authored lower-return assembly with left/right flumes, recessed central throat, amber/cyan flow indicators, and clamp rails above the flippers.
- Loop 53 HUD pass: layered a local authored status console behind the semantic Run HUD with three instrument zones, telemetry rails, localized lamps, and a score-linked focal cue.
- Loop 54 route-depth pass: enriched the lower route-map field with left/right collector modules, central terminal core, color-coded endpoint lamps, and clamp rails while preserving route geometry.
- Loop 55 route-depth pass: extended the terminal region with left/right collector pylons, vertical socket rails, and connecting amber bridges while preserving node and CTA geometry.
- Loop 56 route-depth pass: added lower-field support towers, nested socket bays, cross-field amber rails, and a central return spine while preserving route topology and scroll geometry.
- Loop 57 route-depth pass: added six authored service landmarks—side bays, inner sockets, central indicator bars, opposing color anchors, and return rails—without changing route topology or CTA geometry.
- Loop 58 route-depth pass: added left/right service shafts and two central depth-elevator cores with cyan/amber anchors beneath the final node row while preserving route hit targets and scroll geometry.
- Loop 59 UX pass: restored the compact route scroll cue for genuine hidden depth and made its measurement self-excluding so the 390px full map does not create false overflow.
- Loop 60 route-depth pass: extended the route field to its 541px presentation bound with a lower terminal housing, twin collector bays, central service core, endpoint lamps, and conduit termination.
- Loop 61 UX/UI pass: added a local authored route-status rail, shortened default detail copy to `NOW · GENERATOR`, and compressed the four legend statuses into one fixed 49px rail without changing route behavior.
- Loop 62 route-depth pass: added three diagonal depth gates with layered cyan/amber/green transitions, signal rails, and focal markers to break up repeated console geometry.
- Loop 63 route-depth pass: added a final destination-lock endpoint with twin jaws, amber lock bar, white core lamp, and cyan return clamps at the bottom of the route field.
- Loop 64 route-depth pass: lifted `.route-depth-art` opacity to `.74` with restrained contrast/saturation to improve lower-field legibility without changing geometry or interaction.
- Loop 65 route-depth pass: added six downward chevrons and three focal lamps as symbol-led continuation markers into the destination lock.
- Loop 66 route-depth pass: added three staggered non-interactive future-layer service seals, color-coded to the cyan/amber/green continuation language.
- Loop 67 route-depth pass: added a continuous cyan descent spine, four illuminated checkpoints, and four amber branch taps connecting the lower route landmarks.
- Loop 68 route-depth pass: added side collector claws, a central lock halo, and a lower return bridge to densify the final termination band.
- Loop 69 route-depth pass: added left-fork, center-crown, and right-fork end-stop modules anchored to the existing terminal assembly.
- Loop 70 route-depth pass: added paired vertical service elevators with segmented windows, opposing status rails, and cyan/amber focal lamps.
- Loop 71 route-depth pass: added an asymmetric maintenance gantry with offset brackets, a central reactor vault, and cyan/white/amber status lamps.
- Loop 72 route-depth pass: added a three-conductor collector-to-rail transfer bridge with four side clamps and a central relay lamp.
- Loop 73 route-depth pass: added cyan/amber side vaults, a central green gate, three focal lamps, and lateral conductors as symbol-led terminal pylons.
- Loop 74 HUD pass: restored the three-pip Stability tier, kept verbose element copy hidden, and capped the tall-viewport canvas to preserve 9:16 and 52px controls.
- Loop 75 HUD pass: added repeating calibration ticks and a restrained cyan edge to the 7px progress instrument without changing fill logic.
- Loop 76 responsive pass: reduced short-height canvas allocation to restore a 3px table/control separation at 320×568 while preserving the 9:16 ratio and 52px controls.
- Loop 77 HUD pass: added a compact visible `SCORE` prefix to the score-core plate so score, progress, and Stability read as explicit instruments.
- Loop 78 HUD pass: replaced the plain progress fill with segmented active cells and cyan/amber/white leading treatment while preserving fill logic.
- Loop 80 HUD pass: exposed the hidden elemental hinge/imprint state as a compact cyan-cued capsule within the existing 16px resource row; no gameplay or layout geometry changed.
- Loop 81 canvas pass: replaced the visually similar dual meter bars with labeled Charge/Target icon plates, six segmented cells, inactive tint, and a bright leading-cell cue inside the existing logical footprint.
- Loop 82 responsive pass: raised the fixed debug utility and panel above the 52px touch rail, preserving modal placement and preventing utility/control overlap.
- Loop 83 UX pass: hid the developer physics tuner by default and added an explicit `?debug=1` gate while preserving the tuning panel and active-game suppression.
- Loop 84 touch pass: restored `HOLD · LEFT/RIGHT` labels and stronger glyph hierarchy to the authored flipper plates while preserving exact rectangles and pointer behavior.
- Loop 85 onboarding pass: added a compact state-aware canvas cue for cradle, launch, upper-bank target, and open-chute objectives without changing collision or layout geometry.
- Loop 86 lower-mid pass: added mirrored cyan/amber transfer pods and a centered illuminated relay vault to break up the return field while preserving physics and layout contracts.
- Loop 87 asset hierarchy pass: demoted repeated deck-inset rails and separators so the central travel lane stays quieter than dynamic targets and side machinery.
- Loop 88 telemetry pass: replaced tiny `CHARGE`/`TARGET` meter labels with icon-first `CHG`/`AIM` labels at 9px while preserving live segmented values and geometry.
- Loop 89 CTA pass: converted the pre-descent action plate to an icon-first launch control while preserving exact CTA geometry and transition behavior.
- Loop 90 upgrade-card pass: authored the post-route module choices with icon wells, focal side rails, readable hierarchy, cost capsules, and non-color disabled treatment.
- Loop 91 terminal-state pass: added authored success/failure emblems and compact SALVAGE/SCORE outcome instruments while preserving reset mechanics and viewport contracts.
- Loop 92 modal-shell pass: added shared corner hardware, segmented top/bottom rails, recessed hatch texture, and inset shading without changing card or CTA geometry.
- Loop 93 route-tail pass: added an authored three-module terminal bridge above the status rail and reinforced the route-depth termination band without changing route topology or interaction geometry.
- Loop 94 reaction pass: added distinct Fire, Water, Earth, and Air canvas motifs at reaction coordinates while preserving impact rings, score popups, physics, and mobile geometry.
- Loop 95 microcopy pass: replaced cryptic active-table `CHG`/`AIM` labels with icon-led `FUEL`/`TARGET` labels without changing meter geometry or gameplay behavior.
- Loop 96 identity pass: paired larger authored state symbols with one-word table labels inside the existing identity plate without changing active-play geometry.
- Loop 97 status pass: replaced the cryptic hinge/imprint line with live 10px LEFT/RIGHT/NO IMPRINT chips while preserving the 16px HUD row and all geometry contracts.
- Loop 98 focus pass: removed hidden debug, reset, objective-tip, and route-overlay controls from keyboard focus while preserving intentional debug access and player-facing geometry.
- Loop 99 copy pass: reconciled the canonical four-descent run length across the live HUD, README, and current build documentation without changing stage logic.
- Loop 100 visual pass: replaced the wide center objective card with a 48–52px icon-led signal badge capped at 20% canvas width, preserving lane visibility and gameplay geometry.
- Collision fix: flipper sweep now samples the previous ball position during activation, preventing tip pass-through and preserving the effective flipper length.
- Follow-up correction: restored moving-ball sweep semantics and added a current-position check across interpolated flipper poses to prevent false held-flipper sticking.
- Overhaul kickoff: physics/UI/visual reset canonized with material-force physics, mine/tunnel depth, object damage taxonomy, element stack budgets, and AAA-mobile reference gates.
