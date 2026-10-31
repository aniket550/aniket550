package com.aniket.habits;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.RectF;
import android.graphics.Typeface;
import android.net.Uri;
import android.os.Bundle;
import android.text.SpannableStringBuilder;
import android.text.Spanned;
import android.text.style.ForegroundColorSpan;
import android.view.View;
import android.widget.RemoteViews;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Locale;
import org.json.JSONArray;
import org.json.JSONObject;

// Home screen widget: today's ring, the headline and the habits, each checked off with a tap.
// It reads and writes the app's saved state (Capacitor Preferences keeps it in the
// "CapacitorStorage" shared preferences) and follows the same rules as www/core.js:
// local date keys, weeks from Monday, "some days" habits only on their days, and weekly
// habits counted as met once the week's goal is reached.
public class RojWidget extends AppWidgetProvider {

    static final String PREFS = "CapacitorStorage";
    static final String KEY = "rojhabit.state.v1";
    static final String ACTION_TOGGLE = "com.aniket.habits.widget.TOGGLE";
    static final String ACTION_REFRESH = "com.aniket.habits.widget.REFRESH";
    static final String[] TIMES = { "morning", "afternoon", "evening", "anytime" };

    static final int[] ROWS = { R.id.w_row0, R.id.w_row1, R.id.w_row2, R.id.w_row3, R.id.w_row4, R.id.w_row5 };
    static final int[] BUBBLES = { R.id.w_b0, R.id.w_b1, R.id.w_b2, R.id.w_b3, R.id.w_b4, R.id.w_b5 };
    static final int[] NAMES = { R.id.w_n0, R.id.w_n1, R.id.w_n2, R.id.w_n3, R.id.w_n4, R.id.w_n5 };
    static final int[] METAS = { R.id.w_m0, R.id.w_m1, R.id.w_m2, R.id.w_m3, R.id.w_m4, R.id.w_m5 };

    static class Item {
        String id, name, time, meta;
        int color, count, target;
        boolean satisfied;
        float frac;
    }

    @Override
    public void onUpdate(Context c, AppWidgetManager mgr, int[] ids) {
        for (int id : ids) draw(c, mgr, id);
        scheduleMidnight(c);
    }

    @Override
    public void onAppWidgetOptionsChanged(Context c, AppWidgetManager mgr, int id, Bundle options) {
        draw(c, mgr, id);
    }

    @Override
    public void onDisabled(Context c) {
        AlarmManager am = c.getSystemService(AlarmManager.class);
        if (am != null) am.cancel(refreshIntent(c));
    }

    @Override
    public void onReceive(Context c, Intent intent) {
        super.onReceive(c, intent);
        String action = intent.getAction();
        if (ACTION_TOGGLE.equals(action)) {
            Uri u = intent.getData();
            if (u != null && u.getLastPathSegment() != null) toggle(c, u.getLastPathSegment());
            updateAll(c);
        } else if (ACTION_REFRESH.equals(action) || Intent.ACTION_TIME_CHANGED.equals(action) || Intent.ACTION_TIMEZONE_CHANGED.equals(action)) {
            updateAll(c);
        }
    }

    static void updateAll(Context c) {
        AppWidgetManager mgr = AppWidgetManager.getInstance(c);
        int[] ids = mgr.getAppWidgetIds(new ComponentName(c, RojWidget.class));
        for (int id : ids) draw(c, mgr, id);
        if (ids.length > 0) scheduleMidnight(c);
    }

    // ---------- data ----------
    static JSONObject load(Context c) {
        String raw = c.getSharedPreferences(PREFS, Context.MODE_PRIVATE).getString(KEY, null);
        if (raw == null) return null;
        try {
            return new JSONObject(raw);
        } catch (Exception e) {
            return null;
        }
    }

    static String dateKey(Calendar cal) {
        return String.format(Locale.US, "%04d-%02d-%02d", cal.get(Calendar.YEAR), cal.get(Calendar.MONTH) + 1, cal.get(Calendar.DAY_OF_MONTH));
    }

