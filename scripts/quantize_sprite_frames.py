#!/usr/bin/env python3
"""Quantize a normalized animation directory with one shared hard-alpha palette."""

from __future__ import annotations

import argparse
from pathlib import Path
from PIL import Image


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--frames-dir", required=True)
    parser.add_argument("--colors", type=int, default=16)
    parser.add_argument("--alpha-threshold", type=int, default=96)
    args = parser.parse_args()
    paths = sorted(Path(args.frames_dir).glob("*.png"))
    if not paths:
        raise SystemExit("No PNG frames found")
    frames = [Image.open(path).convert("RGBA") for path in paths]
    size = frames[0].size
    if any(frame.size != size for frame in frames):
        raise SystemExit("All frames must use the same dimensions")
    atlas = Image.new("RGBA", (size[0] * len(frames), size[1]), (0, 0, 0, 0))
    for index, frame in enumerate(frames): atlas.alpha_composite(frame, (index * size[0], 0))
    quantized = atlas.quantize(colors=args.colors, method=Image.Quantize.FASTOCTREE, dither=Image.Dither.NONE).convert("RGBA")
    original_alpha = atlas.getchannel("A")
    hard_alpha = original_alpha.point(lambda value: 255 if value >= args.alpha_threshold else 0)
    quantized.putalpha(hard_alpha)
    for index, path in enumerate(paths):
        quantized.crop((index * size[0], 0, (index + 1) * size[0], size[1])).save(path)


if __name__ == "__main__": main()
