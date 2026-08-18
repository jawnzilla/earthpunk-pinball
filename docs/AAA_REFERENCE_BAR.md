# AAA-Mobile Reference Bar

**Status:** Critic baseline · 2026-08-17

This is a technique reference, not a claim that Deadlight matches these products.

## References and what to borrow

### Zen Pinball / Williams Pinball

Use as the physics credibility bar: the ball should feel like it has mass, spin, material response, and contact energy. Pinball surfaces should be understandable without a debug vocabulary. The App Store search result explicitly describes Zen Pinball as having realistic simulated pinball physics; the Google Play listing documents a large, mature pinball audience.

Borrow:

- surface-specific contact behavior;
- consistent ball speed and flipper timing;
- table features that communicate purpose through physical construction;
- effects that reinforce impact instead of hiding the ball.

Do not borrow:

- unreadable licensed-table ornament density;
- a camera/UI layout that sacrifices the ball lane on portrait screens.

Sources: <https://apps.apple.com/us/app/zen-pinball/id465694275?see-all=reviews&platform=iphone>, <https://play.google.com/store/apps/details?id=com.zenstudios.ZenPinball&hl=en_US>

### PinOut

Use as the progression/camera bar. Its store listing describes a pinball game where the player climbs upward through a course rather than staying on one static screen, and the Apple listing highlights a seven-level structure.

Borrow:

- ascent as a legible spatial promise;
- clear next-objective composition;
- controlled visual palette and strong lane readability;
- short-session pressure that makes each bounce matter.

Do not borrow its neon future aesthetic; Deadlight needs geology, salvage, and reclaimed infrastructure.

Sources: <https://play.google.com/store/apps/details?id=com.mediocre.pinout&hl=en_US>, <https://apps.apple.com/us/app/pinout/id1108417718?see-all=reviews&platform=iphone>

### Vampire Survivors / Archero

Use as the build-communication bar. External mobile-roguelite coverage repeatedly points to Vampire Survivors' readable chaos and Archero's accessibility/build depth.

Borrow:

- very short persistent HUD state;
- upgrade choices that explain one effect and one consequence quickly;
- strong silhouettes and effect priority under pressure;
- systems that stack in visible, memorable ways.

Do not add a wall of stats or a second meta-game to an already dense table.

Source: <https://www.mobilegamereport.com/articles/mobile-roguelite-tier-list>, <https://rogueliker.com/android-roguelikes/>

### The Room

Use as the material/depth bar. The series is praised for encouraging playful exploration of a convincing environment rather than presenting a flat menu of interactions.

Borrow:

- tactile material separation;
- close, deliberate lighting;
- readable construction details: fasteners, seams, hatches, wood grain, dampness, stone fracture;
- environmental feedback that makes the space feel made, not decorated.

Source: <https://thinkygames.com/features/peering-through-the-keyhole-a-deep-dive-into-the-room-series/>

### Apple Game Controls guidance

Use as the touch bar. Apple recommends placing frequent controls near the thumb, avoiding the center gameplay region, using artwork that represents the action, showing a visible press state, and hiding controls that are not currently needed.

Borrow:

- full left/right touch zones with visible press feedback at the edge;
- contextual controls instead of permanent overlays;
- no center HUD card blocking the action lane;
- test across device sizes and safe areas.

Source: <https://developer.apple.com/design/human-interface-guidelines/game-controls>, <https://developer.apple.com/videos/play/wwdc2026/358/>

## Harsh current-build verdict

- Current active play is over-instrumented: multiple authored rails, console plates, element glows, status labels, and cue cards compete with the ball.
- The palette reads closer to cyan/amber cyberpunk than earthpunk geology and reclaimed industry.
- The current physics exposes implementation terms (`rebound`, `kick`, `separation`) instead of physical affordances.
- Major gameplay objects are still too close to a shared circle/line/glow vocabulary.
- The current build can pass a prototype contract while failing the player-facing test: “Can I instantly tell what is solid, what is collectible, what is breakable, and where the ball can go?”

## Acceptance gates

### Readability

- At 320×568, a grayscale frame must distinguish ball, flippers, bumpers, salvage, and destructibles without relying on element color.
- No persistent center card wider than 20% of canvas width.
- No more than one persistent HUD rail plus contextual feedback.
- At least 80% of active canvas pixels remain open playfield rather than text/console decoration.

### Physics

- No player-facing slider names for restitution/catch/separation after Physics V2 integration.
- Primary ball, flippers, and surfaces use mass/material/contact data.
- Contact events expose impact energy and object damage is reproducible from a seeded run.
- Input-to-flipper motion begins within one rendered frame of touch-down in browser tests.

### Mobile

- Exact CSS viewports 320×568 and 390×844.
- `scrollWidth === innerWidth`, no page/console errors, no broken assets.
- Touch controls remain at least 52px high and do not cover the primary ball lane.
- Physics p95 under 2ms in the development browser with the primary ball plus effect-ball budget.

### Production honesty

- Comparative screenshots and physical-device tests are required before claiming AAA parity.
- If a browser harness fails because of memory or platform constraints, record it as a blocker rather than inventing results.
