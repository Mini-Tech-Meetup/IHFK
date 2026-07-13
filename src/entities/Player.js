import { BALANCE, AUTO_PLAY, PREVIEW_WEAPON, PREVIEW_KIOSK } from '../config.js';
import { scatterRectangles } from '../utils/effects.js';

export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene,x,y,session,input) {
    super(scene,x,y,'strong-run',0);scene.add.existing(this);scene.physics.add.existing(this);
    this.session=session;this.inputController=input;this.nextAttack=0;this.knockbackUntil=0;this.knockbackDirection=0;
    if(PREVIEW_WEAPON&&PREVIEW_WEAPON!=='fist'){this.session.weapons[PREVIEW_WEAPON]=BALANCE.caps[PREVIEW_WEAPON];this.session.selectWeapon(PREVIEW_WEAPON);}
    this.setVisible(false).setCollideWorldBounds(true);this.body.setSize(42,88,true);this.body.setMaxVelocity(500,1100);
    this.visual=scene.add.sprite(x,y,'strong-idle',0).setOrigin(.5,1).setScale(5).setDepth(10).play('strong-idle');
  }

  update(time) {
    const input=this.inputController;const selected=input.consumeWeapon();if(selected)this.session.selectWeapon(selected);
    if(time<this.knockbackUntil){this.syncVisual();this.visual.stop().setScale(5).setTexture('strong-fall').setAngle(this.knockbackDirection*12);return;}
    this.visual.setAngle(0);
    if(input.left){this.setVelocityX(-BALANCE.playerSpeed);this.flipX=true;}else if(input.right){this.setVelocityX(BALANCE.playerSpeed);this.flipX=false;}else this.setVelocityX(0);
    if(input.jump&&this.body.blocked.down)this.setVelocityY(BALANCE.jumpVelocity);
    this.syncVisual();
    if(input.attack)this.attack(time);else this.updateMovementAnimation();
  }

  applyKnockback(velocityX,velocityY,time,duration=260){
    this.knockbackDirection=Math.sign(velocityX)||1;this.knockbackUntil=Math.max(this.knockbackUntil,time+duration);this.setVelocity(velocityX,velocityY);
  }

  syncVisual(){this.visual.setPosition(this.x,this.body.bottom+2).setFlipX(this.flipX);}

  playVisual(key,scale){this.visual.setScale(scale);this.visual.play(key,true);}

  updateMovementAnimation() {
    if(!this.body.blocked.down){this.visual.stop().setScale(5).setTexture(this.body.velocity.y<0?'strong-jump':'strong-fall');return;}
    if(Math.abs(this.body.velocity.x)>1)this.playVisual('strong-run',5);else this.playVisual('strong-idle',5);
  }

  attack(time) {
    const key=this.session.selectedWeapon;const data=BALANCE.attack[key];
    this.playVisual(key==='fist'?'strong-attack':`weapon-${key}-attack`,key==='fist'?5:2);
    if(time<this.nextAttack)return;this.nextAttack=time+data.cooldown;
    let depleted=false;
    if(key!=='fist'&&!PREVIEW_WEAPON){
      const cost=key==='chainsaw'?data.cooldown:1;if(!this.session.consumeWeapon(key,cost))return;
      depleted=this.session.weapons[key]<=0;
    }
    if(key==='shotgun')this.scene.audio?.sfx('shotgun');if(key==='chainsaw')this.scene.audio?.sfx('saw');
    const direction=this.flipX?-1:1;const range=AUTO_PLAY?1080:data.range;const x=AUTO_PLAY?0:(direction>0?this.x:this.x-range);const rect=new Phaser.Geom.Rectangle(x,AUTO_PLAY?0:this.body.center.y-data.height/2,range,AUTO_PLAY?640:data.height);
    if(!PREVIEW_WEAPON){const kioskDamage=PREVIEW_KIOSK?4:data.damage;this.scene.kiosks?.getChildren().forEach(kiosk=>{if(kiosk.active&&!kiosk.dead&&Phaser.Geom.Intersects.RectangleToRectangle(rect,kiosk.getBounds()))kiosk.takeDamage(kioskDamage,direction);});
    const target=this.scene.factoryTarget;if(target?.active&&Phaser.Geom.Intersects.RectangleToRectangle(rect,target.bounds))target.takeDamage(data.factoryDamage,direction,key);}
    if(depleted)this.breakWeapon(key);
  }

  breakWeapon(key) {
    const colors={bat:[0x9b5d2e,0x222222],chainsaw:[0xe64c3c,0x888888,0x222222],shotgun:[0x222222,0x777777]}[key];
    this.scene.audio?.sfx('weaponBreak');scatterRectangles(this.scene,this.x+(this.flipX?-45:45),this.body.bottom-55,colors,6,80);
  }

  preDestroy(){this.visual?.destroy();super.preDestroy();}
}
