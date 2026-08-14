# Deadlight // Earthpunk Pinball

A portrait HTML5 Canvas prototype for the Meta Horizon Creator Competition: Game Prototype.

## Current slice

Prototype 01 answers one question: **is moving a probe through an underground industrial pinball table satisfying?**

- Touch left/right halves of the table to work the flippers.
- Keyboard fallback: `A` / `D` or arrow keys.
- Hit all six salvage targets to recover the surface signal.
- Missing the ball costs stability; lose all three stability points and the probe is lost.
- Reset is available after a win or loss.

## Run locally

```bash
python -m http.server 5178
```

Open <http://localhost:5178>.

## Deployment

The active `prototype` branch is configured for GitHub Pages via `.github/workflows/pages.yml`. Pushes to that branch publish the current build for phone testing.

## Competition constraints

The prototype is intentionally offline-safe: it uses no CDN, external assets, external fonts, analytics, or runtime network requests. The final submission packaging step will assemble a root-level readable `index.html` and validate the zip size and contents.
