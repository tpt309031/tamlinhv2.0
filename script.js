let charts = {};
let dashboardData = null;

const MONTH_NAMES = [
  "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
  "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12",
];

const WP_FROM_BTC_PATCHES = [
  { i: 875, v: 77 }, { i: 876, v: 29 }, { i: 877, v: 47 }, { i: 878, v: 35 },
  { i: 879, v: 41 }, { i: 880, v: 35 }, { i: 881, v: 41 }, { i: 882, v: 29 },
  { i: 883, v: 35 }, { i: 884, v: 29 }, { i: 885, v: 59 }, { i: 886, v: 35 },
  { i: 887, v: 29 }, { i: 888, v: 77 },
];

function toUtcDate(isoDate) {
  return new Date(`${isoDate}T00:00:00Z`);
}

function moveIsoDate(isoDate, days) {
  const date = toUtcDate(isoDate);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function average(values) {
  return values.length ? values.reduce((total, value) => total + value, 0) / values.length : 0;
}

function direction(delta) {
  return delta === 0 ? 0 : Math.sign(delta);
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function parseCsvDate(value, sourceName, lineNumber) {
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(value);
  if (!match) throw new Error(`${sourceName}: sai ngày ở dòng ${lineNumber}: ${value}`);
  const month = Number(match[1]);
  const day = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    throw new Error(`${sourceName}: ngày không tồn tại ở dòng ${lineNumber}: ${value}`);
  }
  return `${year}-${pad(month)}-${pad(day)}`;
}

async function readCsvSeries(key, config) {
  const response = await fetch(config.file);
  if (!response.ok) throw new Error(`Không tải được ${config.file}`);
  const lines = (await response.text()).trim().split(/\r?\n/);
  const header = lines.shift().replace(/^\uFEFF/, "");
  if (header !== "date,score_percent") throw new Error(`${config.file}: header phải là date,score_percent`);

  const seen = new Set();
  const records = lines.map((line, index) => {
    const [rawDate, rawValue, extra] = line.split(",");
    const lineNumber = index + 2;
    if (extra !== undefined) throw new Error(`${config.file}: thừa cột ở dòng ${lineNumber}`);
    const date = parseCsvDate(rawDate, config.label, lineNumber);
    const value = Number(rawValue);
    if (!Number.isFinite(value)) throw new Error(`${config.file}: chỉ số lỗi ở ${date}`);
    if (seen.has(date)) throw new Error(`${config.file}: trùng ngày ${date}`);
    seen.add(date);
    return { date, value, key };
  });

  records.sort((a, b) => a.date.localeCompare(b.date));
  for (let index = 1; index < records.length; index += 1) {
    if (moveIsoDate(records[index - 1].date, 1) !== records[index].date) {
      throw new Error(`${config.file}: thiếu ngày giữa ${records[index - 1].date} và ${records[index].date}`);
    }
  }
  return records;
}

function deriveWpFromBtc(btcRecords) {
  const records = btcRecords.map((item) => ({ date: item.date, value: item.value, key: "wp" }));
  WP_FROM_BTC_PATCHES.forEach(({ i, v }) => {
    if (!records[i]) throw new Error(`WP patch lệch vị trí ${i}`);
    records[i] = { ...records[i], value: v };
  });
  return records;
}

async function loadWpSeries(config, btcRecords) {
  try {
    return await readCsvSeries("wp", config);
  } catch (error) {
    console.info(`Không tải được ${config.file}; dùng 14 điểm patch từ index_wp.csv.`, error);
    return deriveWpFromBtc(btcRecords);
  }
}

function assertSameDateSet(series) {
  const entries = Object.entries(series);
  const [baseKey, baseRecords] = entries[0];
  const baseDates = baseRecords.map((item) => item.date);

  entries.slice(1).forEach(([key, records]) => {
    if (records.length !== baseRecords.length) {
      throw new Error(`${key} có ${records.length} ngày, khác ${baseKey} ${baseRecords.length} ngày`);
    }
    records.forEach((item, index) => {
      if (item.date !== baseDates[index]) throw new Error(`${key} lệch ngày tại ${item.date}`);
    });
  });
}

async function loadDashboardData() {
  const fallbackConfig = {
    sources: {
      me: {
        label: "Chây đờ",
        shortLabel: "CHÂY ĐỜ",
        file: "index_me.csv",
        color: "#141414",
        width: 2.2,
      },
      btc: {
        label: "BTC",
        shortLabel: "BTC",
        file: "index_btc.csv",
        color: "#f7931a",
        width: 3,
      },
      wp: {
        label: "WP",
        shortLabel: "WP",
        file: "index_wp.csv",
        color: "#8b0000",
        width: 3,
      },
    },
    primaryKey: "me",
    lagTargetKey: "btc",
  };
  const embeddedConfig = typeof DASHBOARD_DATA_CONFIG !== "undefined" ? DASHBOARD_DATA_CONFIG : null;
  const embeddedData = typeof DASHBOARD_DATA !== "undefined" ? DASHBOARD_DATA : null;
  const config = embeddedConfig || fallbackConfig;
  if (!config?.sources) throw new Error("Thiếu DASHBOARD_DATA_CONFIG trong data.js");

  if (embeddedData?.series) {
    const series = {
      me: embeddedData.series.me,
      btc: embeddedData.series.btc,
      wp: await loadWpSeries(config.sources.wp, embeddedData.series.btc),
    };
    assertSameDateSet(series);
    const firstSeries = Object.values(series)[0];
    return {
      config,
      series,
      meta: {
        years: [...new Set(firstSeries.map((item) => Number(item.date.slice(0, 4))))],
        firstDate: firstSeries[0].date,
        lastDate: firstSeries[firstSeries.length - 1].date,
        recordCount: firstSeries.length,
      },
    };
  }

  const loaded = await Promise.all(
    Object.entries(config.sources).map(async ([key, itemConfig]) => [key, await readCsvSeries(key, itemConfig)])
  );
  const series = Object.fromEntries(loaded);
  assertSameDateSet(series);

  const firstSeries = Object.values(series)[0];
  return {
    config,
    series,
    meta: {
      years: [...new Set(firstSeries.map((item) => Number(item.date.slice(0, 4))))],
      firstDate: firstSeries[0].date,
      lastDate: firstSeries[firstSeries.length - 1].date,
      recordCount: firstSeries.length,
    },
  };
}

function buildSeriesIndex(records) {
  return new Map(records.map((item) => [item.date, item.value]));
}

function calculateChanges(records) {
  const valueByDate = buildSeriesIndex(records);
  const changeByDate = new Map();
  records.forEach((item) => {
    const previousValue = valueByDate.get(moveIsoDate(item.date, -1));
    if (previousValue !== undefined) changeByDate.set(item.date, item.value - previousValue);
  });
  return changeByDate;
}

function analyzeLag(monthRecords, primaryChanges, targetChanges, lag) {
  let same = 0;
  let opposite = 0;
  let neutral = 0;

  monthRecords.forEach(({ date }) => {
    const primaryDelta = primaryChanges.get(date);
    const targetDelta = targetChanges.get(moveIsoDate(date, lag));
    if (primaryDelta === undefined || targetDelta === undefined) return;
    const product = direction(primaryDelta) * direction(targetDelta);
    if (product > 0) same += 1;
    else if (product < 0) opposite += 1;
    else neutral += 1;
  });

  const directional = same + opposite;
  return {
    lag,
    same,
    opposite,
    neutral,
    directional,
    samePercent: directional ? (same / directional) * 100 : 0,
    oppositePercent: directional ? (opposite / directional) * 100 : 0,
  };
}

function destroyChart(name) {
  if (charts[name]) charts[name].destroy();
}

function chartOptions(yTitle) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    scales: {
      x: { grid: { display: false }, ticks: { maxRotation: 0, autoSkipPadding: 12 } },
      y: {
        beginAtZero: true,
        suggestedMax: 100,
        title: { display: true, text: yTitle },
        grid: { color: "#e5e5e5" },
      },
    },
    plugins: {
      legend: { labels: { color: "#333", usePointStyle: true, pointStyle: "line" } },
    },
  };
}

