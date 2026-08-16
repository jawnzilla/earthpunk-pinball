# Deadlight Build Log

## 2026-08-14 — Prototype 01: playable table slice

### Locked decisions

- Theme: Earthpunk underground society attempting to tunnel back to the surface.
- Genre target: Survival & Resource Management.
- Player fantasy: keep an excavation probe alive while mapping a route through buried infrastructure.
- Interaction: portrait pinball with touch flippers and keyboard fallback.
- Offline constraint: no external requests, remote fonts, CDN libraries, or hosted assets.
- First milestone: prove the physical table is satisfying before adding the roguelike upgrade layer.

### Implemented

- Responsive portrait Canvas table.
- Touch and keyboard flipper controls.
- Six salvage targets.
- Three generator bumpers.
- Charge and salvage meters.
- Stability-based loss condition.
- Surface-signal win condition.
- Reset flow.
- Earthpunk visual treatment using code-drawn shapes and system fonts.

### Verification notes

- Local browser verification is required before this entry is considered complete.
- Hosted GitHub Pages verification will be recorded after the first push and deployment.

### Next session

- Test touch controls on a real phone.
- Tune ball speed, drain forgiveness, and flipper response.
- Add the first between-stage upgrade choice.
- Add escalating hazards so the survival category is visible in the run, not only in the documentation.

## 2026-08-14 — Prototype 02: flipper feel and drain safety

### Locked decisions

- Flippers rest at a slight downward angle toward the outside edges.
- Flippers remain solid collision surfaces while idle.
- Activated flippers animate toward an upward striking angle.
- Post-collision ball speed is capped to keep returns playable.
- Side drain guards protect the ball from draining outside the flippers while preserving the center drain risk.

### Implemented

- Segment-based flipper collision instead of activation-only bounce zones.
- Animated flipper rotation with touch/keyboard activation feedback.
- Side guard rails with collision and visible rendering.
- Global ball velocity cap after bumper and flipper impacts.
- Pointer-capture fallback so non-standard pointer environments do not break input.

### Verification notes

- Clean local load renders the portrait table.
- Resting flippers visibly angle downward.
- Synthetic left activation visibly raises the left flipper.
- Reset and touch event path remain functional.
- Offline scan and `git diff --check` pass.

## 2026-08-14 — Prototype 03: core table read and flipper geometry

### Harsh review findings

- The previous flippers pointed outward, leaving an oversized center drain and failing the expected pinball read.
- The table read as a debug diagram rather than a physical machine because the hierarchy and action affordances were weak.
- The ball had no motion trail, making fast movement harder to read on mobile.

### Implemented

- Moved flipper pivots outward and tips inward to create a readable protected center lane.
- Kept the slight downward resting angle and upward activated angle.
- Added a restrained ball trail for motion readability.
- Added explicit in-table `LEFT FLIPPER` / `RIGHT FLIPPER` touch affordances that switch to `LIFT` while pressed.

### Verification notes

- Corrected endpoints now converge toward the center drain rather than the walls.
- `node --check` passes for the extracted game script.
- Offline-resource scan passes.
- `git diff --check` passes.
- Browser visual deployment review remains pending because the optional remote-debug browser harness is blocked by Chrome consent; do not treat this phase as AAA-complete.

## 2026-08-14 — Prototype 04: descent progression and run upgrades

### Harsh review findings

- The initial slice did not yet demonstrate the selected Survival & Resource Management genre strongly enough.
- A complete session needed within-run escalation and a meaningful decision point, not only a final win screen.

### Implemented

- Added a three-descent run structure.
- Added a between-descent upgrade choice with three materially different effects:
  - Reinforced bulkhead: increases maximum Stability and restores one point.
  - Tuned launch coil: raises the safe ball-speed ceiling.
  - Salvage magnet: increases Charge gained from targets.
- Added stage-aware HUD messaging and a deeper-descent transition.
- Added a real upgrade selection overlay with touch-friendly buttons.

### Verification notes

- `node --check` passes for the extracted game script.
- Offline-resource scan passes.
- `git diff --check` passes.
- Full browser playthrough and deployed visual review remain required before treating this phase as complete.

## 2026-08-14 — Prototype 05: fixed-step physics timing

### Harsh review finding

The original simulation advanced once per render frame. That made gravity, damping, flipper animation, collision response, and timers vary with device refresh rate.

### Implemented

- Added a fixed-step accumulator at 60 simulation steps per second.
- Capped catch-up work after long pauses to avoid a spiral of updates.
- Kept rendering independent from simulation cadence.

### Verification notes

- `node --check` passes for the extracted game script.
- Offline-resource scan passes.
- `git diff --check` passes.
- Cross-refresh-rate playtesting remains required on real devices.

## 2026-08-14 — Prototype 06: resilient touch release

### Harsh review finding

The touch handler released controls based on the release coordinate. Dragging across the table could leave the originally pressed flipper active, and pointer capture loss had no cleanup path.

### Implemented

- Track the pointer's active flipper side independently from release location.
- Clear the correct side on pointerup.
- Clear all relevant state on pointercancel and lostpointercapture.
- Keep the handler resilient to synthetic or interrupted pointer sessions.

### Verification notes

- `node --check` passes for the extracted game script.
- Offline-resource scan passes.
- `git diff --check` passes.
- Real-device drag and interruption testing remains required.

## 2026-08-14 — Prototype 07: reset control hygiene

### Harsh QA finding

Reset recreated the gameplay state but did not clear held keyboard state. A run restarted while a key remained logically pressed could begin with a flipper stuck active.

### Implemented

- Reset now clears both flipper input flags.
- Reset clears the active pointer side.
- Reset clears all keyboard key state.

### Verification notes

- `node --check` passes for the extracted game script.
- Offline-resource scan passes.
- `git diff --check` passes.
- Full real-device interruption testing remains required.

## 2026-08-14 — Prototype 08: industrial depth pass

### Harsh visual findings

- The upgrade screen read as a generic web modal rather than an in-world machine interface.
- Upgrade choices were visually identical and lacked iconography or hierarchy.
- The playfield still read as a flat debug diagram instead of physical underground machinery.

### Implemented

- Added a framed, layered upgrade console with safe viewport height and overflow handling.
- Added upgrade icons, stronger selection states, material gradients, and industrial panel treatment.
- Added a layered playfield deck with directional lighting, restrained bioluminescent core glow, inset rails, vertical service ribs, and a gradient reactor housing with indicator bolts.
- Preserved the offline-safe, code-drawn asset strategy.

### Verification notes

- `node --check` passes for the extracted game script.
- Offline-resource scan passes.
- `git diff --check` passes.
- Live visual review remains required after deployment; browser screenshot tooling is still blocked by Chrome remote-debugging consent.

## 2026-08-14 — Prototype 09: multi-input pointer correctness

### Harsh QA findings

- A touch release could disable a still-held keyboard flipper because input sources overwrote each other.
- A stale pointerup/pointercancel/lostpointercapture event could clear a newer active pointer.

