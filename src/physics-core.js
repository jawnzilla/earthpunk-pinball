export const MATERIALS = Object.freeze({
  steel: Object.freeze({ density: 7850, restitution: 0.62, friction: 0.18, hardness: 1.0, drag: 0.002 }),
  rubber: Object.freeze({ density: 1100, restitution: 0.88, friction: 0.72, hardness: 0.35, drag: 0.010 }),
  timber: Object.freeze({ density: 650, restitution: 0.28, friction: 0.62, hardness: 0.42, drag: 0.012 }),
  stone: Object.freeze({ density: 2600, restitution: 0.18, friction: 0.78, hardness: 0.88, drag: 0.018 }),
  copper: Object.freeze({ density: 8960, restitution: 0.48, friction: 0.32, hardness: 0.72, drag: 0.004 }),
  water: Object.freeze({ density: 1000, restitution: 0.06, friction: 0.12, hardness: 0.05, drag: 0.080 })
});

export const PX_PER_M = 100;
export const FIXED_DT = 1 / 120;

const EPSILON = 1e-8;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const dot = (a, b) => a.x * b.x + a.y * b.y;
const add = (a, b) => ({ x: a.x + b.x, y: a.y + b.y });
const scale = (a, scalar) => ({ x: a.x * scalar, y: a.y * scalar });
const subtract = (a, b) => ({ x: a.x - b.x, y: a.y - b.y });
const magnitude = value => Math.hypot(value.x, value.y);
const normalize = value => {
  const length = magnitude(value);
  return length > EPSILON ? scale(value, 1 / length) : { x: 0, y: -1 };
};

export function materialHardness(material = 'steel') {
  return MATERIALS[material]?.hardness ?? MATERIALS.steel.hardness;
}

export function impactEnergyFromMassSpeed(mass = 0, speed = 0) {
  const safeMass = Number.isFinite(mass) ? Math.max(0, mass) : 0;
  const safeSpeed = Number.isFinite(speed) ? Math.max(0, speed) : 0;
  return 0.5 * safeMass * safeSpeed ** 2;
}

export function createBall({ x = 0, y = 0, vx = 0, vy = 0, mass = 0.032, radius = 0.08, material = 'steel' } = {}) {
  return {
    position: { x, y },
    velocity: { x: vx, y: vy },
    radius,
    mass,
    inverseMass: mass > 0 ? 1 / mass : 0,
    material,
    spin: 0,
    angularInertia: 0.5 * mass * radius * radius,
    effects: {},
    contactsThisStep: new Set(),
    pierceLedger: new Set()
  };
}

export function integrateBall(ball, { force = { x: 0, y: 0 }, gravity = { x: 0, y: 9.81 }, dt = FIXED_DT } = {}) {
  const acceleration = add(scale(force, ball.inverseMass), gravity);
  ball.velocity = add(ball.velocity, scale(acceleration, dt));
  ball.position = add(ball.position, scale(ball.velocity, dt));
  const drag = MATERIALS[ball.material]?.drag ?? MATERIALS.steel.drag;
  const dragFactor = Math.exp(-drag * dt);
  ball.velocity = scale(ball.velocity, dragFactor);
  return ball;
}

// Impulses are discrete contact/tool events; keep them separate from the
// continuous force integration path so mass remains the only response scale.
export function applyImpulse(ball, impulse = { x: 0, y: 0 }) {
  if (!ball || ball.inverseMass <= 0) return ball;
  const safeImpulse = {
    x: Number.isFinite(impulse.x) ? impulse.x : 0,
    y: Number.isFinite(impulse.y) ? impulse.y : 0
  };
  ball.velocity = add(ball.velocity, scale(safeImpulse, ball.inverseMass));
  return ball;
}

// Keep the gameplay speed ceiling as a pure velocity operation so callers can
// measure/verify the post-cap state without duplicating vector math.
export function capVelocity(velocity = { x: 0, y: 0 }, maxSpeed = Infinity) {
  const safe = {
    x: Number.isFinite(velocity.x) ? velocity.x : 0,
    y: Number.isFinite(velocity.y) ? velocity.y : 0
  };
  if (!Number.isFinite(maxSpeed) || maxSpeed <= 0) return safe;
  const speed = Math.hypot(safe.x, safe.y);
  if (speed <= maxSpeed || speed <= EPSILON) return safe;
  const scaleFactor = maxSpeed / speed;
  return { x: safe.x * scaleFactor, y: safe.y * scaleFactor };
}

