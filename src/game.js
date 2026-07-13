import { GAME_WIDTH, GAME_HEIGHT, BALANCE } from './config.js';
import { GameSession } from './services/GameSession.js';
import { I18n } from './services/I18n.js';
import { AudioService } from './services/AudioService.js';
import { GameUi } from './ui/GameUi.js';
import { BootScene } from './scenes/BootScene.js';
import { LanguageScene } from './scenes/LanguageScene.js';
import { TitleScene } from './scenes/TitleScene.js';
import { IntroScene } from './scenes/IntroScene.js';
import { FastFoodScene } from './scenes/FastFoodScene.js';
import { StreetScene } from './scenes/StreetScene.js';
import { FactoryScene } from './scenes/FactoryScene.js';
import { ResultScene } from './scenes/ResultScene.js';

if(!window.Phaser)throw new Error('Phaser 4.1 failed to load');
const session=new GameSession();const i18n=new I18n(session);const audio=new AudioService();const ui=new GameUi(session,i18n,audio);
Object.defineProperties(Phaser.Scene.prototype,{
  session:{get(){return session;}},i18n:{get(){return i18n;}},audio:{get(){return audio;}},ui:{get(){return ui;}}
});

window.IHFK = new Phaser.Game({
  type:Phaser.WEBGL,parent:'game',width:GAME_WIDTH,height:GAME_HEIGHT,backgroundColor:'#111111',pixelArt:true,roundPixels:true,
  scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH,width:GAME_WIDTH,height:GAME_HEIGHT},
  physics:{default:'arcade',arcade:{gravity:{y:BALANCE.gravity},debug:false}},
  scene:[BootScene,LanguageScene,TitleScene,IntroScene,FastFoodScene,StreetScene,FactoryScene,ResultScene]
});
