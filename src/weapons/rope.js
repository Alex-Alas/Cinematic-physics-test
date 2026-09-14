/* =========================================================
    ROPE / WELD — slot 8

    Two-click tool:
      first click:  stores the anchor body and world point.
      second click: creates a rope (LMB) or weld (RMB) between them.
    Invalid second clicks (miss, level, same body) cancel the selection.
    R removes only joints created by this tool. Escape or losing pointer
    lock also cancels a pending first click.
    ========================================================= */
import { events } from '../core/events.js';
import { Tools } from './index.js';
import { addRope, weld, removeJoint, removeJointGroup } from '../physics/joints.js';
import { aimHit } from './aim.js';
import { scene } from '../render/scene.js';
import { makeMaterial } from '../render/shader.js';
import { sphereMesh } from '../render/shapes.js';

const markerMat = makeMaterial(0xd8d0ff);
const marker = sphereMesh(0.12, markerMat);
marker.visible = false;

let pending = null;  // { body, point }

function clearPending() {
  pending = null;
  marker.visible = false;
  scene.remove(marker);
}

function setPending(body, point) {
  clearPending();
  pending = { body, point };
  marker.position.copy(point);
  marker.visible = true;
  scene.add(marker);
}

const createdRopes = [];
const createdWelds = [];

function removeCreatedRopes() {
  for (let i = createdRopes.length - 1; i >= 0; i--) {
    removeJoint(createdRopes[i]);
  }
  createdRopes.length = 0;
}

function removeCreatedWelds() {
  for (let i = createdWelds.length - 1; i >= 0; i--) {
    removeJointGroup(createdWelds[i].group);
  }
  createdWelds.length = 0;
}

events.on('pointer:lock', (locked) => {
  if (!locked) clearPending();
});

Tools.register({
  id: 'rope',
  slot: 8,
  name: 'ROPE / WELD',
  colour: 0xd8d0ff,
  hint: {
    lmb: 'rope (2 clicks)',
    rmb: 'weld (2 clicks)',
    extra: 'R clears · Esc cancels'
  },

  unequip() {
    clearPending();
  },

  primary(down) {
    if (!down) return;
    const hit = aimHit(60);
    if (!pending) {
      if (!hit || !hit.body || hit.body.type === 'level') return;
      setPending(hit.body, hit.point);
      return;
    }
    if (!hit || !hit.body || hit.body.type === 'level' || hit.body === pending.body) {
      clearPending();
      return;
    }
    const len = Math.max(0.1, pending.point.distanceTo(hit.point));
    const j = addRope(pending.body, hit.body, pending.point, hit.point, len, { visible: true });
    createdRopes.push(j);
    clearPending();
  },

  secondary(down) {
    if (!down) return;
    const hit = aimHit(60);
    if (!pending) {
      if (!hit || !hit.body || hit.body.type === 'level') return;
      setPending(hit.body, hit.point);
      return;
    }
    if (!hit || !hit.body || hit.body.type === 'level' || hit.body === pending.body) {
      clearPending();
      return;
    }
    const group = weld(pending.body, hit.body);
    createdWelds.push(group);
    clearPending();
  },

  reload() {
    removeCreatedRopes();
    removeCreatedWelds();
    clearPending();
  }
});
