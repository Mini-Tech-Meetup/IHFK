#!/usr/bin/env python3
"""Add the legacy B mark and damage-aware menu pixels to the five kiosk rasters."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
FRAMES = ROOT / "assets/kiosk/frames-v2"
PREVIEW = ROOT / "docs/evidence/sprites/kiosk_damage_v2_preview.png"

YELLOW = (225, 165, 15, 255)
LIGHT = (204, 203, 203, 255)
MID = (104, 137, 112, 255)
DARK = (60, 58, 67, 255)
RED = (154, 21, 13, 255)

B_PATTERN = (
    "11110",
    "10001",
    "10001",
    "11110",
    "10001",
    "10001",
    "11110",
)


def is_screen_pixel(color: tuple[int, int, int, int]) -> bool:
    red, green, blue, alpha = color
    return bool(alpha and green > 48 and green > red * 1.35 and green > blue * 1.05)


def paint(image: Image.Image, mask: set[tuple[int, int]], x: int, y: int, color: tuple[int, int, int, int]) -> None:
    if (x, y) in mask:
        image.putpixel((x, y), color)


def rectangle(image: Image.Image, mask: set[tuple[int, int]], box: tuple[int, int, int, int], color: tuple[int, int, int, int]) -> None:
    left, top, right, bottom = box
    for y in range(top, bottom + 1):
        for x in range(left, right + 1):
            paint(image, mask, x, y, color)


def outline_tile(image: Image.Image, mask: set[tuple[int, int]], box: tuple[int, int, int, int], accent: tuple[int, int, int, int]) -> None:
    left, top, right, bottom = box
    rectangle(image, mask, box, MID)
    rectangle(image, mask, (left + 1, top + 1, right - 1, bottom - 1), DARK)
    rectangle(image, mask, (left + 2, top + 2, right - 2, top + 3), accent)


def draw_b(image: Image.Image, mask: set[tuple[int, int]], left: int, top: int, scale: int = 2) -> None:
    for row, pattern in enumerate(B_PATTERN):
        for column, active in enumerate(pattern):
            if active != "1":
                continue
            rectangle(
                image,
                mask,
                (left + column * scale, top + row * scale, left + (column + 1) * scale - 1, top + (row + 1) * scale - 1),
                YELLOW,
            )


def add_interface(image: Image.Image, stage: int) -> Image.Image:
    result = image.copy()
    mask = {
        (x, y)
        for y in range(image.height)
        for x in range(image.width)
        if is_screen_pixel(image.getpixel((x, y)))
    }
    if stage <= 2:
        draw_b(result, mask, 61, 22, 2)
        rectangle(result, mask, (56, 40, 77, 42), LIGHT if stage == 0 else MID)
        outline_tile(result, mask, (55, 47, 65, 56), YELLOW)
        outline_tile(result, mask, (68, 47, 78, 56), RED)
        outline_tile(result, mask, (55, 60, 65, 69), LIGHT)
        outline_tile(result, mask, (68, 60, 78, 69), YELLOW)
        rectangle(result, mask, (58, 73, 75, 77), DARK)
        rectangle(result, mask, (60, 74, 73, 75), YELLOW)
    elif stage == 3:
        draw_b(result, mask, 63, 22, 1)
        rectangle(result, mask, (56, 43, 75, 45), MID)
        rectangle(result, mask, (58, 51, 66, 54), YELLOW)
        rectangle(result, mask, (69, 59, 77, 62), RED)
        rectangle(result, mask, (57, 70, 72, 72), LIGHT)
    return result


def save_preview(frames: list[Image.Image]) -> None:
    scale = 2
    width, height = 128 * scale, 128 * scale
    preview = Image.new("RGBA", (width * len(frames), height), (238, 240, 242, 255))
    draw = ImageDraw.Draw(preview)
    tile = 16
    for y in range(0, height, tile):
        for x in range(0, preview.width, tile):
            fill = (226, 230, 234, 255) if (x // tile + y // tile) % 2 else (242, 244, 246, 255)
            draw.rectangle((x, y, x + tile - 1, y + tile - 1), fill=fill)
    for index, frame in enumerate(frames):
        preview.alpha_composite(frame.resize((width, height), Image.Resampling.NEAREST), (index * width, 0))
    PREVIEW.parent.mkdir(parents=True, exist_ok=True)
    preview.save(PREVIEW)


def main() -> None:
    paths = sorted(FRAMES.glob("*.png"))
    if len(paths) != 5:
        raise SystemExit(f"Expected five kiosk frames, found {len(paths)}")
    frames: list[Image.Image] = []
    for stage, path in enumerate(paths):
        frame = Image.open(path).convert("RGBA")
        enhanced = add_interface(frame, stage)
        enhanced.save(path)
        frames.append(enhanced)
    save_preview(frames)
    print("PASS added B/menu UI to kiosk stages 0-3 and rebuilt the preview")


if __name__ == "__main__":
    main()
