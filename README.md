# I HATE F**KING KIOSK


https://github.com/user-attachments/assets/710ac96c-0307-4fe6-b65e-74b45bfa0bba


A deliberately rough pixel-art destruction game built with Phaser 4.1.

## Play

[GitHub Pages — I HATE F**KING KIOSK](https://mini-tech-meetup.github.io/IHFK/)

The deployed page follows the repository's published branch. Local changes appear there only after that branch is updated.

## Play locally

```powershell
python -m http.server 4173
```

Open `http://127.0.0.1:4173/`. The project is static and can be hosted directly on GitHub Pages.

To test on a phone connected to the same Wi-Fi:

```powershell
npm run serve:lan
ipconfig
```

Open `http://<PC IPv4 address>:4173/qa/device.html` on the phone. Windows Firewall may ask once whether Python may accept private-network connections. The device page links to real 15-kiosk campaign and 30-kiosk endless Phaser stress scenes, plus a three-run human timing mode. The stress scenes produce copyable 10-second FPS reports; the timing mode reports all three runs and their average.

## Controls

- `← / →`: move
- `↑`: jump
- `1`: fists
- `2`: baseball bat
- `3`: chainsaw
- `4`: shotgun
- Hold `Space`: attack
- `M`: mute

## Mobile

Play in landscape orientation. Game Start requests fullscreen and a landscape lock directly from the tap gesture where the browser supports them, including the WebKit fullscreen fallback. On iOS or when those requests are rejected, rotate the device manually. The mobile kiosk uses a thin landscape bezel and its screen scrolls independently, so every language, guide action, and Game Start remains selectable even while browser chrome is visible. Touch controls provide a left joystick, jump/attack buttons, clickable weapon slots 1–4, and mute. Available weapons switch immediately when tapped; empty slots are visibly disabled. Desktop HUD weapon slots can also be clicked.

For release-device verification, open [`qa/device.html`](qa/device.html) on the deployed host. It tests fullscreen/orientation requests, audio unlock, native PNG sharing, 10-second 15/30-kiosk real-game FPS loads, and three real campaign completions without storing or transmitting the report. The timing shortcut can also be opened directly with `?playtest`; after the third result it marks the 2:30–3:30 average target pass or retest and offers a copyable JSON report.

For localized result-card review, open [`qa/share-card.html`](qa/share-card.html). It renders the shipping 1080×640 button-free result surface in any of the ten supported languages. The Canvas, native share payload, and clipboard fallback all use the canonical `https://mini-tech-meetup.github.io/IHFK/` URL.

## Languages

한국어, 简体中文, 繁體中文, 日本語, English, Français, Deutsch, Español, Português (Brasil), Italiano.

## Credits

- Original game: JHyunB and Lee-WonJun
- Character sprites: [Kalann — A Normal Guy That Gets Super Strong](https://kalann.itch.io/a-normal-guy-that-gets-super-strong-normal-guy)
- Framework: Phaser 4.1

Development status and acceptance evidence are tracked in [docs/MASTER_SPEC.md](docs/MASTER_SPEC.md).
