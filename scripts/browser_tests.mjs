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
    assert(result.includes('29 passed, 0 failed'), result);
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
      return {
        screen: { left: screen.left, top: screen.top, right: screen.right, bottom: screen.bottom },
        buttons: buttons.map(button => ({ left: button.left, top: button.top, right: button.right, bottom: button.bottom })),
      };
    });
    assert(bounds.buttons.length === 3, `result buttons: ${bounds.buttons.length}`);
    for (const button of bounds.buttons) {
      assert(button.left >= bounds.screen.left && button.top >= bounds.screen.top && button.right <= bounds.screen.right && button.bottom <= bounds.screen.bottom, 'result action clipped');
    }
  });

  assert(errors.length === 0, `browser console errors: ${errors.join(' | ')}; missing: ${missingRequests.join(', ')}`);
} finally {
  await browser.close();
  await new Promise(resolveClosed => server.close(resolveClosed));
}
