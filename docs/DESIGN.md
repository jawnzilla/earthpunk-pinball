# Deadlight Design Intent Draft

## Player

Deadlight is for players who enjoy tactile arcade interactions, short replayable runs, and making risky choices under pressure. A session should be understandable immediately on a phone, while the run structure gives the player reasons to try again.

## Game

The player controls an excavation probe in a subterranean settlement that is trying to tunnel back to the surface. The probe is represented by a pinball moving through buried industrial infrastructure. The player works the flippers, collects salvage, restores machinery, and manages the stability of the route.

The prototype's central loop is: launch the probe, use pinball skill to hit salvage targets and generators, manage stability when the probe falls into a drain, and complete the surface-signal route before the tunnel collapses. Later stages will introduce hazards and between-stage upgrade choices that change the table for the current run.

## Prototype contents

The first playable slice contains a portrait table, touch controls, six salvage targets, three generator bumpers, charge and salvage feedback, a three-point stability resource, win and loss states, and reset/replay. All visuals are original code-drawn shapes and all resources are local so the build can run without network access.

## Future vision

The complete prototype will become a pinball roguelike. Each stage presents a new underground hazard and a choice of one of three upgrades: alter the table, protect the probe, or increase resource yield. A successful run reaches the surface signal and reveals a viable route; a failed run loses the probe but teaches the player which upgrades and routes are worth risking. The long-term game would expand the settlement, table modules, and surface reconstruction without losing the focused tactile loop.