### Implemented

- Added active pointer-ID tracking.
- Added a single `syncInput` path that composes keyboard and touch state.
- Ignored cleanup events belonging to stale pointer IDs.
- Preserved reset, cancel, and lost-capture cleanup behavior.

### Verification notes

- `node --check` passes for the extracted game script.
- Offline-resource scan passes.
- `git diff --check` passes.
- Multi-input and multi-pointer behavior should still be exercised on a real touch device.

## 2026-08-14 — Prototype 10: localized impact feedback

### Harsh feel finding

The table previously communicated impacts mostly through a global flash and text message. That made fast targets and generators difficult to read spatially and weakened the tactile connection between ball, machine, and resource gain.

### Implemented

- Added bounded localized impact effects for salvage targets and generator bumpers.
- Added expanding rings and short spark bursts at the exact impact location.
- Kept the global flash as a restrained secondary cue.
- Capped active effects to prevent unbounded memory or draw growth.

### Verification notes

- `node --check` passes for the extracted game script.
- Offline-resource scan passes.
- `git diff --check` passes.
- Visual intensity and readability should be checked on a real phone before adding more effects.

## 2026-08-14 — Prototype 11: ball arc and drain geometry correction

### Player correction

- Gravity was too strong, compressing the ball's flight and making flipper timing feel restrictive.
- The outer funnel rails were too long and misaligned with the shortened flipper row, creating a risk of trapped side rebounds.
- The flippers needed a more explicit center drain gap.

### Implemented

- Reduced gravity from `0.115` to `0.08` per fixed simulation step.
- Shortened both flippers to leave a clear center drain gap.
- Repositioned outer funnel rails closer to the flipper row.
- Kept both rails sloping inward toward the playable table rather than forming side pockets.

### Verification notes

- `node --check` passes for the extracted game script.
- Offline-resource scan passes.
- `git diff --check` passes.
- Real-phone tuning remains required for final gravity and drain feel.

## 2026-08-14 — Prototype 12: edge service machinery silhouettes

### Harsh art finding

The table still read as a decorated diagram because the frame had no authored manufactured silhouettes, shell thickness, or localized edge hardware.

### Implemented

- Added a central dark drain throat behind the flippers.
- Added side hinge housings aligned to the flipper pivots.
- Added amber service indicator slits near each hinge.
- Added a split retaining bar that frames the drain without closing it.
- Kept all new detail at the perimeter so the center target field remains readable.

### Verification notes

- `node --check` passes for the extracted game script.
- Offline-resource scan passes.
- `git diff --check` passes.
- Mobile visual review remains required at narrow CSS viewports.

## 2026-08-14 — Prototype 13: contact-aware flipper feedback

### Harsh feel finding

Flipper and rail collisions were boolean-only, so the renderer could not place feedback at the actual contact point. This made active flipper hits feel disconnected from the ball response.

### Implemented

- `segmentCollision` now returns contact position and normal data on a hit.
- Active flipper hits emit a restrained local amber impact cue.
- Added a short cooldown to prevent effect spam during sustained overlap.
- Kept rails and inactive flippers free of global flashes.

### Verification notes

- `node --check` passes for the extracted game script.
- Offline-resource scan passes.
- `git diff --check` passes.
- Contact behavior still needs real-device playtesting.

## 2026-08-14 — Prototype 14: flipper spacing, funnel direction, and kick tuning

### Player correction

- Flippers still left too little room for a readable center drain.
- Side funnel panels sloped outward toward the lower edge, steering the ball away from the flippers.
- Active flipper kick was too soft.

### Implemented

- Moved pivots outward to x=64 and x=296.
- Shortened both flippers to length 86, widening the center gap.
- Reversed side-guard endpoints so the lower funnel exits point inward toward the flipper row.
- Increased active flipper kick from 1.2 to 2.05 and inactive contact kick from .15 to .2.
- Realigned hinge housings with the new pivots.

### Verification notes

- `node --check` passes for the extracted game script.
- Offline-resource scan passes.
- `git diff --check` passes.
- Real-device playtesting remains required for final kick strength.

## 2026-08-14 — Prototype 15: center drain and narrow HUD correction

### Harsh QA findings

- Resting flippers overlapped in collision space, physically blocking a centered ball from draining.
- The single-line header could collide or overflow at 320px CSS width.

### Implemented

- Shortened flippers from length 86 to 78 while keeping pivots outward at x=64/296.
- Resting tip gap is now approximately 78px before collision expansion, safely wider than the ball diameter plus flipper widths.
- Added a narrow-width header rule for 360px and below with constrained status width and reduced typography.
- Added `min-width: 0` to header regions to prevent flex overflow.

### Verification notes

- `node --check` passes for the extracted game script.
- Numeric center-gap check passes.
- Offline-resource scan passes.
- `git diff --check` passes.
- Real-phone drain and 320px layout checks remain required.

## 2026-08-14 — Prototype 16: lower-funnel safety and drain readability

### Harsh review findings

- A lower guard endpoint could eject a valid ball outward, causing an unfair immediate drain.
- Active kick was applied even when the ball was already moving away from a segment.
- The central machinery wedge visually filled the drain zone.
- Fixed 9px/11px Canvas labels were too small on narrow phones.

### Implemented

- Shortened side-guard endpoints to meet the flipper zone safely at `H - 70`.
- Applied flipper kick only when the ball is approaching the segment normal.
- Reduced the central throat silhouette to the immediate drain edge, preserving an open visual gap.
- Increased lower flipper labels and meter labels to 13px intrinsic Canvas text.

### Verification notes

- `node --check` passes for the extracted game script.
- Offline-resource scan passes.
- `git diff --check` passes.
- New lower-rail simulation should be repeated against the deployed build.

## 2026-08-14 — Prototype 17: guard/flipper collision separation

### Harsh QA findings

- Side-guard and flipper collision envelopes overlapped near the pivots, creating ambiguous sequential contacts and a sticky-launch risk.
- The narrow HUD subtitle used nowrap, creating an avoidable overflow risk at 320px.

### Implemented

- Shortened the collidable side guards to end at outer points `(48, H-82)` and its mirror, leaving clearance from the flipper pivots and noses.
- Kept the guard slope inward while removing the overlapping collision volume.
- Allowed the narrow subtitle to wrap within a bounded 150px region.

### Verification notes

- `node --check` passes for the extracted game script.
- `git diff --check` passes.
- Offline-resource scan passes.
- Guard-to-flipper segment-distance regression should be rerun against the deployed build.

## 2026-08-14 — Prototype 18: weighted flipper catch and launch

### Player correction

The flippers previously used nearly the same high-restitution collision for both held and released states. A descending ball therefore bounced out of a held flipper instead of settling into a controllable catch, while active hits were not forceful enough.

### Implemented

- Held flippers now use low restitution `0.46` to absorb descending impact.
- Held flippers now use a stronger directional kick `2.65` for deliberate launches.
- Released flippers use restitution `0.82` and passive kick `0.2`.
- The global speed cap remains enforced after every contact.

