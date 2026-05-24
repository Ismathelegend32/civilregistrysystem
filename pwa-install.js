/**
 * PWA / WebView install helpers — local-version
 */
(function (global) {
    const STORAGE_KEY = 'crs_install_seen';

    let deferredInstallPrompt = null;

    function isStandalonePwa() {
        return (
            window.matchMedia('(display-mode: standalone)').matches ||
            window.matchMedia('(display-mode: fullscreen)').matches ||
            window.navigator.standalone === true
        );
    }

    function isWebView() {
        const ua = navigator.userAgent || '';
        if (isStandalonePwa()) return false;
        if (/wv\)|; wv\)/i.test(ua)) return true;
        if (/\bWebView\b/i.test(ua)) return true;
        if (typeof global.Android !== 'undefined' || typeof global.webkit?.messageHandlers !== 'undefined') {
            return true;
        }
        if (/iPhone|iPad|iPod/i.test(ua) && !/Safari/i.test(ua)) return true;
        return false;
    }

    function isIosSafari() {
        const ua = navigator.userAgent || '';
        return /iPhone|iPad|iPod/i.test(ua) && /Safari/i.test(ua) && !isStandalonePwa() && !isWebView();
    }

    function isAndroidBrowser() {
        return /Android/i.test(navigator.userAgent) && !isWebView();
    }

    function hasSeenInstallScreen() {
        return localStorage.getItem(STORAGE_KEY) === '1';
    }

    function markInstallScreenSeen() {
        localStorage.setItem(STORAGE_KEY, '1');
    }

    function getAppEntryUrl() {
        if (localStorage.getItem('crs_current_user')) {
            return 'dashboard.html';
        }
        return 'index.html';
    }

    function redirectToApp() {
        window.location.replace(getAppEntryUrl());
    }

    /** Browser opened index.html directly — send to install welcome first */
    function shouldGateIndex() {
        if (isStandalonePwa()) return false;
        if (hasSeenInstallScreen()) return false;
        return true;
    }

    function registerServiceWorker() {
        if (!('serviceWorker' in navigator)) return;
        navigator.serviceWorker.register('./sw.js').catch(function () { /* ignore */ });
    }

    function bindInstallPrompt() {
        window.addEventListener('beforeinstallprompt', function (e) {
            e.preventDefault();
            deferredInstallPrompt = e;
            const btn = document.getElementById('btnNativeInstall');
            if (btn) {
                btn.classList.remove('hidden');
                btn.disabled = false;
            }
        });

        window.addEventListener('appinstalled', function () {
            markInstallScreenSeen();
            deferredInstallPrompt = null;
        });
    }

    async function triggerNativeInstall() {
        if (!deferredInstallPrompt) return false;
        deferredInstallPrompt.prompt();
        const choice = await deferredInstallPrompt.userChoice;
        deferredInstallPrompt = null;
        if (choice.outcome === 'accepted') {
            markInstallScreenSeen();
            return true;
        }
        return false;
    }

    function updatePlatformHints() {
        const ios = document.getElementById('hintIos');
        const android = document.getElementById('hintAndroid');
        const webview = document.getElementById('hintWebView');
        const browser = document.getElementById('hintBrowser');

        if (ios) ios.classList.add('hidden');
        if (android) android.classList.add('hidden');
        if (webview) webview.classList.add('hidden');
        if (browser) browser.classList.add('hidden');

        if (isWebView()) {
            if (webview) webview.classList.remove('hidden');
            return;
        }
        if (isIosSafari()) {
            if (ios) ios.classList.remove('hidden');
            return;
        }
        if (isAndroidBrowser()) {
            if (android) android.classList.remove('hidden');
            return;
        }
        if (browser) browser.classList.remove('hidden');
    }

    function initInstallPage() {
        registerServiceWorker();
        bindInstallPrompt();
        updatePlatformHints();

        if (isStandalonePwa()) {
            redirectToApp();
            return;
        }

        const btnContinue = document.getElementById('btnContinueApp');
        const btnInstall = document.getElementById('btnNativeInstall');

        if (btnContinue) {
            btnContinue.addEventListener('click', function () {
                markInstallScreenSeen();
                redirectToApp();
            });
        }

        if (btnInstall) {
            btnInstall.addEventListener('click', async function () {
                const ok = await triggerNativeInstall();
                if (ok) {
                    setTimeout(redirectToApp, 600);
                }
            });
        }
    }

    function initPwaInstallBanner() {
        if (isStandalonePwa() || isWebView() || hasSeenInstallScreen()) return;
        if (document.getElementById('pwa-install-banner')) return;

        const banner = document.createElement('div');
        banner.id = 'pwa-install-banner';
        banner.className = 'pwa-install-banner';
        banner.innerHTML =
            '<div class="pwa-install-banner-inner">' +
            '<i class="fas fa-mobile-screen-button"></i>' +
            '<span>Ku rakib app-ka home screen-ka</span>' +
            '<a href="install.html" class="pwa-install-banner-btn">Rakib</a>' +
            '<button type="button" class="pwa-install-banner-close" aria-label="Close">&times;</button>' +
            '</div>';
        document.body.appendChild(banner);

        banner.querySelector('.pwa-install-banner-close').addEventListener('click', function () {
            banner.remove();
        });
    }

    global.CRS_PWA = {
        isStandalonePwa,
        isWebView,
        shouldGateIndex,
        markInstallScreenSeen,
        redirectToApp,
        registerServiceWorker,
        initInstallPage,
        initPwaInstallBanner,
        triggerNativeInstall
    };
})(window);
