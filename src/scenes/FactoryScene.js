import { BasePlayScene } from './BasePlayScene.js';
import { drawFactory } from '../utils/visuals.js';
import { BALANCE, PREVIEW_STRESS, PREVIEW_STRESS_CAP } from '../config.js';

export class FactoryScene extends BasePlayScene {
  constructor(){super('Factory');}
  init(data){this.mode=data.mode||'campaign';}
  create(){
    document.body.dataset.scene=this.mode==='endless'?'Endless':'Factory';
    this.session.mode=this.mode;drawFactory(this);this.createPlay(this.mode==='endless'?'extra':'targetFactory');this.allowDrops=true;this.nextFall=0;this.endlessStarted=this.time.now;this.stressStartedAt=null;this.stressLastFrameAt=null;this.stressSamples=[];this.stressReportReady=false;delete document.body.dataset.stressFpsAverage;delete document.body.dataset.stressFpsP05;delete document.body.dataset.stressStatus;
    this.factoryVisual=this.add.image(740,288,this.mode==='endless'?'factory-v2-4':'factory-v2-0').setDepth(3);
    this.startAssemblyLoop();
    if(this.mode==='campaign')this.createFactoryTarget();else this.factoryTarget=null;
  }
  startAssemblyLoop(){
    const launch=()=>{
      if(!this.scene.isActive())return;
      const product=this.add.image(-55,475,'kiosk-v2-0').setScale(.52).setDepth(2).setName('factory-product').setAngle(-4);this.lastAssemblyProduct=product;
      this.tweens.add({targets:product,x:485,duration:this.mode==='endless'?650:1050,ease:'Linear',onComplete:()=>{
        product.setTint(this.mode==='endless'?0x995555:0xffffff);
        this.tweens.add({targets:product,x:Phaser.Math.Between(420,580),y:-120,angle:Phaser.Math.Between(-220,220),duration:this.mode==='endless'?500:780,ease:'Quad.easeIn',onComplete:()=>product.destroy()});
      }});
    };
    launch();
    this.assemblyTimer=this.time.addEvent({delay:this.mode==='endless'?1100:1900,loop:true,callback:launch});
  }
  createFactoryTarget(){
    const visual=this.factoryVisual;const boundsByState=[new Phaser.Geom.Rectangle(431,23,617,537),new Phaser.Geom.Rectangle(486,20,508,540),new Phaser.Geom.Rectangle(479,20,521,540),new Phaser.Geom.Rectangle(481,51,518,509),new Phaser.Geom.Rectangle(487,203,505,357)];
    const target={active:true,hp:BALANCE.factoryHp,maxHp:BALANCE.factoryHp,bounds:boundsByState[0],boundsByState,visual,damageState:0,flashAlpha:0,takeDamage:(amount,direction,key='fist')=>{
      if(!target.active)return;
      target.hp=Math.max(0,target.hp-amount);this.audio.sfx('hit');const ratio=target.hp/target.maxHp;this.factoryImpact(target,key);
      if(target.hp<=0){this.destroyFactory(target);return;}
      const nextState=ratio<=.2?4:ratio<=.4?3:ratio<=.6?2:ratio<=.8?1:0;
      if(nextState!==target.damageState){target.damageState=nextState;target.bounds=target.boundsByState[nextState];visual.setTexture(`factory-v2-${nextState}`);this.factoryBandBreak(target,nextState);}
    }};this.factoryTarget=target;
  }
  factoryImpact(target,key){
    const strength={fist:.004,bat:.007,chainsaw:.003,shotgun:.012}[key]||.004;this.cameras.main.shake(key==='shotgun'?85:35,strength);
    target.flashAlpha=key==='shotgun' ? .32 : .18;target.visual.setTint(0xffffff).setTintMode(Phaser.TintModes.FILL).setAlpha(.72);
    this.time.delayedCall(key==='chainsaw'?28:55,()=>{if(!target.visual.active)return;target.visual.clearTint().setAlpha(1);target.flashAlpha=0;});
    const x=Phaser.Math.Between(610,720),y=Phaser.Math.Between(210,470);for(let index=0;index<(key==='shotgun'?8:3);index++){const spark=this.add.rectangle(x,y,Phaser.Math.Between(4,9),Phaser.Math.Between(3,7),index%2?0xf4c338:0xffffff).setDepth(18);this.tweens.add({targets:spark,x:x+Phaser.Math.Between(-45,35),y:y+Phaser.Math.Between(-55,40),alpha:0,duration:Phaser.Math.Between(100,190),onComplete:()=>spark.destroy()});}
  }
  factoryBandBreak(target,level){
    this.cameras.main.flash(70,255,230,120);this.cameras.main.shake(180,.018);this.game.loop.sleep();setTimeout(()=>this.game.loop.wake(),level===2?55:40);
    for(let index=0;index<level*7;index++){const part=this.add.rectangle(Phaser.Math.Between(610,980),Phaser.Math.Between(160,500),Phaser.Math.Between(8,22),Phaser.Math.Between(6,18),Phaser.Utils.Array.GetRandom([0x222222,0x777777,0xd73e32,0xf4c338])).setDepth(17);this.tweens.add({targets:part,x:part.x+Phaser.Math.Between(-90,70),y:part.y+Phaser.Math.Between(-100,70),angle:Phaser.Math.Between(-220,220),alpha:0,duration:450,onComplete:()=>part.destroy()});}
  }
  destroyFactory(target){target.active=false;target.damageState=4;target.bounds=target.boundsByState[4];target.visual.setTexture('factory-v2-4').clearTint().setAlpha(1);this.assemblyTimer?.remove();this.session.stopTimer();this.audio.stopMusic();this.audio.sfx('factory');this.factoryBandBreak(target,5);this.cameras.main.shake(900,.04);this.cameras.main.flash(220,255,220,120);this.tweens.add({targets:target.visual,alpha:.18,angle:5,duration:850,onComplete:()=>{this.shutdownPlay();this.time.delayedCall(500,()=>this.scene.start('Result'));}});}
  fallProfile(){
    if(PREVIEW_STRESS)return {interval:120,cluster:Math.min(5,PREVIEW_STRESS_CAP),cap:PREVIEW_STRESS_CAP};
    if(this.mode==='endless'){const elapsed=(this.time.now-this.endlessStarted)/1000;return {interval:Math.max(250,650-Math.floor(elapsed/20)*50),cluster:Math.min(5,1+Math.floor(elapsed/40)),cap:Math.min(30,15+Math.floor(elapsed/20))};}
    const ratio=this.factoryTarget?.hp/BALANCE.factoryHp;if(ratio>.67)return {interval:2000,cluster:1,cap:15};if(ratio>.33)return {interval:1200,cluster:2,cap:15};return {interval:650,cluster:Phaser.Math.Between(2,4),cap:15};
  }
  getProgress(){if(PREVIEW_STRESS)return `${this.kiosks.countActive(true)} / ${PREVIEW_STRESS_CAP} · ${Math.round(this.game.loop.actualFps||0)} FPS`;if(this.mode==='endless')return `${this.session.endlessDestroyed}`;return `${Math.ceil(Math.max(0,this.factoryTarget?.hp||0))} HP`;}
  updateStressQa(time){
    if(!PREVIEW_STRESS||this.stressReportReady||this.kiosks.countActive(true)<PREVIEW_STRESS_CAP)return;
    if(this.stressStartedAt===null){this.stressStartedAt=time;this.stressLastFrameAt=time;document.body.dataset.stressStatus='sampling';return;}
    const delta=time-this.stressLastFrameAt;this.stressLastFrameAt=time;if(delta>0&&delta<250)this.stressSamples.push(1000/delta);
    if(time-this.stressStartedAt<10000)return;
    const sorted=this.stressSamples.slice().sort((a,b)=>a-b);const average=this.stressSamples.reduce((sum,value)=>sum+value,0)/Math.max(1,this.stressSamples.length);const p05=sorted[Math.floor(sorted.length*.05)]||0;
    this.stressReportReady=true;document.body.dataset.stressStatus='complete';document.body.dataset.stressFpsAverage=average.toFixed(1);document.body.dataset.stressFpsP05=p05.toFixed(1);this.showStressReport(average,p05);
  }
  showStressReport(average,p05){
    const report={timestamp:new Date().toISOString(),userAgent:navigator.userAgent,viewport:`${innerWidth}x${innerHeight}`,devicePixelRatio,mode:this.mode,activeKiosks:PREVIEW_STRESS_CAP,fpsAverage:Number(average.toFixed(1)),fpsP05:Number(p05.toFixed(1))};
    const panel=document.createElement('section');panel.className='stress-report';panel.setAttribute('role','dialog');panel.setAttribute('aria-label','Stress test complete');
    const title=document.createElement('strong');title.textContent='STRESS TEST COMPLETE';const summary=document.createElement('p');summary.textContent=`${PREVIEW_STRESS_CAP} KIOSKS · AVG ${report.fpsAverage} · P05 ${report.fpsP05} FPS`;
    const output=document.createElement('pre');output.textContent=JSON.stringify(report,null,2);const actions=document.createElement('div');const copy=document.createElement('button');copy.type='button';copy.textContent='COPY REPORT';copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(output.textContent);copy.textContent='COPIED';}catch{copy.textContent='SELECT TEXT';output.focus();}});const back=document.createElement('button');back.type='button';back.textContent='BACK TO DEVICE QA';back.addEventListener('click',()=>{location.href='qa/device.html';});actions.append(copy,back);panel.append(title,summary,output,actions);document.querySelector('#ui-layer .game-hud')?.append(panel);
  }
  update(time){
    super.update(time);document.body.dataset.factoryHp=this.factoryTarget?String(Math.ceil(this.factoryTarget.hp)):'none';document.body.dataset.factoryFlash=this.factoryTarget?this.factoryTarget.flashAlpha.toFixed(2):'none';document.body.dataset.factoryStage=this.factoryTarget?String(this.factoryTarget.damageState):'4';document.body.dataset.fps=String(Math.round(this.game.loop.actualFps||0));
    const profile=this.fallProfile();if(time>=this.nextFall&&this.kiosks.countActive(true)<profile.cap){this.nextFall=time+profile.interval;for(let i=0;i<profile.cluster;i++)this.time.delayedCall(i*100,()=>{if(this.kiosks.countActive(true)<profile.cap)this.spawnKiosk(Phaser.Math.Between(80,520),true,'factory');});}this.updateStressQa(time);
  }
}
