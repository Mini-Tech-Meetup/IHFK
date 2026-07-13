# 2026-07-13 DPS and Share-card Follow-up

## Scope

This follow-up gives fist, bat, chainsaw and shotgun a strict DPS ladder, restores the legacy B/menu screen identity to the kiosk rasters, verifies the synthesized audio routes, and composes two intact plus one destroyed kiosk into the shared result PNG. No new image generation was used.

## DPS balance

| Slot | Weapon | Kiosk DPS | Factory DPS | Target profile | Limitation |
|---:|---|---:|---:|---|---|
| 1 | Fist | 120 | 120 | nearest one | unlimited, shortest reach |
| 2 | Bat | 211.1 | 138.9 | every target in the wide swing | 10 uses per pickup |
| 3 | Chainsaw | 240 | 160 | nearest one, 20 ticks/s | 4 seconds of fuel |
| 4 | Shotgun | 400 | 240 | up to three targets at long range | 6 shells per pickup |

Both target types now satisfy `fist < bat < chainsaw < shotgun`. The full-reserve factory estimate remains 35.4 seconds, inside the 35–45 second campaign target.

## Kiosk screen identity

- Stage 0: large yellow legacy `B`, header line, four menu tiles and a bottom action bar.
- Stages 1–2: the same UI remains underneath the original crack mask.
- Stage 3: only UI fragments survive.
- Stage 4: screen is blacked out.
- The enhancement uses only the existing shared 16-color palette and hard alpha. `scripts/enhance_kiosk_screens.py` rebuilds all five frames and the preview without image generation.

## Share-card composition

`ShareCardService` draws the room-only factory background, collapsed factory sprite, two rotated intact B/menu kiosks, one central destroyed kiosk, the strong character, then the localized time/count typography. The kiosks occupy the lower playfield and do not overlap the result text block.

## Audio present in the current build

- Music: fast 115ms-step square/saw/sine synthesized MIDI-rock loop, started after the transformation cutscene and stopped on factory destruction.
- Effects: hit, kiosk break, weapon pickup, shotgun, chainsaw, kiosk landing, weapon break and factory explosion.
- Browser unlock: requested by the Game Start click; `M` and the mobile music button toggle mute.
- The unit suite asserts that all eight effect names schedule at least one WebAudio voice.

## Verification

```text
npm run check
PASS share-card evidence capture is exactly 1080x1080

npm test
PASS browser unit suite (34 passed, 0 failed)
PASS fist/weapon target profile browser assertion: 1 / all / 1 / 3
PASS all existing campaign, factory, mobile-layout and result groups
```

- [1080×1080 share-card evidence](runtime-share-card-broken-kiosks-1080x1080.png)
- [1080×640 in-game B/menu kiosk evidence](runtime-kiosk-menu-ui-1080x640.png)
- Console/page errors while rendering `/qa/share-card.html`: 0
- Card canvas: exactly 1080×1080, image smoothing disabled

## Known limitation

Native Web Share file-sheet behavior still requires Android/iOS physical-device evidence under SPEC-08 and SPEC-10.
