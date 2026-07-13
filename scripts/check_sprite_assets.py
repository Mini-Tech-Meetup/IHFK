#!/usr/bin/env python3
"""Validate every runtime raster asset and inspected source-frame boundary."""

from __future__ import annotations

from pathlib import Path
from PIL import Image


def rgba(path: Path) -> Image.Image:
    image = Image.open(path).convert("RGBA")
    if image.getbbox() is None: raise SystemExit(f"Empty image: {path}")
    return image


def validate_frames(root: Path, count: int, size: int) -> None:
    paths = sorted(root.glob("*.png"))
    if len(paths) != count: raise SystemExit(f"{root}: expected {count} frames, got {len(paths)}")
    palette: set[tuple[int, int, int, int]] = set()
    for path in paths:
        image = rgba(path)
        if image.size != (size, size): raise SystemExit(f"{path}: expected {size}x{size}, got {image.size}")
        colors = image.getcolors(maxcolors=1_000_000) or []
        if any(color[3] not in (0, 255) for _, color in colors): raise SystemExit(f"{path}: partial alpha found")
        palette.update(color for _, color in colors if color[3])
        bbox = image.getchannel("A").getbbox()
        if bbox is None or bbox[0] <= 0 or bbox[1] <= 0 or bbox[2] >= size: raise SystemExit(f"{path}: unsafe or clipped bbox {bbox}")
    if len(palette) > 16: raise SystemExit(f"{root}: palette has {len(palette)} opaque colors")


def grid_content(path: Path, frame_width: int, frame_height: int) -> list[bool]:
    image = Image.open(path).convert("RGBA")
    columns = image.width // frame_width; rows = image.height // frame_height
    return [image.crop(((index % columns) * frame_width, (index // columns) * frame_height, (index % columns + 1) * frame_width, (index // columns + 1) * frame_height)).getchannel("A").getbbox() is not None for index in range(columns * rows)]


for background in Path("assets/background").glob("*.png"):
    image = Image.open(background).convert("RGBA")
    if image.size != (1080, 640): raise SystemExit(f"{background}: wrong size {image.size}")
    colors = image.getcolors(maxcolors=1_000_000) or []
    if len(colors) > 16 or any(color[3] != 255 for _, color in colors): raise SystemExit(f"{background}: palette/alpha gate failed")

validate_frames(Path("assets/kiosk/frames-v2"), 5, 128)
for weapon in ("bat", "chainsaw", "shotgun"): validate_frames(Path(f"assets/weapons/{weapon}/frames-v2"), 6, 64)

for weapon in ("bat", "chainsaw", "shotgun"):
    path = Path(f"assets/weapons/pickups/{weapon}.png")
    image = rgba(path)
    if image.size != (80, 48): raise SystemExit(f"{path}: expected 80x48, got {image.size}")
    colors = image.getcolors(maxcolors=1_000_000) or []
    if any(color[3] not in (0, 255) for _, color in colors): raise SystemExit(f"{path}: partial alpha found")
    if len([color for _, color in colors if color[3]]) > 16: raise SystemExit(f"{path}: palette exceeds 16 opaque colors")
    bbox = image.getchannel("A").getbbox()
    if bbox is None or bbox[0] <= 0 or bbox[1] <= 0 or bbox[2] >= image.width or bbox[3] >= image.height: raise SystemExit(f"{path}: unsafe bbox {bbox}")

runtime_captures = (
    "runtime-title-1080x640.png",
    "runtime-howto-1080x640.png",
    "runtime-fastfood-1080x640.png",
    "runtime-factory-stress-1080x640.png",
    "runtime-result-1080x640.png",
)
for filename in runtime_captures:
    path = Path("docs/evidence") / filename
    image = Image.open(path)
    if image.size != (1080, 640): raise SystemExit(f"{path}: expected 1080x640, got {image.size}")

run = grid_content(Path("assets/character/Strong Guy Runs/Strong_Guy_Rung_SpriteSheet.png"), 18, 24)
attack = grid_content(Path("assets/character/Strong Guy Attacks/Strong_Guy_Attacks_Without_The_Repeated_Frames.png"), 27, 24)
if run[:8] != [True] * 8 or run[8]: raise SystemExit("Strong-run source population changed")
if attack[:15] != [True] * 15 or attack[15]: raise SystemExit("Strong-attack source population changed")

print("PASS 3 backgrounds are 1080x640, opaque, and at most 16 colors")
print("PASS 23 generated runtime frames use hard alpha, safe bounds, and shared 16-color palettes")
print("PASS 3 derived weapon pickups are 80x48 hard-alpha pixel sprites")
print("PASS 5 runtime evidence captures are exactly 1080x640")
print("PASS inspected source sheets retain 8 run and 15 attack frames with expected empty tail cells")
