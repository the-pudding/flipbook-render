import fs, { mkdir } from "fs";
import Spritesmith from "spritesmith";
import * as d3 from "d3";
import { mkdirp } from "mkdirp";

function chunk(src, i) {
  return new Promise((resolve, reject) => {
    Spritesmith.run({ src }, (err, result) => {
      result.image; // Buffer representation of image
      result.coordinates; // Object mapping filename to {x, y, width, height} of image
      result.properties; // Object with metadata about spritesheet {width, height}

      // console.log(result);
      // const { width: imageWidth, height: imageHeight } =
      //   result.coordinates[src[0]];

      // const sheetWidth = result.properties.width;
      // const sheetHeight = result.properties.height;

      // x,y should be percents
      // 4 / 5 should be 1
      // const coordinates = Object.keys(result.coordinates).map((d) => ({
      //   x: +(result.coordinates[d].x / (sheetWidth - imageWidth)).toFixed(4),
      //   y: +(result.coordinates[d].y / (sheetHeight - imageHeight)).toFixed(4),
      //   name: d.replace("./tasks/input/", ""),
      // }));

      fs.writeFileSync(`./output/sprite-human/${i}.png`, result.image);
      resolve();
    });
  });
}

(async () => {
  mkdirp.sync("./output/sprite-human");
  const images = fs
    .readdirSync("./output/png-human-film")
    .filter((d) => d.includes(".png"))
    .map((d) => `./output/png-human-film/${d}`);

  const chunks = d3.range(0, images.length, 100);
  let i = 0;
  for (let c of chunks) {
    const src = images.slice(c, c + 100);
    await chunk(src, i);
    i++;
  }
})();
