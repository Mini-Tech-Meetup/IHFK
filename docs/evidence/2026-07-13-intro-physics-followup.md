# Intro, exit and kiosk-physics follow-up — 2026-07-13

## Scope

This pass addresses the reported clipped dialogue, intro staging, incorrectly sliced transformation, placeholder exit text, falling-kiosk/player collision and stacked-kiosk gravity.

## Source-frame verification

- The transformation sheet is exactly `145×150`, which is a `5×6` grid of `29×25` cells.
- The supplied GIF is exactly `29×25` with 27 frames.
- `scripts/check_sprite_assets.py` compares sheet cells `0–26` against GIF frames `0–26` pixel-for-pixel and verifies cells `27–29` are empty.
- Runtime animation registration uses `frameWidth: 29`, `frameHeight: 25`, frames `0–26`.
- All 27 corrected extracted cells are preserved under `docs/evidence/sprites/frames-normal_transform/`.

## Automated gates

- `npm run check`: PASS — source/import/static/locale/SPEC gates and all raster gates, including 27/27 transform frame equality.
- Browser unit suite: PASS — 29 passed, 0 failed.
- `npm test`: PASS — 9 browser groups, including intro positioning, all-locale bubble containment, GO reveal, falling impact, support removal, Android/iPhone landscape, portrait fallback and Result containment.
- Browser console errors: 0.

## Measured runtime evidence

- Intro hero/kiosk center distance: 135 px.
- Intro transform animation: 27 runtime frames.
- All ten localized `intro2` strings fit inside both the bubble panel and 1080×640 viewport.
- Player physics body: `42×88`; kiosk physics body: `62×133` at runtime scale.
- A centered falling kiosk produced player velocity `(-334, -210)` on impact.
- A stacked kiosk rested at y `367.6` without being ground-locked. After the supporting kiosk was destroyed, it fell 133.4 px and ground-locked at y `501.0`.
- Grounded kiosks retain zero horizontal attack velocity.

## Visual evidence

- [Normal intro dialogue](runtime-intro-dialogue-1080x640.png): bubble tail is centered over the character, panel is fully visible, and the character/kiosk gap is deliberately small.
- [Corrected transformation](runtime-intro-transform-1080x640.png): the burst frames render without row mixing or cropping.
- [Fast-food GO state](runtime-fastfood-go-1080x640.png): no pre-clear `LOCK` label is used; the designed yellow `GO` hardware sign appears only after clear.

## Known limitations

- Physical Android/iOS touch, audio-unlock and native-share evidence remains a release gate.
- No new generated image was used in this pass; the limited image-generation budget was preserved.

P0: 0, P1: 0.
