package com.aniket.habits;

import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.os.Build;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

// Lets the web app talk to the home screen widget: redraw it after a change, or ask the
// launcher to add it (Android 8 and later).
@CapacitorPlugin(name = "RojWidget")
public class WidgetPlugin extends Plugin {

    @PluginMethod
    public void refresh(PluginCall call) {
        RojWidget.updateAll(getContext());
        call.resolve();
    }

    @PluginMethod
    public void pin(PluginCall call) {
        AppWidgetManager mgr = AppWidgetManager.getInstance(getContext());
        boolean asked = false;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && mgr.isRequestPinAppWidgetSupported()) {
            asked = mgr.requestPinAppWidget(new ComponentName(getContext(), RojWidget.class), null, null);
        }
        JSObject result = new JSObject();
        result.put("asked", asked);
        call.resolve(result);
    }
}
