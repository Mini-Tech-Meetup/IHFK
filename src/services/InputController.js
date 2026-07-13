const sharedTouch = { left:false, right:false, jump:false, attack:false, jumpQueued:false, attackQueued:false, weapon:null };

import { AUTO_PLAY, FORCE_TOUCH, PREVIEW_WEAPON, PREVIEW_KIOSK, PREVIEW_LANDING, PREVIEW_FACTORY, PREVIEW_STRESS, PREVIEW_PICKUP } from '../config.js';

export class InputController {
  constructor(scene) {
    this.scene = scene;
    this.touch = sharedTouch;
    this.keys = scene.input.keyboard.addKeys({
      left:'LEFT', right:'RIGHT', jump:'UP', attack:'SPACE', fist:'ONE', bat:'TWO', chainsaw:'THREE', shotgun:'FOUR', mute:'M'
    });
    this.bindTouch();
  }

  bindTouch() {
    document.body.classList.toggle('touch-device', FORCE_TOUCH || matchMedia('(pointer: coarse)').matches);
    const joy = document.querySelector('#joystick');
    const knob = document.querySelector('#joystick-knob');
    if (joy && !joy.dataset.bound) {
      joy.dataset.bound = 'true';
      const move = event => {
        const point = event.touches?.[0] || event;
        const box = joy.getBoundingClientRect();
        const dx = point.clientX - (box.left + box.width / 2);
        const clamped = Math.max(-48, Math.min(48, dx));
        knob.style.transform = `translateX(${clamped}px)`;
        sharedTouch.left = dx < -18; sharedTouch.right = dx > 18;
      };
      const stop = () => { sharedTouch.left=false; sharedTouch.right=false; knob.style.transform=''; };
      joy.addEventListener('pointerdown', event => { joy.setPointerCapture(event.pointerId); move(event); });
      joy.addEventListener('pointermove', event => { if (joy.hasPointerCapture(event.pointerId)) move(event); });
      joy.addEventListener('pointerup', stop); joy.addEventListener('pointercancel', stop);
    }
    this.bindHold('#touch-jump', 'jump');
    this.bindHold('#touch-attack', 'attack');
    document.querySelectorAll('[data-weapon]').forEach(button => {
      if (button.dataset.bound) return;
      button.dataset.bound = 'true';
      button.addEventListener('pointerdown', event => { event.preventDefault(); sharedTouch.weapon = button.dataset.weapon; });
    });
  }

  bindHold(selector, key) {
    const element = document.querySelector(selector);
    if (!element || element.dataset.bound) return;
    element.dataset.bound = 'true';
    const down = event => { event.preventDefault(); sharedTouch[key] = true; sharedTouch[`${key}Queued`] = true; };
    const up = event => { event.preventDefault(); sharedTouch[key] = false; };
    element.addEventListener('pointerdown', down); element.addEventListener('pointerup', up);
    element.addEventListener('pointercancel', up); element.addEventListener('pointerleave', up);
  }

  setGameplay(enabled) {
    document.body.classList.toggle('gameplay', enabled);
    if (!enabled) Object.assign(sharedTouch,{left:false,right:false,jump:false,attack:false,jumpQueued:false,attackQueued:false,weapon:null});
  }
  get left() { return !AUTO_PLAY && (this.keys.left.isDown || this.touch.left); }
  get right() { return (AUTO_PLAY&&!PREVIEW_WEAPON&&!PREVIEW_KIOSK&&!PREVIEW_FACTORY&&!PREVIEW_STRESS&&!PREVIEW_PICKUP) || this.keys.right.isDown || this.touch.right; }
  get jump() { return Phaser.Input.Keyboard.JustDown(this.keys.jump) || this.consumeQueued('jump'); }
  get attack() { return (AUTO_PLAY&&!PREVIEW_LANDING&&!PREVIEW_STRESS&&!PREVIEW_PICKUP) || this.keys.attack.isDown || Phaser.Input.Keyboard.JustDown(this.keys.attack) || this.touch.attack || this.consumeQueued('attack'); }
  consumeTouch(key) { const value = this.touch[key]; this.touch[key] = false; return value; }
  consumeQueued(key) { const queued=`${key}Queued`;const value=this.touch[queued];this.touch[queued]=false;return value; }
  consumeWeapon() {
    const mapping = [['fist',this.keys.fist],['bat',this.keys.bat],['chainsaw',this.keys.chainsaw],['shotgun',this.keys.shotgun]];
    for (const [name,key] of mapping) if (Phaser.Input.Keyboard.JustDown(key)) return name;
    const value = this.touch.weapon; this.touch.weapon = null; return value;
  }
  consumeMute() { return Phaser.Input.Keyboard.JustDown(this.keys.mute); }
}
