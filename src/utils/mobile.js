export async function requestLandscape(root = document.documentElement, orientation = globalThis.screen?.orientation) {
  let fullscreen = false;
  let locked = false;
  try {
    if (root?.requestFullscreen) {
      await root.requestFullscreen();
      fullscreen = true;
    }
  } catch {}
  try {
    if (orientation?.lock) {
      await orientation.lock('landscape');
      locked = true;
    }
  } catch {}
  return { fullscreen, locked };
}

export function safePlayerSpawn(requestedX, touchDevice = false) {
  return touchDevice ? Math.max(230, requestedX) : requestedX;
}
