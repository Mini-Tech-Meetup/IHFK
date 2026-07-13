# 2026-07-13 Completion Audit

## Decision

The implementation is not yet eligible for `검증 완료` or Goal completion. Automated coverage, raster evidence, browser emulation, and remote CI are green, but the specification explicitly requires physical Android/iOS behavior, native share/audio policy confirmation, human campaign timing, and a post-merge Pages check. Those claims cannot be proven by desktop emulation.

## Authoritative current state

- Mobile-menu implementation commit: `80e4613becfd4108238d2f09ef7cd00f4c9eb41d` on `codex/ihfk-phaser4-refactor`.
- Original rebuild PR [#1](https://github.com/Mini-Tech-Meetup/IHFK/pull/1) is merged. Follow-up Draft PR [#2](https://github.com/Mini-Tech-Meetup/IHFK/pull/2) targets `main` with the mobile fullscreen/menu fix.
- Remote run [29259531774](https://github.com/Mini-Tech-Meetup/IHFK/actions/runs/29259531774) validates PR #2; final status is tracked by the PR check.
- Local proof: `npm run check` PASS; `npm test` PASS; 37 browser unit tests, 15 responsive/E2E groups, and 6 cross-browser environments.
- GitHub Pages is built from `main` `/` with HTTPS; PR #2 is intentionally not public until merged.
- Worktree is clean except for the user-owned untracked `Super Strong Normal Guy (1).zip`, which is outside the implementation and must remain untouched.

## Requirement-by-requirement audit

| SPEC | Proven now | Evidence still required before `검증 완료` |
|---|---|---|
| 00 Foundation | Phaser 4 boot, WebGL, relative subpath, asset failure and browser matrix | Physical Android Chrome and iOS Safari boot |
| 01 Title/i18n | 10/10 key completeness, fallback, desktop containment, localized share cards, 844×390 two-row language menu and guide containment | Physical-device font rendering and clipping pass in all 10 locales |
| 02 Input/mobile | Shared input state, immediate click/tap weapon selection, disabled empty slots, touch HUD, portrait fallback, gesture-first fullscreen/WebKit fallback, thin scrollable landscape menu, Android/iPhone emulation | Android fullscreen/landscape request, iOS manual rotation, real touch controls |
| 03 Player/intro | 27 transform frames, 10-locale containment, resize-safe world→DOM speech tail within 2 px at 516×288/844×390/1080×640, timer boundary | Mobile audio unlock at the Game Start gesture |
| 04 Combat/weapons | DPS order, durability, targets, hitboxes, animation height, destruction feedback | Real touch-hold feel observation; no known correctness defect |
| 05 Fast-food | Auto first break, manual second break, GO and exit transition | Physical touch exit traversal |
| 06 Street | 25 goal, fall/stack physics, active cap, emulated 15-unit performance | Target-device 12/15-unit FPS report |
| 07 Factory/endless | 5-stage raster damage, depth, 5,000 HP, endless scaling, emulated 30-unit performance | Target-device 30-unit endless FPS report |
| 08 Result/share | Exact button-free 1080×640 Result card, preview/export identity, canonical Pages URL in Canvas/native payload/clipboard fallback | Native PNG share sheet or documented cancellation on both platforms |
| 09 Art/audio | Palette/alpha validators, screenshots, moving clouds, nine SFX routes, louder title-onward MIDI scheduling | Audible music/SFX/mute confirmation on both devices |
| 10 Integration | 37/37 unit, 15/15 responsive/E2E and 6/6 browser matrix, zero known P0/P1, 3-run collector boundary proof | Three unaccelerated human runs per platform, combined target average, physical reports, post-merge Pages smoke |

The score threshold is already met provisionally (90.5 overall and every SPEC at least 85), but status and evidence gates are conjunctive. A score cannot replace missing physical proof.

## Exact external closeout procedure

Perform this once on Android Chrome and once on iOS Safari from the same deployed or LAN-served origin:

1. Open `/qa/device.html` in landscape.
2. Run actions 1–4 and copy the device report.
3. Run action 5 and copy the real campaign-15 FPS report.
4. Run action 6 and copy the real endless-30 FPS report.
5. Run action 7, finish three unaccelerated campaigns, and copy the timing JSON.
6. During the campaigns, verify joystick, jump, hold attack, slots 1–4, mute, stage exit, all 10 language screens, and absence of clipped text.
7. Paste all observations and JSON into `DEVICE_QA_TEMPLATE.md`.
8. If both platform reports pass and the human timing target is met, merge the current follow-up PR #2 and repeat boot, campaign result, share fallback, and endless entry on the public Pages URL.

Any failure is a product finding and must be logged with device, OS/browser version, reproduction steps, screenshot, and severity before the corresponding SPEC is rescored.

## Blocker classification

P0: 0 known. P1: 0 known. The remaining items are P3 evidence gaps requiring physical devices, human play, or the post-merge public URL. No additional local code or desktop automation can truthfully substitute for those observations.
