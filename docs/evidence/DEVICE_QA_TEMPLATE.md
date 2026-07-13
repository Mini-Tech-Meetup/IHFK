# Device QA report template

Open `/qa/device.html` from the same deployed origin as the game. Run all four buttons on each target device and paste the copied JSON below. The page stores and transmits nothing.

## Android Chrome

- Device / OS:
- Browser version:
- Game controls: pass / fail
- Portrait overlay then landscape play: pass / fail
- Notes:

```json
paste device report here
```

## iOS Safari

- Device / OS:
- Browser version:
- Manual rotation fallback: pass / fail
- Game controls: pass / fail
- Notes:

```json
paste device report here
```

## Acceptance

- [ ] Android fullscreen request succeeds or produces a usable fallback.
- [ ] Android landscape lock succeeds or manual landscape remains usable.
- [ ] iOS Safari starts without an exception when fullscreen/orientation APIs are absent or rejected.
- [ ] Audio reports `tone-played` after the user gesture.
- [ ] Native share reports `share-sheet-completed` or `share-sheet-opened-and-cancelled`.
- [ ] 30-kiosk stress test records average and 5th-percentile FPS.
- [ ] The actual game joystick, jump, hold attack, weapon 1–4 and mute controls pass.