    static int countOn(JSONObject log, String key, String id) {
        JSONObject day = log == null ? null : log.optJSONObject(key);
        return day == null ? 0 : day.optInt(id, 0);
    }

    static int timeIndex(String time) {
        for (int i = 0; i < TIMES.length; i++) if (TIMES[i].equals(time)) return i;
        return TIMES.length - 1;
    }

    static int colorOf(String id) {
        switch (id == null ? "" : id) {
            case "clay": return 0xFFC2704B;
            case "sage": return 0xFF5C8D69;
            case "iris": return 0xFF7F72BE;
            case "amber": return 0xFFBC8A35;
            case "rose": return 0xFFBF6E86;
            case "teal": return 0xFF3F8F8C;
            case "slate": return 0xFF626875;
            default: return 0xFF4C84BC;
        }
    }

    // Habits due today, open ones first, each group in the order of the day.
    static List<Item> items(JSONObject state, Calendar now) {
        List<Item> out = new ArrayList<>();
        JSONArray habits = state == null ? null : state.optJSONArray("habits");
        if (habits == null) return out;
        JSONObject log = state.optJSONObject("log");
        String today = dateKey(now);
        int dow = now.get(Calendar.DAY_OF_WEEK) - 1; // 0 = Sunday, as in core.js
        Calendar monday = (Calendar) now.clone();
        monday.add(Calendar.DAY_OF_MONTH, -((dow + 6) % 7));
        String[] week = new String[7];
        for (int i = 0; i < 7; i++) {
            week[i] = dateKey(monday);
            monday.add(Calendar.DAY_OF_MONTH, 1);
        }
        for (int i = 0; i < habits.length(); i++) {
            JSONObject h = habits.optJSONObject(i);
            if (h == null) continue;
            String created = h.optString("created", "");
            if (today.compareTo(created) < 0) continue;
            JSONObject s = h.optJSONObject("schedule");
            String type = s == null ? "daily" : s.optString("type", "daily");
            if ("days".equals(type)) {
                JSONArray days = s.optJSONArray("days");
                boolean due = false;
                for (int j = 0; days != null && j < days.length(); j++) if (days.optInt(j, -1) == dow) due = true;
                if (!due) continue;
            }
            Item it = new Item();
            it.id = h.optString("id");
            it.name = h.optString("name");
            it.time = h.optString("time", "anytime");
            it.color = colorOf(h.optString("color"));
            it.target = Math.max(1, h.optInt("target", 1));
            it.count = countOn(log, today, it.id);
            it.satisfied = it.count >= it.target;
            if ("weekly".equals(type)) {
                int times = Math.max(1, s.optInt("times", 1));
                int got = 0;
                for (String k : week) if (k.compareTo(created) >= 0 && countOn(log, k, it.id) >= it.target) got++;
                if (got >= times) it.satisfied = true;
                it.meta = Math.min(got, times) + "/" + times + " wk";
            }
            if (it.target > 1) it.meta = it.count + "/" + it.target;
            it.frac = it.satisfied ? 1f : Math.min(1f, it.count / (float) it.target);
            out.add(it);
        }
        out.sort((a, b) -> ((a.satisfied ? 10 : 0) + timeIndex(a.time)) - ((b.satisfied ? 10 : 0) + timeIndex(b.time)));
        return out;
    }

