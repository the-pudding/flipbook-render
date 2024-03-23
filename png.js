import sharp from "sharp";
import fs from "fs";
import * as d3 from "d3";
import { mkdirp } from "mkdirp";

const size = 1080;

async function toPng({ id, shortcode, frame_index }) {
  const txt = fs.readFileSync(
    `./output/drawings/${id}/${shortcode}.txt`,
    "utf8"
  );
  const svg = `<svg xmlns="http://www.w3.org/2000/svg"  viewBox="-4 -4 328 328" width="${size}" height="${size}"><rect x="0" y="0" width="328" height="328" fill="#fff" stroke="none"></rect><path d="${txt}" stroke-width="4" stroke="#000" fill="none"></path></svg>`;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(`./output/png/${id}/${d3.format("05")(frame_index)}.png`);
}

(async () => {
  mkdirp.sync("./output/png");
  const animations = fs
    .readdirSync("./output/shortcodes")
    .filter((d) => d.includes(".csv"));

  for (const animation of animations) {
    const id = +animation.replace(".csv", "");
    mkdirp.sync(`./output/png/${id}`);
    const data = d3.csvParse(
      fs.readFileSync(`./output/shortcodes/${animation}`, "utf8")
    );
    const shouldConvert =
      ((id < 25 && data.length >= 360) || (id >= 25 && data.length >= 240)) &&
      id !== 28;
    if (shouldConvert) {
      for (const frame of data) {
        await toPng({ id, ...frame });
      }
    }
  }
})();
