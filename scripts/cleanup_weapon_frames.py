#!/usr/bin/env python3
"""Remove isolated AI-generation debris behind the player in normalized frames."""

from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
TARGETS = {
    "assets/weapons/bat/frames-v2/05.png": 18,
    "assets/weapons/shotgun/frames-v2/04.png": 18,
    "assets/weapons/chainsaw/frames-v2/02.png": 18,
    "assets/weapons/chainsaw/frames-v2/03.png": 18,
    "assets/weapons/chainsaw/frames-v2/04.png": 18,
    "assets/weapons/chainsaw/frames-v2/05.png": 18,
    "assets/weapons/chainsaw/frames-v2/06.png": 18,
}


def components(image: Image.Image) -> list[list[tuple[int, int]]]:
    alpha = image.getchannel("A")
    width, height = image.size
    occupied = {(x, y) for y in range(height) for x in range(width) if alpha.getpixel((x, y))}
    found: list[list[tuple[int, int]]] = []
    while occupied:
        start = occupied.pop()
        queue = deque([start])
        component = [start]
        while queue:
            x, y = queue.popleft()
            for point in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
                if point in occupied:
                    occupied.remove(point)
                    queue.append(point)
                    component.append(point)
        found.append(component)
    return sorted(found, key=len, reverse=True)


def main() -> None:
    for relative, rear_limit in TARGETS.items():
        path = ROOT / relative
        image = Image.open(path).convert("RGBA")
        groups = components(image)
        removed = 0
        for group in groups[1:]:
            if max(x for x, _ in group) < rear_limit:
                for x, y in group:
                    image.putpixel((x, y), (0, 0, 0, 0))
                removed += len(group)
        image.save(path)
        print(f"{relative}: removed {removed} rear pixels")


if __name__ == "__main__":
    main()