    // Same rule as the app's check button: add one until the goal, then back to zero.
    static void toggle(Context c, String id) {
        JSONObject state = load(c);
        if (state == null) return;
        try {
            JSONArray habits = state.optJSONArray("habits");
            int target = 0;
            for (int i = 0; habits != null && i < habits.length(); i++) {
                JSONObject h = habits.optJSONObject(i);
                if (h != null && id.equals(h.optString("id"))) target = Math.max(1, h.optInt("target", 1));
            }
            if (target == 0) return;
            String today = dateKey(Calendar.getInstance());
            JSONObject log = state.optJSONObject("log");
            if (log == null) {
                log = new JSONObject();
                state.put("log", log);
            }
            JSONObject day = log.optJSONObject(today);
            if (day == null) day = new JSONObject();
            int n = day.optInt(id, 0);
            int next = n >= target ? 0 : n + 1;
            if (next > 0) day.put(id, next);
            else day.remove(id);
            if (day.length() > 0) log.put(today, day);
            else log.remove(today);
            // stamp the change like core.js setCount does, so sync with the Mac keeps the newest
            JSONObject stamps = state.optJSONObject("stamps");
            if (stamps == null) {
                stamps = new JSONObject();
                state.put("stamps", stamps);
            }
            stamps.put(today + "|" + id, System.currentTimeMillis());
            SharedPreferences.Editor ed = c.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit();
            ed.putString(KEY, state.toString()).apply();
        } catch (Exception e) {
            // leave the saved state as it was
        }
    }

    // ---------- drawing ----------
    // Three layouts, picked by size like Apple's widget families: small is one glance and one tap
    // (opens the app); medium puts the ring beside a checklist; large has the count on top, the
    // checklist, and this week at the bottom when there is room. Checklist rows share the height
    // in even slots, and a tap anywhere on a row checks that habit off.
    static void draw(Context c, AppWidgetManager mgr, int widgetId) {
        Bundle o = mgr.getAppWidgetOptions(widgetId);
        int w = o.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_WIDTH, 0);
        int h = o.getInt(AppWidgetManager.OPTION_APPWIDGET_MAX_HEIGHT, 0);
        if (w <= 0) w = 250;
        if (h <= 0) h = 180;
        JSONObject state = load(c);
        Calendar now = Calendar.getInstance();
        List<Item> items = items(state, now);
        int total = items.size(), done = 0;
        for (Item it : items) if (it.satisfied) done++;
        boolean small = w < 200;
        boolean medium = !small && h < 200;
        String date = new SimpleDateFormat(medium ? "EEE d MMM" : "EEEE d MMM", Locale.ENGLISH).format(now.getTime()).toUpperCase(Locale.ENGLISH);

        if (small) {
            RemoteViews v = new RemoteViews(c.getPackageName(), R.layout.widget_small);
            v.setOnClickPendingIntent(android.R.id.background, openApp(c));
            v.setImageViewBitmap(R.id.w_ring, ring(c, items, done, 58));
            v.setTextViewText(R.id.w_title, headline(c, state, done, total));
            Item next = null;
            for (Item it : items) if (!it.satisfied && next == null) next = it;
            v.setTextViewText(R.id.w_next, next != null ? "Next: " + next.name : total > 0 ? "Every habit checked" : date);
            mgr.updateAppWidget(widgetId, v);
            return;
        }

        RemoteViews v = new RemoteViews(c.getPackageName(), medium ? R.layout.widget_medium : R.layout.widget_today);
        v.setOnClickPendingIntent(R.id.w_open, openApp(c));
        v.setImageViewBitmap(R.id.w_ring, ring(c, items, done, medium ? 64 : 52));
        v.setTextViewText(R.id.w_title, headline(c, state, done, total));
        v.setTextViewText(R.id.w_date, date);

