const TARGET = "국립목포해양대학교";
const YEARS = [2024, 2025, 2026];
const COLORS = ["#003f5c", "#1f9a8a", "#d49122", "#d95745", "#3378b8"];

const defaultRows = [
  { year: 2024, university: "국립목포해양대학교", sci: 0.46, registered: 0.51, books: 0.12 },
  { year: 2025, university: "국립목포해양대학교", sci: 0.48, registered: 0.52, books: 0.14 },
  { year: 2026, university: "국립목포해양대학교", sci: 0.50, registered: 0.53, books: 0.15 },
  { year: 2024, university: "국립한국해양대학교", sci: 0.56, registered: 0.61, books: 0.15 },
  { year: 2025, university: "국립한국해양대학교", sci: 0.58, registered: 0.62, books: 0.16 },
  { year: 2026, university: "국립한국해양대학교", sci: 0.59, registered: 0.63, books: 0.16 },
  { year: 2024, university: "국립군산대학교", sci: 0.39, registered: 0.53, books: 0.14 },
  { year: 2025, university: "국립군산대학교", sci: 0.41, registered: 0.54, books: 0.15 },
  { year: 2026, university: "국립군산대학교", sci: 0.42, registered: 0.55, books: 0.15 },
  { year: 2024, university: "국립목포대학교", sci: 0.37, registered: 0.57, books: 0.13 },
  { year: 2025, university: "국립목포대학교", sci: 0.38, registered: 0.58, books: 0.13 },
  { year: 2026, university: "국립목포대학교", sci: 0.39, registered: 0.59, books: 0.14 },
  { year: 2024, university: "국립순천대학교", sci: 0.43, registered: 0.59, books: 0.12 },
  { year: 2025, university: "국립순천대학교", sci: 0.44, registered: 0.60, books: 0.12 },
  { year: 2026, university: "국립순천대학교", sci: 0.45, registered: 0.61, books: 0.13 }
];

let rows = [...defaultRows];
let activeMetric = "sci";
let trendMetric = "total";

const metricLabels = {
  sci: "SCI급 논문",
  registered: "등재·후보지 논문",
  books: "저역서",
  total: "전체 연구성과"
};

function metricValue(row, metric) {
  if (metric === "total") return row.sci + row.registered + row.books;
  return row[metric];
}

function groupedTotals(metric = "total") {
  const map = new Map();
  rows.forEach((row) => {
    map.set(row.university, (map.get(row.university) || 0) + metricValue(row, metric));
  });
  return [...map.entries()]
    .map(([university, value]) => ({ university, value }))
    .sort((a, b) => b.value - a.value);
}

function targetRows() {
  return rows.filter((row) => row.university === TARGET).sort((a, b) => a.year - b.year);
}

function sumFor(university, metric) {
  return rows
    .filter((row) => row.university === university)
    .reduce((sum, row) => sum + metricValue(row, metric), 0);
}

function renderHero() {
  const totals = groupedTotals("total");
  const target = totals.find((item) => item.university === TARGET);
  const max = totals[0]?.value || 1;
  const score = Math.round((target.value / max) * 100);
  const rank = totals.findIndex((item) => item.university === TARGET) + 1;

  document.getElementById("heroSummary").textContent =
    `${YEARS[0]}-${YEARS[YEARS.length - 1]} 공시연도 기준, 비교대학 5곳 중 누적 연구성과 ${rank}위입니다.`;
  document.getElementById("scoreValue").textContent = score;
  drawScore(score);
}

function renderMetrics() {
  const grid = document.getElementById("metricGrid");
  const cards = ["sci", "registered", "books"].map((metric) => {
    const total = sumFor(TARGET, metric);
    const rank = groupedTotals(metric).findIndex((item) => item.university === TARGET) + 1;
    return `<article class="metric-card"><span>${metricLabels[metric]}</span><strong>${total.toFixed(2)}</strong><span>3년 누적 ${rank}위</span></article>`;
  });
  grid.innerHTML = cards.join("");
}

