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
