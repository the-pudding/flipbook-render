import sharp from "sharp";
import fs from "fs";

const size = 640;
async function toPng(file) {
  const shortcode = file.replace(".txt", "");
  const txt = fs.readFileSync(`./output/human/${file}`, "utf8");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 320 320" width="${size}" height="${size}"><rect x="0" y="0" width="${size}" height="${size}" fill="#fff" stroke="none"></rect><path d="${txt}" stroke-width="4" stroke="#000" fill="none"></path></svg>`;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(`./output/png-human/${shortcode}.png`);
}

(async () => {
  const files = fs
    .readdirSync("./output/human")
    .filter((d) => d.includes(".txt"));

  for (const file of files) {
    await toPng(file);
  }
})();
