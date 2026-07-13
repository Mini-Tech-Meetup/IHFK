# 2026-07-13 Result Share Surface Follow-up

## User feedback addressed

- The visible Result content itself is now the shared PNG.
- The Retry, Keep Breaking and Share buttons remain below that surface and are never rasterized into it.
- The left poster retains the character, destroyed factory, two intact kiosks and one broken kiosk, but no longer repeats time or destroyed count.
- Time and destroyed count appear once in the right receipt.
- The Korean completion title is exactly `키오스크 개뿌수기 완료`; the other nine locales carry the same kiosk-smashing meaning.
- The street campaign goal is reduced from 50 to 25.

## Architecture

`ShareCardService.createCanvas()` produces one opaque, pixel-smoothed-disabled 1080×640 Canvas. `ResultScene` creates it once, converts that exact object to the on-screen data URL, and passes the same object to Web Share/download. The DOM only supplies the three actions beneath the preview, so preview and export cannot diverge and buttons cannot leak into the image.

## Verification

- Canvas natural size: 1080×640 in all ten locales.
- Loaded character, factory, intact kiosk and destroyed kiosk rasters are sampled at their expected poster positions.
- E2E requires every result action button to begin at or below the shared image bottom edge.
- The same containment and non-overlap assertion passes after resizing to 844×390 landscape.
- PNG fallback still returns `downloaded` and preserves clipboard text fallback.
- Current captures: [raw share surface](runtime-result-share-surface-1080x640.png), [screen with separate buttons](runtime-result-share-surface-screen-1080x640.png).
- The earlier 1080×1080 evidence remains as historical evidence only and is not the shipping share format.