function lineDataset(label, values, options = {}) {
  return {
    label,
    data: values,
    borderColor: options.color || "#1b1b1b",
    borderDash: options.dash || [],
    borderWidth: options.width || 2,
    pointRadius: options.points === false ? 0 : 2.5,
    pointHoverRadius: 5,
    tension: 0.24,
    fill: false,
  };
}

function renderLineChart(name, canvasId, labels, datasets, yTitle) {
  destroyChart(name);
  charts[name] = new Chart(document.getElementById(canvasId), {
    type: "line",
    data: { labels, datasets },
    options: chartOptions(yTitle),
  });
}

function renderSummary(monthValuesByKey, bestLag, recordCount) {
  const sourceCards = Object.entries(dashboardData.config.sources).map(([key, config]) => [
    `Trung bình ${config.label}`,
    average(monthValuesByKey[key]).toFixed(1),
    key === "wp" ? "màu đỏ thẫm" : "theo data load được thực tế",
  ]);
  const cards = [
    ["Số ngày trong tháng", recordCount, "theo data load được thực tế"],
    ...sourceCards,
    ["Độ trễ nổi bật", `${bestLag.lag > 0 ? "+" : ""}${bestLag.lag} ngày`, `${bestLag.samePercent.toFixed(1)}% đồng pha`],
  ];
  document.getElementById("summary").innerHTML = cards.map(([label, value, note]) => `
    <article class="metric">
      <span class="metric-label">${label}</span>
      <strong class="metric-value">${value}</strong>
      <span class="metric-note">${note}</span>
    </article>
  `).join("");
}