        // Height left for the checklist, cut into slots of at least 40dp (36dp in medium).
        int avail = medium ? h - 28 : h - 32 - 56 - 8;
        int slots = Math.max(1, Math.min(ROWS.length, avail / (medium ? 36 : 40)));
        // With two or more slots to spare, the large widget shows this week instead.
        boolean week = !medium && total > 0 && total + 2 <= slots;
        if (week) slots -= 2;
        // A few habits spread over the space (rows up to 64dp tall) instead of leaving a gap at the bottom.
        int listDp = week ? avail - 52 : avail;
        if (total > 0 && total < slots && listDp / total <= 64) slots = total;
        boolean more = total > slots;
        int shown = more ? slots - 1 : total;
        for (int i = 0; i < ROWS.length; i++) {
            if (i < shown) {
                Item it = items.get(i);
                v.setViewVisibility(ROWS[i], View.VISIBLE);
                v.setImageViewBitmap(BUBBLES[i], bubble(c, it, 22));
                v.setTextViewText(NAMES[i], it.name);
                v.setTextColor(NAMES[i], c.getColor(it.satisfied ? R.color.widget_secondary : R.color.widget_ink));
                v.setTextViewText(METAS[i], it.meta == null ? "" : it.meta);
                v.setViewVisibility(METAS[i], it.meta == null ? View.GONE : View.VISIBLE);
                v.setOnClickPendingIntent(ROWS[i], toggleIntent(c, it.id));
                v.setContentDescription(ROWS[i], (it.satisfied ? "Undo " : "Check off ") + it.name);
            } else {
                // Empty slots keep their share of the height so rows stay the same size.
                v.setViewVisibility(ROWS[i], i < slots ? View.INVISIBLE : View.GONE);
            }
        }
        v.setViewVisibility(R.id.w_more, more ? View.VISIBLE : View.GONE);
        if (more) {
            v.setTextViewText(R.id.w_more, "+" + (total - shown) + " more");
            v.setOnClickPendingIntent(R.id.w_more, openApp(c));
        }
        v.setViewVisibility(R.id.w_list, total > 0 ? View.VISIBLE : View.GONE);
        v.setViewVisibility(R.id.w_empty, total > 0 ? View.GONE : View.VISIBLE);
        if (total == 0) {
            JSONArray habits = state == null ? null : state.optJSONArray("habits");
            v.setTextViewText(R.id.w_empty, habits == null || habits.length() == 0 ? "Tap to add your first habit" : "Nothing planned today");
            v.setOnClickPendingIntent(R.id.w_empty, openApp(c));
        }
        if (!medium) {
            v.setViewVisibility(R.id.w_week, week ? View.VISIBLE : View.GONE);
            if (week) v.setImageViewBitmap(R.id.w_week, weekStrip(c, state, now, w - 32));
        }
        mgr.updateAppWidget(widgetId, v);
    }

    // Monday to Sunday: the day's letter and a dot. Full marigold dot = every habit done, ring = some,
    // faint ring = none, faint dot = still to come. Today's letter is in marigold.
    static Bitmap weekStrip(Context c, JSONObject state, Calendar now, int widthDp) {
        float d = c.getResources().getDisplayMetrics().density;
        int wpx = Math.max(1, Math.round(widthDp * d)), hpx = Math.round(46 * d);
        Bitmap bmp = Bitmap.createBitmap(wpx, hpx, Bitmap.Config.ARGB_8888);
        Canvas cv = new Canvas(bmp);
        int accent = c.getColor(R.color.widget_accent), secondary = c.getColor(R.color.widget_secondary);
        Paint line = new Paint(Paint.ANTI_ALIAS_FLAG);
        line.setColor(alpha(secondary, 0.18f));
        line.setStrokeWidth(Math.max(1, d));
        cv.drawLine(0, d, wpx, d, line);
        Paint letter = new Paint(Paint.ANTI_ALIAS_FLAG);
        letter.setTextSize(11 * d);
        letter.setTextAlign(Paint.Align.CENTER);
        Paint dot = new Paint(Paint.ANTI_ALIAS_FLAG);
        String today = dateKey(now);
        int dow = now.get(Calendar.DAY_OF_WEEK) - 1;
        Calendar day = (Calendar) now.clone();
        day.add(Calendar.DAY_OF_MONTH, -((dow + 6) % 7));
        String[] names = { "M", "T", "W", "T", "F", "S", "S" };
        float col = wpx / 7f, r = 5 * d;
        for (int i = 0; i < 7; i++) {
            String k = dateKey(day);
            float cx = col * i + col / 2;
            boolean isToday = k.equals(today), future = k.compareTo(today) > 0;
            letter.setColor(isToday ? accent : secondary);
            letter.setTypeface(Typeface.create("sans-serif-medium", isToday ? Typeface.BOLD : Typeface.NORMAL));
            cv.drawText(names[i], cx, 20 * d, letter);
            float cy = 34 * d;
            dot.setStyle(Paint.Style.FILL);
            if (future) {
                dot.setColor(alpha(secondary, 0.18f));
                cv.drawCircle(cx, cy, r * 0.6f, dot);
            } else {
                List<Item> its = items(state, day);
                int got = 0;
                for (Item it : its) if (it.satisfied) got++;
                if (its.isEmpty()) {
                    dot.setColor(alpha(secondary, 0.25f));
                    cv.drawCircle(cx, cy, r * 0.45f, dot);
                } else if (got == its.size()) {
                    dot.setColor(accent);
                    cv.drawCircle(cx, cy, r, dot);
                } else {
                    dot.setStyle(Paint.Style.STROKE);
                    dot.setStrokeWidth(1.6f * d);
                    dot.setColor(got > 0 ? accent : alpha(secondary, 0.45f));
                    cv.drawCircle(cx, cy, r - 0.8f * d, dot);
                }
            }
            day.add(Calendar.DAY_OF_MONTH, 1);
        }
        return bmp;
    }

    // "2 of 5 done", with the done count in colour.
    static CharSequence headline(Context c, JSONObject state, int done, int total) {
        if (state == null) return "Small habits, every day";
        if (total == 0) return "Nothing today";
        if (done == total) return "All done";
        SpannableStringBuilder b = new SpannableStringBuilder();
        appendColored(b, String.valueOf(done), c.getColor(R.color.widget_accent_text));
        b.append(" of ").append(String.valueOf(total)).append(" done");
        return b;
    }

    static void appendColored(SpannableStringBuilder b, String text, int color) {
        int start = b.length();
        b.append(text);
        b.setSpan(new ForegroundColorSpan(color), start, b.length(), Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
    }

    static int alpha(int color, float a) {
        return Color.argb(Math.round(255 * a), Color.red(color), Color.green(color), Color.blue(color));
    }

    // One piece of ring per habit, filling in marigold as it gets done, with the percent inside.
    static Bitmap ring(Context c, List<Item> items, int done, int sizeDp) {
        float d = c.getResources().getDisplayMetrics().density;
        int px = Math.round(sizeDp * d);
        Bitmap bmp = Bitmap.createBitmap(px, px, Bitmap.Config.ARGB_8888);
        Canvas cv = new Canvas(bmp);
        float stroke = 6.5f * d * sizeDp / 60f;
        RectF r = new RectF(stroke / 2, stroke / 2, px - stroke / 2, px - stroke / 2);
        Paint p = new Paint(Paint.ANTI_ALIAS_FLAG);
        p.setStyle(Paint.Style.STROKE);
        p.setStrokeWidth(stroke);
        p.setStrokeCap(Paint.Cap.ROUND);
        int accent = c.getColor(R.color.widget_accent);
        int n = Math.max(1, items.size());
        float radius = r.width() / 2;
        float gap = items.size() > 1 ? Math.min((float) Math.toDegrees((stroke + 4 * d) / radius), 360f / n / 2) : 0;
        float seg = 360f / n - gap;
        p.setColor(alpha(accent, 0.22f));
        if (items.isEmpty()) cv.drawArc(r, 0, 360, false, p);
        for (int i = 0; i < items.size(); i++) cv.drawArc(r, -90 + i * (seg + gap) + gap / 2, seg, false, p);
        p.setColor(accent);
        for (int i = 0; i < items.size(); i++) {
            float f = items.get(i).frac;
            if (f > 0) cv.drawArc(r, -90 + i * (seg + gap) + gap / 2, seg * f, false, p);
        }
        Paint t = new Paint(Paint.ANTI_ALIAS_FLAG);
        t.setColor(c.getColor(R.color.widget_ink));
        t.setTextSize(15f * d * sizeDp / 60f);
        t.setTypeface(Typeface.create("sans-serif", Typeface.BOLD));
        t.setTextAlign(Paint.Align.CENTER);
        String label = items.isEmpty() ? "–" : Math.round(100f * done / items.size()) + "%";
        cv.drawText(label, px / 2f, px / 2f - (t.descent() + t.ascent()) / 2f, t);
        return bmp;
    }

    // The check circle: an outline in the habit's colour, a partly drawn ring for counts, filled with a tick when done.
    static Bitmap bubble(Context c, Item it, int sizeDp) {
        float d = c.getResources().getDisplayMetrics().density;
        int px = Math.round(sizeDp * d);
        Bitmap bmp = Bitmap.createBitmap(px, px, Bitmap.Config.ARGB_8888);
        Canvas cv = new Canvas(bmp);
        Paint p = new Paint(Paint.ANTI_ALIAS_FLAG);
        float sw = 2f * d;
        RectF r = new RectF(sw / 2, sw / 2, px - sw / 2, px - sw / 2);
        if (it.satisfied) {
            p.setColor(it.color);
            cv.drawCircle(px / 2f, px / 2f, px / 2f, p);
            Path tick = new Path();
            tick.moveTo(px * 0.29f, px * 0.52f);
            tick.lineTo(px * 0.44f, px * 0.66f);
            tick.lineTo(px * 0.72f, px * 0.36f);
            p.setStyle(Paint.Style.STROKE);
            p.setStrokeWidth(2.2f * d);
            p.setStrokeCap(Paint.Cap.ROUND);
            p.setStrokeJoin(Paint.Join.ROUND);
            p.setColor(Color.WHITE);
            cv.drawPath(tick, p);
            return bmp;
        }
        p.setStyle(Paint.Style.STROKE);
        p.setStrokeWidth(sw);
        p.setStrokeCap(Paint.Cap.ROUND);
        p.setColor(alpha(it.color, it.frac > 0 ? 0.25f : 0.7f));
        cv.drawArc(r, 0, 360, false, p);
        if (it.frac > 0) {
            p.setColor(it.color);
            cv.drawArc(r, -90, 360 * it.frac, false, p);
            Paint t = new Paint(Paint.ANTI_ALIAS_FLAG);
            t.setColor(c.getColor(R.color.widget_ink));
            t.setTextSize(px * 0.42f);
            t.setTypeface(Typeface.create("sans-serif", Typeface.BOLD));
            t.setTextAlign(Paint.Align.CENTER);
            cv.drawText(String.valueOf(it.count), px / 2f, px / 2f - (t.descent() + t.ascent()) / 2f, t);
        }
        return bmp;
    }

    // ---------- intents ----------
    static PendingIntent openApp(Context c) {
        Intent i = c.getPackageManager().getLaunchIntentForPackage(c.getPackageName());
        if (i == null) i = new Intent(c, MainActivity.class);
        i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        return PendingIntent.getActivity(c, 1, i, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    static PendingIntent toggleIntent(Context c, String id) {
        Intent i = new Intent(c, RojWidget.class).setAction(ACTION_TOGGLE).setData(Uri.parse("roj://toggle/" + Uri.encode(id)));
        return PendingIntent.getBroadcast(c, 0, i, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    static PendingIntent refreshIntent(Context c) {
        Intent i = new Intent(c, RojWidget.class).setAction(ACTION_REFRESH);
        return PendingIntent.getBroadcast(c, 2, i, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    // Redraw just after midnight so the widget starts the new day empty.
    static void scheduleMidnight(Context c) {
        AlarmManager am = c.getSystemService(AlarmManager.class);
        if (am == null) return;
        Calendar t = Calendar.getInstance();
        t.add(Calendar.DAY_OF_MONTH, 1);
        t.set(Calendar.HOUR_OF_DAY, 0);
        t.set(Calendar.MINUTE, 0);
        t.set(Calendar.SECOND, 30);
        t.set(Calendar.MILLISECOND, 0);
        am.set(AlarmManager.RTC, t.getTimeInMillis(), refreshIntent(c));
    }
}
