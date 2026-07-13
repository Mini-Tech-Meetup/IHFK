import { FORCE_TOUCH } from '../config.js';
import { requestLandscape } from '../utils/mobile.js';

export class TitleScene extends Phaser.Scene {
  constructor(){super('Title');}
  create(){document.body.dataset.scene='Title';this.cameras.main.setBackgroundColor('#332e31');this.renderMenu();}
  clear(){this.bubbleTimer?.remove();this.bubbleTimer=null;this.ui.clear();}
  renderMenu(){
    this.clear();
    this.complaint=this.ui.showTitle({onLanguage:()=>this.scene.start('Language'),onGuide:()=>this.renderGuide(),onCredits:()=>this.renderCredits()});
    const show=()=>this.ui.setComplaint(this.complaint,this.i18n.t('findStart'));
    this.bubbleTimer=this.time.addEvent({delay:Phaser.Math.Between(2000,4000),callback:()=>{show();this.bubbleTimer.delay=Phaser.Math.Between(2000,4000);},loop:true});show();
  }
  renderGuide(){this.clear();this.ui.showGuide({onStart:()=>this.startGame(),onBack:()=>this.renderMenu()});}
  renderCredits(){this.clear();this.ui.showCredits({onBack:()=>this.renderMenu()});}
  async startGame(){
    const mobile=FORCE_TOUCH||matchMedia('(pointer: coarse)').matches;
    const displayRequest=mobile?requestLandscape():Promise.resolve({fullscreen:false,locked:false});
    const audioRequest=this.audio.unlock();
    this.audio.startMusic();
    const [display]=await Promise.allSettled([displayRequest,audioRequest]);
    const displayState=display.status==='fulfilled'?display.value:{fullscreen:false,locked:false};
    document.body.dataset.fullscreen=String(displayState.fullscreen);
    document.body.dataset.orientationLocked=String(displayState.locked);
    try{this.audio.sfx('pickup');}catch{}
    this.session.resetRun();this.ui.clear();this.scene.start('Intro');
  }
}
