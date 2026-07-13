#!/usr/bin/env python3
"""Extract row-major frames from a fixed-cell sprite grid."""

from __future__ import annotations

import argparse
from pathlib import Path
from PIL import Image


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--out-dir", required=True)
    parser.add_argument("--frame-width", type=int, required=True)
    parser.add_argument("--frame-height", type=int, required=True)
    parser.add_argument("--frames", type=int, required=True)
    args = parser.parse_args()
    source = Image.open(args.input).convert("RGBA")
    columns = source.width // args.frame_width
    rows = source.height // args.frame_height
    if columns * rows < args.frames:
        raise SystemExit("Sprite grid has fewer cells than --frames")
    out_dir = Path(args.out_dir); out_dir.mkdir(parents=True, exist_ok=True)
    for index in range(args.frames):
        column = index % columns; row = index // columns
        frame = source.crop((column * args.frame_width, row * args.frame_height, (column + 1) * args.frame_width, (row + 1) * args.frame_height))
        frame.save(out_dir / f"{index + 1:02d}.png")


if __name__ == "__main__":
    main()
