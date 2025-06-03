import { readTXT, writeJSON } from 'https://deno.land/x/flat@0.0.15/mod.ts';
import { csvParse } from "https://unpkg.com/d3-dsv@3.0.1/src/index.js";
import { autoType, parseRow } from './utils.js';
import { config_path } from "./config.js";

const keys = ["authors", "groups", "layers", "sources", "statuses", "translations", "pages"];
const config = {};

for (const key of keys) {
  const path = `raw-data/${key}.csv`;

  console.log(`Reading ${path}`);
  const data = csvParse(await readTXT(path), autoType);
	const obj = {};

	for (const d of data) {
		const row = parseRow(d, data.columns);
		const rowKey = row.name_en || row.en;
		obj[rowKey] = row;
	}
	config[key] = obj;
}

writeJSON(config_path, config);
console.log(`Wrote ${config_path}`);