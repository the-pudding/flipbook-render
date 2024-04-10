import "dotenv/config";
import fs from "fs";
import * as d3 from "d3";
import { createClient } from "@supabase/supabase-js";
import { mkdirp } from "mkdirp";

const supabaseUrl = process.env.SUPABASE_URL_FLIPBOOK;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY_FLIPBOOK;
const supabase = createClient(supabaseUrl, supabaseKey);

async function getFrames(data = [], pageIndex = 0) {
  const limit = 1000;

  const response = await supabase
    .from("human")
    .select()
    .range(pageIndex * limit, (pageIndex + 1) * limit - 1);

  if (response.error) {
    console.log(response.error);
    throw new Error("getFrames failed");
  } else if (response.data && response.data.length) {
    data = [...data, ...response.data];
    console.log(response.data.length);
    if (response.data.length < limit) {
      return data;
    } else {
      return getFrames(data, pageIndex + 1);
    }
  } else return data;
}

(async () => {
  mkdirp.sync("./output/shortcodes-human");

  const frames = await getFrames();
  frames.sort((a, b) => d3.ascending(a.id, b.id));
  const clean = frames.map((d) => ({
    ...d,
    phone: !!d.phone,
    email: !!d.email,
    name: !!d.name,
  }));
  clean.forEach((d) => {
    delete d.created_at;
    delete d.id;
  });
  const csv = d3.csvFormat(clean);
  fs.writeFileSync(`./output/shortcodes-human/data.csv`, csv);
})();
