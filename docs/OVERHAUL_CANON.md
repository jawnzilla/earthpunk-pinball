# Deadlight Overhaul Canon

**Status:** Active reset canon · v0.1 · 2026-08-17

## Verdict

The current prototype is playable, but it is not the intended game. It reads as a cyberpunk instrument console layered over a pinball approximation. The next phase is not another decoration pass. It is a first-principles physics and readability reset.

The target is a portrait physics-forward pinball roguelite about climbing through buried infrastructure toward the surface. The table must read first as a physical mine/tunnel machine, second as a game system, and only third as a stylized UI surface.

No literal AAA parity claim is allowed without comparative and physical-device evidence.

## Keep

- Portrait 9:16 active table and 52px minimum touch controls.
- Four-descent run structure and branching route topology.
- Existing route choices and elemental upgrade-choice concept as content scaffolding.
- Offline-safe local assets and GitHub Pages delivery.
- Salvage/objective loop as the progression spine.

## Rebuild

- Physics: replace rebound/catch/separation tuning with mass, material, force, motor, friction, and energy concepts.
- Collision API: return contact point, normal, relative velocity, impulse, impact energy, and whether the contact was separating.
- Table read: remove console-card layering from active play; build a mine/tunnel with clear physical planes and silhouettes.
- Objects: separate bumpers, salvage, and destructible structures. They must not share one circle-and-glow language.
- Damage: speed, mass, material matchup, and elemental state determine damage.
- Element stacks: create persistent, readable physical consequences rather than score-only reactions.
- HUD: show only run/depth, stability, charge, and compact active effects. Use contextual symbols; no persistent developer prose.
- Input: flippers respond on the input edge with a motor model, not a delayed target interpolation or synthetic kick slider.

## Mine/tunnel fantasy

Every active table is a section of the same ascent:

1. **Wall plane:** dark bedrock, sediment strata, damp seams, timber or old concrete support.
2. **Play surface:** worn steel/stone/wood deck with rails, fasteners, grime, and readable occlusion.
3. **Foreground plane:** flipper housings, drain throat, guard rails, and shadowed lip that frame the camera.
4. **Depth landmarks:** shafts, pipe runs, ore seams, collapsed supports, and distant lamps arranged to imply a tunnel continuing beyond the table.

Earthpunk means improvised industrial infrastructure being reclaimed by geology and life: oxidized steel, timber, clay, moss, roots, mineral deposits, old cables, warm lamps, and water. Cyan/purple neon is not the default palette. Element colors are reserved for active effects and must not flood the table.

## Physical object taxonomy

- **Bumper:** resilient machine component; circular/radial silhouette; high restitution; low structural damage.
- **Salvage:** collectible crate, drum, ore sack, cable spool, or machine part; low-to-medium integrity; clear pickup/score response.
- **Destructible:** pipe bank, timber brace, wreckage, stone plug, or rooted structure; visible integrity stages; impact damage persists.
- **Relay/gate:** structural route mechanism; opens through contacts and state, not generic target glow.
- **Flipper/rail:** manufactured moving/continuous surfaces with explicit material and motor behavior.

No object family may be communicated only by color.

## Element stack canon

Stacks are 0–3 per element. Effects must be visible in the world and bounded for performance.

- **Fire:** stack 1 warms/marks; stack 2 ignites a short-lived trail behind the ball; stack 3 leaves a 0.75s damage-over-time ember trail on the table and applies burn to destructibles. Trail budget: 12 segments.
- **Water:** stack 1 dampens and slightly increases contact drag; stack 2 creates a splash burst on the next hard bounce; stack 3 spawns two mini-balls on the first hard bounce. Each mini-ball has 3 bounces or 1.25s lifetime, whichever comes first.
- **Wind:** stack 1 reduces drag; stack 2 adds a visible directional wake; stack 3 spawns one piercing echo travelling along the ball's current velocity. The echo damages each object once, ignores the first collision response, and despawns after 900px or 1.5s.
- **Earth:** stack 1 adds impact damage; stack 2 adds a brief anchored stun to destructibles; stack 3 links the first and second struck objects with a temporary vine. A ball crossing the vine receives a bounded power multiplier once.

## Hybrid rules

Hybrids are earned only when two elements are active, not from every contact.

- Fire + Water: **steam fracture** — next destructible impact creates a short radial impulse and one extra damage tick; no screen-wide flash.
- Fire + Wind: **thermal lance** — the wind echo inherits a short burn trail but keeps the one-echo cap.
- Water + Earth: **slurry bind** — the next stone/wood structure becomes a low-friction anchor that redirects the ball without a hard bounce.
- Earth + Wind: **root sling** — the vine stores one contact's normal impulse and returns it as a directional assist.

Hybrid effects must be legible, deterministic, and cheaper than spawning a new persistent system.

## UI hierarchy

Active play gets one persistent top rail and no large center card.

- Depth/run: one compact instrument.
- Stability: three authored pips.
- Charge: one segmented meter.
- Active elements: up to two icon chips plus stack count.
- Context cue: icon only by default; one short label appears for a state transition and fades.
- Touch: full left/right input regions with pressed feedback at the thumb edge, never over the ball lane.

## Delivery phases

1. **Physics core:** standalone material/force/contact API with deterministic tests.
2. **Shadow integration:** route current ball/flipper contacts through the API while keeping the old renderer.
3. **Destructible slice:** one crate, one pipe bank, one timber brace with integrity stages and impact damage.
4. **Element slice:** Fire trail and Water mini-balls first; then Wind echo and Earth vine.
5. **Table reset:** replace active console layers with the mine/tunnel plane system and authored object silhouettes.
6. **HUD reset:** remove persistent debug/prose and retune contextual feedback.
7. **Balance/playtest:** measure responsiveness, survival, object damage, and stack value across seeded runs.

Each phase must ship with exact mobile checks, a hosted link, and a build-log entry. No phase is complete from a screenshot alone.
