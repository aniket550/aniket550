// Roz: screens, gestures and platform glue. Habit math lives in core.js.
(function () {
  "use strict";

  const C = window.HabitCore;
  const capCore = window.capacitorExports;
  const native = !!(capCore && capCore.Capacitor.isNativePlatform());
  const desktop = window.rozDesktop || null; // set by the Electron preload
  const trayMode = location.hash === "#tray";
  const STORE_KEY = "roz.state.v1";
  const MILESTONES = [7, 21, 30, 50, 100, 200, 365];

  const COLORS = [
    { id: "sky", hex: "#3F82CC" }, { id: "clay", hex: "#C96A42" }, { id: "sage", hex: "#4F8C63" },
    { id: "iris", hex: "#7766C6" }, { id: "amber", hex: "#B87B1E" }, { id: "rose", hex: "#C25E7D" },
    { id: "teal", hex: "#2F8F8F" }, { id: "slate", hex: "#565B66" }
  ];
  const EMOJIS = ["💧", "📚", "🧘", "🏃", "😴", "🥗", "💊", "🦷", "✍️", "🎸", "🧠", "🚶",
    "🏋️", "🚴", "🧹", "🌱", "☀️", "🙏", "📵", "🍎", "☕", "🎨", "💻", "🗣️",
    "💰", "🛏️", "🚿", "🧴", "📞", "🎧", "🧊", "❤️"];
  const TIMES = [
    { id: "morning", label: "Morning", icon: "sunrise" },
    { id: "afternoon", label: "Afternoon", icon: "sun" },
    { id: "evening", label: "Evening", icon: "moon" },
    { id: "anytime", label: "Anytime", icon: "infinity" }
  ];
  const DOW_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0]; // Monday first

  // ---------- icons (SF Symbols-like line icons) ----------
  const svg = (body, size, extra) => '<svg width="' + (size || 22) + '" height="' + (size || 22) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"' + (extra || "") + ">" + body + "</svg>";
  const ICON = {
    today: (s) => svg('<rect x="3.5" y="4.5" width="17" height="16" rx="4"/><path d="M3.5 9.5h17M8 2.8v3.4M16 2.8v3.4"/><path d="M8.6 14.6l2.2 2.1 4.6-4.4"/>', s),
    progress: (s) => svg('<path d="M5 20V12M10 20V6M15 20v-9M20 20V4"/>', s, ' stroke-width="2.4"'),
    habits: (s) => svg('<rect x="3.5" y="3.5" width="7" height="7" rx="2.2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2.2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2.2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2.2"/>', s),
    settings: (s) => svg('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>', s),
    plus: (s) => svg('<path d="M12 5v14M5 12h14"/>', s, ' stroke-width="2.2"'),
    minus: (s) => svg('<path d="M5 12h14"/>', s, ' stroke-width="2.2"'),
    check: (s) => svg('<path d="M5 12.5l4.5 4.5L19 7.5"/>', s, ' stroke-width="2.8"'),
    flame: (s) => '<svg width="' + (s || 14) + '" height="' + (s || 14) + '" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 23c-4.4 0-7.5-3-7.5-7.2 0-3.3 2-5.6 3.8-7.6.4-.4 1-.1 1 .4 0 1.6.8 2.9 2 3.5-.4-3.7 1.2-6.9 4-9.6.4-.4 1-.1 1 .4.2 2.9 1.9 4.9 3.4 6.8 1.2 1.5 1.8 3.2 1.8 5.1C21.5 20 17 23 12 23z"/></svg>',
    left: (s) => svg('<path d="M15 5l-7 7 7 7"/>', s, ' stroke-width="2.3"'),
    right: (s) => svg('<path d="M9 5l7 7-7 7"/>', s, ' stroke-width="2.3"'),
    close: (s) => svg('<path d="M6 6l12 12M18 6L6 18"/>', s, ' stroke-width="2.2"'),
    list: (s) => svg('<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>', s),
    grid: (s) => svg('<rect x="3.5" y="5" width="17" height="14" rx="3"/><path d="M3.5 10h17M3.5 14.5h17M9.2 5v14M14.8 5v14"/>', s),
    trophy: (s) => svg('<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H4.5a3 3 0 0 0 3.5 4M16 6h3.5a3 3 0 0 1-3.5 4M12 13v4M8.5 20.5h7M9.5 17h5"/>', s),
    sunrise: (s) => svg('<path d="M4 18h16M7 14.5a5 5 0 0 1 10 0M12 4v3.5M5 8.5l1.6 1.4M19 8.5l-1.6 1.4"/>', s),
    sun: (s) => svg('<circle cx="12" cy="12" r="4"/><path d="M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2M5.5 5.5l1.4 1.4M17.1 17.1l1.4 1.4M5.5 18.5l1.4-1.4M17.1 6.9l1.4-1.4"/>', s),
    moon: (s) => svg('<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>', s),
    infinity: (s) => svg('<path d="M7.5 8.5a3.5 3.5 0 1 0 0 7c3.5 0 5.5-7 9-7a3.5 3.5 0 1 1 0 7c-3.5 0-5.5-7-9-7z"/>', s),
    pencil: (s) => svg('<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>', s),
    trash: (s) => svg('<path d="M4 7h16M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13M10 11v5.5M14 11v5.5"/>', s),
    upload: (s) => svg('<path d="M12 15V3.5M7.5 8L12 3.5 16.5 8"/><path d="M5 13v5.5A2 2 0 0 0 7 20.5h10a2 2 0 0 0 2-2V13"/>', s),
    download: (s) => svg('<path d="M12 3.5V15M7.5 10.5L12 15l4.5-4.5"/><path d="M5 13v5.5A2 2 0 0 0 7 20.5h10a2 2 0 0 0 2-2V13"/>', s),
    sparkle: (s) => svg('<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 16l.7 1.8 1.8.7-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7z"/>', s),
    open: (s) => svg('<path d="M14 4h6v6M20 4l-8.5 8.5M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10"/>', s)
  };

  // ---------- small helpers ----------
  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  const todayKey = () => C.dateKey(new Date());
  const fmt = (key, opts) => C.parseKey(key).toLocaleDateString("en-GB", opts);
  const plural = (n, one, many) => n + " " + (n === 1 ? one : (many || one + "s"));
  const pct = (done, total) => (total ? Math.round((done / total) * 100) : 0);
  const habitById = (id) => data.habits.find((h) => h.id === id);
  const colorOf = (h) => (COLORS.find((c) => c.id === h.color) || COLORS[0]).hex;
  const uid = () => "h" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const wideQuery = window.matchMedia("(min-width: 900px)");
  const isWide = () => wideQuery.matches && !trayMode;

  function scheduleText(h) {
    const s = h.schedule;
    if (s.type === "weekly") return s.times + "× a week";
    if (s.type === "days") {
      const d = s.days.slice().sort().join();
      if (d === "1,2,3,4,5") return "Weekdays";
      if (d === "0,6") return "Weekends";
      if (s.days.length === 7) return "Every day";
      return WEEK_ORDER.filter((x) => s.days.indexOf(x) !== -1).map((x) => DOW_SHORT[x]).join(", ");
    }
    return "Every day";
  }
  function goalText(h) { return h.target > 1 ? h.target + " " + (h.unit || "times") : ""; }

  // ---------- storage ----------
  const Store = {
    async load() {
      try {
        let raw;
        if (native) raw = (await capacitorPreferences.Preferences.get({ key: STORE_KEY })).value;
        else raw = localStorage.getItem(STORE_KEY);
        return raw ? JSON.parse(raw) : null;
      } catch (e) { return null; }
    },
    save(state) {
      const raw = JSON.stringify(state);
      if (native) capacitorPreferences.Preferences.set({ key: STORE_KEY, value: raw }).catch(() => {});
      else try { localStorage.setItem(STORE_KEY, raw); } catch (e) { /* private mode: keep going in memory */ }
    }
  };

  // Habits saved by older versions or backups may lack the UI-only fields.
  function normalize(state) {
    state.habits.forEach((h, i) => {
      if (!COLORS.some((c) => c.id === h.color)) h.color = COLORS[i % COLORS.length].id;
      if (!TIMES.some((t) => t.id === h.time)) h.time = "anytime";
      if (typeof h.emoji !== "string" || !h.emoji) h.emoji = "✓";
      if (typeof h.unit !== "string") h.unit = "";
      h.target = Math.max(1, Math.floor(h.target));
    });
    return state;
  }

  // ---------- haptics ----------
  function haptic(kind) {
    if (native) {
      const H = capacitorHaptics.Haptics;
      if (kind === "success") H.notification({ type: "SUCCESS" }).catch(() => {});
      else H.impact({ style: kind === "medium" ? "MEDIUM" : "LIGHT" }).catch(() => {});
    } else if (navigator.vibrate) {
      try { navigator.vibrate(kind === "success" ? [12, 60, 18] : 8); } catch (e) { /* not allowed here */ }
    }
  }

  // ---------- state ----------
  let data = C.emptyState();
  let loaded = false;
  const ui = {
    tab: "today", day: todayKey(), view: "list", detail: null, mode: "month", calMonth: null,
    sheet: null, confirm: null, celebrate: null, toast: null, enter: true
  };
  const ringMemory = {}; // previous arc lengths, so rings animate between renders

  function commit() { Store.save(data); render(); }

  // ---------- day maths for the UI ----------
  // A weekly habit counts as satisfied once its weekly goal is met.
  function itemsFor(key) {
    return C.dayItems(data, key).map((it) => {
      const s = it.habit.schedule;
      it.satisfied = it.done || (s.type === "weekly" && it.weekDone >= s.times);
      it.frac = it.satisfied ? 1 : Math.min(1, it.count / it.habit.target);
      return it;
    });
  }
  function dayStats(key) {
    const items = itemsFor(key);
    return { items: items, done: items.filter((i) => i.satisfied).length, total: items.length };
  }
  // Same counting as the Day Ring, summed over the week up to today.
  function weekSoFar(anchor) {
    const today = todayKey();
    const start = C.weekStart(anchor);
    let done = 0, due = 0;
    for (let i = 0; i < 7; i++) {
      const k = C.addDays(start, i);
      if (k > today) break;
      const s = dayStats(k);
      done += s.done; due += s.total;
    }
    return { done: done, due: due, pct: pct(done, due) };
  }

  // ---------- ring ----------
  // One arc per habit in its own colour; the arc fills as the habit gets done.
  function ring(key, segments, size, stroke) {
    const r = (size - stroke) / 2;
    const circ = 2 * Math.PI * r;
    const n = Math.max(segments.length, 1);
    const gap = n > 1 ? Math.min(stroke + 3, circ / n / 2) : 0;
    const seg = circ / n - gap;
    const prev = ringMemory[key] || [];
    const lens = [];
    let arcs = "";
    segments.forEach((s, i) => {
      const off = -(i * (seg + gap)) - gap / 2;
      const len = Math.max(0, seg * s.frac);
      lens.push(len);
      const from = prev[i] != null ? prev[i] : len;
      arcs += '<circle class="ring-track" cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" stroke-width="' + stroke + '" stroke-dasharray="' + seg + " " + circ + '" stroke-dashoffset="' + off + '" style="stroke:' + s.color + '"/>';
      arcs += '<circle class="ring-arc" data-len="' + len + '" data-circ="' + circ + '" cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" stroke-width="' + stroke + '" stroke-dasharray="' + from + " " + circ + '" stroke-dashoffset="' + off + '" style="stroke:' + s.color + (len === 0 && from === 0 ? ";opacity:0" : "") + '"/>';
    });
    if (!segments.length) arcs = '<circle class="ring-track" cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" stroke-width="' + stroke + '" style="stroke:var(--label)"/>';
    ringMemory[key] = lens;
    return '<svg class="ring" width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + " " + size + '" aria-hidden="true"><g transform="rotate(-90 ' + size / 2 + " " + size / 2 + ')">' + arcs + "</g></svg>";
  }
  function animateRings(root) {
    root.querySelectorAll(".ring-arc").forEach((el) => {
      const len = +el.dataset.len;
      requestAnimationFrame(() => requestAnimationFrame(() => {
        el.style.opacity = len > 0 ? "1" : "0";
        el.setAttribute("stroke-dasharray", len + " " + el.dataset.circ);
      }));
    });
  }
  function miniRing(frac, size, color) {
    const stroke = 2.5, r = (size - stroke) / 2, circ = 2 * Math.PI * r;
    return '<svg class="mini-ring" width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + " " + size + '" aria-hidden="true"><circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" stroke-width="' + stroke + '" class="mini-track"/><circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" stroke-width="' + stroke + '" stroke="' + (color || "var(--accent)") + '" stroke-dasharray="' + circ * frac + " " + circ + '" transform="rotate(-90 ' + size / 2 + " " + size / 2 + ')" fill="none" stroke-linecap="round"/></svg>';
  }

  // ---------- screens: Today ----------
  function weekStrip() {
    const today = todayKey();
    const start = C.weekStart(ui.day);
    let cells = "";
    for (let i = 0; i < 7; i++) {
      const k = C.addDays(start, i);
      const st = k <= today ? dayStats(k) : { done: 0, total: 0 };
      const cls = ["wk-day"];
      if (k === ui.day) cls.push("sel");
      if (k === today) cls.push("is-today");
      if (k > today) cls.push("future");
      if (st.total && st.done === st.total) cls.push("perfect");
      cells += '<button class="' + cls.join(" ") + '" data-action="day" data-key="' + k + '"' + (k > today ? " disabled" : "") +
        ' aria-label="' + fmt(k, { weekday: "long", day: "numeric", month: "long" }) + '"' + (k === ui.day ? ' aria-current="date"' : "") + ">" +
        '<span class="wk-dow">' + fmt(k, { weekday: "short" }).slice(0, 3) + "</span>" +
        '<span class="wk-num">' + miniRing(st.total ? st.done / st.total : 0, 34) + "<b>" + C.parseKey(k).getDate() + "</b></span></button>";
    }
    const nextOk = C.addDays(start, 7) <= today;
    return '<div class="week-head"><span class="caption">' + fmt(ui.day, { month: "long", year: "numeric" }) + "</span>" +
      '<span class="week-nav"><button class="icon-btn sm" data-action="week" data-dir="-1" aria-label="Previous week">' + ICON.left(18) + "</button>" +
      '<button class="icon-btn sm" data-action="week" data-dir="1" aria-label="Next week"' + (nextOk ? "" : " disabled") + ">" + ICON.right(18) + "</button></span></div>" +
      '<div class="week-strip">' + cells + "</div>";
  }

  function summaryCard(st) {
    const left = st.total - st.done;
    const best = data.habits.map((h) => ({ h: h, s: C.streak(data, h, todayKey()) })).filter((x) => x.s.current > 0)
      .sort((a, b) => b.s.current - a.s.current)[0];
    const segs = st.items.map((i) => ({ color: colorOf(i.habit), frac: i.frac }));
    const perfect = st.total > 0 && left === 0;
    let line;
    if (!st.total) line = "Nothing scheduled";
    else if (perfect) line = "Every habit done. Perfect day.";
    else line = plural(left, "habit") + " to go";
    return '<section class="summary card' + (perfect ? " perfect" : "") + '">' +
      '<div class="ring-wrap">' + ring("day", segs, 112, 11) + '<div class="ring-center"><b class="num">' + pct(st.done, st.total) + '<small>%</small></b></div></div>' +
      '<div class="summary-text"><p class="summary-big num">' + st.done + '<span> / ' + st.total + "</span></p>" +
      '<p class="summary-line">' + line + "</p>" +
      (best ? '<p class="streak-chip" style="--c:' + colorOf(best.h) + '">' + ICON.flame(13) + " " + esc(best.h.name) + " · " + plural(best.s.current, best.s.unit) + "</p>" : "") +
      "</div></section>";
  }

  function rowSub(it) {
    const h = it.habit, s = h.schedule;
    if (h.target > 1) return it.count + " / " + h.target + " " + esc(h.unit || "times");
    if (s.type === "weekly") return (it.weekDone >= s.times ? "Week complete · " : "") + it.weekDone + " of " + s.times + " this week";
    const st = C.streak(data, h, todayKey());
    if (st.current >= 2) return ICON.flame(12) + " " + plural(st.current, "day") + " streak";
    return scheduleText(h);
  }

  function habitRow(it) {
    const h = it.habit;
    const future = ui.day > todayKey();
    const counter = h.target > 1;
    const cls = ["habit-row"];
    if (it.done) cls.push("done");
    else if (it.satisfied) cls.push("met");
    if (ui.flash === h.id) cls.push("pop");
    const fill = counter && !it.done ? '<span class="row-fill" style="width:' + Math.round(it.frac * 100) + '%"></span>' : "";
    const btnLabel = counter ? "Add one to " + h.name : (it.done ? "Mark " + h.name + " not done" : "Mark " + h.name + " done");
    const btn = '<button class="check' + (counter && !it.done ? " counter" : "") + '" data-action="toggle" data-id="' + h.id + '" aria-label="' + esc(btnLabel) + '"' + (future ? " disabled" : "") + ">" +
      (counter && !it.done ? miniRing(it.frac, 30, "currentColor") + ICON.plus(14) : ICON.check(16)) + "</button>";
    return '<div class="' + cls.join(" ") + '" style="--c:' + colorOf(h) + '" data-id="' + h.id + '">' +
      '<div class="swipe-hint left">' + ICON.check(18) + '</div><div class="swipe-hint right">' + ICON.minus(18) + "</div>" +
      '<div class="row-body">' + fill +
      '<button class="row-main" data-action="open" data-id="' + h.id + '"><span class="emoji">' + esc(h.emoji) + "</span>" +
      '<span class="row-text"><span class="row-title">' + esc(h.name) + '</span><span class="row-sub">' + rowSub(it) + "</span></span></button>" +
      btn + "</div></div>";
  }

  function listView(st) {
    if (!data.habits.length) return emptyToday();
    if (!st.total) return '<div class="empty-note card"><p>Nothing scheduled for this day.</p></div>';
    return TIMES.map((t) => {
      const items = st.items.filter((i) => i.habit.time === t.id);
      if (!items.length) return "";
      const done = items.filter((i) => i.satisfied).length;
      return '<section class="time-group"><header class="group-head"><span>' + ICON[t.icon](15) + t.label + "</span><span class=\"num\">" + done + "/" + items.length + "</span></header>" +
        '<div class="rows">' + items.map(habitRow).join("") + "</div></section>";
    }).join("");
  }

  function gridView() {
    const today = todayKey();
    const start = C.weekStart(ui.day);
    const days = [];
    for (let i = 0; i < 7; i++) days.push(C.addDays(start, i));
    const habits = data.habits.filter((h) => days.some((k) => C.isScheduled(h, k)));
    if (!habits.length) return emptyToday();
    const head = '<div class="g-name"></div>' + days.map((k) => '<div class="g-day' + (k === today ? " is-today" : "") + '"><span>' + fmt(k, { weekday: "narrow" }) + "</span><b class=\"num\">" + C.parseKey(k).getDate() + "</b></div>").join("");
    const rows = habits.map((h) => {
      const cells = days.map((k) => {
        if (!C.isScheduled(h, k)) return '<span class="g-cell off" aria-hidden="true"></span>';
        const n = C.countOn(data, h.id, k);
        const done = n >= h.target;
        const cls = "g-cell" + (done ? " done" : n ? " part" : "") + (k > today ? " future" : "");
        const label = esc(h.name) + ", " + fmt(k, { weekday: "long" }) + (done ? ", done" : ", not done");
        return '<button class="' + cls + '" style="--c:' + colorOf(h) + '" data-action="cell" data-id="' + h.id + '" data-key="' + k + '" aria-label="' + label + '"' + (k > today ? " disabled" : "") + ">" + (done ? ICON.check(13) : "") + "</button>";
      }).join("");
      return '<button class="g-name" data-action="open" data-id="' + h.id + '"><span>' + esc(h.emoji) + "</span>" + esc(h.name) + "</button>" + cells;
    }).join("");
    return '<section class="card grid-card"><div class="week-grid">' + head + rows + "</div></section>";
  }

  function emptyToday() {
    return '<div class="empty card"><div class="empty-art">' + ring("empty", [{ color: "#3F82CC", frac: 0.75 }, { color: "#C96A42", frac: 1 }, { color: "#4F8C63", frac: 0.4 }], 92, 10) + "</div>" +
      "<h2>Start with one small habit</h2><p>Pick something you can do even on a bad day. You can add more later.</p>" +
      '<button class="btn" data-action="add">' + ICON.plus(18) + "New habit</button></div>";
  }

  function todayScreen() {
    const today = todayKey();
    const st = dayStats(ui.day);
    const wk = weekSoFar(ui.day);
    const isToday = ui.day === today;
    const title = fmt(ui.day, { weekday: "long" });
    const sub = isToday ? "Today · " + fmt(ui.day, { day: "numeric", month: "long" }) : fmt(ui.day, { day: "numeric", month: "long" });
    const tools = '<div class="head-tools">' +
      (isToday ? "" : '<button class="pill-btn" data-action="go-today">Today</button>') +
      '<button class="icon-btn glass" data-action="view" aria-label="' + (ui.view === "list" ? "Show week grid" : "Show list") + '">' + (ui.view === "list" ? ICON.grid(20) : ICON.list(20)) + "</button>" +
      '<button class="icon-btn glass" data-action="add" aria-label="New habit">' + ICON.plus(20) + "</button></div>";
    let body = '<header class="screen-head"><div><h1 class="large-title">' + title + '</h1><p class="subtitle">' + sub + "</p></div>" + tools + "</header>" +
      weekStrip();
    if (data.habits.length) body += summaryCard(st);
    body += ui.view === "grid" ? gridView() : listView(st);
    if (data.habits.length && wk.due) {
      body += '<section class="week-foot card"><div><p class="caption">This week so far</p><p class="foot-big"><b class="num">' + wk.done + "</b> of " + wk.due + " done</p></div>" +
        '<div class="foot-ring">' + miniRing(wk.due ? wk.done / wk.due : 0, 44) + '<span class="num">' + wk.pct + "%</span></div></section>";
      if (ui.view === "list") body += '<p class="hint">Swipe a habit right to check it off, left to undo.</p>';
    }
    return body;
  }

  // ---------- screens: Progress ----------
  function barChart(bars, height, opts) {
    opts = opts || {};
    return '<div class="bars' + (opts.cls ? " " + opts.cls : "") + '" style="--h:' + height + 'px">' + bars.map((b) =>
      '<div class="bar-col' + (b.hi ? " hi" : "") + (b.muted ? " muted" : "") + '"' + (b.title ? ' title="' + esc(b.title) + '"' : "") + ">" +
      (opts.values ? '<span class="bar-val num">' + (b.v == null ? "" : b.v + "%") + "</span>" : "") +
      '<span class="bar-track"><span class="bar" style="height:' + (b.v == null ? 0 : Math.max(4, b.v)) + '%"></span></span>' +
      '<span class="bar-label">' + b.label + "</span></div>").join("") + "</div>";
  }

  function progressScreen() {
    const today = todayKey();
    if (!data.habits.length) return '<header class="screen-head"><div><h1 class="large-title">Progress</h1></div></header>' + emptyToday();
    const start = C.weekStart(today);
    const wk = weekSoFar(today);
    const dayBars = [];
    let shownUp = 0, perfect = 0;
    for (let i = 0; i < 7; i++) {
      const k = C.addDays(start, i);
      if (k > today) { dayBars.push({ v: null, label: fmt(k, { weekday: "narrow" }), muted: true }); continue; }
      const s = dayStats(k);
      if (s.done) shownUp++;
      if (s.total && s.done === s.total) perfect++;
      dayBars.push({ v: s.total ? pct(s.done, s.total) : null, label: fmt(k, { weekday: "narrow" }), hi: k === today, title: fmt(k, { weekday: "long" }) + ": " + s.done + " of " + s.total });
    }
    const streaks = data.habits.map((h) => ({ h: h, s: C.streak(data, h, today), r: C.rate(data, h, C.addDays(today, -29), today) }));
    const bestEver = streaks.reduce((m, x) => Math.max(m, x.s.unit === "day" ? x.s.best : 0), 0);
    const totalChecks = Object.keys(data.log).reduce((n, k) => n + data.habits.filter((h) => C.isDone(data, h, k)).length, 0);

    const weeks = C.weeklyOverall(data, today, 8).map((w, i, a) => ({
      v: w.pct, label: i === a.length - 1 ? "Now" : fmt(w.start, { day: "numeric", month: "short" }).replace(" ", " "), hi: i === a.length - 1,
      title: "Week of " + fmt(w.start, { day: "numeric", month: "long" })
    }));
    if (wk.due) weeks[weeks.length - 1].v = wk.pct;
    const lastPct = weeks[weeks.length - 2] ? weeks[weeks.length - 2].v : null;
    const trend = lastPct == null || wk.due === 0 ? "" : wk.pct >= lastPct ? "Ahead of last week's " + lastPct + "%" : "Last week was " + lastPct + "%";

    // Strongest weekday over the last 8 weeks (today excluded, it isn't over).
    const byDow = [0, 1, 2, 3, 4, 5, 6].map(() => ({ d: 0, t: 0 }));
    for (let k = C.addDays(today, -56); k < today; k = C.addDays(k, 1)) {
      const s = dayStats(k);
      byDow[C.dayOfWeek(k)].d += s.done; byDow[C.dayOfWeek(k)].t += s.total;
    }
    const dowPct = WEEK_ORDER.map((d) => ({ d: d, v: byDow[d].t ? pct(byDow[d].d, byDow[d].t) : null }));
    const strongest = dowPct.filter((x) => x.v != null).sort((a, b) => b.v - a.v)[0];
    const ranked = streaks.filter((x) => x.r.pct != null).sort((a, b) => b.r.pct - a.r.pct);

    let html = '<header class="screen-head"><div><h1 class="large-title">Progress</h1><p class="subtitle">Your week, and what it is adding up to.</p></div></header>';
    html += '<section class="card hero-stat"><p class="caption">Week so far</p><p class="mega num">' + wk.pct + "<small>%</small></p>" +
      '<p class="muted">' + wk.done + " of " + wk.due + " check-ins · " + plural(shownUp, "day") + " shown up" + (trend ? "<br>" + trend : "") + "</p>" +
      barChart(dayBars, 96) +
      '<div class="stat-row"><div><b class="num">' + perfect + '</b><span>Perfect days</span></div><div><b class="num">' + bestEver + '</b><span>Best streak</span></div><div><b class="num">' + totalChecks + "</b><span>Check-ins</span></div></div></section>";
    html += '<section class="card chart-card"><div class="card-head"><h2>Last 8 weeks</h2><span class="caption">All habits</span></div>' + barChart(weeks, 120, { values: true, cls: "weeks" }) + "</section>";
    html += '<div class="two-up">' +
      '<section class="card small-card"><p class="caption">Strongest day</p><p class="big-word">' + (strongest ? fmt(C.addDays(start, (strongest.d + 6) % 7), { weekday: "long" }) : "—") + "</p>" +
      barChart(dowPct.map((x) => ({ v: x.v, label: DOW_SHORT[x.d][0], hi: strongest && x.d === strongest.d })), 46, { cls: "tiny" }) + "</section>" +
      '<section class="card small-card"><p class="caption">Most consistent</p>' + (ranked[0] ? '<p class="big-word">' + esc(ranked[0].h.emoji) + " " + ranked[0].r.pct + '%</p><p class="muted small">' + esc(ranked[0].h.name) + " · last 30 days</p>" : '<p class="big-word">—</p>') + "</section></div>";

    html += '<section class="card chart-card"><div class="card-head"><h2>30-day streaks</h2><span class="caption">Tap for history</span></div><div class="streak-list">' + streaks.map((x) => {
      let cells = "";
      for (let k = C.addDays(today, -29); k <= today; k = C.addDays(k, 1)) {
        let cls = "off";
        if (C.isScheduled(x.h, k)) cls = C.isDone(data, x.h, k) ? "on" : (k === today ? "todo" : "miss");
        else if (C.countOn(data, x.h.id, k) >= x.h.target) cls = "on";
        cells += '<i class="' + cls + '"></i>';
      }
      return '<button class="streak-row" data-action="open" data-id="' + x.h.id + '" style="--c:' + colorOf(x.h) + '"><span class="sr-head"><span>' + esc(x.h.emoji) + " " + esc(x.h.name) + '</span><span class="sr-flame">' + ICON.flame(12) + " " + x.s.current + "</span></span>" +
        '<span class="sr-cells">' + cells + '</span><span class="sr-foot">' + x.r.done + " of " + x.r.due + " scheduled</span></button>";
    }).join("") + "</div></section>";

    html += '<section class="card chart-card"><div class="card-head"><h2>Compare habits</h2><span class="caption">Last 30 days</span></div><div class="compare">' + ranked.map((x) =>
      '<div class="cmp-row" style="--c:' + colorOf(x.h) + '"><span class="cmp-name">' + esc(x.h.emoji) + " " + esc(x.h.name) + '</span><span class="cmp-track"><span style="width:' + x.r.pct + '%"></span></span><b class="num">' + x.r.pct + "%</b></div>").join("") + "</div></section>";
    return html;
  }

  // ---------- screens: Habits ----------
  function habitsScreen() {
    let html = '<header class="screen-head"><div><h1 class="large-title">Habits</h1><p class="subtitle">' + plural(data.habits.length, "habit") + "</p></div>" +
      '<div class="head-tools"><button class="icon-btn glass" data-action="add" aria-label="New habit">' + ICON.plus(20) + "</button></div></header>";
    if (!data.habits.length) return html + emptyToday();
    TIMES.forEach((t) => {
      const hs = data.habits.filter((h) => h.time === t.id);
      if (!hs.length) return;
      html += '<section class="time-group"><header class="group-head"><span>' + ICON[t.icon](15) + t.label + "</span></header><div class=\"list card\">" + hs.map((h) => {
        const st = C.streak(data, h, todayKey());
        return '<button class="list-row" data-action="open" data-id="' + h.id + '"><span class="tile" style="--c:' + colorOf(h) + '">' + esc(h.emoji) + '</span><span class="lr-text"><span class="lr-title">' + esc(h.name) + '</span><span class="lr-sub">' + scheduleText(h) + (goalText(h) ? " · " + esc(goalText(h)) : "") + "</span></span>" +
          '<span class="lr-meta">' + (st.current ? ICON.flame(12) + " " + st.current : "") + "</span>" + ICON.right(16) + "</button>";
      }).join("") + "</div></section>";
    });
    return html;
  }

  // ---------- screens: Settings ----------
  function settingsScreen() {
    const theme = data.settings.theme;
    const seg = (v, label) => '<button class="seg-btn' + (theme === v ? " on" : "") + '" data-action="theme" data-v="' + v + '" aria-pressed="' + (theme === v) + '">' + label + "</button>";
    const where = desktop ? "this Mac" : native ? "this phone" : "this browser";
    return '<header class="screen-head"><div><h1 class="large-title">Settings</h1></div></header>' +
      '<section class="settings-group"><p class="caption">Appearance</p><div class="segmented" role="group" aria-label="Theme">' + seg("system", "System") + seg("light", "Light") + seg("dark", "Dark") + "</div></section>" +
      '<section class="settings-group"><p class="caption">Your data</p><div class="list card">' +
      '<button class="list-row" data-action="export"><span class="tile" style="--c:#3F82CC">' + ICON.upload(18) + '</span><span class="lr-text"><span class="lr-title">Export backup</span><span class="lr-sub">Save all habits and history as a file</span></span></button>' +
      '<button class="list-row" data-action="import"><span class="tile" style="--c:#4F8C63">' + ICON.download(18) + '</span><span class="lr-text"><span class="lr-title">Import backup</span><span class="lr-sub">Replace everything with a backup file</span></span></button>' +
      '<button class="list-row" data-action="sample"><span class="tile" style="--c:#7766C6">' + ICON.sparkle(18) + '</span><span class="lr-text"><span class="lr-title">Load example habits</span><span class="lr-sub">Replace everything with sample data</span></span></button>' +
      '<button class="list-row danger" data-action="reset"><span class="tile" style="--c:#C2413B">' + ICON.trash(18) + '</span><span class="lr-text"><span class="lr-title">Erase everything</span><span class="lr-sub">Delete all habits and history</span></span></button>' +
      '</div><p class="footnote">Your habits are stored only on ' + where + ". Export a backup to move them to another device.</p></section>" +
      '<section class="about"><div class="app-mark">' + ring("about", [{ color: "#3F82CC", frac: 1 }, { color: "#C96A42", frac: 1 }, { color: "#4F8C63", frac: 1 }], 44, 6) + "</div><p><b>Roz</b> · version 1.0</p><p class=\"muted small\">Small habits, every single day.</p></section>";
  }

  // ---------- detail ----------
  function detailView(h) {
    const today = todayKey();
    const st = C.streak(data, h, today);
    const r30 = C.rate(data, h, C.addDays(today, -29), today);
    const total = Object.keys(data.log).filter((k) => C.isDone(data, h, k)).length;
    const count = C.countOn(data, h.id, ui.day);
    const c = colorOf(h);
    let html = '<div class="detail" style="--c:' + c + '">';
    html += '<div class="detail-bar"><button class="nav-btn" data-action="close-detail">' + ICON.left(20) + (isWide() ? "Close" : "Back") + "</button>" +
      '<button class="nav-btn" data-action="edit" data-id="' + h.id + '">' + ICON.pencil(17) + "Edit</button></div>";
    html += '<section class="detail-hero"><div class="hero-top"><span class="hero-emoji">' + esc(h.emoji) + '</span><span class="hero-sched">' + scheduleText(h) + (goalText(h) ? " · " + esc(goalText(h)) : "") + "</span></div>" +
      "<h2>" + esc(h.name) + '</h2><p class="hero-since">Since ' + fmt(h.created, { day: "numeric", month: "long", year: "numeric" }) + "</p>" +
      '<p class="hero-streak"><b class="num">' + st.current + "</b><span>" + (st.unit === "week" ? (st.current === 1 ? "week" : "weeks") : (st.current === 1 ? "day" : "days")) + " in a row</span></p></section>";
    if (h.target > 1 && C.isScheduled(h, ui.day) && ui.day <= today) {
      html += '<section class="card counter-card"><button class="round-btn" data-action="dec" data-id="' + h.id + '" aria-label="Remove one"' + (count ? "" : " disabled") + ">" + ICON.minus(20) + "</button>" +
        '<div class="counter-mid"><b class="num">' + count + "<span> / " + h.target + "</span></b><span>" + esc(h.unit || "times") + " · " + (ui.day === today ? "today" : fmt(ui.day, { day: "numeric", month: "short" })) + "</span></div>" +
        '<button class="round-btn fill" data-action="inc" data-id="' + h.id + '" aria-label="Add one">' + ICON.plus(20) + "</button></section>";
    }
    html += '<div class="stat-tiles"><div class="card"><b class="num">' + st.best + "</b><span>Best " + (st.unit === "week" ? "weeks" : "streak") + '</span></div><div class="card"><b class="num">' + total + '</b><span>Times done</span></div><div class="card"><b class="num">' + (r30.pct == null ? "–" : r30.pct + "%") + "</b><span>Last 30 days</span></div></div>";
    html += '<div class="segmented wide" role="group" aria-label="History range"><button class="seg-btn' + (ui.mode === "month" ? " on" : "") + '" data-action="mode" data-v="month">Month</button><button class="seg-btn' + (ui.mode === "year" ? " on" : "") + '" data-action="mode" data-v="year">Year</button></div>';
    html += ui.mode === "month" ? monthCard(h) : yearCard(h);
    html += "</div>";
    return html;
  }

  function monthCard(h) {
    const today = todayKey();
    const anchor = ui.calMonth || today.slice(0, 7) + "-01";
    const first = anchor;
    const d = C.parseKey(first);
    const daysIn = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    const lead = (C.dayOfWeek(first) + 6) % 7;
    let cells = WEEK_ORDER.map((x) => '<span class="cal-dow">' + DOW_SHORT[x][0] + "</span>").join("");
    for (let i = 0; i < lead; i++) cells += "<span></span>";
    let doneN = 0;
    for (let i = 0; i < daysIn; i++) {
      const k = C.addDays(first, i);
      const sched = C.isScheduled(h, k);
      const n = C.countOn(data, h.id, k);
      const done = n >= h.target;
      if (done) doneN++;
      const cls = ["cal-day"];
      if (done) cls.push("done");
      else if (n) cls.push("part");
      else if (sched && k < today) cls.push("miss");
      if (!sched && !done) cls.push("off");
      if (k === today) cls.push("is-today");
      if (k > today || k < h.created) cls.push("future");
      cells += '<button class="' + cls.join(" ") + '" data-action="cal" data-id="' + h.id + '" data-key="' + k + '"' + (k > today ? " disabled" : "") +
        ' aria-label="' + fmt(k, { day: "numeric", month: "long" }) + (done ? ", done" : "") + '"' + (n && !done ? ' style="--p:' + Math.round((n / h.target) * 100) + '%"' : "") + ">" + (i + 1) + "</button>";
    }
    const prev = C.addDays(first, -1).slice(0, 7) + "-01";
    const next = C.addDays(first, daysIn).slice(0, 7) + "-01";
    return '<section class="card month-card"><div class="card-head"><h2>' + fmt(first, { month: "long", year: "numeric" }) + '</h2><span class="week-nav">' +
      '<button class="icon-btn sm" data-action="cal-month" data-v="' + prev + '" aria-label="Previous month"' + (prev.slice(0, 7) < h.created.slice(0, 7) ? " disabled" : "") + ">" + ICON.left(18) + "</button>" +
      '<button class="icon-btn sm" data-action="cal-month" data-v="' + next + '" aria-label="Next month"' + (next > today ? " disabled" : "") + ">" + ICON.right(18) + "</button></span></div>" +
      '<div class="cal">' + cells + '</div><p class="muted small">Done ' + plural(doneN, "time") + " this month. Tap a day to fix it.</p></section>";
  }

  function yearCard(h) {
    const today = todayKey();
    const end = C.weekStart(today);
    const start = C.addDays(end, -7 * 52);
    let cols = "", months = "", lastMonth = "";
    for (let w = start; w <= end; w = C.addDays(w, 7)) {
      const m = w.slice(5, 7);
      months += "<span>" + (m !== lastMonth ? fmt(w, { month: "short" }) : "") + "</span>";
      lastMonth = m;
      let col = "";
      for (let i = 0; i < 7; i++) {
        const k = C.addDays(w, i);
        if (k > today) { col += '<i class="none"></i>'; continue; }
        const lv = C.heatLevel(data, h, k);
        col += '<i class="' + (lv ? "l" + lv : C.isScheduled(h, k) ? "l0" : "off") + '" title="' + fmt(k, { day: "numeric", month: "short" }) + '"></i>';
      }
      cols += '<span class="hm-col">' + col + "</span>";
    }
    const r = C.rate(data, h, C.addDays(today, -364), today);
    return '<section class="card year-card"><div class="card-head"><h2>Last 12 months</h2><span class="caption">' + (r.pct == null ? "" : r.pct + "% done") + '</span></div>' +
      '<div class="hm-scroll" data-scroll="heatmap"><div class="hm"><div class="hm-months">' + months + '</div><div class="hm-grid">' + cols + "</div></div></div>" +
      '<div class="hm-legend"><span>Less</span><i class="l0"></i><i class="l1"></i><i class="l2"></i><i class="l3"></i><i class="l4"></i><span>More</span></div></section>';
  }

  // ---------- editor sheet ----------
  function newDraft() {
    const used = data.habits.map((h) => h.color);
    const color = (COLORS.find((c) => used.indexOf(c.id) === -1) || COLORS[data.habits.length % COLORS.length]).id;
    return { name: "", emoji: "💧", color: color, time: "anytime", schedule: { type: "daily", days: [1, 2, 3, 4, 5], times: 3 }, target: 1, unit: "" };
  }
  function draftFrom(h) {
    return { id: h.id, name: h.name, emoji: h.emoji, color: h.color, time: h.time, unit: h.unit, target: h.target,
      schedule: { type: h.schedule.type, days: (h.schedule.days || [1, 2, 3, 4, 5]).slice(), times: h.schedule.times || 3 } };
  }

  function editorSheet(d) {
    const c = (COLORS.find((x) => x.id === d.color) || COLORS[0]).hex;
    const s = d.schedule;
    let html = '<div class="sheet-bar"><button class="nav-btn" data-action="close-sheet">Cancel</button><h2>' + (d.id ? "Edit habit" : "New habit") + '</h2><button class="nav-btn strong" data-action="save" id="save-btn"' + (d.name.trim() ? "" : " disabled") + ">Save</button></div>";
    html += '<div class="sheet-body" style="--c:' + c + '">';
    html += '<div class="editor-hero"><span class="hero-tile">' + esc(d.emoji) + '</span><input id="habit-name" class="name-input" type="text" maxlength="40" placeholder="Habit name" value="' + esc(d.name) + '" autocomplete="off" aria-label="Habit name"></div>';
    html += '<p class="caption">Icon</p><div class="emoji-grid">' + EMOJIS.map((e) => '<button class="emoji-btn' + (e === d.emoji ? " on" : "") + '" data-action="emoji" data-v="' + e + '" aria-label="Icon ' + e + '">' + e + "</button>").join("") + "</div>";
    html += '<p class="caption">Colour</p><div class="color-row">' + COLORS.map((x) => '<button class="swatch' + (x.id === d.color ? " on" : "") + '" style="--s:' + x.hex + '" data-action="color" data-v="' + x.id + '" aria-label="Colour ' + x.id + '"></button>').join("") + "</div>";
    html += '<p class="caption">Time of day</p><div class="segmented four">' + TIMES.map((t) => '<button class="seg-btn' + (d.time === t.id ? " on" : "") + '" data-action="time" data-v="' + t.id + '">' + ICON[t.icon](16) + "<span>" + t.label + "</span></button>").join("") + "</div>";
    html += '<p class="caption">Repeat</p><div class="segmented">' +
      [["daily", "Every day"], ["days", "Some days"], ["weekly", "Weekly"]].map((x) => '<button class="seg-btn' + (s.type === x[0] ? " on" : "") + '" data-action="rtype" data-v="' + x[0] + '">' + x[1] + "</button>").join("") + "</div>";
    if (s.type === "days") html += '<div class="day-chips">' + WEEK_ORDER.map((x) => '<button class="day-chip' + (s.days.indexOf(x) !== -1 ? " on" : "") + '" data-action="rday" data-v="' + x + '" aria-pressed="' + (s.days.indexOf(x) !== -1) + '">' + DOW_SHORT[x].slice(0, 2) + "</button>").join("") + "</div>";
    if (s.type === "weekly") html += '<div class="stepper-row card"><span>Times per week</span>' + stepper("times", s.times) + "</div>";
    html += '<p class="caption">Daily goal</p><div class="stepper-row card"><span>' + (d.target > 1 ? "Count up to" : "Once a day") + "</span>" + stepper("target", d.target) + "</div>";
    if (d.target > 1) html += '<input id="habit-unit" class="unit-input card" type="text" maxlength="16" placeholder="Unit, like glasses or pages" value="' + esc(d.unit) + '" aria-label="Unit">';
    if (d.id) html += '<button class="btn ghost-danger" data-action="delete" data-id="' + d.id + '">' + ICON.trash(18) + "Delete habit</button>";
    html += "</div>";
    return html;
  }
  function stepper(field, v) {
    return '<span class="stepper"><button data-action="step" data-f="' + field + '" data-d="-1" aria-label="Less"' + (v <= 1 ? " disabled" : "") + ">" + ICON.minus(16) + '</button><b class="num">' + v + '</b><button data-action="step" data-f="' + field + '" data-d="1" aria-label="More"' + (v >= (field === "times" ? 7 : 99) ? " disabled" : "") + ">" + ICON.plus(16) + "</button></span>";
  }

  // ---------- overlays ----------
  function confirmSheet(cf) {
    return '<div class="confirm card" role="alertdialog" aria-labelledby="cf-title"><h2 id="cf-title">' + esc(cf.title) + "</h2><p>" + esc(cf.text) + "</p>" +
      '<div class="confirm-btns"><button class="btn secondary" data-action="confirm-no">Cancel</button><button class="btn' + (cf.danger ? " danger" : "") + '" data-action="confirm-yes">' + esc(cf.yes) + "</button></div></div>";
  }

  function celebrateView(cb) {
    const h = habitById(cb.id);
    if (!h) return "";
    const n = cb.n;
    const unit = cb.unit === "week" ? "weeks" : "days";
    const lines = {
      7: "A full week. This is how habits start to stick.",
      21: "Three weeks. It is starting to feel normal.",
      30: "A whole month. Look how far you have come.",
      50: "Fifty. Most people never get here.",
      100: "One hundred. This is who you are now.",
      200: "Two hundred. Quietly remarkable.",
      365: "A full year. Every single day."
    };
    let dots = "";
    for (let i = 0; i < 7; i++) dots += "<i></i>";
    return '<div class="celebrate" style="--c:' + colorOf(h) + '" role="dialog" aria-labelledby="cb-n">' +
      '<div class="cb-glow"></div><div class="cb-inner"><p class="caption">' + n + " " + unit + ' in a row</p><p class="cb-num num" id="cb-n" data-to="' + n + '">' + n + "</p>" +
      '<div class="cb-dots">' + dots + '</div><p class="cb-name">' + esc(h.emoji) + " " + esc(h.name) + "</p><p class=\"cb-line\">" + (lines[n] || "Keep it going.") + "</p>" +
      '<button class="btn light" data-action="celebrate-close">Keep going</button></div></div>';
  }

  // ---------- shell ----------
  const TABS = [["today", "Today"], ["progress", "Progress"], ["habits", "Habits"], ["settings", "Settings"]];

  function sidebar() {
    const today = todayKey();
    return '<nav class="sidebar" aria-label="Sections"><div class="side-brand">' + ring("brand", [{ color: "#3F82CC", frac: 1 }, { color: "#C96A42", frac: 1 }, { color: "#4F8C63", frac: 1 }], 26, 4) + "<b>Roz</b></div>" +
      TABS.map((t) => '<button class="side-item' + (ui.tab === t[0] ? " on" : "") + '" data-action="tab" data-v="' + t[0] + '">' + ICON[t[0]](18) + "<span>" + t[1] + "</span></button>").join("") +
      '<p class="side-caption">Habits</p><div class="side-habits">' + data.habits.map((h) => {
        const st = C.streak(data, h, today);
        const done = C.isScheduled(h, today) && C.isDone(data, h, today);
        return '<button class="side-habit' + (ui.detail === h.id ? " on" : "") + '" data-action="open" data-id="' + h.id + '" style="--c:' + colorOf(h) + '"><span class="dot' + (done ? " done" : "") + '"></span><span class="sh-name">' + esc(h.emoji) + " " + esc(h.name) + "</span>" + (st.current ? '<span class="sh-streak num">' + st.current + "</span>" : "") + "</button>";
      }).join("") + "</div>" +
      '<button class="side-new" data-action="add">' + ICON.plus(16) + "New habit<kbd>⌘N</kbd></button></nav>";
  }

  function tabbar() {
    const i = Math.max(0, TABS.findIndex((t) => t[0] === ui.tab));
    return '<nav class="tabbar" aria-label="Sections"><span class="tab-glow" style="transform:translateX(' + i * 100 + '%)"></span>' + TABS.map((t) =>
      '<button class="tab' + (ui.tab === t[0] ? " on" : "") + '" data-action="tab" data-v="' + t[0] + '"' + (ui.tab === t[0] ? ' aria-current="page"' : "") + ">" + ICON[t[0]](22) + "<span>" + t[1] + "</span></button>").join("") + "</nav>";
  }

  function trayView() {
    const today = todayKey();
    ui.day = today;
    const st = dayStats(today);
    return '<div class="tray"><header class="tray-head">' + ring("tray", st.items.map((i) => ({ color: colorOf(i.habit), frac: i.frac })), 40, 5) +
      '<div><b>' + fmt(today, { weekday: "long", day: "numeric", month: "short" }) + "</b><span>" + st.done + " of " + st.total + " done</span></div>" +
      '<button class="icon-btn sm" data-action="open-main" aria-label="Open Roz">' + ICON.open(17) + "</button></header>" +
      '<div class="rows">' + (st.items.length ? st.items.map(habitRow).join("") : '<p class="muted small">Nothing scheduled today.</p>') + "</div></div>";
  }

  function mainScreen() {
    const h = ui.detail && habitById(ui.detail);
    if (h && !isWide()) return detailView(h);
    if (ui.tab === "progress") return progressScreen();
    if (ui.tab === "habits") return habitsScreen();
    if (ui.tab === "settings") return settingsScreen();
    return todayScreen();
  }

  function welcome() {
    return '<div class="welcome"><div class="welcome-art">' + ring("welcome", COLORS.slice(0, 5).map((c, i) => ({ color: c.hex, frac: [1, 1, 0.7, 1, 0.45][i] })), 180, 16) + "</div>" +
      '<h1>Roz</h1><p>Small habits, every single day.<br>See them add up.</p>' +
      '<div class="welcome-btns"><button class="btn" data-action="start-sample">' + ICON.sparkle(18) + 'Start with examples</button><button class="btn secondary" data-action="start-empty">Start empty</button></div></div>';
  }

  // ---------- render ----------
  const app = document.getElementById("app");

  function render() {
    if (!loaded) return;
    const scrolls = {};
    app.querySelectorAll("[data-scroll]").forEach((el) => { scrolls[el.dataset.scroll] = el.scrollTop || el.scrollLeft; });
    const winY = window.scrollY;
    const wide = isWide();
    const root = document.documentElement;
    root.classList.toggle("wide", wide);
    root.classList.toggle("tray-mode", trayMode);

    let html;
    if (trayMode) html = trayView();
    else if (data.welcome) html = welcome();
    else {
      const detailHabit = wide && ui.detail && (ui.tab === "today" || ui.tab === "habits") ? habitById(ui.detail) : null;
      const phoneDetail = !wide && ui.detail && habitById(ui.detail);
      html = '<div class="shell' + (detailHabit ? " has-detail" : "") + '">' + (wide ? sidebar() : "") +
        '<main class="pane main' + (ui.enter ? " enter" : "") + (phoneDetail ? " is-detail" : "") + '" data-scroll="main">' + mainScreen() + "</main>" +
        (detailHabit ? '<aside class="pane side-detail" data-scroll="detail">' + detailView(detailHabit) + "</aside>" : "") + "</div>" +
        (!wide && !phoneDetail ? tabbar() : "");
    }
    if (ui.sheet) html += '<div class="scrim' + (ui.sheet.fresh ? " enter" : "") + '" data-action="close-sheet"></div><div class="sheet' + (ui.sheet.fresh ? " enter" : "") + '" role="dialog" aria-modal="true">' + editorSheet(ui.sheet.draft) + "</div>";
    if (ui.confirm) html += '<div class="scrim top enter" data-action="confirm-no"></div>' + confirmSheet(ui.confirm);
    if (ui.celebrate) html += celebrateView(ui.celebrate);
    if (ui.toast) html += '<div class="toast" role="status">' + ui.toast + "</div>";
    app.innerHTML = html;

    app.querySelectorAll("[data-scroll]").forEach((el) => {
      const v = scrolls[el.dataset.scroll];
      if (v) { if (el.dataset.scroll === "heatmap") el.scrollLeft = v; else el.scrollTop = v; }
    });
    const hm = app.querySelector('[data-scroll="heatmap"]');
    if (hm && scrolls.heatmap == null) hm.scrollLeft = hm.scrollWidth;
    if (!ui.enter) window.scrollTo(0, winY);
    if (ui.sheet && ui.sheet.fresh) {
      ui.sheet.fresh = false;
      const name = document.getElementById("habit-name");
      if (name && !ui.sheet.draft.id && !native) setTimeout(() => name.focus(), 260);
    }
    ui.enter = false;
    ui.flash = null;
    animateRings(app);
    if (ui.celebrate && !ui.celebrate.shown) { ui.celebrate.shown = true; countUp(app.querySelector(".cb-num")); }
    applyTheme();
  }

  function countUp(el) {
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const to = +el.dataset.to, t0 = performance.now(), dur = 900;
    (function step(t) {
      const p = Math.min(1, (t - t0) / dur);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }

  let toastTimer;
  function toast(msg) {
    ui.toast = msg;
    render();
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { ui.toast = null; render(); }, 2200);
  }

  function applyTheme() {
    const t = data.settings.theme;
    const root = document.documentElement;
    if (t === "system") root.removeAttribute("data-theme"); else root.setAttribute("data-theme", t);
    const dark = t === "dark" || (t === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    if (native && capCore.SystemBars) capCore.SystemBars.setStyle({ style: dark ? "DARK" : "LIGHT" }).catch(() => {});
    if (desktop && desktop.setTheme) desktop.setTheme(t);
  }

  // ---------- actions ----------
  function go(tab) {
    ui.tab = tab; ui.enter = true;
    if (!isWide()) ui.detail = null;
    window.scrollTo(0, 0);
    render();
  }

  // +1 (or check) on a day; returns true when it completed the habit.
  function bump(h, key, delta) {
    const before = C.countOn(data, h.id, key);
    const next = Math.max(0, Math.min(h.target * 3, before + delta));
    if (next === before) return;
    const wasDone = before >= h.target;
    const streakBefore = C.streak(data, h, todayKey()).current;
    C.setCount(data, h.id, key, next);
    const nowDone = next >= h.target;
    ui.flash = h.id;
    if (nowDone && !wasDone) {
      haptic("medium");
      const s = C.streak(data, h, todayKey());
      if (key === todayKey() && s.current > streakBefore && MILESTONES.indexOf(s.current) !== -1) {
        ui.celebrate = { id: h.id, n: s.current, unit: s.unit };
        setTimeout(() => haptic("success"), 120);
      } else if (key === ui.day) {
        const st = dayStats(key);
        if (st.total && st.done === st.total) { setTimeout(() => haptic("success"), 120); Store.save(data); toast(ICON.check(16) + " Perfect day"); return; }
      }
    } else haptic("light");
    commit();
  }

  function toggle(h, key) {
    const n = C.countOn(data, h.id, key);
    if (h.target > 1) bump(h, key, n >= h.target ? -n : 1);
    else bump(h, key, n >= 1 ? -n : 1);
  }

  function openDetail(id) {
    ui.detail = id; ui.mode = "month"; ui.calMonth = null;
    if (!isWide()) { ui.enter = true; window.scrollTo(0, 0); }
    render();
  }

  function saveDraft() {
    const d = ui.sheet.draft;
    const name = d.name.trim();
    if (!name) return;
    const schedule = d.schedule.type === "days" ? { type: "days", days: d.schedule.days.slice().sort() } :
      d.schedule.type === "weekly" ? { type: "weekly", times: d.schedule.times } : { type: "daily" };
    if (schedule.type === "days" && !schedule.days.length) { toast("Pick at least one day"); return; }
    const fields = { name: name, emoji: d.emoji, color: d.color, time: d.time, schedule: schedule, target: d.target, unit: d.target > 1 ? d.unit.trim() : "" };
    if (d.id) Object.assign(habitById(d.id), fields);
    else {
      const h = Object.assign({ id: uid(), created: todayKey() }, fields);
      data.habits.push(h);
      if (isWide()) ui.detail = h.id;
    }
    ui.sheet = null;
    commit();
    haptic("light");
  }

  function askConfirm(cf) { ui.confirm = cf; render(); }

  async function exportBackup() {
    const text = JSON.stringify(data, null, 2);
    const name = "roz-backup-" + todayKey() + ".json";
    try {
      if (desktop) { if (await desktop.saveFile(name, text)) toast("Backup saved"); return; }
      if (native) {
        const fs = capacitorFilesystemPluginCapacitor.Filesystem;
        const res = await fs.writeFile({ path: name, data: text, directory: "CACHE", encoding: "utf8" });
        await capacitorShare.Share.share({ title: "Roz backup", files: [res.uri] });
        return;
      }
      if (window.ROZ_DEMO) { toast("Export works in the installed app"); return; }
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([text], { type: "application/json" }));
      a.download = name;
      document.body.appendChild(a); a.click(); a.remove();
      toast("Backup downloaded");
    } catch (e) {
      if (!/cancel/i.test(String(e && e.message))) toast("Could not export the backup");
    }
  }

  async function importBackup() {
    let text = null;
    if (desktop) text = await desktop.openFile();
    else {
      text = await new Promise((resolve) => {
        const input = document.createElement("input");
        input.type = "file"; input.accept = "application/json,.json";
        input.onchange = () => {
          const f = input.files && input.files[0];
          if (!f) return resolve(null);
          const r = new FileReader();
          r.onload = () => resolve(String(r.result)); r.onerror = () => resolve(null);
          r.readAsText(f);
        };
        input.click();
      });
    }
    if (text == null) return;
    let parsed = null;
    try { parsed = C.validate(JSON.parse(text)); } catch (e) { parsed = null; }
    if (!parsed || !parsed.habits.length) { toast("That file is not a Roz backup"); return; }
    askConfirm({
      title: "Replace your habits?", yes: "Replace", danger: true,
      text: "This replaces your " + plural(data.habits.length, "habit") + " with " + plural(parsed.habits.length, "habit") + " from the backup.",
      run: () => { data = normalize(parsed); ui.detail = null; commit(); toast("Backup imported"); }
    });
  }

  function onAction(el, ev) {
    const a = el.dataset.action;
    const id = el.dataset.id;
    const h = id && habitById(id);
    switch (a) {
      case "tab": go(el.dataset.v); break;
      case "day": ui.day = el.dataset.key; haptic("light"); render(); break;
      case "week": {
        const k = C.addDays(ui.day, 7 * +el.dataset.dir);
        ui.day = k > todayKey() ? todayKey() : k; render(); break;
      }
      case "go-today": ui.day = todayKey(); render(); break;
      case "view": ui.view = ui.view === "list" ? "grid" : "list"; render(); break;
      case "toggle": if (h) toggle(h, ui.day); break;
      case "cell": case "cal": if (h) toggle(h, el.dataset.key); break;
      case "inc": if (h) bump(h, ui.day, 1); break;
      case "dec": if (h) bump(h, ui.day, -1); break;
      case "open": openDetail(id); break;
      case "close-detail": ui.detail = null; ui.enter = !isWide(); render(); break;
      case "mode": ui.mode = el.dataset.v; render(); break;
      case "cal-month": ui.calMonth = el.dataset.v; render(); break;
      case "add": ui.sheet = { draft: newDraft(), fresh: true }; render(); break;
      case "edit": if (h) { ui.sheet = { draft: draftFrom(h), fresh: true }; render(); } break;
      case "close-sheet": ui.sheet = null; render(); break;
      case "save": saveDraft(); break;
      case "emoji": ui.sheet.draft.emoji = el.dataset.v; render(); break;
      case "color": ui.sheet.draft.color = el.dataset.v; render(); break;
      case "time": ui.sheet.draft.time = el.dataset.v; render(); break;
      case "rtype": ui.sheet.draft.schedule.type = el.dataset.v; render(); break;
      case "rday": {
        const days = ui.sheet.draft.schedule.days, v = +el.dataset.v, i = days.indexOf(v);
        if (i === -1) days.push(v); else days.splice(i, 1);
        render(); break;
      }
      case "step": {
        const d = ui.sheet.draft, f = el.dataset.f, max = f === "times" ? 7 : 99;
        if (f === "times") d.schedule.times = Math.max(1, Math.min(max, d.schedule.times + +el.dataset.d));
        else d.target = Math.max(1, Math.min(max, d.target + +el.dataset.d));
        render(); break;
      }
      case "delete":
        askConfirm({ title: "Delete " + h.name + "?", text: "Its whole history goes too. This cannot be undone.", yes: "Delete", danger: true,
          run: () => { C.removeHabit(data, id); ui.sheet = null; ui.detail = null; commit(); } });
        break;
      case "confirm-yes": { const run = ui.confirm.run; ui.confirm = null; run(); break; }
      case "confirm-no": ui.confirm = null; render(); break;
      case "celebrate-close": ui.celebrate = null; render(); break;
      case "theme": data.settings.theme = el.dataset.v; commit(); break;
      case "export": exportBackup(); break;
      case "import": importBackup(); break;
      case "sample":
        askConfirm({ title: "Load example habits?", text: "This replaces everything you have now with sample habits and history.", yes: "Load examples", danger: data.habits.length > 0,
          run: () => { data = sampleData(data.settings.theme); ui.detail = null; commit(); } });
        break;
      case "reset":
        askConfirm({ title: "Erase everything?", text: "All habits and their history will be deleted from this device.", yes: "Erase", danger: true,
          run: () => { const t = data.settings.theme; data = C.emptyState(); data.settings.theme = t; ui.detail = null; commit(); } });
        break;
      case "start-sample": data = sampleData("system"); ui.enter = true; commit(); break;
      case "start-empty": delete data.welcome; ui.enter = true; commit(); break;
      case "open-main": if (desktop) desktop.openMain(); break;
    }
    if (ev) ev.preventDefault();
  }

  // ---------- events ----------
  let swipe = null;
  app.addEventListener("click", (ev) => {
    if (swipe && swipe.moved) return;
    const el = ev.target.closest("[data-action]");
    if (el && !el.disabled) onAction(el, ev);
  });
  app.addEventListener("input", (ev) => {
    if (!ui.sheet) return;
    if (ev.target.id === "habit-name") {
      ui.sheet.draft.name = ev.target.value;
      const save = document.getElementById("save-btn");
      if (save) save.disabled = !ev.target.value.trim();
    }
    if (ev.target.id === "habit-unit") ui.sheet.draft.unit = ev.target.value;
  });
  app.addEventListener("keydown", (ev) => {
    if (ev.key === "Enter" && ev.target.id === "habit-name") saveDraft();
  });

  // Swipe a row right to add one / check, left to take one away.
  app.addEventListener("pointerdown", (ev) => {
    const row = ev.target.closest(".habit-row");
    if (!row || ev.button !== 0 || ui.day > todayKey()) return;
    swipe = { row: row, x: ev.clientX, y: ev.clientY, dx: 0, moved: false, id: ev.pointerId };
  });
  window.addEventListener("pointermove", (ev) => {
    if (!swipe || ev.pointerId !== swipe.id) return;
    const dx = ev.clientX - swipe.x, dy = ev.clientY - swipe.y;
    if (!swipe.moved) {
      if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) { swipe = null; return; }
      if (Math.abs(dx) < 10) return;
      swipe.moved = true;
      swipe.row.classList.add("dragging");
    }
    swipe.dx = Math.max(-110, Math.min(110, dx));
    const body = swipe.row.querySelector(".row-body");
    body.style.transform = "translateX(" + swipe.dx + "px)";
    swipe.row.classList.toggle("arm-left", swipe.dx > 70);
    swipe.row.classList.toggle("arm-right", swipe.dx < -70);
  });
  function endSwipe() {
    if (!swipe) return;
    const s = swipe;
    if (!s.moved) { swipe = null; return; }
    const body = s.row.querySelector(".row-body");
    s.row.classList.remove("dragging", "arm-left", "arm-right");
    body.style.transform = "";
    const h = habitById(s.row.dataset.id);
    setTimeout(() => { swipe = null; }, 0);
    if (!h) return;
    if (s.dx > 70) bump(h, ui.day, h.target > 1 ? 1 : 1 - C.countOn(data, h.id, ui.day));
    else if (s.dx < -70) bump(h, ui.day, -1);
  }
  window.addEventListener("pointerup", endSwipe);
  window.addEventListener("pointercancel", endSwipe);

  document.addEventListener("keydown", (ev) => {
    const typing = /input|textarea/i.test(ev.target.tagName);
    if (ev.key === "Escape") {
      if (ui.confirm) { ui.confirm = null; render(); }
      else if (ui.celebrate) { ui.celebrate = null; render(); }
      else if (ui.sheet) { ui.sheet = null; render(); }
      else if (ui.detail) { ui.detail = null; render(); }
      return;
    }
    if (typing || ui.sheet || ui.confirm || trayMode || data.welcome) return;
    if ((ev.metaKey || ev.ctrlKey) && ev.key.toLowerCase() === "n") { ev.preventDefault(); onAction({ dataset: { action: "add" } }); return; }
    if (ev.metaKey || ev.ctrlKey || ev.altKey) return;
    if (ui.tab === "today" && ev.key === "ArrowLeft") { ui.day = C.addDays(ui.day, -1); render(); }
    else if (ui.tab === "today" && ev.key === "ArrowRight" && ui.day < todayKey()) { ui.day = C.addDays(ui.day, 1); render(); }
    else if (ev.key === "t") { ui.day = todayKey(); go("today"); }
    else if (/^[1-4]$/.test(ev.key)) go(TABS[+ev.key - 1][0]);
  });

  wideQuery.addEventListener("change", render);
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", applyTheme);

  // Roll over to the new day at midnight or when the app comes back.
  function checkDay() {
    const t = todayKey();
    if (checkDay.last && checkDay.last !== t && ui.day === checkDay.last) { ui.day = t; render(); }
    checkDay.last = t;
  }
  setInterval(checkDay, 30000);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) { checkDay(); render(); } });

  // Another window (the Mac menu bar panel) changed the data.
  window.addEventListener("storage", (ev) => {
    if (ev.key !== STORE_KEY || !ev.newValue) return;
    try { const v = C.validate(JSON.parse(ev.newValue)); if (v) { data = normalize(v); render(); } } catch (e) { /* ignore a half-written value */ }
  });

  if (native) {
    capacitorApp.App.addListener("backButton", () => {
      if (ui.confirm) ui.confirm = null;
      else if (ui.celebrate) ui.celebrate = null;
      else if (ui.sheet) ui.sheet = null;
      else if (ui.detail) ui.detail = null;
      else if (ui.tab !== "today") ui.tab = "today";
      else { capacitorApp.App.minimizeApp(); return; }
      render();
    });
  }
  if (desktop && desktop.onCommand) {
    desktop.onCommand((cmd) => {
      if (cmd === "new-habit") onAction({ dataset: { action: "add" } });
      else if (cmd === "prev-day") { ui.tab = "today"; ui.day = C.addDays(ui.day, -1); render(); }
      else if (cmd === "next-day" && ui.day < todayKey()) { ui.tab = "today"; ui.day = C.addDays(ui.day, 1); render(); }
      else if (cmd === "today") { ui.day = todayKey(); go("today"); }
      else if (TABS.some((t) => t[0] === cmd)) go(cmd);
      else if (cmd === "export") exportBackup();
      else if (cmd === "import") importBackup();
    });
  }

  // ---------- sample data ----------
  // Realistic examples with ~10 weeks of history, so every screen has something to show.
  function sampleData(theme) {
    const s = C.emptyState();
    s.settings.theme = theme || "system";
    const today = todayKey();
    const start = C.addDays(today, -74);
    const H = (id, name, emoji, color, time, schedule, target, unit, p) => ({ id, name, emoji, color, time, schedule, target, unit, created: start, p });
    const list = [
      H("s1", "Sleep 7½ hours", "😴", "iris", "morning", { type: "daily" }, 1, "", 0.8),
      H("s2", "Stretch 10 min", "🧘", "sage", "morning", { type: "days", days: [1, 2, 3, 4, 5] }, 1, "", 0.85),
      H("s3", "Walk 8,000 steps", "🚶", "teal", "afternoon", { type: "daily" }, 1, "", 0.7),
      H("s4", "Run", "🏃", "amber", "afternoon", { type: "weekly", times: 3 }, 1, "", 0.45),
      H("s5", "Read 10 pages", "📚", "clay", "evening", { type: "daily" }, 1, "", 0.92),
      H("s6", "Journal", "✍️", "rose", "evening", { type: "days", days: [0, 3] }, 1, "", 0.75),
      H("s7", "Drink water", "💧", "sky", "anytime", { type: "daily" }, 8, "glasses", 0.8)
    ];
    let seed = 7;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    for (let k = start; k < today; k = C.addDays(k, 1)) {
      list.forEach((h) => {
        if (!C.isScheduled(h, k)) return;
        const recent = k > C.addDays(today, -14) ? 0.08 : 0; // a strong last fortnight
        if (h.id === "s5" && k >= C.addDays(today, -21)) { C.setCount(s, h.id, k, 1); return; } // a 21-day streak
        if (rnd() < h.p + recent) C.setCount(s, h.id, k, h.target > 1 ? h.target - (rnd() < 0.2 ? 2 : 0) : 1);
        else if (h.target > 1) C.setCount(s, h.id, k, Math.floor(rnd() * h.target));
      });
    }
    // Today, half done.
    ["s1", "s2"].forEach((id) => { if (C.isScheduled(list.find((h) => h.id === id), today)) C.setCount(s, id, today, 1); });
    C.setCount(s, "s7", today, 5);
    s.habits = list.map((h) => { const c = Object.assign({}, h); delete c.p; return c; });
    // The 21-day streak needs no gap inside it.
    return normalize(s);
  }

  // ---------- boot ----------
  (async function boot() {
    const saved = await Store.load();
    const valid = saved && C.validate(saved);
    if (valid) data = normalize(valid);
    else if (window.ROZ_DEMO) data = sampleData("system");
    else { data = C.emptyState(); data.welcome = true; }
    if (data.habits.length) delete data.welcome;
    loaded = true;
    checkDay();
    render();
    document.documentElement.classList.add("ready");
  })();
})();
