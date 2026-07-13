# 2026-07-13 DPS and Share-card Follow-up

## Scope

This follow-up adds visibly destroyed kiosks to the shared result PNG and gives fist, bat, chainsaw and shotgun distinct target profiles with measured kiosk/factory DPS. No new image generation was used; the shipping `kiosk-v2-4` raster is reused.

## DPS balance

| Slot | Weapon | Kiosk DPS | Factory DPS | Target profile | Limitation |
|---:|---|---:|---:|---|---|
| 1 | Fist | 120 | 120 | nearest one | unlimited, shortest reach |
| 2 | Bat | 211.1 | 144.4 | every target in the wide swing | 10 uses per pickup |
| 3 | Chainsaw | 160 | 140 | nearest one, 20 ticks/s | 4 seconds of fuel |
| 4 | Shotgun | 400 | 280 | up to three targets at long range | 6 shells per pickup |

Every consumable weapon exceeds fist DPS for both kiosks and the factory. The full-reserve factory estimate remains 35.6 seconds, inside the 35–45 second campaign target.

## Share-card composition

`ShareCardService` draws the room-only factory background, collapsed factory sprite, three rotated copies of the final destroyed kiosk raster, the strong character, then the localized time/count typography. The destroyed kiosks occupy the lower playfield and do not overlap the result text block.

## Verification

```text
npm run check
PASS share-card evidence capture is exactly 1080x1080

npm test
PASS browser unit suite (32 passed, 0 failed)
PASS fist/weapon target profile browser assertion: 1 / all / 1 / 3
PASS all existing campaign, factory, mobile-layout and result groups
```

- [1080×1080 share-card evidence](runtime-share-card-broken-kiosks-1080x1080.png)
- Console/page errors while rendering `/qa/share-card.html`: 0
- Card canvas: exactly 1080×1080, image smoothing disabled

## Known limitation

Native Web Share file-sheet behavior still requires Android/iOS physical-device evidence under SPEC-08 and SPEC-10.
