# Deadlight // Earthpunk Pinball

A portrait HTML5 Canvas prototype for the Meta Horizon Creator Competition: Game Prototype.

## Current slice

Prototype 01 answers one question: **is moving a probe through an underground industrial pinball table satisfying?**

- Touch left/right halves of the table to work the flippers.
- Keyboard fallback: `A` / `D` or arrow keys.
- Hit all six salvage targets to complete a descent.
- Complete four descents in one run.
- Choose a branching route or one between-descent elemental hinge module: Fire, Water, Earth, or Air.
- Cradle the ball at an attuned flipper hinge to stack elemental imprints; matching targets, bumpers, and relays trigger elemental reactions.
- Route modifiers materially change the next table: Flooded Sluice dampens gravity, Ember Lift boosts launch power and salvage, and Bedrock Shortcut reinforces the probe.
- Flipper input works from either full-screen touch half, including the margins outside the table border.
- Missing the ball costs stability; lose all stability and the probe is lost.
- Reach the fourth descent's final signal to win.
- Reset is available after a win or loss.

## Build log

- [Presentation build log](docs/BUILD_LOG.html) — readable timeline, current mechanics, validation evidence, and hackathon compliance checklist.
- [Detailed engineering log](docs/BUILD_LOG.md) — source-level iteration history.

## Overhaul canon

The current prototype is being reset toward physics-forward earthpunk mine/tunnel pinball. The living design contracts are:

- [Overhaul canon](docs/OVERHAUL_CANON.md) — visual, UI, object, element-stack, and delivery decisions.
- [Physics V2 spec](docs/PHYSICS_V2_SPEC.md) — units, materials, contact response, damage, CCD, and deterministic gates.
- [AAA-mobile reference bar](docs/AAA_REFERENCE_BAR.md) — named reference games, touch guidance, anti-patterns, and measurable acceptance criteria.

The current implementation uses the renderer-independent Physics V2 core for primary-ball integration, fixed-step timing, flipper motor motion, and material-aware contacts. Generator Well now contains four destructible mine/salvage bodies—timber crate, copper pipe, stone plug, and salvage drum—whose integrity responds to impact energy, material matchup, and active element stacks.

## Run locally

```bash
python -m http.server 5178
```

Open <http://localhost:5178>.

## Deployment

The active `prototype` branch is configured for GitHub Pages via `.github/workflows/pages.yml`. Pushes to that branch publish the current build for phone testing.

## Competition constraints

The prototype is intentionally offline-safe: it uses no CDN, external assets, external fonts, analytics, or runtime network requests. The final submission packaging step will assemble a root-level readable `index.html` and validate the zip size and contents.
