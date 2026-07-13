const WEAPONS = [
  ['fist', '1', 'fist.png'],
  ['bat', '2', 'bat.png'],
  ['chainsaw', '3', 'chainsaw.png'],
  ['shotgun', '4', 'shotgun.png']
];

export class Hud {
  constructor(scene, session, i18n, targetKey, onWeaponSelect = null) {
    this.scene = scene;
    this.session = session;
    this.i18n = i18n;
    this.targetKey = targetKey;
    this.root = document.querySelector('#ui-layer');
    this.root.className = 'hud-ui';
    this.root.innerHTML = `
      <div class="game-hud">
        <div class="objective-ticket"><small>ORDER NO. 404</small><strong data-hud="objective"></strong><span data-hud="progress"></span></div>
        <div class="timer-module"><small>${this.i18n.t('time')}</small><strong data-hud="timer">00:00.00</strong><i></i></div>
        <div class="weapon-rack" aria-label="Weapons"></div>
      </div>`;
    this.objective = this.root.querySelector('[data-hud="objective"]');
    this.progress = this.root.querySelector('[data-hud="progress"]');
    this.timer = this.root.querySelector('[data-hud="timer"]');
    this.timerModule = this.root.querySelector('.timer-module');
    this.rack = this.root.querySelector('.weapon-rack');
    this.slots = new Map();
    WEAPONS.forEach(([key, number, icon]) => {
      const slot = document.createElement('button');
      slot.type = 'button';
      slot.className = 'weapon-slot'; slot.dataset.weapon = key;
      slot.setAttribute('aria-label', `Select weapon ${number}: ${key}`);
      slot.innerHTML = `<b>${number}</b><img src="assets/ui/icons/${icon}" alt=""><span>0</span>`;
      slot.addEventListener('click', () => onWeaponSelect?.(key));
      this.rack.append(slot); this.slots.set(key, slot);
    });
  }

  format(ms) {
    const min = Math.floor(ms / 60000), sec = Math.floor(ms / 1000) % 60, cs = Math.floor(ms / 10) % 100;
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
  }

  update(progress = '') {
    this.objective.textContent = this.i18n.t(this.targetKey);
    this.progress.textContent = progress;
    this.timerModule.hidden = this.session.mode === 'endless';
    this.timer.textContent = this.format(this.session.getElapsed());
    const values = { fist: '∞', bat: Math.ceil(this.session.weapons.bat), chainsaw: `${(this.session.weapons.chainsaw / 1000).toFixed(1)}s`, shotgun: Math.ceil(this.session.weapons.shotgun) };
    this.slots.forEach((slot, key) => {
      const empty = key !== 'fist' && this.session.weapons[key] <= 0;
      slot.classList.toggle('selected', key === this.session.selectedWeapon);
      slot.classList.toggle('empty', empty);
      slot.disabled = empty;
      slot.querySelector('span').textContent = values[key];
    });
  }

  destroy() { this.root.replaceChildren(); this.root.className = ''; }
}
