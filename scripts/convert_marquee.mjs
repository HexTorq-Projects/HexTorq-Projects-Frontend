/**
 * Optimize the raw marquee screenshots (public/marquee/raw/*.png) into crisp,
 * lightweight .webp files at public/marquee/*.webp.
 *
 * Uses `sharp` (already a project dependency). Run after take_marquee_shots.py:
 *   node scripts/convert_marquee.mjs
 */
import { readdir, mkdir, stat } from "node:fs/promises";
import { dirname, join, basename } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const RAW = join(ROOT, "public", "marquee", "raw");
const OUT = join(ROOT, "public", "marquee");

// Card renders at ~400px CSS wide; 2x = 800px. Cap width so files stay small
// while remaining sharp on hi-dpi screens.
const MAX_WIDTH = 800;

async function main() {
  await mkdir(OUT, { recursive: true });

  let files;
  try {
    files = (await readdir(RAW)).filter((f) => f.toLowerCase().endsWith(".png"));
  } catch {
    console.error(`No raw dir at ${RAW}. Run take_marquee_shots.py first.`);
    process.exit(1);
  }
  if (!files.length) {
    console.error("No PNGs to convert.");
    process.exit(1);
  }

  let total = 0;
  for (const file of files) {
    const src = join(RAW, file);
    const dst = join(OUT, `${basename(file, ".png")}.webp`);
    await sharp(src)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: 82, effort: 5 })
      .toFile(dst);
    const { size } = await stat(dst);
    total += size;
    console.log(`  ${file} -> ${basename(dst)}  (${(size / 1024).toFixed(0)} KB)`);
  }
  console.log(`\nConverted ${files.length} images, ${(total / 1024).toFixed(0)} KB total.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
