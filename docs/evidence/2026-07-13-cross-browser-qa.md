# 2026-07-13 Cross-browser QA

## Scope

The compatibility gate now runs a real WebGL gameplay smoke across four desktop engines and two landscape mobile emulations. This supplements, but does not replace, the Android/iOS physical-device gate.

## Matrix

| Environment | Runtime path | Verified behavior |
|---|---|---|
| Chrome stable 150.0.7871.101 | installed Chrome channel | WebGL boot, keyboard movement, Space hold attack, Result preview |
| Playwright Chromium 149 `/IHFK/` | bundled Chromium | same desktop flow through Pages-equivalent subpath |
| Firefox 151 | bundled Firefox | same desktop flow |
| WebKit 26.5 | bundled WebKit | same desktop flow |
| Android Chromium emulation 844×390 | touch + Android UA | touch menu/input plus 15-unit campaign stress |
| iPhone WebKit emulation 932×430 | touch + iPhone UA | touch menu/input plus 30-unit endless stress |

Every desktop run asserts the Phaser renderer is WebGL and the internal canvas is exactly 1080×640. Every mobile run uses real DOM tap events rather than directly mutating `InputController` state, fills the requested active kiosk cap, and samples 1.2 seconds of animation frames.

## Automation

`scripts/cross_browser_tests.mjs` owns the matrix. `npm test` runs the original 34 browser unit tests and 13 responsive/E2E groups first, then the six-environment cross-browser smoke. GitHub Actions installs Chromium, Firefox and WebKit before running the same command.

The two stress routes wait until their exact cap is active, collect 10 seconds of real Phaser frame samples, then show a kiosk-styled report overlay with timestamp, user agent, viewport, DPR, mode, cap, average FPS and p05 FPS. The report can be copied without leaving the game. Automation forces the completion boundary after independently sampling FPS so the overlay and JSON shape are regression-tested without adding 20 seconds to every CI run.

```text
PASS Chrome stable WebGL boot, keyboard, hold attack, and result preview
PASS Playwright Chromium /IHFK/ WebGL boot, keyboard, hold attack, and result preview
PASS Firefox WebGL boot, keyboard, hold attack, and result preview
PASS WebKit WebGL boot, keyboard, hold attack, and result preview
PASS Android Chromium emulation touch input and 15-unit Factory stress avg 61.5 / p05 59.5 FPS
PASS iPhone WebKit emulation touch input and 30-unit Endless stress avg 61.3 / p05 33.3 FPS
```

## Visual evidence

- [Firefox Result at 1080×640](runtime-firefox-result-1080x640.png)
- [WebKit Result at 1080×640](runtime-webkit-result-1080x640.png)
- [iPhone WebKit touch gameplay at 932×430](runtime-webkit-iphone-touch-932x430.png)
- [Android Chromium 15-unit campaign stress at 844×390](runtime-chromium-android-stress-844x390.png)
- [iPhone WebKit 30-unit endless stress at 932×430](runtime-webkit-iphone-stress-932x430.png)

## Remaining physical-device gate

Headless WebKit is not evidence of iOS Safari fullscreen, manual rotation, native file sharing or hardware audio unlock. Android emulation likewise cannot prove actual orientation locking, native share UI or physical-device FPS. Those remain open and must be captured through `/qa/device.html` on physical devices. The QA page now links directly to distinct `previewStress=15` campaign and `previewStress=30` endless presets.
