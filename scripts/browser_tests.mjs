import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const missingRequests = [];
const mime = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
};

function assert(value, message) {
  if (!value) throw new Error(message);
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://127.0.0.1');
    if (url.pathname === '/favicon.ico') {
      response.writeHead(204);
      response.end();
      return;
    }
    const pathname = decodeURIComponent(url.pathname.endsWith('/') ? `${url.pathname}index.html` : url.pathname);
    const path = resolve(root, `.${pathname}`);
    if (path !== root && !path.startsWith(`${root}${sep}`)) throw new Error('invalid path');
    const body = await readFile(path);
    response.writeHead(200, { 'content-type': mime[extname(path)] || 'application/octet-stream', 'cache-control': 'no-store' });
    response.end(body);
  } catch {
    missingRequests.push(request.url);
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('Not found');
  }
});

await new Promise(resolveReady => server.listen(0, '127.0.0.1', resolveReady));
const address = server.address();
const base = `http://127.0.0.1:${address.port}`;
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1080, height: 640 } });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });

async function test(name, action) {
  await action();
  console.log(`PASS ${name}`);
}

function mobileLayout() {
  const ids = ['joystick', 'touch-jump', 'touch-attack', 'touch-mute', 'weapon-buttons'];
  const rectangle = element => {
    const bounds = element.getBoundingClientRect();
    return { left: bounds.left, top: bounds.top, right: bounds.right, bottom: bounds.bottom };
  };
  const entries = Object.fromEntries(ids.map(id => [id, rectangle(document.querySelector(`#${id}`))]));
  const overlaps = [];
  for (let left = 0; left < ids.length; left += 1) {
    for (let right = left + 1; right < ids.length; right += 1) {
      const a = entries[ids[left]];
      const b = entries[ids[right]];
      if (a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top) overlaps.push(`${ids[left]}×${ids[right]}`);
    }
  }
  return {
    entries,
    overlaps,
    rotate: getComputedStyle(document.querySelector('#rotate-overlay')).display,
    gameVisibility: getComputedStyle(document.querySelector('#game')).visibility,
    viewport: { width: innerWidth, height: innerHeight },
  };
}

