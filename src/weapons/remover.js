/* =========================================================
    REMOVER — slot 9

    LMB: removeBody(hit.body) if not 'level'. removeBody already
    cleans joints and attachments via events.
    RMB: clear all dynamic props.
    ========================================================= */
import { Tools } from './index.js';
import { removeBody, clearBodies } from '../physics/world.js';
import { aimHit } from './aim.js';
import { spawnShards } from '../physics/debris.js';

const COLOUR = 0xff5f8f;

Tools.register({
  id: 'remover',
  slot: 9,
  name: 'REMOVER',
  colour: COLOUR,
  hint: {
    lmb: 'remove prop',
    rmb: 'clear all props',
    extra: 'removes joints and attachments'
  },

  primary(down) {
    if (!down) return;
    const hit = aimHit(60);
    if (!hit || !hit.body) return;
    if (hit.body.type === 'level') return;
    spawnShards(hit.point, 4);
    removeBody(hit.body);
  },

  secondary(down) {
    if (!down) return;
    clearBodies(b => b.type !== 'level');
  }
});
