# 2026-07-13 Weapon Click/Tap and Share URL

## Scope

- Make every visible weapon slot a real click/tap control.
- Show why an unavailable weapon cannot be selected.
- Put the canonical public game link in every share path.

## Implementation

- `InputController` keeps one active controller for the current gameplay scene. Mobile weapon button `click` events queue normalized weapon input and immediately call the same `GameSession.selectWeapon()` rule used by keyboard input.
- `Hud` renders desktop weapon slots as semantic buttons and routes them through `InputController.queueWeapon()`.
- Mobile and desktop weapon buttons become disabled and visually desaturated when their reserve is empty; adding a pickup re-enables the button on the next HUD update.
- `GAME_URL` is fixed to `https://mini-tech-meetup.github.io/IHFK/`. `ShareCardService` draws it into the exported Canvas, sends it as the Web Share URL, and appends it to the clipboard fallback instead of leaking localhost, query parameters, or preview routes.

## Automated Proof

- Browser unit suite: 37/37. The HUD test clicks the bat slot, observes the selected state, and verifies that an empty chainsaw is disabled. The fallback share test verifies one PNG download and clipboard text ending in the exact canonical URL.
- Responsive/E2E suite: 15/15. Result sharing stubs native Web Share and asserts the exact URL plus the PNG file payload.
- Cross-browser suite: 6/6. Android Chromium and iPhone WebKit emulation use real DOM taps to select the available bat before attacking.

## Visual Proof

- [iPhone landscape bat selected; empty chainsaw/shotgun disabled](runtime-webkit-iphone-touch-932x430.png)
- [Exact 1080×640 shared Canvas with canonical URL](runtime-result-share-surface-1080x640.png)
- [On-screen Result using the same Canvas](runtime-result-share-surface-screen-1080x640.png)

## Known Limitation

The native operating-system share sheet still requires physical Android/iOS confirmation. Automated coverage proves the browser payload and fallback clipboard/download content before that external UI boundary.
