// Roj Habit: screens, gestures and platform glue. Habit math lives in core.js.
(function () {
  "use strict";

  const C = window.HabitCore;
  if (!window.HABIT_ICONS) window.HABIT_ICONS = {}; // without the icon file, habits fall back to their emoji
  const capCore = window.capacitorExports;
  const native = !!(capCore && capCore.Capacitor.isNativePlatform());
  const desktop = window.rozDesktop || null; // set by the Electron preload
  const trayMode = location.hash === "#tray"; // Mac menu bar panel
  const widgetMode = location.hash.indexOf("#widget") === 0; // Mac desktop widget: #widget/small, /medium or /large
  const widgetSize = widgetMode ? location.hash.split("/")[1] || "medium" : "";
  const compact = trayMode || widgetMode;
  // The Android home screen widget (android/.../RojWidget.java) reads the saved state; this tells it to redraw.
  const homeWidget = native && capCore.registerPlugin ? capCore.registerPlugin("RojWidget") : null;
  const STORE_KEY = "rojhabit.state.v1";
  const APP_NAME = "Roj Habit";
  const MILESTONES = [7, 21, 30, 50, 100, 200, 365];

  const COLORS = [
    { id: "sky", hex: "#4C84BC" }, { id: "clay", hex: "#C2704B" }, { id: "sage", hex: "#5C8D69" },
    { id: "iris", hex: "#7F72BE" }, { id: "amber", hex: "#BC8A35" }, { id: "rose", hex: "#BF6E86" },
    { id: "teal", hex: "#3F8F8C" }, { id: "slate", hex: "#626875" }
  ];
  const ICONS = Object.keys(window.HABIT_ICONS).filter((n) => n !== "sparkles" && n !== "glass-water"); // 5 rows of 7 in the picker
  // Older habits and backups stored an emoji; show the matching line icon instead.
  const EMOJI_ICON = { "💧": "droplet", "📚": "book-open", "🧘": "flower-2", "🏃": "activity", "😴": "moon", "🥗": "salad", "💊": "pill",
    "✍️": "notebook-pen", "🎸": "guitar", "🧠": "brain", "🚶": "footprints", "🏋️": "dumbbell", "🚴": "bike", "🧹": "brush-cleaning", "🌱": "sprout",
    "☀️": "sun", "📵": "phone-off", "🍎": "apple", "☕": "coffee", "🎨": "palette", "💻": "laptop", "🗣️": "languages", "💰": "piggy-bank",
    "🛏️": "bed", "🚿": "shower-head", "🎧": "music", "❤️": "heart", "✨": "sparkles" };
  const TIMES = [
    { id: "morning", label: "Morning", hint: "before noon", icon: "sunrise" },
    { id: "afternoon", label: "Afternoon", hint: "noon to 5", icon: "sun" },
    { id: "evening", label: "Evening", hint: "after 5", icon: "moon" },
    { id: "anytime", label: "Anytime", hint: "whenever it fits", icon: "infinity" }
  ];
  const SUGGESTIONS = [
    { name: "Drink water", icon: "droplet", color: "sky", time: "anytime", target: 8, unit: "glasses" },
    { name: "Read 10 pages", icon: "book-open", color: "clay", time: "evening", target: 1, unit: "" },
    { name: "Walk 8,000 steps", icon: "footprints", color: "teal", time: "afternoon", target: 1, unit: "" },
    { name: "Meditate", icon: "flower-2", color: "iris", time: "morning", target: 1, unit: "" },
    { name: "Sleep by 11", icon: "moon", color: "slate", time: "evening", target: 1, unit: "" },
    { name: "Workout", icon: "dumbbell", color: "amber", time: "morning", target: 1, unit: "", weekly: 3 },
    { name: "No phone in bed", icon: "phone-off", color: "rose", time: "evening", target: 1, unit: "" },
    { name: "Journal", icon: "notebook-pen", color: "sage", time: "evening", target: 1, unit: "" }
  ];
  const DOW_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0]; // Monday first

  // ---------- icons (SF Symbols-like line icons) ----------
  const svg = (body, size, extra) => '<svg width="' + (size || 22) + '" height="' + (size || 22) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"' + (extra || "") + ">" + body + "</svg>";
  const ICON = {
    today: (s) => svg('<rect x="3.5" y="4.5" width="17" height="16" rx="4"/><path d="M3.5 9.5h17M8 2.8v3.4M16 2.8v3.4"/><path d="M8.6 14.6l2.2 2.1 4.6-4.4"/>', s),
    progress: (s) => svg('<path d="M5 20V12M10 20V6M15 20v-9M20 20V4"/>', s, ' stroke-width="2.4"'),
    habits: (s) => svg('<rect x="3.5" y="3.5" width="7" height="7" rx="2.4"/><rect x="13.5" y="3.5" width="7" height="7" rx="2.4"/><rect x="3.5" y="13.5" width="7" height="7" rx="2.4"/><rect x="13.5" y="13.5" width="7" height="7" rx="2.4"/>', s),
    settings: (s) => svg('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>', s),
    plus: (s) => svg('<path d="M12 5v14M5 12h14"/>', s, ' stroke-width="2.3"'),
    minus: (s) => svg('<path d="M5 12h14"/>', s, ' stroke-width="2.3"'),
    check: (s) => svg('<path d="M5 12.5l4.5 4.5L19 7.5"/>', s, ' stroke-width="2.8"'),
    flame: (s) => '<svg width="' + (s || 14) + '" height="' + (s || 14) + '" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 23c-4.4 0-7.5-3-7.5-7.2 0-3.3 2-5.6 3.8-7.6.4-.4 1-.1 1 .4 0 1.6.8 2.9 2 3.5-.4-3.7 1.2-6.9 4-9.6.4-.4 1-.1 1 .4.2 2.9 1.9 4.9 3.4 6.8 1.2 1.5 1.8 3.2 1.8 5.1C21.5 20 17 23 12 23z"/></svg>',
    left: (s) => svg('<path d="M15 5l-7 7 7 7"/>', s, ' stroke-width="2.3"'),
    right: (s) => svg('<path d="M9 5l7 7-7 7"/>', s, ' stroke-width="2.3"'),
    up: (s) => svg('<path d="M12 19V5M6 11l6-6 6 6"/>', s, ' stroke-width="2.4"'),
    down: (s) => svg('<path d="M12 5v14M6 13l6 6 6-6"/>', s, ' stroke-width="2.4"'),
    list: (s) => svg('<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>', s),
    grid: (s) => svg('<rect x="3.5" y="5" width="17" height="14" rx="3"/><path d="M3.5 10h17M3.5 14.5h17M9.2 5v14M14.8 5v14"/>', s),
    sunrise: (s) => svg('<path d="M4 18h16M7 14.5a5 5 0 0 1 10 0M12 4v3.5M5 8.5l1.6 1.4M19 8.5l-1.6 1.4"/>', s),
    sun: (s) => svg('<circle cx="12" cy="12" r="4"/><path d="M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2M5.5 5.5l1.4 1.4M17.1 17.1l1.4 1.4M5.5 18.5l1.4-1.4M17.1 6.9l1.4-1.4"/>', s),
    moon: (s) => svg('<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>', s),
    infinity: (s) => svg('<path d="M7.5 8.5a3.5 3.5 0 1 0 0 7c3.5 0 5.5-7 9-7a3.5 3.5 0 1 1 0 7c-3.5 0-5.5-7-9-7z"/>', s),
    pencil: (s) => svg('<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>', s),
    trash: (s) => svg('<path d="M4 7h16M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13M10 11v5.5M14 11v5.5"/>', s),
    history: (s) => svg('<rect x="3.5" y="4.5" width="17" height="16" rx="4"/><path d="M3.5 9.5h17M8 2.8v3.4M16 2.8v3.4"/><circle cx="8.5" cy="14" r="1" fill="currentColor"/><circle cx="12" cy="14" r="1" fill="currentColor"/><circle cx="15.5" cy="14" r="1" fill="currentColor"/>', s),
    upload: (s) => svg('<path d="M12 15V3.5M7.5 8L12 3.5 16.5 8"/><path d="M5 13v5.5A2 2 0 0 0 7 20.5h10a2 2 0 0 0 2-2V13"/>', s),
    download: (s) => svg('<path d="M12 3.5V15M7.5 10.5L12 15l4.5-4.5"/><path d="M5 13v5.5A2 2 0 0 0 7 20.5h10a2 2 0 0 0 2-2V13"/>', s),
    sparkle: (s) => svg('<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 16l.7 1.8 1.8.7-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7z"/>', s),
    clock: (s) => svg('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>', s),
    target: (s) => svg('<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1" fill="currentColor"/>', s),
    sync: (s) => svg('<path d="M20 11a8 8 0 0 0-14.3-4.9L4 8M4 4v4h4M4 13a8 8 0 0 0 14.3 4.9L20 16M20 20v-4h-4"/>', s),
    widget: (s) => svg('<rect x="3.5" y="3.5" width="17" height="10" rx="3"/><rect x="3.5" y="16" width="7.5" height="4.5" rx="2"/><rect x="13" y="16" width="7.5" height="4.5" rx="2"/>', s),
    open: (s) => svg('<path d="M14 4h6v6M20 4l-8.5 8.5M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10"/>', s)
  };

  // Selected tabs use filled glyphs, like SF Symbols' .fill variants. --cut is the colour punched through them.
  const fill = (body, s) => '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" aria-hidden="true">' + body + "</svg>";
  const ICON_FILL = {
    today: (s) => fill('<rect x="3" y="4.2" width="18" height="16.8" rx="4.4" fill="currentColor"/><path d="M8 2.6v3.4M16 2.6v3.4" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M8.4 13.9l2.4 2.3 4.9-4.7" fill="none" stroke="var(--cut)" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/>', s),
    progress: (s) => fill('<rect x="3.6" y="11" width="3.6" height="10" rx="1.8" fill="currentColor"/><rect x="8.6" y="5" width="3.6" height="16" rx="1.8" fill="currentColor"/><rect x="13.6" y="9" width="3.6" height="12" rx="1.8" fill="currentColor"/><rect x="18.4" y="3" width="3.6" height="18" rx="1.8" fill="currentColor"/>', s),
    habits: (s) => fill('<rect x="3" y="3" width="8" height="8" rx="2.6" fill="currentColor"/><rect x="13" y="3" width="8" height="8" rx="2.6" fill="currentColor"/><rect x="3" y="13" width="8" height="8" rx="2.6" fill="currentColor"/><rect x="13" y="13" width="8" height="8" rx="2.6" fill="currentColor"/>', s),
    settings: (s) => fill('<path fill="currentColor" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/><circle cx="12" cy="12" r="3.2" fill="var(--cut)"/>', s)
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
  const isWide = () => wideQuery.matches && !compact;

  function iconSvg(name, size) {
    return '<svg class="hicon" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + window.HABIT_ICONS[name] + "</svg>";
  }
  // A habit's line icon, or its old emoji if it has no icon we know.
  function habitIcon(h, size) {
    return window.HABIT_ICONS[h.icon] ? iconSvg(h.icon, size || 22) : '<span class="hemoji">' + esc(h.emoji || "•") + "</span>";
  }

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
  function greeting() {
    const h = new Date().getHours();
    if (h < 5) return "Good night";
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    if (h < 21) return "Good evening";
    return "Good night";
  }

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
    // quiet: a save that came from syncing, which should not start another sync
    save(state, quiet) {
      const raw = JSON.stringify(state);
      if (!quiet) queueSync();
      if (native) capacitorPreferences.Preferences.set({ key: STORE_KEY, value: raw }).then(() => homeWidget && homeWidget.refresh()).catch(() => {});
      else try { localStorage.setItem(STORE_KEY, raw); } catch (e) { /* private mode: keep going in memory */ }
    }
  };

  // Habits saved by older versions or backups may lack the UI-only fields.
  function normalize(state) {
    state.habits.forEach((h, i) => {
      if (!COLORS.some((c) => c.id === h.color)) h.color = COLORS[i % COLORS.length].id;
      if (!TIMES.some((t) => t.id === h.time)) h.time = "anytime";
      if (!window.HABIT_ICONS[h.icon]) h.icon = EMOJI_ICON[h.emoji] || (h.emoji ? "" : "sparkles");
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
      try { navigator.vibrate(kind === "success" ? [12, 60, 18] : kind === "medium" ? 14 : 8); } catch (e) { /* not allowed here */ }
    }
  }

  // ---------- state ----------
  let data = C.emptyState();
  let loaded = false;
  const ui = {
    tipRow: false, confetti: false,
    tab: "today", day: todayKey(), view: "list", detail: null, mode: "month", calMonth: null, period: "week",
    sheet: null, confirm: null, celebrate: null, toast: null, menu: null, undo: null, editMode: false, enter: true
  };

  function commit() { Store.save(data); render(); }

  // Last drawn value per key: lets rings, bars and numbers move from old to new.
  const mem = {};
  function prev(key, value) {
    const old = key in mem ? mem[key] : value;
    mem[key] = value;
    return old;
  }

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
  function rangeStats(from, to) {
    let done = 0, due = 0;
    for (let k = from; k <= to; k = C.addDays(k, 1)) {
      const s = dayStats(k);
      done += s.done; due += s.total;
    }
    return { done: done, due: due, pct: due ? pct(done, due) : null };
  }

  // ---------- small visuals ----------
  function miniRing(frac, size, color, stroke) {
    stroke = stroke || 2.5;
    const r = (size - stroke) / 2, circ = 2 * Math.PI * r;
    return '<svg class="mini-ring" width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + " " + size + '" aria-hidden="true"><circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" stroke-width="' + stroke + '" class="mini-track"/><circle class="mini-fill" cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" stroke-width="' + stroke + '" stroke="' + (color || "var(--ink)") + '" stroke-dasharray="' + circ * frac + " " + circ + '" transform="rotate(-90 ' + size / 2 + " " + size / 2 + ')" fill="none" stroke-linecap="round"/></svg>';
  }
  // Count habits show their goal as beads, like a mala.
  function beads(count, target) {
    if (target > 12) return '<span class="bead-bar"><i style="width:' + Math.min(100, Math.round((count / target) * 100)) + '%"></i></span>';
    let out = '<span class="beads" aria-hidden="true">';
    for (let i = 0; i < target; i++) out += '<i class="' + (i < count ? "on" : "") + '"></i>';
    return out + "</span>";
  }
  // The logo: three brush strokes on paper, drawn by www/brand.js (shared with the icon script).
  let markId = 0;
  function brandMark(size) {
    return '<svg class="brand-mark" width="' + size + '" height="' + size + '" viewBox="0 0 1024 1024" aria-hidden="true">' + window.RojBrand.logo("rm" + markId++) + "</svg>";
  }



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
      const state = !st.total || k > today ? "" : st.done === st.total ? "full" : st.done ? "some" : "none";
      cells += '<button class="' + cls.join(" ") + '" data-action="day" data-key="' + k + '"' + (k > today ? " disabled" : "") +
        ' aria-label="' + fmt(k, { weekday: "long", day: "numeric", month: "long" }) + '"' + (k === ui.day ? ' aria-current="date"' : "") + ">" +
        '<span class="wk-dow">' + fmt(k, { weekday: "narrow" }) + '</span><span class="wk-num num">' + C.parseKey(k).getDate() + '</span><i class="wk-dot ' + state + '"></i></button>';
    }
    const nextOk = C.addDays(start, 7) <= today;
    return '<div class="week"><button class="icon-btn sm" data-action="week" data-dir="-1" aria-label="Previous week">' + ICON.left(16) + "</button>" +
      '<div class="week-strip">' + cells + "</div>" +
      '<button class="icon-btn sm" data-action="week" data-dir="1" aria-label="Next week"' + (nextOk ? "" : " disabled") + ">" + ICON.right(16) + "</button></div>";
  }

  function rowSub(it) {
    const h = it.habit, s = h.schedule;
    if (h.target > 1) return beads(it.count, h.target) + '<span class="num">' + it.count + "/" + h.target + "</span> " + esc(h.unit || "times");
    if (s.type === "weekly") return (it.weekDone >= s.times ? "Week done · " : "") + it.weekDone + " of " + s.times + " this week";
    const st = C.streak(data, h, todayKey());
    if (st.current >= 2) return '<span class="flame">' + ICON.flame(12) + "</span>" + plural(st.current, "day");
    return scheduleText(h);
  }

  function habitRow(it, n) {
    const h = it.habit;
    const future = ui.day > todayKey();
    const counter = h.target > 1;
    const cls = ["habit-row"];
    if (it.done) cls.push("done");
    else if (it.satisfied) cls.push("met");
    if (ui.flash === h.id) cls.push("pop");
    if (n === 0 && ui.tipRow && !isWide()) cls.push("demo");
    const label = counter ? "Add one to " + h.name : (it.done ? "Mark " + h.name + " not done" : "Mark " + h.name + " done");
    const check = '<button class="check' + (counter && !it.done ? " counter" : "") + '" data-action="toggle" data-id="' + h.id + '" aria-label="' + esc(label) + '"' + (future ? " disabled" : "") + ">" +
      (counter && !it.done ? miniRing(it.frac, 32, "var(--c)", 3) + '<b class="num">' + it.count + "</b>" : ICON.check(15)) + "</button>";
    return '<div class="' + cls.join(" ") + '" style="--c:' + colorOf(h) + ";--i:" + (n || 0) + '" data-id="' + h.id + '">' +
      '<div class="swipe-hint left">' + ICON.check(18) + '</div><div class="swipe-hint right">' + ICON.minus(18) + "</div>" +
      '<div class="row-body"><span class="row-icon" aria-hidden="true">' + habitIcon(h, 21) + "</span>" +
      '<button class="row-main" data-action="open" data-id="' + h.id + '"><span class="row-title">' + esc(h.name) + '</span><span class="row-sub">' + rowSub(it) + "</span></button>" +
      check + "</div></div>";
  }

  function listView(st) {
    if (!data.habits.length) return emptyState();
    if (!st.total) return '<div class="empty-note">Nothing planned for this day.</div>';
    // First visit: explain the gestures and act them out on the first row.
    ui.tipRow = !data.settings.swipeTip && ui.day === todayKey() && !compact;
    let n = 0;
    const groups = TIMES.map((t) => {
      const items = st.items.filter((i) => i.habit.time === t.id);
      if (!items.length) return "";
      const done = items.filter((i) => i.satisfied).length;
      return '<section class="time-group"><header class="group-head"><span class="gh-title">' + ICON[t.icon](14) + t.label + "</span>" +
        '<span class="gh-count num' + (done === items.length ? " all" : "") + '">' + done + "/" + items.length + "</span></header>" +
        '<div class="rows">' + items.map((it) => habitRow(it, n++)).join("") + "</div></section>";
    }).join("");
    return (ui.tipRow ? swipeTip() : "") + '<div class="habit-list' + (ui.enter ? " stagger" : "") + '">' + groups + "</div>";
  }

  function swipeTip() {
    if (isWide()) {
      return '<section class="swipe-tip" role="note" aria-label="How to use habits">' +
        '<div class="tip-head"><span class="tip-badge">New here?</span><button class="tip-ok" data-action="tip-done">Got it</button></div>' +
        '<div class="tip-row"><span class="tip-ico ok">' + ICON.check(16) + '</span><p><b>Click the circle</b> to mark a habit done. Click again to undo</p></div>' +
        '<div class="tip-row"><span class="tip-ico hold"><i></i></span><p><b>Right-click</b> a habit to edit or delete it</p></div>' +
        '<div class="tip-row"><span class="tip-ico undo">' + ICON.widget(16) + '</span><p>Turn on the <b>desktop widget</b> in Settings, or use the menu bar icon</p></div>' +
        '<p class="tip-foot">⌘N adds a habit. ⌘[ and ⌘] move between days.</p></section>';
    }
    return '<section class="swipe-tip" role="note" aria-label="How to use habits">' +
      '<div class="tip-head"><span class="tip-badge">New here?</span><button class="tip-ok" data-action="tip-done">Got it</button></div>' +
      '<div class="tip-row"><span class="tip-ico ok">' + ICON.check(16) + '</span><p><b>Swipe right</b> on a habit to mark it done</p><span class="tip-arrow">' + ICON.right(16) + "</span></div>" +
      '<div class="tip-row"><span class="tip-ico undo">' + ICON.minus(16) + '</span><p><b>Swipe left</b> to undo, or take one away</p><span class="tip-arrow">' + ICON.left(16) + "</span></div>" +
      '<div class="tip-row"><span class="tip-ico hold"><i></i></span><p><b>Press and hold</b> to edit or delete it</p></div>' +
      '<p class="tip-foot">Or just tap the circle. Watch the first habit below.</p></section>';
  }

  function gridView() {
    const today = todayKey();
    const start = C.weekStart(ui.day);
    const days = [];
    for (let i = 0; i < 7; i++) days.push(C.addDays(start, i));
    const habits = data.habits.filter((h) => days.some((k) => C.isScheduled(h, k)));
    if (!habits.length) return emptyState();
    const head = '<div class="g-name"></div>' + days.map((k) => '<div class="g-day' + (k === today ? " is-today" : "") + '"><span>' + fmt(k, { weekday: "narrow" }) + '</span><b class="num">' + C.parseKey(k).getDate() + "</b></div>").join("");
    const rows = habits.map((h) => {
      const cells = days.map((k) => {
        if (!C.isScheduled(h, k)) return '<span class="g-cell off" aria-hidden="true"></span>';
        const n = C.countOn(data, h.id, k);
        const done = n >= h.target;
        const cls = "g-cell" + (done ? " done" : n ? " part" : "") + (k > today ? " future" : "");
        const label = esc(h.name) + ", " + fmt(k, { weekday: "long" }) + (done ? ", done" : ", not done");
        return '<button class="' + cls + '" style="--c:' + colorOf(h) + '" data-action="cell" data-id="' + h.id + '" data-key="' + k + '" aria-label="' + label + '"' + (k > today ? " disabled" : "") + ">" + (done ? ICON.check(12) : "") + "</button>";
      }).join("");
      return '<button class="g-name" data-action="open" data-id="' + h.id + '"><span class="g-icon">' + habitIcon(h, 15) + "</span>" + esc(h.name) + "</button>" + cells;
    }).join("");
    return '<section class="card grid-card"><div class="week-grid">' + head + rows + "</div></section>";
  }

  function emptyState() {
    return '<div class="empty"><div class="empty-art">' + brandMark(64) + "</div>" +
      "<h2>Start with one small habit</h2><p>Pick something you can do even on a bad day. Add more once it sticks.</p>" +
      '<button class="btn" data-action="add">' + ICON.plus(18) + "New habit</button></div>";
  }

  // Segmented ring: one piece per habit, filled in the brand colour as it gets done.
  function segRing(items, size, stroke) {
    const r = (size - stroke) / 2, c = size / 2, circ = 2 * Math.PI * r;
    const n = Math.max(items.length, 1);
    const gap = n > 1 ? Math.min(stroke + 4, circ / n / 2) : 0;
    const seg = circ / n - gap;
    let arcs = "";
    items.forEach((it, i) => {
      const off = -(i * (seg + gap)) - gap / 2;
      arcs += '<circle cx="' + c + '" cy="' + c + '" r="' + r + '" stroke-width="' + stroke + '" stroke-dasharray="' + seg + " " + circ + '" stroke-dashoffset="' + off + '" class="sr-track"/>';
      const len = seg * it.frac, from = prev("ring:" + ui.day + ":" + it.habit.id, len);
      arcs += '<circle cx="' + c + '" cy="' + c + '" r="' + r + '" stroke-width="' + stroke + '" stroke-dasharray="' + from + " " + circ + '" data-len="' + len + '" data-circ="' + circ + '" stroke-dashoffset="' + off + '" class="sr-fill"/>';
    });
    if (!items.length) arcs = '<circle cx="' + c + '" cy="' + c + '" r="' + r + '" stroke-width="' + stroke + '" class="sr-track"/>';
    return '<svg class="seg-ring" width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + " " + size + '" aria-hidden="true"><g transform="rotate(-90 ' + c + " " + c + ')">' + arcs + "</g></svg>";
  }

  // One plain line under the date about where the day stands; the ring card carries the numbers.
  function dayLine(st, isToday) {
    if (!isToday) return st.done + " of " + st.total + " done that day. Tap any habit to fix it.";
    if (!st.total) return "Nothing planned today. Rest counts too.";
    if (st.done === st.total) return "Every habit checked. See you tomorrow.";
    if (!st.done) return "";
    return st.done / st.total >= 0.5 ? "More than halfway. Keep it rolling." : "Good start. One more?";
  }
  function bestStreak() {
    return data.habits.map((h) => ({ h: h, s: C.streak(data, h, todayKey()) })).filter((x) => x.s.current >= 2).sort((a, b) => b.s.current - a.s.current)[0];
  }
  function momentumCard(st, isToday) {
    const best = bestStreak();
    const perfect = st.total && st.done === st.total;
    return '<section class="momentum' + (perfect ? " perfect" : "") + '"><div class="m-text"><p class="kicker">' + (isToday ? "Today's progress" : "That day") + "</p>" +
      '<p class="m-big num">' + st.done + "<span> of " + st.total + "</span></p>" +
      '<p class="m-sub">' + (best ? '<span class="flame">' + ICON.flame(13) + "</span>" + esc(best.h.name) + " · " + plural(best.s.current, best.s.unit) : "Small steps add up.") + "</p></div>" +
      '<div class="m-ring">' + segRing(st.items, 104, 9) + '<span class="m-pct num"><span data-count="' + pct(st.done, st.total) + '" data-from="' + prev("mpct:" + ui.day, pct(st.done, st.total)) + '">' + pct(st.done, st.total) + "</span><small>%</small></span></div></section>";
  }
  function viewToggle(size) {
    return '<button class="icon-btn bare" data-action="view" aria-label="' + (ui.view === "list" ? "Show week grid" : "Show list") + '">' + (ui.view === "list" ? ICON.grid(size) : ICON.list(size)) + "</button>";
  }

  function phoneToday(st, isToday) {
    const line = dayLine(st, isToday);
    // Glass top bar: clear at the top of the page, frosted once the page scrolls under it.
    let html = '<header class="brand-row"><span class="brand-logo">' + brandMark(40) + '</span><b class="brand-name">' + APP_NAME + "</b>" +
      '<button class="glass-btn" data-action="tab" data-v="settings" aria-label="Settings">' + ICON.settings(19) + "</button>" +
      '<button class="glass-btn add" data-action="add" aria-label="New habit">' + ICON.plus(21) + "</button></header>";
    html += '<section class="hero"><p class="kicker">' + fmt(ui.day, { weekday: "long", day: "numeric", month: "long" }) + "</p>" +
      (line ? '<p class="lede">' + esc(line) + "</p>" : "") +
      (isToday ? "" : '<button class="pill-btn" data-action="go-today">Back to today</button>') + "</section>";
    if (data.habits.length) html += momentumCard(st, isToday);
    html += '<div class="sec-head"><p class="kicker">This week</p><p class="sec-meta">' + fmt(ui.day, { month: "short", year: "numeric" }) + "</p></div>" + weekStrip();
    if (data.habits.length) {
      html += '<div class="sec-head"><h2 class="sec-title">Your habits</h2><span class="sec-tools"><span class="kicker">' + plural(st.total, "habit") + "</span>" + viewToggle(18) + "</span></div>";
    }
    html += ui.view === "grid" ? gridView() : listView(st);
    return html;
  }

  // Mac Today: greeting and ring side by side, the week, then the habits with widget cards beside them.
  function deskToday(st, isToday) {
    const line = dayLine(st, isToday);
    let html = '<header class="desk-head"><p class="kicker">' + (isToday ? "Today · " : "") + fmt(ui.day, { weekday: "long", day: "numeric", month: "long" }) + "</p>" +
      '<div class="head-tools">' + (isToday ? "" : '<button class="pill-btn" data-action="go-today">Back to today</button>') +
      '<button class="text-btn strong" data-action="add">' + ICON.plus(16) + "New habit</button></div></header>";
    html += '<div class="desk-hero"><section class="hero"><h1 class="large-title">' + (isToday ? greeting() : fmt(ui.day, { weekday: "long" })) + "</h1>" + (line ? '<p class="lede">' + esc(line) + "</p>" : "") + "</section>" +
      (data.habits.length ? momentumCard(st, isToday) : "") + "</div>";
    html += weekStrip();
    if (!data.habits.length) return html + listView(st);
    html += '<div class="desk-cols"><div class="desk-main"><div class="sec-head"><h2 class="sec-title">Your habits</h2><span class="sec-tools"><span class="kicker">' + plural(st.total, "habit") + "</span>" + viewToggle(18) + "</span></div>" +
      (ui.view === "grid" ? gridView() : listView(st)) + "</div>" +
      '<aside class="desk-side" aria-label="Widgets">' + (isToday ? nextCard(st) : "") + streakCard() + weekCard() + "</aside></div>";
    return html;
  }

  // ---------- widget cards (Mac Today) ----------
  // Up next: the first open habit from the part of the day we are in, then later parts, then anytime.
  function nextCard(st) {
    const hour = new Date().getHours();
    const now = hour < 12 ? 0 : hour < 17 ? 1 : 2;
    const rank = (t) => { const i = ["morning", "afternoon", "evening"].indexOf(t); return i === -1 ? 3 : i >= now ? i - now : 10 + i; };
    const it = st.items.filter((i) => !i.satisfied).sort((a, b) => rank(a.habit.time) - rank(b.habit.time))[0];
    if (!it) {
      return '<section class="widget w-next clear"><p class="w-cap">' + ICON.check(13) + "Up next</p>" +
        '<p class="w-title">' + (st.total ? "All clear for today." : "Nothing planned today.") + '</p><p class="w-sub">' + (st.total ? "Every habit is checked. Enjoy the evening." : "Rest counts too.") + "</p></section>";
    }
    const h = it.habit, t = TIMES.find((x) => x.id === h.time) || TIMES[3];
    const counter = h.target > 1;
    return '<section class="widget w-next" style="--c:' + colorOf(h) + '"><p class="w-cap">' + ICON.clock(13) + "Up next</p>" +
      '<div class="w-next-row"><span class="w-ico big">' + habitIcon(h, 22) + "</span>" +
      '<button class="w-next-text" data-action="open" data-id="' + h.id + '"><span class="w-title">' + esc(h.name) + '</span><span class="w-sub">' + t.label + (counter ? " · " + it.count + " of " + h.target + " " + esc(h.unit || "times") : "") + "</span></button>" +
      '<button class="w-do" data-action="toggle" data-id="' + h.id + '" aria-label="' + esc((counter ? "Add one to " : "Mark done: ") + h.name) + '">' + (counter ? ICON.plus(18) : ICON.check(18)) + "</button></div></section>";
  }
  function streakCard() {
    const today = todayKey();
    const top = data.habits.map((h) => ({ h: h, s: C.streak(data, h, today) })).filter((x) => x.s.current > 0).sort((a, b) => b.s.current - a.s.current).slice(0, 4);
    return '<section class="widget"><p class="w-cap"><span class="flame">' + ICON.flame(13) + "</span>Streaks</p>" + (top.length ? '<div class="w-streaks">' + top.map((x) =>
      '<button class="w-streak" data-action="open" data-id="' + x.h.id + '" style="--c:' + colorOf(x.h) + '"><span class="w-ico">' + habitIcon(x.h, 16) + '</span><span class="w-name">' + esc(x.h.name) + '</span><b class="num">' + x.s.current + "</b><small>" + (x.s.unit === "week" ? "wk" : "d") + "</small></button>").join("") + "</div>" :
      '<p class="w-sub">Check off a habit two days running to start a streak.</p>') + "</section>";
  }
  function weekCard() {
    const today = todayKey(), start = C.weekStart(today);
    const r = rangeStats(start, today);
    let bars = "";
    for (let i = 0; i < 7; i++) {
      const k = C.addDays(start, i);
      const st = k <= today ? dayStats(k) : null;
      const p = st && st.total ? pct(st.done, st.total) : 0;
      bars += '<div class="w-bar' + (k === today ? " now" : "") + (k > today ? " later" : "") + (st && st.total && st.done === st.total ? " full" : "") + '" title="' + fmt(k, { weekday: "long" }) + (st && st.total ? ": " + p + "%" : "") + '"><i><b style="height:' + p + '%"></b></i><span>' + fmt(k, { weekday: "narrow" }) + "</span></div>";
    }
    return '<section class="widget"><p class="w-cap">' + ICON.progress(13) + 'This week</p><p class="w-big num">' + (r.pct == null ? "–" : r.pct + "<small>%</small>") + "</p>" +
      '<p class="w-sub">' + (r.due ? r.done + " of " + r.due + " check-ins" : "Nothing due yet") + '</p><div class="w-bars">' + bars + "</div></section>";
  }

  function todayScreen() {
    const st = dayStats(ui.day);
    const isToday = ui.day === todayKey();
    return isWide() ? deskToday(st, isToday) : phoneToday(st, isToday);
  }

  // ---------- Progress ----------
  // Smooth line through the points (null = no data), drawn in a 300 × 110 box.
  function areaChart(points) {
    const W = 300, H = 110, pad = 8;
    const vals = points.map((p) => p.v);
    const idx = vals.map((v, i) => (v == null ? -1 : i)).filter((i) => i >= 0);
    if (!idx.length) return '<div class="chart-empty">No data yet</div>';
    const n = points.length;
    const x = (i) => (n === 1 ? W / 2 : pad + (i * (W - 2 * pad)) / (n - 1));
    const y = (v) => H - pad - (v / 100) * (H - 2 * pad);
    const pts = idx.map((i) => [x(i), y(vals[i])]);
    let d = "M" + pts[0][0] + " " + pts[0][1];
    for (let i = 1; i < pts.length; i++) {
      const p0 = pts[i - 1], p1 = pts[i], mx = (p0[0] + p1[0]) / 2;
      d += " C" + mx + " " + p0[1] + " " + mx + " " + p1[1] + " " + p1[0] + " " + p1[1];
    }
    const last = pts[pts.length - 1];
    const area = d + " L" + last[0] + " " + (H - pad) + " L" + pts[0][0] + " " + (H - pad) + " Z";
    const grid = [25, 50, 75].map((g) => '<line x1="0" x2="' + W + '" y1="' + y(g) + '" y2="' + y(g) + '" class="grid-line"/>').join("");
    const labels = points.map((p, i) => '<span style="left:' + (x(i) / W) * 100 + '%"' + (p.hi ? ' class="hi"' : "") + ">" + (p.label || "") + "</span>").join("");
    return '<div class="area-chart"><svg viewBox="0 0 ' + W + " " + H + '" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="ag-top"/><stop offset="1" class="ag-bot"/></linearGradient></defs>' + grid +
      '<path d="' + area + '" fill="url(#ag)"/><path d="' + d + '" class="ac-line"/></svg>' +
      '<span class="ac-dot" style="left:' + (last[0] / W) * 100 + "%;top:" + (last[1] / H) * 100 + '%"></span>' +
      '<div class="ac-labels">' + labels + "</div></div>";
  }

  // A week is only seven numbers: bars read better than a line.
  function weekBars(points) {
    return '<div class="week-bars">' + points.map((p) => '<div class="wb' + (p.hi ? " hi" : "") + (p.v == null ? " future" : "") + '"' +
      (p.v != null ? ' title="' + p.v + '%"' : "") + '><span class="wb-track"><i style="height:' + (p.v ? Math.max(6, p.v) : 0) + '%"></i></span><span>' + p.label + "</span></div>").join("") + "</div>";
  }

  function periodData(period) {
    const today = todayKey();
    let points = [], from, prevFrom, prevTo, name;
    if (period === "week") {
      from = C.weekStart(today); name = "week";
      for (let i = 0; i < 7; i++) {
        const k = C.addDays(from, i);
        const s = k <= today ? dayStats(k) : null;
        points.push({ v: s && s.total ? pct(s.done, s.total) : null, label: fmt(k, { weekday: "narrow" }), hi: k === today });
      }
      prevFrom = C.addDays(from, -7); prevTo = C.addDays(today, -7);
    } else if (period === "month") {
      from = C.addDays(today, -29); name = "30 days";
      for (let i = 0; i < 30; i++) {
        const k = C.addDays(from, i);
        const s = dayStats(k);
        points.push({ v: s.total ? pct(s.done, s.total) : null, label: i % 7 === 2 || i === 29 ? (i === 29 ? "Today" : fmt(k, { day: "numeric", month: "short" })) : "", hi: i === 29 });
      }
      prevFrom = C.addDays(from, -30); prevTo = C.addDays(today, -30);
    } else {
      // 12 calendar months, oldest first
      name = "12 months";
      const d = C.parseKey(today);
      for (let i = 11; i >= 0; i--) {
        const m = new Date(d.getFullYear(), d.getMonth() - i, 1, 12);
        const first = C.dateKey(m);
        const lastDay = C.dateKey(new Date(m.getFullYear(), m.getMonth() + 1, 0, 12));
        const r = rangeStats(first, lastDay < today ? lastDay : today);
        points.push({ v: r.pct, label: m.toLocaleDateString("en-GB", { month: "narrow" }), hi: i === 0 });
        if (i === 11) from = first;
      }
      prevFrom = C.addDays(from, -365); prevTo = C.addDays(today, -365);
    }
    const now = rangeStats(from, today);
    const before = rangeStats(prevFrom, prevTo);
    return { points: points, now: now, before: before, from: from, name: name };
  }

  function insights(today) {
    const out = [];
    const from = C.addDays(today, -29);
    // Longest running streak
    const st = data.habits.map((h) => ({ h: h, s: C.streak(data, h, today) })).sort((a, b) => b.s.current - a.s.current)[0];
    if (st && st.s.current >= 3) {
      out.push({ icon: ICON.flame(18), tint: colorOf(st.h), title: "On a roll",
        text: "<b>" + esc(st.h.name) + "</b> is on a " + plural(st.s.current, st.s.unit) + " streak" + (st.s.current >= st.s.best ? ", your best yet." : ". Your best is " + st.s.best + ".") });
    }
    // Strongest weekday over 8 weeks
    const byDow = [0, 1, 2, 3, 4, 5, 6].map(() => ({ d: 0, t: 0 }));
    for (let k = C.addDays(today, -56); k < today; k = C.addDays(k, 1)) {
      const s = dayStats(k); byDow[C.dayOfWeek(k)].d += s.done; byDow[C.dayOfWeek(k)].t += s.total;
    }
    const days = WEEK_ORDER.map((d) => ({ d: d, v: byDow[d].t ? pct(byDow[d].d, byDow[d].t) : null })).filter((x) => x.v != null);
    if (days.length >= 5) {
      const best = days.slice().sort((a, b) => b.v - a.v)[0];
      const worst = days.slice().sort((a, b) => a.v - b.v)[0];
      out.push({ icon: ICON.history(18), tint: "var(--ink)", title: "Your strongest day",
        text: "You show up most on <b>" + DOW_SHORT[best.d] + "days</b> (" + best.v + "%)" + (worst.v < best.v - 10 ? ". " + DOW_SHORT[worst.d] + "days are hardest at " + worst.v + "%." : "."),
        viz: '<span class="mini-bars">' + days.map((x) => '<i style="height:' + Math.max(8, x.v) + '%"' + (x.d === best.d ? ' class="hi"' : "") + "></i>").join("") + "</span>" });
    }
    // Time of day
    const byTime = {};
    data.habits.forEach((h) => {
      if (h.time === "anytime") return;
      const r = C.rate(data, h, from, today);
      const b = byTime[h.time] || (byTime[h.time] = { d: 0, t: 0 });
      b.d += r.done; b.t += r.due;
    });
    const times = TIMES.filter((t) => byTime[t.id] && byTime[t.id].t).map((t) => ({ t: t, v: pct(byTime[t.id].d, byTime[t.id].t) }));
    if (times.length >= 2) {
      const s = times.slice().sort((a, b) => b.v - a.v);
      out.push({ icon: ICON.clock(18), tint: "var(--marigold)", title: "Best time of day",
        text: "<b>" + s[0].t.label + "</b> habits land " + s[0].v + "% of the time, " + s[s.length - 1].t.label.toLowerCase() + " ones " + s[s.length - 1].v + "%.",
        viz: '<span class="tod">' + times.map((x) => '<span><i style="width:' + x.v + '%"></i><em>' + x.t.label[0] + "</em></span>").join("") + "</span>" });
    }
    // Needs attention
    const weak = data.habits.map((h) => ({ h: h, r: C.rate(data, h, from, today) })).filter((x) => x.r.pct != null && x.r.due >= 4 && x.r.pct < 60).sort((a, b) => a.r.pct - b.r.pct)[0];
    if (weak) {
      out.push({ icon: ICON.target(18), tint: colorOf(weak.h), title: "Needs a little care",
        text: "<b>" + esc(weak.h.name) + "</b> happened " + weak.r.pct + "% of the time this month. Try a smaller version of it, or fewer days a week." });
    }
    return out;
  }

  function monthDots(today) {
    const first = today.slice(0, 7) + "-01";
    const d = C.parseKey(first);
    const daysIn = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    const lead = (C.dayOfWeek(first) + 6) % 7;
    let cells = WEEK_ORDER.map((x) => '<span class="md-dow">' + DOW_SHORT[x][0] + "</span>").join("");
    for (let i = 0; i < lead; i++) cells += "<span></span>";
    for (let i = 0; i < daysIn; i++) {
      const k = C.addDays(first, i);
      if (k > today) { cells += '<span class="md future"><b>' + (i + 1) + "</b></span>"; continue; }
      const s = dayStats(k);
      const p = s.total ? s.done / s.total : 0;
      cells += '<span class="md' + (s.total && p === 1 ? " full" : "") + (s.total ? "" : " md-none") + (k === today ? " is-today" : "") + '" style="--p:' + Math.round(p * 100) + '%" title="' + fmt(k, { day: "numeric", month: "short" }) + ": " + s.done + " of " + s.total + '"><b>' + (i + 1) + "</b></span>";
    }
    return cells;
  }

  function progressScreen() {
    const today = todayKey();
    let html = '<header class="screen-head"><div><p class="eyebrow">Your consistency</p><h1 class="large-title">Progress</h1></div></header>';
    if (!data.habits.length) return html + emptyState();
    const P = periodData(ui.period);
    const delta = P.now.pct != null && P.before.pct != null ? P.now.pct - P.before.pct : null;
    const seg = (v, l) => '<button class="seg-btn' + (ui.period === v ? " on" : "") + '" data-action="period" data-v="' + v + '" aria-pressed="' + (ui.period === v) + '">' + l + "</button>";
    html += '<div class="segmented" role="group" aria-label="Period">' + seg("week", "Week") + seg("month", "Month") + seg("year", "Year") + "</div>";
    html += '<section class="card score-card"><div class="score-top"><div><p class="caption">This ' + P.name + '</p><p class="score num">' + (P.now.pct == null ? "–" : P.now.pct) + "<small>%</small></p></div>" +
      (delta != null ? '<span class="delta ' + (delta >= 0 ? "up" : "down") + '">' + (delta >= 0 ? ICON.up(13) : ICON.down(13)) + Math.abs(delta) + "%</span>" : "") + "</div>" +
      '<p class="score-sub">' + P.now.done + " of " + P.now.due + " check-ins" + (delta != null ? " · " + (delta >= 0 ? "ahead of" : "behind") + " the " + P.name + " before (" + P.before.pct + "%)" : "") + "</p>" +
      (ui.period === "week" ? weekBars(P.points) : areaChart(P.points)) + "</section>";

    const ins = insights(today);
    if (ins.length) {
      html += '<section class="highlights"><h2 class="section-title">Highlights</h2>' + ins.map((x) =>
        '<article class="card insight" style="--t:' + x.tint + '"><span class="ins-icon">' + x.icon + '</span><div class="ins-body"><p class="ins-title">' + x.title + "</p><p>" + x.text + "</p></div>" + (x.viz || "") + "</article>").join("") + "</section>";
    }

    html += '<section class="card month-dots-card"><div class="card-head"><h2>' + fmt(today, { month: "long" }) + '</h2><span class="caption">Each day, all habits</span></div><div class="md-grid">' + monthDots(today) + "</div></section>";

    const from = ui.period === "week" ? C.weekStart(today) : ui.period === "month" ? C.addDays(today, -29) : C.addDays(today, -364);
    const rows = data.habits.map((h) => ({ h: h, r: C.rate(data, h, from, today), s: C.streak(data, h, today) }))
      .sort((a, b) => (b.r.pct == null ? -1 : b.r.pct) - (a.r.pct == null ? -1 : a.r.pct));
    html += '<section class="card by-card"><div class="card-head"><h2>By habit</h2><span class="caption">This ' + P.name + '</span></div><div class="by-habit">' + rows.map(byHabitRow).join("") + "</div></section>";
    return html;
  }

  // One line per habit: the week as seven dots (or a bar for longer periods) and its share done.
  function byHabitRow(x) {
    const today = todayKey(), h = x.h, r = x.r;
    let meta;
    if (h.schedule.type === "weekly" && ui.period === "week") meta = C.weekDoneDays(data, h, C.weekStart(today)) + " of " + h.schedule.times + " this week";
    else if (!r.due) meta = C.isScheduled(h, today) ? "Not done yet today" : "Nothing due yet";
    else meta = r.done + " of " + r.due + " done";
    if (x.s.current) meta += ' · <span class="flame">' + ICON.flame(11) + "</span>" + plural(x.s.current, x.s.unit);
    let viz;
    if (ui.period === "week") {
      viz = '<span class="bh-week">';
      for (let i = 0, k = C.weekStart(today); i < 7; i++, k = C.addDays(k, 1)) {
        const done = C.countOn(data, h.id, k) >= h.target;
        viz += '<i class="' + (done ? "on" : k > today ? "later" : !C.isScheduled(h, k) || h.schedule.type === "weekly" ? "off" : k === today ? "now" : "miss") + '"></i>';
      }
      viz += "</span>";
    } else viz = '<span class="bh-track"><i style="width:' + (r.pct || 0) + '%"></i></span>';
    return '<button class="bh-row" data-action="open" data-id="' + h.id + '" style="--c:' + colorOf(h) + '"><span class="bh-icon">' + habitIcon(h, 19) + "</span>" +
      '<span class="bh-main"><span class="bh-name">' + esc(h.name) + "</span>" + viz + '<span class="bh-meta">' + meta + "</span></span>" +
      '<b class="bh-pct num' + (r.pct == null ? " none" : "") + '">' + (r.pct == null ? "–" : r.pct + "<small>%</small>") + "</b></button>";
  }

  // ---------- Habits ----------
  function habitCard(h) {
    const today = todayKey();
    const st = C.streak(data, h, today);
    const start = C.weekStart(today);
    let dots = "";
    for (let i = 0; i < 7; i++) {
      const k = C.addDays(start, i);
      const sched = C.isScheduled(h, k);
      const done = C.countOn(data, h.id, k) >= h.target;
      dots += '<i class="' + (done ? "on" : sched && k <= today ? "due" : k > today ? "later" : "off") + '"></i>';
    }
    return '<div class="habit-card' + (ui.editMode ? " wiggle" : "") + '" style="--c:' + colorOf(h) + '" data-id="' + h.id + '">' +
      (ui.editMode ? '<button class="del-badge" data-action="delete" data-id="' + h.id + '" aria-label="Delete ' + esc(h.name) + '">' + ICON.minus(14) + "</button>" : "") +
      '<button class="hc-main" data-action="' + (ui.editMode ? "edit" : "open") + '" data-id="' + h.id + '">' +
      '<span class="hc-top"><span class="hc-icon">' + habitIcon(h, 23) + "</span>" + (st.current ? '<span class="hc-streak num"><span class="flame">' + ICON.flame(12) + "</span>" + st.current + "</span>" : "") + "</span>" +
      '<span class="hc-name">' + esc(h.name) + '</span><span class="hc-sched">' + scheduleText(h) + (goalText(h) ? " · " + esc(goalText(h)) : "") + "</span>" +
      '<span class="hc-week">' + dots + "</span></button></div>";
  }

  function habitsScreen() {
    const today = todayKey();
    const st = dayStats(today);
    let html = '<header class="screen-head"><div><p class="eyebrow">' + plural(data.habits.length, "habit") + (st.total ? " · " + st.done + " done today" : "") + '</p><h1 class="large-title">Habits</h1></div>' +
      (data.habits.length ? '<div class="head-tools"><button class="text-btn' + (ui.editMode ? " strong" : "") + '" data-action="edit-mode">' + (ui.editMode ? "Done" : "Edit") + "</button></div>" : "") + "</header>";
    if (!data.habits.length) return html + emptyState();
    if (ui.editMode) html += '<p class="edit-note">Tap ⊖ to delete a habit, or tap a card to change it.</p>';
    html += '<div class="habit-grid">' + data.habits.map(habitCard).join("") +
      '<button class="habit-card add-card" data-action="add">' + ICON.plus(22) + "<span>New habit</span></button></div>";
    return html;
  }

  // ---------- Settings ----------
  function settingsScreen() {
    const theme = data.settings.theme;
    const seg = (v, label) => '<button class="seg-btn' + (theme === v ? " on" : "") + '" data-action="theme" data-v="' + v + '" aria-pressed="' + (theme === v) + '">' + label + "</button>";
    const where = desktop ? "this Mac" : native ? "this phone" : "this browser";
    return '<header class="screen-head"><div><h1 class="large-title">Settings</h1></div></header>' +
      '<section class="settings-group"><p class="caption">Appearance</p><div class="segmented" role="group" aria-label="Theme">' + seg("system", "System") + seg("light", "Light") + seg("dark", "Dark") + "</div></section>" +
      widgetSettings() + syncSettings() +
      '<section class="settings-group"><p class="caption">Your data</p><div class="list card">' +
      '<button class="list-row" data-action="export"><span class="tile" style="--c:#3F82CC">' + ICON.upload(18) + '</span><span class="lr-text"><span class="lr-title">Export backup</span><span class="lr-sub">Save all habits and history as a file</span></span></button>' +
      '<button class="list-row" data-action="import"><span class="tile" style="--c:#4F8C63">' + ICON.download(18) + '</span><span class="lr-text"><span class="lr-title">Import backup</span><span class="lr-sub">Replace everything with a backup file</span></span></button>' +
      '<button class="list-row" data-action="tips-again"><span class="tile" style="--c:#BC8A35">' + ICON.right(18) + '</span><span class="lr-text"><span class="lr-title">Show gesture tips</span><span class="lr-sub">How swiping and holding a habit works</span></span></button>' +
      '<button class="list-row" data-action="sample"><span class="tile" style="--c:#7766C6">' + ICON.sparkle(18) + '</span><span class="lr-text"><span class="lr-title">Load example habits</span><span class="lr-sub">Replace everything with sample data</span></span></button>' +
      '<button class="list-row danger" data-action="reset"><span class="tile" style="--c:#C2413B">' + ICON.trash(18) + '</span><span class="lr-text"><span class="lr-title">Erase everything</span><span class="lr-sub">Delete all habits and history</span></span></button>' +
      '</div><p class="footnote">Your habits are stored only on ' + where + (pair || (ui.syncInfo && ui.syncInfo.on) ? " and the devices it syncs with." : ". Export a backup to move them to another device.") + "</p></section>" +
      '<section class="about">' + brandMark(40) + "<p><b>" + APP_NAME + '</b> · version ' + esc(window.ROJ_VERSION || "") + '</p><p class="muted small">Small habits, every single day.</p></section>';
  }

  // Android: put the widget on the home screen. Mac: show or hide the desktop widget.
  function widgetSettings() {
    let row = "";
    if (homeWidget) row = '<button class="list-row" data-action="pin-widget"><span class="tile" style="--c:#3F8F8C">' + ICON.widget(18) + '</span><span class="lr-text"><span class="lr-title">Add widget to home screen</span><span class="lr-sub">See today\'s habits and check them off without opening the app</span></span></button>';
    else if (desktop && desktop.toggleWidget) row = '<button class="list-row" data-action="desk-widget" role="switch" aria-checked="' + !!ui.deskWidget + '"><span class="tile" style="--c:#3F8F8C">' + ICON.widget(18) + '</span><span class="lr-text"><span class="lr-title">Desktop widget</span><span class="lr-sub">Today\'s habits in a small card on your desktop</span></span><span class="switch' + (ui.deskWidget ? " on" : "") + '"><i></i></span></button>';
    return row ? '<section class="settings-group"><p class="caption">Widgets</p><div class="list card">' + row + "</div></section>" : "";
  }

  // Sync. Mac: a switch, then the QR code the phone scans. Phone: who it syncs with, or how to pair.
  function syncSettings() {
    const ago = (t) => { const m = Math.round((Date.now() - t) / 60000); return m < 1 ? "just now" : m < 60 ? m + " min ago" : m < 1440 ? Math.round(m / 60) + " h ago" : fmt(C.dateKey(new Date(t)), { day: "numeric", month: "short" }); };
    const tile = '<span class="tile" style="--c:#4C84BC">' + ICON.sync(18) + "</span>";
    let body = "";
    if (desktop && desktop.syncInfo) {
      const s = ui.syncInfo || {};
      body = '<div class="list card"><button class="list-row" data-action="sync-switch" role="switch" aria-checked="' + !!s.on + '">' + tile +
        '<span class="lr-text"><span class="lr-title">Sync with your phone</span><span class="lr-sub">Over your Wi-Fi. No account, nothing in the cloud.</span></span><span class="switch' + (s.on ? " on" : "") + '"><i></i></span></button></div>';
      if (s.on) {
        body += '<div class="card pair-card">' + (s.hosts && s.hosts.length ?
          '<div class="pair-qr">' + s.qr + '</div><div class="pair-steps"><p class="pair-title">Pair your phone</p>' +
          "<ol><li>Open the <b>camera</b> on your Android phone and point it at this code.</li><li>Tap the link that appears. " + APP_NAME + " opens and pairs.</li></ol>" +
          '<p class="pair-manual">Or in the phone app: Settings → Sync, type<br>Address <b class="num">' + esc(s.hosts[0] + (s.port !== 47613 ? ":" + s.port : "")) + '</b> · Code <b class="num">' + esc(s.code) + "</b></p>" +
          '<p class="pair-last">' + (s.last ? "Last synced with " + esc(s.last.device) + " " + ago(s.last.time) : "Not synced yet. Both need the same Wi-Fi.") + ' · <button class="link-btn" data-action="sync-newcode">New code</button></p></div>' :
          '<p class="pair-manual">Connect this Mac to Wi-Fi to pair a phone.</p>') + "</div>";
      }
    } else if (native) {
      if (pair) {
        const sub = ui.syncError === "offline" ? "Can't reach the Mac right now. Same Wi-Fi?" : ui.syncError === "refused" ? "The Mac changed its code. Pair again." : pair.time ? "Last sync " + ago(pair.time) : "Not synced yet";
        body = '<div class="list card"><div class="list-row">' + tile + '<span class="lr-text"><span class="lr-title">Synced with ' + esc(pair.name) + '</span><span class="lr-sub">' + sub + "</span></span>" +
          '<button class="text-btn" data-action="sync-now">Sync now</button></div>' +
          '<button class="list-row danger" data-action="unpair"><span class="tile" style="--c:#8A8780">' + ICON.minus(18) + '</span><span class="lr-text"><span class="lr-title">Stop syncing</span><span class="lr-sub">Your habits stay on this phone</span></span></button></div>';
      } else {
        body = '<div class="card pair-card phone">' + '<p class="pair-title">Sync with your Mac</p>' +
          '<p class="pair-manual">On the Mac open ' + APP_NAME + " → Settings → <b>Sync with your phone</b>, then scan the code with this phone's camera. Or type what the Mac shows:</p>" +
          '<div class="pair-inputs"><input id="pair-host" class="unit-input" type="text" inputmode="decimal" autocomplete="off" placeholder="Address, like 192.168.1.5">' +
          '<input id="pair-code" class="unit-input" type="text" autocapitalize="characters" autocomplete="off" placeholder="Code, like K7QM-3XPD"></div>' +
          '<button class="btn" data-action="pair-manual">' + ICON.sync(18) + "Pair</button></div>";
      }
    }
    return body ? '<section class="settings-group"><p class="caption">Sync</p>' + body + "</section>" : "";
  }

  // ---------- sync (same Wi-Fi) ----------
  // The Mac app listens on the home network (electron/main.js). The phone pairs once, from the
  // QR code (rojhabit://pair?h=hosts&p=port&c=code&n=name) or by typing the address and code.
  // Then, when it opens and after each change, it sends its data and keeps the joined data the
  // Mac sends back (C.merge, the same on both sides).
  const PAIR_KEY = "rojhabit.pair.v1";
  const httpPlugin = native ? capCore.CapacitorHttp : null;
  let pair = null, syncBusy = false, syncAgain = false, syncTimer = null;
  const cleanCode = (c) => String(c || "").toUpperCase().replace(/[^A-Z0-9]/g, "");

  async function loadPair() {
    if (!native) return;
    try { const v = (await capacitorPreferences.Preferences.get({ key: PAIR_KEY })).value; pair = v ? JSON.parse(v) : null; } catch (e) { pair = null; }
  }
  function savePair() {
    const p = capacitorPreferences.Preferences;
    (pair ? p.set({ key: PAIR_KEY, value: JSON.stringify(pair) }) : p.remove({ key: PAIR_KEY })).catch(() => {});
  }
  function pairFromUrl(url) {
    let u;
    try { u = new URL(url); } catch (e) { return; }
    if (u.protocol !== "rojhabit:" || u.host !== "pair") return;
    const hosts = (u.searchParams.get("h") || "").split(",").filter((h) => /^[0-9a-z.:-]+$/i.test(h));
    const code = cleanCode(u.searchParams.get("c"));
    if (!hosts.length || !code) return;
    pair = { hosts: hosts, port: +u.searchParams.get("p") || 47613, code: code, name: (u.searchParams.get("n") || "Mac").slice(0, 40), last: null, time: 0 };
    savePair();
    ui.tab = "settings"; ui.sheet = null; ui.detail = null; ui.syncError = null;
    render();
    syncNow(true);
  }
  function queueSync() {
    if (!pair) return;
    clearTimeout(syncTimer);
    syncTimer = setTimeout(() => syncNow(false), 1500);
  }
  async function syncNow(manual) {
    if (!pair || !httpPlugin) return;
    if (syncBusy) { syncAgain = true; return; }
    syncBusy = true;
    const hosts = [pair.last].concat(pair.hosts).filter((h, i, a) => h && a.indexOf(h) === i);
    let result = "offline";
    for (const host of hosts) {
      try {
        const r = await httpPlugin.request({
          url: "http://" + host + ":" + pair.port + "/roj/sync", method: "POST", headers: { "Content-Type": "application/json" },
          data: { code: pair.code, device: "Android phone", state: data }, connectTimeout: 2500, readTimeout: 10000
        });
        if (r.status === 401) { result = "refused"; break; }
        const body = typeof r.data === "string" ? JSON.parse(r.data) : r.data;
        const v = r.status === 200 && body && body.state && C.validate(body.state);
        if (!v) continue;
        data = normalize(C.merge(data, v));
        Store.save(data, true);
        Object.assign(pair, { last: host, time: Date.now(), name: String(body.name || pair.name).slice(0, 40) });
        savePair();
        result = "ok";
        break;
      } catch (e) { /* try the next address */ }
    }
    syncBusy = false;
    ui.syncError = result === "ok" ? null : result;
    if (!ui.sheet && !ui.menu && !gesture) render();
    if (manual) toast(result === "ok" ? ICON.check(16) + " Synced with " + esc(pair.name) : result === "refused" ? "The Mac did not accept the code. Pair again." : "Can't reach " + esc(pair.name) + ". Same Wi-Fi, and " + APP_NAME + " open on the Mac?", 3600);
    if (syncAgain) { syncAgain = false; syncNow(false); }
  }

  // ---------- detail ----------
  function detailView(h) {
    const today = todayKey();
    const st = C.streak(data, h, today);
    const r30 = C.rate(data, h, C.addDays(today, -29), today);
    const total = Object.keys(data.log).filter((k) => C.isDone(data, h, k)).length;
    const count = C.countOn(data, h.id, ui.day);
    let html = '<div class="detail" style="--c:' + colorOf(h) + '">';
    html += '<div class="detail-bar"><button class="nav-btn" data-action="close-detail">' + ICON.left(20) + (isWide() ? "Close" : "Back") + "</button>" +
      '<button class="nav-btn" data-action="edit" data-id="' + h.id + '">' + ICON.pencil(17) + "Edit</button></div>";
    html += '<section class="detail-hero"><div class="hero-top"><span class="hero-icon">' + habitIcon(h, 26) + '</span><span class="hero-sched">' + scheduleText(h) + (goalText(h) ? " · " + esc(goalText(h)) : "") + "</span></div>" +
      "<h2>" + esc(h.name) + '</h2><p class="hero-since">Since ' + fmt(h.created, { day: "numeric", month: "long", year: "numeric" }) + "</p>" +
      '<p class="hero-streak"><b class="num">' + st.current + "</b><span>" + (st.unit === "week" ? (st.current === 1 ? "week" : "weeks") : (st.current === 1 ? "day" : "days")) + " in a row</span></p></section>";
    if (h.target > 1 && C.isScheduled(h, ui.day) && ui.day <= today) {
      html += '<section class="card counter-card"><button class="round-btn" data-action="dec" data-id="' + h.id + '" aria-label="Remove one"' + (count ? "" : " disabled") + ">" + ICON.minus(20) + "</button>" +
        '<div class="counter-mid"><b class="num">' + count + "<span> / " + h.target + "</span></b>" + beads(count, h.target) + "<span>" + esc(h.unit || "times") + " · " + (ui.day === today ? "today" : fmt(ui.day, { day: "numeric", month: "short" })) + "</span></div>" +
        '<button class="round-btn fill" data-action="inc" data-id="' + h.id + '" aria-label="Add one">' + ICON.plus(20) + "</button></section>";
    }
    html += '<div class="stat-tiles"><div class="card"><b class="num">' + st.best + "</b><span>Best " + (st.unit === "week" ? "weeks" : "streak") + '</span></div><div class="card"><b class="num">' + total + '</b><span>Times done</span></div><div class="card"><b class="num">' + (r30.pct == null ? "–" : r30.pct + "%") + "</b><span>Last 30 days</span></div></div>";
    html += '<div class="segmented" role="group" aria-label="History range"><button class="seg-btn' + (ui.mode === "month" ? " on" : "") + '" data-action="mode" data-v="month">Month</button><button class="seg-btn' + (ui.mode === "year" ? " on" : "") + '" data-action="mode" data-v="year">Year</button></div>';
    html += ui.mode === "month" ? monthCard(h) : yearCard(h);
    html += '<button class="btn ghost-danger" data-action="delete" data-id="' + h.id + '">' + ICON.trash(18) + "Delete habit</button>";
    html += "</div>";
    return html;
  }

  function monthCard(h) {
    const today = todayKey();
    const first = ui.calMonth || today.slice(0, 7) + "-01";
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
    return { name: "", icon: "sprout", color: color, time: "anytime", schedule: { type: "daily", days: [1, 2, 3, 4, 5], times: 3 }, target: 1, unit: "" };
  }
  function draftFrom(h) {
    return { id: h.id, name: h.name, icon: h.icon, emoji: h.emoji, color: h.color, time: h.time, unit: h.unit, target: h.target,
      schedule: { type: h.schedule.type === "days" && h.schedule.days.length === 7 ? "daily" : h.schedule.type, days: (h.schedule.days || [1, 2, 3, 4, 5]).slice(), times: h.schedule.times || 3 } };
  }

  function editorSheet(d) {
    const c = (COLORS.find((x) => x.id === d.color) || COLORS[0]).hex;
    const s = d.schedule;
    let html = '<div class="sheet-bar"><button class="nav-btn" data-action="close-sheet">Cancel</button><h2>' + (d.id ? "Edit habit" : "New habit") + '</h2><button class="nav-btn strong" data-action="save" id="save-btn"' + (d.name.trim() ? "" : " disabled") + ">" + (d.id ? "Save" : "Add") + "</button></div>";
    html += '<div class="sheet-body" data-scroll="sheet" style="--c:' + c + '">';
    html += '<div class="editor-hero"><span class="hero-tile">' + habitIcon(d, 28) + '</span><input id="habit-name" class="name-input" type="text" maxlength="40" placeholder="What will you do?" value="' + esc(d.name) + '" autocomplete="off" aria-label="Habit name"></div>';
    if (!d.id) {
      const have = data.habits.map((h) => h.name.toLowerCase());
      const sugg = SUGGESTIONS.filter((x) => have.indexOf(x.name.toLowerCase()) === -1);
      if (sugg.length) html += '<div class="suggest" role="group" aria-label="Suggestions">' + sugg.map((x, i) => '<button class="chip" data-action="suggest" data-v="' + SUGGESTIONS.indexOf(x) + '">' + iconSvg(x.icon, 16) + esc(x.name) + "</button>").join("") + "</div>";
    }
    html += '<p class="caption">Icon</p><div class="icon-grid">' + ICONS.map((n) => '<button class="icon-pick' + (n === d.icon ? " on" : "") + '" data-action="icon" data-v="' + n + '" aria-label="Icon ' + n.replace(/-/g, " ") + '">' + iconSvg(n, 22) + "</button>").join("") + "</div>";
    html += '<p class="caption">Colour</p><div class="color-row">' + COLORS.map((x) => '<button class="swatch' + (x.id === d.color ? " on" : "") + '" style="--s:' + x.hex + '" data-action="color" data-v="' + x.id + '" aria-label="Colour ' + x.id + '"></button>').join("") + "</div>";
    html += '<p class="caption">Time of day</p><div class="segmented four">' + TIMES.map((t) => '<button class="seg-btn' + (d.time === t.id ? " on" : "") + '" data-action="time" data-v="' + t.id + '">' + ICON[t.icon](16) + "<span>" + t.label + "</span></button>").join("") + "</div>";
    html += '<p class="caption">Repeat</p><div class="segmented">' +
      [["daily", "Every day"], ["days", "Some days"], ["weekly", "Weekly"]].map((x) => '<button class="seg-btn' + (s.type === x[0] ? " on" : "") + '" data-action="rtype" data-v="' + x[0] + '">' + x[1] + "</button>").join("") + "</div>";
    if (s.type !== "weekly") {
      const on = (x) => s.type === "daily" || s.days.indexOf(x) !== -1;
      html += '<div class="day-chips">' + WEEK_ORDER.map((x) => '<button class="day-chip' + (on(x) ? " on" : "") + '" data-action="rday" data-v="' + x + '" aria-pressed="' + on(x) + '">' + DOW_SHORT[x].slice(0, 2) + "</button>").join("") + "</div>";
    }
    if (s.type === "weekly") html += '<div class="stepper-row card"><span>Times per week</span>' + stepper("times", s.times) + "</div>";
    html += '<p class="caption">Daily goal</p><div class="stepper-row card"><span>' + (d.target > 1 ? "Count up to" : "Once a day") + "</span>" + stepper("target", d.target) + "</div>";
    if (d.target > 1) html += '<input id="habit-unit" class="unit-input" type="text" maxlength="16" placeholder="Unit, like glasses or pages" value="' + esc(d.unit) + '" aria-label="Unit">';
    if (d.id) html += '<button class="btn ghost-danger" data-action="delete" data-id="' + d.id + '">' + ICON.trash(18) + "Delete habit</button>";
    html += "</div>";
    return html;
  }
  function stepper(field, v) {
    return '<span class="stepper"><button data-action="step" data-f="' + field + '" data-d="-1" aria-label="Less"' + (v <= 1 ? " disabled" : "") + ">" + ICON.minus(16) + '</button><b class="num">' + v + '</b><button data-action="step" data-f="' + field + '" data-d="1" aria-label="More"' + (v >= (field === "times" ? 7 : 99) ? " disabled" : "") + ">" + ICON.plus(16) + "</button></span>";
  }

  // ---------- overlays ----------
  function menuView(m) {
    const h = habitById(m.id);
    if (!h) return "";
    const items = '<button class="menu-item" data-action="menu-edit">' + ICON.pencil(18) + "Edit habit</button>" +
      '<button class="menu-item" data-action="menu-open">' + ICON.history(18) + "See history</button>" +
      '<button class="menu-item danger" data-action="menu-delete">' + ICON.trash(18) + "Delete habit</button>";
    if (isWide()) {
      const x = Math.min(m.x, window.innerWidth - 240), y = Math.min(m.y, window.innerHeight - 170);
      return '<div class="scrim clear" data-action="menu-close"></div><div class="popover" role="menu" style="left:' + x + "px;top:" + y + 'px">' + items + "</div>";
    }
    return '<div class="scrim enter" data-action="menu-close"></div><div class="action-sheet" role="menu" style="--c:' + colorOf(h) + '">' +
      '<div class="as-group"><div class="as-head"><span class="as-icon">' + habitIcon(h, 21) + "</span><div><b>" + esc(h.name) + "</b><span>" + scheduleText(h) + (goalText(h) ? " · " + esc(goalText(h)) : "") + "</span></div></div>" + items + "</div>" +
      '<button class="as-cancel" data-action="menu-close">Cancel</button></div>';
  }

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
      '<div class="cb-dots">' + dots + '</div><p class="cb-name">' + habitIcon(h, 22) + esc(h.name) + "</p><p class=\"cb-line\">" + (lines[n] || "Keep it going.") + "</p>" +
      '<button class="btn light" data-action="celebrate-close">Keep going</button></div></div>';
  }

  // ---------- shell ----------
  const TABS = [["today", "Today"], ["progress", "Progress"], ["habits", "Habits"], ["settings", "Settings"]];

  function sidebar() {
    const today = todayKey();
    return '<nav class="sidebar" aria-label="Sections"><div class="side-brand">' + brandMark(24) + "<b>" + APP_NAME + "</b></div>" +
      TABS.map((t) => '<button class="side-item' + (ui.tab === t[0] ? " on" : "") + '" data-action="tab" data-v="' + t[0] + '">' + ICON[t[0]](18) + "<span>" + t[1] + "</span></button>").join("") +
      '<p class="side-caption">Today</p><div class="side-habits">' + data.habits.map((h) => {
        const st = C.streak(data, h, today);
        const due = C.isScheduled(h, today);
        const done = due && C.isDone(data, h, today);
        return '<div class="side-habit' + (ui.detail === h.id ? " on" : "") + (due ? "" : " rest") + '" data-id="' + h.id + '" style="--c:' + colorOf(h) + '">' +
          '<button class="side-check' + (done ? " done" : "") + '" data-action="toggle-today" data-id="' + h.id + '" aria-label="' + esc((done ? "Undo " : "Check off ") + h.name) + '"' + (due ? "" : " disabled") + ">" + (done ? ICON.check(10) : "") + "</button>" +
          '<button class="sh-name" data-action="open" data-id="' + h.id + '">' + esc(h.name) + "</button>" + (st.current ? '<span class="sh-streak num">' + st.current + "</span>" : "") + "</div>";
      }).join("") + "</div>" +
      '<button class="side-new" data-action="add">' + ICON.plus(16) + "New habit<kbd>⌘N</kbd></button></nav>";
  }

  function tabbar() {
    // The lens is drawn where it was and slides to the new tab once on screen (see playMotion).
    const i = Math.max(0, TABS.findIndex((t) => t[0] === ui.tab));
    const from = prev("tabGlow", i), moved = from !== i;
    return '<nav class="tabbar" aria-label="Sections"><span class="tab-glow' + (moved ? " moving" : "") + '" style="transform:translateX(' + from * 100 + '%)" data-tab-to="' + i * 100 + '%"><i></i></span>' + TABS.map((t) =>
      '<button class="tab' + (ui.tab === t[0] ? " on" + (moved ? " pop" : "") : "") + '" data-action="tab" data-v="' + t[0] + '"' + (ui.tab === t[0] ? ' aria-current="page"' : "") + ">" +
      '<span class="tab-ico">' + (ui.tab === t[0] ? ICON_FILL[t[0]](24) : ICON[t[0]](24)) + '</span><span class="tab-label">' + t[1] + "</span></button>").join("") + "</nav>";
  }

  function trayView() {
    const today = todayKey();
    ui.day = today;
    const st = dayStats(today);
    return '<div class="tray"><header class="tray-head">' + brandMark(26) +
      '<div><b>' + fmt(today, { weekday: "long", day: "numeric", month: "short" }) + "</b><span>" + st.done + " of " + st.total + " done</span></div>" +
      '<button class="icon-btn sm" data-action="open-main" aria-label="Open ' + APP_NAME + '">' + ICON.open(17) + "</button></header>" +
      '<div class="rows">' + (st.items.length ? st.items.map(habitRow).join("") : '<p class="muted small">Nothing planned today.</p>') + "</div></div>";
  }

  // The Mac desktop widget, in Apple's three widget sizes. Small: the ring, the count and the next
  // habit. Medium: the ring beside a checklist. Large: the count on top, the checklist, this week.
  // Rows share the height evenly; open habits come first.
  function widgetView() {
    const today = todayKey();
    ui.day = today;
    const st = dayStats(today);
    const order = (it) => (it.satisfied ? 10 : 0) + TIMES.findIndex((t) => t.id === it.habit.time);
    const items = st.items.slice().sort((a, b) => order(a) - order(b));
    const title = !st.total ? "Nothing today" : st.done === st.total ? "All done" : '<b class="num">' + st.done + "</b> of " + st.total + " done";
    const ring = (size, stroke) => '<div class="m-ring wg-ring" style="width:' + size + "px;height:" + size + 'px">' + segRing(st.items, size, stroke) +
      '<span class="m-pct num">' + pct(st.done, st.total) + "<small>%</small></span></div>";
    const row = (it) => {
      const h = it.habit, counter = h.target > 1 && !it.done;
      return '<div class="wg-row' + (it.satisfied ? " done" : "") + '" style="--c:' + colorOf(h) + '">' +
        '<button class="wg-check' + (counter ? " counter" : "") + '" data-action="toggle-today" data-id="' + h.id + '" aria-label="' + esc((it.done ? "Undo " : counter ? "Add one to " : "Check off ") + h.name) + '">' +
        (counter ? miniRing(it.frac, 22, "var(--c)", 2.5) + '<b class="num">' + it.count + "</b>" : ICON.check(11)) + "</button>" +
        '<span class="wg-name">' + esc(h.name) + "</span>" +
        (h.target > 1 ? '<span class="wg-meta num">' + it.count + "/" + h.target + "</span>" : h.schedule.type === "weekly" ? '<span class="wg-meta num">' + Math.min(it.weekDone, h.schedule.times) + "/" + h.schedule.times + " wk</span>" : "") + "</div>";
    };
    // slots: rows that fit; a few habits spread out (rows up to 48px) instead of leaving a gap.
    const list = (slots, height) => {
      if (!items.length) return '<p class="wg-empty">' + (data.habits.length ? "Nothing planned today. Rest counts too." : "Add a habit in " + APP_NAME + ".") + "</p>";
      const more = items.length > slots;
      const shown = more ? items.slice(0, slots - 1) : items;
      const n = more ? slots : height / items.length <= 48 ? items.length : slots;
      return '<div class="wg-rows" style="grid-template-rows:repeat(' + n + ',minmax(0,1fr))">' + shown.map(row).join("") +
        (more ? '<button class="wg-more" data-action="open-main">+' + (items.length - shown.length) + " more</button>" : "") + "</div>";
    };
    if (widgetSize === "small") {
      const next = items.find((i) => !i.satisfied);
      return '<div class="wg small"><div class="wg-top">' + ring(54, 6) + '<p class="kicker">' + fmt(today, { weekday: "short", day: "numeric" }) + "</p></div>" +
        '<p class="wg-title">' + title + "</p>" + (next ? row(next) : '<p class="wg-sub">' + (st.total ? "Every habit checked" : "Rest counts too") + "</p>") + "</div>";
    }
    if (widgetSize === "large") {
      return '<div class="wg large"><header class="wg-head"><div class="wg-text"><p class="kicker">' + fmt(today, { weekday: "long", day: "numeric", month: "short" }) + '</p><p class="wg-title">' + title + "</p></div>" + ring(52, 6) + "</header>" +
        list(6, 228) + weekDots() + "</div>";
    }
    return '<div class="wg medium"><div class="wg-side">' + ring(72, 7) + '<p class="wg-title">' + title + '</p><p class="kicker">' + fmt(today, { weekday: "short", day: "numeric", month: "short" }) + "</p></div>" +
      list(4, 138) + "</div>";
  }
  // Monday to Sunday: full dot = every habit done, ring = some, faint ring = none, faint dot = to come.
  function weekDots() {
    const today = todayKey(), start = C.weekStart(today);
    let out = "";
    for (let i = 0; i < 7; i++) {
      const k = C.addDays(start, i);
      const st = k <= today ? dayStats(k) : null;
      const state = !st ? "later" : !st.total ? "rest" : st.done === st.total ? "full" : st.done ? "some" : "none";
      out += '<div class="wg-day ' + state + (k === today ? " now" : "") + '"><span>' + fmt(k, { weekday: "narrow" }) + "</span><i></i></div>";
    }
    return '<div class="wg-week">' + out + "</div>";
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
    return '<div class="welcome"><div class="welcome-art">' + brandMark(132) + "</div>" +
      '<p class="eyebrow">Welcome to</p><h1>' + APP_NAME + '</h1><p class="welcome-sub">Small habits, every single day.<br>Watch your day fill up, from sunrise to night.</p>' +
      '<div class="welcome-btns"><button class="btn" data-action="start-sample">' + ICON.sparkle(18) + 'Start with examples</button><button class="btn secondary" data-action="start-empty">Start empty</button></div>' +
      (native ? '<button class="link-btn welcome-sync" data-action="start-sync">' + ICON.sync(15) + " Already using " + APP_NAME + " on your Mac? Sync it</button>" : "") + "</div>";
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
    root.classList.toggle("widget-mode", widgetMode);
    if (ui.tab === "settings" && !wide && ui.detail) ui.detail = null;

    let html;
    if (widgetMode) html = widgetView();
    else if (trayMode) html = trayView();
    else if (data.welcome) html = welcome();
    else {
      const detailHabit = wide && ui.detail && (ui.tab === "today" || ui.tab === "habits") ? habitById(ui.detail) : null;
      const phoneDetail = !wide && ui.detail && habitById(ui.detail);
      const hideDock = phoneDetail;
      html = '<div class="shell' + (detailHabit ? " has-detail" : "") + '">' + (wide ? sidebar() : "") +
        '<main class="pane main' + (ui.enter ? " enter" : "") + (hideDock && !wide ? " no-dock" : "") + (wide && ui.tab === "today" ? " desk" : "") + '" data-scroll="main">' + mainScreen() + "</main>" +
        (detailHabit ? '<aside class="pane side-detail" data-scroll="detail">' + detailView(detailHabit) + "</aside>" : "") + "</div>" +
        (!wide && !hideDock ? tabbar() : "");
    }
    if (ui.sheet) html += '<div class="scrim' + (ui.sheet.fresh ? " enter" : "") + '" data-action="close-sheet"></div><div class="sheet' + (ui.sheet.fresh ? " enter" : "") + '" role="dialog" aria-modal="true">' + editorSheet(ui.sheet.draft) + "</div>";
    if (ui.menu) html += menuView(ui.menu);
    if (ui.confirm) html += '<div class="scrim top enter" data-action="confirm-no"></div>' + confirmSheet(ui.confirm);
    if (ui.celebrate) html += celebrateView(ui.celebrate);
    if (ui.toast) html += '<div class="toast' + (ui.toast.fresh ? " enter" : "") + '" role="status">' + ui.toast.html + "</div>";
    app.innerHTML = html;
    if (ui.toast) ui.toast.fresh = false;

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
    playMotion();
    if (ui.celebrate && !ui.celebrate.shown) { ui.celebrate.shown = true; countUp(app.querySelector(".cb-num")); }
    applyTheme();
  }

  function playMotion() {
    const fills = app.querySelectorAll(".sr-fill[data-len], [data-count][data-from], .tab-glow[data-tab-to]");
    if (!fills.length && !ui.confetti) return;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      fills.forEach((el) => {
        if (el.dataset.tabTo != null) el.style.transform = "translateX(" + el.dataset.tabTo + ")";
        else if (el.dataset.len != null) el.setAttribute("stroke-dasharray", el.dataset.len + " " + el.dataset.circ);
        else if (el.dataset.from !== el.dataset.count) tween(el, +el.dataset.from, +el.dataset.count, el.dataset.suffix || "");
      });
    }));
    if (ui.confetti) { ui.confetti = false; burst(); }
  }
  function tween(el, from, to, suffix) {
    const t0 = performance.now(), dur = 600;
    (function step(t) {
      const p = Math.min(1, (t - t0) / dur);
      el.textContent = Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3))) + suffix;
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }
  // Perfect day: a small burst of marigold and habit colours from the progress ring.
  function burst() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const anchor = app.querySelector(".m-ring");
    if (!anchor) return;
    const r = anchor.getBoundingClientRect();
    const box = document.createElement("div");
    box.className = "confetti";
    box.style.left = r.left + r.width / 2 + "px";
    box.style.top = r.top + r.height / 2 + "px";
    const colors = ["var(--marigold)"].concat(COLORS.map((c) => c.hex));
    for (let i = 0; i < 18; i++) {
      const p = document.createElement("i");
      p.style.cssText = "--a:" + (i * 20 + Math.random() * 12) + "deg;--d:" + (70 + Math.random() * 60) + "px;--c:" + colors[i % colors.length] + ";--t:" + (0.7 + Math.random() * 0.4) + "s";
      box.appendChild(p);
    }
    document.body.appendChild(box);
    setTimeout(() => box.remove(), 1300);
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
  function toast(html, ms) {
    ui.toast = { html: html, fresh: true };
    render();
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { ui.toast = null; ui.undo = null; render(); }, ms || 2200);
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
    ui.tab = tab; ui.enter = true; ui.editMode = false;
    if (!isWide()) ui.detail = null;
    window.scrollTo(0, 0);
    render();
  }

  // Change a day's count; celebrate milestones and perfect days.
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
      } else {
        const st = dayStats(key);
        if (st.total && st.done === st.total) { setTimeout(() => haptic("success"), 120); ui.confetti = true; Store.save(data); toast(ICON.check(16) + " Perfect day"); return; }
      }
    } else haptic("light");
    commit();
  }

  function toggle(h, key) {
    const n = C.countOn(data, h.id, key);
    bump(h, key, h.target > 1 ? (n >= h.target ? -n : 1) : (n >= 1 ? -n : 1));
  }

  function openDetail(id) {
    ui.detail = id; ui.mode = "month"; ui.calMonth = null; ui.menu = null;
    if (ui.tab === "progress" || ui.tab === "settings") ui.tab = isWide() ? "habits" : ui.tab;
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
    const fields = { name: name, icon: d.icon, color: d.color, time: d.time, schedule: schedule, target: d.target, unit: d.target > 1 ? d.unit.trim() : "", updated: Date.now() };
    const isNew = !d.id;
    if (d.id) Object.assign(habitById(d.id), fields);
    else {
      const h = Object.assign({ id: uid(), created: todayKey() }, fields);
      data.habits.push(h);
      if (isWide()) ui.detail = h.id;
    }
    ui.sheet = null;
    Store.save(data);
    haptic("light");
    toast(ICON.check(16) + (isNew ? " Added " : " Saved ") + esc(name));
  }

  // Delete at once and offer Undo, the way Mail and Photos do.
  function deleteHabit(id) {
    const h = habitById(id);
    if (!h) return;
    const index = data.habits.indexOf(h);
    const log = {};
    Object.keys(data.log).forEach((k) => { if (data.log[k][id]) log[k] = data.log[k][id]; });
    C.removeHabit(data, id);
    ui.undo = { habit: h, index: index, log: log };
    ui.sheet = null; ui.menu = null;
    if (ui.detail === id) ui.detail = null;
    if (!data.habits.length) ui.editMode = false;
    Store.save(data);
    haptic("medium");
    toast("Deleted " + esc(h.name) + '<button class="toast-btn" data-action="undo">Undo</button>', 5000);
  }
  function undoDelete() {
    const u = ui.undo;
    if (!u) return;
    u.habit.updated = Date.now(); // newer than its deletion, so sync keeps it
    if (data.deleted) delete data.deleted[u.habit.id];
    data.habits.splice(Math.min(u.index, data.habits.length), 0, u.habit);
    Object.keys(u.log).forEach((k) => C.setCount(data, u.habit.id, k, u.log[k]));
    ui.undo = null;
    clearTimeout(toastTimer);
    ui.toast = null;
    commit();
  }

  function askConfirm(cf) { ui.confirm = cf; render(); }

  // Replace everything (import, examples, erase) so that sync carries it to the other devices:
  // habits that go away get deletion notes, and the new ones count as just edited.
  function replaceAll(next) {
    const now = Date.now(), keep = {};
    next.habits.forEach((h) => { h.updated = now; keep[h.id] = true; });
    next.deleted = Object.assign({}, data.deleted, next.deleted);
    data.habits.forEach((h) => { if (!keep[h.id]) next.deleted[h.id] = now; });
    next.habits.forEach((h) => { delete next.deleted[h.id]; });
    data = normalize(next);
  }

  async function exportBackup() {
    const text = JSON.stringify(data, null, 2);
    const name = "roj-habit-backup-" + todayKey() + ".json";
    try {
      if (desktop) { if (await desktop.saveFile(name, text)) toast("Backup saved"); return; }
      if (native) {
        const fs = capacitorFilesystemPluginCapacitor.Filesystem;
        const res = await fs.writeFile({ path: name, data: text, directory: "CACHE", encoding: "utf8" });
        await capacitorShare.Share.share({ title: APP_NAME + " backup", files: [res.uri] });
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
    if (!parsed || !parsed.habits.length) { toast("That file is not a " + APP_NAME + " backup"); return; }
    askConfirm({
      title: "Replace your habits?", yes: "Replace", danger: true,
      text: "This replaces your " + plural(data.habits.length, "habit") + " with " + plural(parsed.habits.length, "habit") + " from the backup.",
      run: () => { replaceAll(parsed); ui.detail = null; commit(); toast("Backup imported"); }
    });
  }

  function openMenu(id, x, y) {
    ui.menu = { id: id, x: x, y: y };
    haptic("medium");
    render();
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
      case "toggle-today": if (h) toggle(h, todayKey()); break;
      case "cell": case "cal": if (h) toggle(h, el.dataset.key); break;
      case "inc": if (h) bump(h, ui.day, 1); break;
      case "dec": if (h) bump(h, ui.day, -1); break;
      case "open": openDetail(id); break;
      case "close-detail": ui.detail = null; ui.enter = !isWide(); render(); break;
      case "mode": ui.mode = el.dataset.v; render(); break;
      case "period": ui.period = el.dataset.v; render(); break;
      case "cal-month": ui.calMonth = el.dataset.v; render(); break;
      case "add": ui.menu = null; ui.sheet = { draft: newDraft(), fresh: true }; render(); break;
      case "edit": if (h) { ui.menu = null; ui.sheet = { draft: draftFrom(h), fresh: true }; render(); } break;
      case "edit-mode": ui.editMode = !ui.editMode; render(); break;
      case "close-sheet": ui.sheet = null; render(); break;
      case "save": saveDraft(); break;
      case "suggest": {
        const s = SUGGESTIONS[+el.dataset.v], d = ui.sheet.draft;
        Object.assign(d, { name: s.name, icon: s.icon, color: s.color, time: s.time, target: s.target, unit: s.unit });
        d.schedule.type = s.weekly ? "weekly" : "daily";
        if (s.weekly) d.schedule.times = s.weekly;
        haptic("light"); render(); break;
      }
      case "icon": ui.sheet.draft.icon = el.dataset.v; render(); break;
      case "color": ui.sheet.draft.color = el.dataset.v; render(); break;
      case "time": ui.sheet.draft.time = el.dataset.v; render(); break;
      case "rtype": {
        const sc = ui.sheet.draft.schedule;
        sc.type = el.dataset.v;
        if (sc.type === "days" && sc.days.length === 7) sc.days = [1, 2, 3, 4, 5];
        render(); break;
      }
      case "rday": {
        // All seven days on is Every day; turning one off makes it Some days.
        const sc = ui.sheet.draft.schedule, v = +el.dataset.v;
        if (sc.type === "daily") { sc.type = "days"; sc.days = [0, 1, 2, 3, 4, 5, 6]; }
        const i = sc.days.indexOf(v);
        if (i === -1) sc.days.push(v); else sc.days.splice(i, 1);
        if (sc.days.length === 7) sc.type = "daily";
        haptic("light"); render(); break;
      }
      case "step": {
        const d = ui.sheet.draft, f = el.dataset.f, max = f === "times" ? 7 : 99;
        if (f === "times") d.schedule.times = Math.max(1, Math.min(max, d.schedule.times + +el.dataset.d));
        else d.target = Math.max(1, Math.min(max, d.target + +el.dataset.d));
        render(); break;
      }
      case "delete": deleteHabit(id); break;
      case "undo": undoDelete(); break;
      case "tip-done": data.settings.swipeTip = true; commit(); break;
      case "tips-again": delete data.settings.swipeTip; commit(); toast("Gesture tips are back on Today"); break;
      case "menu-close": ui.menu = null; render(); break;
      case "menu-edit": { const m = habitById(ui.menu.id); ui.menu = null; if (m) { ui.sheet = { draft: draftFrom(m), fresh: true }; } render(); break; }
      case "menu-open": openDetail(ui.menu.id); break;
      case "menu-delete": deleteHabit(ui.menu.id); break;
      case "confirm-yes": { const run = ui.confirm.run; ui.confirm = null; run(); break; }
      case "confirm-no": ui.confirm = null; render(); break;
      case "celebrate-close": ui.celebrate = null; render(); break;
      case "theme": data.settings.theme = el.dataset.v; commit(); break;
      case "export": exportBackup(); break;
      case "import": importBackup(); break;
      case "sample":
        askConfirm({ title: "Load example habits?", text: "This replaces everything you have now with sample habits and history.", yes: "Load examples", danger: data.habits.length > 0,
          run: () => { replaceAll(sampleData(data.settings.theme)); ui.detail = null; commit(); } });
        break;
      case "reset":
        askConfirm({ title: "Erase everything?", text: "All habits and their history will be deleted from this device" + (pair || (ui.syncInfo && ui.syncInfo.on) ? " and from the devices it syncs with." : "."), yes: "Erase", danger: true,
          run: () => { const next = C.emptyState(); next.settings.theme = data.settings.theme; replaceAll(next); ui.detail = null; commit(); } });
        break;
      case "start-sample": data = sampleData("system"); ui.enter = true; commit(); break;
      case "start-empty": delete data.welcome; ui.enter = true; commit(); break;
      case "start-sync": delete data.welcome; ui.tab = "settings"; ui.enter = true; commit(); break;
      case "open-main": if (desktop) desktop.openMain(); break;
      case "sync-switch": desktop.setSync(!(ui.syncInfo && ui.syncInfo.on)).then((info) => { ui.syncInfo = info; render(); }); break;
      case "sync-newcode":
        askConfirm({ title: "Make a new code?", text: "Phones paired with the old code stop syncing until you pair them again.", yes: "New code",
          run: () => desktop.newSyncCode().then((info) => { ui.syncInfo = info; render(); }) });
        break;
      case "sync-now": syncNow(true); break;
      case "unpair": pair = null; savePair(); ui.syncError = null; render(); toast("Sync stopped"); break;
      case "pair-manual": {
        const host = (document.getElementById("pair-host").value || "").trim().replace(/^https?:\/\//, "");
        const code = cleanCode(document.getElementById("pair-code").value);
        const m = host.match(/^([0-9a-z.-]+)(?::(\d+))?$/i);
        if (!m || code.length < 6) { toast("Type the address and code your Mac shows"); break; }
        pairFromUrl("rojhabit://pair?h=" + encodeURIComponent(m[1]) + "&p=" + (m[2] || 47613) + "&c=" + code + "&n=Mac");
        break;
      }
      case "desk-widget": desktop.toggleWidget().then((on) => { ui.deskWidget = on; render(); }); break;
      case "pin-widget":
        homeWidget.pin().then((r) => { if (!r || !r.asked) toast("Long-press your home screen, tap Widgets, then pick " + APP_NAME, 3600); })
          .catch(() => toast("Long-press your home screen, tap Widgets, then pick " + APP_NAME, 3600));
        break;
    }
    if (ev) ev.preventDefault();
  }

  // ---------- events ----------
  let gesture = null;   // swipe or long-press in progress
  let suppressClick = false;
  app.addEventListener("click", (ev) => {
    if (suppressClick) { suppressClick = false; ev.preventDefault(); return; }
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

  // Rows: swipe right to check, left to undo. Rows and cards: press and hold for a menu.
  app.addEventListener("pointerdown", (ev) => {
    if (ev.button !== 0 || ui.editMode) return;
    const row = ev.target.closest(".habit-row, .habit-card:not(.add-card), .side-habit");
    if (!row || !row.dataset.id) return;
    const swipeable = row.classList.contains("habit-row") && ui.day <= todayKey();
    gesture = { row: row, x: ev.clientX, y: ev.clientY, dx: 0, moved: false, id: ev.pointerId, swipeable: swipeable };
    gesture.timer = setTimeout(() => {
      if (!gesture || gesture.moved) return;
      const g = gesture;
      gesture = null;
      suppressClick = true;
      g.row.classList.add("held");
      setTimeout(() => g.row.classList.remove("held"), 250);
      openMenu(g.row.dataset.id, g.x, g.y);
    }, 480);
  });
  window.addEventListener("pointermove", (ev) => {
    const g = gesture;
    if (!g || ev.pointerId !== g.id) return;
    const dx = ev.clientX - g.x, dy = ev.clientY - g.y;
    if (!g.moved) {
      if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) { clearTimeout(g.timer); gesture = null; return; }
      if (Math.abs(dx) < 10) return;
      clearTimeout(g.timer);
      if (!g.swipeable) { gesture = null; return; }
      g.moved = true;
      g.row.classList.add("dragging");
    }
    g.dx = Math.max(-110, Math.min(110, dx));
    g.row.querySelector(".row-body").style.transform = "translateX(" + g.dx + "px)";
    g.row.classList.toggle("arm-left", g.dx > 70);
    g.row.classList.toggle("arm-right", g.dx < -70);
  });
  function endGesture() {
    const g = gesture;
    if (!g) return;
    clearTimeout(g.timer);
    gesture = null;
    if (!g.moved) return;
    suppressClick = true;
    setTimeout(() => { suppressClick = false; }, 0);
    g.row.classList.remove("dragging", "arm-left", "arm-right");
    g.row.querySelector(".row-body").style.transform = "";
    const h = habitById(g.row.dataset.id);
    if (!h) return;
    if (Math.abs(g.dx) > 70 && !data.settings.swipeTip) data.settings.swipeTip = true;
    if (g.dx > 70) bump(h, ui.day, h.target > 1 ? 1 : 1 - C.countOn(data, h.id, ui.day));
    else if (g.dx < -70) bump(h, ui.day, -1);
  }
  window.addEventListener("pointerup", endGesture);
  window.addEventListener("pointercancel", endGesture);
  // Right-click on the Mac opens the same menu.
  app.addEventListener("contextmenu", (ev) => {
    const row = ev.target.closest(".habit-row, .habit-card:not(.add-card), .side-habit");
    if (widgetMode) { ev.preventDefault(); desktop.widgetMenu(); return; }
    if (!row || !row.dataset.id || trayMode) return;
    ev.preventDefault();
    if (gesture) { clearTimeout(gesture.timer); gesture = null; }
    openMenu(row.dataset.id, ev.clientX, ev.clientY);
  });

  document.addEventListener("keydown", (ev) => {
    const typing = /input|textarea/i.test(ev.target.tagName);
    if (ev.key === "Escape") {
      if (ui.menu) ui.menu = null;
      else if (ui.confirm) ui.confirm = null;
      else if (ui.celebrate) ui.celebrate = null;
      else if (ui.sheet) ui.sheet = null;
      else if (ui.editMode) ui.editMode = false;
      else if (ui.detail) ui.detail = null;
      render();
      return;
    }
    if (typing || ui.sheet || ui.confirm || ui.menu || compact || data.welcome) return;
    if ((ev.metaKey || ev.ctrlKey) && ev.key.toLowerCase() === "n") { ev.preventDefault(); onAction({ dataset: { action: "add" } }); return; }
    if ((ev.metaKey || ev.ctrlKey) && ev.key.toLowerCase() === "z" && ui.undo) { ev.preventDefault(); undoDelete(); return; }
    if (ev.metaKey || ev.ctrlKey || ev.altKey) return;
    if ((ev.key === "Backspace" || ev.key === "Delete") && ui.detail && isWide()) { deleteHabit(ui.detail); return; }
    if (ui.tab === "today" && ev.key === "ArrowLeft") { ui.day = C.addDays(ui.day, -1); render(); }
    else if (ui.tab === "today" && ev.key === "ArrowRight" && ui.day < todayKey()) { ui.day = C.addDays(ui.day, 1); render(); }
    else if (ev.key === "t") { ui.day = todayKey(); go("today"); }
    else if (/^[1-4]$/.test(ev.key)) go(TABS[+ev.key - 1][0]);
  });

  wideQuery.addEventListener("change", render);
  const markScrolled = () => document.documentElement.classList.toggle("scrolled", window.scrollY > 6);
  window.addEventListener("scroll", markScrolled, { passive: true });
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", applyTheme);

  // Roll over to the new day at midnight, and keep the sun moving.
  function checkDay() {
    const t = todayKey();
    if (checkDay.last && checkDay.last !== t && ui.day === checkDay.last) ui.day = t;
    checkDay.last = t;
  }
  setInterval(() => {
    checkDay();
    if (!ui.sheet && !ui.menu && !gesture && !document.hidden && ui.tab === "today") render();
  }, 60000);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) return;
    checkDay();
    render();
    // Habits may have been checked off on the home screen widget while the app was away;
    // then the Mac gets a turn to sync.
    if (homeWidget && !ui.sheet) {
      Store.load().then((saved) => { const v = saved && C.validate(saved); if (v && !ui.sheet) { data = normalize(v); render(); } }).then(() => syncNow(false));
    }
  });

  // Phone: opening the pairing link from the Mac's QR code (camera app or browser).
  if (native) {
    capacitorApp.App.addListener("appUrlOpen", (ev) => pairFromUrl(ev.url));
  }
  // Mac: the sync server hands the phone's data to a window, which joins it with its own,
  // saves, and returns the result for the phone (see electron/main.js).
  let markReady;
  const ready = new Promise((resolve) => { markReady = resolve; });
  if (desktop) {
    window.rojMerge = async (json) => {
      await ready;
      const v = C.validate(JSON.parse(json));
      if (!v) throw new Error("not Roj Habit data");
      data = normalize(C.merge(data, v));
      delete data.welcome;
      Store.save(data, true);
      if (!ui.sheet && !ui.menu) render();
      return JSON.parse(JSON.stringify(data));
    };
  }

  // The desktop widget changes size by changing its address.
  if (widgetMode) window.addEventListener("hashchange", () => location.reload());

  // Another window (the Mac menu bar panel) changed the data.
  window.addEventListener("storage", (ev) => {
    if (ev.key !== STORE_KEY || !ev.newValue) return;
    try { const v = C.validate(JSON.parse(ev.newValue)); if (v) { data = normalize(v); render(); } } catch (e) { /* ignore a half-written value */ }
  });

  if (native) {
    capacitorApp.App.addListener("backButton", () => {
      if (ui.menu) ui.menu = null;
      else if (ui.confirm) ui.confirm = null;
      else if (ui.celebrate) ui.celebrate = null;
      else if (ui.sheet) ui.sheet = null;
      else if (ui.editMode) ui.editMode = false;
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
      else if (cmd === "widget-on" || cmd === "widget-off") { ui.deskWidget = cmd === "widget-on"; render(); }
      else if (cmd === "sync-changed" && desktop.syncInfo) desktop.syncInfo().then((info) => { ui.syncInfo = info; if (ui.tab === "settings") render(); });
    });
  }

  // ---------- sample data ----------
  // Realistic examples with ~10 weeks of history, so every screen has something to show.
  function sampleData(theme) {
    const s = C.emptyState();
    s.settings.theme = theme || "system";
    const today = todayKey();
    const start = C.addDays(today, -74);
    const H = (id, name, icon, color, time, schedule, target, unit, p) => ({ id, name, icon, color, time, schedule, target, unit, created: start, p });
    const list = [
      H("s1", "Sleep 7½ hours", "moon", "iris", "morning", { type: "daily" }, 1, "", 0.8),
      H("s2", "Stretch 10 min", "person-standing", "sage", "morning", { type: "days", days: [1, 2, 3, 4, 5] }, 1, "", 0.85),
      H("s3", "Walk 8,000 steps", "footprints", "teal", "afternoon", { type: "daily" }, 1, "", 0.7),
      H("s4", "Run", "activity", "amber", "afternoon", { type: "weekly", times: 3 }, 1, "", 0.45),
      H("s5", "Read 10 pages", "book-open", "clay", "evening", { type: "daily" }, 1, "", 0.92),
      H("s6", "Journal", "notebook-pen", "rose", "evening", { type: "days", days: [0, 3] }, 1, "", 0.6),
      H("s7", "Drink water", "droplet", "sky", "anytime", { type: "daily" }, 8, "glasses", 0.8)
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
    // Today, partly done.
    ["s1", "s2"].forEach((id) => { if (C.isScheduled(list.find((h) => h.id === id), today)) C.setCount(s, id, today, 1); });
    C.setCount(s, "s7", today, 5);
    s.habits = list.map((h) => { const c = Object.assign({}, h); delete c.p; return c; });
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
    if (desktop && desktop.widgetState) ui.deskWidget = await desktop.widgetState();
    if (desktop && desktop.syncInfo) ui.syncInfo = await desktop.syncInfo();
    await loadPair();
    checkDay();
    render();
    document.documentElement.classList.add("ready");
    markReady();
    if (native) {
      const launch = await capacitorApp.App.getLaunchUrl().catch(() => null);
      if (launch && launch.url) pairFromUrl(launch.url);
      else syncNow(false);
    }
  })();
})();
