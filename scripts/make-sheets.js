import { readTXT, writeJSON } from 'https://deno.land/x/flat@0.0.15/mod.ts';
import { csvParse } from "https://unpkg.com/d3-dsv@3.0.1/src/index.js";
import bboxPolygon from "https://cdn.skypack.dev/@turf/bbox-polygon@7.2.0";
import { sheets_path } from "./config.js";
import { autoType, parseRow } from './utils.js';

const data = csvParse(await readTXT("raw-data/sheets.csv"), autoType);

const sheets = {
  type: "FeatureCollection",
  features: data
    .map(d => parseRow(d, data.columns))
    .map(d => {
      const props = Object.fromEntries(Object.entries(d)
        .filter(([key]) => key !== "bbox"));
      return Object.fromEntries(Object.entries(bboxPolygon(d.bbox, {properties: props}))
        .filter(([key]) => key !== "bbox"));
    })
};

writeJSON(sheets_path, sheets);
console.log(`Wrote ${sheets_path}`);