# 2026-07-13 Targeting, Scale, Alignment and Factory Follow-up

## Scope

This evidence closes the five screenshot findings from the 2026-07-13 review: clipped title complaint, fist penetration through the front kiosk, weapon character scale drift, pickup/card misalignment, and the factory body being baked into its background.

## Implemented behavior

- The title complaint is reparented from the clipped screen to the kiosk shell and rendered at z-index 80 with its own raster-safe speech tail.
- Fist targeting uses the kiosk physics body, a 78×58 hand-aligned rectangle at `player x + 18` and ground-relative `y - 60`, sorts by forward distance, and damages only the nearest target.
- Bat, chainsaw and shotgun full-character frames render at 2.5×. Their normalized source body is approximately 46px high, giving the same approximately 115px visible-height baseline as the original 23px character at 5×.
- The 80×48 pickup image and 88×52 yellow card share one center. A post-physics callback keeps card and number badge aligned to the moving pickup.
- `assets/background/factory.png` is now a 14-color room-only image. The machine is a separate five-frame 680×576, hard-alpha, shared-16-color sprite sequence with per-stage hit bounds.
- Factory feedback flashes the actual sprite and swaps actual damage textures. No vector crack/screen overlay fields remain.

## Automated verification

```text
npm run check
PASS 24 source modules parsed as ES modules
PASS 45 required runtime assets present
PASS 3 backgrounds are 1080x640, opaque, and at most 16 colors
PASS 28 generated runtime frames use hard alpha, safe bounds, and shared 16-color palettes
PASS 17 runtime evidence captures are exactly 1080x640

npm test
PASS title complaint bubble renders above the unclipped kiosk shell
PASS fist hits only the nearest front target with hand-sized reach
PASS factory room and five raster damage stages are separate runtime images
PASS all pre-existing campaign, mobile-layout, stack-gravity and result groups
```

The browser assertion also verifies all three weapon animation scales equal 2.5, the pickup/card center offset is exactly `(0, 0)`, the card contains the pickup bounds, factory texture keys progress through `factory-v2-1` to `factory-v2-4`, and the collapsed factory hit bounds shrink.

## Visual evidence

- [Complaint in front of the kiosk shell](runtime-title-complaint-front-1080x640.png)
- [Only the front kiosk receives fist damage](runtime-fist-front-target-1080x640.png)
- [Bat visible-height check](runtime-weapon-bat-height-1080x640.png)
- [Chainsaw visible-height check](runtime-weapon-chainsaw-height-1080x640.png)
- [Shotgun visible-height check](runtime-weapon-shotgun-height-1080x640.png)
- [Pickup/card center alignment](runtime-pickup-aligned-1080x640.png)
- [Factory stage 0](runtime-factory-raster-stage0-1080x640.png)
- [Factory stage 3](runtime-factory-raster-stage3-1080x640.png)
- [Factory stage 4](runtime-factory-raster-stage4-1080x640.png)
- [Five-frame factory contact sheet](sprites/factory_damage_v2_preview.png)

## Asset-generation record

One sequential built-in image-generation call was used for the factory damage strip, with `assets/background/factory.png` as the visual reference before it was cleaned. The prompt requested the same right-facing kiosk assembly/launch machine in five progressive damage states, no environment, text, logo or UI, on uniform magenta. Raw chroma and alpha sources are preserved under `assets/factory/source/`. `python scripts/build_factory_assets.py` performs deterministic background cleanup, frame extraction, shared-scale anchoring, nearest-neighbor processing, shared-palette quantization and contact-sheet creation.

## Known limitations

- A continuously animating 60fps WebGL scene can be captured mid-swap by headless screenshots. The chainsaw evidence was captured after the completed frame was frozen; live rendering itself remained intact.
- Physical Android/iOS touch, audio-unlock and native-share gates remain outside this desktop follow-up.
