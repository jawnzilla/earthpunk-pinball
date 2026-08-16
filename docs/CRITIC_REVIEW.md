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
- Corrective hinge gameplay pass: elemental imprint triggers on cradle entry only, preventing held-flipper refresh farming.
- Relative-contact physics pass: replaced angle/target/escape launch overrides with ball-versus-rotating-flipper contact resolution; rolling velocity and flipper surface velocity now remain in the same solver.
- POP baseline / angle-driven launch pass: default profile is POP; fresh hits inherit the active flipper angle instead of forcing vertical launches.
- Surface Vault identity pass: reward route now has distinct signal-violet styling and `SURFACE VAULT // SIGNAL OPEN` table identity.
- Corrective angle response pass: early/late flipper activation now produces a materially different launch vector.
- Hinge cradle pass: slow held hinge contact settles into a persistent cradle; releasing the flipper rolls the ball out instead of leaving a sticky hinge state.
- Gameplay route pass: post-stage route menu selection removed; reachable exits are physically chosen through opened chutes, with a read-only pre-level branching map.