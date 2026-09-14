/* =========================================================
    BALLOON — slot 7

    LMB: addBalloon(hit.body, hit.point) — balloon lifts.
    RMB: pop nearest balloon to aim point with debris burst.
    R: clearBalloons().
    Cannot attach to body.type === 'level'.
    ========================================================= */
import { Tools } from './index.js';
import { addBalloon, clearBalloons, popBalloon, balloons } from '../entities/attachments.js';
import { aimHit } from './aim.js';
import { spawnShards } from '../physics/debris.js';

const COLOUR = 0xff7fa8;

Tools.register({
  id: 'balloon',
  slot: 7,
  name: 'BALLOON',
  colour: COLOUR,
  hint: {
    lmb: 'add balloon',
    rmb: 'pop nearest',
    extra: 'R clears all'
  },

  primary(down) {
    if (!down) return;
    const hit = aimHit(60);
    if (!hit || !hit.body) return;
    if (hit.body.type === 'level') return;
    addBalloon(hit.body, hit.point);
  },

  secondary(down) {
    if (!down) return;
    const hit = aimHit(30);
    if (!hit) return;
    let nearest = null;
    let distSq = Infinity;
    for (const b of balloons) {
      const d = hit.point.distanceToSquared(b.balloon.pos);
      if (d < distSq) {
        distSq = d;
        nearest = b;
      }
    }
    if (nearest) {
      popBalloon(nearest);
      spawnShards(nearest.balloon.pos, 2);
    }
  },

  reload() {
    clearBalloons();
  }
});
