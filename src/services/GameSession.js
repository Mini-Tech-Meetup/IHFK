import { BALANCE } from '../config.js';

export class GameSession {
  constructor() {
    this.locale = 'en';
    this.playtestRuns = [];
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
    this.playtestRecorded = false;
    this.selectedWeapon = 'fist';
    this.weapons = { bat: 0, chainsaw: 0, shotgun: 0 };
  }

  startTimer(now = performance.now()) { this.startedAt = now; this.elapsedMs = 0; this.running = true; }
  stopTimer(now = performance.now()) { if (this.running) this.elapsedMs = now - this.startedAt; this.running = false; }
  getElapsed(now = performance.now()) { return this.running ? now - this.startedAt : this.elapsedMs; }
  recordPlaytestRun(ms = this.elapsedMs) {
    if (!this.playtestRecorded && this.playtestRuns.length < 3) {
      this.playtestRuns.push(Math.max(0, Math.round(ms)));
      this.playtestRecorded = true;
    }
    return this.getPlaytestSummary();
  }
  resetPlaytest() { this.playtestRuns = []; this.playtestRecorded = false; }
  getPlaytestSummary() {
    const runs = this.playtestRuns.slice();
    const averageMs = runs.length ? Math.round(runs.reduce((sum, value) => sum + value, 0) / runs.length) : 0;
    return { runs, count:runs.length, averageMs, complete:runs.length>=3, passed:runs.length>=3&&averageMs>=150000&&averageMs<=210000 };
  }
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
