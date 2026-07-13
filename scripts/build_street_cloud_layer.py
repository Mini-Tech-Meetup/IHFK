"""Split the baked street clouds into a reusable hard-alpha pixel sprite."""

from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
BACKGROUND = ROOT / "assets/background/street.png"
SOURCE = ROOT / "assets/background/source/street-with-clouds-v1.png"
CLOUD = ROOT / "assets/background/layers/street-cloud.png"

SKY = (95, 163, 208, 255)
CLOUD_WHITE = (214, 224, 230, 255)


def main() -> None:
    SOURCE.parent.mkdir(parents=True, exist_ok=True)
    CLOUD.parent.mkdir(parents=True, exist_ok=True)

    if not SOURCE.exists():
        Image.open(BACKGROUND).convert("RGBA").save(SOURCE)

    source = Image.open(SOURCE).convert("RGBA")

    # The original art is a 4x nearest-neighbour enlargement. Keep the moving
    # layer on that same grid and retain only the solid cloud pixels.
    cloud = Image.new("RGBA", (240, 112), (0, 0, 0, 0))
    crop = source.crop((0, 8, 240, 120))
    for y in range(crop.height):
        for x in range(crop.width):
            if crop.getpixel((x, y)) == CLOUD_WHITE:
                cloud.putpixel((x, y), CLOUD_WHITE)
    cloud.save(CLOUD)

    clean = source.copy()
    pixels = clean.load()
    # Rebuild only the empty sky band, leaving the shop silhouettes untouched.
    # Tiny 4px blue blocks preserve the deliberately cheap original texture.
    for y in range(164):
        for x in range(clean.width):
            pixels[x, y] = SKY
    texture_marks = [
        (28, 28, 8, 4, (98, 165, 209, 255)),
        (176, 122, 20, 4, (91, 158, 202, 255)),
        (386, 150, 36, 4, (98, 165, 209, 255)),
        (646, 64, 12, 4, (91, 158, 202, 255)),
        (824, 142, 44, 4, (98, 165, 209, 255)),
        (1032, 88, 20, 4, (91, 158, 202, 255)),
    ]
    for x, y, width, height, color in texture_marks:
        for py in range(y, y + height):
            for px in range(x, x + width):
                pixels[px, py] = color
    clean.save(BACKGROUND)

    assert cloud.getextrema()[3] == (0, 255)
    assert all(channel in (0, 255) for channel in cloud.getchannel("A").getdata())
    print(f"wrote {BACKGROUND.relative_to(ROOT)} and {CLOUD.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
