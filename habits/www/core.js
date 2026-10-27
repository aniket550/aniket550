// Habit logic with no DOM: dates, schedules, streaks and completion rates.
// Loaded by the app as window.HabitCore and by the Node tests via require().
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.HabitCore = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // ---------- dates ----------
  // Keys are local calendar dates ("2026-10-27"). toISOString() is UTC, which in
  // India gives yesterday's date before 5:30 am, so we build keys by hand.
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function dateKey(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function parseKey(key) {
    const [y, m, d] = key.split("-").map(Number);
    return new Date(y, m - 1, d, 12); // noon: safe from DST edge shifts
  }
  function addDays(key, n) {
    const d = parseKey(key);
    d.setDate(d.getDate() + n);
    return dateKey(d);
  }
  function dayOfWeek(key) { return parseKey(key).getDay(); } // 0 = Sunday
  // Weeks start on Monday.
  function weekStart(key) { return addDays(key, -((dayOfWeek(key) + 6) % 7)); }
  function maxKey(a, b) { return a > b ? a : b; }

  // ---------- schedule ----------
  // schedule.type: "daily" | "days" (days: [0..6], 0 = Sunday) | "weekly" (times: N per week)
  function isScheduled(habit, key) {
    if (key < habit.created) return false;
    const s = habit.schedule;
    if (s.type === "days") return s.days.indexOf(dayOfWeek(key)) !== -1;
    return true; // daily, and weekly habits can be done on any day
  }

  function countOn(state, habitId, key) {
    const day = state.log[key];
    return (day && day[habitId]) || 0;
  }
  function isDone(state, habit, key) { return countOn(state, habit.id, key) >= habit.target; }

  function weekDoneDays(state, habit, start) {
    let n = 0;
    for (let i = 0; i < 7; i++) {
      const k = addDays(start, i);
      if (k >= habit.created && isDone(state, habit, k)) n++;
    }
    return n;
  }

  // ---------- streaks ----------
  // Counts only scheduled days (or weeks for weekly habits). An unfinished today
  // does not break the streak, because the day is not over yet.
  function streak(state, habit, today) {
    if (habit.schedule.type === "weekly") return weeklyStreak(state, habit, today);
    let best = 0, run = 0;
    for (let k = habit.created; k <= today; k = addDays(k, 1)) {
      if (!isScheduled(habit, k)) continue;
      if (isDone(state, habit, k)) { run++; if (run > best) best = run; }
      else if (k !== today) run = 0;
    }
    return { current: run, best: best, unit: "day" };
  }

  function weeklyStreak(state, habit, today) {
    const need = habit.schedule.times;
    const thisWeek = weekStart(today);
    let best = 0, run = 0;
    for (let w = weekStart(habit.created); w <= thisWeek; w = addDays(w, 7)) {
      if (weekDoneDays(state, habit, w) >= need) { run++; if (run > best) best = run; }
      else if (w !== thisWeek) run = 0;
    }
    return { current: run, best: best, unit: "week" };
  }

  // ---------- completion rate ----------
  // Share of what was due in [from, to] that got done. Today (or this week)
  // only counts once it is finished, so an unfinished day never drags it down.
  function rate(state, habit, from, to, today) {
    today = today || to;
    let done = 0, due = 0;
    if (habit.schedule.type === "weekly") {
      const need = habit.schedule.times;
      const thisWeek = weekStart(today);
      for (let w = weekStart(maxKey(from, habit.created)); w <= weekStart(to); w = addDays(w, 7)) {
        const got = Math.min(weekDoneDays(state, habit, w), need);
        done += got;
        due += (w === thisWeek && got < need) ? got : need;
      }
    } else {
      for (let k = maxKey(from, habit.created); k <= to; k = addDays(k, 1)) {
        if (!isScheduled(habit, k)) continue;
        const ok = isDone(state, habit, k);
        if (ok) done++;
        if (ok || k !== today) due++;
      }
    }
    return { done: done, due: due, pct: due ? Math.round((done / due) * 100) : null };
  }

  // All habits together, one value per week (oldest first), for the Stats chart.
  function weeklyOverall(state, today, weeks) {
    const out = [];
    const thisWeek = weekStart(today);
    for (let i = weeks - 1; i >= 0; i--) {
      const start = addDays(thisWeek, -7 * i);
      const end = i === 0 ? today : addDays(start, 6);
      let done = 0, due = 0;
      state.habits.forEach(function (h) {
        if (h.created > end) return;
        const r = rate(state, h, start, end, today);
        done += r.done; due += r.due;
      });
      out.push({ start: start, pct: due ? Math.round((done / due) * 100) : null });
    }
    return out;
  }

  // ---------- today list ----------
  // Habits due on `key`, with progress. Weekly habits always show, with the week's count.
  function dayItems(state, key) {
    return state.habits.filter(function (h) { return isScheduled(h, key); }).map(function (h) {
      const count = countOn(state, h.id, key);
      const item = { habit: h, count: count, done: count >= h.target };
      if (h.schedule.type === "weekly") item.weekDone = weekDoneDays(state, h, weekStart(key));
      return item;
    });
  }

  // 0 = nothing, 1..4 = how much of the day's target got done (heatmap shade).
  function heatLevel(state, habit, key) {
    const c = countOn(state, habit.id, key);
    if (!c) return 0;
    return Math.max(1, Math.min(4, Math.ceil((c / habit.target) * 4)));
  }

  // ---------- changes ----------
  function setCount(state, habitId, key, count) {
    const day = state.log[key] || (state.log[key] = {});
    if (count > 0) day[habitId] = count;
    else delete day[habitId];
    if (!Object.keys(day).length) delete state.log[key];
  }

  function removeHabit(state, habitId) {
    state.habits = state.habits.filter(function (h) { return h.id !== habitId; });
    Object.keys(state.log).forEach(function (k) { setCount(state, habitId, k, 0); });
  }

  function emptyState() { return { version: 1, habits: [], log: {}, settings: { theme: "system" } }; }

  // Backup files come from outside the app, so check the shape before trusting one.
  function validate(data) {
    if (!data || typeof data !== "object" || !Array.isArray(data.habits) || typeof data.log !== "object" || !data.log) return null;
    const keyRe = /^\d{4}-\d{2}-\d{2}$/;
    const habits = data.habits.filter(function (h) {
      return h && typeof h.id === "string" && typeof h.name === "string" && keyRe.test(h.created) &&
        h.target >= 1 && h.schedule && ["daily", "days", "weekly"].indexOf(h.schedule.type) !== -1 &&
        (h.schedule.type !== "days" || (Array.isArray(h.schedule.days) && h.schedule.days.length > 0)) &&
        (h.schedule.type !== "weekly" || h.schedule.times >= 1);
    });
    const log = {};
    Object.keys(data.log).forEach(function (k) {
      const day = data.log[k];
      if (!keyRe.test(k) || !day || typeof day !== "object") return;
      Object.keys(day).forEach(function (id) {
        const n = Math.floor(Number(day[id]));
        if (n > 0) (log[k] || (log[k] = {}))[id] = n;
      });
    });
    const out = emptyState();
    out.habits = habits;
    out.log = log;
    if (data.settings && ["system", "light", "dark"].indexOf(data.settings.theme) !== -1) out.settings.theme = data.settings.theme;
    if (data.settings && data.settings.swipeTip === true) out.settings.swipeTip = true;
    return out;
  }

  return {
    dateKey, parseKey, addDays, dayOfWeek, weekStart,
    isScheduled, countOn, isDone, weekDoneDays,
    streak, rate, weeklyOverall, dayItems, heatLevel,
    setCount, removeHabit, emptyState, validate
  };
});
