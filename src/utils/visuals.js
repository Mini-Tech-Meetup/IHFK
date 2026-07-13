export function addPixelText(scene,x,y,text,size=32,options={}) {
  return scene.add.text(x,y,text,{fontFamily:'Arial, sans-serif',fontSize:`${size}px`,fontStyle:options.bold?'bold':'normal',color:options.color||'#111111',align:options.align||'center',backgroundColor:options.background||null,padding:options.padding||{x:10,y:7},wordWrap:options.width?{width:options.width}:undefined}).setOrigin(options.originX??.5,options.originY??.5).setDepth(options.depth??20);
}
export function button(scene,x,y,label,onClick,width=300) {
  const bg=scene.add.rectangle(x,y,width,62,0xf5f1df).setStrokeStyle(6,0x111111).setDepth(20).setInteractive({useHandCursor:true});
  const text=addPixelText(scene,x,y,label,28,{bold:true,depth:21});
  if(text.width>width-24)text.setFontSize(Math.max(16,Math.floor(28*(width-24)/text.width)));
  bg.on('pointerover',()=>bg.setFillStyle(0xffd53d)); bg.on('pointerout',()=>bg.setFillStyle(0xf5f1df)); bg.on('pointerdown',onClick);
  return {bg,text,destroy(){bg.destroy();text.destroy();}};
}
export function addGoSign(scene,x,y) {
  const outer=scene.add.rectangle(0,0,118,66,0x111111);
  const face=scene.add.rectangle(0,-3,104,50,0xf4c338).setStrokeStyle(4,0xffffff);
  const label=scene.add.text(0,-4,'GO',{fontFamily:'Arial Black, Arial, sans-serif',fontSize:'34px',fontStyle:'bold',color:'#111111'}).setOrigin(.5);
  const lamps=[-46,46].map(lampX=>scene.add.rectangle(lampX,24,8,8,0xd73e32).setStrokeStyle(2,0x111111));
  const sign=scene.add.container(x,y,[outer,face,label,...lamps]).setDepth(24).setVisible(false).setScale(.8);
  let pulse=null;
  return {
    sign,
    show(){
      if(sign.visible)return;
      sign.setVisible(true).setScale(.8).setAlpha(1);
      scene.tweens.add({targets:sign,scale:1,duration:130,ease:'Back.easeOut'});
      pulse=scene.tweens.add({targets:[face,...lamps],alpha:{from:1,to:.55},duration:330,yoyo:true,repeat:-1,ease:'Stepped'});
    },
    destroy(){pulse?.stop();sign.destroy(true);}
  };
}
export function drawFastFood(scene) {
  scene.cameras.main.setBackgroundColor('#f4f0df');
  if(scene.textures.exists('bg-fastfood'))return scene.add.image(540,320,'bg-fastfood').setDepth(-10);
  const g=scene.add.graphics();
  g.fillStyle(0xf4f0df).fillRect(0,0,1080,640); g.fillStyle(0xe64c3c).fillRect(0,50,1080,45); g.fillStyle(0xffd53d).fillRect(0,95,1080,28);
  g.fillStyle(0x252525); for(let x=70;x<720;x+=220)g.fillRect(x,155,170,95); g.fillStyle(0x87b6c9); for(let x=82;x<720;x+=220)g.fillRect(x,167,146,71);
  g.fillStyle(0x8b332e).fillRect(0,330,760,150); g.fillStyle(0xffd53d).fillRect(0,330,760,20); g.fillStyle(0x7d2130).fillRect(820,150,190,420); g.fillStyle(0x252525).fillRect(845,190,140,330);
  return g;
}
export function drawStreet(scene) {
  scene.cameras.main.setBackgroundColor('#9bc4d2');
  if(scene.textures.exists('bg-street'))return scene.add.image(540,320,'bg-street').setDepth(-10);
  const g=scene.add.graphics(); g.fillStyle(0x9bc4d2).fillRect(0,0,1080,640);
  const colors=[0xd75b4a,0xe3b84d,0x7594a6,0xb66f8c]; for(let i=0;i<5;i++){const x=i*220;g.fillStyle(colors[i%4]).fillRect(x,160,215,410);g.fillStyle(0x222222).fillRect(x+25,220,165,105);g.fillStyle(0x89b5c4).fillRect(x+38,233,139,79);g.fillStyle(0xf0d85c).fillRect(x+20,175,175,30);}
  g.fillStyle(0x555555).fillRect(0,550,1080,90); g.fillStyle(0xeeeeee); for(let x=30;x<1080;x+=130)g.fillRect(x,590,75,12); return g;
}
export function drawFactory(scene) {
  scene.cameras.main.setBackgroundColor('#7b8287');
  if(scene.textures.exists('bg-factory'))return scene.add.image(540,320,'bg-factory').setDepth(-10);
  const g=scene.add.graphics(); g.fillStyle(0x7b8287).fillRect(0,0,1080,640);
  g.lineStyle(8,0x303438); for(let x=40;x<1080;x+=180)g.lineBetween(x,0,x,570); for(let y=90;y<570;y+=120)g.lineBetween(0,y,1080,y);
  g.fillStyle(0x4d5256).fillRect(0,520,1080,120);
  return g;
}
