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
    static final int[] CHECKS = { R.id.w_c0, R.id.w_c1, R.id.w_c2, R.id.w_c3, R.id.w_c4, R.id.w_c5 };
    static final int[] BUBBLES = { R.id.w_b0, R.id.w_b1, R.id.w_b2, R.id.w_b3, R.id.w_b4, R.id.w_b5 };
    static final int[] NAMES = { R.id.w_n0, R.id.w_n1, R.id.w_n2, R.id.w_n3, R.id.w_n4, R.id.w_n5 };
    static final int[] METAS = { R.id.w_m0, R.id.w_m1, R.id.w_m2, R.id.w_m3, R.id.w_m4, R.id.w_m5 };
    static final int[] STRIP = { R.id.w_s0, R.id.w_s1, R.id.w_s2, R.id.w_s3, R.id.w_s4, R.id.w_s5, R.id.w_s6, R.id.w_s7 };
    static final int[] STRIP_IMG = { R.id.w_si0, R.id.w_si1, R.id.w_si2, R.id.w_si3, R.id.w_si4, R.id.w_si5, R.id.w_si6, R.id.w_si7 };

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
                it.meta = got + "/" + times + " wk";
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
            SharedPreferences.Editor ed = c.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit();
            ed.putString(KEY, state.toString()).apply();
        } catch (Exception e) {
            // leave the saved state as it was
        }
    }

    // ---------- drawing ----------
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

        RemoteViews v = new RemoteViews(c.getPackageName(), small ? R.layout.widget_small : R.layout.widget_today);
        v.setOnClickPendingIntent(android.R.id.background, openApp(c));
        v.setImageViewBitmap(R.id.w_ring, ring(c, items, done, small ? 76 : 60));

        if (small) {
            v.setTextViewText(R.id.w_title, total == 0 ? "Nothing today" : done == total ? "All done" : done + " of " + total + " done");
            mgr.updateAppWidget(widgetId, v);
            return;
        }

        v.setTextViewText(R.id.w_date, new SimpleDateFormat("EEEE d MMM", Locale.ENGLISH).format(now.getTime()).toUpperCase(Locale.ENGLISH));
        v.setTextViewText(R.id.w_title, headline(c, state, done, total));

        // Rows fit under the header; with no room for rows, a strip of checks takes their place.
        int below = h - 32 - 60 - 10;
        int rows = Math.max(0, Math.min(ROWS.length, below / 34));
        boolean more = total > rows && rows >= 2;
        if (more) rows -= 1;
        for (int i = 0; i < ROWS.length; i++) {
            if (i < rows && i < total) {
                Item it = items.get(i);
                v.setViewVisibility(ROWS[i], View.VISIBLE);
                v.setImageViewBitmap(BUBBLES[i], bubble(c, it, 22));
                v.setTextViewText(NAMES[i], it.name);
                v.setTextColor(NAMES[i], c.getColor(it.satisfied ? R.color.widget_secondary : R.color.widget_ink));
                v.setTextViewText(METAS[i], it.meta == null ? "" : it.meta);
                v.setViewVisibility(METAS[i], it.meta == null ? View.GONE : View.VISIBLE);
                v.setOnClickPendingIntent(CHECKS[i], toggleIntent(c, it.id));
                v.setContentDescription(CHECKS[i], (it.satisfied ? "Undo " : "Check off ") + it.name);
            } else {
                v.setViewVisibility(ROWS[i], View.GONE);
            }
        }
        v.setViewVisibility(R.id.w_list, rows > 0 && total > 0 ? View.VISIBLE : View.GONE);
        v.setViewVisibility(R.id.w_more, more ? View.VISIBLE : View.GONE);
        if (more) v.setTextViewText(R.id.w_more, "+" + (total - rows) + " more");

        int strip = rows == 0 && below >= 26 ? Math.min(STRIP.length, Math.max(0, (w - 32) / 34)) : 0;
        for (int i = 0; i < STRIP.length; i++) {
            if (i < strip && i < total) {
                Item it = items.get(i);
                v.setViewVisibility(STRIP[i], View.VISIBLE);
                v.setImageViewBitmap(STRIP_IMG[i], bubble(c, it, 24));
                v.setOnClickPendingIntent(STRIP[i], toggleIntent(c, it.id));
                v.setContentDescription(STRIP[i], (it.satisfied ? "Undo " : "Check off ") + it.name);
            } else {
                v.setViewVisibility(STRIP[i], View.GONE);
            }
        }
        v.setViewVisibility(R.id.w_strip, strip > 0 && total > 0 ? View.VISIBLE : View.GONE);

        boolean empty = total == 0 && below >= 26;
        v.setViewVisibility(R.id.w_empty, empty ? View.VISIBLE : View.GONE);
        if (empty) v.setTextViewText(R.id.w_empty, state == null || state.optJSONArray("habits") == null || state.optJSONArray("habits").length() == 0 ? "Tap to add your first habit." : "Rest counts too.");
        mgr.updateAppWidget(widgetId, v);
    }

    // "2 down, 3 to go." like the app's Today, with the numbers in colour.
    static CharSequence headline(Context c, JSONObject state, int done, int total) {
        if (state == null) return "Small habits, every day.";
        if (total == 0) return "A quiet day.";
        if (done == total) return "All done.";
        SpannableStringBuilder b = new SpannableStringBuilder();
        appendColored(b, String.valueOf(done), c.getColor(R.color.widget_accent_text));
        b.append(" down, ");
        appendColored(b, String.valueOf(total - done), c.getColor(R.color.widget_tertiary));
        b.append(" to go.");
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
