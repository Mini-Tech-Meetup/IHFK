#!/usr/bin/env python3
"""Split the approved factory damage strip and rebuild a background-only factory room."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
STRIP = ROOT / "assets/factory/source/factory-damage-strip-alpha.png"
COMPOSITE = ROOT / "assets/factory/source/factory-composite-v1.png"
BACKGROUND = ROOT / "assets/background/factory.png"
FRAMES = ROOT / "assets/factory/frames-v2"
PREVIEW = ROOT / "docs/evidence/sprites/factory_damage_v2_preview.png"

FRAME_SIZE = (680, 576)
CONTENT_SIZE = (640, 540)
BASELINE = 560


def content_ranges(image: Image.Image) -> list[tuple[int, int]]:
    alpha = image.getchannel("A")
    occupied = [any(alpha.getpixel((x, y)) for y in range(image.height)) for x in range(image.width)]
    ranges: list[tuple[int, int]] = []
    start: int | None = None
    for x, active in enumerate(occupied):
        if active and start is None:
            start = x
        if not active and start is not None:
            ranges.append((start, x))
            start = None
    if start is not None:
        ranges.append((start, image.width))
    return [span for span in ranges if span[1] - span[0] > 100]


def rebuild_background() -> None:
    source = Image.open(COMPOSITE).convert("RGBA")
    if source.size != (1080, 640):
        raise SystemExit(f"Unexpected factory composite size: {source.size}")
    clean = source.copy()
    tile_width = 400
    pixels = clean.load(); reference = source.load()
    for y in range(source.height):
        for x in range(tile_width, source.width):
            pixels[x, y] = reference[(x - tile_width) % tile_width, y]
    clean.save(BACKGROUND)


def normalize_frames() -> list[Image.Image]:
    strip = Image.open(STRIP).convert("RGBA")
    ranges = content_ranges(strip)
    if len(ranges) != 5:
        raise SystemExit(f"Expected five factory sprites, found {ranges}")
    content: list[Image.Image] = []
    for left, right in ranges:
        slot = strip.crop((left, 0, right, strip.height))
        bbox = slot.getchannel("A").getbbox()
        if bbox is None:
            raise SystemExit("Empty factory frame")
        sprite = slot.crop(bbox)
        pixels = sprite.load()
        for y in range(sprite.height):
            for x in range(sprite.width):
                red, green, blue, alpha = pixels[x, y]
                if alpha and red > 70 and blue > 70 and green < 70 and abs(red - blue) < 55:
                    pixels[x, y] = (20, 18, 21, alpha)
        content.append(sprite)
    max_width = max(frame.width for frame in content)
    max_height = max(frame.height for frame in content)
    scale = min(CONTENT_SIZE[0] / max_width, CONTENT_SIZE[1] / max_height)
    frames: list[Image.Image] = []
    for frame in content:
        size = (max(1, round(frame.width * scale)), max(1, round(frame.height * scale)))
        sprite = frame.resize(size, Image.Resampling.NEAREST)
        canvas = Image.new("RGBA", FRAME_SIZE, (0, 0, 0, 0))
        canvas.alpha_composite(sprite, ((FRAME_SIZE[0] - sprite.width) // 2, BASELINE - sprite.height))
        frames.append(canvas)

    atlas = Image.new("RGBA", (FRAME_SIZE[0] * len(frames), FRAME_SIZE[1]), (0, 0, 0, 0))
    for index, frame in enumerate(frames):
        atlas.alpha_composite(frame, (index * FRAME_SIZE[0], 0))
    quantized = atlas.quantize(colors=16, method=Image.Quantize.FASTOCTREE, dither=Image.Dither.NONE).convert("RGBA")
    quantized.putalpha(atlas.getchannel("A").point(lambda value: 255 if value >= 128 else 0))
    return [quantized.crop((index * FRAME_SIZE[0], 0, (index + 1) * FRAME_SIZE[0], FRAME_SIZE[1])) for index in range(5)]


def save_frames(frames: list[Image.Image]) -> None:
    FRAMES.mkdir(parents=True, exist_ok=True)
    for index, frame in enumerate(frames, start=1):
        frame.save(FRAMES / f"{index:02d}.png")


def save_preview(frames: list[Image.Image]) -> None:
    scale = 0.5
    width = round(FRAME_SIZE[0] * scale); height = round(FRAME_SIZE[1] * scale)
    preview = Image.new("RGBA", (width * len(frames), height), (238, 240, 242, 255))
    draw = ImageDraw.Draw(preview)
    tile = 16
    for y in range(0, height, tile):
        for x in range(0, preview.width, tile):
            draw.rectangle((x, y, x + tile - 1, y + tile - 1), fill=(226, 230, 234, 255) if (x // tile + y // tile) % 2 else (242, 244, 246, 255))
    for index, frame in enumerate(frames):
        preview.alpha_composite(frame.resize((width, height), Image.Resampling.NEAREST), (index * width, 0))
    PREVIEW.parent.mkdir(parents=True, exist_ok=True)
    preview.save(PREVIEW)


def main() -> None:
    rebuild_background()
    frames = normalize_frames()
    save_frames(frames)
    save_preview(frames)
    print(f"PASS rebuilt {BACKGROUND.relative_to(ROOT)} and five {FRAME_SIZE[0]}x{FRAME_SIZE[1]} factory frames")


if __name__ == "__main__":
    main()