function renderRank() {
  const list = document.getElementById("rankList");
  list.innerHTML = groupedTotals("total").map((item, index) => {
    const target = item.university === TARGET ? " target" : "";
    return `<div class="rank-item${target}">
      <div class="rank-index">${index + 1}</div>
      <div class="rank-name"><strong>${item.university}</strong><span>SCI+등재·후보+저역서</span></div>
      <div class="rank-score">${item.value.toFixed(2)}</div>
    </div>`;
  }).join("");
}

function renderInsights() {
  const target = targetRows();
  const first = target[0];
  const last = target[target.length - 1];
  const change = metricValue(last, trendMetric) - metricValue(first, trendMetric);
  const direction = change >= 0 ? "증가" : "감소";
  const rank = groupedTotals(trendMetric).findIndex((item) => item.university === TARGET) + 1;
  document.getElementById("insightList").innerHTML = `
    <li>${metricLabels[trendMetric]}은 ${first.year}년 대비 ${last.year}년에 ${Math.abs(change).toFixed(2)}포인트 ${direction}했습니다.</li>
    <li>최근 3년 누적 기준 ${metricLabels[trendMetric]} 순위는 비교대학 5곳 중 ${rank}위입니다.</li>
    <li>정확한 보고서 제출 전 대학알리미 원자료와 공시연도, 전임교원 1인당 환산 여부를 반드시 맞춰 주세요.</li>
  `;
}

function renderTable() {
  const tbody = document.querySelector("#dataTable tbody");
  tbody.innerHTML = rows
    .slice()
    .sort((a, b) => b.year - a.year || a.university.localeCompare(b.university, "ko"))
    .map((row) => `<tr>
      <td>${row.year}</td>
      <td>${row.university}</td>
      <td>${row.sci.toFixed(2)}</td>
      <td>${row.registered.toFixed(2)}</td>
      <td>${row.books.toFixed(2)}</td>
    </tr>`)
    .join("");
}

function renderAll() {
  renderHero();
  renderMetrics();
  renderRank();
  renderInsights();
  renderTable();
  drawBarChart();
  drawLineChart();
}

function setupTabs() {
  document.querySelectorAll(".tab").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((tab) => tab.classList.remove("active"));
      document.querySelectorAll(".view").forEach((view) => view.classList.remove("active"));
      button.classList.add("active");
      document.getElementById(`${button.dataset.tab}View`).classList.add("active");
      drawBarChart();
      drawLineChart();
    });
  });
}

function setupControls() {
  document.getElementById("metricSelect").addEventListener("change", (event) => {
    activeMetric = event.target.value;
    drawBarChart();
  });
  document.getElementById("trendMetricSelect").addEventListener("change", (event) => {
    trendMetric = event.target.value;
    renderInsights();
    drawLineChart();
  });
  document.getElementById("shareButton").addEventListener("click", async () => {
    if (navigator.share) {
      await navigator.share({ title: document.title, url: location.href });
    } else {
      await navigator.clipboard.writeText(location.href);
      alert("앱 주소를 복사했습니다.");
    }
  });
  document.getElementById("csvInput").addEventListener("change", handleCsv);
}

