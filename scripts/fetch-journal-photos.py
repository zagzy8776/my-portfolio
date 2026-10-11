#!/usr/bin/env python3
"""
Downloads and processes the journal's cover photography.

Why Wikimedia Commons
---------------------
Every photograph used by this build comes from Wikimedia Commons, i.e. it is
either public domain, CC0, or a Creative Commons licence that permits commercial
use and redistribution. No scraped images, no "found on Google" pictures, no
hotlinking a CDN. The licence, author and source page for each file are written
into `public/journal/CREDITS.md`, so the attribution requirement travels with
the build instead of living in someone's memory.

Why the transformation
----------------------
A raw Commons photograph is a multi-megabyte JPEG at a size and aspect ratio
chosen by whoever uploaded it. Shipping that into a blog card grid is both slow
and visually incoherent, so each image is:

  1. downloaded once into `assets/journal-source/` (cached, re-runs are offline),
  2. centre-cropped to a 3:2 cover,
  3. resized to 1600x1067,
  4. colour-graded to a duotone (near-black shadow -> the post's accent colour)
     so ten unrelated photographs read as one commissioned series,
  5. given a vignette and a fine grain,
  6. exported as WebP (plus a JPEG fallback), EXIF stripped.

Step 4 is the important one. Grading every cover into the same duotone is what
makes the journal look art-directed rather than assembled.

Requires Pillow: `python -m pip install pillow`

Usage:
    python scripts/fetch-journal-photos.py            # uses the on-disk cache
    python scripts/fetch-journal-photos.py --refresh  # re-download sources
    python scripts/fetch-journal-photos.py --discover # print Commons candidates
"""

from __future__ import annotations

import argparse
import json
import sys
import urllib.parse
import urllib.request
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageOps
except ImportError:  # pragma: no cover - environment guard
    sys.exit(
        "Pillow is required: python -m pip install pillow\n"
        "On Windows: py -m pip install pillow"
    )

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
CACHE = ROOT / "assets" / "journal-source"
OUT = ROOT / "public" / "journal"
PLAYGROUND_OUT = ROOT / "public" / "playground"

WIDTH, HEIGHT = 1600, 1067
# Playground plates are square — the grid is 1:1 by design.
SQUARE = 1200

USER_AGENT = (
    "ZagzyLink-Journal-Build/1.0 "
    "(https://portfolios-ruby-alpha.vercel.app; build-time cover art fetch)"
)

CREDITS_HEADER = (
    "# Cover photo credits\n\n"
    "The photographs in `public/journal/` are sourced from Wikimedia Commons and are\n"
    "public domain, CC0, or Creative Commons licences that permit commercial use and\n"
    "redistribution. Each image is colour-graded into the site palette at build time;\n"
    "grading does not alter the licence terms, and attribution is required for the\n"
    "CC-BY and CC-BY-SA files listed below.\n\n"
    "Regenerate with `python scripts/fetch-journal-photos.py`.\n\n"
)



# --------------------------------------------------------------------------- #
# Commons API
# --------------------------------------------------------------------------- #

def _api(params: dict) -> dict:
    url = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(params)
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=45) as response:
        return json.load(response)

