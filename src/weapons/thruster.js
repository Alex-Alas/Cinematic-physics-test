/* =========================================================
    THRUSTER — slot 6

    LMB: addThruster(hit.body, hit.point, hit.normal, 900) — stays on.
    RMB: toggleThrusters() — on/off all.
    R: clearThrusters().
    Cannot attach to body.type === 'level'.
    ========================================================= */
import { Tools } from './index.js';
import { addThruster, toggleThrusters, clearThrusters } from '../entities/attachments.js';
import { aimHit } from './aim.js';

const COLOUR = 0xff9a3c;

Tools.register({
  id: 'thruster',
  slot: 6,
  name: 'THRUSTER',
  colour: COLOUR,
  hint: {
    lmb: 'activate thruster',
    rmb: 'toggle thrusters',
    extra: 'force at offset spins props'
  },

  primary(down) {
    if (!down) return;
    const hit = aimHit(60);
    if (!hit || !hit.body) return;
    if (hit.body.type === 'level') return;
    addThruster(hit.body, hit.point, hit.normal, 900);
  },

  secondary(down) {
    if (!down) return;
    toggleThrusters();
  },

  reload() {
    clearThrusters();
  }
});
