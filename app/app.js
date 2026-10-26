(function () {
  'use strict';

  // One lesson file per day; the learner moves through them in order.
  const DAYS = Object.keys(window.LESSONS).map(Number).sort((a, b) => a - b);
  let DAY = DAYS[0];
  let lesson = window.LESSONS[DAY];
  const KEY = 'english30:v2';

  // ---------- storage (per-device convenience; the app works without it) ----------
  const defaults = () => ({ name: '', streak: 0, lastDone: null, completedDays: [], steps: {}, bestScore: {}, quizLast: {}, startedAt: {}, minutes: {} });
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? Object.assign(defaults(), JSON.parse(raw)) : defaults();
    } catch (e) {
      return defaults();
    }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* private mode: keep going */ }
  }
  let data = load();

  const ui = {
    screen: data.name ? 'home' : 'welcome',
    lastScreen: null,
    wordIdx: 0,
    ruleIdx: 0,
    showHindi: true,
    quiz: null,
    speak: { idx: 0, heard: '', listening: false, error: '' },
    write: { text: [], checked: false },
    welcomeNote: '',
    lockNote: false,
    confirmReset: false
  };

  // ---------- helpers ----------
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const today = () => new Date().toISOString().slice(0, 10);
  const stepsFor = (day) => data.steps[day] || (data.steps[day] = {});
  const isDayDone = (day) => data.completedDays.includes(day);

  function say(text) {
    if (!('speechSynthesis' in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-IN';
    u.rate = 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  }

  const I = {
    back: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
    next: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>',
    close: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    book: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"/></svg>',
    bulb: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.2 1 2.3h6c0-1.1.4-1.8 1-2.3A7 7 0 0 0 12 2z"/></svg>',
    mic: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v4"/></svg>',
    micBig: '<svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v4"/></svg>',
    flame: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2c1 4 5 5.5 5 10a5 5 0 0 1-10 0c0-2.5 1.5-4 2.5-5 .3 1.7 1.2 2.6 2 3 .3-2.8-.5-5.5.5-8z"/></svg>',
    check: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    checkBig: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    lock: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
    unlock: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 7.5-2"/></svg>',
    okCircle: '<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="currentColor"/><path d="M7 12.5l3.5 3.5L17 9" fill="none" stroke="#FFFFFF" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    noCircle: '<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="currentColor"/><path d="M8.5 8.5l7 7M15.5 8.5l-7 7" fill="none" stroke="#FFFFFF" stroke-width="2.4" stroke-linecap="round"/></svg>',
    todo: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--track)" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10.5"/></svg>',
    speaker: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5L6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>',
    play: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',
    lines: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M4 12h11M4 18h7"/></svg>',
    chat: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.8 7L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg>',
    target: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></svg>',
    home: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5L12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/></svg>',
    person: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
    arrow: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h16M14 6l6 6-6 6"/></svg>',
    micTab: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v4"/></svg>',
    route: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h8a3.5 3.5 0 0 0 0-7H8a3.5 3.5 0 0 1 0-7h8"/></svg>',
    lockMid: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
    lockSmall: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
    unlockSmall: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 7.5-2"/></svg>',
    okCircleLg: '<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="currentColor"/><path d="M7 12.5l3.5 3.5L17 9" fill="none" stroke="#FFFFFF" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    noCircleLg: '<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="currentColor"/><path d="M8.5 8.5l7 7M15.5 8.5l-7 7" fill="none" stroke="#FFFFFF" stroke-width="2.4" stroke-linecap="round"/></svg>',
    okCircleXl: '<svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="currentColor"/><path d="M7 12.5l3.5 3.5L17 9" fill="none" stroke="#FFFFFF" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    noCircleXl: '<svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="currentColor"/><path d="M8.5 8.5l7 7M15.5 8.5l-7 7" fill="none" stroke="#FFFFFF" stroke-width="2.4" stroke-linecap="round"/></svg>',
    flameLg: '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2c1 4 5 5.5 5 10a5 5 0 0 1-10 0c0-2.5 1.5-4 2.5-5 .3 1.7 1.2 2.6 2 3 .3-2.8-.5-5.5.5-8z"/></svg>',
    clock: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent-text)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>'
  };

  function buildSteps() {
    return [
      { id: 'reading', title: 'Reading', sub: lesson.reading.title + ' · 5 min', min: 5, color: '#0066CC', icon: I.book },
      { id: 'words', title: '15 Words', sub: 'Kab use · kab nahi · kyun', min: 8, color: '#5856D6', icon: 'Aa' },
      { id: 'grammar', title: 'Grammar', sub: lesson.grammar.rules.length + ' rules, har ek ka reason', min: 7, color: '#C93400', icon: I.lines },
      { id: 'models', title: 'Models', sub: 'Phone, dukaan, class, ghar', min: 5, color: '#8944AB', icon: I.chat },
      { id: 'practice', title: 'Practice', sub: lesson.quiz.questions.length + ' sawaal · bolo · likho', min: 5, color: '#248A3D', icon: I.target }
    ];
  }
  let STEPS = buildSteps();
  // the first day not yet completed is today's task
  const currentDay = () => DAYS.find((d) => !isDayDone(d)) ?? DAYS[DAYS.length - 1];
  function useDay(n) {
    if (n !== DAY) {
      ui.wordIdx = 0;
      ui.ruleIdx = 0;
      ui.quiz = null;
      ui.lockNote = false;
      ui.write = { text: [], checked: false };
    }
    DAY = n;
    lesson = window.LESSONS[n];
    STEPS = buildSteps();
  }
  useDay(currentDay());
  const doneCount = () => STEPS.filter((s) => stepsFor(DAY)[s.id]).length;
  const minutesLeft = () => STEPS.filter((s) => !stepsFor(DAY)[s.id]).reduce((n, s) => n + s.min, 0);
  const learnDone = () => STEPS.slice(0, 4).every((s) => stepsFor(DAY)[s.id]);

  function markStep(id) {
    stepsFor(DAY)[id] = true;
    save();
  }

  function completeDay() {
    if (!isDayDone(DAY)) {
      data.completedDays.push(DAY);
      const t = today();
      const y = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
      if (data.lastDone !== t) data.streak = data.lastDone === y ? data.streak + 1 : 1;
      data.lastDone = t;
      const started = data.startedAt[DAY] || Date.now();
      data.minutes[DAY] = Math.max(1, Math.round((Date.now() - started) / 60000));
    }
    save();
  }

  // ---------- shared pieces ----------
  // **word** in lesson text marks the key idea; it renders bold.
  const rich = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  const topbar = (backTo, backLabel, right) =>
    `<div class="topbar"><button class="back" data-act="go" data-arg="${backTo}">${I.back}${esc(backLabel)}</button>${right ? `<span class="counter">${right}</span>` : ''}</div>`;
  const kyun = (text) => `<div class="kyun"><b>Kyun?</b><span>${rich(text)}</span></div>`;
  const kyunRow = (text) => `<div class="kyun row"><b>Kyun?</b><span>${rich(text)}</span></div>`;
  // words of the right sentence that the wrong one lacked, shown green
  function markFix(wrong, right) {
    const had = new Set(norm(wrong));
    return esc(right).split(/(\s+)/).map((t) => (/\S/.test(t) && !had.has(norm(t)[0]) && norm(t).length ? `<span class="fix">${t}</span>` : t)).join('');
  }
  const tab = (id, icon, label, active) =>
    `<button class="${active === id ? 'active' : ''}" data-act="go" data-arg="${id}" ${active === id ? 'aria-current="page"' : ''}>${icon}<span>${label}</span></button>`;
  const tabbar = (active) => `
    <nav class="tabbar" aria-label="Main">${tab('home', I.home, 'Home', active)}${tab('safar', I.route, 'Safar', active)}${tab('speak', I.micTab, 'Bolo', active)}${tab('profile', I.person, 'Profile', active)}</nav>`;

  // ---------- screens ----------
  const screens = {
    welcome() {
      return `<main class="screen white" style="padding-top: calc(env(safe-area-inset-top) + 64px)">
        <div class="app-icon" aria-hidden="true">Aa</div>
        <p class="eyebrow" style="margin-top: 12px; font-size: 15px">English 30</p>
        <h1 class="hero-title" tabindex="-1">30 din mein English bolna shuru karo.</h1>
        <p class="body muted" style="font-size: 17px; line-height: 1.45">Roz ek chhota task. Har rule ke saath uska “kyun” bhi, taaki ratna na pade, samajh aaye.</p>
        <div class="stack" style="gap: 22px; margin-top: 28px">
          <div class="feature"><div class="ic">${I.book}</div><div><b>Roz ek task</b><span>Reading, 15 words, grammar aur practice</span></div></div>
          <div class="feature"><div class="ic">${I.bulb}</div><div><b>Har rule ka “kyun”</b><span>Hindi se tulna karke samjhaate hain</span></div></div>
          <div class="feature"><div class="ic">${I.mic}</div><div><b>Bolo aur seekho</b><span>Apni awaaz record karo, galti turant pakdo</span></div></div>
        </div>
        <div class="spacer"></div>
        <form class="stack" data-form="name">
          <div class="field"><label for="name">Aapka naam</label><input id="name" name="name" autocomplete="given-name" placeholder="Jaise: Ravi" required maxlength="30"></div>
          <button class="btn" type="submit">Shuru karein</button>
        </form>
        ${ui.welcomeNote ? `<p class="body muted center" role="status" style="font-size: 14px">${esc(ui.welcomeNote)}</p>` : ''}
        <button class="btn plain" style="margin-top: -10px; min-height: 48px" data-act="have-account">Mera account pehle se hai</button>
      </main>`;
    },

    home() {
      useDay(currentDay());
      const steps = doneCount();
      const dayDone = isDayDone(DAY);
      const circ = 2 * Math.PI * 27;
      const dash = (steps / STEPS.length) * circ;
      const date = new Date().toLocaleDateString('en-IN', { weekday: 'long' }).toUpperCase();
      const weekDone = data.completedDays.filter((d) => d <= 7).length;
      const weekName = lesson.week === 1 ? 'Neev' : '';
      const basicPct = Math.round((data.completedDays.filter((d) => d <= 30).length / 30) * 100);
      const days = [1, 2, 3, 4, 5, 6, 7].map((n) => {
        if (isDayDone(n)) return `<button class="day done" data-act="open-day" data-arg="${n}" aria-label="Day ${n} poora, dobara kholo"><span>${n}</span><div class="dot">${I.check}</div></button>`;
        if (n === DAY) return `<button class="day today" data-act="open-day" data-arg="${n}" aria-label="Day ${n}, aaj ka task"><span>${n}</span><div class="dot"><i></i></div></button>`;
        return `<div class="day"><span>${n}</span><div class="dot" role="img" aria-label="Day ${n} abhi band hai">${I.lock}</div></div>`;
      }).join('');
      const hero = dayDone
        ? `<div class="card stack hero" style="gap: 14px">
            <div class="row-between" style="justify-content: flex-start; gap: 14px">
              <div class="tile" style="width: 52px; height: 52px; border-radius: 26px; background: var(--green)">${I.check}</div>
              <div><p class="eyebrow">Week ${lesson.week} poora</p><p class="title-2">Shabash, ${esc(data.name || 'dost')}!</p><p class="body muted" style="font-size: 14px">Day ${lesson.next.day}: ${esc(lesson.next.title)} jald aa raha hai</p></div>
            </div>
            <button class="btn secondary" data-act="go" data-arg="safar">Safar mein revise karo</button>
          </div>`
        : `<div class="card stack hero" style="gap: 18px; padding: 22px">
            <div class="row-between" style="justify-content: flex-start; gap: 16px">
              <div class="ring" role="img" aria-label="${steps} of ${STEPS.length} hisse poore">
                <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="27" fill="none" stroke="var(--fill-2)" stroke-width="7"/><circle cx="32" cy="32" r="27" fill="none" stroke="var(--accent)" stroke-width="7" stroke-linecap="round" stroke-dasharray="${dash} ${circ}" transform="rotate(-90 32 32)"/></svg>
                <span>${steps}/${STEPS.length}</span>
              </div>
              <div style="min-width: 0; display: flex; flex-direction: column; gap: 3px"><p class="eyebrow">Aaj ka task</p><p class="title-2" style="font-size: 22px">${esc(lesson.title)}</p><p class="body muted" style="font-size: 14px">${esc(lesson.subtitle)} · ${lesson.minutes} min</p></div>
            </div>
            <button class="btn" style="min-height: 52px; border-radius: 14px" data-act="go" data-arg="task">${steps ? 'Task jaari rakhein' : 'Aaj ka task shuru karein'}${I.next}</button>
          </div>`;
      return `<main class="screen with-tabbar" style="gap: 22px">
        <div class="row-between" style="align-items: flex-end; margin-top: 48px">
          <div style="display: flex; flex-direction: column; gap: 4px"><p class="eyebrow" style="font-size: 14px">${esc(date)} · Day ${DAY} of 30</p><h1 class="large-title" tabindex="-1">Namaste, ${esc(data.name || 'dost')}</h1></div>
          <span class="pill" role="img" aria-label="${data.streak} din ka streak">${I.flame}${data.streak}</span>
        </div>
        ${hero}
        <section class="stack">
          <div class="row-between" style="padding: 0 4px; align-items: baseline"><h2 class="title-2">Week ${lesson.week}${weekName ? ' · ' + weekName : ''}</h2><span class="muted" style="font-size: 14px">${weekDone} / 7 poore</span></div>
          <div class="list week">${days}</div>
        </section>
        <section class="stack">
          <h2 class="title-2" style="padding: 0 4px">Aage ka safar</h2>
          <div class="list">
            <button class="list-row" data-act="go" data-arg="safar"><div class="tile big" style="background: #5856D6; font-size: 13px">30</div><div class="text"><span class="t">Basic English</span><span class="s">Day 1–30 · Tenses se Final Test tak</span></div><span class="muted" style="font-size: 15px; font-weight: 600">${basicPct}%</span></button>
            <button class="list-row" data-act="go" data-arg="safar"><div class="tile big neutral">${I.lockMid}</div><div class="text"><span class="t">Advanced English</span><span class="s">Day 31–45 · Day 30 ka test pass karke khulega</span></div></button>
          </div>
        </section>
        ${tabbar('home')}
      </main>`;
    },

    safar() {
      const row = (d) => {
        const done = isDayDone(d.day);
        const today = !done && d.day === currentDay() && !!window.LESSONS[d.day];
        const tile = done
          ? `<div class="tile" style="background: var(--green)" role="img" aria-label="Poora">${I.check}</div>`
          : today ? `<div class="tile" style="background: var(--accent)">${d.day}</div>`
          : `<div class="tile locked" role="img" aria-label="Band">${d.day}</div>`;
        const right = today ? '<span class="chip-go">Aaj</span>' : done ? '' : `<span class="muted">${I.lock}</span>`;
        const open = today || (done && window.LESSONS[d.day]);
        const tag = open ? 'button' : 'div';
        return `<${tag} class="list-row" ${open ? `data-act="open-day" data-arg="${d.day}"` : ''}>${tile}<div class="text"><span class="t">${esc(d.focus)}</span><span class="s">Day ${d.day} · ${esc(d.learn)}</span></div>${right}</${tag}>`;
      };
      const basic = window.SYLLABUS.filter((d) => d.day <= 30).map(row).join('');
      const adv = window.SYLLABUS.filter((d) => d.day > 30).map(row).join('');
      return `<main class="screen with-tabbar" style="gap: 22px">
        <div style="display: flex; flex-direction: column; gap: 4px; margin-top: 48px"><p class="eyebrow" style="font-size: 14px">45 din ka raasta</p><h1 class="large-title" tabindex="-1">Safar</h1></div>
        <section class="stack">
          <div class="row-between" style="padding: 0 4px; align-items: baseline"><h2 class="title-2">Basic English</h2><span class="muted" style="font-size: 14px">Day 1–30</span></div>
          <div class="list">${basic}</div>
        </section>
        <section class="stack">
          <div class="row-between" style="padding: 0 4px; align-items: baseline"><h2 class="title-2">Advanced English</h2><span class="muted" style="font-size: 14px">Day 31–45</span></div>
          <div class="card" style="display: flex; gap: 12px; align-items: center; padding: 14px 16px">
            <span class="info-dot">${I.lockSmall}</span>
            <p class="body" style="font-size: 14px">Day 30 ka <b>Final Test</b> pass karke yeh hissa khulega.</p>
          </div>
          <div class="list">${adv}</div>
        </section>
        ${tabbar('safar')}
      </main>`;
    },

    task() {
      const s = stepsFor(DAY);
      const firstOpen = STEPS.findIndex((x) => !s[x.id]);
      const segs = STEPS.map((st, i) => `<span class="${s[st.id] ? 'done' : i === firstOpen ? 'on' : ''}"></span>`).join('');
      const rows = STEPS.map((st, i) => {
        const locked = st.id === 'practice' && !learnDone();
        const right = s[st.id]
          ? `<span style="color: var(--green); display: flex" role="img" aria-label="Poora">${I.okCircleLg}</span>`
          : i === firstOpen && !locked ? '<span class="chip-go">Shuru</span>'
          : locked ? `<span class="muted" style="display: flex" role="img" aria-label="Band: pehle upar ke 4 hisse poore karo">${I.lock}</span>`
          : `<span style="display: flex" role="img" aria-label="Baaki">${I.todo}</span>`;
        return `<button class="list-row" data-act="open-step" data-arg="${st.id}" ${locked ? 'aria-disabled="true"' : ''}>
          <div class="tile" style="background: ${st.color}">${st.icon}</div>
          <div class="text"><span class="t">${st.title}</span><span class="s">${st.sub}</span></div>${right}</button>`;
      }).join('');
      const left = minutesLeft();
      return `<main class="screen" style="gap: 20px">
        ${topbar('home', 'Home')}
        <div style="display: flex; flex-direction: column; gap: 4px; margin-top: -8px"><p class="eyebrow" style="font-size: 14px">Day ${DAY} · Week ${lesson.week}</p><h1 class="large-title" tabindex="-1">${esc(lesson.title)}</h1></div>
        <div class="stack" style="gap: 8px"><div class="segments tall" style="grid-template-columns: repeat(${STEPS.length}, minmax(0, 1fr))">${segs}</div>
          <span class="muted" style="font-size: 14px">${doneCount()} of ${STEPS.length} poore${left ? ` · lagbhag ${left} min baaki` : ' · sab ho gaya'}</span></div>
        <div class="list">${rows}</div>
        ${ui.lockNote ? `<p class="note" role="status" style="margin: 0">${I.lock}<span>Practice tab khulega jab Reading, Words, Grammar aur Models poore ho jayenge.</span></p>` : ''}
        <div class="card" style="display: flex; gap: 12px; align-items: flex-start">
          <span class="info-dot">${I.unlockSmall}</span>
          <p class="body" style="font-size: 14px; line-height: 1.45">Paanchon hisse poore karo aur quiz mein <b>${lesson.quiz.passPercent}%</b> lao, tab <b>Day ${lesson.next.day}: ${esc(lesson.next.title)}</b> khulega.</p>
        </div>
      </main>`;
    },

    reading() {
      const r = lesson.reading;
      const words = (list) => list.map((w) => esc(w).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
      const g = new RegExp('\\b(' + words(r.grammarWords) + ')\\b', 'gi');
      const v = new RegExp('\\b(' + words(r.vocabWords) + ')\\b', 'gi');
      const lines = r.lines.map((l) => {
        const en = esc(l.en).replace(g, '<strong>$1</strong>').replace(v, '<u>$1</u>');
        return `<div><p>${en}</p>${ui.showHindi ? `<p class="hi">${esc(l.hi)}</p>` : ''}</div>`;
      }).join('');
      const wordCount = r.lines.map((l) => l.en).join(' ').split(/\s+/).length;
      const secs = Math.round(wordCount / 2.2);
      const length = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;
      const bars = [8, 14, 20, 12, 24, 18, 10, 22, 16, 26, 12, 8, 18, 24, 14, 20, 10, 16, 22, 12, 8, 18, 14, 10, 20, 12, 8, 14].map((h) => `<i style="height: ${h}px"></i>`).join('');
      const qs = r.questions.map((q) => `<details class="qa"><summary>${esc(q.q)}</summary><p>${esc(q.a)}</p></details>`).join('');
      return `<main class="screen white">
        ${topbar('task', 'Day ' + DAY, '1 / 5 · Reading')}
        <h1 class="large-title" tabindex="-1">${esc(r.title)}</h1>
        <div class="player"><button class="play" data-act="say-passage" aria-label="Passage suno">${I.play}</button><div class="wave" aria-hidden="true">${bars}</div><span class="counter">${length}</span></div>
        <div class="switch-row"><span id="hl">Hindi meaning dikhao</span><button class="switch" role="switch" aria-checked="${ui.showHindi}" aria-labelledby="hl" data-act="toggle-hindi"></button></div>
        <div class="passage">${lines}</div>
        <div class="legend"><span><i style="width: 10px; height: 10px; border-radius: 3px; background: var(--accent-text)"></i>Aaj ka grammar</span><span><i style="width: 14px; border-bottom: 2px dotted var(--indigo)"></i>Aaj ke words</span></div>
        <h2 class="title-2" style="margin-top: 8px">Samjha? Check karo</h2>
        <div class="stack">${qs}</div>
        <div class="spacer"></div>
        <button class="btn" data-act="finish-step" data-arg="reading">Padh liya, aage chalo</button>
      </main>`;
    },

    words() {
      const list = lesson.words;
      const w = list[ui.wordIdx];
      const last = ui.wordIdx === list.length - 1;
      const segs = list.map((_, i) => `<span class="${i <= ui.wordIdx ? 'on' : ''}"></span>`).join('');
      return `<main class="screen" style="gap: 14px">
        ${topbar('task', 'Day ' + DAY, `Word ${ui.wordIdx + 1} / ${list.length}`)}
        <div class="segments thin" style="grid-template-columns: repeat(${list.length}, minmax(0, 1fr))" aria-hidden="true">${segs}</div>
        <div class="word-head">
          <div style="display: flex; flex-direction: column; gap: 2px"><h1 class="word-big" tabindex="-1" style="margin: 0">${esc(w.word)}</h1><span class="muted" style="font-size: 15px">${esc(w.ipa)} · ${esc(w.say)}</span></div>
          <button class="speaker" data-act="say" data-arg="${esc(w.word)}" aria-label="${esc(w.word)} ka uchcharan suno">${I.speaker}</button>
        </div>
        <p class="meaning">${w.hindi ? `<span class="hindi" lang="hi">${esc(w.hindi)}</span>` : ''}<span>${esc(w.meaning)}</span></p>
        <div class="card stack">
          <div class="verdict ok">${I.okCircleLg}KAB USE KAREIN</div>
          <p class="sentence">${esc(w.use.ex)}</p>
          ${kyunRow(w.use.why)}
        </div>
        <div class="card stack">
          <div class="verdict no">${I.noCircleLg}KAB NAHI</div>
          <p class="strike">${esc(w.dont.wrong)}</p>
          <p class="sentence">${markFix(w.dont.wrong, w.dont.right)}</p>
          ${kyunRow(w.dont.why)}
        </div>
        ${w.note ? `<div class="note"><span style="color: var(--accent-text); display: flex">${I.bulb}</span><span>${rich(w.note)}</span></div>` : ''}
        <div class="tags">${w.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>
        <div class="spacer"></div>
        <div class="btn-row">
          <button class="btn secondary" data-act="word" data-arg="-1" ${ui.wordIdx === 0 ? 'disabled' : ''}>Pichhla</button>
          ${last ? '<button class="btn green" data-act="finish-step" data-arg="words">Words poore</button>' : '<button class="btn" data-act="word" data-arg="1">Agla word</button>'}
        </div>
      </main>`;
    },

    grammar() {
      const g = lesson.grammar;
      const r = g.rules[ui.ruleIdx];
      const last = ui.ruleIdx === g.rules.length - 1;
      const intro = ui.ruleIdx === 0
        ? `<div class="card" style="padding: 6px 16px">
             <div class="map-row head"><span>HINDI</span><span></span><span class="en">ENGLISH</span></div>
             ${g.pairs.map((p) => `<div class="map-row"><span>${esc(p.hi)} <b>${esc(p.hiVerb)}</b></span><span class="arrow">${I.arrow}</span><span class="en">${esc(p.en)} <b>${esc(p.enVerb)}</b></span></div>`).join('')}
           </div>
           <div class="formula"><span>${esc(g.formula[0])}</span><em>+</em><span class="key">${esc(g.formula[1])}</span><em>+</em><span>${esc(g.formula[2])}</span></div>`
        : '';
      return `<main class="screen" style="gap: 14px">
        ${topbar('task', 'Day ' + DAY, `Rule ${ui.ruleIdx + 1} / ${g.rules.length}`)}
        <div class="stack" style="gap: 6px; margin-top: -4px"><h1 class="large-title" tabindex="-1">${esc(lesson.title)}</h1>${ui.ruleIdx === 0 ? `<p class="body" style="line-height: 1.45">${rich(g.what)}</p>` : ''}</div>
        ${intro}
        <div class="card stack">
          <p class="eyebrow">Rule · ${esc(r.title)}</p>
          ${r.wrong ? `<div class="mark"><span style="color: var(--red); display: flex" role="img" aria-label="Galat">${I.noCircleLg}</span><p class="strike" style="font-size: 17px">${esc(r.wrong)}</p></div>` : ''}
          ${r.right.map((s) => `<div class="mark"><span style="color: var(--green); display: flex" role="img" aria-label="Sahi">${I.okCircleLg}</span><p class="sentence" style="font-size: 17px">${esc(s)}</p></div>`).join('')}
          ${kyun(r.why)}
          ${r.tip ? `<div class="note"><span style="color: var(--accent-text); display: flex">${I.bulb}</span><span>${rich(r.tip)}</span></div>` : ''}
        </div>
        <div class="spacer"></div>
        ${last
          ? '<button class="btn green" data-act="finish-step" data-arg="grammar">Samajh gaya, grammar poora</button>'
          : '<button class="btn" data-act="rule" data-arg="1">Samajh gaya, agla rule</button>'}
        ${ui.ruleIdx > 0 ? '<button class="btn plain" style="margin-top: -8px" data-act="rule" data-arg="-1">Pichhla rule</button>' : ''}
      </main>`;
    },

    models() {
      const cards = lesson.models.map((m) => `
        <div class="card stack">
          <div class="row-between"><span class="eyebrow">${esc(m.situation)}</span><button class="icon-btn" style="color: var(--accent-text)" data-act="say" data-arg="${esc(m.en)}" aria-label="Suno">${I.speaker}</button></div>
          <p class="sentence">${esc(m.en)}</p>
          ${kyun(m.why)}
        </div>`).join('');
      return `<main class="screen">
        ${topbar('task', 'Day ' + DAY, '4 / 5 · Models')}
        <div class="stack" style="gap: 6px"><h1 class="large-title" tabindex="-1">Asli situations</h1><p class="body">Yahi grammar roz ki zindagi mein kaise bolte hain. Har sentence suno aur zor se bolo.</p></div>
        ${cards}
        <button class="btn" data-act="finish-step" data-arg="models">Ho gaya</button>
      </main>`;
    },

    quiz() {
      const qz = ui.quiz;
      const q = lesson.quiz.questions[qz.idx];
      const total = lesson.quiz.questions.length;
      const picked = qz.picked;
      const right = picked === q.answer;
      const blankCls = picked ? (right ? 'ok' : 'no') : '';
      const qText = q.q
        ? `<p class="q-text">${esc(q.q).replace('___', `<span class="blank ${blankCls}">${picked ? esc(picked) : '&nbsp;'}</span>`)}</p>`
        : '';
      const opts = qz.orders[qz.idx].map((o) => {
        let cls = '', tag = '';
        if (picked && o === q.answer) { cls = 'ok'; tag = 'Sahi'; }
        if (picked === o && !right) { cls = 'no'; tag = 'Aapka jawab'; }
        return `<button class="option ${cls}" data-act="pick" data-arg="${esc(o)}" ${picked ? 'disabled' : ''}><span>${esc(o)}</span><small>${tag}</small></button>`;
      }).join('');
      const sheet = picked ? `
        <div class="sheet" role="status">
          <h3 class="${right ? 'ok' : 'no'}">${right ? I.okCircleXl : I.noCircleXl}${right ? 'Bilkul sahi!' : 'Oops, galat'}</h3>
          ${right ? '' : `<p style="margin: 0; font-size: 16px">Sahi answer: <b>${esc(q.answer)}</b></p>`}
          ${kyun(q.why)}
          <button class="btn ${right ? 'green' : 'red'}" data-act="next-q">${qz.idx === total - 1 ? 'Result dekho' : right ? 'Aage chalo' : 'Samajh gaya, aage chalo'}</button>
        </div>` : '';
      return `<main class="screen" style="padding-bottom: 360px; gap: 22px">
        <div class="topbar" style="gap: 14px">
          <button class="icon-btn" style="margin-left: -10px" data-act="go" data-arg="task" aria-label="Quiz band karo">${I.close}</button>
          <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${qz.idx + 1}"><span style="width: ${((qz.idx + 1) / total) * 100}%"></span></div>
          <span class="counter">${qz.idx + 1} / ${total}</span>
        </div>
        <div class="stack" style="gap: 8px"><p class="muted" style="margin: 0; font-size: 14px; font-weight: 600">${esc(q.prompt)}</p>${qText}</div>
        <h1 tabindex="-1" class="sr-only">Sawaal ${qz.idx + 1}</h1>
        <div class="stack" style="gap: 12px">${opts}</div>
        ${sheet}
      </main>`;
    },

    result() {
      const qz = ui.quiz;
      const total = lesson.quiz.questions.length;
      const pct = Math.round((qz.correct / total) * 100);
      const pass = pct >= lesson.quiz.passPercent;
      return `<main class="screen white">
        <div class="medal" style="${pass ? '' : 'background: var(--red-bg)'}"><div style="${pass ? '' : 'background: var(--red); box-shadow: none'}">${pass ? I.checkBig : `<span style="font-size: 34px; font-weight: 800">${pct}%</span>`}</div></div>
        <div class="center stack" style="gap: 6px"><h1 class="large-title" tabindex="-1">${pass ? 'Quiz pass!' : 'Thoda aur practice'}</h1>
          <p class="body muted center">${qz.correct} / ${total} sahi · ${pct}%${pass ? '' : ` · pass ke liye ${lesson.quiz.passPercent}% chahiye`}</p></div>
        ${qz.wrong.length ? `<h2 class="title-2" style="margin-top: 8px">Galat wale, reason ke saath</h2>${wrongCards(qz.wrong)}` : ''}
        <div class="spacer"></div>
        ${pass ? '<button class="btn" data-act="go" data-arg="speak-task">Agla step: bolo</button>' : '<button class="btn" data-act="start-quiz">Dobara try karo</button><button class="btn plain" data-act="go" data-arg="task">Pehle grammar dobara padho</button>'}
      </main>`;
    },

    review() {
      const last = data.quizLast[DAY] || { wrong: [] };
      return `<main class="screen">
        ${topbar('complete', 'Wapas')}
        <div class="stack" style="gap: 6px"><h1 class="large-title" tabindex="-1">Galat sawaal</h1><p class="body">Har galti ke saath uska reason. Ek baar padh lo, kal yeh galti nahi hogi.</p></div>
        ${wrongCards(last.wrong)}
        <div class="spacer"></div>
        <button class="btn" data-act="go" data-arg="complete">Samajh gaya</button>
      </main>`;
    },

    speak(fromTask) {
      const prompts = lesson.speak;
      const sp = ui.speak;
      const target = prompts[sp.idx];
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      let heard = '';
      if (sp.heard) {
        const said = new Set(norm(sp.heard));
        heard = `<div class="card stack"><p class="eyebrow">Aapne bola</p><p class="heard">${norm(target).map((w) => `<span class="${said.has(w) ? 'hit' : 'miss'}">${esc(w)}</span>`).join(' ')}</p>
          <p class="muted" style="margin: 0; font-size: 14px">Hara = sahi suna gaya · Laal = dobara bolo</p></div>`;
      }
      const last = sp.idx === prompts.length - 1;
      return `<main class="screen ${fromTask ? '' : 'with-tabbar'}">
        ${fromTask ? topbar('task', 'Day ' + DAY, `Bolo ${sp.idx + 1} / ${prompts.length}`) : '<div style="height: 28px"></div>'}
        <div class="stack" style="gap: 6px"><h1 class="large-title" tabindex="-1">Zor se bolo</h1><p class="body">Pehle suno, phir mic dabakar yahi sentence bolo.</p></div>
        <div class="card stack" style="gap: 14px; align-items: flex-start">
          <p class="sentence" style="font-size: 24px">${esc(target)}</p>
          <button class="btn secondary" style="width: auto; min-height: 44px" data-act="say" data-arg="${esc(target)}">${I.speaker}Suno</button>
        </div>
        ${SR ? `<button class="mic ${sp.listening ? 'live' : ''}" data-act="listen" aria-label="${sp.listening ? 'Sun raha hai' : 'Bolna shuru karo'}">${I.micBig}</button>
                <p class="center muted" style="margin: 0; font-size: 14px">${sp.listening ? 'Sun raha hoon…' : 'Mic dabao aur bolo'}</p>`
             : '<div class="note"><span>Is browser mein mic se check nahi ho sakta. Chrome (Android) mein kholo, ya sentence khud zor se bolkar aage badho.</span></div>'}
        ${sp.error ? `<div class="note"><span>${esc(sp.error)}</span></div>` : ''}
        ${heard}
        <div class="spacer"></div>
        ${last && fromTask ? '<button class="btn" data-act="go" data-arg="write">Aakhri step: likho</button>' : `<button class="btn" data-act="next-speak">Agla sentence</button>`}
        ${fromTask ? '' : tabbar('speak')}
      </main>`;
    },

    write() {
      const wr = ui.write;
      const items = lesson.write.items.map((p, i) => {
        const res = wr.checked ? checkWrite(p, wr.text[i] || '') : null;
        return `<div class="card stack">
          <label class="eyebrow" for="w${i}">${esc(p.label)}</label>
          <input class="write-input ${res ? (res.ok ? 'ok' : 'no') : ''}" id="w${i}" data-write="${i}" value="${esc(wr.text[i] || '')}" placeholder="${esc(p.placeholder)}" autocomplete="off" autocapitalize="sentences">
          ${res ? `<div class="mark" style="align-items: flex-start"><span style="color: ${res.ok ? 'var(--green)' : 'var(--red)'}; display: flex">${res.ok ? I.okCircleLg : I.noCircleLg}</span><span style="font-size: 14px; line-height: 1.45; color: var(--label-2)">${rich(res.msg)}</span></div>` : ''}
        </div>`;
      }).join('');
      const allOk = wr.checked && lesson.write.items.every((p, i) => checkWrite(p, wr.text[i] || '').ok);
      return `<main class="screen">
        ${topbar('task', 'Day ' + DAY, 'Likho · 3 sentence')}
        <div class="stack" style="gap: 6px"><h1 class="large-title" tabindex="-1">Apne baare mein likho</h1><p class="body">${esc(lesson.write.intro)}</p></div>
        ${items}
        <div class="spacer"></div>
        ${allOk
          ? '<button class="btn green" data-act="finish-day">Day poora karo</button>'
          : `<button class="btn" data-act="check-write">${wr.checked ? 'Sudhar kar dobara check karo' : 'Check karo'}</button>
             ${wr.checked ? '<button class="btn plain" style="margin-top: -8px" data-act="finish-day">Baad mein sudharunga, day poora karo</button>' : ''}`}
      </main>`;
    },

    complete() {
      const q = data.quizLast[DAY] || { correct: 0, total: lesson.quiz.questions.length, wrong: [] };
      const pct = Math.round((q.correct / q.total) * 100);
      const wordsLearned = data.completedDays.reduce((n, d) => n + (window.LESSONS[d] ? window.LESSONS[d].words.length : 0), 0);
      const nextReady = !!window.LESSONS[lesson.next.day];
      const wrongN = q.wrong.length;
      return `<main class="screen white" style="padding-top: calc(env(safe-area-inset-top) + 72px); align-items: stretch; gap: 18px">
        <div class="medal" style="margin-top: 0"><div>${I.checkBig}</div></div>
        <div class="center stack" style="gap: 8px"><h1 class="large-title" tabindex="-1">Day ${DAY} complete!</h1>
          <p class="body muted center" style="font-size: 17px">Quiz mein ${q.correct} / ${q.total} · <b style="color: var(--green-text)">${pct}%</b></p></div>
        <div class="stats" style="margin-top: 8px">
          <div class="stat"><span style="color: var(--orange); display: flex">${I.flameLg}</span><b>${data.streak}</b><span>din ka streak</span></div>
          <div class="stat"><span style="color: var(--indigo); font-size: 15px; font-weight: 800; height: 22px; display: flex; align-items: center">Aa</span><b>${wordsLearned}</b><span>words seekhe</span></div>
          <div class="stat">${I.clock}<b>${data.minutes[DAY] || 1}</b><span>minute</span></div>
        </div>
        <div class="card" style="display: flex; gap: 14px; align-items: center; box-shadow: none; border: 1px solid var(--separator)">
          <div class="tile" style="width: 44px; height: 44px; border-radius: 12px; background: ${nextReady ? 'var(--accent)' : 'var(--secondary)'}">${nextReady ? I.unlock : I.lockMid}</div>
          <div style="display: flex; flex-direction: column; gap: 2px"><p class="eyebrow">${nextReady ? 'Kal ka task khul gaya' : 'Agla task jald aa raha hai'}</p><p style="margin: 0; font-size: 17px; font-weight: 700">Day ${lesson.next.day} · ${esc(lesson.next.title)}</p></div>
        </div>
        <div class="spacer"></div>
        <button class="btn" data-act="go" data-arg="home">Home pe jao</button>
        ${wrongN ? `<button class="btn plain" style="margin-top: -6px" data-act="go" data-arg="review">${wrongN} galat sawaal dobara dekho</button>` : ''}
      </main>`;
    },

    profile() {
      return `<main class="screen with-tabbar">
        <div style="height: 28px"></div>
        <h1 class="large-title" tabindex="-1">${esc(data.name || 'Profile')}</h1>
        <div class="stats">
          <div class="stat" style="background: var(--card)"><b>${data.streak}</b><span>din ka streak</span></div>
          <div class="stat" style="background: var(--card)"><b>${data.completedDays.length}</b><span>din poore</span></div>
          <div class="stat" style="background: var(--card)"><b>${avgScore()}%</b><span>quiz average</span></div>
        </div>
        <p class="body muted" style="font-size: 14px">Progress sirf isi phone/browser mein save hota hai.</p>
        ${ui.confirmReset
          ? `<div class="card stack"><p class="body" style="font-size: 15px">Saara progress mit jayega. Pakka?</p>
               <div class="btn-row"><button class="btn secondary" data-act="cancel-reset">Nahi</button><button class="btn red" data-act="reset">Haan, mitao</button></div></div>`
          : '<button class="btn secondary" style="color: var(--red-text)" data-act="ask-reset">Progress reset karo</button>'}
        ${tabbar('profile')}
      </main>`;
    }
  };

  function avgScore() {
    const s = Object.values(data.bestScore);
    return s.length ? Math.round(s.reduce((a, b) => a + b, 0) / s.length) : 0;
  }

  function wrongCards(idxs) {
    return idxs.map((i) => {
      const q = lesson.quiz.questions[i];
      return `<div class="card stack"><p class="sentence" style="font-size: 16px">${esc(q.q || q.prompt)}</p><p style="margin: 0">Sahi: <b>${esc(q.answer)}</b></p>${kyun(q.why)}</div>`;
    }).join('');
  }

  // Writing practice: each line is checked against its lesson pattern.
  function checkWrite(p, text) {
    if (norm(text).length < 3) return { ok: false, msg: 'Kam se kam 3 shabd ka poora sentence likho.' };
    const ok = new RegExp(p.pattern).test(' ' + norm(text).join(' ') + ' ');
    return { ok, msg: ok ? p.ok : p.fix };
  }

  function norm(s) {
    return s.toLowerCase().replace(/[’‘]/g, "'").replace(/[^a-z0-9' ]/g, ' ').split(/\s+/).filter(Boolean);
  }

  // ---------- render + actions ----------
  const app = document.getElementById('app');
  let speakFromTask = false;

  function render() {
    const name = ui.screen;
    const html = name === 'speak' ? screens.speak(speakFromTask) : screens[name]();
    app.innerHTML = html;
    const main = app.querySelector('.screen');
    if (ui.lastScreen === name) {
      main.style.animation = 'none';
    } else {
      window.scrollTo(0, 0);
      const h = app.querySelector('h1');
      if (h) h.focus({ preventScroll: true });
    }
    ui.lastScreen = name;
  }

  function go(screen) {
    if (screen === 'speak-task') { speakFromTask = true; ui.speak = { idx: 0, heard: '', listening: false, error: '' }; screen = 'speak'; }
    else if (screen === 'speak') { speakFromTask = false; ui.speak = { idx: 0, heard: '', listening: false, error: '' }; }
    ui.screen = screen;
    render();
  }

  let recognizer = null;
  function listen() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    if (ui.speak.listening && recognizer) { recognizer.stop(); return; }
    recognizer = new SR();
    recognizer.lang = 'en-IN';
    recognizer.interimResults = false;
    recognizer.maxAlternatives = 1;
    recognizer.onresult = (e) => { ui.speak.heard = e.results[0][0].transcript; };
    recognizer.onerror = (e) => { ui.speak.error = e.error === 'not-allowed' ? 'Yahan mic ki ijaazat nahi mili. Sentence zor se bolo aur aage badho. (Chrome mein app khologe to mic se check bhi hoga.)' : 'Awaaz saaf nahi aayi, dobara bolo.'; };
    recognizer.onend = () => { ui.speak.listening = false; render(); };
    ui.speak.listening = true;
    ui.speak.error = '';
    ui.speak.heard = '';
    render();
    try { recognizer.start(); } catch (e) { ui.speak.listening = false; render(); }
  }

  const actions = {
    go,
    'open-step'(id) {
      if (!data.startedAt[DAY]) { data.startedAt[DAY] = Date.now(); save(); }
      if (id === 'practice') {
        if (learnDone()) { ui.lockNote = false; actions['start-quiz'](); } else { ui.lockNote = true; render(); }
        return;
      }
      ui.lockNote = false;
      if (id === 'words') ui.wordIdx = 0;
      if (id === 'grammar') ui.ruleIdx = 0;
      go(id);
    },
    'finish-step'(id) { markStep(id); go('task'); },
    'toggle-hindi'() { ui.showHindi = !ui.showHindi; render(); },
    'say-passage'() { say(lesson.reading.lines.map((l) => l.en).join(' ')); },
    say(text) { say(text); },
    word(d) { ui.wordIdx = Math.min(Math.max(ui.wordIdx + Number(d), 0), lesson.words.length - 1); render(); window.scrollTo(0, 0); },
    rule(d) { ui.ruleIdx = Math.min(Math.max(ui.ruleIdx + Number(d), 0), lesson.grammar.rules.length - 1); render(); window.scrollTo(0, 0); },
    'start-quiz'() {
      // shuffle options so the right answer is not always in the same place
      const orders = lesson.quiz.questions.map((q) => {
        const o = q.options.slice();
        for (let i = o.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [o[i], o[j]] = [o[j], o[i]]; }
        return o;
      });
      ui.quiz = { idx: 0, picked: null, correct: 0, wrong: [], orders };
      go('quiz');
    },
    pick(opt) {
      const qz = ui.quiz;
      if (qz.picked) return;
      qz.picked = opt;
      if (opt === lesson.quiz.questions[qz.idx].answer) qz.correct++; else qz.wrong.push(qz.idx);
      render();
    },
    'next-q'() {
      const qz = ui.quiz;
      if (qz.idx === lesson.quiz.questions.length - 1) {
        const pct = Math.round((qz.correct / lesson.quiz.questions.length) * 100);
        data.bestScore[DAY] = Math.max(data.bestScore[DAY] || 0, pct);
        if (pct >= lesson.quiz.passPercent) data.quizLast[DAY] = { correct: qz.correct, total: lesson.quiz.questions.length, wrong: qz.wrong.slice() };
        save();
        go('result');
        return;
      }
      qz.idx++;
      qz.picked = null;
      render();
      window.scrollTo(0, 0);
    },
    listen,
    'open-day'(n) { useDay(Number(n)); go('task'); },
    'have-account'() {
      if (data.name) { go('home'); return; }
      ui.welcomeNote = 'Is phone pe pehle ka koi account nahi mila. Upar naam likh kar shuru karein.';
      render();
    },
    'check-write'() { ui.write.checked = true; render(); },
    'ask-reset'() { ui.confirmReset = true; render(); },
    'cancel-reset'() { ui.confirmReset = false; render(); },
    'next-speak'() {
      ui.speak.idx = (ui.speak.idx + 1) % lesson.speak.length;
      ui.speak.heard = '';
      ui.speak.error = '';
      render();
    },
    'finish-day'() { markStep('practice'); completeDay(); go('complete'); },
    reset() {
      ui.confirmReset = false;
      data = defaults();
      useDay(currentDay());
      save();
      go('welcome');
    }
  };

  app.addEventListener('click', (e) => {
    const el = e.target.closest('[data-act]');
    if (!el || el.disabled) return;
    const fn = actions[el.dataset.act];
    if (fn) fn(el.dataset.arg);
  });

  app.addEventListener('input', (e) => {
    const i = e.target.dataset && e.target.dataset.write;
    if (i === undefined) return;
    ui.write.text[Number(i)] = e.target.value;
    ui.write.checked = false;
  });

  app.addEventListener('submit', (e) => {
    const form = e.target.closest('[data-form="name"]');
    if (!form) return;
    e.preventDefault();
    const name = form.elements.name.value.trim();
    if (!name) return;
    data.name = name;
    save();
    go('home');
  });

  render();
})();
