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
