import { LOCALE_NAMES } from '../data/locales.js';
import { AUTO_PLAY } from '../config.js';

export class LanguageScene extends Phaser.Scene {
  constructor(){super('Language');}
  create(){
    document.body.dataset.scene='Language';
    if(AUTO_PLAY){this.session.locale='en';this.session.resetRun();this.scene.start('Intro');return;}
    this.cameras.main.setBackgroundColor('#332e31');
    this.ui.showLanguage(LOCALE_NAMES,locale=>{this.session.locale=locale;const rotate=document.querySelector('#rotate-overlay span');if(rotate)rotate.textContent=this.i18n.t('rotate');this.scene.start('Title');});
  }
}