### Verification notes

- `node --check` passes for the extracted game script.
- Offline-resource scan passes.
- `git diff --check` passes.
- Catch, release, and hard-launch behavior still require real-device tuning.

## 2026-08-14 — Prototype 19: motion-aware flipper catch

### Harsh physics finding

Low active restitution alone did not guarantee a catch because the active kick was still applied on every held overlap. A stationary held flipper could continue launching a descending ball instead of absorbing it.

### Implemented

- Added per-flipper angular velocity tracking.
- Stationary held flippers use restitution `0.14` and kick `0.08`, allowing a descending ball to settle.
- Moving flippers ramp kick from angular velocity up to `2.65` and use restitution `0.46` for a hard launch.
- Released flippers retain restitution `0.82` and passive kick `0.2`.
- Global speed cap remains enforced after every collision.

### Verification notes

- `node --check` passes for the extracted game script.
- Offline-resource scan passes.
- `git diff --check` passes.
- Catch, release, high-speed descent, and hard-launch behavior require real-device tuning.

## 2026-08-14 — Prototype 20: visible flipper motion state

### Harsh visual finding

The heavier physics behavior was not visually communicated: angular velocity affected collision math but not the rendered flipper. Long `LEFT FLIPPER` / `RIGHT FLIPPER` labels also crowded the lower drain zone on mobile.

### Implemented

- Moving active flippers now render with a brighter core and stronger amber glow.
- Stationary held flippers retain a softer warm glow, distinguishing catch state from launch state.
- Replaced long lower labels with persistent compact `LIFT L` and `LIFT R` labels.
- Kept labels centered and clear of the drain opening.

### Verification notes

- `node --check` passes for the extracted game script.
- Offline-resource scan passes.
- `git diff --check` passes.
- Mobile screenshot verification remains blocked by Chrome remote-debugging consent.

## 2026-08-14 — Prototype 21: single-impulse flipper contacts

### Player correction

- Active flippers still felt weak because the launch impulse capped too low.
- A ball rolling along a flipper could trigger consecutive-frame impulses, producing a weak-looking double hit instead of one decisive launch.

### Implemented

- Added per-flipper continuous-contact locks.
- Each flipper now applies its activation impulse once per contact and waits for separation before arming again.
- Increased motion-scaled launch kick cap from `2.65` to `4.2`.
- Stationary held catches retain zero-like kick; released flippers retain passive kick.
- Global speed cap remains enforced.

### Verification notes

- `node --check` passes for the extracted game script.
- Offline-resource scan passes.
- `git diff --check` passes.
- High-speed single-hit, rolling-contact, and catch/release behavior require real-device tuning.

## 2026-08-14 — Prototype 22: spatially honest drain

### Harsh physics finding

The drain condition was global: any ball below the bottom threshold lost stability, including balls outside the visual center opening. That contradicted the machine silhouette and could create unfair edge drains.

### Implemented

- Center drain now requires `145 < ball.x < 215` in the intrinsic 360px table.
- Balls reaching the lower threshold outside the center opening rebound from a restrained lower lip instead of losing stability.
- Center drain remains the only path that consumes a descent.

### Verification notes

- `node --check` passes for the extracted game script.
- Offline-resource scan passes.
- `git diff --check` passes.
- Center and edge drain paths should be exercised on a real device.

## 2026-08-14 — Prototype 23: lower-lip escape and drain alignment

### Harsh review findings

- Edge balls could repeatedly hit the horizontal lower lip, lose energy, and remain trapped indefinitely.
- The collision drain range was wider than the visible throat, allowing a ball to drain outside the apparent opening.
- The lower lip lacked a strong continuous hardware edge.

### Implemented

- Narrowed the center drain rule to `156 < ball.x < 204`, matching the visible throat.
- Added a minimum inward horizontal escape velocity for edge-lip rebounds.
- Added a minimum upward escape velocity so edge contacts cannot settle into a zero-energy loop.
- Drew a high-contrast split lower lip at the exact drain threshold, leaving the center opening visibly empty.

### Verification notes

- `node --check` passes for the extracted game script.
- Offline-resource scan passes.
- `git diff --check` passes.
- Edge-loop and center-drain harness tests should be repeated against the deployed build.

## 2026-08-14 — Prototype 24: respawn lock reset and responsive controls

### Harsh review findings

- Flipper contact locks could survive a ball respawn, suppressing the first valid impulse of the next ball.
- Fixed intrinsic label sizing became too small after responsive Canvas scaling and had no contrast backing.

### Implemented

- `spawnBall()` now clears both continuous-contact locks.
- Lower control labels derive their intrinsic font size from Canvas display scale.
- Labels maintain at least a 14px CSS-equivalent target size, capped for large displays.
- Added dark backing rectangles, border, and text outline for `LIFT L` / `LIFT R`.
- Kept labels inside the canvas with bottom clearance.

### Verification notes

- `node --check` passes for the extracted game script.
- Offline-resource scan passes.
- `git diff --check` passes.
- Exact 280/320/360 viewport screenshots remain required for final visual signoff.

## 2026-08-14 — Prototype 25: reserved mobile control band

### Harsh visual finding

The responsive control backing boxes extended below the table shell and crowded the split lower lip. Moving them directly above the lip would overlap the flipper shoulders.

### Implemented

- Moved `LIFT L` / `LIFT R` backing boxes into a reserved band above the pivot/guard zone.
- Kept the display-scale-derived font and 14px CSS-equivalent target.
- Preserved dark backing, border, and outline treatment.
- Kept the drain/lip region visually open and unobstructed.

### Verification notes

- `node --check` passes for the extracted game script.
- Offline-resource scan passes.
- `git diff --check` passes.
- Exact 280/320/360 viewport screenshots remain required for final visual signoff.

## 2026-08-14 — Prototype 26: pivot-clear control labels

### Harsh mobile finding

The reserved label band was within the canvas and clear of the flipper centers, but its backing boxes overlapped the upper 6px of the 19px pivot housings.

### Implemented

- Moved label backing boxes from `H-110..H-88` to `H-118..H-96`.
- Moved label text with the band.
- Preserved width scaling, shell bounds, and the 53px lower-lip clearance.
- New label bottom is `y=544`, clearing the pivot ring start at `y=546`.

### Verification notes

- `node --check` passes for the extracted game script.
- Offline-resource scan passes.
- `git diff --check` passes.
- Exact viewport visual capture remains the final mobile signoff step.

## 2026-08-14 — Prototype 27: short-viewport Canvas sizing

### Harsh visual finding

A headless 320px bitmap exposed a possible right-edge crop, but a computed-layout probe showed Chrome desktop headless was using a 764px CSS viewport and then rasterizing to 320px. The product still needed a deterministic short-viewport sizing rule independent of intrinsic Canvas dimensions.

### Implemented

- Added `min-width: 0` and overflow containment to the table wrapper.
- Added a short-viewport rule that sizes Canvas width from the available height using the 9:16 ratio.
- Preserved `max-width: 100%` so the Canvas cannot exceed the content column on real mobile CSS viewports.

