let charts = {};

const MONTH_NAMES = [
  "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
  "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12",
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

function analyzeLag(monthRecords, meChanges, btcChanges, lag) {
  let same = 0;
  let opposite = 0;
  let neutral = 0;

  monthRecords.forEach(({ date }) => {
    const meDelta = meChanges.get(date);
    const btcDelta = btcChanges.get(moveIsoDate(date, lag));
    if (meDelta === undefined || btcDelta === undefined) return;
    const product = direction(meDelta) * direction(btcDelta);
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

function renderSummary(meValues, btcValues, bestLag, recordCount) {
  const cards = [
    ["Số ngày trong tháng", recordCount, "Ghép theo ngày ISO thực tế"],
    ["Trung bình chây đờ", average(meValues).toFixed(1), "Nguồn index_me.csv"],
    ["Trung bình BTC", average(btcValues).toFixed(1), "Nguồn index_btc.csv"],
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
      <p class="method-note">Quy ước: với độ trễ <strong>là do mình tự đặt</strong>.</p>
    </div>
    <table>
      <thead>
        <tr>
          <th>Độ trễ BTC</th>
          <th>Cặp có hướng</th>
          <th>Đồng pha</th>
          <th>Nghịch pha</th>
          <th>Có giá trị đứng yên</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <p class="method-note">Dòng nổi bật được chọn theo tỷ lệ đồng pha cao nhất; nếu bằng nhau, ưu tiên nhiều cặp có hướng hơn rồi ưu tiên độ trễ gần 0 hơn. Biến động ngày đầu tháng vẫn dùng ngày liền trước trên dòng thời gian đầy đủ, kể cả khi nằm ở tháng hoặc năm trước.</p>
  `;
}

function loadData() {
  const year = Number(document.getElementById("year").value);
  const month = Number(document.getElementById("month").value);
  const monthPrefix = `${year}-${String(month).padStart(2, "0")}-`;
  const meMonth = DASHBOARD_DATA.series.me.filter((item) => item.date.startsWith(monthPrefix));
  const btcMonth = DASHBOARD_DATA.series.btc.filter((item) => item.date.startsWith(monthPrefix));

  if (!meMonth.length || meMonth.length !== btcMonth.length) {
    document.getElementById("analysis").innerHTML = "<p>Không có đủ dữ liệu khớp ngày cho tháng đã chọn.</p>";
    return;
  }

  const labels = meMonth.map((item) => String(Number(item.date.slice(-2))));
  const meValues = meMonth.map((item) => item.value);
  const btcValues = btcMonth.map((item) => item.value);
  const meAverage = average(meValues);
  const btcAverage = average(btcValues);

  renderLineChart("compare", "compareChart", labels, [
    lineDataset("Chây đờ", meValues, { color: "#141414" }),
    lineDataset("BTC", btcValues, { color: "#777", dash: [7, 5] }),
  ], "Chỉ số");
  renderLineChart("me", "meChart", labels, [
    lineDataset("Chây đờ", meValues, { color: "#141414" }),
    lineDataset(`Trung bình ${meAverage.toFixed(1)}`, Array(labels.length).fill(meAverage), { color: "#999", dash: [5, 5], points: false, width: 1.5 }),
  ], "Chỉ số chây đờ");
  renderLineChart("btc", "btcChart", labels, [
    lineDataset("BTC", btcValues, { color: "#333" }),
    lineDataset(`Trung bình ${btcAverage.toFixed(1)}`, Array(labels.length).fill(btcAverage), { color: "#999", dash: [5, 5], points: false, width: 1.5 }),
  ], "Chỉ số BTC");

  const meChanges = calculateChanges(DASHBOARD_DATA.series.me);
  const btcChanges = calculateChanges(DASHBOARD_DATA.series.btc);
  const results = [-2, -1, 0, 1, 2].map((lag) => analyzeLag(meMonth, meChanges, btcChanges, lag));
  const bestLag = [...results].sort((a, b) =>
    b.samePercent - a.samePercent ||
    b.directional - a.directional ||
    Math.abs(a.lag) - Math.abs(b.lag) ||
    a.lag - b.lag
  )[0];

  renderSummary(meValues, btcValues, bestLag, meMonth.length);
  renderAnalysis(results, bestLag, year, month);
  document.getElementById("rangeNote").textContent = `${MONTH_NAMES[month - 1]} ${year} · ${meMonth[0].date} đến ${meMonth[meMonth.length - 1].date}`;
}

function initialize() {
  if (typeof DASHBOARD_DATA === "undefined" || !DASHBOARD_DATA.series?.me || !DASHBOARD_DATA.series?.btc) {
    document.getElementById("analysis").innerHTML = "<p>Không tải được data.js.</p>";
    return;
  }

  const yearSelect = document.getElementById("year");
  yearSelect.innerHTML = DASHBOARD_DATA.meta.years.map((year) => `<option value="${year}">${year}</option>`).join("");
  const preferredYear = DASHBOARD_DATA.meta.years.includes(2026) ? 2026 : DASHBOARD_DATA.meta.years.at(-1);
  yearSelect.value = String(preferredYear);
  document.getElementById("month").value = "1";
  yearSelect.addEventListener("change", loadData);
  document.getElementById("month").addEventListener("change", loadData);
  document.getElementById("dataSource").textContent =
    `Nguồn: ${DASHBOARD_DATA.meta.sources.me} và ${DASHBOARD_DATA.meta.sources.btc} · ${DASHBOARD_DATA.meta.recordCount} ngày · ${DASHBOARD_DATA.meta.firstDate} đến ${DASHBOARD_DATA.meta.lastDate}`;
  loadData();
}

document.addEventListener("DOMContentLoaded", initialize);
