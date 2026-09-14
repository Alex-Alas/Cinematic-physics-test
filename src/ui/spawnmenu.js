/* =========================================================
    SPAWN MENU — Q key

    HTML overlay toggled with Q. Lists every registered prop so new
    props appear automatically. While open the pointer lock is released,
    which pauses player movement and lets the user click buttons.
    ========================================================= */
import * as THREE from 'three';
import { app, interactive } from '../core/app.js';
import { KeyActions } from './controls.js';
import { Props } from '../entities/props.js';
import { playerEye, playerForward } from '../entities/player.js';
import { spawnProp } from '../entities/props.js';

const menuId = 'spawnMenu';
let menuEl = document.getElementById(menuId);
let active = false;

function buildOverlay() {
  if (menuEl) return;

  menuEl = document.createElement('div');
  menuEl.id = menuId;
  menuEl.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 40;
    display: none;
    align-items: center;
    justify-content: center;
    background: rgba(8, 6, 14, 0.86);
  `;

  const panel = document.createElement('div');
  panel.style.cssText = `
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 12px;
    border: 2px solid #4d3f7a;
    background: #1d1733;
    box-shadow: 2px 2px 0 #0d0a17;
  `;

  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'CLOSE';
  closeBtn.addEventListener('click', () => closeMenu());
  panel.appendChild(closeBtn);

  menuEl.appendChild(panel);
  document.body.appendChild(menuEl);
}

function buildSpawnMenu() {
  buildOverlay();
  const panel = menuEl.firstElementChild;
  // Clear old prop buttons, keep the close button
  while (panel.children.length > 1) {
    panel.removeChild(panel.lastChild);
  }

  for (const p of Props.list()) {
    const btn = document.createElement('button');
    btn.innerHTML = `<i style="background:#${p.dot.toString(16).padStart(6, '0')}"></i>${p.label}`;
    btn.addEventListener('click', () => {
      closeMenu();
      spawnFromMenu(p.id);
    });
    panel.appendChild(btn);
  }
}

const _eye = new THREE.Vector3();
const _forward = new THREE.Vector3();

function spawnFromMenu(propId) {
  playerEye(_eye);
  playerForward(_forward);
  const spawnPos = _eye.addScaledVector(_forward, 4);
  spawnPos.y += 0.5;
  spawnProp(propId, spawnPos);
}

export function openMenu() {
  if (active) return;
  active = true;
  buildSpawnMenu();
  document.exitPointerLock?.();
  menuEl.style.display = 'flex';
}

export function closeMenu() {
  if (!active) return;
  active = false;
  menuEl.style.display = 'none';
}

export function toggleMenu() {
  if (active) closeMenu(); else openMenu();
}

KeyActions.register({
  id: 'spawnMenu',
  code: 'KeyQ',
  label: 'Q',
  hint: 'spawn menu',
  down: () => {
    if (app.play && interactive()) toggleMenu();
  }
});
