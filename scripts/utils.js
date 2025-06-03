export function autoType(object) {
  for (var key in object) {
    var value = object[key].trim(), number;
    if (!value) value = null;
    else if (/^(true|TRUE)$/.test(value)) value = true;
    else if (/^(false|FALSE)$/.test(value)) value = false;
    else if (value === "NaN") value = NaN;
    else if (!isNaN(number = +value)) value = number;
    else if (/^([-+]\d{2})?\d{4}(-\d{2}(-\d{2})?)?(T\d{2}:\d{2}(:\d{2}(\.\d{3})?)?(Z|[-+]\d{2}:\d{2})?)?$/.test(value)) value = new Date(value);
    else continue;
    object[key] = value;
  }
  return object;
}

export function parseRow(d, cols = null) {
	if (!cols) cols = Object.keys(row);

	const row = {};

	for (const col of cols) {
		const arr = col.match(/(?<=\[)\d*(?=\])/);
		if (Array.isArray(arr)) {
			const key = col.split("[")[0];
			if (arr[0] === "") row[key] = d[col].split(", ");
			else {
				if (!row[key]) row[key] = [];
				row[key][arr[0]] = d[col];
			}
		} else row[col] = d[col];
	}
	const newCols = Object.keys(row);
	for (const col of newCols) {
		if (Array.isArray(row[col]) && row[col].every(d => !d)) row[col] = null;
	}
	
	return row;
}