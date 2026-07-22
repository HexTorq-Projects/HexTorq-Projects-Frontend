"""
Capture high-quality project-detail content screenshots from the LIVE Hextorq
site and build a data manifest for the homepage 3D marquee.

Flow:
  1. Pull real projects from the production API (Premium + High tiers).
  2. Visit each /project/:id on projects.hextorq.tech.
  3. Element-clip the main content column at 2x DPI -> PNG.
  4. Write src/components/ui/marquee-data.json with the real title / tier /
     price / tech / category for each shot, matched to its image.

PNGs land in public/marquee/raw/ ; convert_marquee.mjs turns them into .webp.

Run from the frontend root:
    python scripts/take_marquee_shots.py
"""

import os
import json
import urllib.request

from playwright.sync_api import sync_playwright

# --------------------------------------------------------------------------- #
# Config
# --------------------------------------------------------------------------- #
SITE = "https://projects.hextorq.tech"
API = "https://git-pipeline.metatronhost.in/hextorq-projects-web"

FRONTEND_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW_DIR = os.path.join(FRONTEND_ROOT, "public", "marquee", "raw")
DATA_FILE = os.path.join(FRONTEND_ROOT, "src", "components", "ui", "marquee-data.json")

TARGET_COUNT = 12          # cards in the marquee
CLIP_HEIGHT = 640          # CSS px of the content column to capture (object-cover crops)

os.makedirs(RAW_DIR, exist_ok=True)


# --------------------------------------------------------------------------- #
# 1. Fetch real project data from the API
# --------------------------------------------------------------------------- #
def fetch_json(url):
    req = urllib.request.Request(url, headers={"Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


def _norm_title(p):
    return " ".join((p.get("projectTitle") or "").lower().split())


def _cat(p):
    return (p.get("category") or {}).get("categoryName") or "Engineering"


def pick_projects():
    """Build a DISTINCT, diverse set of flagship projects.

    The catalog is heavily duplicated (many identical titles) and skews toward a
    couple of categories, so importance-sorting alone returns near-identical
    cards. We instead: dedupe by normalized title, prefer Premium then High, and
    round-robin across categories so the marquee reads as varied real work.
    """
    # Gather a big candidate pool, Premium first (flagship), then High.
    pool, seen_id = [], set()
    for tier in ("Premium", "High"):
        for page in range(1, 6):  # up to 5 pages * 100 = 500 per tier
            try:
                data = fetch_json(
                    f"{API}/projects?tier={tier}&perPage=100&page={page}&sort=importance"
                )
            except Exception as e:
                print(f"  ! API fetch failed tier={tier} page={page}: {e}")
                break
            items = data.get("items", [])
            if not items:
                break
            for p in items:
                if p["id"] not in seen_id:
                    seen_id.add(p["id"])
                    pool.append(p)

    # Dedupe by normalized title (keep first = highest importance / Premium).
    by_title = {}
    for p in pool:
        t = _norm_title(p)
        if t and t not in by_title:
            by_title[t] = p
    distinct = list(by_title.values())

    # Bucket distinct projects by category, then round-robin for spread.
    buckets = {}
    for p in distinct:
        buckets.setdefault(_cat(p), []).append(p)
    order = sorted(buckets, key=lambda c: -len(buckets[c]))  # biggest cats first

    picked = []
    while len(picked) < TARGET_COUNT and any(buckets[c] for c in order):
        for c in order:
            if buckets[c]:
                picked.append(buckets[c].pop(0))
                if len(picked) >= TARGET_COUNT:
                    break

    cats = {}
    for p in picked:
        cats[_cat(p)] = cats.get(_cat(p), 0) + 1
    print("  category spread:", ", ".join(f"{k}:{v}" for k, v in cats.items()))
    return picked


def money(n):
    return f"₹{n:,}" if isinstance(n, (int, float)) else None


def to_card(p):
    """Shape an API project into the card fields the marquee renders."""
    original = p.get("originalPrice")
    recommended = p.get("recommendedPrice")
    discounted = p.get("discountedPrice")
    price = discounted or recommended or original
    base = original or recommended or discounted
    discount = None
    if base and price and base > price:
        discount = f"{round((base - price) / base * 100)}%"
    tech = [t.strip() for t in (p.get("suggestedTech") or "").split(",") if t.strip()][:4]
    cat = (p.get("category") or {}).get("categoryName") or "Engineering"
    return {
        "id": p["id"],
        "image": f"/marquee/{p['id']}.webp",
        "title": p["projectTitle"],
        "category": cat,
        "tier": p.get("sellabilityTier") or "High",
        "tech": tech,
        "price": money(price),
        "originalPrice": money(base),
        "discount": discount,
    }


# --------------------------------------------------------------------------- #
# 2 + 3. Screenshot each project-detail content column
# --------------------------------------------------------------------------- #
def capture(projects):
    cards = []
    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True)
        ctx = browser.new_context(
            viewport={"width": 1440, "height": 900},
            device_scale_factor=2,               # crisp 2x output
        )
        page = ctx.new_page()

        for i, p in enumerate(projects, 1):
            pid = p["id"]
            url = f"{SITE}/project/{pid}"
            print(f"[{i}/{len(projects)}] {p['projectTitle'][:52]}")
            try:
                page.goto(url, wait_until="networkidle", timeout=45000)
                page.wait_for_timeout(2200)       # let reveal/anim settle

                # The left content column holds title + description + modules.
                el = page.query_selector("div.lg\\:col-span-2")
                box = el.bounding_box() if el else None
                if box and box["width"] > 200:
                    clip = {
                        "x": box["x"],
                        "y": box["y"],
                        "width": box["width"],
                        "height": min(box["height"], CLIP_HEIGHT),
                    }
                else:
                    # Fallback: fixed content region if selector shifts.
                    clip = {"x": 320, "y": 150, "width": 800, "height": CLIP_HEIGHT}

                out = os.path.join(RAW_DIR, f"{pid}.png")
                page.screenshot(path=out, clip=clip)
                cards.append(to_card(p))
                print("   -> captured")
            except Exception as e:
                print(f"   -> ERROR, skipped: {e}")

        browser.close()
    return cards


# --------------------------------------------------------------------------- #
# Main
# --------------------------------------------------------------------------- #
def main():
    print("Fetching real projects from API...")
    projects = pick_projects()
    if not projects:
        raise SystemExit("No projects returned from API - aborting.")
    print(f"Selected {len(projects)} projects.\n")

    cards = capture(projects)
    if not cards:
        raise SystemExit("No screenshots captured - aborting.")

    os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(cards, f, indent=2, ensure_ascii=False)

    print(f"\nDone. {len(cards)} cards.")
    print(f"  raw PNGs -> {RAW_DIR}")
    print(f"  data     -> {DATA_FILE}")
    print("Next: node scripts/convert_marquee.mjs")


if __name__ == "__main__":
    main()
