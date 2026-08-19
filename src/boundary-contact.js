// Normalize table-edge penetration into the shared contact manifold.
// Boundary contacts are intentionally reported at the end of the fixed step:
// swept interior contacts must win first, while the edge remains a deterministic
// recovery candidate for the next dispatch.
export function collectBoundaryContactCandidates(ball, table) {
  if (!ball || !table) return [];
  const candidates = [];
  if (ball.x - ball.r < table.left) candidates.push({ kind: 'boundary', edge: 'left', order: 'boundary-left', t: 1, normal: { x: 1, y: 0 }, point: { x: table.left, y: ball.y }, penetration: table.left - (ball.x - ball.r) });
  if (ball.x + ball.r > table.right) candidates.push({ kind: 'boundary', edge: 'right', order: 'boundary-right', t: 1, normal: { x: -1, y: 0 }, point: { x: table.right, y: ball.y }, penetration: (ball.x + ball.r) - table.right });
  if (ball.y - ball.r < table.top) candidates.push({ kind: 'boundary', edge: 'top', order: 'boundary-top', t: 1, normal: { x: 0, y: 1 }, point: { x: ball.x, y: table.top }, penetration: table.top - (ball.y - ball.r) });
  return candidates.filter(candidate => candidate.penetration > 0);
}