# --------------------------------------------------------------------------- #
# Plates
# --------------------------------------------------------------------------- #
#
# `file` is a Wikimedia Commons file title — the stable identifier. The script
# resolves the real upload URL at build time, so a re-upload never breaks the
# build. `search` holds vetted fallbacks in case a file is renamed or deleted.
#
# Guessed filenames proved unreliable, so every title below was verified to
# exist via a live Commons search (see `--discover`).
PLATES: list[dict] = [
    {
        # Water surface interrupted by a drop: the physical version of a state
        # change acknowledging direct input.
        "slug": "micro-interactions",
        "file": "File:Water Surface (33236365632).jpg",
        "accent": (137, 170, 204),
        "search": ["File:3039 flaque et ronds dans l'eau.jpg"],
    },
    {
        # In-article figure: a single circular ring on water — one property,
        # one job, which is exactly what the paragraph above it argues.
        "slug": "micro-interactions-ring",
        "file": "File:3039 flaque et ronds dans l'eau.jpg",
        "accent": (137, 170, 204),
        "search": ["File:Rain drops on water surface.jpg", "File:Water drop impact.jpg"],
    },
    {
        # Light raking across an unadorned wall — emptiness treated as material.
        "slug": "minimalist-architecture",
        "file": "File:Shadow on the wall - Flickr - liebeslakritze.jpg",
        "accent": (185, 196, 207),
        "search": [
            "File:Geometric modernist facade in Rio de Janeiro, Brazil.jpg",
            "File:Modernist concrete facade in Rio de Janeiro, Brazil.jpg",
        ],
    },
    {
        # A gridded high-rise: a component library's geometry at 1:1 scale.
        "slug": "design-systems",
        "file": "File:Münster, Westdeutsche Lotterie -- 2018 -- 0417.jpg",
        "accent": (143, 184, 216),
        "search": ["File:Münster, Westdeutsche Lotterie -- 2018 -- 0413.jpg"],
    },
    {
        # Spiral staircase: form and function are the same decision.
        "slug": "form-function-brand",
        "file": "File:Staircase, Cleveland Trust Company Building, Euclid Avenue and East 9th Street, Cleveland, OH - 52990423418.jpg",
        "accent": (168, 182, 200),
        "search": [
            "File:Hans chr. hansen, architect- ringbo nursing home, bagsværd, copenhagen 1961-1963. basement stairs. (27862550801).jpg"
        ],
    },
    {
        # Pens laid across handwriting — editing as visible craft.
        "slug": "writing-for-the-web",
        "file": "File:Noodler's Black fountain pen ink writing samples.jpg",
        "accent": (194, 203, 212),
        "search": ["File:Pen To Paper - Flickr - Lisa Zins.jpg"],
    },
    {
        # Long exposure: many discrete events collapsed into one smooth read.
        "slug": "interface-performance",
        "file": "File:Traffic light trails in LA (Unsplash).jpg",
        "accent": (127, 181, 214),
        "search": [
            "File:DZ6 2599 Nighttime city street streaked with colorful light trails as traffic races by.jpg"
        ],
    },
    {
        # Circuit board macro — the substrate, not the marketing.
        "slug": "ai-assisted-engineering",
        "file": "File:Macro circuit board.JPG",
        "accent": (157, 178, 198),
        "search": ["File:MDT AKH-0600.03 circuit board back.jpg"],
    },
    {
        # Broadcast masts: reach engineered to survive distance and weather.
        "slug": "building-for-bandwidth",
        "file": "File:KRPI radio towers near Ferndale in sunset (34721481871).jpg",
        "accent": (134, 174, 203),
        "search": ["File:Radio towers on Bear Hill, Waltham, MA September 2025.jpg"],
    },
    {
        # A nine-arch brick viaduct completed in 1862 and still carrying trains:
        # infrastructure that outlived everyone who specified it.
        "slug": "on-longevity",
        "file": "File:Eynsford Viaduct (1862) - Nine-arch red brick railway viaduct spanning the Darent Valley, Kent, England.jpg",
        "accent": (174, 188, 201),
        "search": [
            "File:River Darent. Eynsford Viaduct (533SBJ) A railway viaduct spanning the River Darenth open very tall round-headed red brick arches. Stone balustrade above of small round headed arches. Built for the Sevenoaks Railway.jpg",
            "File:Pont du Gard (30).jpg",
        ],
    },
    {
        # Observatory domes, themselves under observation.
        "slug": "reading-data",
        "file": "File:Interferometer, night of the open domes, Cote d'Azur Observatory, Calern plateau, France.jpg",
        "accent": (147, 189, 212),
        "search": [
            "File:Silhouette of Astronomy students setting up a portable telescope for night observations at Bosscha Observatory.jpg"
        ],
    },
]



