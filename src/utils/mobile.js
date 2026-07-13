export async function requestLandscape(root = document.documentElement, orientation = globalThis.screen?.orientation) {
  let fullscreen = false;
  let locked = false;
  const ownerDocument = root?.ownerDocument || globalThis.document;
  const fullscreenElement = ownerDocument?.fullscreenElement || ownerDocument?.webkitFullscreenElement;
  try {
    const requestFullscreen = root?.requestFullscreen || root?.webkitRequestFullscreen;
    if (fullscreenElement) {
      fullscreen = true;
    } else if (requestFullscreen) {
      await requestFullscreen.call(root);
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
