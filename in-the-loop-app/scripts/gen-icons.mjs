// One-time icon generation: rasterizes public/favicon.svg into the PNG sizes
// needed for the PWA manifest and iOS home-screen icon. Re-run if the icon design changes.
import sharp from "sharp";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "..", "public");
const svg = readFileSync(path.join(publicDir, "favicon.svg"));

const sizes = [
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
  { name: "apple-touch-icon.png", size: 180 },
];

for (const { name, size } of sizes) {
  await sharp(svg, { density: 384 })
    .resize(size, size)
    .png()
    .toFile(path.join(publicDir, name));
  console.log(`generated ${name}`);
}
