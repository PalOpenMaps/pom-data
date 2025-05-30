import { readTXT, writeJSON } from 'https://deno.land/x/flat@0.0.15/mod.ts';
import { csvParse, autoType } from "https://unpkg.com/d3-dsv@3.0.1/src/index.js";
import { config_path, sheets_path } from "./config.js";

const keys = ["authors", "groups", "layers", "sources", "statuses", "translations", "pages", "sheets"];
const parseForBoolean = (val) => val === "TRUE" ? true : val === "FALSE" ? false : val;
const parseRow = (d, cols = null)=> {
	if (!cols) cols = Object.keys(row);

	const row = {};

	for (const col of cols) {
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
	
	return row;
}

const config = {};

for (const key of keys) {
  const path = `raw-data/${key}.csv`;

  console.log(`Reading ${path}`);
  const data = csvParse(await readTXT(path), autoType);

	if (key === "sheets") {
		writeJSON(sheets_path, data.map(d => parseRow(d, data.columns)));
		console.log(`Wrote ${sheets_path}`);
	} else {
		const obj = {};

		for (const d of data) {
			const row = parseRow(d, data.columns);
			const rowKey = row.name_en || row.en;
			obj[rowKey] = row;
		}
		config[key] = obj;
	}
}

writeJSON(config_path, config);
console.log(`Wrote ${config_path}`);