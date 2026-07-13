import { BALANCE, GROUND_Y } from '../config.js';
import { hitStop, scatterRectangles } from '../utils/effects.js';

export class Kiosk extends Phaser.Physics.Arcade.Sprite {
  constructor(scene,x,y,{stage='global',falling=false}={}) {
    super(scene,x,y,'kiosk-v2-0');scene.add.existing(this);scene.physics.add.existing(this);
    this.stage=stage;this.hp=BALANCE.kioskHp;this.dead=false;this.wasFalling=falling;this.landed=!falling;this.damageState=0;this.nextAmbientFlicker=0;this.spawnedAt=scene.game.loop.time;this.landingMs=falling?null:0;this.lastFallSpeed=0;this.lastFallingAt=-Infinity;this.lastPlayerImpactAt=-Infinity;
    this.setScale(1.15).setDepth(7).setPushable(false).setCollideWorldBounds(true);this.body.setSize(54,116).setOffset(37,8).setMaxVelocity(220,2400);
    this.screenGlow=scene.add.rectangle(x,y-38,25,43,0x0b6b35,.2).setDepth(8).setBlendMode(Phaser.BlendModes.ADD);
    if(falling)this.body.setGravityY(BALANCE.kioskFallGravity-BALANCE.gravity);else this.lockToGround();
  }

  lockToGround(){this.landed=true;this.landingMs=Math.round(this.scene.game.loop.time-this.spawnedAt);this.body.setAllowGravity(false).setImmovable(true);this.setVelocity(0,0);if(!this.wasFalling)this.y=GROUND_Y-65;}

  preUpdate(time,delta) {
    super.preUpdate(time,delta);this.syncScreen();
    if(this.wasFalling&&!this.landed&&this.body.velocity.y>0){this.lastFallSpeed=this.body.velocity.y;this.lastFallingAt=time;}
    const touchesFloor=this.body.blocked.down&&this.body.bottom>=GROUND_Y-2;
    if(this.wasFalling&&!this.landed&&touchesFloor){this.lockToGround();this.scene.audio?.sfx('land');this.scene.cameras.main.shake(55,.006);}
    if(!this.dead&&this.damageState>=2&&time>=this.nextAmbientFlicker){this.nextAmbientFlicker=time+Phaser.Math.Between(450,1200);this.flickerScreen(false,2);}
  }

  syncScreen(){if(this.screenGlow?.active)this.screenGlow.setPosition(this.x,this.y-38).setScale(this.scaleX,this.scaleY);}

  flickerScreen(final=false,pulses=3){
    const sequence=final?[0xffffff,0x061009,0xffffff,0x0b6b35,0x050505,0xffffff,0x050505]:[0xffffff,0x050505,0x0b6b35,0x050505,0x0b6b35].slice(0,pulses*2+1);
    sequence.forEach((color,index)=>this.scene.time.delayedCall(index*(final?28:36),()=>{if(!this.screenGlow?.active)return;this.screenGlow.setFillStyle(color,final ? .85 : (color===0x050505 ? .92 : .55));}));
  }

  takeDamage(amount,direction=1) {
    if(this.dead)return;this.hp-=amount;this.scene.audio?.sfx('hit');this.setVelocityX(0);
    this.setTint(0xffffff);this.scene.time.delayedCall(24,()=>{if(this.active)this.clearTint();});this.flickerScreen(false,3);this.spawnHitPixels(direction);
    const ratio=Math.max(0,this.hp/BALANCE.kioskHp);const nextState=ratio<=.2?4:ratio<=.4?3:ratio<=.6?2:ratio<=.8?1:0;
    if(nextState!==this.damageState){this.damageState=nextState;this.setTexture(`kiosk-v2-${nextState}`);this.scene.cameras.main.shake(45+nextState*10,.004+nextState*.001);}
    if(this.hp<=0)this.break(direction);
  }

  spawnHitPixels(direction){
    for(let index=0;index<3;index++){
      const pixel=this.scene.add.rectangle(this.x+direction*20,this.y-25,Phaser.Math.Between(4,8),Phaser.Math.Between(3,6),index===0?0xffffff:0xf4c338).setDepth(16);
      this.scene.tweens.add({targets:pixel,x:pixel.x+direction*Phaser.Math.Between(22,55),y:pixel.y+Phaser.Math.Between(-35,25),alpha:0,duration:130,onComplete:()=>pixel.destroy()});
    }
  }

  break(direction) {
    if(this.dead)return;this.dead=true;this.setTexture('kiosk-v2-4');this.disableBody(true,false);this.scene.audio?.sfx('break');this.scene.events.emit('kiosk-destroyed',this);
    this.scene.cameras.main.shake(90,.014);this.scene.cameras.main.flash(45,255,255,255,false);this.flickerScreen(true,4);hitStop(this.scene,Phaser.Math.Between(38,60));this.spawnFragments();
    this.scene.tweens.add({targets:[this,this.screenGlow],x:this.x+direction*180,y:this.y-125,angle:direction*160,alpha:0,duration:360,ease:'Quad.easeOut',onComplete:()=>{this.screenGlow?.destroy();this.destroy();}});
  }

  spawnFragments(){scatterRectangles(this.scene,this.x,this.y,[0x17151a,0xd8d8d8,0x0b6b35,0xf4c338,0xd73e32],12,145);}

  preDestroy(){this.screenGlow?.destroy();super.preDestroy();}
}
