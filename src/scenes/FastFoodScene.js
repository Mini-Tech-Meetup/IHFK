import { BasePlayScene } from './BasePlayScene.js';
import { drawFastFood, addGoSign } from '../utils/visuals.js';
import { TEST_MODE, PREVIEW_LANDING, PREVIEW_PICKUP } from '../config.js';

export class FastFoodScene extends BasePlayScene {
  constructor(){super('FastFood');}
  create(){document.body.dataset.scene='FastFood';document.body.dataset.exitState='hidden';drawFastFood(this);this.createPlay('targetStore');this.allowDrops=false;this.exitOpen=false;this.spawnKiosk(TEST_MODE?430:700,PREVIEW_LANDING,'fastfood');if(PREVIEW_PICKUP)this.dropWeapon(510,455,PREVIEW_PICKUP);this.goSign=addGoSign(this,930,285);this.events.on('kiosk-destroyed',k=>{if(k.stage==='fastfood'){this.exitOpen=true;document.body.dataset.exitState='go';this.goSign.show();this.audio.sfx('pickup');}},this);}
  getProgress(){return `${Math.min(2,this.session.destroyedTotal)} / 2`;}
  update(time){super.update(time);if(this.exitOpen&&this.player.x>1000){this.shutdownPlay();this.cameras.main.fadeOut(120,0,0,0);this.time.delayedCall(120,()=>this.scene.start('Street'));}}
}
