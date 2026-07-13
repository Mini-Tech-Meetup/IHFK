#!/usr/bin/env python3
"""Derive weapon-only pickup sprites from the approved full-character frames."""

from __future__ import annotations

from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "weapons" / "pickups"

SPECS = {
    "bat": {
        "source": ROOT / "assets/weapons/bat/frames-v2/03.png",
        "crop": (37, 34, 62, 44),
        "keep": lambda r, g, b: True,
    },
    "chainsaw": {
        "source": ROOT / "assets/weapons/chainsaw/frames-v2/01.png",
        "crop": (24, 45, 56, 64),
        "keep": lambda r, g, b: not (r > 180 and g > 125 and b < 170) and not (b > r + 18),
    },
    "shotgun": {
        "source": ROOT / "assets/weapons/shotgun/frames-v2/01.png",
        "crop": (30, 33, 56, 45),
        "keep": lambda r, g, b: not (r > 180 and g > 125 and b < 170) and not (b > r + 18),
    },
}


def visible_bbox(image: Image.Image) -> tuple[int, int, int, int]:
    bbox = image.getchannel("A").getbbox()
    if not bbox:
        raise RuntimeError("pickup mask produced an empty image")
    return bbox


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for weapon, spec in SPECS.items():
        source = Image.open(spec["source"]).convert("RGBA").crop(spec["crop"])
        pixels = source.load()
        for y in range(source.height):
            for x in range(source.width):
                r, g, b, a = pixels[x, y]
                if not a or not spec["keep"](r, g, b):
                    pixels[x, y] = (0, 0, 0, 0)
        source = source.crop(visible_bbox(source))
        source = source.resize((source.width * 2, source.height * 2), Image.Resampling.NEAREST)
        canvas = Image.new("RGBA", (80, 48), (0, 0, 0, 0))
        canvas.alpha_composite(source, ((80 - source.width) // 2, (48 - source.height) // 2))
        output = OUT / f"{weapon}.png"
        canvas.save(output)
        print(f"{weapon}: {source.size} -> {output.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