### Verification notes

- `node --check` passes for the extracted game script.
- Offline-resource scan passes.
- `git diff --check` passes.
- Desktop headless visual capture is not accepted as mobile pixel evidence without mobile emulation; real-device or CDP device emulation remains required.

## 2026-08-14 — Prototype 28: live physics tuning and authoritative drain

### Player correction

The ball still felt too light and flipper strength required repeated code edits to tune. A lower wall also visually and physically suggested a save after the ball should have drained.

### Implemented

- Added a collapsible `TUNE` panel with live sliders for:
  - Gravity
  - Active kick
  - Catch damping
  - Moving rebound
  - Passive rebound
  - Speed cap
- Slider changes apply immediately to the running simulation.
- Removed the non-center lower-lip rebound branch; crossing the drain threshold now always costs stability and respawns/ends the run.
- Removed the bright lower-wall stroke that falsely implied a playable deflector.
- Kept the retaining bar above the drain as visual machine framing only.

### Verification notes

- `node --check` passes for the extracted game script.
- Offline-resource scan passes.
- `git diff --check` passes.
- Slider tuning and drain behavior require live gameplay testing.

## 2026-08-14 — Prototype 29: anti-hug flipper contact and stronger defaults

### Player correction

The ball could follow a flipper when rolling tangentially because the collision solver only reflected velocity when the ball was moving into the blade. Positional separation alone left a tangential contact that looked glued to the flipper.

### Implemented

- Set tuning defaults to gravity `0.08`, active kick `6`, catch damping `0.30`, moving rebound `0.50`, passive rebound `0.30`, and speed cap `7`.
- Reset state now inherits the live speed-cap default instead of reverting to `6.4`.
- Flipper kick scaling now reaches the requested active-kick ceiling on a well-timed swing.
- Segment contacts now guarantee an outward normal velocity at least equal to the supplied kick, even when the ball is rolling along the blade rather than into it.
- Existing contact locks remain in place, so the fix does not reintroduce repeated impulses while the ball stays in contact.

### Verification notes

- `node --check` passes for the extracted game script.
- Focused tangential-contact regression passes: the ball exits at `6.0` normal velocity instead of hugging the segment.
- Speed-cap regression passes at `7.0`.
- Offline-resource scan passes.
- `git diff --check` passes.

## 2026-08-14 — Prototype 30: sealed funnel-to-wall guide

### Player correction

A gap existed between each angled funnel guard and the outer table wall. A ball could enter that seam and become trapped instead of continuing toward the flippers or drain.

### Implemented

- Extended the side guard endpoints to the table-wall collision surface using the same `table.left` geometry that defines the outer wall.
- Kept the render and collision segments shared, so the visible funnel now closes the physical seam.

### Verification notes

- `node --check` passes for the extracted game script.
- Guard endpoints now begin at `x=26` and `x=334`, matching the inner edge of the 5px table wall stroke.
- `git diff --check` passes.

## 2026-08-14 — Prototype 31: rolling-contact separation

### Player correction

The first anti-hug fix guaranteed separation on the initial flipper impact, but a ball rolling down the blade could remain in contact on later frames because the single-hit lock suppressed all additional kick.

### Implemented

- Added a live `Contact separation` slider, default `0.70`.
- First active contact still receives the full configured active kick.
- Subsequent active locked contacts receive only the smaller separation force, preventing repeated full-power hits while forcing the ball away from the blade.
- Passive contacts remain at the lower `.2` separation value.

### Verification notes

- `node --check` passes for the extracted game script.
- Focused first-contact, tangential-contact, and speed-cap regressions remain green.
- `git diff --check` passes.

## 2026-08-14 — Prototype 32: upward flipper escape and tuning help

### Player correction

A ball could still roll down the blade while technically separating along the collision normal. The visual symptom remained a ball attached to the flipper slope instead of launching upward.

### Implemented

- Added an explicit upward escape velocity to active flipper contacts.
- First active contact forces at least `2.2` upward velocity, or 75% of the calculated kick when higher.
- Locked follow-up contacts use the configurable `Contact separation` value as their upward escape.
- Added concise inline help and hover descriptions for every tuning slider.

### Slider meanings

- Gravity: downward acceleration per fixed update; higher feels heavier.
- Active kick: maximum first-hit flipper impulse.
- Catch damping: rebound retained by a stationary held flipper.
- Moving rebound: rebound retained when the flipper is moving.
- Passive rebound: rebound from a released flipper acting as a rail.
- Contact separation: small outward/upward push while active contact remains locked.
- Speed cap: hard maximum ball speed.

### Verification notes

- `node --check` passes for the extracted game script.
- Existing tangential-contact and speed-cap regressions remain green.
- `git diff --check` passes.

## 2026-08-14 — Prototype 33: swept flipper collision and angled respawn

### Player correction

The ball could cross a moving flipper between fixed updates and appear on the other side without a collision. Respawns also used a small random lateral velocity, so some balls launched nearly straight toward the center drain.

### Implemented

- Segment collision now samples the current, previous, and midpoint ball positions, catching fixed-step crossings through the flipper.
- Removed the bottom-center bumper from the shared bumper list, eliminating both its collision and render.
- Respawn launches now choose a side and use lateral velocity `1.1–1.8` with upward velocity `-5.2`, guaranteeing a visibly angled launch.

### Verification notes

- `node --check` passes for the extracted game script.
- Swept samples use the same collision geometry as the rendered flippers.
- `git diff --check` passes.

## 2026-08-14 — Prototype 34: level variants, flipper modules, and relay gate

### Gameplay expansion

The prototype now has a stronger run structure beyond one repeated table: each descent changes routing, bumper behavior, and the available flipper build path.

### Implemented

- Added named layouts: `Generator Well`, `Pulse Manifold`, and `Split Reactor`.
- Added bumper variants:
  - Standard generators: normal rebound and small Charge gain.
  - Pulse bumpers: stronger rebound, animated amber shell, and larger Charge gain.
  - Armored bumpers: muted lower-rebound bumpers with an inner armor ring.
- Added a level-specific relay gate rail in descents 2 and 3. It changes ball routing and grants Charge/Score when struck, with a cooldown to prevent farming.
- Added persistent between-level flipper modules:
  - Hydraulic flipper arms: active kick and moving rebound bonus.
  - Extended flipper arms: longer collision/render geometry.
- HUD now names the active descent layout.
- Updated tuning defaults:
  - Gravity `0.70`
  - Active kick `8`
  - Catch damping `0.00`
  - Moving rebound `0.10`
  - Passive rebound `0.30`
  - Contact separation `2.00`
  - Speed cap `7`

### Verification notes

- `node --check` passes for the extracted game script.
- All three layouts, seven tuning controls, persistent flipper module fields, and relay gate hooks are present in source.
- `git diff --check` passes.

## 2026-08-14 — Prototype 35: Charge-funded flipper modules

### Economy link

