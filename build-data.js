const fs = require("fs");
const path = require("path");

const outputDir = __dirname;
const sources = {
  btc: path.join(outputDir, "data", "index_btc.csv"),
  me: path.join(outputDir, "data", "index_me.csv"),
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

const btc = readCsv("BTC", sources.btc);
const me = readCsv("Chây đờ", sources.me);
const btcDates = new Set(btc.map((item) => item.date));
const meDates = new Set(me.map((item) => item.date));
const missingInBtc = me.filter((item) => !btcDates.has(item.date)).map((item) => item.date);
const missingInMe = btc.filter((item) => !meDates.has(item.date)).map((item) => item.date);

if (missingInBtc.length || missingInMe.length) {
  throw new Error(`Hai nguồn không cùng tập ngày. Thiếu BTC: ${missingInBtc.length}; thiếu chây đờ: ${missingInMe.length}`);
}

const years = [...new Set(me.map((item) => Number(item.date.slice(0, 4))))];
const payload = {
  meta: {
    generatedAt: new Date().toISOString(),
    years,
    firstDate: me[0].date,
    lastDate: me[me.length - 1].date,
    recordCount: me.length,
    sources: {
      btc: "data/index_btc.csv",
      me: "data/index_me.csv",
    },
  },
  series: { me, btc },
};

const output = `const DASHBOARD_DATA = Object.freeze(${JSON.stringify(payload, null, 2)});\n`;
fs.writeFileSync(path.join(outputDir, "data.js"), output, "utf8");
console.log(`Đã tạo data.js: ${me.length} ngày, ${years.join(", ")}`);