function renderAnalysis(results, bestLag, year, month) {
  const primaryLabel = dashboardData.config.sources[dashboardData.config.primaryKey].label;
  const targetLabel = dashboardData.config.sources[dashboardData.config.lagTargetKey].label;
  const lagText = bestLag.lag > 0 ? `+${bestLag.lag}` : String(bestLag.lag);
  const conclusion = bestLag.same >= bestLag.opposite ? "ĐỒNG PHA" : "NGHỊCH PHA";
  const rows = results.map((result) => `
    <tr class="${result.lag === bestLag.lag ? "is-best" : ""}">
      <td>${result.lag > 0 ? "+" : ""}${result.lag} ngày</td>
      <td>${result.directional}</td>
      <td>${result.same} (${result.samePercent.toFixed(1)}%)</td>
      <td>${result.opposite} (${result.oppositePercent.toFixed(1)}%)</td>
      <td>${result.neutral}</td>
    </tr>
  `).join("");

  document.getElementById("analysis").innerHTML = `
    <div class="analysis-intro">
      <div class="analysis-callout">
        <strong>${conclusion} nổi bật tại độ trễ ${lagText} ngày</strong>
        <p>Trong ${MONTH_NAMES[month - 1].toLowerCase()} năm ${year}, độ trễ này có ${bestLag.samePercent.toFixed(1)}% cặp biến động đồng pha và ${bestLag.oppositePercent.toFixed(1)}% cặp biến động nghịch pha.</p>
      </div>
      <p class="method-note">Quy ước: ${primaryLabel} ngày D được so với ${targetLabel} ngày D + độ trễ. Cùng tăng/cùng giảm là đồng pha; một tăng một giảm là nghịch pha.</p>
    </div>
    <table>
      <thead>
        <tr>
          <th>Độ trễ ${targetLabel}</th>
          <th>Cặp có hướng</th>
          <th>Đồng pha</th>
          <th>Nghịch pha</th>
          <th>Có giá trị đứng yên</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <p class="method-note">Được chọn theo tỷ lệ đồng pha cao nhất. WP được thêm vào biểu đồ và thống kê tháng; lag analysis hiện vẫn giữ cặp ${primaryLabel} ↔ ${targetLabel} để không đổi nghĩa thuật toán cũ.</p>
  `;
}