The between-level flipper modules were previously free choices, so Charge had no meaningful build decision attached to them.

### Implemented

- Hydraulic flipper arms now cost `3 Charge`.
- Extended flipper arms now cost `4 Charge`.
- Upgrade cards display `FREE` or their Charge cost.
- Insufficient-cost cards are visibly disabled and cannot be selected.
- Charge is deducted only after a valid purchase.
- Existing free survival/economy upgrades remain available, preserving a fallback when the player cannot afford a module.

### Verification notes

- `node --check` passes for the extracted game script.
- Upgrade cost fields, disabled-card styling, affordability guard, and Charge deduction are present.
- `git diff --check` passes.

## 2026-08-14 — Prototype 36: armored bumper breach state

### Gameplay polish

The armored bumper variant previously only changed rebound strength and appearance. It now creates a readable two-hit objective in the Split Reactor.

### Implemented

- First armor impact cracks the bumper, awards a small score, and shows a visible amber crack.
- Second impact breaches the armor, resets it, and awards the larger salvage payout.
- Layout damage resets on a new run and when entering a new descent.
- The armor state is shared by collision and rendering, so the visual crack is authoritative.

### Verification notes

- `node --check` passes for the extracted game script.
- Armor hit-state, reset hooks, breach payout, and crack rendering are present.
- `git diff --check` passes.

## 2026-08-14 — Prototype 37: Charge Chain scoring

### Gameplay polish

The expanded tables now reward maintaining a route through multiple interactables instead of treating every hit as an isolated event.

### Implemented

- Added a Charge Chain multiplier shared by salvage targets, bumper impacts, and relay gates.
- Chain starts at `x1.00`, increases by `0.25` per chained contact, and expires after 90 fixed updates without a contact.
- Chain multiplier increases Score rewards, not Charge inflation.
- Added a visible `CHAIN xN` readout beneath the top meters.
- Contact messages now communicate chain value during pulse and relay interactions.

### Verification notes

- `node --check` passes for the extracted game script.
- Chain state, timeout decay, reward multiplication, and HUD readout are present.
- `git diff --check` passes.

## 2026-08-14 — Prototype 38: layout-specific target banks

### Level variation

The three layouts previously changed lower-table routing but reused the same six-target pattern. Target banks now reinforce each layout’s intended route.

### Implemented

- Generator Well keeps the balanced opening target pattern.
- Pulse Manifold spreads targets around the horizontal relay gate and pulse bumper field.
- Split Reactor creates a wide side-versus-center target route around the vertical gate and armored bumpers.
- Target positions and radii are applied when a run starts and whenever a new descent is entered.
- Target collision and rendering continue to use the same mutable target objects, preserving the existing hit/state path.

### Verification notes

- `node --check` passes for the extracted game script.
- All three target banks, layout-application hooks, and existing bumper/gate variants are present.
- `git diff --check` passes.

## 2026-08-14 — Prototype 40: separate Split Reactor target from gate

### Critic correction

The Split Reactor’s lower center target was positioned directly on the vertical relay gate, causing the target and routing obstacle to overlap in both silhouette and collision space.

### Implemented

- Moved the lower center target from `x=180` to `x=155` at `y=330`.
- The vertical relay remains at `x=180`, preserving a distinct target-versus-gate routing decision.

### Verification notes

- `node --check` passes for the extracted game script.
- Split Reactor target and gate coordinates are now separated by 25px.
- `git diff --check` passes.

## 2026-08-14 — Prototype 41: anti-stick swept flipper correction

### Player correction

The swept flipper solver could repeatedly reuse a previous in-contact sample and reposition an exiting ball back onto the blade, producing a complete freeze against the flipper.

### Implemented

- Swept collision now samples only the current position and the frame midpoint.
- Midpoint hits are accepted only when velocity is entering the flipper segment.
- Exiting balls are no longer pulled backward into a stale contact point.
- Corrected gravity default to `0.07`.
- Gravity slider range is now `0.01–0.13`, placing `0.07` at the center of the slider range.

### Verification notes

- `node --check` passes for the extracted game script.
- Anti-stick entering/exiting sweep guards and gravity defaults are present.
- `git diff --check` passes.

## 2026-08-14 — Prototype 42: damp terrain, stronger active impacts

### Player correction

The ball retained too much energy from terrain while active flipper and bumper impacts felt weak. The issue was material response, not one global speed value.

### Implemented

- Dampened outer wall restitution from `.96` to `.78`.
- Dampened top wall restitution from `.92` to `.72`.
- Dampened funnel-guard restitution to `.58`.
- Increased standard bumper restitution to `1.60`.
- Increased pulse bumper restitution to `1.85`.
- Increased armored bumper restitution to `1.20`.
- Increased flipper motion scaling from `32` to `45`, allowing a timed swing to reach the configured active-kick ceiling of `8`.
- Kept the hard speed cap at `7` so stronger impacts do not become uncontrolled.

### Verification notes

- `node --check` passes for the extracted game script.
- Material restitution values and stronger flipper scaling are present.
- `git diff --check` passes.

## 2026-08-14 — Prototype 43: moving-tip flipper sweep

### Player correction

The ball could still tunnel through the flipper tip because the blade rotated between physics frames while collision only tested the new blade position.

### Implemented

- Added previous-angle flipper geometry for every fixed update.
- Swept the ball against the midpoint blade position as well as the current blade.
- Added a blade-closing test so a moving tip catches a tangential ball when the blade itself enters the ball’s radius.
- Preserved the stale-contact guard: the midpoint uses current-frame moving geometry, never an old ball position as a correction source.

### Verification notes

- `node --check` passes for the extracted game script.
- Moving-tip geometry, midpoint blade sweep, and blade-closing assertions are present.
- `git diff --check` passes.

## 2026-08-14 — Prototype 44: elemental upgrade modules and edge touch input

### Upgrade overhaul

The between-descent pool now presents elemental attunements instead of generic hardware labels.

- **Fire — Ember strike coil:** stronger active flipper kick and moving rebound; costs 3 Charge.
- **Water — Tidal catch lattice:** improves controlled catches and restores one Stability; costs 2 Charge.
- **Earth — Bedrock pressure shell:** adds maximum Stability and restores one point; free choice.
- **Air — Slipstream vanes:** extends both flippers and raises the controlled speed ceiling; costs 4 Charge.
- Earth salvage and Water repair variants preserve economy and recovery choices with the same elemental identity.
- Four locally generated emblem assets are stored under `assets/elements/` and loaded by the upgrade cards.

### Touch accessibility

Flipper input now listens across the full viewport’s left/right halves rather than only the Canvas bounds. Upgrade cards, buttons, and tuning controls are excluded from gameplay input, so UI remains tappable without accidentally firing a flipper.

### Verification notes

- `node --check` passes for the extracted game script.
- Elemental upgrade metadata, local asset paths, Water catch behavior, and full-viewport pointer listeners are present.
- `git diff --check` passes.

## 2026-08-14 — Prototype 45: hinge attunements and elemental reactions