export function contactVelocity({ linear = { x: 0, y: 0 }, angularVelocity = 0, point = { x: 0, y: 0 }, origin = { x: 0, y: 0 } } = {}) {
  const offset = subtract(point, origin);
  return { x: linear.x - angularVelocity * offset.y, y: linear.y + angularVelocity * offset.x };
}

export function resolveContact({ ball, surface = {}, point, normal, surfaceVelocity = surface.velocity ?? { x: 0, y: 0 }, penetration = 0, correctionPercent = 0.72, slop = 0.001, restitution = null }) {
  const ballMaterial = MATERIALS[ball.material] ?? MATERIALS.steel;
  const surfaceMaterial = MATERIALS[surface.material] ?? MATERIALS.steel;
  const n = normalize(normal);
  const relativeVelocity = subtract(ball.velocity, surfaceVelocity);
  const normalSpeed = dot(relativeVelocity, n);
  const result = {
    hit: true,
    point: { ...point },
    normal: n,
    relativeVelocity,
    impulse: { x: 0, y: 0 },
    impactSpeed: Math.max(0, -normalSpeed),
    impactEnergy: 0,
    separating: normalSpeed >= 0,
    materialA: ball.material,
    materialB: surface.material ?? 'steel'
  };

  if (penetration > slop) {
    const correction = (penetration - slop) * correctionPercent;
    const surfaceInverseMass = surface.inverseMass ?? 0;
    const correctionMass = ball.inverseMass + surfaceInverseMass;
    if (correctionMass > EPSILON) {
      if (ball.inverseMass > 0) {
        ball.position = add(ball.position, scale(n, correction * ball.inverseMass / correctionMass));
      }
      if (surfaceInverseMass > 0 && surface.position) {
        surface.position = add(surface.position, scale(n, -correction * surfaceInverseMass / correctionMass));
      }
    }
  }
  if (result.separating) return result;

  const responseRestitution = restitution == null
    ? Math.min(ballMaterial.restitution, surfaceMaterial.restitution)
    : clamp(restitution, 0, 1);
  const inverseMassSum = ball.inverseMass + (surface.inverseMass ?? 0);
  if (inverseMassSum <= EPSILON) return result;
  const impulseMagnitude = -(1 + responseRestitution) * normalSpeed / inverseMassSum;
  let impulse = scale(n, impulseMagnitude);

  const tangentVelocity = subtract(relativeVelocity, scale(n, normalSpeed));
  const tangentLength = magnitude(tangentVelocity);
  if (tangentLength > EPSILON) {
    const tangent = scale(tangentVelocity, 1 / tangentLength);
    const frictionMagnitude = clamp(-dot(relativeVelocity, tangent) / inverseMassSum, -impulseMagnitude * Math.min(ballMaterial.friction, surfaceMaterial.friction), impulseMagnitude * Math.min(ballMaterial.friction, surfaceMaterial.friction));
    impulse = add(impulse, scale(tangent, frictionMagnitude));
  }

  applyImpulse(ball, impulse);
  // Dynamic surfaces receive the equal/opposite contact impulse. Kinematic
  // table geometry keeps inverseMass=0 and remains unchanged, while future
  // moving bodies can conserve momentum instead of only borrowing a velocity.
  if (surface.inverseMass > 0 && surface.velocity) {
    applyImpulse(surface, scale(impulse, -1));
  }
  result.impulse = impulse;
  result.impactEnergy = impactEnergyFromMassSpeed(ball.mass, result.impactSpeed);
  return result;
}

// Renderer-independent calibration seam for contact tuning. Speeds are in m/s
// and are sampled against a stationary surface so solver changes can be
// distinguished from flipper geometry or motor velocity.
export function calibrateContactResponse({
  speeds = [1, 2, 3],
  ballMaterial = 'steel',
  surfaceMaterial = 'rubber',
  normal = { x: 0, y: -1 },
  surfaceVelocity = { x: 0, y: 0 },
  restitution = null
} = {}) {
  return speeds
    .filter(speed => Number.isFinite(speed) && speed > 0)
    .map(incomingSpeed => {
      const ball = createBall({ vx: 0, vy: incomingSpeed, material: ballMaterial });
      const contact = resolveContact({
        ball,
        surface: { material: surfaceMaterial, inverseMass: 0 },
        point: { x: 0, y: 0 },
        normal,
        surfaceVelocity,
        restitution
      });
      const outgoingSpeed = magnitude(subtract(ball.velocity, surfaceVelocity));
      return {
        incomingSpeed,
        outgoingSpeed,
        responseRatio: outgoingSpeed / incomingSpeed,
        impactSpeed: contact.impactSpeed,
        impulseMagnitude: magnitude(contact.impulse)
      };
    });
}

