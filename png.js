import sharp from "sharp";
import fs from "fs";
import * as d3 from "d3";

async function toPng({ id, shortcode, frame_index }) {
  const txt = fs.readFileSync(
    `./output/drawings/${id}/${shortcode}.txt`,
    "utf8"
  );
  const svg = `<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 320 320" width="1280" height="1280"><rect x="0" y="0" width="1280" height="1280" fill="#fff" stroke="none"></rect><path d="${txt}" stroke-width="4" stroke="#000" fill="none"></path></svg>`;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(`./output/png/${id}/${d3.format("05")(frame_index)}.png`);
}

(async () => {
  const animations = fs
    .readdirSync("./output/shortcodes")
    .filter((d) => d.includes(".csv"));

  for (const animation of animations) {
    const id = animation.replace(".csv", "");
    const data = d3.csvParse(
      fs.readFileSync(`./output/shortcodes/${animation}`, "utf8")
    );
    for (const frame of data) {
      await toPng({ id, ...frame });
    }
  }
})();
