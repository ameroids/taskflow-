
package com.ameroids.taskflow

import android.os.Bundle
import android.content.Intent
import android.net.Uri
import android.webkit.WebView
import android.webkit.WebViewClient
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebResourceRequest
import android.webkit.WebResourceError
import android.view.View
import android.widget.Toast
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView

    private val websiteUrl =
        "https://taskflow.ameroids.in"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webView)

        // WebView configuration
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            loadWithOverviewMode = true
            useWideViewPort = true
            cacheMode = WebSettings.LOAD_DEFAULT
            javaScriptCanOpenWindowsAutomatically = true
            setSupportMultipleWindows(false)
        }

        // Handle website and external links
        webView.webViewClient = object : WebViewClient() {

            override fun shouldOverrideUrlLoading(
                view: WebView,
                request: WebResourceRequest
            ): Boolean {

                val uri = request.url
                val url = uri.toString()
                val scheme = uri.scheme?.lowercase()
                val host = uri.host?.lowercase() ?: ""

                val isGoogleMaps =
                    host == "maps.google.com" ||
                            host == "maps.app.goo.gl" ||
                            host == "goo.gl" ||
                            (
                                    (host == "google.com" ||
                                            host == "www.google.com") &&
                                            uri.path?.startsWith("/maps") == true
                                    )

                val isWhatsApp =
                    host == "wa.me" ||
                            host == "whatsapp.com" ||
                            host.endsWith(".whatsapp.com")

                // Keep ordinary website pages inside the app
                if (
                    (scheme == "https" || scheme == "http") &&
                    !isGoogleMaps &&
                    !isWhatsApp
                ) {
                    return false
                }

                // Handle external apps and Android intents
                try {

                    val externalIntent = if (scheme == "intent") {

                        Intent.parseUri(
                            url,
                            Intent.URI_INTENT_SCHEME
                        ).apply {
                            addCategory(Intent.CATEGORY_BROWSABLE)
                            component = null
                            selector = null
                        }

                    } else {

                        Intent(Intent.ACTION_VIEW, uri)
                    }

                    startActivity(externalIntent)

                } catch (e: Exception) {

                    try {

                        if (scheme == "intent") {

                            val fallbackIntent = Intent.parseUri(
                                url,
                                Intent.URI_INTENT_SCHEME
                            )

                            val fallbackUrl =
                                fallbackIntent.getStringExtra(
                                    "browser_fallback_url"
                                )

                            if (
                                !fallbackUrl.isNullOrEmpty() &&
                                fallbackUrl.startsWith("https://")
                            ) {
                                view.loadUrl(fallbackUrl)
                            } else {
                                showMessage("No compatible app found")
                            }

                        } else {
                            showMessage("Unable to open this link")
                        }

                    } catch (ex: Exception) {
                        showMessage("Unable to open this link")
                    }
                }

                return true
            }

            // Handle main page loading errors
            override fun onReceivedError(
                view: WebView,
                request: WebResourceRequest,
                error: WebResourceError
            ) {
                super.onReceivedError(view, request, error)

                if (request.isForMainFrame) {
                    showMessage(
                        "Unable to load TaskFlow. Check your internet."
                    )
                }
            }
        }

        // Website browser functionality
        webView.webChromeClient = WebChromeClient()

        // Load TaskFlow website
        webView.loadUrl(websiteUrl)

        // Android back button
        onBackPressedDispatcher.addCallback(
            this,
            object : OnBackPressedCallback(true) {

                override fun handleOnBackPressed() {

                    if (webView.canGoBack()) {
                        webView.goBack()
                    } else {
                        finish()
                    }
                }
            }
        )
    }

    private fun showMessage(message: String) {
        Toast.makeText(
            this,
            message,
            Toast.LENGTH_SHORT
        ).show()
    }

    override fun onDestroy() {
        webView.destroy()
        super.onDestroy()
    }
}