function loadData() {
  const year = Number(document.getElementById("year").value);
  const month = Number(document.getElementById("month").value);
  const monthPrefix = `${year}-${String(month).padStart(2, "0")}-`;
  const monthRecordsByKey = Object.fromEntries(
    Object.entries(dashboardData.series).map(([key, records]) => [key, records.filter((item) => item.date.startsWith(monthPrefix))])
  );
  const firstMonthRecords = Object.values(monthRecordsByKey)[0];

  if (!firstMonthRecords.length || Object.values(monthRecordsByKey).some((records) => records.length !== firstMonthRecords.length)) {
    document.getElementById("analysis").innerHTML = "<p>Không có đủ dữ liệu.</p>";
    return;
  }

  const labels = firstMonthRecords.map((item) => String(Number(item.date.slice(-2))));
  const monthValuesByKey = Object.fromEntries(
    Object.entries(monthRecordsByKey).map(([key, records]) => [key, records.map((item) => item.value)])
  );

  renderLineChart("compare", "compareChart", labels, Object.entries(dashboardData.config.sources).map(([key, config]) =>
    lineDataset(config.label, monthValuesByKey[key], { color: config.color, width: config.width })
  ), "Chỉ số");

  Object.entries(dashboardData.config.sources).forEach(([key, config]) => {
    const values = monthValuesByKey[key];
    const monthlyAverage = average(values);
    renderLineChart(key, `${key}Chart`, labels, [
      lineDataset(config.label, values, { color: config.color, width: config.width }),
      lineDataset(`Trung bình ${monthlyAverage.toFixed(1)}`, Array(labels.length).fill(monthlyAverage), { color: "#999", dash: [5, 5], points: false, width: 1.5 }),
    ], `Chỉ số ${config.label}`);
  });

  const primaryKey = dashboardData.config.primaryKey;
  const targetKey = dashboardData.config.lagTargetKey;
  const primaryChanges = calculateChanges(dashboardData.series[primaryKey]);
  const targetChanges = calculateChanges(dashboardData.series[targetKey]);
  const results = [-2, -1, 0, 1, 2].map((lag) => analyzeLag(monthRecordsByKey[primaryKey], primaryChanges, targetChanges, lag));
  const bestLag = [...results].sort((a, b) =>
    b.samePercent - a.samePercent ||
    b.directional - a.directional ||
    Math.abs(a.lag) - Math.abs(b.lag) ||
    a.lag - b.lag
  )[0];

  renderSummary(monthValuesByKey, bestLag, firstMonthRecords.length);
  renderAnalysis(results, bestLag, year, month);
  document.getElementById("rangeNote").textContent = `${MONTH_NAMES[month - 1]} ${year} · ${firstMonthRecords[0].date} đến ${firstMonthRecords[firstMonthRecords.length - 1].date}`;
}

async function initialize() {
  try {
    dashboardData = await loadDashboardData();
    const yearSelect = document.getElementById("year");
    yearSelect.innerHTML = dashboardData.meta.years.map((year) => `<option value="${year}">${year}</option>`).join("");
    const preferredYear = dashboardData.meta.years.includes(2026) ? 2026 : dashboardData.meta.years.at(-1);
    yearSelect.value = String(preferredYear);
    document.getElementById("month").value = "1";
    yearSelect.addEventListener("change", loadData);
    document.getElementById("month").addEventListener("change", loadData);
    document.getElementById("dataSource").textContent =
      `Dữ liệu từ ngày · ${dashboardData.meta.firstDate} đến ${dashboardData.meta.lastDate} · ${Object.values(dashboardData.config.sources).map((item) => item.file).join(" · ")}`;
    loadData();
  } catch (error) {
    document.getElementById("analysis").innerHTML = `<p>Không tải được data: ${error.message}</p>`;
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", initialize);
