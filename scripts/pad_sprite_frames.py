#!/usr/bin/env python3
"""Apply one shared nearest-neighbor inset scale to normalized sprite frames."""

from __future__ import annotations

import argparse
from pathlib import Path
from PIL import Image


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--frames-dir", required=True)
    parser.add_argument("--scale", type=float, default=0.9)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    if not 0 < args.scale <= 1:
        raise SystemExit("--scale must be greater than 0 and at most 1")
    paths = sorted(Path(args.frames_dir).glob("*.png"))
    if not paths:
        raise SystemExit("No PNG frames found")
    for path in paths:
        source = Image.open(path).convert("RGBA")
        width = max(1, round(source.width * args.scale))
        height = max(1, round(source.height * args.scale))
        resized = source.resize((width, height), Image.Resampling.NEAREST)
        canvas = Image.new("RGBA", source.size, (0, 0, 0, 0))
        canvas.alpha_composite(resized, ((source.width - width) // 2, source.height - height))
        canvas.save(path)


if __name__ == "__main__":
    main()
