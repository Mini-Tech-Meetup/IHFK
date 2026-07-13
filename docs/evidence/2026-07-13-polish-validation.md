# UI, sprite, physics and factory validation — 2026-07-13

## Scope

This pass validates the post-prototype overhaul requested for the kiosk UI, transformation strip, full-character weapon animations, raster kiosk damage, faster falling physics and factory hit feedback.

## Automated gates

- `npm run check`: PASS — 24 modules, 40 runtime assets, nine static deliverables, 10 locales/25 keys, 11 SPEC documents, three opaque 1080×640 backgrounds, 23 generated hard-alpha animation frames and three derived pickup sprites.
- Browser suite at `/tests/`: PASS — 29 passed, 0 failed.
- Python sprite helpers: PASS — every helper compiles.
- `git diff --check`: PASS; only Git's existing LF/CRLF notices were emitted.

## Visual and animation inspection

- Every populated source cell was extracted and inspected. Transform uses animation positions 1–22 only; the three trailing stray-pixel cells are excluded.
- Strong run uses eight populated cells; fist uses all fifteen populated cells.
- Bat, chainsaw and shotgun use six full-character 64×64 hard-alpha frames each. Isolated rear-generation debris was removed while front sparks, muzzle flash and casing were retained.
- Weapon drops now use weapon-only 80×48 hard-alpha raster sprites derived from those approved frames instead of prototype color rectangles.
- Raster kiosk uses five 128×128 stages with a lit green screen, per-hit screen flicker, escalating broken-state flicker and final rapid shutdown.
- Reviewed contact sheets: [bat](sprites/bat_v2_preview.png), [chainsaw](sprites/chainsaw_v2_preview.png), [shotgun](sprites/shotgun_v2_preview.png), [kiosk](sprites/kiosk_damage_v2_preview.png), [transform](sprites/normal_transform_source_preview.png).

## Runtime browser evidence

- Title flow: `pt-BR` language selection rendered `IDIOMA / COMO USAR / CRÉDITOS`; the localized complaint bubble rendered `CADÊ O BOTÃO F**KING START?!`.
- Ten-locale desktop layout matrix: every title rendered five measured UI nodes (heading, three services and complaint) inside the kiosk screen with no document horizontal overflow. CJK, French, German and pt-BR were used as representative screenshot checks.
- Start flow: no start control exists in the title service list; `INICIAR JOGO` exists as a normal-size button inside `COMO USAR` and enters `Intro`.
- Mobile-forced landscape HUD: joystick, jump, attack, mute, four icon buttons, remaining amounts and selected-weapon highlight were all visible without timer overlap.
- Exact 1080×640 capture review found and fixed two playfield-obstruction defects: touch players now spawn at x=230 clear of the 150px joystick, and FastFood/Street exit labels moved left of the touch weapon column.
- Exact 1080×640 result review found and fixed clipped action labels. The settled result screen measured its action buttons at y=406–452 entirely inside the kiosk screen at y=142–509.6.
- Preserved exact-size evidence: [title](runtime-title-1080x640.png), [guide/start](runtime-howto-1080x640.png), [FastFood touch HUD](runtime-fastfood-1080x640.png), [30-kiosk touch stress](runtime-factory-stress-1080x640.png), and [result](runtime-result-1080x640.png).
- The 1080×1080 share card now reuses the shipping factory raster and strong-character frame, with a broken-factory overlay; `/qa/share-card.html` provides ten-locale inspection.
- The synthesized music loop now runs a 115 ms eight-step cheap-MIDI pattern with bass, root/fifth power-chord voices, intentionally blunt lead, kick, snare and alternating high-hat; final subjective listening remains a physical-user gate.
- Falling trace with 5,200 px/s² configured acceleration reached more than 1,000 px/s before landing. Observed spawn-to-lock time was 1,067 ms; repeated landed samples stayed at x=700 with vx=0 and vy=0.
- Factory preview: HP decreased on every fist interval and flash alpha cycled between 0.00 and 0.18; machine screen flicker, sparks and camera feedback were visibly present.
- Accelerated campaign trail: `Intro → FastFood → Street → Factory → Result`; result had frozen time 7,184 ms, street goal 2/2 in test mode and factory HP 0. `KEEP BREAKING` entered `Endless` and incremented only the extra counter.
- Normal-balance Pages-subpath run: `/IHFK/?autoplay` completed `Intro → FastFood → Street(50) → Factory(5,000 HP) → Result` with frozen game time 124,265 ms. Scene wall times were FastFood 4.3 s, Street 7.6 s, Factory 84.8 s and Result 129.9 s; this is an input-perfect automated lower bound, not a human average.
- GitHub Pages configuration: `built`, HTTPS enforced, source `main` at `/`, public URL `https://mini-tech-meetup.github.io/IHFK/`. Commit `af113c4` is pushed on `codex/ihfk-phaser4-refactor` and draft PR [#1](https://github.com/Mini-Tech-Meetup/IHFK/pull/1) is open and mergeable. The live page still serves the pre-refactor title until the remaining physical-device gates pass and the PR is merged.
- Stress preview: 30 active kiosks, 20 FPS samples, minimum 60, average 60.75, maximum 61 on the current desktop browser environment.
- Forced-touch real-game stress: 30/30 active kiosks held 60 FPS for 12 samples; keyboard-equivalent attack input raised the endless counter to 35 while the scene replenished back to 30 and rendered raster weapon pickups/fragments. `/qa/device.html` now links directly to this shipping Phaser stress route for physical-device collection.

## Remaining release evidence

- Android Chrome fullscreen/orientation/native-share verification on physical hardware.
- iOS Safari manual rotation/audio unlock/native-share verification on physical hardware.
- Human normal-speed completion-time samples and final music listening pass.
- Merge/deploy of this worktree, followed by the same live-URL campaign and device QA checks.

These are evidence gaps, not known P0/P1 product defects. P0: 0, P1: 0.
