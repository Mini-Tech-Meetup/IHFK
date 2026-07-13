import { BasePlayScene } from './BasePlayScene.js';
import { drawFactory } from '../utils/visuals.js';
import { BALANCE, PREVIEW_STRESS } from '../config.js';

export class FactoryScene extends BasePlayScene {
  constructor(){super('Factory');}
  init(data){this.mode=data.mode||'campaign';}
  create(){
    document.body.dataset.scene=this.mode==='endless'?'Endless':'Factory';
    this.session.mode=this.mode;drawFactory(this,this.mode==='endless');this.createPlay(this.mode==='endless'?'extra':'targetFactory');this.allowDrops=true;this.nextFall=0;this.endlessStarted=this.time.now;
    this.startAssemblyLoop();
    if(this.mode==='campaign')this.createFactoryTarget();else this.factoryTarget=null;
  }
  startAssemblyLoop(){
    const launch=()=>{
      if(!this.scene.isActive())return;
      const product=this.add.image(-55,475,'kiosk-v2-0').setScale(.52).setDepth(-2).setAngle(-4);
      this.tweens.add({targets:product,x:485,duration:this.mode==='endless'?650:1050,ease:'Linear',onComplete:()=>{
        product.setTint(this.mode==='endless'?0x995555:0xffffff);
        this.tweens.add({targets:product,x:Phaser.Math.Between(420,580),y:-120,angle:Phaser.Math.Between(-220,220),duration:this.mode==='endless'?500:780,ease:'Quad.easeIn',onComplete:()=>product.destroy()});
      }});
    };
    launch();
    this.assemblyTimer=this.time.addEvent({delay:this.mode==='endless'?1100:1900,loop:true,callback:launch});
  }
  createFactoryTarget(){
    const visual=this.add.rectangle(800,345,420,430,0x984337,0).setDepth(5);
    const damage=this.add.graphics().setDepth(6);const flash=this.add.rectangle(800,345,420,430,0xffffff,0).setDepth(7);const screen=this.add.rectangle(854,254,145,82,0x0b6b35,.16).setDepth(8).setBlendMode(Phaser.BlendModes.ADD);
    const bounds=new Phaser.Geom.Rectangle(590,130,420,430);
    const target={active:true,hp:BALANCE.factoryHp,maxHp:BALANCE.factoryHp,bounds,visual,damage,flash,screen,lastBand:0,takeDamage:(amount,direction,key='fist')=>{
      if(!target.active)return;
      target.hp=Math.max(0,target.hp-amount);this.audio.sfx('hit');const ratio=target.hp/target.maxHp;this.factoryImpact(target,key);
      if(ratio<=.33){visual.setFillStyle(0x220000,.28);visual.setStrokeStyle(12,0xffd53d);this.drawFactoryDamage(damage,2);if(target.lastBand<2){target.lastBand=2;this.factoryBandBreak(target,2);}}
      else if(ratio<=.67){visual.setFillStyle(0x552000,.18);visual.setStrokeStyle(8,0x111111);this.drawFactoryDamage(damage,1);if(target.lastBand<1){target.lastBand=1;this.factoryBandBreak(target,1);}}
      if(target.hp<=0)this.destroyFactory(target);
    }};this.factoryTarget=target;
  }
  factoryImpact(target,key){
    const strength={fist:.004,bat:.007,chainsaw:.003,shotgun:.012}[key]||.004;this.cameras.main.shake(key==='shotgun'?85:35,strength);
    target.flash.setAlpha(key==='shotgun' ? .32 : .18);this.tweens.killTweensOf(target.flash);this.tweens.add({targets:target.flash,alpha:0,duration:key==='chainsaw'?45:85});
    target.screen.setFillStyle(Phaser.Utils.Array.GetRandom([0xffffff,0x050505,0x0b6b35]),.72);this.time.delayedCall(key==='chainsaw'?35:65,()=>{if(target.active)target.screen.setFillStyle(0x0b6b35,.16);});
    const x=Phaser.Math.Between(610,720),y=Phaser.Math.Between(210,470);for(let index=0;index<(key==='shotgun'?8:3);index++){const spark=this.add.rectangle(x,y,Phaser.Math.Between(4,9),Phaser.Math.Between(3,7),index%2?0xf4c338:0xffffff).setDepth(18);this.tweens.add({targets:spark,x:x+Phaser.Math.Between(-45,35),y:y+Phaser.Math.Between(-55,40),alpha:0,duration:Phaser.Math.Between(100,190),onComplete:()=>spark.destroy()});}
  }
  factoryBandBreak(target,level){
    this.cameras.main.flash(70,255,230,120);this.cameras.main.shake(180,.018);this.game.loop.sleep();setTimeout(()=>this.game.loop.wake(),level===2?55:40);
    for(let index=0;index<level*7;index++){const part=this.add.rectangle(Phaser.Math.Between(610,980),Phaser.Math.Between(160,500),Phaser.Math.Between(8,22),Phaser.Math.Between(6,18),Phaser.Utils.Array.GetRandom([0x222222,0x777777,0xd73e32,0xf4c338])).setDepth(17);this.tweens.add({targets:part,x:part.x+Phaser.Math.Between(-90,70),y:part.y+Phaser.Math.Between(-100,70),angle:Phaser.Math.Between(-220,220),alpha:0,duration:450,onComplete:()=>part.destroy()});}
  }
  drawFactoryDamage(graphics,level){
    graphics.clear().lineStyle(level===2?13:8,level===2?0xffd53d:0x111111,1);
    graphics.lineBetween(650,155,760,280).lineBetween(760,280,690,390).lineBetween(900,180,825,315);
    if(level===2)graphics.lineBetween(825,315,955,455).lineBetween(620,465,775,390).lineBetween(930,135,860,245);
  }
  destroyFactory(target){target.active=false;this.assemblyTimer?.remove();this.session.stopTimer();this.audio.stopMusic();this.audio.sfx('factory');this.factoryBandBreak(target,3);this.cameras.main.shake(900,.04);this.cameras.main.flash(220,255,220,120);target.screen.setFillStyle(0xffffff,1);this.tweens.add({targets:[target.visual,target.damage,target.flash,target.screen],alpha:0,angle:8,duration:850,onComplete:()=>{this.shutdownPlay();this.time.delayedCall(500,()=>this.scene.start('Result'));}});}
  fallProfile(){
    if(PREVIEW_STRESS)return {interval:120,cluster:5,cap:30};
    if(this.mode==='endless'){const elapsed=(this.time.now-this.endlessStarted)/1000;return {interval:Math.max(250,650-Math.floor(elapsed/20)*50),cluster:Math.min(5,1+Math.floor(elapsed/40)),cap:Math.min(30,15+Math.floor(elapsed/20))};}
    const ratio=this.factoryTarget?.hp/BALANCE.factoryHp;if(ratio>.67)return {interval:2000,cluster:1,cap:15};if(ratio>.33)return {interval:1200,cluster:2,cap:15};return {interval:650,cluster:Phaser.Math.Between(2,4),cap:15};
  }
  getProgress(){if(PREVIEW_STRESS)return `${this.kiosks.countActive(true)} / 30 · ${Math.round(this.game.loop.actualFps||0)} FPS`;if(this.mode==='endless')return `${this.session.endlessDestroyed}`;return `${Math.ceil(Math.max(0,this.factoryTarget?.hp||0))} HP`;}
  update(time){
    super.update(time);document.body.dataset.factoryHp=this.factoryTarget?String(Math.ceil(this.factoryTarget.hp)):'none';document.body.dataset.factoryFlash=this.factoryTarget?this.factoryTarget.flash.alpha.toFixed(2):'none';document.body.dataset.fps=String(Math.round(this.game.loop.actualFps||0));
    const profile=this.fallProfile();if(time>=this.nextFall&&this.kiosks.countActive(true)<profile.cap){this.nextFall=time+profile.interval;for(let i=0;i<profile.cluster;i++)this.time.delayedCall(i*100,()=>{if(this.kiosks.countActive(true)<profile.cap)this.spawnKiosk(Phaser.Math.Between(80,520),true,'factory');});}
  }
}
