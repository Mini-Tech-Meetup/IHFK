# I HATE F**KING KIOSK

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

Open `http://<PC IPv4 address>:4173/qa/device.html` on the phone. Windows Firewall may ask once whether Python may accept private-network connections. The device page links to real 15-kiosk campaign and 30-kiosk endless Phaser stress scenes; each produces a copyable 10-second FPS report.

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

Play in landscape orientation. After Game Start, the game requests fullscreen and a landscape lock where the browser supports them. On iOS or when those requests are rejected, rotate the device manually. Touch controls provide a left joystick, jump/attack buttons, weapon slots 1–4, and mute.

For release-device verification, open [`qa/device.html`](qa/device.html) on the deployed host. It tests fullscreen/orientation requests, audio unlock, native PNG sharing, and 10-second 15/30-kiosk real-game FPS loads without storing or transmitting the report.

For localized result-card review, open [`qa/share-card.html`](qa/share-card.html). It renders the shipping 1080×1080 raster card in any of the ten supported languages.

## Languages

한국어, 简体中文, 繁體中文, 日本語, English, Français, Deutsch, Español, Português (Brasil), Italiano.

## Credits

- Original game: JHyunB and Lee-WonJun
- Character sprites: [Kalann — A Normal Guy That Gets Super Strong](https://kalann.itch.io/a-normal-guy-that-gets-super-strong-normal-guy)
- Framework: Phaser 4.1

Development status and acceptance evidence are tracked in [docs/MASTER_SPEC.md](docs/MASTER_SPEC.md).