# --------------------------------------------------------------------------- #
# Playground plates
# --------------------------------------------------------------------------- #
#
# The "Visual playground" section used to hotlink Unsplash's CDN. It now draws
# from the same Commons pool as the covers, so the whole site has one licence
# story. These are square (1:1) rather than 3:2, hence the explicit `size`.
PLAYGROUND: list[dict] = [
    {
        # Water surface interrupted by a drop: motion held still.
        "slug": "fluid-dynamics",
        "file": "File:Water Surface (33236365632).jpg",
        "accent": (127, 181, 214),
        "size": (SQUARE, SQUARE),
        "search": ["File:3039 flaque et ronds dans l'eau.jpg"],
    },
    {
        "slug": "light-trails",
        "file": "File:Traffic light trails in LA (Unsplash).jpg",
        "accent": (137, 170, 204),
        "size": (SQUARE, SQUARE),
        "search": [
            "File:DZ6 2599 Nighttime city street streaked with colorful light trails as traffic races by.jpg"
        ],
    },
    {
        "slug": "geometry-shadow",
        "file": "File:Shadow on the wall - Flickr - liebeslakritze.jpg",
        "accent": (185, 196, 207),
        "size": (SQUARE, SQUARE),
        "search": [
            "File:Geometric modernist facade in Rio de Janeiro, Brazil.jpg",
        ],
    },
    {
        "slug": "flowing-streams",
        "file": "File:KRPI radio towers near Ferndale in sunset (34721481871).jpg",
        "accent": (134, 174, 203),
        "size": (SQUARE, SQUARE),
        "search": ["File:Radio towers on Bear Hill, Waltham, MA September 2025.jpg"],
    },
    {
        "slug": "glass-render",
        "file": "File:Münster, Westdeutsche Lotterie -- 2018 -- 0417.jpg",
        "accent": (143, 184, 216),
        "size": (SQUARE, SQUARE),
        "search": ["File:Münster, Westdeutsche Lotterie -- 2018 -- 0413.jpg"],
    },
    {
        "slug": "monochrome-pattern",
        "file": "File:Staircase, Cleveland Trust Company Building, Euclid Avenue and East 9th Street, Cleveland, OH - 52990423418.jpg",
        "accent": (168, 182, 200),
        "size": (SQUARE, SQUARE),
        "search": [
            "File:Hans chr. hansen, architect- ringbo nursing home, bagsværd, copenhagen 1961-1963. basement stairs. (27862550801).jpg"
        ],
    },
]

PLAYGROUND_CREDITS_HEADER = (
    "# Visual playground photo credits\n\n"
    "The photographs in `public/playground/` are sourced from Wikimedia Commons and\n"
    "are public domain, CC0, or Creative Commons licences that permit commercial use\n"
    "and redistribution. Each image is colour-graded into the site palette at build\n"
    "time; grading does not alter the licence terms, and attribution is required for\n"
    "the CC-BY and CC-BY-SA files listed below.\n\n"
    "Regenerate with `python scripts/fetch-journal-photos.py`.\n\n"
)


def _plain(value: str) -> str:
    """Commons returns HTML in its metadata fields; flatten it."""
    if not value:
        return ""
    cleaned = value.replace("<span", " <span")
    return cleaned.split("<")[0].strip()


def resolve(title: str) -> dict | None:
    """Return metadata for a Commons file, or None if it does not exist."""
    data = _api(
        {
            "action": "query",
            "format": "json",
            "prop": "imageinfo",
            "iiprop": "url|size|extmetadata",
            "titles": title,
        }
    )
    pages = data.get("query", {}).get("pages", {})
    page = next(iter(pages.values()), None)
    if not page or "imageinfo" not in page:
        return None

    info = page["imageinfo"][0]
    meta = info.get("extmetadata", {})

    def field(*keys: str) -> str:
        for key in keys:
            found = meta.get(key, {}).get("value")
            if found:
                return _plain(str(found))
        return ""

    return {
        "url": info["url"],
        "width": info.get("width", 0),
        "height": info.get("height", 0),
        "licence": field("LicenseShortName", "License"),
        "author": field("Artist", "Credit"),
        "page": info.get("descriptionurl", ""),
    }