// Calibration seam for moving flipper-like surfaces. The incoming and
// surface velocities are both aligned to the supplied normal so the result
// isolates surface motion from tangent friction and contact geometry.
export function calibrateMovingSurfaceResponse({
  speeds = [1, 2, 3],
  surfaceSpeeds = [0, 1, 2],
  ballMaterial = 'steel',
  surfaceMaterial = 'rubber',
  normal = { x: 0, y: -1 },
  restitution = null
} = {}) {
  const n = normalize(normal);
  return speeds
    .filter(speed => Number.isFinite(speed) && speed > 0)
    .flatMap(incomingSpeed => surfaceSpeeds
      .filter(surfaceSpeed => Number.isFinite(surfaceSpeed) && surfaceSpeed >= 0)
      .map(surfaceSpeed => {
        const ball = createBall({
          vx: -n.x * incomingSpeed,
          vy: -n.y * incomingSpeed,
          material: ballMaterial
        });
        const surfaceVelocity = scale(n, surfaceSpeed);
        const contact = resolveContact({
          ball,
          surface: { material: surfaceMaterial, inverseMass: 0 },
          point: { x: 0, y: 0 },
          normal: n,
          surfaceVelocity,
          restitution
        });
        const relativeIncomingSpeed = Math.max(0, -dot(scale(n, -incomingSpeed), n) + surfaceSpeed);
        const relativeOutgoingVelocity = subtract(ball.velocity, surfaceVelocity);
        const relativeOutgoingSpeed = magnitude(relativeOutgoingVelocity);
        return {
          incomingSpeed,
          surfaceSpeed,
          impactSpeed: contact.impactSpeed,
          outgoingSpeed: magnitude(ball.velocity),
          relativeOutgoingSpeed,
          responseRatio: relativeIncomingSpeed > EPSILON ? relativeOutgoingSpeed / relativeIncomingSpeed : 0,
          impulseMagnitude: magnitude(contact.impulse)
        };
      }));
}

// Geometry-matched flipper calibration: preserve the actual rotating-surface
// velocity at a contact point, while keeping the normal/tangent inputs explicit.
// This is a probe only; live gameplay still owns its collision call site.
export function calibrateFlipperContactResponse({
  incomingNormalSpeeds = [1, 2, 3],
  tangentSpeeds = [0],
  angularVelocities = [0, 4, 8],
  contactPoint = { x: 0.6, y: 0 },
  pivot = { x: 0, y: 0 },
  normal = { x: 0, y: -1 },
  ballMaterial = 'steel',
  surfaceMaterial = 'rubber',
  restitution = null
} = {}) {
  const n = normalize(normal);
  const tangent = { x: -n.y, y: n.x };
  const offset = subtract(contactPoint, pivot);
  return incomingNormalSpeeds
    .filter(speed => Number.isFinite(speed) && speed > 0)
    .flatMap(incomingNormalSpeed => tangentSpeeds
      .filter(speed => Number.isFinite(speed))
      .flatMap(tangentSpeed => angularVelocities
        .filter(angularVelocity => Number.isFinite(angularVelocity))
        .map(angularVelocity => {
          const surfaceVelocity = {
            x: -angularVelocity * offset.y,
            y: angularVelocity * offset.x
          };
          const ball = createBall({
            vx: -n.x * incomingNormalSpeed + tangent.x * tangentSpeed,
            vy: -n.y * incomingNormalSpeed + tangent.y * tangentSpeed,
            material: ballMaterial
          });
          const contact = resolveContact({
            ball,
            surface: { material: surfaceMaterial, inverseMass: 0 },
            point: contactPoint,
            normal: n,
            surfaceVelocity,
            restitution
          });
          const relativeIncoming = subtract({
            x: -n.x * incomingNormalSpeed + tangent.x * tangentSpeed,
            y: -n.y * incomingNormalSpeed + tangent.y * tangentSpeed
          }, surfaceVelocity);
          const relativeOutgoing = subtract(ball.velocity, surfaceVelocity);
          const relativeIncomingSpeed = magnitude(relativeIncoming);
          return {
            incomingNormalSpeed,
            tangentSpeed,
            angularVelocity,
            surfaceSpeed: magnitude(surfaceVelocity),
            impactSpeed: contact.impactSpeed,
            outgoingSpeed: magnitude(ball.velocity),
            relativeOutgoingSpeed: magnitude(relativeOutgoing),
            responseRatio: relativeIncomingSpeed > EPSILON ? magnitude(relativeOutgoing) / relativeIncomingSpeed : 0,
            impulseMagnitude: magnitude(contact.impulse)
          };
        })));
}

