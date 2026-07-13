import { BasePlayScene } from './BasePlayScene.js';
import { drawStreet, addGoSign } from '../utils/visuals.js';
import { BALANCE } from '../config.js';

export class StreetScene extends BasePlayScene {
  constructor(){super('Street');}
  create(){document.body.dataset.scene='Street';document.body.dataset.exitState='hidden';drawStreet(this);this.session.streetDestroyed=0;this.createPlay('targetStreet');this.allowDrops=true;this.exitOpen=false;this.eventCount=0;this.goSign=addGoSign(this,930,300);this.spawnTimer=this.time.addEvent({delay:2000,loop:true,callback:()=>this.spawnEvent()});}
  spawnEvent(){if(this.exitOpen||this.kiosks.countActive(true)>=12)return;this.eventCount++;const count=this.eventCount%7===0?Phaser.Math.Between(3,5):1;for(let i=0;i<count;i++)this.time.delayedCall(i*120,()=>{if(this.kiosks.countActive(true)<12)this.spawnKiosk(Phaser.Math.Between(90,990),true,'street');});}
  onKioskDestroyed(kiosk){super.onKioskDestroyed(kiosk);if(this.session.streetDestroyed>=BALANCE.streetGoal&&!this.exitOpen){this.exitOpen=true;document.body.dataset.exitState='go';this.spawnTimer.remove();this.goSign.show();this.audio.sfx('pickup');}}
  getProgress(){return `${Math.min(BALANCE.streetGoal,this.session.streetDestroyed)} / ${BALANCE.streetGoal}`;}
  update(time){super.update(time);if(this.exitOpen&&this.player.x>1000){this.shutdownPlay();this.cameras.main.fadeOut(120,0,0,0);this.time.delayedCall(120,()=>this.scene.start('Factory',{mode:'campaign'}));}}
}
