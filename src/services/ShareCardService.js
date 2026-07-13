import { FORCE_SHARE_FALLBACK, GAME_URL } from '../config.js';

export class ShareCardService {
  constructor(session, i18n, textures = null) { this.session=session; this.i18n=i18n; this.textures=textures; }
  formatTime(ms) { const min=Math.floor(ms/60000); const sec=Math.floor(ms/1000)%60; const cs=Math.floor(ms/10)%100; return `${String(min).padStart(2,'0')}:${String(sec).padStart(2,'0')}.${String(cs).padStart(2,'0')}`; }
  fittedText(context,text,x,y,maxWidth,baseSize,{align='left',family='"Arial Black", Arial, sans-serif'}={}) {
    let size=baseSize;context.font=`900 ${size}px ${family}`;const measured=context.measureText(text).width;
    if(measured>maxWidth)size=Math.max(22,Math.floor(size*maxWidth/measured));
    context.font=`900 ${size}px ${family}`;context.textAlign=align;context.fillText(text,x,y);
  }
  drawCharacter(context) {
    const source=this.textures?.get?.('strong-attack')?.getSourceImage?.();
    if(source){context.drawImage(source,0,0,27,24,82,360,108,96);return;}
    context.fillStyle='#f1b48a';context.fillRect(102,365,66,82);context.fillStyle='#111';context.fillRect(88,360,94,12);context.fillStyle='#56324a';context.fillRect(93,443,84,13);
  }
  drawKiosk(context,source,x,y,size,angle=0,intact=true) {
    context.save();context.translate(x,y);context.rotate(angle);
    if(source)context.drawImage(source,0,0,source.width,source.height,-size/2,-size/2,size,size);
    else{context.fillStyle=intact?'#d8d8d8':'#17151a';context.fillRect(-size*.22,-size*.46,size*.44,size*.8);context.fillStyle='#035119';context.fillRect(-size*.15,-size*.36,size*.3,size*.34);context.fillStyle='#e1a50f';context.font=`bold ${Math.floor(size*.22)}px monospace`;context.textAlign='center';context.fillText(intact?'B':'×',0,-size*.12);}
    context.restore();
  }
  drawPoster(context) {
    const x=40,y=155,w=390,h=390,innerX=58,innerY=173,innerW=354;
    context.fillStyle='#111';context.fillRect(x+14,y+14,w,h);context.fillStyle='#29282d';context.fillRect(x,y,w,h);context.strokeStyle='#111';context.lineWidth=8;context.strokeRect(x,y,w,h);
    context.save();context.beginPath();context.rect(innerX,innerY,innerW,354);context.clip();
    context.fillStyle='#e64c3c';context.fillRect(innerX,innerY,innerW,58);context.fillStyle='#f4c338';context.fillRect(innerX,innerY+45,innerW,8);context.fillStyle='#111';context.font='900 20px Arial, sans-serif';context.textAlign='center';context.fillText('I HATE F**KING KIOSK',innerX+innerW/2,innerY+36);
    const factory=this.textures?.get?.('bg-factory')?.getSourceImage?.();
    if(factory)context.drawImage(factory,0,0,factory.width,factory.height,innerX,innerY+58,innerW,260);else{context.fillStyle='#607976';context.fillRect(innerX,innerY+58,innerW,260);context.fillStyle='#25272d';for(let index=0;index<6;index++)context.fillRect(innerX+index*63,innerY+74,34,180);}
    const wreck=this.textures?.get?.('factory-v2-4')?.getSourceImage?.();
    if(wreck)context.drawImage(wreck,0,0,wreck.width,wreck.height,188,236,224,230);else{context.fillStyle='#25272d';context.fillRect(220,285,178,165);}
    this.drawCharacter(context);
    const intact=this.textures?.get?.('kiosk-v2-0')?.getSourceImage?.();const broken=this.textures?.get?.('kiosk-v2-4')?.getSourceImage?.();
    this.drawKiosk(context,intact,100,440,86,-.1,true);this.drawKiosk(context,broken,250,438,92,.08,false);this.drawKiosk(context,intact,380,440,86,.1,true);
    context.fillStyle='#f4c338';context.fillRect(innerX,491,innerW,36);context.fillStyle='#111';context.font='900 22px Consolas, monospace';context.textAlign='center';context.fillText('#IHFK',innerX+innerW/2,517);context.restore();
  }
  drawReceipt(context) {
    const x=475,y=170,w=570,h=350;context.fillStyle='#111';context.fillRect(x+14,y+14,w,h);context.fillStyle='#fff9dd';context.fillRect(x,y,w,h);context.strokeStyle='#17151a';context.lineWidth=8;context.strokeRect(x,y,w,h);
    const row=(label,value,rowY)=>{context.fillStyle='#17151a';context.textAlign='left';context.font='900 27px Arial, sans-serif';context.fillText(label,x+38,rowY);context.textAlign='right';context.font='900 54px "Arial Black", Arial, sans-serif';context.fillText(value,x+w-38,rowY+3);context.strokeStyle='#777';context.lineWidth=4;context.setLineDash([10,7]);context.beginPath();context.moveTo(x+38,rowY+25);context.lineTo(x+w-38,rowY+25);context.stroke();context.setLineDash([]);};
    row(this.i18n.t('time'),this.formatTime(this.session.elapsedMs),270);row(this.i18n.t('destroyed'),String(this.session.destroyedTotal),370);
    context.fillStyle='#17151a';context.textAlign='center';context.font='bold 16px Consolas, monospace';context.fillText('ERROR CODE: KIOSK-404',x+w/2,453);context.fillText('SMASHING SESSION COMPLETE',x+w/2,476);context.font='bold 13px Consolas, monospace';context.fillText(GAME_URL,x+w/2,505);
  }
  createCanvas() {
    const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=640;const context=canvas.getContext('2d');context.imageSmoothingEnabled=false;
    context.fillStyle='#dfe8d0';context.fillRect(0,0,1080,640);context.fillStyle='rgba(24,58,43,.07)';for(let y=3;y<640;y+=4)context.fillRect(0,y,1080,1);
    context.fillStyle='#3f9b60';context.fillRect(35,25,72,72);context.strokeStyle='#17151a';context.lineWidth=8;context.strokeRect(35,25,72,72);context.fillStyle='#fff';context.font='900 32px Arial, sans-serif';context.textAlign='center';context.fillText('OK',71,72);
    context.fillStyle='#17151a';this.fittedText(context,this.i18n.t('complete'),135,81,890,62);context.fillRect(35,112,1010,9);
    this.drawPoster(context);this.drawReceipt(context);return canvas;
  }
  async share(canvas = this.createCanvas()) {
    const text=this.i18n.t('shareText',{count:this.session.destroyedTotal,time:this.formatTime(this.session.elapsedMs)});const url=GAME_URL;
    const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));const file=new File([blob],'ihfk-result.png',{type:'image/png'});
    if(!FORCE_SHARE_FALLBACK&&navigator.share&&navigator.canShare?.({files:[file]})){try{await navigator.share({title:'I HATE F**KING KIOSK',text,url,files:[file]});return 'shared';}catch(error){if(error?.name==='AbortError')return 'cancelled';}}
    const anchor=document.createElement('a');anchor.href=URL.createObjectURL(blob);anchor.download='ihfk-result.png';anchor.click();setTimeout(()=>URL.revokeObjectURL(anchor.href),1000);try{await navigator.clipboard?.writeText(`${text}\n${url}`);}catch{}return 'downloaded';
  }
}
