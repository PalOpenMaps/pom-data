import { readTXT, writeJSON } from 'https://deno.land/x/flat@0.0.15/mod.ts';
import { csvParse, autoType } from "https://unpkg.com/d3-dsv@3.0.1/src/index.js";
import { config_path, sheets_path } from "./config.js";

const keys = ["authors", "groups", "layers", "sources", "statuses", "translations", "pages", "sheets"];
const parseForBoolean = (val) => val === "TRUE" ? true : val === "FALSE" ? false : val;

const config = {};

for (const key of keys) {
  const path = `raw-data/${key}.csv`;

  console.log(`Reading ${path}`);
  const data = csvParse(await readTXT(path), autoType);

  const obj = {};

  for (const d of data) {
		const row = {};
		for (const col of data.columns) {
			const arr = col.match(/(?<=\[)\d*(?=\])/);
			if (Array.isArray(arr)) {
				const key = col.split("[")[0];
				if (arr[0] === "") row[key] = d[col].split(", ");
				else {
					if (!row[key]) row[key] = [];
					row[key][arr[0]] = parseForBoolean(d[col]);
				}
			} else row[col] = parseForBoolean(d[col]);
		}
		const newCols = Object.keys(row);
		for (const col of newCols) {
			if (Array.isArray(row[col]) && row[col].every(d => !d)) row[col] = null;
		}
		
    const rowKey = row.name_en || row.en;
    obj[rowKey] = row;
	}
	
	if (key === "sheets") {
		writeJSON(sheets_path, obj);
		console.log(`Wrote ${sheets_path}`);
	} else {
		config[key] = obj;
	}
}

writeJSON(config_path, config);
console.log(`Wrote ${config_path}`);