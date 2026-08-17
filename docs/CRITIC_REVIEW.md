# Deadlight Critic Review — Pass 24

## Verdict

**Playable hackathon slice: PASS. AAA-ready: FAIL.** The current build now communicates a tighter run loop: map a descent, cradle a charged hinge, launch an imprinted ball into matching machinery, then choose either a route modifier or elemental hinge module. It is still a code-drawn prototype and needs another dedicated polish pass before it can credibly claim AAA.

## Findings

- **Gameplay clarity — PASS/WEAK:** The HUD now exposes route, score, progress, Stability, hinge attunements, and active imprints. Route choices are visible after each completed descent. The remaining weakness is that a player must discover the exact cradle geometry through play; a short animated first-use hint would improve onboarding.
- **Elemental loop — PASS:** Hinge cradling applies stacks, matching targets/generators/relays react, and route modifiers change gravity or launch kick. Fire, Water, Earth, and Air have distinct hooks, but the reactions still share a common feedback language.
- **Visual direction — WEAK:** The table has stronger depth planes, edge machinery, local glows, and impact rings. It remains primarily procedural Canvas geometry; authored silhouettes, animation language, and asset variety are not yet at AAA quality.
- **Mobile UX — PASS/WEAK:** Touch controls are dedicated, 48px minimum, keyboard-compatible, and responsive at narrow widths. The route/module list is information-dense on very short screens and needs a focused card carousel or two-step choice flow.
- **Physics/readability — WEAK:** Fixed-step physics and debug tuning remain useful. Real-device testing is still required for cradle timing, drain fairness, and route-modifier feel.
- **Delivery — PASS with evidence gap:** Hosted URL responds HTTP 200 and the static build is offline-safe. The browser harness was unavailable in one attempt because of a missing `oci` dependency; a later critic run did verify the hosted 320px layout with `scrollWidth === clientWidth`.

## Next-pass blockers

1. Add a first-run cradle tutorial that points at the hinge and demonstrates one charged imprint.
2. Split route selection from module selection on short mobile screens; do not force eight dense choices into one panel.
3. Give each elemental reaction a distinct animation/audio cue while preserving offline-safe assets.
4. Playtest on physical phones at 320/360/390 CSS widths and record screenshots plus touch interruption behavior.
5. Add one boss or threat table and one explicit resource/free-pass table so progression is not only a choice screen.

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
