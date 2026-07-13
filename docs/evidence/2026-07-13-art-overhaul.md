# UI and asset overhaul evidence — 2026-07-13

## Trigger findings

- Canvas-only Arial rectangles read as an unfinished prototype rather than a deliberate C-grade game UI.
- Intro transformation incorrectly played three trailing stray-pixel cells and used a center origin instead of a bottom anchor.
- Run and fist animation counts were inferred instead of inspecting populated cells.
- Weapons were geometric overlays without body animation.
- Kiosks were generated at runtime from rectangles and were visually worse than the legacy five-frame strip.
- Landed kiosks still received horizontal velocity on hit.
- Factory hits lacked per-hit screen, flash, spark and recoil feedback.

## Accepted corrective direction

- DOM kiosk-shell menu, guide, credits, HUD and result UI with CSS variables and responsive landscape layout.
- Existing character source frames audited and populated-cell counts locked in Boot.
- Raster kiosk and three full-character weapon animation strips generated and normalized.
- Lit kiosk screen with hit flicker, increased broken-state flicker and final rapid shutdown.
- Faster 5,200 px/s² kiosk fall gravity, roughly 1.07 s observed landing time and immovable landed bodies.
- Factory per-hit flash/screen/sparks, threshold break bursts and final component debris.

## Evidence

- Full image manifest and per-file decisions: [ASSET_QA.md](../ASSET_QA.md)
- Sprite previews: [`sprites/`](sprites/)
- Automated asset gate: `scripts/check_sprite_assets.py`

## Status

Representative title, guide, transform, weapon, kiosk, factory, result, endless and mobile-forced screens were reviewed in-engine. Physical Android/iOS and final listening evidence remain release gates; see [polish validation](2026-07-13-polish-validation.md).