try {
  await test('browser unit suite', async () => {
    await page.goto(`${base}/tests/`, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => document.title.endsWith('PASSED'));
    const result = await page.locator('#out').textContent();
    assert(result.includes('34 passed, 0 failed'), result);
  });

  await test('intro bubble anchors above the hero and transform uses all source frames', async () => {
    await page.setViewportSize({ width: 1080, height: 640 });
    await page.goto(`${base}/?testMode&autoplay&previewTransform`, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => document.body.dataset.scene === 'Intro' && document.querySelector('.cutscene-bubble')?.classList.contains('pop'));
    const state = await page.evaluate(() => {
      const scene = window.IHFK.scene.getScene('Intro');
      const bubble = document.querySelector('.cutscene-bubble');
      const bounds = bubble.getBoundingClientRect();
      const range = document.createRange();range.selectNodeContents(bubble);const textBounds = range.getBoundingClientRect();
      const canvas = document.querySelector('#game canvas').getBoundingClientRect();
      const scaleX = canvas.width / 1080; const scaleY = canvas.height / 640;
      const heroX = canvas.left + scene.hero.x * scaleX;
      const heroTop = canvas.top + (scene.hero.y - scene.hero.displayHeight) * scaleY;
      const localeFits = ['ko','zh-CN','zh-TW','ja','en','fr','de','es','pt-BR','it'].map(locale => {
        scene.session.locale = locale;bubble.textContent = scene.i18n.t('intro2');
        const panel = bubble.getBoundingClientRect();const words = document.createRange();words.selectNodeContents(bubble);const ink = words.getBoundingClientRect();
        return { locale, fits: panel.left >= 0 && panel.right <= innerWidth && panel.top >= 0 && panel.bottom <= innerHeight && ink.left >= panel.left + 6 && ink.right <= panel.right - 6 && ink.top >= panel.top + 6 && ink.bottom <= panel.bottom - 6 };
      });
      scene.session.locale = 'en';bubble.textContent = 'TRANSFORM SPRITE QA';
      return {
        bounds: { left: bounds.left, top: bounds.top, right: bounds.right, bottom: bounds.bottom },
        centerX: bounds.left + bounds.width / 2,
        heroX, heroTop,
        distance: Math.abs(scene.kiosk.x - scene.hero.x),
        frames: scene.anims.get('normal-transform').frames.length,
        textFits: textBounds.left >= bounds.left + 6 && textBounds.right <= bounds.right - 6 && textBounds.top >= bounds.top + 6 && textBounds.bottom <= bounds.bottom - 6,
        localeFits,
      };
    });
    assert(state.bounds.left >= 0 && state.bounds.top >= 0 && state.bounds.right <= 1080 && state.bounds.bottom <= 640, 'intro bubble clipped by viewport');
    assert(state.textFits, 'intro bubble text clipped inside its panel');
    assert(state.localeFits.every(entry => entry.fits), `localized intro clipping: ${state.localeFits.filter(entry => !entry.fits).map(entry => entry.locale).join(',')}`);
    assert(Math.abs(state.centerX - state.heroX) < 45, 'intro bubble not anchored to hero');
    assert(state.bounds.bottom <= state.heroTop + 10, 'intro bubble is not above hero');
    assert(state.distance <= 140, `hero and kiosk are too far apart: ${state.distance}`);
    assert(state.frames === 27, `transform animation frames: ${state.frames}`);
  });

  await test('title complaint bubble renders above the unclipped kiosk shell', async () => {
    await page.goto(`${base}/?testMode`, { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'English' }).click();
    await page.waitForFunction(() => document.body.dataset.scene === 'Title' && document.querySelector('.start-complaint')?.classList.contains('pop'));
    const state = await page.evaluate(() => {
      const bubble = document.querySelector('.start-complaint');const bounds = bubble.getBoundingClientRect();const shell = bubble.closest('.kiosk-shell').getBoundingClientRect();
      return { parent:bubble.parentElement.className,bounds:{left:bounds.left,top:bounds.top,right:bounds.right,bottom:bounds.bottom},shell:{left:shell.left,top:shell.top,right:shell.right,bottom:shell.bottom},z:Number(getComputedStyle(bubble).zIndex),text:bubble.textContent };
    });
    assert(state.parent === 'kiosk-shell', `complaint parent: ${state.parent}`);
    assert(state.z >= 80, `complaint z-index: ${state.z}`);
    assert(state.bounds.left >= 0 && state.bounds.top >= 0 && state.bounds.right <= 1080 && state.bounds.bottom <= 640, 'title complaint clipped by viewport');
    assert(state.bounds.left >= state.shell.left && state.bounds.right <= state.shell.right && state.bounds.top >= state.shell.top && state.bounds.bottom <= state.shell.bottom, 'title complaint outside kiosk shell');
    assert(state.text.includes('F**KING'), `complaint text: ${state.text}`);
  });

  await test('fist hits only the nearest front target with hand-sized reach', async () => {
    await page.goto(`${base}/?testMode&previewPickup=bat`, { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'English' }).click();
    await page.locator('.service-list button').nth(1).click();
    await page.getByRole('button', { name: 'GAME START' }).click();
    await page.waitForFunction(() => document.body.dataset.scene === 'FastFood');
    const state = await page.evaluate(() => {
      const scene=window.IHFK.scene.getScene('FastFood');const pickup=scene.pickupLabels[0];const pickupBounds=pickup.pickup.getBounds();
      const pickupState={offsetX:pickup.halo.x-pickup.pickup.x,offsetY:pickup.halo.y-pickup.pickup.y,halo:{width:pickup.halo.displayWidth,height:pickup.halo.displayHeight},image:{width:pickupBounds.width,height:pickupBounds.height}};
      scene.kiosks.clear(true,true);scene.player.setPosition(200,526).setVelocity(0,0);scene.session.selectWeapon('fist');scene.player.nextAttack=0;
      const first=scene.spawnKiosk(275,false,'attack-test');const second=scene.spawnKiosk(325,false,'attack-test');scene.player.attack(scene.time.now+1000);
      const [x,y,width,height]=document.body.dataset.attackRect.split(',').map(Number);
      const frontState={firstDead:first.dead,secondHp:second.hp,targets:Number(document.body.dataset.attackTargets)};scene.kiosks.clear(true,true);
      const weaponScales={},targetProfiles={};for(const key of ['bat','chainsaw','shotgun']){const samples=[255,280,305,330].map(position=>scene.spawnKiosk(position,false,'profile-test'));scene.session.weapons[key]=9999;scene.session.selectWeapon(key);scene.player.nextAttack=0;scene.player.attack(scene.time.now+2000);weaponScales[key]=scene.player.visual.scaleX;targetProfiles[key]=samples.filter(kiosk=>kiosk.hp<12).length;scene.kiosks.clear(true,true);}
      return {...frontState,rect:{x,y,width,height},playerX:scene.player.x,weaponScales,targetProfiles,pickupState};
    });
    assert(state.firstDead && state.secondHp > 0, `front/back damage: ${state.firstDead}/${state.secondHp}`);
    assert(state.targets === 1, `fist targets: ${state.targets}`);
    assert(state.rect.width === 78 && state.rect.height === 58 && state.rect.x === state.playerX + 18, `fist rect: ${JSON.stringify(state.rect)}`);
    assert(Object.values(state.weaponScales).every(scale => scale === 2.5), `weapon scales: ${JSON.stringify(state.weaponScales)}`);
    assert(state.targetProfiles.bat === 4 && state.targetProfiles.chainsaw === 1 && state.targetProfiles.shotgun === 3, `weapon target profiles: ${JSON.stringify(state.targetProfiles)}`);
    assert(state.pickupState.offsetX === 0 && state.pickupState.offsetY === 0, `pickup offset: ${state.pickupState.offsetX},${state.pickupState.offsetY}`);
    assert(state.pickupState.halo.width >= state.pickupState.image.width && state.pickupState.halo.height >= state.pickupState.image.height, 'pickup image not contained by box');
  });

  await test('factory room and five raster damage stages are separate runtime images', async () => {
    await page.goto(`${base}/?testMode&previewFactory`, { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'English' }).click();
    await page.locator('.service-list button').nth(1).click();
    await page.getByRole('button', { name: 'GAME START' }).click();
    await page.waitForFunction(() => document.body.dataset.scene === 'Factory');
    await page.waitForFunction(() => window.IHFK.scene.getScene('Factory').lastAssemblyProduct?.active, null, { timeout: 5000 });
    const state = await page.evaluate(() => {
      const scene=window.IHFK.scene.getScene('Factory');const target=scene.factoryTarget;const productDepth=scene.lastAssemblyProduct?.depth;const stages=[];
      for(const amount of [21,20,20,20]){target.takeDamage(amount,1,'fist');stages.push({state:target.damageState,key:target.visual.texture.key,bounds:{x:target.bounds.x,y:target.bounds.y,width:target.bounds.width,height:target.bounds.height}});}
      const background=scene.children.list.find(child=>child.texture?.key==='bg-factory');
      return {backgroundKey:background?.texture?.key,visualKey:target.visual.texture.key,visualType:target.visual.type,factoryDepth:target.visual.depth,productDepth,stages,legacyOverlays:['damage','flash','screen'].filter(key=>key in target)};
    });
    assert(state.backgroundKey === 'bg-factory' && state.visualKey === 'factory-v2-4', `${state.backgroundKey}/${state.visualKey}`);
    assert(state.visualType === 'Image', `factory visual type: ${state.visualType}`);
    assert(state.productDepth < state.factoryDepth, `factory product depth ${state.productDepth} is not behind target depth ${state.factoryDepth}`);
    assert(state.stages.map(stage=>stage.state).join(',') === '1,2,3,4', `factory stages: ${JSON.stringify(state.stages)}`);
    assert(state.stages.every((stage,index)=>stage.key===`factory-v2-${index+1}`), `factory textures: ${JSON.stringify(state.stages)}`);
    assert(state.stages[3].bounds.height < state.stages[0].bounds.height, 'destroyed factory hitbox did not shrink with sprite');
    assert(state.legacyOverlays.length === 0, `legacy factory overlays: ${state.legacyOverlays.join(',')}`);
  });

  await test('stage exit is blank until the designed GO sign appears', async () => {
    await page.goto(`${base}/?testMode&autoplay&previewPickup=bat`, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => document.body.dataset.scene === 'FastFood');
    const before = await page.evaluate(() => {
      const scene = window.IHFK.scene.getScene('FastFood');
      return { state: document.body.dataset.exitState, visible: scene.goSign.sign.visible };
    });
    assert(before.state === 'hidden' && before.visible === false, 'exit marker visible before clear');
    await page.evaluate(() => {
      const scene = window.IHFK.scene.getScene('FastFood');
      scene.kiosks.getChildren().find(kiosk => kiosk.active)?.takeDamage(999, 1);
    });
    await page.waitForFunction(() => document.body.dataset.exitState === 'go');
    const after = await page.evaluate(() => {
      const sign = window.IHFK.scene.getScene('FastFood').goSign.sign;
      return { visible: sign.visible, labels: sign.list.filter(child => child.type === 'Text').map(child => child.text) };
    });
    assert(after.visible && after.labels.length === 1 && after.labels[0] === 'GO', `exit sign labels: ${after.labels.join(',')}`);
  });

  await test('falling kiosk knocks back the player with gameplay-sized hitboxes', async () => {
    await page.goto(`${base}/?testMode&autoplay&previewPickup=bat`, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => document.body.dataset.scene === 'FastFood');
    await page.evaluate(() => {
      const scene = window.IHFK.scene.getScene('FastFood');
      scene.kiosks.clear(true, true);scene.player.setPosition(540, 526).setVelocity(0, 0);
      window.__impactKiosk = scene.spawnKiosk(540, true, 'impact-test');
      document.body.dataset.playerImpactCount = '0';
    });
    await page.waitForFunction(() => Number(document.body.dataset.playerImpactCount) > 0, null, { timeout: 5000 });
    const impact = await page.evaluate(() => ({
      vx: Number(document.body.dataset.playerVelocityX),
      vy: Number(document.body.dataset.playerVelocityY),
      playerHitbox: document.body.dataset.playerHitbox,
      kioskHitbox: document.body.dataset.kioskHitbox,
    }));
    assert(Math.abs(impact.vx) >= 250 && impact.vy < -150, `weak kiosk knockback: ${impact.vx},${impact.vy}`);
    assert(impact.playerHitbox === '42x88', `player hitbox: ${impact.playerHitbox}`);
    assert(impact.kioskHitbox !== 'none', 'kiosk hitbox unavailable');
  });

  await test('stacked kiosk falls after its supporting kiosk is destroyed', async () => {
    await page.goto(`${base}/?testMode&autoplay&previewPickup=bat`, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => document.body.dataset.scene === 'FastFood');
    await page.evaluate(() => {
      const scene = window.IHFK.scene.getScene('FastFood');
      scene.kiosks.clear(true, true);
      window.__stackLower = scene.spawnKiosk(650, false, 'stack-test');
      window.__stackUpper = scene.spawnKiosk(650, true, 'stack-test');
    });
    await page.waitForFunction(() => window.__stackUpper?.body?.blocked.down && !window.__stackUpper.landed, null, { timeout: 5000 });
    const beforeY = await page.evaluate(() => window.__stackUpper.y);
    await page.evaluate(() => window.__stackLower.takeDamage(999, 1));
    await page.waitForFunction(y => window.__stackUpper?.y > y + 35, beforeY, { timeout: 3000 });
    await page.waitForFunction(() => window.__stackUpper?.landed, null, { timeout: 3000 });
    const afterY = await page.evaluate(() => window.__stackUpper.y);
    assert(afterY > beforeY + 60, `stacked kiosk did not drop far enough: ${beforeY} -> ${afterY}`);
  });

  await test('street clouds are separate continuous moving layers', async () => {
    await page.goto(`${base}/?testMode&autoplay&previewPickup=bat`, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => document.body.dataset.scene === 'FastFood');
    await page.evaluate(() => window.IHFK.scene.getScene('FastFood').scene.start('Street'));
    await page.waitForFunction(() => document.body.dataset.scene === 'Street');
    const before = await page.evaluate(() => {
      const scene=window.IHFK.scene.getScene('Street');
      return {xs:scene.clouds.map(cloud=>cloud.x),depths:scene.clouds.map(cloud=>cloud.depth),background:scene.children.list.find(child=>child.texture?.key==='bg-street')?.depth};
    });
    await page.waitForTimeout(500);
    const after = await page.evaluate(() => window.IHFK.scene.getScene('Street').clouds.map(cloud=>cloud.x));
    assert(before.xs.every((x,index)=>after[index]>x), `clouds did not move continuously: ${before.xs} -> ${after}`);
    assert(before.depths.every(depth=>depth>before.background&&depth<0), `cloud layer depths: bg=${before.background}, clouds=${before.depths}`);
  });

  for (const [name, width, height] of [['Android', 844, 390], ['iPhone', 932, 430]]) {
    await test(`${name} landscape touch layout`, async () => {
      await page.setViewportSize({ width, height });
      await page.goto(`${base}/?testMode&autoplay&touchMode&previewPickup=bat`, { waitUntil: 'networkidle' });
      await page.waitForFunction(() => document.body.dataset.scene === 'FastFood');
      const layout = await page.evaluate(mobileLayout);
      assert(layout.rotate === 'none', `${name}: rotate overlay visible`);
      assert(layout.gameVisibility === 'visible', `${name}: game hidden`);
      assert(layout.overlaps.length === 0, `${name}: ${layout.overlaps.join(', ')}`);
      for (const [id, bounds] of Object.entries(layout.entries)) {
        assert(bounds.left >= 0 && bounds.top >= 0 && bounds.right <= width && bounds.bottom <= height, `${name}: ${id} outside viewport`);
      }
    });
  }

  await test('portrait rotation fallback', async () => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${base}/?testMode&autoplay&touchMode&previewPickup=bat`, { waitUntil: 'networkidle' });
    const state = await page.evaluate(() => ({
      overlay: getComputedStyle(document.querySelector('#rotate-overlay')).display,
      game: getComputedStyle(document.querySelector('#game')).visibility,
      touch: getComputedStyle(document.querySelector('#touch-controls')).visibility,
    }));
    assert(state.overlay === 'flex', 'portrait overlay hidden');
    assert(state.game === 'hidden' && state.touch === 'hidden', 'portrait gameplay still visible');
  });

  await test('1080x640 campaign result actions fit the kiosk screen', async () => {
    await page.setViewportSize({ width: 1080, height: 640 });
    await page.goto(`${base}/?testMode&autoplay`, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => document.body.dataset.scene === 'Result', null, { timeout: 30_000 });
    const bounds = await page.evaluate(() => {
      const screen = document.querySelector('.kiosk-screen').getBoundingClientRect();
      const buttons = [...document.querySelectorAll('.result-actions button')].map(button => button.getBoundingClientRect());
      const preview=document.querySelector('.result-share-card img');const previewBounds=preview.getBoundingClientRect();
      return {
        screen: { left: screen.left, top: screen.top, right: screen.right, bottom: screen.bottom },
        buttons: buttons.map(button => ({ left: button.left, top: button.top, right: button.right, bottom: button.bottom })),
        preview:{left:previewBounds.left,top:previewBounds.top,right:previewBounds.right,bottom:previewBounds.bottom,naturalWidth:preview.naturalWidth,naturalHeight:preview.naturalHeight,source:preview.currentSrc.slice(0,22)},
      };
    });
    assert(bounds.buttons.length === 3, `result buttons: ${bounds.buttons.length}`);
    for (const button of bounds.buttons) {
      assert(button.left >= bounds.screen.left && button.top >= bounds.screen.top && button.right <= bounds.screen.right && button.bottom <= bounds.screen.bottom, 'result action clipped');
    }
    assert(bounds.preview.left>=bounds.screen.left&&bounds.preview.top>=bounds.screen.top&&bounds.preview.right<=bounds.screen.right&&bounds.preview.bottom<=bounds.screen.bottom,'share-card preview clipped');
    assert(bounds.preview.naturalWidth===1080&&bounds.preview.naturalHeight===1080&&bounds.preview.source==='data:image/png;base64,',`share-card preview source: ${JSON.stringify(bounds.preview)}`);
  });

  assert(errors.length === 0, `browser console errors: ${errors.join(' | ')}; missing: ${missingRequests.join(', ')}`);
} finally {
  await browser.close();
  await new Promise(resolveClosed => server.close(resolveClosed));
}
