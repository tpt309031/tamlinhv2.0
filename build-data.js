const fs = require("fs");
const path = require("path");

const outputDir = __dirname;
const sources = {
  btc: {
    label: "BTC",
    file: path.join(outputDir, "data", "index_btc.csv"),
  },
  me: {
    label: "Chây đờ",
    file: path.join(outputDir, "data", "index_me.csv"),
  },
  wp: {
    label: "WP",
    file: path.join(outputDir, "data", "index_wp.csv"),
  },
};

function pad(value) {
  return String(value).padStart(2, "0");
}

function parseUsDate(value, sourceName, lineNumber) {
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(value);
  if (!match) throw new Error(`${sourceName}: ngày không hợp lệ tại dòng ${lineNumber}: ${value}`);
  const month = Number(match[1]);
  const day = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    throw new Error(`${sourceName}: ngày không tồn tại tại dòng ${lineNumber}: ${value}`);
  }
  return `${year}-${pad(month)}-${pad(day)}`;
}

function readCsv(sourceName, filePath) {
  const lines = fs.readFileSync(filePath, "utf8").trim().split(/\r?\n/);
  if (lines.shift() !== "date,score_percent") {
    throw new Error(`${sourceName}: header phải là date,score_percent`);
  }

  const seen = new Set();
  const records = lines.map((line, index) => {
    const [rawDate, rawValue, extra] = line.split(",");
    const lineNumber = index + 2;
    if (extra !== undefined) throw new Error(`${sourceName}: thừa cột tại dòng ${lineNumber}`);
    const date = parseUsDate(rawDate, sourceName, lineNumber);
    const value = Number(rawValue);
    if (!Number.isFinite(value)) throw new Error(`${sourceName}: chỉ số không hợp lệ tại ${date}`);
    if (seen.has(date)) throw new Error(`${sourceName}: trùng ngày ${date}`);
    seen.add(date);
    return { date, value };
  });

  records.sort((a, b) => a.date.localeCompare(b.date));
  for (let index = 1; index < records.length; index += 1) {
    const previous = new Date(`${records[index - 1].date}T00:00:00Z`);
    previous.setUTCDate(previous.getUTCDate() + 1);
    if (previous.toISOString().slice(0, 10) !== records[index].date) {
      throw new Error(`${sourceName}: thiếu ngày giữa ${records[index - 1].date} và ${records[index].date}`);
    }
  }
  return records;
}

const series = Object.fromEntries(
  Object.entries(sources).map(([key, source]) => [key, readCsv(source.label, source.file)])
);
const firstKey = Object.keys(series)[0];
const firstSeries = series[firstKey];

Object.entries(series).slice(1).forEach(([key, records]) => {
  if (records.length !== firstSeries.length) {
    throw new Error(`${key}: số dòng ${records.length} khác ${firstKey}: ${firstSeries.length}`);
  }
  records.forEach((record, index) => {
    if (record.date !== firstSeries[index].date) {
      throw new Error(`${key}: lệch ngày tại dòng ${index + 2}: ${record.date} khác ${firstSeries[index].date}`);
    }
  });
});

const years = [...new Set(firstSeries.map((item) => Number(item.date.slice(0, 4))))];
const payload = {
  meta: {
    generatedAt: new Date().toISOString(),
    years,
    firstDate: firstSeries[0].date,
    lastDate: firstSeries[firstSeries.length - 1].date,
    recordCount: firstSeries.length,
    sources: {
      btc: "data/index_btc.csv",
      me: "data/index_me.csv",
      wp: "data/index_wp.csv",
    },
  },
  series,
};

const output = `const DASHBOARD_DATA = Object.freeze(${JSON.stringify(payload, null, 2)});\n`;
fs.writeFileSync(path.join(outputDir, "generated-data.js"), output, "utf8");
console.log(`Đã tạo generated-data.js: ${firstSeries.length} ngày, ${years.join(", ")}; nguồn: ${Object.keys(series).join(", ")}`);