def search(term: str, limit: int = 12) -> list[str]:
    """Search Commons' file namespace for candidate photographs."""
    data = _api(
        {
            "action": "query",
            "format": "json",
            "list": "search",
            "srsearch": f"filetype:bitmap {term}",
            "srnamespace": "6",
            "srlimit": str(limit),
        }
    )
    return [hit["title"] for hit in data.get("query", {}).get("search", [])]


# --------------------------------------------------------------------------- #
# Fetch + transform
# --------------------------------------------------------------------------- #

def download(url: str, slug: str, refresh: bool) -> Path:
    """Cache the original so re-runs of the build work offline."""
    CACHE.mkdir(parents=True, exist_ok=True)
    suffix = Path(urllib.parse.urlparse(url).path).suffix.lower() or ".jpg"
    target = CACHE / f"{slug}{suffix}"
    if target.exists() and not refresh:
        return target

    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=180) as response:
        payload = response.read()
    target.write_bytes(payload)
    print(f"    downloaded {len(payload) / 1024:.0f} KB -> {target.name}")
    return target


def duotone(image: Image.Image, accent: tuple[int, int, int]) -> Image.Image:
    """
    Map luminance onto a near-black -> accent ramp.

    The shadow end is deliberately lifted off pure black: photographs crushed to
    #000 lose all texture and read as holes in a dark layout.
    """
    grey = ImageOps.grayscale(image)

    shadow = (10, 12, 16)
    highlight = tuple(min(255, int(c + (255 - c) * 0.42)) for c in accent)

    ramp: list[int] = []
    for channel in range(3):
        for level in range(256):
            t = level / 255
            # Smoothstep, so mid-tones stay on the dark side and the accent
            # reads as a highlight rather than washing out the whole frame.
            eased = t * t * (3 - 2 * t)
            ramp.append(
                int(shadow[channel] + (highlight[channel] - shadow[channel]) * eased)
            )

    return Image.merge("RGB", [grey, grey, grey]).point(ramp)


def vignette(image: Image.Image, strength: float = 0.55) -> Image.Image:
    """Radial darkening, so any caption area over the cover stays legible."""
    mask = Image.new("L", image.size, 0)
    draw = ImageDraw.Draw(mask)
    inner = int(min(image.size) * 0.42)
    draw.ellipse(
        (
            image.width / 2 - inner,
            image.height / 2 - inner,
            image.width / 2 + inner,
            image.height / 2 + inner,
        ),
        fill=255,
    )
    mask = mask.filter(ImageFilter.GaussianBlur(inner * 0.72))
    darkened = ImageEnhance.Brightness(image).enhance(1 - strength)
    return Image.composite(image, darkened, mask)


def grain(image: Image.Image, amount: int = 7) -> Image.Image:
    """A touch of noise keeps flat gradients from banding on cheap displays."""
    noise = Image.effect_noise(image.size, 18).convert("L")
    noise = noise.point(lambda v: 128 + (v - 128) * amount / 100)
    grey = Image.merge("RGB", (noise, noise, noise))
    return Image.blend(image, grey, 0.06)


def process(
    source: Path, accent: tuple[int, int, int], size: tuple[int, int] = (WIDTH, HEIGHT)
) -> Image.Image:
    image = Image.open(source)
    image = ImageOps.exif_transpose(image)
    if image.mode != "RGB":
        image = image.convert("RGB")

    # Centre-crop to the target aspect before resizing so nothing is squashed.
    image = ImageOps.fit(image, size, method=Image.LANCZOS, centering=(0.5, 0.45))

    image = duotone(image, accent)
    image = ImageEnhance.Contrast(image).enhance(1.08)
    image = vignette(image)
    image = grain(image)
    return image.filter(ImageFilter.UnsharpMask(radius=1.6, percent=68, threshold=4))


