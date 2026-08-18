# Deadlight Physics V2

**Status:** Implementation contract · v0.1 · 2026-08-17

## Design goal

The ball is a physical object moving through a physical table. Game rules observe contacts and energy; they do not replace collision response with arbitrary score/kick mutations.

## Units and loop

- World coordinates use the existing 360×640 logical table, mapped to `PX_PER_M = 100`.
- Ball radius: `0.08m` (8 logical px).
- Default steel ball mass: `0.032kg`.
- Fixed physics step: `1/120s` with at most 4 catch-up steps per render. Rendering remains requestAnimationFrame-driven.
- All velocities are meters/second; all forces are Newtons; all impulses are Newton-seconds.
- If a frame stalls, retain the accumulator remainder up to a bounded cap rather than silently changing physics units.

## Data model

```js
const MATERIALS = {
  steel:   { density: 7850, restitution: .62, friction: .18, hardness: 1.0, drag: .002 },
  rubber:  { density: 1100, restitution: .88, friction: .72, hardness: .35, drag: .010 },
  timber:  { density: 650,  restitution: .28, friction: .62, hardness: .42, drag: .012 },
  stone:   { density: 2600, restitution: .18, friction: .78, hardness: .88, drag: .018 },
  copper:  { density: 8960, restitution: .48, friction: .32, hardness: .72, drag: .004 },
  water:   { density: 1000, restitution: .06, friction: .12, hardness: .05, drag: .080 }
};

ball = {
  position, velocity, radius: .08, mass: .032, material: 'steel',
  spin: 0, angularInertia: .000081, effects: {},
  contactsThisStep: new Set(), pierceLedger: new Set()
};

body = {
  id, shape, material, position, velocity, angle, angularVelocity,
  integrity, maxIntegrity, armor, weaknesses, salvageValue, tags
};
```

The existing `debugConfig` slider object is not part of the player-facing physics model. It may remain temporarily behind debug mode as a compatibility adapter, but new gameplay code must not read `activeKick`, `movingRebound`, `passiveRebound`, `catchRestitution`, or `contactSeparation`.

## Forces and integration

Apply forces before integration:

```js
acceleration = force * inverseMass;
velocity += acceleration * dt;
position += velocity * dt;
velocity *= Math.exp(-material.drag * dt);
```

Gravity is a force field (`F = m * g`), not a direct velocity edit. Route modifiers alter `g` or a named field, not a rebound number.

Flippers are motors:

```js
motorTorque = inputHeld ? motor.maxTorque : 0;
angularAcceleration = (motorTorque - motor.damping * angularVelocity) / motor.inertia;
angularVelocity = clamp(angularVelocity + angularAcceleration * dt, -motor.maxSpeed, motor.maxSpeed);
angle += angularVelocity * dt;
```

Input edges are captured immediately. The first physics step after a press may apply motor torque; it must not inject an unrelated fixed “kick.” Contact energy comes from the flipper surface velocity.

## Contact response

For a contact normal `n` pointing from surface to ball:

```js
relativeVelocity = ball.velocity - surfaceVelocityAtContact;
normalSpeed = dot(relativeVelocity, n);
if (normalSpeed >= 0) { // separating: positional correction only, no bounce
  return { hit: true, impulse: 0, energy: 0, separating: true };
}

restitution = min(ballMaterial.restitution, surfaceMaterial.restitution);
invMassSum = ball.inverseMass + surface.inverseMass;
impulseMagnitude = -(1 + restitution) * normalSpeed / invMassSum;
impulse = n * impulseMagnitude;
ball.velocity += impulse * ball.inverseMass;
```

Then apply bounded Coulomb friction using the tangent component. Position correction uses a slop and percentage, not unconditional snapping. The contact result is:

```js
{ hit, point, normal, relativeVelocity, impulse, impactSpeed,
  impactEnergy: .5 * ball.mass * impactSpeed ** 2,
  separating, materialA, materialB }
```

No collision may directly multiply velocity by `-1.15`, add `.8` vertical velocity, or cap energy without recording why. Speed caps are a safety bound only and emit telemetry when reached.

## CCD and performance

- Use a 120Hz fixed step for the single primary ball and up to 3 effect balls.
- Use swept circle-vs-segment TOI for flippers and rails; do not nest a ball-path sample loop inside a flipper-pose sample loop.
- Broadphase the table into 8×16 uniform cells. Register only bodies in the ball's swept AABB.
- Resolve at most 4 contacts per substep, ordered by earliest TOI.
- Mini-balls and Wind echo use the same solver with reduced collision masks and explicit lifetime/bounce budgets.
- Instrument `physicsStepMs`, `contactCount`, `substepCount`, and `activeBodyCount`; target p95 physics under 2ms on the development desktop and no visible input delay.

## Damage

On a non-bumper object contact:

```js
baseDamage = impactEnergy * object.damageScale;
materialFactor = ballMaterial.hardness / object.material.hardness;
speedFactor = clamp(impactSpeed / object.damageSpeedReference, .25, 2.5);
elementFactor = activeElementMultiplier(ball.effects, object.weaknesses);
damage = baseDamage * materialFactor * speedFactor * elementFactor;
```

Damage is applied only when the relative normal speed exceeds the object's `damageThreshold`. Objects expose 3–4 visual integrity stages and a clear destroyed state. Salvage may score on contact; destructibles must visibly change before destruction.

Recommended first slice:

- `timber_crate`: integrity 18, threshold 1.2m/s, Fire ×2, Water ×.8.
- `copper_pipe`: integrity 26, threshold 1.8m/s, Earth ×1.25, Wind ×.9.
- `stone_plug`: integrity 42, threshold 2.4m/s, Earth ×1.5, Water ×1.2, Fire ×.7.
- `salvage_drum`: integrity 10, threshold .8m/s, rewards once, no repeated score farming.

## Element events

Element effects subscribe to `ContactResult`, not to raw `circleCollision` booleans. A contact event includes object id, point, impact energy, and whether it bounced.

- Fire stack 3 creates at most 12 trail segments; each segment ticks damage at 10Hz for .75s.
- Water stack 3 spawns exactly two mini-balls on the first hard bounce (`impactSpeed >= 2.0m/s`), max 3 bounces or 1.25s.
- Wind stack 3 spawns one piercing echo, one hit per object id, 900px/1.5s lifetime.
- Earth stack 3 links first and second struck objects with a vine; one power gain on crossing, then vine expires.

Effects are data-driven and capped. A hybrid is a single event modifier, never an unbounded second effect graph.

## Migration seam

1. Add `src/physics-core.mjs` and deterministic tests without changing the renderer.
2. Wrap current ball state in a `PhysicsWorld` adapter; use current table coordinates and flipper endpoints.
3. Replace `circleCollision` and `segmentCollision` call sites with `world.step()` contact results.
4. Move `hitTarget`, boss logic, salvage, and elemental reactions to contact-event consumers.
5. Delete debug slider reads from gameplay code after parity tests pass.

## Deterministic test gates

- Gravity: a ball released from rest has the expected displacement `0.5*g*t²` within tolerance.
- Resting contact: a separating ball receives no bounce impulse.
- Steel/rubber: restitution is bounded by the lower material response and energy does not increase.
- Flipper press: motor surface velocity changes continuously; no fixed kick occurs on a stationary contact.
- Tip contact: a ball crossing the moving flipper's swept volume produces one contact, not zero or repeated stick contacts.
- Damage: identical speed/material/element inputs produce identical integrity loss.
- Water/Wind/Earth/Fire caps: effect counts and lifetimes never exceed their budgets.
