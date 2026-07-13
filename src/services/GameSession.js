import { BALANCE } from '../config.js';

export class GameSession {
  constructor() {
    this.locale = 'en';
    this.resetRun();
  }

  resetRun() {
    this.mode = 'campaign';
    this.destroyedTotal = 0;
    this.streetDestroyed = 0;
    this.endlessDestroyed = 0;
    this.startedAt = 0;
    this.elapsedMs = 0;
    this.running = false;
    this.selectedWeapon = 'fist';
    this.weapons = { bat: 0, chainsaw: 0, shotgun: 0 };
  }

  startTimer(now = performance.now()) { this.startedAt = now; this.elapsedMs = 0; this.running = true; }
  stopTimer(now = performance.now()) { if (this.running) this.elapsedMs = now - this.startedAt; this.running = false; }
  getElapsed(now = performance.now()) { return this.running ? now - this.startedAt : this.elapsedMs; }
  recordKiosk(stage = 'global') {
    this.destroyedTotal += 1;
    if (stage === 'street') this.streetDestroyed += 1;
    if (this.mode === 'endless') this.endlessDestroyed += 1;
  }

  selectWeapon(key) {
    if (key === 'fist') this.selectedWeapon = key;
    else if ((this.weapons[key] ?? 0) > 0) this.selectedWeapon = key;
  }
  addWeapon(key) {
    if (!(key in this.weapons)) return;
    this.weapons[key] = Math.min(BALANCE.caps[key], this.weapons[key] + BALANCE.grants[key]);
  }
  consumeWeapon(key, amount) {
    if (key === 'fist') return true;
    if ((this.weapons[key] ?? 0) <= 0) { this.selectedWeapon = 'fist'; return false; }
    this.weapons[key] = Math.max(0, this.weapons[key] - amount);
    if (this.weapons[key] <= 0) this.selectedWeapon = 'fist';
    return true;
  }
}
