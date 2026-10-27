const test = require("node:test");
const assert = require("node:assert/strict");
const C = require("../www/core.js");

// 2026-10-26 is a Monday.
function state(habits, done) {
  const s = C.emptyState();
  s.habits = habits;
  (done || []).forEach(function ([key, id, n]) { C.setCount(s, id, key, n == null ? 1 : n); });
  return s;
}
const daily = { id: "d", name: "Read", target: 1, created: "2026-10-01", schedule: { type: "daily" } };

test("date keys are local and weeks start on Monday", () => {
  assert.equal(C.addDays("2026-10-31", 1), "2026-11-01");
  assert.equal(C.addDays("2026-03-01", -1), "2026-02-28");
  assert.equal(C.dayOfWeek("2026-10-26"), 1);
  assert.equal(C.weekStart("2026-11-01"), "2026-10-26"); // Sunday belongs to the week before
  assert.equal(C.weekStart("2026-10-26"), "2026-10-26");
});

test("daily streak: unfinished today keeps the streak, a missed day breaks it", () => {
  const s = state([daily], [["2026-10-20", "d"], ["2026-10-22", "d"], ["2026-10-23", "d"], ["2026-10-24", "d"]]);
  assert.deepEqual(C.streak(s, daily, "2026-10-25"), { current: 3, best: 3, unit: "day" });
  C.setCount(s, "d", "2026-10-25", 1);
  assert.equal(C.streak(s, daily, "2026-10-26").current, 4); // today not done yet
  assert.equal(C.streak(s, daily, "2026-10-27").current, 0); // 26th was missed
  assert.equal(C.streak(s, daily, "2026-10-27").best, 4);
});

test("specific-day streak skips days that are not on the schedule", () => {
  const h = { id: "m", name: "Gym", target: 1, created: "2026-10-01", schedule: { type: "days", days: [1, 3, 5] } };
  // Mon 19, Wed 21, Fri 23, Mon 26: nothing on the days between
  const s = state([h], [["2026-10-19", "m"], ["2026-10-21", "m"], ["2026-10-23", "m"], ["2026-10-26", "m"]]);
  assert.equal(C.streak(s, h, "2026-10-27").current, 4);
  assert.equal(C.isScheduled(h, "2026-10-27"), false);
});

test("count habits are done only at the target", () => {
  const h = { id: "w", name: "Paani", target: 8, created: "2026-10-01", schedule: { type: "daily" } };
  const s = state([h], [["2026-10-26", "w", 5]]);
  assert.equal(C.isDone(s, h, "2026-10-26"), false);
  assert.equal(C.heatLevel(s, h, "2026-10-26"), 3);
  C.setCount(s, "w", "2026-10-26", 8);
  assert.equal(C.isDone(s, h, "2026-10-26"), true);
  assert.equal(C.heatLevel(s, h, "2026-10-26"), 4);
  C.setCount(s, "w", "2026-10-26", 0);
  assert.deepEqual(s.log, {});
});

test("weekly habit: streak in weeks, current week may still be in progress", () => {
  const h = { id: "r", name: "Run", target: 1, created: "2026-10-05", schedule: { type: "weekly", times: 2 } };
  const s = state([h], [
    ["2026-10-06", "r"], ["2026-10-09", "r"],  // week of 5th: 2 ✓
    ["2026-10-13", "r"], ["2026-10-18", "r"],  // week of 12th: 2 ✓
    ["2026-10-20", "r"], ["2026-10-21", "r"],  // week of 19th: 2 ✓
    ["2026-10-27", "r"]                        // this week: 1 of 2 so far
  ]);
  assert.deepEqual(C.streak(s, h, "2026-10-27"), { current: 3, best: 3, unit: "week" });
  const r = C.rate(s, h, "2026-10-01", "2026-10-27");
  assert.deepEqual(r, { done: 7, due: 7, pct: 100 }); // unfinished week only counts what's done
});

test("rate ignores days before the habit existed and an unfinished today", () => {
  const h = Object.assign({}, daily, { created: "2026-10-24" });
  const s = state([h], [["2026-10-24", "d"], ["2026-10-26", "d"]]);
  assert.deepEqual(C.rate(s, h, "2026-10-01", "2026-10-27"), { done: 2, due: 3, pct: 67 });
  assert.equal(C.rate(state([h]), h, "2026-10-24", "2026-10-24").pct, null);
});

test("weeklyOverall combines habits per week", () => {
  const h = Object.assign({}, daily, { created: "2026-10-19" });
  const s = state([h], [["2026-10-19", "d"], ["2026-10-20", "d"], ["2026-10-26", "d"]]);
  const w = C.weeklyOverall(s, "2026-10-27", 3);
  assert.deepEqual(w.map((x) => x.pct), [null, 29, 100]); // 2 of 7, then 1 of 1 (today pending)
});

test("dayItems lists only habits due that day", () => {
  const gym = { id: "m", name: "Gym", target: 1, created: "2026-10-01", schedule: { type: "days", days: [1] } };
  const s = state([daily, gym], [["2026-10-26", "m"]]);
  assert.deepEqual(C.dayItems(s, "2026-10-26").map((i) => [i.habit.id, i.done]), [["d", false], ["m", true]]);
  assert.deepEqual(C.dayItems(s, "2026-10-27").map((i) => i.habit.id), ["d"]);
});

test("removeHabit clears its log entries", () => {
  const s = state([daily], [["2026-10-26", "d"]]);
  C.removeHabit(s, "d");
  assert.deepEqual(s, C.emptyState());
});

test("validate rejects junk and keeps good parts of a backup", () => {
  assert.equal(C.validate(null), null);
  assert.equal(C.validate({ habits: "x", log: {} }), null);
  const out = C.validate({
    habits: [daily, { id: "bad", name: "x", target: 0, created: "2026-10-01", schedule: { type: "daily" } }],
    log: { "2026-10-26": { d: 2, z: -1 }, "nope": { d: 1 } },
    settings: { theme: "dark", swipeTip: true, junk: 1 }
  });
  assert.deepEqual(out.habits.map((h) => h.id), ["d"]);
  assert.deepEqual(out.log, { "2026-10-26": { d: 2 } });
  assert.equal(out.settings.theme, "dark");
  assert.deepEqual(out.settings, { theme: "dark", swipeTip: true });
});
