import { GAME_WIDTH, GAME_HEIGHT } from '../config.js';

const weaponFrames = ['bat','chainsaw','shotgun'];

export class BootScene extends Phaser.Scene {
  constructor(){super('Boot');}
  preload(){
    const base='assets/character/';
    this.load.image('bg-fastfood','assets/background/fastfood.png');this.load.image('bg-street','assets/background/street.png');this.load.image('street-cloud','assets/background/layers/street-cloud.png');this.load.image('bg-factory','assets/background/factory.png');
    this.load.spritesheet('normal-idle',`${base}Normal Guy Idle/Normal_Guy_Idle_SpriteSheet.png`,{frameWidth:15,frameHeight:20});
    this.load.spritesheet('normal-transform',`${base}Normal Guy Transforms/Normal_Guy_Transforms_SpriteSheet.png`,{frameWidth:29,frameHeight:25});
    this.load.spritesheet('strong-idle',`${base}Strong Guy Idle/Strong_Guy_Idle_SpriteSheet.png`,{frameWidth:18,frameHeight:23});
    this.load.spritesheet('strong-run',`${base}Strong Guy Runs/Strong_Guy_Rung_SpriteSheet.png`,{frameWidth:18,frameHeight:24});
    this.load.image('strong-jump',`${base}Strong Guy Jumps/Strong_Guy_Jumps.png`);this.load.image('strong-fall',`${base}Strong Guy Falls/Strong_Guy_Falls.png`);
    this.load.spritesheet('strong-attack',`${base}Strong Guy Attacks/Strong_Guy_Attacks_Without_The_Repeated_Frames.png`,{frameWidth:27,frameHeight:24});
    for(let index=0;index<5;index++)this.load.image(`kiosk-v2-${index}`,`assets/kiosk/frames-v2/0${index+1}.png`);
    for(let index=0;index<5;index++)this.load.image(`factory-v2-${index}`,`assets/factory/frames-v2/0${index+1}.png`);
    for(const weapon of weaponFrames){for(let index=0;index<6;index++)this.load.image(`weapon-${weapon}-${index}`,`assets/weapons/${weapon}/frames-v2/0${index+1}.png`);this.load.image(`pickup-${weapon}`,`assets/weapons/pickups/${weapon}.png`);}
    this.load.on('loaderror',file=>this.registry.set('loadError',file.key));
  }
  create(){
    this.anims.create({key:'normal-idle',frames:this.anims.generateFrameNumbers('normal-idle',{start:0,end:8}),frameRate:10,repeat:-1});
    // The 145x150 source is a 5x6 grid of 29x25 cells. Frames 0-26 match the
    // supplied GIF pixel-for-pixel; cells 27-29 are intentionally empty.
    this.anims.create({key:'normal-transform',frames:this.anims.generateFrameNumbers('normal-transform',{start:0,end:26}),frameRate:30,repeat:0});
    this.anims.create({key:'strong-idle',frames:this.anims.generateFrameNumbers('strong-idle',{start:0,end:1}),frameRate:7,repeat:-1});
    // The ninth cell is empty in the source sheet.
    this.anims.create({key:'strong-run',frames:this.anims.generateFrameNumbers('strong-run',{start:0,end:7}),frameRate:50,repeat:-1});
    // The inspected no-repeat sheet contains 15 populated cells and one empty cell.
    this.anims.create({key:'strong-attack',frames:this.anims.generateFrameNumbers('strong-attack',{start:0,end:14}),frameRate:60,repeat:-1});
    const rates={bat:36,chainsaw:60,shotgun:24};
    for(const weapon of weaponFrames)this.anims.create({key:`weapon-${weapon}-attack`,frames:Array.from({length:6},(_,index)=>({key:`weapon-${weapon}-${index}`})),frameRate:rates[weapon],repeat:-1});
    if(this.registry.get('loadError')){this.ui.clear();this.add.text(GAME_WIDTH/2,GAME_HEIGHT/2,this.i18n.t('assetError'),{font:'bold 34px Arial',color:'#fff',align:'center',wordWrap:{width:850}}).setOrigin(.5);return;}
    this.scene.start('Language');
  }
}
