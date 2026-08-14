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
