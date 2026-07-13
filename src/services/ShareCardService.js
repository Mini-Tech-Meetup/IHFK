import { FORCE_SHARE_FALLBACK } from '../config.js';

export class ShareCardService {
  constructor(session, i18n, textures = null) { this.session=session; this.i18n=i18n; this.textures=textures; }
  formatTime(ms) { const min=Math.floor(ms/60000); const sec=Math.floor(ms/1000)%60; const cs=Math.floor(ms/10)%100; return `${String(min).padStart(2,'0')}:${String(sec).padStart(2,'0')}.${String(cs).padStart(2,'0')}`; }
  drawCharacter(context) {
    const texture=this.textures?.get?.('strong-attack');
    const source=texture?.getSourceImage?.();
    if(source){context.drawImage(source,0,0,27,24,150,390,270,240);return;}
    context.fillStyle='#f1b48a';context.fillRect(220,420,150,230);context.fillStyle='#111';context.fillRect(190,410,210,28);context.fillStyle='#e64c3c';context.fillRect(175,635,240,35);
  }
  drawBrokenFactory(context) {
    const factoryTexture=this.textures?.get?.('bg-factory');
    const factorySource=factoryTexture?.getSourceImage?.();
    if(factorySource){
      context.drawImage(factorySource,0,0,factorySource.width,factorySource.height,0,168,1080,640);
      const wreckTexture=this.textures?.get?.('factory-v2-4');const wreck=wreckTexture?.getSourceImage?.();
      if(wreck)context.drawImage(wreck,0,0,wreck.width,wreck.height,400,168,680,576);
      return;
    }
    context.fillStyle='#777';context.fillRect(540,250,430,475);context.strokeStyle='#111';context.lineWidth=20;context.strokeRect(540,250,430,475);
    context.fillStyle='#333';context.fillRect(590,315,310,165);context.fillStyle='#e64c3c';context.fillRect(565,535,380,45);
    context.fillStyle='#555';context.fillRect(850,170,80,115);context.strokeRect(850,170,80,115);
    context.lineWidth=18;context.beginPath();context.moveTo(585,285);context.lineTo(920,680);context.moveTo(925,290);context.lineTo(600,680);context.stroke();
    context.fillStyle='#222';context.fillRect(500,700,500,38);
  }
  drawBrokenKiosks(context) {
    const texture=this.textures?.get?.('kiosk-v2-4');
    const source=texture?.getSourceImage?.();
    const placements=[
      {x:105,y:704,size:170,angle:-.18},
      {x:510,y:700,size:165,angle:.12},
      {x:950,y:704,size:170,angle:.18}
    ];
    for(const item of placements){
      context.save();context.translate(item.x,item.y);context.rotate(item.angle);
      if(source)context.drawImage(source,0,0,source.width,source.height,-item.size/2,-item.size/2,item.size,item.size);
      else{context.fillStyle='#17151a';context.fillRect(-35,-72,70,128);context.fillStyle='#555';context.fillRect(-24,-58,48,54);context.fillStyle='#d73e32';context.fillRect(-30,38,60,9);}
      context.restore();
    }
  }
  drawFittedText(context,text,y,maxWidth=980,baseSize=54) {
    let size=baseSize;
    context.font=`bold ${size}px Arial, sans-serif`;
    if(context.measureText(text).width>maxWidth)size=Math.max(30,Math.floor(size*maxWidth/context.measureText(text).width));
    context.font=`bold ${size}px Arial, sans-serif`;context.fillText(text,540,y);
  }
  createCanvas() {
    const canvas=document.createElement('canvas'); canvas.width=1080; canvas.height=1080; const c=canvas.getContext('2d'); c.imageSmoothingEnabled=false;
    c.fillStyle='#f7e05e'; c.fillRect(0,0,1080,1080); c.fillStyle='#e64c3c'; c.fillRect(0,0,1080,150); c.fillStyle='#111'; c.fillRect(0,150,1080,18);
    c.fillStyle='#222'; c.font='bold 62px Arial, sans-serif'; c.textAlign='center'; c.fillText('I HATE F**KING KIOSK',540,100);
    this.drawBrokenFactory(c);this.drawBrokenKiosks(c);this.drawCharacter(c);
    for(let i=0;i<18;i++){c.fillStyle=i%2?'#ddd':'#333'; c.fillRect(500+Math.random()*470,690+Math.random()*80,18+Math.random()*30,12+Math.random()*20);}
    c.fillStyle='#111';this.drawFittedText(c,`${this.i18n.t('time')}  ${this.formatTime(this.session.elapsedMs)}`,850);this.drawFittedText(c,`${this.i18n.t('destroyed')}  ${this.session.destroyedTotal}`,930);
    c.font='bold 42px monospace'; c.fillText('#IHFK',540,1010); return canvas;
  }
  async share() {
    const canvas=this.createCanvas(); const text=this.i18n.t('shareText',{count:this.session.destroyedTotal,time:this.formatTime(this.session.elapsedMs)}); const url=location.href;
    const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png')); const file=new File([blob],'ihfk-result.png',{type:'image/png'});
    if (!FORCE_SHARE_FALLBACK && navigator.share && navigator.canShare?.({files:[file]})) {
      try { await navigator.share({title:'I HATE F**KING KIOSK',text,url,files:[file]}); return 'shared'; }
      catch(error) { if(error?.name==='AbortError')return 'cancelled'; }
    }
    const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='ihfk-result.png'; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),1000);
    try{await navigator.clipboard?.writeText(`${text}\n${url}`);}catch{}
    return 'downloaded';
  }
}
