const results = {
  timestamp: new Date().toISOString(),
  userAgent: navigator.userAgent,
  platform: navigator.userAgentData?.platform || navigator.platform || 'unknown',
  viewport: `${innerWidth}x${innerHeight}`,
  devicePixelRatio,
  orientation: screen.orientation?.type || (matchMedia('(orientation: landscape)').matches ? 'landscape' : 'portrait'),
  coarsePointer: matchMedia('(pointer: coarse)').matches,
  fullscreenApi: Boolean(document.documentElement.requestFullscreen),
  orientationLockApi: Boolean(screen.orientation?.lock),
  webShareApi: Boolean(navigator.share),
  fileShareApi: false,
  displayTest: 'not-run',
  audioTest: 'not-run',
  shareTest: 'not-run',
  stressFpsAverage: 'not-run',
  stressFpsP05: 'not-run'
};

try {
  const probe = new File([new Blob(['IHFK'], { type: 'text/plain' })], 'ihfk-probe.txt', { type: 'text/plain' });
  results.fileShareApi = Boolean(navigator.canShare?.({ files: [probe] }));
} catch {}

const environment = document.querySelector('#environment');
const report = document.querySelector('#report');
const stressCanvas = document.querySelector('#stress');
const stressContext = stressCanvas.getContext('2d', { alpha: false });
stressContext.imageSmoothingEnabled = false;

function renderEnvironment() {
  const fields = [
    ['User Agent', results.userAgent], ['Platform', results.platform], ['Viewport', results.viewport],
    ['DPR', results.devicePixelRatio], ['Orientation', results.orientation], ['Coarse pointer', results.coarsePointer],
    ['Fullscreen API', results.fullscreenApi], ['Orientation lock API', results.orientationLockApi],
    ['Web Share API', results.webShareApi], ['File Share API', results.fileShareApi]
  ];
  environment.replaceChildren(...fields.flatMap(([name, value]) => {
    const term = document.createElement('dt'); term.textContent = name;
    const description = document.createElement('dd'); description.textContent = String(value);
    return [term, description];
  }));
}

function renderReport() { report.textContent = JSON.stringify(results, null, 2); }
function update() { renderEnvironment(); renderReport(); }

document.querySelector('#display-test').addEventListener('click', async () => {
  const state = { fullscreen: false, locked: false, errors: [] };
  try { if (document.documentElement.requestFullscreen) { await document.documentElement.requestFullscreen(); state.fullscreen = true; } }
  catch (error) { state.errors.push(`fullscreen:${error.name}`); }
  try { if (screen.orientation?.lock) { await screen.orientation.lock('landscape'); state.locked = true; } }
  catch (error) { state.errors.push(`orientation:${error.name}`); }
  results.displayTest = state; results.viewport = `${innerWidth}x${innerHeight}`; results.orientation = screen.orientation?.type || 'unknown'; update();
});

document.querySelector('#audio-test').addEventListener('click', async () => {
  try {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    await context.resume(); const oscillator = context.createOscillator(); const gain = context.createGain();
    oscillator.type = 'square'; oscillator.frequency.value = 440; gain.gain.value = .04;
    oscillator.connect(gain).connect(context.destination); oscillator.start(); oscillator.stop(context.currentTime + .18);
    results.audioTest = context.state === 'running' ? 'tone-played' : context.state;
  } catch (error) { results.audioTest = `failed:${error.name}`; }
  update();
});

document.querySelector('#share-test').addEventListener('click', async () => {
  try {
    const canvas = document.createElement('canvas'); canvas.width = 320; canvas.height = 320; const context = canvas.getContext('2d');
    context.fillStyle = '#ffd53d'; context.fillRect(0, 0, 320, 320); context.fillStyle = '#111'; context.font = 'bold 28px Arial'; context.textAlign = 'center'; context.fillText('IHFK DEVICE QA', 160, 165);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    const file = new File([blob], 'ihfk-device-qa.png', { type: 'image/png' });
    if (!navigator.share || !navigator.canShare?.({ files: [file] })) throw new Error('FileShareUnsupported');
    await navigator.share({ title: 'IHFK DEVICE QA', text: 'IHFK native file share test', files: [file] });
    results.shareTest = 'share-sheet-completed';
  } catch (error) { results.shareTest = error.name === 'AbortError' ? 'share-sheet-opened-and-cancelled' : `failed:${error.name || error.message}`; }
  update();
});

function drawStressFrame(time) {
  const context = stressContext; context.fillStyle = '#7b8287'; context.fillRect(0, 0, 1080, 640);
  context.fillStyle = '#333'; context.fillRect(0, 555, 1080, 85);
  for (let index = 0; index < 30; index += 1) {
    const x = 20 + (index % 15) * 70; const y = 260 + Math.floor(index / 15) * 145 + Math.sin(time / 180 + index) * 12;
    context.fillStyle = '#111'; context.fillRect(x, y, 58, 112); context.fillStyle = index % 3 ? '#d8d8d8' : '#e64c3c'; context.fillRect(x + 7, y + 8, 44, 82); context.fillStyle = '#ffd53d'; context.fillRect(x + 14, y + 18, 30, 34);
  }
  for (let index = 0; index < 120; index += 1) {
    context.fillStyle = index % 2 ? '#ddd' : '#222'; context.fillRect((index * 83 + time / 4) % 1080, 90 + (index * 47) % 460, 7, 7);
  }
}

document.querySelector('#fps-test').addEventListener('click', () => {
  const samples = []; let previous = performance.now(); const started = previous;
  results.stressFpsAverage = 'running'; results.stressFpsP05 = 'running'; update();
  const frame = time => {
    drawStressFrame(time); const delta = time - previous; previous = time; if (delta > 0 && delta < 250) samples.push(1000 / delta);
    if (time - started < 10000) { requestAnimationFrame(frame); return; }
    const sorted = samples.slice().sort((a, b) => a - b); const average = samples.reduce((sum, value) => sum + value, 0) / Math.max(1, samples.length);
    results.stressFpsAverage = Number(average.toFixed(1)); results.stressFpsP05 = Number((sorted[Math.floor(sorted.length * .05)] || 0).toFixed(1)); update();
  };
  requestAnimationFrame(frame);
});

document.querySelector('#copy-report').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(report.textContent); document.querySelector('#copy-report').textContent = '복사 완료'; }
  catch { document.querySelector('#copy-report').textContent = '복사 실패 — 직접 선택하세요'; }
});

addEventListener('resize', () => { results.viewport = `${innerWidth}x${innerHeight}`; results.orientation = screen.orientation?.type || 'unknown'; update(); });
update();
drawStressFrame(0);
