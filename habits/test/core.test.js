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

test("daily streak: unfinished today keeps it, one miss is forgiven, two in a row end it", () => {
  const s = state([daily], [["2026-10-20", "d"], ["2026-10-22", "d"], ["2026-10-23", "d"], ["2026-10-24", "d"]]);
  // the 21st was missed once: the run goes on (20, 22, 23, 24)
  assert.deepEqual(C.streak(s, daily, "2026-10-25"), { current: 4, best: 4, unit: "day", atRisk: false });
  C.setCount(s, "d", "2026-10-25", 1);
  assert.equal(C.streak(s, daily, "2026-10-26").current, 5); // today not done yet
  const after = C.streak(s, daily, "2026-10-27"); // the 26th was missed: still 5, but at risk
  assert.equal(after.current, 5);
  assert.equal(after.atRisk, true);
  assert.equal(C.streak(s, daily, "2026-10-28").current, 0); // the 27th missed too: two in a row
  assert.equal(C.streak(s, daily, "2026-10-28").best, 5);
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

test("removeHabit clears its log entries and leaves a deletion note", () => {
  const s = state([daily], [["2026-10-26", "d"]]);
  C.removeHabit(s, "d", 5);
  assert.deepEqual(s, Object.assign(C.emptyState(), { deleted: { d: 5 } }));
});

test("once: due on its one day only, and kept by validate", () => {
  const once = { id: "o", name: "Call the bank", target: 1, created: "2026-10-26", schedule: { type: "once", date: "2026-10-27" } };
  assert.equal(C.isScheduled(once, "2026-10-26"), false);
  assert.equal(C.isScheduled(once, "2026-10-27"), true);
  assert.equal(C.isScheduled(once, "2026-10-28"), false);
  const s = state([once]);
  assert.deepEqual(C.dayItems(s, "2026-10-27").map((i) => i.habit.id), ["o"]);
  assert.equal(C.validate({ habits: [once], log: {} }).habits.length, 1);
  assert.equal(C.validate({ habits: [Object.assign({}, once, { schedule: { type: "once" } })], log: {} }).habits.length, 0);
});

test("skip: a skipped day neither breaks the streak nor counts as missed", () => {
  const s = state([daily], [["2026-10-20", "d"], ["2026-10-23", "d"]]);
  C.setSkip(s, "d", "2026-10-21", true);
  C.setSkip(s, "d", "2026-10-22", true);
  assert.equal(C.streak(s, daily, "2026-10-24").current, 2);
  assert.equal(C.rate(s, daily, "2026-10-20", "2026-10-23").pct, 100);
  assert.equal(C.dayItems(s, "2026-10-21")[0].skipped, true);
  C.setCount(s, "d", "2026-10-21", 1); // checking it off takes the skip away
  assert.equal(C.isSkipped(s, "d", "2026-10-21"), false);
  C.setSkip(s, "d", "2026-10-22", false);
  assert.equal(C.isSkipped(s, "d", "2026-10-22"), false);
});

test("archive: not due from its day on, history kept", () => {
  const h = Object.assign({}, daily, { archivedOn: "2026-10-25" });
  assert.equal(C.isScheduled(h, "2026-10-24"), true);
  assert.equal(C.isScheduled(h, "2026-10-25"), false);
  assert.equal(C.validate({ habits: [h], log: {} }).habits[0].archivedOn, "2026-10-25");
});

test("quit: never due, counts clean days since the last slip", () => {
  const quit = { id: "q", name: "No smoking", kind: "quit", target: 1, created: "2026-10-01", schedule: { type: "daily" } };
  const s = state([quit]);
  assert.equal(C.isScheduled(quit, "2026-10-05"), false);
  assert.deepEqual(C.dayItems(s, "2026-10-05"), []);
  assert.equal(C.cleanDays(s, quit, "2026-10-01").current, 0);
  assert.equal(C.cleanDays(s, quit, "2026-10-11").current, 10);
  C.setCount(s, "q", "2026-10-11", 1); // slipped on the 11th
  assert.deepEqual(C.cleanDays(s, quit, "2026-10-11"), { current: 0, best: 10, slips: 1, lastSlip: "2026-10-11" });
  assert.equal(C.cleanDays(s, quit, "2026-10-15").current, 3); // the 12th, 13th and 14th; the 15th is not over
  assert.equal(C.validate({ habits: [quit], log: {} }).habits.length, 1);
});

// ---------- sync ----------
const copy = (x) => JSON.parse(JSON.stringify(x));
const walk = { id: "w", name: "Walk", target: 1, created: "2026-10-01", schedule: { type: "daily" } };

test("merge: the later change to a day wins, either way round", () => {
  const phone = state([daily]);
  const mac = copy(phone);
  C.setCount(phone, "d", "2026-10-26", 1, 100); // checked on the phone
  C.setCount(mac, "d", "2026-10-26", 0, 200); // then unchecked on the Mac
  C.setCount(mac, "d", "2026-10-27", 1, 150);
  for (const out of [C.merge(phone, mac), C.merge(mac, phone)]) {
    assert.equal(C.countOn(out, "d", "2026-10-26"), 0);
    assert.equal(C.countOn(out, "d", "2026-10-27"), 1);
    assert.equal(out.stamps["2026-10-26|d"], 200);
  }
});

test("merge: habits from both sides, the later edit wins, local order first", () => {
  const phone = state([Object.assign({}, daily, { updated: 10 })]);
  const mac = state([Object.assign({}, daily, { name: "Read 10 pages", updated: 20 }), walk]);
  const out = C.merge(phone, mac);
  assert.deepEqual(out.habits.map((h) => h.id), ["d", "w"]);
  assert.equal(out.habits[0].name, "Read 10 pages");
  assert.equal(C.merge(mac, phone).habits[0].name, "Read 10 pages");
});

test("merge: a deleted habit stays deleted, unless it was edited after", () => {
  const phone = state([daily, walk], [["2026-10-26", "w"]]);
  const mac = copy(phone);
  C.removeHabit(phone, "w", 50);
  let out = C.merge(mac, phone);
  assert.deepEqual(out.habits.map((h) => h.id), ["d"]);
  assert.equal(C.countOn(out, "w", "2026-10-26"), 0);
  assert.equal(out.deleted.w, 50);
  mac.habits[1].updated = 60; // brought back (or edited) later on the Mac
  out = C.merge(phone, mac);
  assert.deepEqual(out.habits.map((h) => h.id), ["d", "w"]);
  assert.equal(out.deleted.w, undefined);
});

test("merge: old data without stamps keeps every check-in from both sides", () => {
  const a = { habits: [daily], log: { "2026-10-26": { d: 1 } }, settings: { theme: "dark" } };
  const b = { habits: [daily], log: { "2026-10-27": { d: 1 } }, settings: { theme: "light" } };
  const out = C.merge(C.validate(a), C.validate(b));
  assert.equal(C.countOn(out, "d", "2026-10-26"), 1);
  assert.equal(C.countOn(out, "d", "2026-10-27"), 1);
  assert.equal(out.settings.theme, "dark"); // settings stay with this device
});

test("merge: a skip travels like a count, the later change wins", () => {
  const phone = state([daily]);
  const mac = copy(phone);
  C.setSkip(phone, "d", "2026-10-26", true, 100);
  C.setCount(mac, "d", "2026-10-27", 1, 50);
  let out = C.merge(mac, phone);
  assert.equal(C.isSkipped(out, "d", "2026-10-26"), true);
  C.setCount(mac, "d", "2026-10-26", 1, 200); // later, done on the Mac
  out = C.merge(phone, mac);
  assert.equal(C.isSkipped(out, "d", "2026-10-26"), false);
  assert.equal(C.countOn(out, "d", "2026-10-26"), 1);
});

test("validate keeps sync stamps and deletion notes, and drops bad ones", () => {
  const out = C.validate({ habits: [], log: {}, stamps: { "2026-10-26|d": 5, junk: 3, "2026-10-27|d": "x" }, deleted: { w: 9, v: -1 } });
  assert.deepEqual(out.stamps, { "2026-10-26|d": 5 });
  assert.deepEqual(out.deleted, { w: 9 });
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
