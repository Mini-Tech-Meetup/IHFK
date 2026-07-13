import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { chromium, firefox, webkit } from 'playwright';

const root=process.cwd();
const headless=!process.env.IHFK_HEADED;
const mime={'.css':'text/css; charset=utf-8','.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png'};
const server=createServer(async(request,response)=>{
  try{
    const url=new URL(request.url,'http://127.0.0.1');
    if(url.pathname==='/favicon.ico'){response.writeHead(204);response.end();return;}
    const requested=decodeURIComponent(url.pathname.endsWith('/')?`${url.pathname}index.html`:url.pathname);
    const pathname=requested.replace(/^\/IHFK(?=\/)/,'');
    const path=resolve(root,`.${pathname}`);
    if(path!==root&&!path.startsWith(`${root}${sep}`))throw new Error('invalid path');
    const body=await readFile(path);response.writeHead(200,{'content-type':mime[extname(path)]||'application/octet-stream','cache-control':'no-store'});response.end(body);
  }catch{response.writeHead(404);response.end('Not found');}
});

const assert=(value,message)=>{if(!value)throw new Error(message);};
await new Promise(resolveReady=>server.listen(0,'127.0.0.1',resolveReady));
const base=`http://127.0.0.1:${server.address().port}`;
const matrix=[
  {name:'Chrome stable',type:chromium,launch:{channel:'chrome'}},
  {name:'Playwright Chromium /IHFK/',type:chromium,launch:{},subpath:true},
  {name:'Firefox',type:firefox,launch:{firefoxUserPrefs:{'webgl.disabled':false,'webgl.force-enabled':true,'webgl.software':true}}},
  {name:'WebKit',type:webkit,launch:{}}
];
const mobileMatrix=[
  {name:'Android Chromium emulation',type:chromium,viewport:{width:844,height:390},userAgent:'Mozilla/5.0 (Linux; Android 15) AppleWebKit/537.36 Chrome/149 Mobile Safari/537.36',stressCap:15,stressScene:'Factory'},
  {name:'iPhone WebKit emulation',type:webkit,viewport:{width:932,height:430},userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 26_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1',stressCap:30,stressScene:'Endless'}
];

try{
  for(const entry of matrix){
    const browser=await entry.type.launch({headless,...entry.launch});
    const page=await browser.newPage({viewport:{width:1080,height:640}});const errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
    await page.goto(`${base}${entry.subpath?'/IHFK/':'/'}?testMode&autoplay&previewPickup=bat`,{waitUntil:'networkidle'});
    try{await page.waitForFunction(()=>document.body.dataset.scene==='FastFood',null,{timeout:45_000});}catch(error){const state=await page.evaluate(()=>({scene:document.body.dataset.scene||'none',hasGame:Boolean(window.IHFK),hasPhaser:Boolean(window.Phaser),text:document.body.innerText.slice(0,300)}));throw new Error(`${entry.name}: FastFood timeout ${JSON.stringify(state)}; ${errors.join(' | ')}; ${error.message}`);}
    const boot=await page.evaluate(()=>{
      const scene=window.IHFK.scene.getScene('FastFood');const canvas=document.querySelector('#game canvas');
      return {renderer:window.IHFK.renderer.type,webgl:Phaser.WEBGL,canvas:{width:canvas.width,height:canvas.height},x:scene.player.x};
    });
    assert(boot.renderer===boot.webgl,`${entry.name}: renderer is not WebGL`);
    assert(boot.canvas.width===1080&&boot.canvas.height===640,`${entry.name}: canvas ${boot.canvas.width}x${boot.canvas.height}`);
    await page.keyboard.down('ArrowRight');await page.waitForTimeout(180);await page.keyboard.up('ArrowRight');
    const moved=await page.evaluate(x=>window.IHFK.scene.getScene('FastFood').player.x>x+2,boot.x);
    assert(moved,`${entry.name}: keyboard movement did not reach Phaser input`);
    const beforeHp=await page.evaluate(()=>{const scene=window.IHFK.scene.getScene('FastFood');const kiosk=scene.kiosks.getChildren().find(item=>item.active);scene.player.setPosition(kiosk.x-72,526).setVelocity(0,0);return kiosk.hp;});
    await page.keyboard.down('Space');await page.waitForTimeout(240);await page.keyboard.up('Space');
    const afterHp=await page.evaluate(()=>window.IHFK.scene.getScene('FastFood').kiosks.getChildren().find(item=>item.active)?.hp??0);
    assert(afterHp<beforeHp,`${entry.name}: hold attack did not damage the kiosk (${beforeHp} -> ${afterHp})`);
    await page.evaluate(()=>{const scene=window.IHFK.scene.getScene('FastFood');scene.session.elapsedMs=12345;scene.session.running=false;scene.session.destroyedTotal=7;scene.scene.start('Result');});
    await page.waitForFunction(()=>document.body.dataset.scene==='Result'&&document.querySelector('.result-share-card img')?.naturalWidth===1080);
    if(process.env.IHFK_CAPTURE_MATRIX&&['Firefox','WebKit'].includes(entry.name))await page.screenshot({path:`docs/evidence/runtime-${entry.name.toLowerCase()}-result-1080x640.png`});
    assert(errors.length===0,`${entry.name}: ${errors.join(' | ')}`);
    await browser.close();console.log(`PASS ${entry.name} WebGL boot, keyboard, hold attack, and result preview`);
  }
  for(const entry of mobileMatrix){
    const browser=await entry.type.launch({headless});
    const context=await browser.newContext({viewport:entry.viewport,userAgent:entry.userAgent,hasTouch:true,isMobile:true});
    const page=await context.newPage();const errors=[];
    page.on('pageerror',error=>errors.push(error.message));page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
    await page.goto(`${base}/?testMode&touchMode&previewPickup=bat`,{waitUntil:'networkidle'});
    await page.getByRole('button',{name:'English'}).tap();await page.locator('.service-list button').nth(1).tap();await page.getByRole('button',{name:'GAME START'}).tap();
    try{await page.waitForFunction(()=>document.body.dataset.scene==='FastFood',null,{timeout:45_000});}catch(error){const state=await page.evaluate(()=>({scene:document.body.dataset.scene||'none',hasGame:Boolean(window.IHFK),hasPhaser:Boolean(window.Phaser)}));throw new Error(`${entry.name}: mobile FastFood timeout ${JSON.stringify(state)}; ${errors.join(' | ')}; ${error.message}`);}
    const layout=await page.evaluate(()=>({touch:getComputedStyle(document.querySelector('#touch-controls')).display,rotate:getComputedStyle(document.querySelector('#rotate-overlay')).display,canvas:getComputedStyle(document.querySelector('#game')).visibility}));
    assert(layout.touch==='block'&&layout.rotate==='none'&&layout.canvas==='visible',`${entry.name}: ${JSON.stringify(layout)}`);
    await page.evaluate(()=>window.IHFK.scene.getScene('FastFood').session.addWeapon('bat'));
    await page.locator('#weapon-buttons [data-weapon="bat"]').tap();
    await page.waitForFunction(()=>window.IHFK.scene.getScene('FastFood').session.selectedWeapon==='bat');
    const beforeHp=await page.evaluate(()=>{const scene=window.IHFK.scene.getScene('FastFood');const kiosk=scene.kiosks.getChildren().find(item=>item.active);scene.player.setPosition(kiosk.x-85,526).setVelocity(0,0);return kiosk.hp;});
    await page.locator('#touch-attack').tap();await page.waitForTimeout(160);
    const afterHp=await page.evaluate(()=>window.IHFK.scene.getScene('FastFood').kiosks.getChildren().find(item=>item.active)?.hp??0);
    assert(afterHp<beforeHp,`${entry.name}: touch attack did not damage the kiosk (${beforeHp} -> ${afterHp})`);
    if(process.env.IHFK_CAPTURE_MATRIX&&entry.name.startsWith('iPhone'))await page.screenshot({path:'docs/evidence/runtime-webkit-iphone-touch-932x430.png'});
    await page.goto(`${base}/?testMode&touchMode&previewStress=${entry.stressCap}`,{waitUntil:'networkidle'});
    await page.getByRole('button',{name:'English'}).tap();await page.locator('.service-list button').nth(1).tap();await page.getByRole('button',{name:'GAME START'}).tap();
    await page.waitForFunction(({sceneName,cap})=>document.body.dataset.scene===sceneName&&window.IHFK.scene.getScene('Factory').kiosks.countActive(true)>=cap,{sceneName:entry.stressScene,cap:entry.stressCap},{timeout:10_000});
    const fps=await page.evaluate(()=>new Promise(resolve=>{const samples=[];let previous=performance.now(),started=previous;const frame=now=>{const delta=now-previous;previous=now;if(delta>0&&delta<250)samples.push(1000/delta);if(now-started<1200){requestAnimationFrame(frame);return;}const sorted=samples.slice().sort((a,b)=>a-b);resolve({average:samples.reduce((sum,value)=>sum+value,0)/samples.length,p05:sorted[Math.floor(sorted.length*.05)]||0,active:window.IHFK.scene.getScene('Factory').kiosks.countActive(true)});};requestAnimationFrame(frame);}));
    assert(fps.active===entry.stressCap&&fps.average>=30&&fps.p05>=20,`${entry.name}: stress ${JSON.stringify(fps)}`);
    await page.evaluate(()=>{const scene=window.IHFK.scene.getScene('Factory');scene.stressStartedAt=scene.time.now-10001;scene.stressLastFrameAt=scene.time.now-17;scene.stressSamples=Array(120).fill(60);scene.updateStressQa(scene.time.now);});
    await page.waitForFunction(cap=>document.body.dataset.stressStatus==='complete'&&document.querySelector('.stress-report')&&JSON.parse(document.querySelector('.stress-report pre').textContent).activeKiosks===cap,entry.stressCap);
    if(process.env.IHFK_CAPTURE_MATRIX){await page.evaluate(()=>window.IHFK.loop.sleep());await page.waitForTimeout(120);}
    if(process.env.IHFK_CAPTURE_MATRIX&&entry.name.startsWith('Android'))await page.screenshot({path:'docs/evidence/runtime-chromium-android-stress-844x390.png'});
    if(process.env.IHFK_CAPTURE_MATRIX&&entry.name.startsWith('iPhone'))await page.screenshot({path:'docs/evidence/runtime-webkit-iphone-stress-932x430.png'});
    assert(errors.length===0,`${entry.name}: ${errors.join(' | ')}`);
    await browser.close();console.log(`PASS ${entry.name} touch input and ${entry.stressCap}-unit ${entry.stressScene} stress avg ${fps.average.toFixed(1)} / p05 ${fps.p05.toFixed(1)} FPS`);
  }
}finally{
  await new Promise(resolveClosed=>server.close(resolveClosed));
}
