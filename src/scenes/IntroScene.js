import { drawFastFood } from '../utils/visuals.js';
import { GROUND_Y, PREVIEW_TRANSFORM, PREVIEW_WEAPON, PREVIEW_KIOSK, PREVIEW_LANDING, PREVIEW_FACTORY, PREVIEW_STRESS, PREVIEW_STRESS_MODE, PREVIEW_PICKUP } from '../config.js';

export class IntroScene extends Phaser.Scene {
  constructor(){super('Intro');}
  create(){
    document.body.dataset.scene='Intro';
    if(PREVIEW_WEAPON||PREVIEW_KIOSK||PREVIEW_LANDING||PREVIEW_FACTORY||PREVIEW_STRESS||PREVIEW_PICKUP){this.ui.clear();this.session.startTimer();this.scene.start(PREVIEW_FACTORY||PREVIEW_STRESS?'Factory':'FastFood',PREVIEW_FACTORY||PREVIEW_STRESS?{mode:PREVIEW_STRESS?PREVIEW_STRESS_MODE:'campaign'}:undefined);return;}
    drawFastFood(this);document.body.classList.remove('gameplay');this.kiosk=this.add.image(535,GROUND_Y,'kiosk-v2-0').setOrigin(.5,1).setScale(1.15);this.hero=this.add.sprite(400,GROUND_Y,'normal-idle').setOrigin(.5,1).setScale(5).play('normal-idle');
    const bubblePosition={x:(this.hero.x/1080)*100,y:69};
    if(PREVIEW_TRANSFORM){this.ui.showIntroBubble('TRANSFORM SPRITE QA',bubblePosition);this.time.delayedCall(250,()=>this.previewTransform());return;}
    const keys=['intro1','intro2','intro3','intro4'];let index=0;const next=()=>{if(index<keys.length){this.ui.showIntroBubble(this.i18n.t(keys[index++]),bubblePosition);this.time.delayedCall(index<3?800:600,next);return;}this.transform();};next();
  }
  previewTransform(){this.hero.setTexture('normal-idle',0).play('normal-transform');this.hero.once('animationcomplete',()=>this.time.delayedCall(350,()=>this.previewTransform()));}
  update(){if(this.hero?.anims?.currentFrame)document.body.dataset.introFrame=String(this.hero.anims.currentFrame.index);}
  transform(){
    this.hero.play('normal-transform');this.hero.once('animationcomplete',()=>{this.hero.setTexture('strong-idle',0).setScale(5);this.kiosk.setTexture('kiosk-v2-4');this.cameras.main.shake(130,.018);this.cameras.main.flash(60,255,255,255);this.audio.sfx('break');this.session.recordKiosk('fastfood');this.time.delayedCall(450,()=>{this.ui.clear();this.session.startTimer();this.audio.startMusic();this.scene.start('FastFood');});});
  }
}
