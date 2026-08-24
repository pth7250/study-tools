import { calculateDday } from "./calculators/date.js";
import { calculateRankPercentile, getRankGrade } from "./calculators/rank.js";
import { calculateAverage, calculateGoalScore, calculatePerformanceScore, calculateWeightedAverage, getScoreGrade, parseScoreList } from "./calculators/score.js";
import { calculateNeisBytes, countCharacters } from "./calculators/text.js";
import { calculateAvailableStudyHours, calculateStudyMinutes, parseStudyDurations } from "./calculators/time.js";
import { formatTimerSeconds, TIMER_DURATION_SECONDS } from "./calculators/timer.js";
import { runWithResult, setResult } from "./ui/result.js";

const query = (selector, root = document) => root.querySelector(selector);

function inputValue(form, id) {
  return query(`#${id}`, form).value;
}

function numberValue(form, id) {
  const value = inputValue(form, id).trim();
  return value ? Number(value) : Number.NaN;
}

function formatHours(minutes) {
  return `총 공부시간 ${Math.floor(minutes / 60)}시간 ${minutes % 60}분`;
}

function setupCalculatorForms() {
  document.querySelectorAll("[data-calculator]").forEach((form) => {
    const result = query("[data-result]", form);
    const run = () => runWithResult(result, () => {
      const type = form.dataset.calculator;

      if (type === "average") {
        const average = calculateAverage(parseScoreList(inputValue(form, "scores")));
        setResult(result, `평균 ${average.toFixed(2)}점`);
      }

      if (type === "rank" || type === "grade5" || type === "grade9") {
        const percentile = calculateRankPercentile(numberValue(form, "rank"), numberValue(form, "total"));
        const system = type === "grade5" ? 5 : type === "grade9" ? 9 : null;
        const grade = getRankGrade(percentile, system);
        const suffix = grade ? ` · 예상 ${grade}등급` : "";
        setResult(result, `${type === "rank" ? "상위 약" : "누적비율"} ${percentile.toFixed(2)}%${suffix}`);
      }

      if (type === "performance") {
        const score = calculatePerformanceScore(numberValue(form, "examScore"), numberValue(form, "examWeight"), numberValue(form, "taskScore"), numberValue(form, "taskWeight"));
        setResult(result, `최종 환산점수 ${score.toFixed(2)}점`);
      }

      if (type === "goal") {
        const score = calculateGoalScore(numberValue(form, "current"), numberValue(form, "weight"), numberValue(form, "target"));
        setResult(result, score > 100 ? `필요 점수 ${score.toFixed(1)}점 · 100점을 넘어 목표 달성이 어렵습니다.` : score <= 0 ? "현재 점수만으로 목표점수에 도달할 수 있습니다." : `다음 시험에 필요한 점수 ${score.toFixed(1)}점`, score > 100);
      }

      if (type === "study") {
        setResult(result, formatHours(calculateStudyMinutes(parseStudyDurations(inputValue(form, "times")))));
      }

      if (type === "plan") {
        const hours = calculateAvailableStudyHours(numberValue(form, "days"), numberValue(form, "hours"));
        setResult(result, `확보 가능한 공부시간 ${hours.toFixed(1)}시간`);
      }

      if (type === "dday") {
        const days = calculateDday(inputValue(form, "date"));
        setResult(result, days > 0 ? `D-${days}` : days === 0 ? "D-Day" : `D+${Math.abs(days)}`);
      }

      if (type === "byte") {
        const text = inputValue(form, "text");
        setResult(result, `${calculateNeisBytes(text).toLocaleString()}B · ${Array.from(text).length.toLocaleString()}자`);
      }

      if (type === "chars") {
        const counts = countCharacters(inputValue(form, "text"));
        setResult(result, `${counts.withWhitespace.toLocaleString()}자 · 공백 포함 / ${counts.withoutWhitespace.toLocaleString()}자 · 공백 제외`);
      }
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      run();
    });

    if (form.dataset.calculator === "byte" || form.dataset.calculator === "chars") {
      query("#text", form).addEventListener("input", run);
    }
  });
}

function setupTabs() {
  const tabs = [...document.querySelectorAll("[data-target]")];
  const panels = [...document.querySelectorAll(".panel")];
  const search = query("#toolSearch");

  if (!tabs.length) return;

  const applySearch = () => {
    if (!search) return;
    const term = search.value.trim().toLowerCase();
    const cards = [...document.querySelectorAll(".panel.active .card")];
    cards.forEach((card) => { card.hidden = Boolean(term) && !card.textContent.toLowerCase().includes(term); });
    const empty = query("#emptyState");
    if (empty) empty.style.display = cards.some((card) => !card.hidden) ? "none" : "block";
  };

  tabs.forEach((tab) => tab.addEventListener("click", () => {
    tabs.forEach((item) => { item.classList.remove("active"); item.setAttribute("aria-selected", "false"); });
    panels.forEach((panel) => panel.classList.remove("active"));
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
    query(`#${tab.dataset.target}`)?.classList.add("active");
    applySearch();
    window.localStorage?.setItem("studytools-tab", tab.dataset.target);
  }));

  const saved = window.localStorage?.getItem("studytools-tab");
  const savedTab = tabs.find((tab) => tab.dataset.target === saved);
  if (savedTab) savedTab.click();
  if (search) search.addEventListener("input", applySearch);
}