### Physics defaults

- Gravity default is now `0.08`.
- Active kick default is now `12`.
- Catch damping remains `0`.
- Passive rebound now has a `0–0.6` range with a default of `0`, allowing a true stationary cradle.
- Contact separation remains `2`.
- Speed cap default is now `8`.

### Upgrade design correction

Elemental upgrades no longer modify ball physics. They install elemental modules at the two flipper hinge/cradle points.

- Fire, Water, Earth, and Air hinge modules cost Charge and can be stacked up to hinge level 3.
- A held flipper can cradle the ball near its pivot.
- Striking from that cradle applies the hinge’s elemental imprint.
- The ball can carry multiple elemental imprints while it moves between flippers.
- Each imprint stacks to three layers and decays over 360 fixed updates; cradle strikes and matching machinery refresh it.

### Environment reactions

Targets, bumpers, and relay gates now have elemental affinities. A matching ball imprint energizes the object, adds reaction score/Charge, refreshes the imprint, and produces a colored impact response.

### Visual implementation

- Hinge modules render colored rings, levels, and local generated emblem art at the flipper pivots.
- Active ball imprints render as layered elemental auras.
- Targets, bumpers, and relay gates expose their elemental affinity through colored rings and strokes.
- Runtime assets remain local under `assets/elements/`.

### Verification notes

- `node --check` passes for the extracted game script.
- Physics default, no-physics-upgrade, hinge imprint, stack/decay, environment reaction, visual, and local-asset assertions pass.
- `git diff --check` passes.

## 2026-08-14 — Prototype 46: moving-flipper catch and drain recovery

### Player correction

After lowering stationary rebound to zero, a moving tip could still pass through the ball because the midpoint sweep rejected contacts unless a directional velocity test happened to agree with the blade’s rotation.

### Implemented

- Any overlap with the current-frame moving flipper midpoint is now a valid swept contact.
- The solver still uses only current/midpoint ball samples, so the earlier stale-position sticking bug remains blocked.
- The drain branch now returns immediately after spawning a replacement ball.
- A zero-Stability drain returns immediately through the loss state instead of continuing the dead ball’s frame.

### Verification notes

- `node --check` passes for the extracted game script.
- `git diff --check` passes.

## 2026-08-14 — Prototype 47: five-point moving flipper sweep

### Player correction

The two-point moving sweep could still miss a fast ball/tip crossing when neither the midpoint nor endpoint overlapped the blade radius. The apparent no-respawn case could also be contaminated by the same update continuing after a target-completion state transition.

### Implemented

- Moving collision now samples ball and blade interpolation at 20%, 40%, 60%, 80%, and 100% of each fixed update.
- Moving flipper samples accept overlap even when the ball’s velocity is tangential, while passive geometry still requires an entering contact.
- Target completion now returns before any later collision or drain work in that frame.
- Drain recovery continues to return immediately after spawning the replacement ball.

### Verification notes

- `git diff --check` passes.

## 2026-08-14 — Prototype 48: current-position collision resolution and invalid-ball recovery

### Player correction

The five-point detector could identify an early sweep contact, but the resolver reused that early position. A bad geometric value could then leave the ball with invalid coordinates; the normal drain comparison does not catch `NaN`, so no replacement ball appeared.

### Implemented

- Sweep detection remains multi-sample, but collision resolution now projects the ball’s current position onto the current blade.
- Added finite/out-of-bounds validation for ball position and velocity after flipper contact.
- Invalid or wildly displaced balls now cost one Stability and use the same guaranteed respawn path as a normal recovery.
- Zero Stability still enters the loss state.

### Verification notes

- `node --check` passes for the extracted game script.
- `git diff --check` passes.

## 2026-08-14 — Prototype 49: bounded flipper separation

### Player correction

The current-position resolver could move the ball a large distance toward the blade after an early sweep hit. That made the playfield appear to shake when the ball crossed a fast flipper.

### Implemented

- Position separation is now applied only when the ball is within `hit radius + 6px` of the current blade.
- Distant sweep hits resolve velocity without teleporting the rendered ball.
- Finite/out-of-bounds recovery remains active for genuinely invalid trajectories.

### Verification notes

- `node --check` passes for the extracted game script.
- Bounded-separation and no-unconditional-teleport assertions are present.
- `git diff --check` passes.

## 2026-08-14 — Prototype 50: close the moving-sweep separation envelope

### Player correction

The five-point detector could register a valid tip crossing but the six-pixel correction envelope was narrower than the ball’s one-frame travel budget. The ball could therefore be detected and reflected while still visually appearing on the far side of the blade.

### Implemented

- Increased the current-position correction envelope from `hit radius + 6px` to `hit radius + 20px`.
- Kept the correction bounded rather than unconditionally teleporting every swept hit.
- Preserved finite-position recovery and the five-point moving-blade sweep.

### Verification notes

- `node --check` passes for the extracted game script.
- Swept correction envelope and five-point moving-tip assertions are present.
- `git diff --check` passes.

## 2026-08-14 — Prototype 51: time-of-impact flipper resolution

### Player correction

The bounded current-position correction reduced misses but still resolved an early swept contact after the ball had already crossed the blade. That could look like a warp-through followed by a late velocity change.

### Implemented

- Swept hits now retain their normalized sample time.
- The ball is placed at the actual sampled contact point.
- Rebound and flipper kick are applied at contact.
- The ball advances only through the remaining fraction of that fixed update.
- Removed the distance-based late correction in favor of time-of-impact resolution.

### Verification notes

- `node --check` passes for the extracted game script.
- Contact-time retention, remaining-frame advancement, and finite-position checks are present.
- `git diff --check` passes.

## 2026-08-14 — Prototype 52: remove rewind-based flipper resolution

### Player correction

A later time-of-impact experiment reintroduced ball rewinding plus remaining-frame advancement. That made flipper contacts visually shake and allowed the ball to be counted as drained outside the center opening.

### Implemented

- Removed time-of-impact rewind and remaining-frame advancement.
- Moving flippers resolve velocity without repositioning the ball.
- Stationary/passive geometry only separates when the ball is close to the current segment.
- Restored the center-only drain opening (`156 < x < 204`).
- Kept the early return after respawn and the invalid-ball recovery path.

### Verification notes

- `node --check` passes for the extracted game script.
- No-rewind, center-drain, moving-flipper, and respawn assertions are present.
- `git diff --check` passes.

## 2026-08-14 — Prototype 53: rollback flipper and impact mechanics

### Player correction

The moving-flipper sweep and layered contact-response revisions continued to produce false drain transitions and visible collision instability. The last simple flipper model was the pre-sweep implementation from `f25ff97`.

### Implemented

- Restored the simple closest-point segment collision solver.
- Removed moving-blade interpolation and time-of-impact handling.
- Removed contact-state kick/escape layering from flipper response.
- Restored fixed flipper restitution and direct active/passive kick values.
- Reduced bumper restitution to the earlier controlled range.
- Preserved current layouts, upgrades, elemental reactions, UI, and center-only drain detection.

