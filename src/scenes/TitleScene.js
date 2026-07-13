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
    this.audio.unlock().then(()=>this.audio.sfx('pickup')).catch(()=>{});
    if(FORCE_TOUCH||matchMedia('(pointer: coarse)').matches)await requestLandscape();
    this.session.resetRun();this.ui.clear();this.scene.start('Intro');
  }
}
