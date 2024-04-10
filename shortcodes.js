import "dotenv/config";
import fs from "fs";
import * as d3 from "d3";
import { createClient } from "@supabase/supabase-js";
import { mkdirp } from "mkdirp";

const supabaseUrl = process.env.SUPABASE_URL_FLIPBOOK;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY_FLIPBOOK;
const supabase = createClient(supabaseUrl, supabaseKey);

async function getFrames(id, data = [], pageIndex = 0) {
  const limit = 1000;

  const response = await supabase
    .from("frame")
    .select("frame_index,shortcode")
    .eq("animation_id", id)
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
      return getFrames(id, data, pageIndex + 1);
    }
  } else return data;
}

export async function getAnimations() {
  const response = await supabase.from("animation").select();

  if (response.error) {
    console.log(response.error);
    throw new Error("getAnimations failed");
  } else if (response.data && response.data.length) {
    return response.data;
  } else return undefined;
}

(async () => {
  mkdirp.sync("./output/shortcodes");
  const animations = await getAnimations();
  if (!animations) return;

  for (const animation of animations) {
    if (animation.id !== 28) continue;
    console.log(animation.id);
    const frames = await getFrames(animation.id);
    frames.sort((a, b) => d3.ascending(a.frame_index, b.frame_index));
    const csv = d3.csvFormat(frames);
    fs.writeFileSync(`./output/shortcodes/${animation.id}.csv`, csv);
  }
})();
