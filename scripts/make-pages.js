import { readTXT, writeJSON } from "https://deno.land/x/flat@0.0.15/mod.ts";
import { extract } from "https://deno.land/std@0.224.0/front_matter/yaml.ts";
import markdownit from "https://cdn.skypack.dev/markdown-it@14.1.0";

const md = markdownit();
const inDir = "raw-data/pages";
const outDir = "data/pages";

for await (const file of Deno.readDir(inDir)) {
  const filename = file.name;

  const str = await readTXT(`${inDir}/${filename}`);
  const raw = extract(str);
  const page = {...raw.attrs, content: md.render(raw.body)};

  const outPath = `${outDir}/${filename.replace(".md", ".json")}`;
  writeJSON(outPath, page);
  console.log(`Wrote ${outPath}`);
}
