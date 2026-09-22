// ===== GATE CSE 2027 Earning Dashboard =====
// App State & localStorage persistence

(function () {
  'use strict';

  // ===== State =====
  const STATE_KEY = 'gate-earn-dashboard-v1';
  const defaultState = {
    theme: 'dark',
    leetcode: 0,
    income: 0,
    activeWeek: 1,
    loopsActive: 0,
    checklist: {},
    pwsLabs: 0,
    calcSliders: {},
    calcChecks: {},
  };

  let state = loadState();

  function loadState() {
    try {
      const saved = localStorage.getItem(STATE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...defaultState, ...parsed };
      }
    } catch (e) {
      console.warn('Failed to load state:', e);
    }
    return { ...defaultState };
  }

  function saveState() {
    try {
      localStorage.setItem(STATE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save state:', e);
    }
  }

  // ===== Theme Toggle =====
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const html = document.documentElement;

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    state.theme = theme;
    saveState();
  }

  themeToggle.addEventListener('click', () => {
    applyTheme(state.theme === 'dark' ? 'light' : 'dark');
  });

  // Apply saved theme
  applyTheme(state.theme);

  // ===== Stats =====
  const leetcodeCountEl = document.getElementById('leetcodeCount');
  const incomeCountEl = document.getElementById('incomeCount');
  const activeLoopsEl = document.getElementById('activeLoops');
  const weekCountEl = document.getElementById('weekCount');
  const leetcodeProgressEl = document.getElementById('leetcodeProgress');
  const incomeProgressEl = document.getElementById('incomeProgress');
  const loopProgressEl = document.getElementById('loopProgress');
  const weekProgressEl = document.getElementById('weekProgress');

  function updateStats() {
    leetcodeCountEl.textContent = state.leetcode;
    incomeCountEl.textContent = '₹' + formatNumber(state.income);
    activeLoopsEl.textContent = state.loopsActive + '/8';
    weekCountEl.textContent = 'Week ' + state.activeWeek;

    leetcodeProgressEl.style.width = Math.min((state.leetcode / 240) * 100, 100) + '%';
    incomeProgressEl.style.width = Math.min((state.income / 100000) * 100, 100) + '%';
    loopProgressEl.style.width = (state.loopsActive / 8) * 100 + '%';
    weekProgressEl.style.width = (state.activeWeek / 12) * 100 + '%';
  }

  function formatNumber(num) {
    if (num >= 100000) return (num / 100000).toFixed(1) + 'L';
    if (num >= 1000) return (num / 1000).toFixed(num >= 10000 ? 0 : 1) + 'K';
    return num.toString();
  }

  // ===== Timeline =====
  const timelineWeeksEl = document.getElementById('timelineWeeks');
  const timelineDetailContentEl = document.getElementById('timelineDetailContent');

  const weekData = [
    { week: 1, label: 'W1', title: 'Week 1-2: Foundation', desc: 'Discrete Math, Engg Math — LEARN only. Only active loop: CP contests.', targets: ['60 LeetCode', 'Rs 5-10K', 'Math+DM PYQs'], loops: 1 },
    { week: 2, label: 'W2', title: 'Week 1-2: Foundation', desc: 'Discrete Math, Engg Math — LEARN only. Only active loop: CP contests.', targets: ['60 LeetCode', 'Rs 5-10K', 'Math+DM PYQs'], loops: 1 },
    { week: 3, label: 'W3', title: 'Week 3-4: PDSA Loop', desc: 'DSA basics — PDSA LOOP ACTIVE — Python scripts + Fiverr gigs. Build 2-3 small Python projects.', targets: ['120 LeetCode', 'Rs 10-20K', 'Web scraper + SQL project'], loops: 4 },
    { week: 4, label: 'W4', title: 'Week 3-4: PDSA Loop', desc: 'DSA basics — PDSA LOOP ACTIVE — Python scripts + Fiverr gigs. Build 2-3 small Python projects.', targets: ['120 LeetCode', 'Rs 10-20K', 'Web scraper + SQL project'], loops: 4 },
    { week: 5, label: 'W5', title: 'Week 5-6: COA+DL Loop', desc: 'COA + Digital Logic — COA+DL LOOP ACTIVE — Verilog basics. Apply for hardware internships.', targets: ['140 LeetCode', 'Rs 10-20K', 'Verilog basics'], loops: 5 },
    { week: 6, label: 'W6', title: 'Week 5-6: COA+DL Loop', desc: 'COA + Digital Logic — COA+DL LOOP ACTIVE — Verilog basics. Apply for hardware internships.', targets: ['140 LeetCode', 'Rs 10-20K', 'Verilog basics'], loops: 5 },
    { week: 7, label: 'W7', title: 'Week 7-8: OS+CN Loops', desc: 'OS + CN — OS+CN LOOPS ACTIVE — Linux + Wireshark. Linux server setup, Wireshark labs.', targets: ['160 LeetCode', 'Rs 5-15K', 'Linux server setup'], loops: 7 },
    { week: 8, label: 'W8', title: 'Week 7-8: OS+CN Loops', desc: 'OS + CN — OS+CN LOOPS ACTIVE — Linux + Wireshark. Nov: College exams — pause new loops.', targets: ['160 LeetCode', 'Rs 5-15K', 'Linux server setup'], loops: 7 },
    { week: 9, label: 'W9', title: 'Week 9-10: DBMS+TOC', desc: 'DBMS + TOC + Compiler — DBMS+TOC+COMP LOOPS ACTIVE — SQL + NLP + API. PYQs + mocks start.', targets: ['200 LeetCode', 'Rs 5-15K', 'SQL portfolio + API'], loops: 8 },
    { week: 10, label: 'W10', title: 'Week 9-10: DBMS+TOC', desc: 'DBMS + TOC + Compiler — DBMS+TOC+COMP LOOPS ACTIVE — SQL + NLP + API. PYQs + mocks start.', targets: ['200 LeetCode', 'Rs 5-15K', 'SQL portfolio + API'], loops: 8 },
    { week: 11, label: 'W11', title: 'Week 11-12: All Loops', desc: 'Revise all — ALL LOOPS RUNNING — Peak earning. Maximum freelancing output.', targets: ['240 LeetCode', 'Rs 15-30K', 'Peak earning loops'], loops: 8 },
    { week: 12, label: 'W12', title: 'Week 11-12: All Loops', desc: 'Revise all — ALL LOOPS RUNNING — Peak earning. Jan 2027: Mock tests + revision + DA.', targets: ['240 LeetCode', 'Rs 15-30K', 'Peak earning loops'], loops: 8 },
  ];

  function renderTimeline() {
    timelineWeeksEl.innerHTML = '';
    weekData.forEach((data) => {
      const weekEl = document.createElement('div');
      weekEl.className = 'timeline-week';
      weekEl.innerHTML = `
        <div class="week-dot ${data.week <= state.activeWeek ? 'completed' : ''} ${data.week === state.activeWeek ? 'active' : ''}"></div>
        <span class="week-label">${data.label}</span>
      `;
      weekEl.addEventListener('click', () => showWeekDetail(data));
      timelineWeeksEl.appendChild(weekEl);
    });
    showWeekDetail(weekData[state.activeWeek - 1] || weekData[0]);
  }

  function showWeekDetail(data) {
    timelineDetailContentEl.innerHTML = `
      <h3>${data.title}</h3>
      <p>${data.desc}</p>
      <div class="detail-targets">
        ${data.targets.map((t) => `<span>🎯 ${t}</span>`).join('')}
      </div>
    `;
    state.activeWeek = data.week;
    state.loopsActive = data.loops;
    saveState();
    updateStats();
    renderTimeline();
  }

  // ===== Income Calculator =====
  const calcSliders = document.querySelectorAll('.calc-slider');
  const calcChecks = document.querySelectorAll('.calc-check');
  const calcTotalEl = document.getElementById('calcTotal');
  const calcRangeEl = document.getElementById('calcRange');

  function updateCalculator() {
    let totalMin = 0;
    let totalMax = 0;

    calcSliders.forEach((slider, i) => {
      const check = calcChecks[i];
      const min = parseInt(slider.dataset.min);
      const max = parseInt(slider.dataset.max);
      const val = parseInt(slider.value);
      const valueEl = slider.parentElement.querySelector('.calc-value');

      if (check.checked) {
        const income = Math.round(min + ((max - min) * val) / 100);
        valueEl.textContent = '₹' + formatNumber(income);
        totalMin += min;
        totalMax += max;
        slider.disabled = false;
      } else {
        valueEl.textContent = '₹0';
        slider.disabled = true;
      }
    });

    calcTotalEl.textContent = '₹' + formatNumber(totalMax > 0 ? Math.round((totalMin + totalMax) / 2) : 0);
    calcRangeEl.textContent = totalMax > 0 ? `Range: ₹${formatNumber(totalMin)} - ₹${formatNumber(totalMax)}` : 'Enable activities above to estimate';

    // Save slider state
    calcSliders.forEach((slider, i) => {
      state.calcSliders[i] = slider.value;
      state.calcChecks[i] = calcChecks[i].checked;
    });
    saveState();
  }

  calcSliders.forEach((slider, i) => {
    // Restore state
    if (state.calcSliders[i] !== undefined) slider.value = state.calcSliders[i];
    if (state.calcChecks[i] !== undefined) calcChecks[i].checked = state.calcChecks[i];

    slider.addEventListener('input', updateCalculator);
    calcChecks[i].addEventListener('change', updateCalculator);
  });

  updateCalculator();

  // ===== Checklist =====
  const checkInputs = document.querySelectorAll('.check-input');
  const checklistProgressEl = document.getElementById('checklistProgress');
  const checklistLabelEl = document.getElementById('checklistLabel');

  function updateChecklist() {
    let checked = 0;
    checkInputs.forEach((input) => {
      const id = input.dataset.id;
      input.checked = !!state.checklist[id];
      if (state.checklist[id]) checked++;
    });
    const total = checkInputs.length;
    checklistProgressEl.style.width = (checked / total) * 100 + '%';
    checklistLabelEl.textContent = `${checked}/${total} completed`;
  }

  checkInputs.forEach((input) => {
    input.addEventListener('change', () => {
      state.checklist[input.dataset.id] = input.checked;
      saveState();
      updateChecklist();
    });
  });

  updateChecklist();

  // ===== PortSwigger Labs =====
  const pwsProgressEl = document.getElementById('pwsProgress');
  const pwsLabelEl = document.getElementById('pwsLabel');

  function updatePWS() {
    pwsProgressEl.style.width = (state.pwsLabs / 60) * 100 + '%';
    pwsLabelEl.textContent = `${state.pwsLabs}/60 labs`;
  }

  updatePWS();

  // ===== Initialize =====
  updateStats();
  renderTimeline();
})();
