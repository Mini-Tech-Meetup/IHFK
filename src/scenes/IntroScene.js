import { drawFastFood } from '../utils/visuals.js';
import { GROUND_Y, PREVIEW_TRANSFORM, PREVIEW_WEAPON, PREVIEW_KIOSK, PREVIEW_LANDING, PREVIEW_FACTORY, PREVIEW_STRESS, PREVIEW_STRESS_MODE, PREVIEW_PICKUP } from '../config.js';

export class IntroScene extends Phaser.Scene {
  constructor(){super('Intro');}
  create(){
    document.body.dataset.scene='Intro';
    if(PREVIEW_WEAPON||PREVIEW_KIOSK||PREVIEW_LANDING||PREVIEW_FACTORY||PREVIEW_STRESS||PREVIEW_PICKUP){this.ui.clear();this.session.startTimer();this.scene.start(PREVIEW_FACTORY||PREVIEW_STRESS?'Factory':'FastFood',PREVIEW_FACTORY||PREVIEW_STRESS?{mode:PREVIEW_STRESS?PREVIEW_STRESS_MODE:'campaign'}:undefined);return;}
    drawFastFood(this);document.body.classList.remove('gameplay');this.kiosk=this.add.image(535,GROUND_Y,'kiosk-v2-0').setOrigin(.5,1).setScale(1.15);this.hero=this.add.sprite(400,GROUND_Y,'normal-idle').setOrigin(.5,1).setScale(5).play('normal-idle');
    this.lastBubbleSignature='';this.onBubbleResize=()=>{this.lastBubbleSignature='';this.syncBubble(true);};this.scale.on('resize',this.onBubbleResize);globalThis.visualViewport?.addEventListener('resize',this.onBubbleResize);this.events.once('shutdown',()=>{this.scale.off('resize',this.onBubbleResize);globalThis.visualViewport?.removeEventListener('resize',this.onBubbleResize);});
    const show=text=>{this.bubble=this.ui.showIntroBubble(text);this.syncBubble(true);};
    if(PREVIEW_TRANSFORM){show('TRANSFORM SPRITE QA');this.time.delayedCall(250,()=>this.previewTransform());return;}
    const keys=['intro1','intro2','intro3','intro4'];let index=0;const next=()=>{if(index<keys.length){show(this.i18n.t(keys[index++]));this.time.delayedCall(index<3?800:600,next);return;}this.transform();};next();
  }
  syncBubble(force=false){
    if(!this.bubble||!this.hero?.active||!this.game.canvas)return;
    const rect=this.game.canvas.getBoundingClientRect(),view=this.cameras.main.worldView;const viewWidth=view?.width||1080,viewHeight=view?.height||640;
    const headY=this.hero.y-this.hero.displayHeight+Math.min(22,this.hero.displayHeight*.18);
    const x=rect.left+((this.hero.x-(view?.x||0))/viewWidth)*rect.width;const y=rect.top+((headY-(view?.y||0))/viewHeight)*rect.height;
    const signature=[rect.left,rect.top,rect.width,rect.height,this.hero.x,headY,this.bubble.textContent,this.bubble.offsetWidth].map(value=>typeof value==='number'?Math.round(value*10)/10:value).join('|');
    if(!force&&signature===this.lastBubbleSignature)return;this.lastBubbleSignature=signature;this.ui.positionIntroBubble(this.bubble,{x,y});
  }
  previewTransform(){this.hero.setTexture('normal-idle',0).play('normal-transform');this.hero.once('animationcomplete',()=>this.time.delayedCall(350,()=>this.previewTransform()));}
  update(){this.syncBubble();if(this.hero?.anims?.currentFrame)document.body.dataset.introFrame=String(this.hero.anims.currentFrame.index);}
  transform(){
    this.hero.play('normal-transform');this.hero.once('animationcomplete',()=>{this.hero.setTexture('strong-idle',0).setScale(5);this.kiosk.setTexture('kiosk-v2-4');this.cameras.main.shake(130,.018);this.cameras.main.flash(60,255,255,255);this.audio.sfx('break');this.session.recordKiosk('fastfood');this.time.delayedCall(450,()=>{this.ui.clear();this.session.startTimer();this.audio.startMusic();this.scene.start('FastFood');});});
  }
}