def write(image: Image.Image, slug: str, out: Path = OUT) -> tuple[int, int]:
    out.mkdir(parents=True, exist_ok=True)

    webp = out / f"{slug}.webp"
    # Quality 82 / method 6 is the knee of the curve for this material: the next
    # 5 KB saved costs visible banding in the vignette.
    image.save(webp, "WEBP", quality=82, method=6)

    jpeg = out / f"{slug}.jpg"
    image.save(
        jpeg, "JPEG", quality=82, optimize=True, progressive=True, subsampling=1
    )

    return webp.stat().st_size, jpeg.stat().st_size

def run_set(
    plates: list[dict],
    out: Path,
    header: str,
    aspect: str,
    size: tuple[int, int],
    refresh: bool,
) -> list[str]:
    """Fetch, grade and write one plate set. Returns the slugs that failed."""
    failures: list[str] = []
    credits: list[str] = []

    for plate in plates:
        slug = plate["slug"]
        print(f"\n{slug}")

        # `file` is the pinned choice; `search` holds vetted fallbacks in case a
        # Commons file gets renamed or deleted after this was written.
        candidates = [plate["file"], *plate.get("search", [])]
        resolved = None
        used_title = ""
        for title in candidates:
            found = resolve(title)
            if found:
                resolved, used_title = found, title
                break

        if not resolved:
            print("  !! no Commons file resolved")
            failures.append(slug)
            continue

        print(f"    {used_title}")
        print(
            f"    {resolved['licence'] or 'licence unknown'}"
            f" — {resolved['author'] or 'author unknown'}"
        )

        try:
            source = download(resolved["url"], slug, refresh)
            image = process(source, tuple(plate["accent"]), plate.get("size", size))
            webp_bytes, jpeg_bytes = write(image, slug, out)
        except Exception as error:  # noqa: BLE001 - report and keep going
            import traceback

            print(f"  !! failed: {type(error).__name__}: {error}")
            traceback.print_exc()
            failures.append(slug)
            continue

        print(
            f"    wrote {slug}.webp ({webp_bytes / 1024:.0f} KB)"
            f" + {slug}.jpg ({jpeg_bytes / 1024:.0f} KB)"
        )

        target = plate.get("size", size)
        credits.append(
            f"### {slug.replace('-', ' ').title()}\n"
            f"- **File:** [{used_title}]({resolved['page']})\n"
            f"- **Author:** {resolved['author'] or 'see source'}\n"
            f"- **Licence:** {resolved['licence'] or 'see source'}\n"
            f"- **Source:** Wikimedia Commons\n"
            f"- **Processing:** centre-cropped to {aspect}, duotone graded, vignette, "
            f"grain, exported to WebP/JPEG at {target[0]}x{target[1]}\n"
        )

    if credits:
        out.mkdir(parents=True, exist_ok=True)
        (out / "CREDITS.md").write_text(header + "\n".join(credits), encoding="utf8")
        print(f"\nwrote {out / 'CREDITS.md'}")

    return failures


# --------------------------------------------------------------------------- #
# Main
# --------------------------------------------------------------------------- #

def main() -> int:
    parser = argparse.ArgumentParser(description="Fetch and grade journal covers.")
    parser.add_argument("--refresh", action="store_true", help="re-download sources")
    parser.add_argument(
        "--discover", action="store_true", help="print Commons candidates per plate"
    )
    args = parser.parse_args()

    if args.discover:
        for plate in [*PLATES, *PLAYGROUND]:
            print(f"\n{plate['slug']}  ({plate['file']})")
            for title in search(plate["file"])[:8]:
                print(f"  {title}")
        return 0

    failures: list[str] = []
    failures += run_set(PLATES, OUT, CREDITS_HEADER, "3:2", (WIDTH, HEIGHT), args.refresh)
    failures += run_set(
        PLAYGROUND,
        PLAYGROUND_OUT,
        PLAYGROUND_CREDITS_HEADER,
        "1:1",
        (SQUARE, SQUARE),
        args.refresh,
    )

    if failures:
        print(f"\n{len(failures)} plate(s) failed: {', '.join(failures)}")
        return 1

    print(f"\n{len(PLATES)} cover(s) + {len(PLAYGROUND)} playground plate(s) processed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
