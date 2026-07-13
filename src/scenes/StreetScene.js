import { BasePlayScene } from './BasePlayScene.js';
import { drawStreet, addPixelText } from '../utils/visuals.js';
import { BALANCE } from '../config.js';

export class StreetScene extends BasePlayScene {
  constructor(){super('Street');}
  create(){document.body.dataset.scene='Street';drawStreet(this);this.session.streetDestroyed=0;this.createPlay('targetStreet');this.allowDrops=true;this.exitOpen=false;this.eventCount=0;this.exit=addPixelText(this,930,330,'LOCKED',18,{bold:true,color:'#fff',background:'#222'});this.spawnTimer=this.time.addEvent({delay:2000,loop:true,callback:()=>this.spawnEvent()});}
  spawnEvent(){if(this.exitOpen||this.kiosks.countActive(true)>=12)return;this.eventCount++;const count=this.eventCount%7===0?Phaser.Math.Between(3,5):1;for(let i=0;i<count;i++)this.time.delayedCall(i*120,()=>{if(this.kiosks.countActive(true)<12)this.spawnKiosk(Phaser.Math.Between(90,990),true,'street');});}
  onKioskDestroyed(kiosk){super.onKioskDestroyed(kiosk);if(this.session.streetDestroyed>=BALANCE.streetGoal&&!this.exitOpen){this.exitOpen=true;this.spawnTimer.remove();this.exit.setText('FACTORY →').setBackgroundColor('#245d39');this.audio.sfx('pickup');}}
  getProgress(){return `${Math.min(BALANCE.streetGoal,this.session.streetDestroyed)} / ${BALANCE.streetGoal}`;}
  update(time){super.update(time);if(this.exitOpen&&this.player.x>1000){this.shutdownPlay();this.cameras.main.fadeOut(120,0,0,0);this.time.delayedCall(120,()=>this.scene.start('Factory',{mode:'campaign'}));}}
}
