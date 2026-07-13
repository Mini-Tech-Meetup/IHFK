# 2026-07-13 Weapon Click/Tap and Share URL

## Scope

- Make every visible weapon slot a real click/tap control.
- Show why an unavailable weapon cannot be selected.
- Put the canonical public game link in every share path.

## Implementation

- `InputController` keeps one active controller for the current gameplay scene. Mobile weapon `pointerdown` events immediately call the same `GameSession.selectWeapon()` rule used by keyboard input, avoiding delayed or suppressed synthesized clicks on physical touch browsers.
- `Hud` renders desktop weapon slots as semantic buttons and routes pointer input through `InputController.queueWeapon()`.
- Mobile and desktop weapon buttons expose `aria-disabled` and visual desaturation when empty without using the native `disabled` property, so a stale render can never swallow the first input after pickup. Pickup and successful selection synchronously refresh both weapon surfaces.
- `GAME_URL` is fixed to `https://mini-tech-meetup.github.io/IHFK/`. `ShareCardService` draws it into the exported Canvas, sends it as the Web Share URL, and appends it to the clipboard fallback instead of leaking localhost, query parameters, or preview routes.

## Automated Proof

- Browser unit suite: 37/37. The HUD test presses the bat slot, observes the selected state, and verifies the unavailable chainsaw state. The fallback share test verifies one PNG download and clipboard text ending in the exact canonical URL.
- Responsive/E2E suite: 16/16. A real Arcade Physics pickup is collected before pointer selection is exercised on both the desktop HUD and mobile controls (`fist → bat → fist → bat`). Result sharing separately stubs native Web Share and asserts the exact URL plus the PNG file payload.
- Cross-browser suite: 6/6. Android Chromium and iPhone WebKit emulation use real DOM taps to select the available bat before attacking.

## Visual Proof

- [iPhone landscape bat selected; empty chainsaw/shotgun disabled](runtime-webkit-iphone-touch-932x430.png)
- [Exact 1080×640 shared Canvas with canonical URL](runtime-result-share-surface-1080x640.png)
- [On-screen Result using the same Canvas](runtime-result-share-surface-screen-1080x640.png)

## Known Limitation

The native operating-system share sheet still requires physical Android/iOS confirmation. Automated coverage proves the browser payload and fallback clipboard/download content before that external UI boundary.

## 2026-07-14 Regression Fix

The first implementation only proved selection in the first FastFood scene. On the next gameplay scene, the broad `[data-weapon]` binding selector also matched `<body data-weapon="fist">`. A weapon-button pointer event selected the requested weapon and then bubbled to the body listener, which immediately selected the previous body value (`fist`) again. The selector is now restricted to `#weapon-buttons button[data-weapon]`, and both mobile and desktop handlers stop propagation.

The regression test now crosses `FastFood → Street`, collects a real Arcade Physics pickup, asserts that only the four mobile buttons are input-bound, and exercises both visible control surfaces (`fist → bat → fist → bat`).