### Verification notes

- `node --check` passes for the extracted game script.
- Sweep, rewind, remaining-frame, and screen-transform assertions pass.
- `git diff --check` passes.

## 2026-08-15 — Prototype 54: make physics tuning authoritative

### Player correction

The tuning panel displayed values that the collision paths did not actually consume. Gravity and speed cap were live, but flippers, bumpers, walls, rails, and gates still used hard-coded rebound and kick values.

### Implemented

- Wired active kick, catch rebound, moving rebound, passive rebound, and contact separation into the simple flipper solver.
- Added a live Surface rebound slider for bumpers, rails, gates, and table walls.
- Lowered the default active kick and global speed cap to the calmer pre-regression range.
- Lowered default surface rebound so bumper contacts do not keep re-energizing the ball.
- Updated slider ranges and labels to match the current simple solver.

### Verification notes

- `node --check` passes for the extracted game script.
- Static tuning-wiring assertions pass for every physics control.
- Offline-resource scan passes.
- `git diff --check` passes.

## 2026-08-14 — Prototype 39: Charge-funded repair station

### Economy link

Charge now supports a second between-level decision besides flipper hardware: recovery versus power.

### Implemented

- Added `Patch the pressure hull`, costing `2 Charge` and restoring one Stability.
- Repair is disabled when Stability is already full.
- The affordability guard is enforced again inside the purchase handler.
- The choice screen now presents a real tradeoff between preserving Charge for flipper modules and repairing a damaged run.

### Verification notes

- `node --check` passes for the extracted game script.
- Repair cost, Stability restoration, full-Stability disable state, and purchase guard are present.
- `git diff --check` passes.

## 2026-08-16 — UX/UI pass: mobile command deck

### Implemented

- Added a compact run HUD with route, score, progress, Stability pips, and live elemental hinge/imprint status.
- Added dedicated 48px touch-safe left/right flipper buttons with pressed, focus, and pointer-cancel states while preserving full-viewport touch input and keyboard fallback.
- Reworked between-descent decision copy into a clearer route handoff with mapped-target progress and explicit route completion/run-ended labels.
- Added narrow responsive layout treatment for the 320/360/390px mobile width band without changing Canvas physics or offline asset loading.

### Verification notes

- `node --check` passes for the extracted game script.
- Offline-resource scan passes: no external URLs, fetch/XHR, WebSocket, CDN, or remote font references.
- `git diff --check` passes.
- Browser visual review is limited to static/runtime checks in this environment; real-device touch and 320/360/390px screenshot signoff remains recommended.

## 2026-08-16 — Gameplay + visual pass: elemental routes and command deck

### Implemented

- Added per-element hinge charge and three-stack ball imprints when a player cradles the ball at an attuned hinge and then strikes it.
- Added matching reactions for salvage targets, elemental bumpers, and relay gates with score, Charge, timer, and local impact feedback.
- Added three selectable route modifiers: Flooded Sluice, Ember Lift, and Bedrock Shortcut. They materially alter the next descent instead of acting as flavor text.
- Added a stronger industrial deck renderer with service ribs, core glow, contact machinery, hinge modules, and localized impact effects.
- Kept route and module choices touch-safe and dependency-free.

### Verification notes

- `node --check` passes for the extracted 38.5KB game script.
- Offline scan passes: no external URLs, fetch/XHR, WebSocket, CDN, or remote font references.
- `git diff --check` passes.
- Hosted page responds HTTP 200; 320px hosted layout verification previously reported no horizontal overflow.
- Remaining gate: physical-phone playtest and final visual signoff; this pass is not claimed as AAA-complete.

## 2026-08-16 — Pass 25: table identity and tuning contract

### Implemented

- Added explicit route identities: **FREE PASS**, **HAZARD**, and **BOSS**.
- Flooded Sluice now permits resource recovery without Stability loss.
- Reactor Warden requires three exposed armor cores and applies boss-specific backlash messaging.
- Added an in-table identity plate so route risk is visible during play, not only in the overlay.
- Restored the Active kick tuning contract to `1.20` and centered its slider at the default using a `0.00–2.40` range.

### Verification notes

- `node --check` passes for the extracted game script.
- Active kick UI/runtime defaults both assert `1.20`; slider midpoint is mathematically `1.20`.
- `git diff --check` passes.
- Remaining gate: physical-phone boss/free-pass playtest and final visual signoff.

## 2026-08-16 — Pass 26: route-first progression flow

### Implemented

- Split the between-descent decision into two mobile-safe steps: choose route risk first, then tune one elemental hinge module.
- Added a back action so route selection can be reconsidered before spending Charge.
- Added route-specific visual treatment for boss and free-pass choices.
- Preserved the `1.20` Active kick default and centered tuning slider contract.

### Verification notes

- `node --check` passes for the extracted 41.9KB game script.
- Two-step, back action, boss/free-pass, and tuning-default assertions pass.
- Offline scan passes: no external URLs, fetch/XHR, WebSocket, CDN, or remote font references.
- `git diff --check` passes.
- Remaining gate: real 320x568 screenshot and touch-flow verification on a physical phone.

## 2026-08-16 — Tuning correction: active kick contract

- Corrected the requested Active kick default from `1.2` to `12`.
- Centered the slider at `12` using a `0–24` range with `0.5` increments.
- UI value, runtime config, and deployed HTML assertions now agree at `12.00`.

## 2026-08-16 — Pass 27: Reactor Warden boss table

### Implemented

- Added the dedicated `Blackout Core` boss layout with a large Warden shell, armor cores, and an Air relay gate.
- Added a shield/exposure cycle: the Warden exposes for the final 36 frames of a 120-frame cycle.
- Elemental imprints are required to damage the exposed Warden; shield collisions rebound the ball and explain the failure.
- Added boss HP to the mobile HUD and visible Canvas armor pips.
- Boss descent completion now requires all targets plus all three Warden cores defeated.
- Preserved Active kick default `12` and the centered `0–24` tuning range.

### Verification notes

- `node --check` passes for the extracted 45.0KB game script.
- Boss layout, shield cycle, elemental damage gate, boss renderer, two-step route flow, and Active kick `12` assertions pass.
- Offline scan passes: no external URLs, fetch/XHR, WebSocket, CDN, or remote font references.
- `git diff --check` passes.
- Remaining gate: live boss playthrough and physical-phone touch verification.

## 2026-08-16 — Pass 28: route map topology

### Implemented

- Replaced the flat route card list with a compact route map: three reachable nodes, connecting rails, and a locked high-reward Surface Vault signal.
- Preserved the route-first → elemental-module second flow.
- Added distinct map treatment for FREE PASS, HAZARD, and BOSS nodes.
- Kept the map dependency-free and bounded for narrow mobile overlays.

### Verification notes

- `node --check` passes for the extracted 45.6KB game script.
- Route map, locked node, Blackout Core, two-step flow, and Active kick `12` assertions pass.
- Offline scan and `git diff --check` pass.
- Remaining gate: real 320x568 screenshot/touch verification; the map is not claimed AAA-complete until that evidence exists.

