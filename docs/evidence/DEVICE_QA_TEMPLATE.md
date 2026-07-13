# Device QA report template

Open `/qa/device.html` from the same deployed origin as the game. Run all four buttons, both real-game stress links, and the three-run playtest link on each target device. Paste the device JSON, both stress reports, and copied timing report below. The page stores and transmits nothing.

## Android Chrome

- Device / OS:
- Browser version:
- Game controls: pass / fail
- Portrait overlay then landscape play: pass / fail
- Campaign 15 report:
- Endless 30 report:
- Human campaign times (at least 3):
- Three-run timing JSON:
- Notes:

```json
paste device report here
```

## iOS Safari

- Device / OS:
- Browser version:
- Manual rotation fallback: pass / fail
- Game controls: pass / fail
- Campaign 15 report:
- Endless 30 report:
- Human campaign times (at least 3):
- Three-run timing JSON:
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
- [ ] Actual campaign 15-kiosk stress records average and 5th-percentile FPS.
- [ ] Actual endless 30-kiosk stress records average and 5th-percentile FPS.
- [ ] The actual game joystick, jump, hold attack, weapon 1–4 and mute controls pass.
- [ ] At least three human campaign completions per target platform are recorded; combined average is 2:30–3:30.
- [ ] The `?playtest` report lists the same three observed completion times without duplicate result entries.
