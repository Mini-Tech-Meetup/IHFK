# 2026-07-13 Early Music, Impact and Dialogue Audio

## User feedback addressed

- BGM is louder.
- BGM begins before Game Start: the Language scene marks music as wanted, and the first language-selection click unlocks WebAudio and starts the loop before Title renders.
- Retry starts the loop immediately when returning to the intro cutscene.
- Every actual kiosk or factory damage call emits a substantially longer, louder, low-frequency two-layer hit instead of the previous quiet 35 ms click.
- Every title complaint and intro dialogue bubble emits one short dialogue cue when the line appears.

Browsers prohibit audible autoplay before a user gesture. Therefore the earliest reliable start is the first language button click; no fake silent autoplay or repeated permission prompt is used.

## Mix changes

| Voice | Previous | Current |
|---|---:|---:|
| BGM root | 0.018 | 0.032 |
| BGM octave | 0.009 | 0.016 |
| BGM lead | 0.012 | 0.021 |
| BGM kick | 0.050 | 0.075 |
| Hit low body | 95 Hz square, 35 ms, 0.025 | 68 Hz sine, 90 ms, 0.080 |
| Hit knock | none | 108 Hz square, 55 ms, 0.040 |

Pitch randomization remains ±10% so rapid fist and chainsaw hits do not become one static digital buzz.

## Verification

- Browser unit test checks that the louder loop still schedules square, sawtooth, and sine layers and reaches a 0.075 peak voice.
- All nine SFX names produce oscillator voices.
- The hit cue must emit exactly two voices below 130 Hz nominal on every call.
- A DOM test renders one title complaint and one intro line and requires exactly two dialogue cues.
- Existing Kiosk and Factory damage paths call `sfx('hit')` before their damage-state transition, so every accepted damage tick is covered; destruction additionally retains its break/factory cue.
- Subjective loudness and mobile speaker balance remain part of the physical-device listening gate.
