import sharp from "sharp";
import fs from "fs";
import * as d3 from "d3";

const size = 640;
async function toPng(file, i) {
  const shortcode = file.replace(".txt", "");
  const txt = fs.readFileSync(`./output/human/${file}`, "utf8");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg"  viewBox="-4 -4 328 328" width="${size}" height="${size}"><rect x="0" y="0" width="328" height="328" fill="#fff" stroke="none"></rect><path d="${txt}" stroke-width="4" stroke="#000" fill="none"></path></svg>`;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(`./output/png-human/${shortcode}.png`);

  const size2 = 100;
  const svg2 = `<svg xmlns="http://www.w3.org/2000/svg"  viewBox="-4 -4 328 328" width="${size2}" height="${size2}"><rect x="0" y="0" width="328" height="328" fill="#fff" stroke="none"></rect><path d="${txt}" stroke-width="4" stroke="#000" fill="none"></path></svg>`;
  await sharp(Buffer.from(svg2))
    .png()
    .toFile(`./output/png-human-film/${d3.format("05")(i)}.png`);
}

(async () => {
  const files = fs
    .readdirSync("./output/human")
    .filter((d) => d.includes(".txt"));

  let i = 0;
  for (const file of files) {
    await toPng(file, i);
    i += 1;
  }
  console.log(i);
})();
