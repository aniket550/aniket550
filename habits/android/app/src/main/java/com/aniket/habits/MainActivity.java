package com.aniket.habits;

import android.os.Bundle;
import android.view.View;
import android.webkit.WebView;
import androidx.activity.EdgeToEdge;
import androidx.core.content.ContextCompat;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.WebViewListener;
import java.util.Locale;

// The page runs edge to edge: it paints behind the status bar and the gesture bar, and the bar
// sizes reach the CSS as --safe-area-inset-*. Capacitor's own insets handling is off
// (capacitor.config.json) because on some phones it padded the window as well, which left black
// strips at the top and bottom with the dark status icons lost on them.
public class MainActivity extends BridgeActivity {

    private String insetsScript = "";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        registerPlugin(WidgetPlugin.class);
        super.onCreate(savedInstanceState);
        if (getBridge() == null) return;
        EdgeToEdge.enable(this);

        int paper = ContextCompat.getColor(this, R.color.roz_background);
        View decor = getWindow().getDecorView();
        WebView web = getBridge().getWebView();
        decor.setBackgroundColor(paper);
        web.setBackgroundColor(paper);

        ViewCompat.setOnApplyWindowInsetsListener(decor, (v, insets) -> {
            Insets bars = insets.getInsets(WindowInsetsCompat.Type.systemBars() | WindowInsetsCompat.Type.displayCutout());
            boolean keyboard = insets.isVisible(WindowInsetsCompat.Type.ime());
            // Only the keyboard shrinks the page; the bars are left to CSS.
            v.setPadding(0, 0, 0, keyboard ? insets.getInsets(WindowInsetsCompat.Type.ime()).bottom : 0);
            float d = getResources().getDisplayMetrics().density;
            insetsScript = String.format(
                Locale.US,
                "(function(s){s.setProperty('--safe-area-inset-top','%.1fpx');s.setProperty('--safe-area-inset-right','%.1fpx');" +
                "s.setProperty('--safe-area-inset-bottom','%.1fpx');s.setProperty('--safe-area-inset-left','%.1fpx');})(document.documentElement.style);",
                bars.top / d, bars.right / d, keyboard ? 0f : bars.bottom / d, bars.left / d
            );
            web.evaluateJavascript(insetsScript, null);
            return insets;
        });

        // A page load clears the values set above, so set them again.
        getBridge().addWebViewListener(new WebViewListener() {
            @Override
            public void onPageCommitVisible(WebView view, String url) {
                view.evaluateJavascript(insetsScript, null);
            }

            @Override
            public void onPageLoaded(WebView view) {
                view.evaluateJavascript(insetsScript, null);
            }
        });
        ViewCompat.requestApplyInsets(decor);
    }
}
