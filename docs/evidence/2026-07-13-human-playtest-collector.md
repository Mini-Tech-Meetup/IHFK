# 2026-07-13 Human Playtest Timing Collector

## Scope

The remaining 2:30–3:30 campaign target needs human play rather than accelerated automation. `?playtest` now records one completion per run in memory, preserves the list across same-language retries, and shows a kiosk-styled report after every result. No result, timing sample, or device data is stored or transmitted.

## Runtime behavior

- `/qa/device.html` action 7 opens the shipping game with `?playtest`; no `testMode` or balance override is used.
- The first Result records run 1 exactly once. `NEXT RUN` resets campaign state but preserves locale and prior timing samples.
- After three Results, the report lists all runs, their arithmetic average, the 02:30.00–03:30.00 target, and `TARGET PASS` or `OUTSIDE TARGET`.
- `COPY REPORT` exports timestamp, user agent, viewport, locale, run milliseconds, average, target boundaries, completion, and pass state as JSON.
- Normal URLs retain the original Retry / Continue Breaking / Share result actions and do not create playtest state.

## Automated boundary proof

`npm test` drives real Phaser scene transitions with synthetic elapsed values of 150,000, 180,000, and 210,000 ms. It verifies exactly three records, a 180,000 ms average, PASS classification, three result actions, copy-report content, and dialog containment at both 1080×640 and 844×390. The GameSession unit test also verifies duplicate Result entry rejection and run-list preservation across resets.

This synthetic boundary proof validates the collector, not the game-length acceptance gate. Android/iOS users must still complete three unaccelerated campaigns and paste the copied reports into `DEVICE_QA_TEMPLATE.md`.

## Evidence

- Desktop report: [runtime-playtest-report-1080x640.png](runtime-playtest-report-1080x640.png)
- Android landscape-sized report: [runtime-playtest-report-844x390.png](runtime-playtest-report-844x390.png)
- Commands: `npm run check` PASS; `npm test` PASS
- Automated totals: 36 browser unit tests, 14 responsive/E2E groups, 6 cross-browser environments
- Known limitation: physical fullscreen, orientation, native share, audio listening, and real human campaign timing remain external release gates.
