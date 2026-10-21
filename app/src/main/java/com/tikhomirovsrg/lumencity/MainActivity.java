package com.tikhomirovsrg.lumencity;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.view.HapticFeedbackConstants;
import android.view.WindowInsets;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import androidx.webkit.WebViewAssetLoader;
import java.io.ByteArrayInputStream;

/** An offline Android container. All game resources are packaged in the APK. */
public final class MainActivity extends Activity {
    private WebView webView;
    private static final String HOST = "appassets.androidplatform.net";

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        if (android.os.Build.VERSION.SDK_INT >= 30) getWindow().setDecorFitsSystemWindows(false);
        else getWindow().getDecorView().setSystemUiVisibility(
            android.view.View.SYSTEM_UI_FLAG_LAYOUT_STABLE |
            android.view.View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN |
            android.view.View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION);
        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(Color.rgb(16, 29, 42));
        // Android 15 enforces edge-to-edge: inset the content away from system bars.
        root.setOnApplyWindowInsetsListener((view, insets) -> {
            if (android.os.Build.VERSION.SDK_INT >= 30) {
                android.graphics.Insets bars = insets.getInsets(WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout());
                view.setPadding(bars.left, bars.top, bars.right, bars.bottom);
            } else {
                view.setPadding(insets.getSystemWindowInsetLeft(), insets.getSystemWindowInsetTop(),
                    insets.getSystemWindowInsetRight(), insets.getSystemWindowInsetBottom());
            }
            return insets.consumeSystemWindowInsets();
        });
        webView = new WebView(this);
        webView.setBackgroundColor(Color.rgb(16, 29, 42));
        root.addView(webView, new FrameLayout.LayoutParams(-1, -1));
        setContentView(root);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setMediaPlaybackRequiresUserGesture(true);
        settings.setSupportZoom(false);
        WebView.setWebContentsDebuggingEnabled(BuildConfig.DEBUG);
        WebViewAssetLoader loader = new WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this)).build();
        webView.setWebViewClient(new WebViewClient() {
            @Override public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if ("https".equals(uri.getScheme()) && HOST.equals(uri.getHost())) {
                    WebResourceResponse local = loader.shouldInterceptRequest(uri);
                    if (local != null) return local;
                }
                return new WebResourceResponse("text/plain", "UTF-8", 403, "Forbidden", null, new ByteArrayInputStream(new byte[0]));
            }
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                // External URLs never enter the privileged WebView/JS bridge.
                return true;
            }
        });
        webView.addJavascriptInterface(new NativeBridge(), "Android");
        webView.loadUrl("https://" + HOST + "/assets/index.html");
    }

    private final class NativeBridge {
        @JavascriptInterface public void haptic() {
            runOnUiThread(() -> webView.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP));
        }
        @JavascriptInterface public void shareText(String text) {
            if (text == null || text.length() > 200000) return;
            runOnUiThread(() -> {
                Intent intent = new Intent(Intent.ACTION_SEND);
                intent.setType("text/plain");
                intent.putExtra(Intent.EXTRA_TEXT, text);
                startActivity(Intent.createChooser(intent, "Lumen City"));
            });
        }
    }

    @Override public void onBackPressed() {
        webView.evaluateJavascript("window.lumenBack ? window.lumenBack() : false", result -> {
            if (!"true".equals(result)) finish();
        });
    }
    @Override protected void onPause() {
        webView.evaluateJavascript("window.lumenPause && window.lumenPause()", null);
        webView.onPause();
        super.onPause();
    }
    @Override protected void onResume() {
        super.onResume();
        if (webView != null) webView.onResume();
    }
    @Override protected void onDestroy() {
        if (webView != null) {
            webView.removeJavascriptInterface("Android");
            ((FrameLayout) webView.getParent()).removeView(webView);
            webView.destroy();
        }
        super.onDestroy();
    }
}
