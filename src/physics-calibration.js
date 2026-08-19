import {
  calibrateContactResponse,
  calibrateFlipperContactResponse,
  capVelocity,
  createBall,
  damageFromContact,
  resolveContact,
  magnitude
} from './physics-core.js';

export const LIVE_SPEED_CAP_M_S = 6;

const finite = value => Number.isFinite(value);
const monotonic = values => values.every((value, index) => index === 0 || value >= values[index - 1]);

function contactProbe(ballVelocity, normal) {
  const ball = createBall({ vx: ballVelocity.x, vy: ballVelocity.y });
  return resolveContact({
    ball,
    surface: { material: 'stone', inverseMass: 0 },
    point: { x: 0, y: 0 },
    normal
  });
}

export function runPhysicsCalibration({ speedCap = LIVE_SPEED_CAP_M_S } = {}) {
  const contact = calibrateContactResponse({
    speeds: [1, 3, 5],
    surfaceMaterial: 'rubber'
  }).map(sample => ({
    ...sample,
    cappedOutgoingSpeed: magnitude(capVelocity({ x: 0, y: sample.outgoingSpeed }, speedCap))
  }));
  const timber = calibrateContactResponse({ speeds: [3], surfaceMaterial: 'timber' })[0];
  const stone = calibrateContactResponse({ speeds: [3], surfaceMaterial: 'stone' })[0];
  const flipper = calibrateFlipperContactResponse({
    incomingNormalSpeeds: [4],
    tangentSpeeds: [0],
    angularVelocities: [0, -8],
    contactPoint: { x: 0.6, y: 0 },
    pivot: { x: 0, y: 0 },
    normal: { x: 0, y: -1 }
  }).map(sample => ({
    ...sample,
    cappedOutgoingSpeed: magnitude(capVelocity({ x: 0, y: sample.outgoingSpeed }, speedCap))
  }));

  const stationary = contactProbe({ x: 0, y: 0 }, { x: 0, y: -1 });
  const parallel = contactProbe({ x: 4, y: 0 }, { x: 0, y: -1 });
  const belowThreshold = damageFromContact(
    contactProbe({ x: 0, y: -1 }, { x: 0, y: 1 }),
    { objectMaterial: 'timber', threshold: 1.2 }
  );
  const aboveThreshold = damageFromContact(
    contactProbe({ x: 0, y: -3 }, { x: 0, y: 1 }),
    { objectMaterial: 'timber', threshold: 1.2 }
  );

  const gates = {
    noManufacturedEnergy: stationary.impactEnergy === 0 && parallel.impactEnergy === 0,
    monotonicResponse: monotonic(contact.map(sample => sample.outgoingSpeed)),
    rubberBouncier: timber.responseRatio < contact[1].responseRatio && stone.responseRatio < contact[1].responseRatio,
    movingFlipperBoost: flipper[1].impactSpeed > flipper[0].impactSpeed,
    damageThreshold: belowThreshold === 0 && aboveThreshold > 0,
    speedCap: [...contact, ...flipper].every(sample => sample.cappedOutgoingSpeed <= speedCap)
  };

  return {
    speedCap,
    samples: {
      contact,
      flipper,
      stationaryImpactEnergy: stationary.impactEnergy,
      parallelImpactEnergy: parallel.impactEnergy,
      damage: { belowThreshold, aboveThreshold }
    },
    gates,
    pass: Object.values(gates).every(Boolean)
  };
}
