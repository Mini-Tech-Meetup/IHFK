import { BALANCE, GAME_WIDTH, GROUND_Y } from '../config.js';
import { InputController } from '../services/InputController.js?v=30';
import { Player } from '../entities/Player.js';
import { Kiosk } from '../entities/Kiosk.js';
import { Hud } from '../ui/Hud.js?v=30';
import { safePlayerSpawn } from '../utils/mobile.js';

export class BasePlayScene extends Phaser.Scene {
  createPlay(targetKey,playerX=140){
    this.inputController=new InputController(this);this.inputController.setGameplay(true);this.kiosks=this.physics.add.group({runChildUpdate:true});this.pickupLabels=[];this.events.off('kiosk-destroyed');
    this.ground=this.add.rectangle(GAME_WIDTH/2,GROUND_Y+35,GAME_WIDTH,70,0x333333);this.physics.add.existing(this.ground,true);
    const safeSpawnX=safePlayerSpawn(playerX,document.body.classList.contains('touch-device'));
    this.player=new Player(this,safeSpawnX,GROUND_Y-80,this.session,this.inputController);this.physics.add.collider(this.player,this.ground);this.physics.add.collider(this.player,this.kiosks,this.onPlayerKioskCollision,null,this);this.physics.add.collider(this.kiosks,this.ground);this.physics.add.collider(this.kiosks,this.kiosks);
    this.hud=new Hud(this,this.session,this.i18n,targetKey,key=>this.inputController.queueWeapon(key));this.events.on('kiosk-destroyed',this.onKioskDestroyed,this);document.querySelector('#touch-mute').onclick=()=>this.audio.toggleMute();
  }
  spawnKiosk(x=Phaser.Math.Between(90,990),falling=true,stage='global') {const kiosk=new Kiosk(this,x,falling?-100:GROUND_Y-70,{stage,falling});this.kiosks.add(kiosk);return kiosk;}
  onPlayerKioskCollision(player,kiosk){
    const now=this.time.now;const impactSpeed=kiosk.lastFallSpeed||kiosk.body?.velocity.y||0;
    if(kiosk.dead||!kiosk.wasFalling||kiosk.landed||impactSpeed<420||now-kiosk.lastFallingAt>100||now-kiosk.lastPlayerImpactAt<420)return;
    kiosk.lastPlayerImpactAt=now;
    const direction=player.x<=kiosk.x?-1:1;const horizontal=Phaser.Math.Clamp(impactSpeed*.32,280,500);const vertical=-Phaser.Math.Clamp(impactSpeed*.2,210,340);
    player.applyKnockback(direction*horizontal,vertical,now);this.cameras.main.shake(85,.011);this.audio?.sfx('land');
    document.body.dataset.playerImpactCount=String((Number(document.body.dataset.playerImpactCount)||0)+1);
  }
  onKioskDestroyed(kiosk){this.session.recordKiosk(kiosk.stage);if(this.allowDrops&&Math.random()<BALANCE.weaponDropChance)this.dropWeapon(kiosk.x,kiosk.y);}
  selectWeapon(key){const selected=this.session.selectWeapon(key);if(selected)this.refreshWeaponUi();return selected;}
  refreshWeaponUi(){
    this.hud?.update(this.getProgress?.()||'');
    const amounts={fist:'∞',bat:String(Math.ceil(this.session.weapons.bat)),chainsaw:`${(this.session.weapons.chainsaw/1000).toFixed(1)}s`,shotgun:String(Math.ceil(this.session.weapons.shotgun))};
    document.querySelectorAll('#weapon-buttons [data-weapon]').forEach(button=>{const key=button.dataset.weapon;const empty=key!=='fist'&&this.session.weapons[key]<=0;button.classList.toggle('selected',key===this.session.selectedWeapon);button.classList.toggle('empty',empty);button.setAttribute('aria-disabled',String(empty));button.dataset.amount=amounts[key];});
  }
  dropWeapon(x,y,forcedKey=null){
    const key=forcedKey||Phaser.Utils.Array.GetRandom(['bat','chainsaw','shotgun']);const label={bat:'2',chainsaw:'3',shotgun:'4'}[key];
    const halo=this.add.rectangle(x,y,88,52,0xf4c338,.78).setStrokeStyle(4,0x111111).setDepth(11);const pickup=this.add.image(x,y,`pickup-${key}`).setDepth(13);const badge=this.add.text(x-34,y-32,label,{font:'bold 17px Consolas',color:'#111111',backgroundColor:'#fff9dd',padding:{x:5,y:2}}).setOrigin(.5).setDepth(14);
    const entry={pickup,halo,badge,active:true};const sync=()=>{if(!entry.active)return;halo.setPosition(pickup.x,pickup.y);badge.setPosition(pickup.x-34,pickup.y-32);};entry.sync=sync;this.pickupLabels.push(entry);this.events.on('postupdate',sync);
    const remove=()=>{if(!entry.active)return;entry.active=false;this.events.off('postupdate',sync);pickup.destroy();halo.destroy();badge.destroy();};
    this.physics.add.existing(pickup);pickup.body.setSize(68,40).setBounce(.15).setCollideWorldBounds(true);this.physics.add.collider(pickup,this.ground);this.physics.add.overlap(this.player,pickup,()=>{if(!entry.active)return;this.session.addWeapon(key);this.refreshWeaponUi();this.audio.sfx('pickup');remove();});this.time.delayedCall(12000,remove);
  }
  update(time){
    this.player?.update(time);if(this.inputController?.consumeMute())this.audio.toggleMute();const muteButton=document.querySelector('#touch-mute');if(muteButton){muteButton.textContent=this.audio.muted?'×':'♪';muteButton.classList.toggle('muted',this.audio.muted);}
    this.pickupLabels=this.pickupLabels?.filter(entry=>entry.active)||[];
    document.body.dataset.weapon=this.session.selectedWeapon;document.body.dataset.playerX=String(Math.round(this.player?.x||0));document.body.dataset.activeKiosks=String(this.kiosks?.countActive(true)||0);
    document.body.dataset.destroyedTotal=String(this.session.destroyedTotal);document.body.dataset.endlessDestroyed=String(this.session.endlessDestroyed);document.body.dataset.streetDestroyed=String(this.session.streetDestroyed);
    const inspectedKiosk=this.kiosks?.getChildren().find(kiosk=>kiosk.active&&!kiosk.dead);
    document.body.dataset.kioskState=inspectedKiosk?String(inspectedKiosk.damageState):'destroyed';
    document.body.dataset.kioskLanded=inspectedKiosk?String(inspectedKiosk.landed):'none';
    document.body.dataset.kioskX=inspectedKiosk?String(Math.round(inspectedKiosk.x)):'none';
    document.body.dataset.kioskVelocityX=inspectedKiosk?String(Math.round(inspectedKiosk.body?.velocity.x||0)):'0';
    document.body.dataset.kioskVelocityY=inspectedKiosk?String(Math.round(inspectedKiosk.body?.velocity.y||0)):'0';
    document.body.dataset.kioskLandingMs=inspectedKiosk?.landingMs==null?'pending':String(inspectedKiosk.landingMs);
    document.body.dataset.playerVelocityX=String(Math.round(this.player?.body?.velocity.x||0));document.body.dataset.playerVelocityY=String(Math.round(this.player?.body?.velocity.y||0));
    document.body.dataset.playerHitbox=this.player?.body?`${Math.round(this.player.body.width)}x${Math.round(this.player.body.height)}`:'none';document.body.dataset.kioskHitbox=inspectedKiosk?.body?`${Math.round(inspectedKiosk.body.width)}x${Math.round(inspectedKiosk.body.height)}`:'none';
    this.refreshWeaponUi();
  }
  shutdownPlay(){this.inputController?.setGameplay(false);this.hud?.destroy();}
}
