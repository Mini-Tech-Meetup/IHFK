# IHFK Runtime Asset QA

## Mandatory gate for every future image

No raster asset may be referenced by Boot or UI code until all five checks pass:

1. Open the source image directly and inspect subject, silhouette, palette and unintended content.
2. Record exact dimensions, mode, frame grid and populated/empty cells.
3. Extract or normalize every animation frame with one shared scale and bottom-center anchor.
4. Inspect every final frame individually plus a complete preview sheet; reject edge clipping, drift, empty cells and accidental artifacts.
5. Verify the asset in-engine at shipping scale with a representative screenshot and rerun `npm run check`.

Generated pixel assets additionally require a shared palette of at most 16 opaque colors and alpha values restricted to 0/255.

## Existing character source audit

| Source | Grid finding | Runtime decision |
|---|---|---|
| Normal Guy Idle, 45×60 | 3×3, 9 populated 15×20 cells | use frames 0–8 |
| Normal Guy Walk, 30×40 | 2×2 grid with six sequential 15×20 cells across source layout | inspected, not currently loaded |
| Normal Guy Air, 15×20 | one populated frame | inspected, not currently loaded |
| Normal Guy Drinks, 60×60 | 4×3, 12 populated 15×20 cells | inspected, not currently loaded |
| Normal Guy Transforms, 145×150 | 5×6 grid of 29×25 cells; frames 0–26 match the supplied GIF pixel-for-pixel, cells 27–29 are empty | use frames 0–26, bottom-origin in Intro |
| Strong Guy Idle, 36×23 | 2 populated 18×23 cells | use both frames |
| Strong Guy Runs, 54×72 | 3×3; 8 populated 18×24 cells, last cell empty | use frames 0–7 only |
| Strong Guy Jumps, 19×21 | one populated frame | use real jump texture |
| Strong Guy Falls, 24×22 | one populated frame | use real fall texture |
| Strong Guy Attacks Without Repeats, 108×96 | 4×4; 15 populated 27×24 cells, last cell empty | use frames 0–14 at 60 fps |
| Strong Guy Air Attack, 56×46 | 2×2, 4 populated 28×23 cells | inspected, excluded from current control scope |
| Strong Guy Dies, 90×96 | 3×4, 12 frames | inspected, excluded because the game has no death |
| Thumbnail, 756×600 | reference illustration | style/identity reference only |

Source previews live in `docs/evidence/sprites/`.

## Environment and legacy audit

| Asset | Finding | Decision |
|---|---|---|
| fastfood.png | 1080×640, 16 colors, opaque | retain |
| street.png | 1080×640, 15 colors, opaque | retain |
| factory composite v1 | 1080×640, 16 colors, opaque, factory body baked into room | preserve under `assets/factory/source/`; do not load at runtime |
| factory.png | 1080×640, 14 colors, opaque, room/background only | runtime background; factory body is a separate image |
| legacy kiosk.png | 340×128, five readable 68×128 damage cells but overly simple | reference only; replaced by v2 raster frames |
| legacy shop.png | 304×180 low-resolution store strip | reference only |
| legacy start/credit/bubble assets | readable original C-grade type but incomplete UI hierarchy | visual reference only; replaced by themed DOM UI |
| legacy credit portraits | inspected, not required by current credit surface | reference only |

## Generated v2 runtime assets

Built-in `imagegen` was used with the legacy kiosk, original strong-guy attack art, character thumbnail and current environment as references. Raw chroma-key sources are preserved under each asset's `source/` directory.

| Asset | Final frames | Gate result |
|---|---:|---|
| kiosk damage v2 | 5 × 128×128 | each frame inspected; bottom-centered; safe horizontal/top margins; shared 16-color palette; hard alpha |
| baseball-bat attack v2 | 6 × 64×64 | each frame inspected; safe margins; shared 16-color palette; hard alpha |
| chainsaw attack v2 | 6 × 64×64 | initial edge contact rejected; all frames inset to 90%; reinspected; shared 16-color palette; hard alpha |
| shotgun attack v2 | 6 × 64×64 | each frame inspected; recoil/muzzle/casing readable; safe margins; shared 16-color palette; hard alpha |
| factory damage v2 | 5 × 680×576 | all five frames inspected individually; shared bottom-center anchor; normal → damaged → collapsed progression; shared 16-color palette; hard alpha |

Final previews:

- `docs/evidence/sprites/kiosk_damage_v2_preview.png`
- `docs/evidence/sprites/bat_v2_preview.png`
- `docs/evidence/sprites/chainsaw_v2_preview.png`
- `docs/evidence/sprites/shotgun_v2_preview.png`
- `docs/evidence/sprites/factory_damage_v2_preview.png`

## Image-generation prompt record

- Kiosk: one horizontal five-slot strip, same fast-food self-service kiosk from pristine through blackened destruction; visible screen/card reader/receipt slot/pedestal; deliberate finished C-grade pixel art; uniform `#ff00ff` chroma background; no text or logo.
- Bat: one horizontal six-slot full-character strip; ready, backswing, swing, impact arc, overswing, recovery; exact strong-guy identity and right-facing direction; uniform `#ff00ff` chroma background.
- Chainsaw: one horizontal six-slot full-character strip; brace, pullback, thrust, contact sparks, vibration, recovery; stable red/gray chainsaw and right-facing character; uniform `#ff00ff` chroma background.
- Shotgun: one horizontal six-slot full-character strip; aim, fire, muzzle flash, recoil, pump/casing, re-aim; stable short shotgun and right-facing character; uniform `#ff00ff` chroma background.
- Factory: one horizontal five-slot strip derived from the existing factory composite; same right-facing kiosk assembly/launch machine from intact through crushed wreckage; no room, wall, floor, text, logo or UI; uniform `#ff00ff` chroma background.

The factory follow-up used exactly one sequential built-in image-generation call. It was chroma-removed locally, split into five connected subjects, normalized with one shared scale and bottom-center anchor, quantized as one animation, and inspected frame-by-frame. No parallel generation or variant retry was used.
