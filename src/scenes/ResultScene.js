import { drawFactory } from '../utils/visuals.js';
import { ShareCardService } from '../services/ShareCardService.js';
import { PLAYTEST_MODE } from '../config.js';

export class ResultScene extends Phaser.Scene {
  constructor(){super('Result');}
  create(){
    document.body.dataset.scene='Result';document.body.dataset.elapsedMs=String(Math.round(this.session.elapsedMs));document.body.dataset.destroyed=String(this.session.destroyedTotal);delete document.body.dataset.shareOutcome;
    document.body.classList.remove('gameplay');drawFactory(this);this.add.image(740,288,'factory-v2-4').setDepth(-9);const share=new ShareCardService(this.session,this.i18n,this.textures);const shareCanvas=share.createCanvas();const previewUrl=shareCanvas.toDataURL('image/png');const playtest=PLAYTEST_MODE?this.session.recordPlaytestRun(this.session.elapsedMs):null;
    if(playtest){document.body.dataset.playtestRuns=String(playtest.count);document.body.dataset.playtestAverage=String(playtest.averageMs);document.body.dataset.playtestStatus=playtest.complete?(playtest.passed?'pass':'retest'):'collecting';}
    const retry=()=>{this.ui.clear();this.session.resetRun();this.audio.startMusic();this.scene.start('Intro');};
    const endless=()=>{this.ui.clear();this.session.mode='endless';this.session.endlessDestroyed=0;this.audio.startMusic();this.scene.start('Factory',{mode:'endless'});};
    const shareResult=async()=>{try{const outcome=await share.share(shareCanvas);document.body.dataset.shareOutcome=outcome;return outcome;}catch(error){document.body.dataset.shareOutcome='error';console.error(error);return 'error';}};
    this.ui.showResult({time:share.formatTime(this.session.elapsedMs),destroyed:this.session.destroyedTotal,previewUrl,playtest,onRetry:retry,onEndless:endless,onShare:shareResult});
    this.input.keyboard.on('keydown-R',retry);this.input.keyboard.on('keydown-K',endless);this.input.keyboard.on('keydown-S',shareResult);
  }
}
