// ===== GATE CSE 2027 Earning Dashboard =====
// App State & localStorage persistence

(function () {
  "use strict";

  // ===== State =====
  const STATE_KEY = "gate-earn-dashboard-v1";
  const defaultState = {
    theme: "dark",
    leetcode: 0,
    income: 0,
    activeWeek: 1,
    loopsActive: 0,
    checklist: {},
    pwsLabs: 0,
    calcSliders: {},
    calcChecks: {},
  };

  function isPlainObject(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  }

  function clampInt(value, min, max, fallback) {
    const num = Math.trunc(Number(value));
    if (!Number.isFinite(num)) return fallback;
    return Math.min(max, Math.max(min, num));
  }

  function sanitizeState(raw) {
    if (!isPlainObject(raw)) return { ...defaultState };

    const next = { ...defaultState };
    next.theme = raw.theme === "light" ? "light" : "dark";
    next.leetcode = clampInt(raw.leetcode, 0, Number.MAX_SAFE_INTEGER, 0);
    next.income = clampInt(raw.income, 0, Number.MAX_SAFE_INTEGER, 0);
    next.pwsLabs = clampInt(raw.pwsLabs, 0, 60, 0);
    next.activeWeek = clampInt(raw.activeWeek, 1, 13, 1);
    next.loopsActive = clampInt(raw.loopsActive, 0, 8, 0);

    next.checklist = {};
    if (isPlainObject(raw.checklist)) {
      for (let id = 1; id <= 8; id++) {
        next.checklist[id] = raw.checklist[id] === true;
      }
    }

    next.calcSliders = {};
    if (isPlainObject(raw.calcSliders)) {
      for (const key of Object.keys(raw.calcSliders)) {
        const pos = clampInt(raw.calcSliders[key], 0, 100, null);
        if (pos !== null) next.calcSliders[key] = pos;
      }
    }

    next.calcChecks = {};
    if (isPlainObject(raw.calcChecks)) {
      for (const key of Object.keys(raw.calcChecks)) {
        next.calcChecks[key] = raw.calcChecks[key] === true;
      }
    }

    return next;
  }

  let state = loadState();

  function loadState() {
    try {
      const saved = localStorage.getItem(STATE_KEY);
      if (saved) {
        return sanitizeState(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Failed to load state:", e);
    }
    return { ...defaultState };
  }

  let saveTimer = null;

  function saveState() {
    if (saveTimer !== null) {
      clearTimeout(saveTimer);
      saveTimer = null;
    }
    try {
      localStorage.setItem(STATE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("Failed to save state:", e);
    }
  }

  function scheduleSave() {
    if (saveTimer !== null) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      saveTimer = null;
      saveState();
    }, 150);
  }

  // Cross-tab sync: storage fires only in other tabs, so reload cannot loop.
  window.addEventListener("storage", (e) => {
    if (e.key !== STATE_KEY || e.newValue === null) return;
    location.reload();
  });

  // ===== Theme Toggle =====
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const html = document.documentElement;

  const ICON_SUN =
    '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>';
  const ICON_MOON =
    '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

  function applyTheme(theme, persist) {
    html.setAttribute("data-theme", theme);
    themeIcon.innerHTML = theme === "dark" ? ICON_SUN : ICON_MOON;
    themeToggle.setAttribute(
      "aria-label",
      theme === "dark" ? "Switch to light mode" : "Switch to dark mode",
    );
    state.theme = theme;
    if (persist !== false) saveState();
  }

  themeToggle.addEventListener("click", () => {
    applyTheme(state.theme === "dark" ? "light" : "dark", true);
  });

  // Apply saved theme (already on disk; do not rewrite on boot)
  applyTheme(state.theme, false);

  // ===== Stats =====
  const leetcodeCountEl = document.getElementById("leetcodeCount");
  const incomeCountEl = document.getElementById("incomeCount");
  const activeLoopsEl = document.getElementById("activeLoops");
  const weekCountEl = document.getElementById("weekCount");
  const leetcodeProgressEl = document.getElementById("leetcodeProgress");
  const incomeProgressEl = document.getElementById("incomeProgress");
  const loopProgressEl = document.getElementById("loopProgress");
  const weekProgressEl = document.getElementById("weekProgress");

  // Null = current week has no numeric loops in weekData (show placeholder)
  let displayedLoops = null;

  function setProgress(el, pct) {
    const clamped = Number.isFinite(pct) ? Math.min(100, Math.max(0, pct)) : 0;
    el.style.width = clamped + "%";
    el.setAttribute("aria-valuenow", String(Math.round(clamped)));
  }

  function updateStats() {
    leetcodeCountEl.textContent = String(state.leetcode);
    incomeCountEl.textContent = "₹" + formatNumber(state.income);
    if (displayedLoops === null) {
      activeLoopsEl.textContent = "\u2014";
      setProgress(loopProgressEl, 0);
    } else {
      activeLoopsEl.textContent = displayedLoops + "/8";
      setProgress(loopProgressEl, (displayedLoops / 8) * 100);
    }
    weekCountEl.textContent =
      state.activeWeek > 12 ? "Month 3+" : "Week " + state.activeWeek;

    setProgress(leetcodeProgressEl, (state.leetcode / 240) * 100);
    setProgress(incomeProgressEl, (state.income / 100000) * 100);
    setProgress(weekProgressEl, (state.activeWeek / 12) * 100);
  }

  // ===== Stat Steppers (LeetCode / Income / PortSwigger) =====
  const statBtns = document.querySelectorAll(".stat-btn");

  statBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const stat = btn.dataset.stat;
      const delta = parseInt(btn.dataset.delta, 10) || 0;
      if (stat === "leetcode") {
        state.leetcode = Math.max(0, state.leetcode + delta);
      } else if (stat === "income") {
        state.income = Math.max(0, state.income + delta);
      } else if (stat === "pws") {
        state.pwsLabs = Math.min(60, Math.max(0, state.pwsLabs + delta));
        updatePWS();
      }
      saveState();
      updateStats();
    });
  });

  function formatNumber(num) {
    if (!Number.isFinite(num) || num < 0) return "0";
    if (num >= 100000) return (num / 100000).toFixed(1) + "L";
    if (num >= 1000) return (num / 1000).toFixed(num >= 10000 ? 0 : 1) + "K";
    return num.toString();
  }

  // Full INR strings use en-IN grouping (Rs 1,00,000 style)
  const inrFmt = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

  // ===== Timeline =====
  const timelineWeeksEl = document.getElementById("timelineWeeks");
  const timelineDetailContentEl = document.getElementById(
    "timelineDetailContent",
  );

  const weekData = [
    {
      week: 1,
      label: "W1",
      title: "Week 1-2: Foundation",
      desc: "Discrete Math, Engg Math - LEARN only. Only active loop: CP contests. No freelancing yet. Focus on building math foundation.",
      targets: ["60 LeetCode", "Rs 5-10K", "Math+DM PYQs"],
      loops: 1,
    },
    {
      week: 2,
      label: "W2",
      title: "Week 1-2: Foundation",
      desc: "Discrete Math, Engg Math - LEARN only. Only active loop: CP contests. Only earning: CodeChef/LeetCode weekly contests.",
      targets: ["60 LeetCode", "Rs 5-10K", "Math+DM PYQs"],
      loops: 1,
    },
    {
      week: 3,
      label: "W3",
      title: "Week 3-4: PDSA Loop",
      desc: "DSA basics - PDSA LOOP ACTIVE - Python scripts + Fiverr gigs. First freelancing gigs on Fiverr. Build 2-3 small Python projects for portfolio.",
      targets: ["120 LeetCode", "Rs 10-20K", "Web scraper + SQL project"],
      loops: 4,
    },
    {
      week: 4,
      label: "W4",
      title: "Week 3-4: PDSA Loop",
      desc: "DSA basics - PDSA LOOP ACTIVE - Python scripts + Fiverr gigs. Start Week 3. Build 2-3 small Python projects for portfolio.",
      targets: ["120 LeetCode", "Rs 10-20K", "Web scraper + SQL project"],
      loops: 4,
    },
    {
      week: 5,
      label: "W5",
      title: "Week 5-6: COA+DL Loop",
      desc: "COA + Digital Logic - COA+DL LOOP ACTIVE - Verilog basics. Start Month 3.",
      targets: ["Start Verilog projects", "Apply for hardware internships"],
      loops: null,
    },
    {
      week: 6,
      label: "W6",
      title: "Week 5-6: COA+DL Loop",
      desc: "COA + Digital Logic - COA+DL LOOP ACTIVE - Verilog basics. Start Month 3.",
      targets: ["Start Verilog projects", "Apply for hardware internships"],
      loops: null,
    },
    {
      week: 7,
      label: "W7",
      title: "Week 7-8: OS+CN Loops",
      desc: "OS + CN - OS+CN LOOPS ACTIVE - Linux + Wireshark. Linux server setup for portfolio. Wireshark labs. Start applying for SRE/sysadmin internships. Start Month 2-3.",
      targets: ["160 LeetCode", "Rs 5-15K", "Linux server setup"],
      loops: null,
    },
    {
      week: 8,
      label: "W8",
      title: "Week 7-8: OS+CN Loops",
      desc: "OS + CN - OS+CN LOOPS ACTIVE - Linux + Wireshark. Nov: College exams - pause new loops, maintain existing.",
      targets: ["160 LeetCode", "Rs 5-15K", "Linux server setup"],
      loops: null,
    },
    {
      week: 9,
      label: "W9",
      title: "Week 9-10: DBMS+TOC+Compiler",
      desc: "DBMS + TOC + Compiler - DBMS+TOC+COMP LOOPS ACTIVE - SQL + NLP + API. SQL portfolio + data analysis projects. Regex engine + chatbot + API development gigs. Start Month 2-3.",
      targets: ["200 LeetCode", "Rs 5-15K", "SQL portfolio + API"],
      loops: null,
    },
    {
      week: 10,
      label: "W10",
      title: "Week 9-10: DBMS+TOC+Compiler",
      desc: "DBMS + TOC + Compiler - DBMS+TOC+COMP LOOPS ACTIVE - SQL + NLP + API. Dec: PYQs + mocks start. Resume loops.",
      targets: ["200 LeetCode", "Rs 5-15K", "SQL portfolio + API"],
      loops: null,
    },
    {
      week: 11,
      label: "W11",
      title: "Week 11-12: All Loops",
      desc: "Revise all - ALL LOOPS RUNNING - Peak earning. All 8 loops active simultaneously. Maximum freelancing output.",
      targets: ["240 LeetCode", "Rs 15-30K", "Peak earning loops"],
      loops: 8,
    },
    {
      week: 12,
      label: "W12",
      title: "Week 11-12: All Loops",
      desc: "Revise all - ALL LOOPS RUNNING - Peak earning. Jan 2027: Mock tests + revision + DA.",
      targets: ["240 LeetCode", "Rs 15-30K", "Peak earning loops"],
      loops: 8,
    },
    {
      week: 13,
      label: "M3+",
      title: "Month 3+: Maintenance + Feb 2027 Taper",
      desc: "Revision only - MAINTENANCE MODE - Continue earning. Reduce new project creation. Focus on contest prizes + existing gig maintenance. Feb 2027: EXAM READY - taper loops before GATE.",
      targets: ["240+ LeetCode", "Rs 5-10K", "Taper before GATE"],
      loops: null,
    },
  ];

  function getPhaseForWeek(week) {
    if (week <= 2) return "Foundation";
    if (week <= 4) return "PDSA";
    if (week <= 6) return "COA+DL";
    if (week <= 8) return "OS+CN";
    if (week <= 10) return "DBMS+TOC";
    if (week <= 12) return "Peak";
    return "Taper";
  }

  function renderTimeline() {
    const restoreFocus =
      document.activeElement !== null &&
      timelineWeeksEl.contains(document.activeElement);

    timelineWeeksEl.innerHTML = "";
    weekData.forEach((data) => {
      const weekEl = document.createElement("button");
      weekEl.type = "button";
      weekEl.className = "timeline-week";
      const status =
        data.week === state.activeWeek
          ? "active"
          : data.week < state.activeWeek
            ? "completed"
            : "upcoming";
      weekEl.setAttribute(
        "aria-label",
        `Week ${data.week}, ${getPhaseForWeek(data.week)}, ${status}`,
      );
      if (data.week === state.activeWeek) {
        weekEl.setAttribute("aria-current", "true");
      }
      weekEl.innerHTML = `
        <span class="week-dot ${data.week <= state.activeWeek ? "completed" : ""} ${data.week === state.activeWeek ? "active" : ""}"></span>
        <span class="week-label">${data.label}</span>
      `;
      weekEl.addEventListener("click", () => showWeekDetail(data));
      timelineWeeksEl.appendChild(weekEl);
    });

    if (restoreFocus) {
      const buttons = timelineWeeksEl.querySelectorAll(".timeline-week");
      const target = buttons[state.activeWeek - 1] || buttons[0];
      if (target) target.focus();
    }
  }

  function showWeekDetail(data) {
    const swap = () => {
      timelineDetailContentEl.innerHTML = `
        <h3>${data.title}</h3>
        <p>${data.desc}</p>
        <div class="detail-targets">
          ${data.targets.map((t) => `<span>${t}</span>`).join("")}
        </div>
      `;
      state.activeWeek = clampInt(data.week, 1, 13, 1);
      if (typeof data.loops === "number" && Number.isFinite(data.loops)) {
        state.loopsActive = clampInt(data.loops, 0, 8, 0);
        displayedLoops = state.loopsActive;
      } else {
        displayedLoops = null;
      }
      saveState();
      updateStats();
      renderTimeline();
    };

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!reduced && document.startViewTransition) {
      document.startViewTransition(swap);
    } else {
      swap();
    }
  }

  // ===== Income Calculator =====
  const calcItems = Array.from(document.querySelectorAll(".calc-item"));
  const calcTotalEl = document.getElementById("calcTotal");
  const calcRangeEl = document.getElementById("calcRange");

  function calcValueFromSlider(min, max, sliderPos) {
    const pos = Math.min(100, Math.max(0, sliderPos));
    return Math.round(min + ((max - min) * pos) / 100);
  }

  // Pure: sum of current values; range = sum of mins .. sum of maxs
  function computeCalcTotals(entries) {
    let total = 0;
    let totalMin = 0;
    let totalMax = 0;
    let anyChecked = false;
    for (const entry of entries) {
      if (!entry.checked) continue;
      anyChecked = true;
      total += entry.value;
      totalMin += entry.min;
      totalMax += entry.max;
    }
    return { total, totalMin, totalMax, anyChecked };
  }

  function readCalcItem(item) {
    const check = item.querySelector(".calc-check");
    const slider = item.querySelector(".calc-slider");
    const valueEl = item.querySelector(".calc-value");
    const min = parseInt(slider.dataset.min, 10) || 0;
    const max = parseInt(slider.dataset.max, 10) || 0;
    const rawPos = parseInt(slider.value, 10);
    const pos = Number.isFinite(rawPos)
      ? Math.min(100, Math.max(0, rawPos))
      : 0;
    const checked = check.checked;
    return { check, slider, valueEl, min, max, pos, checked };
  }

  function updateCalculator() {
    const entries = calcItems.map((item) => {
      const entry = readCalcItem(item);
      const value = entry.checked
        ? calcValueFromSlider(entry.min, entry.max, entry.pos)
        : 0;
      entry.valueEl.textContent = inrFmt.format(value);
      entry.slider.disabled = !entry.checked;
      return { ...entry, value };
    });

    const { total, totalMin, totalMax, anyChecked } =
      computeCalcTotals(entries);

    calcTotalEl.textContent = inrFmt.format(Number.isFinite(total) ? total : 0);
    calcRangeEl.textContent = anyChecked
      ? `Range: ${inrFmt.format(totalMin)} - ${inrFmt.format(totalMax)}`
      : "Enable activities above to estimate";

    entries.forEach((entry, i) => {
      state.calcSliders[i] = entry.pos;
      state.calcChecks[i] = entry.checked;
    });
  }

  calcItems.forEach((item, i) => {
    const check = item.querySelector(".calc-check");
    const slider = item.querySelector(".calc-slider");
    if (state.calcSliders[i] !== undefined) {
      slider.value = String(state.calcSliders[i]);
    }
    if (state.calcChecks[i] !== undefined) check.checked = state.calcChecks[i];

    slider.addEventListener("input", () => {
      updateCalculator();
      scheduleSave();
    });
    slider.addEventListener("change", () => {
      updateCalculator();
      saveState();
    });
    check.addEventListener("change", () => {
      updateCalculator();
      saveState();
    });
  });

  updateCalculator();

  // ===== Checklist =====
  const checkInputs = document.querySelectorAll(".check-input");
  const checklistProgressEl = document.getElementById("checklistProgress");
  const checklistLabelEl = document.getElementById("checklistLabel");

  function updateChecklist() {
    let checked = 0;
    checkInputs.forEach((input) => {
      const id = input.dataset.id;
      input.checked = !!state.checklist[id];
      if (state.checklist[id]) checked++;
    });
    const total = checkInputs.length;
    setProgress(checklistProgressEl, total > 0 ? (checked / total) * 100 : 0);
    checklistLabelEl.textContent = `${checked}/${total} completed`;
  }

  checkInputs.forEach((input) => {
    input.addEventListener("change", () => {
      state.checklist[input.dataset.id] = input.checked;
      saveState();
      updateChecklist();
    });
  });

  updateChecklist();

  // ===== PortSwigger Labs =====
  const pwsProgressEl = document.getElementById("pwsProgress");
  const pwsLabelEl = document.getElementById("pwsLabel");

  function updatePWS() {
    setProgress(pwsProgressEl, (state.pwsLabs / 60) * 100);
    pwsLabelEl.textContent = `${state.pwsLabs}/60 labs`;
  }

  updatePWS();

  // ===== Initialize =====
  showWeekDetail(weekData[state.activeWeek - 1] || weekData[0]);
})();