## 2026-08-16 — Pass 29: persistent route graph

### Implemented

- Added persistent `routeHistory` so the route map records the path taken across descents.
- Converted Surface Vault from a decorative locked card into a real route node unlocked at `4 Charge`.
- Surface Vault grants a reward-route table identity, extra Charge, and increased salvage while retaining free-pass safety.
- Added path labels and responsive truncation so route history remains readable on narrow screens.
- Preserved the boss table, route→module flow, and Active kick `12` tuning contract.

### Verification notes

- `node --check` passes for the extracted 46.1KB game script.
- Route history, Charge unlock predicate, path label, boss table, and Active kick assertions pass.
- Offline scan and `git diff --check` pass.
- Remaining gate: real multi-stage route selection on a 320x568 phone.

## 2026-08-16 — Physics tuning pass: four energy profiles

### Implemented

- Split `surfaceRebound` from `bumperRebound`: walls, rails, and gates can stay muted while bumpers retain pop.
- Added four live test presets:
  - **Soft:** gravity `.075`, active kick `12`, surface `.06`, bumper `.70`, cap `7.8`.
  - **Balanced:** gravity `.09`, active kick `12`, surface `.08`, bumper `.82`, cap `8.8`.
  - **High Reach:** gravity `.105`, active kick `12`, surface `.10`, bumper `.90`, cap `9.5`.
  - **Pop:** gravity `.115`, active kick `14`, surface `.12`, bumper `.96`, cap `10`.
- Presets synchronize every visible slider and preserve the Active kick contract.

### Verification notes

- `node --check` passes for the extracted game script.
- All four preset objects, bumper-only rebound channel, preset synchronization, and Active kick `12` assertions pass.
- Offline scan and `git diff --check` pass.
- Source verification does not replace real-device feel testing; compare the four profiles on the hosted build.

## 2026-08-16 — Physics pass: first-contact launch and reach telemetry

### Implemented

- Added preset-specific `activeEscape` upward velocity floors: `2.2`, `2.8`, `3.4`, and `4.0` from Soft through Pop.
- Full active flipper kick now applies only on the first frame of continuous contact; held contact uses muted separation instead of repeated energy injection.
- Added Tune telemetry for active profile, highest ball height reached, and last launch speed.
- Preserved muted passive surfaces, bumper-only rebound, and Active kick `12` in the normal profiles.

### Verification notes

- `node --check` passes for the extracted game script.
- Telemetry, escape profiles, first-contact lock, bumper-only rebound, Active kick, offline scan, and `git diff --check` assertions pass.
- Real-device feel remains the final tuning gate; use the telemetry to compare upper-bumper reach rather than slider position alone.

## 2026-08-16 — Physics pass: upper-bank reach objective

### Implemented

- Added a per-table upper-bank reach objective: the first bumper at `y <= 220` counts as a successful reach.
- Added an 18-frame contact cooldown so one bumper overlap cannot award repeated reach credit.
- Added `+75` score and a clear message when the upper bank is reached.
- Added Tune telemetry: `Top: 0/1` or `Top: 1/1`.
- Added a Canvas target band that changes from cyan `UPPER BANK TARGET · REACH 1` to amber `UPPER BANK ONLINE · 1/1`.
- Reset the objective on ball reset and route transition; collision physics and four presets remain unchanged.

### Verification notes

- `node --check` passes for the extracted game script.
- Upper-bank state, cooldown, visual band, telemetry, preserved physics channels, Active kick `12`, and offline assertions pass.
- `git diff --check` passes.
- Real-device comparison remains required for final reach-feel signoff.

## 2026-08-16 — Physics pass: controlled launch angle

### Implemented

- Added a first-contact-only inward launch-angle assist after active flipper hits.
- Preset angles are deliberately restrained:
  - **Soft:** `0°`
  - **Balanced:** `6°`
  - **High Reach:** `12°`
  - **Pop:** `18°`
- Horizontal assist is capped at `1.8` velocity units per hit.
- Passive rails, walls, gates, bumpers, and held flipper contact do not receive angle assistance.
- Tune telemetry now reports the active launch angle alongside peak height, top-bank reach, and launch speed.

### Verification notes

- `node --check` passes for the extracted game script.
- Four angle profiles, angle math, first-contact-only behavior, assist cap, telemetry, Active kick `12`, offline scan, and `git diff --check` assertions pass.
- Real-device feel remains the final tuning gate.

## 2026-08-16 — Physics UX follow-up: visible angle and mobile-safe Tune

### Implemented

- Added a dedicated `Launch angle` readout to the Tune panel instead of hiding the value only in telemetry.
- Preset selection updates the visible degree value and telemetry together.
- Bounded the Tune panel to the viewport with scroll fallback for true 320x568 screens.
- Preserved the four angle profiles, first-contact assist cap, muted contacts, and Active kick `12`.

### Verification notes

- `node --check` passes for the extracted game script.
- Angle row, bounded panel, synchronized preset value, four profiles, first-contact lock, offline scan, and `git diff --check` assertions pass.
- The hosted build still requires real-device touch/feel signoff.

## 2026-08-16 — Physics pass: target-directed launch rotation

### Implemented

- Replaced fixed inward launch bias with deterministic rotation toward the nearest upper bumper (`y <= 220`).
- Preset values now act as maximum turn limits: `0°`, `6°`, `12°`, and `18°`.
- Rotation preserves the outgoing velocity magnitude before the existing speed cap.
- Invalid/near-zero vectors and tables without upper targets leave velocity unchanged.
- Assist remains first-contact-only; passive contacts and held flipper frames are untouched.
- Tune copy now labels the value `Aim max` / `max turn` to avoid promising a forced trajectory.

### Verification notes

- `node --check` passes for the extracted game script.
- Target helper, upper-target filter, speed preservation, finite guard, first-contact lock, UI copy, Active kick `12`, offline scan, and `git diff --check` assertions pass.
- Real-device comparison remains required for final upper-bank feel signoff.

## 2026-08-16 — Corrective physics pass: reachable upper-bank geometry

### Implemented

- Replaced the unreachable hard-coded `y <= 220` upper-bank test with `getUpperBumpers()`, which selects the highest bumper tier from the active table layout.
- Target-directed launch rotation now aims at real bumpers on every table, including alternate and boss layouts.
- Upper-bank collision credit now uses actual bumper identity and remains cooldown-protected.
- Moved the Canvas target band to the active table's real upper bumper tier.
- Preserved speed-conserving target rotation, first-contact locking, muted surfaces, bumper pop, four presets, and Active kick `12`.

### Verification notes

- `node --check` passes for the extracted game script.
- Regression assertions confirm the dead threshold is absent and target selection, collision credit, and visual band all use actual bumper tiers.
- Offline scan and `git diff --check` pass.
- The hosted build must be rechecked after Pages deployment; prior critic evidence correctly identified the old hosted/source mismatch.