function setupToday() {
  const element = query("#todayText");
  if (!element) return;
  const today = new Date();
  element.textContent = `오늘 ${today.getMonth() + 1}월 ${today.getDate()}일 기준`;
}

function setupTimer() {
  const display = query("#timerDisplay");
  if (!display) return;

  const startButton = query("#timerStart");
  const resetButton = query("#timerReset");
  const sessionCount = query("#sessionCount");
  let seconds = TIMER_DURATION_SECONDS;
  let running = false;
  let interval = null;
  let sessions = 0;

  const render = () => { display.textContent = formatTimerSeconds(seconds); };
  const reset = () => {
    window.clearInterval(interval);
    interval = null;
    running = false;
    seconds = TIMER_DURATION_SECONDS;
    startButton.textContent = "시작";
    render();
  };
  const start = () => {
    if (running) return;
    running = true;
    startButton.textContent = "일시정지";
    interval = window.setInterval(() => {
      if (seconds > 0) {
        seconds -= 1;
        render();
        return;
      }

      window.clearInterval(interval);
      interval = null;
      running = false;
      sessions += 1;
      sessionCount.textContent = String(sessions);
      seconds = TIMER_DURATION_SECONDS;
      startButton.textContent = "시작";
      render();
    }, 1000);
  };

  startButton.addEventListener("click", () => {
    if (running) {
      window.clearInterval(interval);
      interval = null;
      running = false;
      startButton.textContent = "계속";
    } else {
      start();
    }
  });
  resetButton.addEventListener("click", reset);
  render();
}

function createSubjectRow() {
  const row = document.createElement("div");
  row.className = "subject-row";
  row.innerHTML = '<input class="subject-name" aria-label="과목명" placeholder="예: 국어"><input class="subject-score" aria-label="점수" inputmode="decimal" type="number" min="0" max="100" step="0.1" placeholder="90"><input class="subject-weight" aria-label="반영비율 또는 가중치" inputmode="decimal" type="number" min="0.01" max="100" step="0.01" placeholder="1"><button class="remove-subject" type="button" aria-label="과목 삭제">×</button>';
  return row;
}

function setupSubjects() {
  const rows = query("#subjectRows");
  if (!rows) return;

  const result = query("#subjectResult");
  const addSubject = () => {
    const row = createSubjectRow();
    row.querySelector(".remove-subject").addEventListener("click", () => {
      if (rows.children.length > 1) row.remove();
      else setResult(result, "최소 1개 과목은 남겨주세요.", true);
    });
    rows.appendChild(row);
  };

  const resetSubjects = () => {
    rows.replaceChildren();
    addSubject();
    addSubject();
    addSubject();
    setResult(result, "과목을 1개 이상 입력하세요.");
  };

  query("#addSubject").addEventListener("click", addSubject);
  query("#resetSubjects").addEventListener("click", resetSubjects);
  query("#calcSubjects").addEventListener("click", () => runWithResult(result, () => {
    const subjects = [...rows.querySelectorAll(".subject-row")].map((row) => ({
      name: row.querySelector(".subject-name").value.trim(),
      scoreRaw: row.querySelector(".subject-score").value.trim(),
      weightRaw: row.querySelector(".subject-weight").value.trim()
    })).filter((subject) => subject.name || subject.scoreRaw || subject.weightRaw).map((subject) => ({
      name: subject.name,
      score: Number(subject.scoreRaw),
      weight: Number(subject.weightRaw)
    }));

    if (!subjects.length) throw new Error("과목을 1개 이상 입력하세요.");
    if (subjects.some((subject) => !subject.name || !Number.isFinite(subject.score) || subject.score < 0 || subject.score > 100 || !Number.isFinite(subject.weight) || subject.weight <= 0)) {
      throw new Error("과목명, 점수(0~100), 반영비율(0보다 큰 값)을 모두 올바르게 입력하세요.");
    }

    const average = calculateWeightedAverage(subjects);
    const gradeSystem = Number(query("#gradeSystem").value);
    const grade = getScoreGrade(average, gradeSystem);
    const gradeText = grade ? ` · 점수 기준 단순 참고: ${gradeSystem}등급제 ${grade}등급` : "";
    setResult(result, `가중 평균 ${average.toFixed(2)}점 · ${subjects.length}과목${gradeText}`);
  }));

  resetSubjects();
}

function init() {
  setupCalculatorForms();
  setupTabs();
  setupToday();
  setupSubjects();
  setupTimer();
}

window.addEventListener("DOMContentLoaded", init);
