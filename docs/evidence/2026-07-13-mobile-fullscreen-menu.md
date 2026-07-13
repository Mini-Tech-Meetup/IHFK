# 2026-07-13 Mobile Fullscreen and Landscape Menu

## Scope

- Request fullscreen and landscape lock from the supported mobile Game Start tap.
- Keep all menu choices reachable when browser chrome leaves a short landscape viewport.
- Reduce the kiosk frame thickness without removing its hardware identity.

## Implementation

- `TitleScene.startGame()` starts fullscreen/orientation and audio-unlock promises synchronously from the same click handler. The fullscreen request is created first, before any awaited work can consume user activation.
- `requestLandscape()` supports standard and `webkitRequestFullscreen`, accepts an already-active fullscreen document, and preserves the non-throwing orientation fallback.
- Menu pages use `touch-action:pan-y`, independent `overflow-y:auto`, contained overscroll and momentum scrolling. Gameplay retains `touch-action:none`.
- The short-landscape breakpoint uses a 6 px outer border, 4 px bezel, compact hardware strip, five-column language selector, three-column guide, safe-area-aware sizing and `100dvh`.

## Automated Proof

- `npm run check`: PASS; the raster validator locks both new captures to 844×390.
- Browser unit suite: 37/37, including standard fullscreen, WebKit fullscreen and denied/missing API paths.
- Responsive/E2E suite: 15/15. The mobile menu test verifies 10 language controls, `overflow-y:auto`, `touch-action:pan-y`, no more than 36 px horizontal frame depth, viewport containment, the final language, the guide Game Start button, and a fullscreen call made from the start gesture.
- Cross-browser matrix: 6/6 environments after the change.

## Visual Proof

- [844×390 language selector](runtime-mobile-menu-landscape-844x390.png)
- [844×390 guide and Game Start](runtime-mobile-guide-landscape-844x390.png)

Both captures retain the kiosk brand/status/hardware language while giving the screen most of the available landscape area. The ten languages are visible as two rows and the guide fits its three input groups plus both actions.

## Known Limitation

Browser policy still controls whether fullscreen and orientation lock are granted. Android Chrome and iOS Safari physical-device confirmation remains open; rejected or unsupported requests continue into the game with the existing manual-rotation overlay/fallback.