function drawScore(score) {
  const canvas = document.getElementById("scoreCanvas");
  const ctx = canvas.getContext("2d");
  const cx = 60;
  const cy = 60;
  ctx.clearRect(0, 0, 120, 120);
  ctx.lineWidth = 12;
  ctx.strokeStyle = "#e6eef1";
  ctx.beginPath();
  ctx.arc(cx, cy, 46, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = "#1f9a8a";
  ctx.beginPath();
  ctx.arc(cx, cy, 46, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (score / 100));
  ctx.stroke();
}

function drawBarChart() {
  const canvas = document.getElementById("barChart");
  const ctx = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.max(320, rect.width * devicePixelRatio);
  canvas.height = 260 * devicePixelRatio;
  ctx.scale(devicePixelRatio, devicePixelRatio);
  const width = canvas.width / devicePixelRatio;
  const height = 260;
  ctx.clearRect(0, 0, width, height);

  const data = groupedTotals(activeMetric);
  const max = Math.max(...data.map((d) => d.value), 1);
  const left = 92;
  const right = 18;
  const barH = 28;
  const gap = 16;

  ctx.font = "12px system-ui";
  data.forEach((item, index) => {
    const y = 20 + index * (barH + gap);
    const label = item.university.replace("국립", "");
    const barW = ((width - left - right) * item.value) / max;
    ctx.fillStyle = COLORS[index % COLORS.length];
    ctx.fillRect(left, y, barW, barH);
    ctx.fillStyle = "#14212b";
    ctx.textAlign = "right";
    ctx.fillText(label, left - 8, y + 19);
    ctx.textAlign = "left";
    ctx.fillText(item.value.toFixed(2), left + barW + 6, y + 19);
  });
}

function drawLineChart() {
  const canvas = document.getElementById("lineChart");
  const ctx = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.max(320, rect.width * devicePixelRatio);
  canvas.height = 280 * devicePixelRatio;
  ctx.scale(devicePixelRatio, devicePixelRatio);
  const width = canvas.width / devicePixelRatio;
  const height = 280;
  const pad = { left: 44, right: 18, top: 18, bottom: 36 };
  const data = targetRows().map((row) => ({ year: row.year, value: metricValue(row, trendMetric) }));
  const max = Math.max(...data.map((d) => d.value), 1);
  const min = Math.min(0, ...data.map((d) => d.value));

  ctx.clearRect(0, 0, width, height);
  ctx.strokeStyle = "#dbe4e8";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(pad.left, pad.top);
  ctx.lineTo(pad.left, height - pad.bottom);
  ctx.lineTo(width - pad.right, height - pad.bottom);
  ctx.stroke();

  const x = (i) => pad.left + ((width - pad.left - pad.right) * i) / (data.length - 1);
  const y = (v) => height - pad.bottom - ((height - pad.top - pad.bottom) * (v - min)) / (max - min || 1);

  ctx.strokeStyle = "#003f5c";
  ctx.lineWidth = 3;
  ctx.beginPath();
  data.forEach((point, index) => {
    if (index === 0) ctx.moveTo(x(index), y(point.value));
    else ctx.lineTo(x(index), y(point.value));
  });
  ctx.stroke();

  ctx.fillStyle = "#1f9a8a";
  data.forEach((point, index) => {
    ctx.beginPath();
    ctx.arc(x(index), y(point.value), 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#14212b";
    ctx.textAlign = "center";
    ctx.font = "12px system-ui";
    ctx.fillText(point.value.toFixed(2), x(index), y(point.value) - 12);
    ctx.fillText(point.year, x(index), height - 12);
    ctx.fillStyle = "#1f9a8a";
  });
}

function handleCsv(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      rows = parseCsv(String(reader.result));
      document.getElementById("dataNotice").style.display = "none";
      renderAll();
    } catch (error) {
      alert(error.message);
    }
  };
  reader.readAsText(file, "utf-8");
}

async function loadBundledCsv() {
  try {
    const response = await fetch("data/research-data.csv", { cache: "no-store" });
    if (!response.ok) return;
    rows = parseCsv(await response.text());
  } catch {
    // Direct file opening can block fetch; bundled defaults keep the app usable.
  }
}

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  const header = lines.shift().split(",").map((cell) => cell.trim());
  const required = ["year", "university", "sci", "registered", "books"];
  const missing = required.filter((name) => !header.includes(name));
  if (missing.length) throw new Error(`CSV 열이 부족합니다: ${missing.join(", ")}`);
  return lines.map((line) => {
    const cells = line.split(",").map((cell) => cell.trim());
    const row = Object.fromEntries(header.map((key, index) => [key, cells[index]]));
    return {
      year: Number(row.year),
      university: row.university,
      sci: Number(row.sci),
      registered: Number(row.registered),
      books: Number(row.books)
    };
  }).filter((row) => YEARS.includes(row.year));
}

setupTabs();
setupControls();
loadBundledCsv().finally(renderAll);