export function damageFromContact(contact, { objectMaterial = 'timber', damageScale = 1, threshold = 1.2, weaknesses = {}, elementEffects = {} } = {}) {
  if (!contact?.hit || contact.separating || contact.impactSpeed < threshold) return 0;
  const material = MATERIALS[objectMaterial] ?? MATERIALS.timber;
  const ballMaterial = MATERIALS[contact.materialA] ?? MATERIALS.steel;
  const speedFactor = clamp(contact.impactSpeed / threshold, 0.25, 2.5);
  const materialFactor = clamp(ballMaterial.hardness / Math.max(material.hardness, EPSILON), 0.25, 2.5);
  const elementFactor = Object.entries(elementEffects).reduce((factor, [element, effect]) => {
    const stacks = effect?.stacks ?? 0;
    const weakness = weaknesses[element] ?? 1;
    return factor * (1 + Math.max(0, stacks) * (weakness - 1) * 0.5);
  }, 1);
  return contact.impactEnergy * damageScale * speedFactor * materialFactor * elementFactor;
}

export function advanceFixed(world, elapsedSeconds, step = FIXED_DT, maxSteps = 4) {
  world.accumulator = Math.min((world.accumulator ?? 0) + elapsedSeconds, step * maxSteps);
  let steps = 0;
  while (world.accumulator >= step && steps < maxSteps) {
    world.step(step);
    world.accumulator -= step;
    steps += 1;
  }
  return steps;
}

export function advanceFlipperMotor(motor, inputHeld, dt = FIXED_DT) {
  const target = inputHeld ? motor.activeAngle : motor.restAngle;
  const error = target - motor.angle;
  const torque = clamp(error * motor.stiffness - motor.damping * motor.angularVelocity, -motor.maxTorque, motor.maxTorque);
  const angularAcceleration = torque / Math.max(motor.inertia, EPSILON);
  motor.angularVelocity = clamp(motor.angularVelocity + angularAcceleration * dt, -motor.maxSpeed, motor.maxSpeed);
  const previousAngle = motor.angle;
  motor.angle += motor.angularVelocity * dt;
  if (error !== 0 && (target - motor.angle) * error < 0) {
    motor.angle = target;
    motor.angularVelocity = 0;
  }
  return { previousAngle, angle: motor.angle, angularVelocity: motor.angularVelocity, target };
}

const ELEMENTS = Object.freeze(['Fire', 'Water', 'Wind', 'Earth']);

export function addElementStack(effects = {}, element, amount = 1, maxStacks = 3, duration = 90) {
  if (!ELEMENTS.includes(element) || amount <= 0) return effects;
  const current = effects[element] ?? { stacks: 0, timer: 0 };
  effects[element] = { stacks: clamp(current.stacks + amount, 0, maxStacks), timer: Math.max(current.timer, duration) };
  return effects;
}

export function decayElementStacks(effects = {}, ticks = 1) {
  Object.entries(effects).forEach(([element, effect]) => {
    effect.timer = Math.max(0, (effect.timer ?? 0) - ticks);
    if (effect.timer === 0) effect.stacks = 0;
    if (effect.stacks === 0) delete effects[element];
  });
  return effects;
}

export function resolveHybrid(effects = {}) {
  const active = new Set(Object.entries(effects).filter(([, effect]) => (effect?.stacks ?? 0) > 0).map(([element]) => element));
  const pairs = [['Fire', 'Water', 'steam-fracture'], ['Fire', 'Wind', 'thermal-lance'], ['Water', 'Earth', 'slurry-bind'], ['Earth', 'Wind', 'root-sling']];
  const match = pairs.find(([a, b]) => active.has(a) && active.has(b));
  return match ? { id: match[2], elements: match.slice(0, 2) } : null;
}

export { add, clamp, dot, magnitude, normalize, scale, subtract };
