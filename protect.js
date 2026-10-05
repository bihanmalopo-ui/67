/* ============================================================
   PROTECT.JS - Anti Debug + Anti View Source + Anti Bookmark
   Made By Hanxz
   ============================================================ */

(function () {
    'use strict';

    // ============================================================
    // 1. BLOCK KEYBOARD SHORTCUTS
    // ============================================================
    document.addEventListener('keydown', function (e) {
        const key = e.key ? e.key.toLowerCase() : '';
        const ctrl = e.ctrlKey || e.metaKey;
        const shift = e.shiftKey;

        // F12
        if (e.key === 'F12' || e.keyCode === 123) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        // Ctrl+Shift+I / J / C / K
        if (ctrl && shift && (key === 'i' || key === 'j' || key === 'c' || key === 'k')) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        // Ctrl+U (View Source)
        if (ctrl && key === 'u') { e.preventDefault(); return false; }

        // Ctrl+S (Save)
        if (ctrl && key === 's') { e.preventDefault(); return false; }

        // Ctrl+A (Select All)
        if (ctrl && key === 'a') { e.preventDefault(); return false; }

        // Ctrl+D (Bookmark)
        if (ctrl && key === 'd') { e.preventDefault(); return false; }

        // Ctrl+P (Print)
        if (ctrl && key === 'p') { e.preventDefault(); return false; }

        // Ctrl+Shift+E (Network)
        if (ctrl && shift && key === 'e') { e.preventDefault(); return false; }

        // Ctrl+Shift+M (Device Mode)
        if (ctrl && shift && key === 'm') { e.preventDefault(); return false; }

    }, true);

    // ============================================================
    // 2. BLOCK RIGHT CLICK
    // ============================================================
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }, true);

    // ============================================================
    // 3. BLOCK DRAG
    // ============================================================
    document.addEventListener('dragstart', function (e) { e.preventDefault(); return false; }, true);
    document.addEventListener('drop', function (e) { e.preventDefault(); return false; }, true);

    // ============================================================
    // 4. BLOCK COPY / CUT (kecuali input & textarea)
    // ============================================================
    document.addEventListener('copy', function (e) {
        const tag = (e.target.tagName || '').toLowerCase();
        if (tag !== 'input' && tag !== 'textarea') { e.preventDefault(); return false; }
    }, true);

    document.addEventListener('cut', function (e) {
        const tag = (e.target.tagName || '').toLowerCase();
        if (tag !== 'input' && tag !== 'textarea') { e.preventDefault(); return false; }
    }, true);

    // ============================================================
    // 5. BLOCK SELECT ALL
    // ============================================================
    document.addEventListener('selectstart', function (e) {
        const tag = (e.target.tagName || '').toLowerCase();
        if (tag !== 'input' && tag !== 'textarea') { e.preventDefault(); return false; }
    }, true);

    // ============================================================
    // 6. DETEKSI DEVTOOLS
    // ============================================================
    let devtoolsOpen = false;
    const threshold = 160;

    function detectDevTools() {
        const widthDiff = window.outerWidth - window.innerWidth > threshold;
        const heightDiff = window.outerHeight - window.innerHeight > threshold;

        if (widthDiff || heightDiff) {
            if (!devtoolsOpen) { devtoolsOpen = true; onDevToolsOpen(); }
        } else {
            if (devtoolsOpen) { devtoolsOpen = false; onDevToolsClose(); }
        }
    }

    function onDevToolsOpen() {
        try { console.clear(); } catch (e) {}
        document.body.style.filter = 'blur(20px)';
        document.body.style.pointerEvents = 'none';
        showWarnOverlay();
    }

    function onDevToolsClose() {
        document.body.style.filter = '';
        document.body.style.pointerEvents = '';
        const ov = document.getElementById('__debug_warn');
        if (ov) ov.remove();
    }

    function showWarnOverlay() {
        if (document.getElementById('__debug_warn')) return;
        const ov = document.createElement('div');
        ov.id = '__debug_warn';
        ov.style.cssText = `
            position: fixed; inset: 0; z-index: 9999999;
            background: rgba(10, 14, 23, 0.98); color: #ff5f56;
            font-family: 'JetBrains Mono', monospace;
            display: flex; flex-direction: column; align-items: center;
            justify-content: center; text-align: center; padding: 30px;
            pointer-events: auto;
        `;
        ov.innerHTML = `
            <div style="font-size: 60px; margin-bottom: 20px;">🚫</div>
            <h1 style="font-family: 'Orbitron', sans-serif; font-size: 24px; margin-bottom: 14px; color: #ff0078; letter-spacing: 3px;">ACCESS DENIED</h1>
            <p style="font-size: 13px; color: #4a5568; line-height: 1.8; max-width: 400px;">
                Developer Tools terdeteksi!<br>
                Tutup <b style="color:#00ffc8">DevTools</b> untuk melanjutkan.<br><br>
                <span style="color: #ffbd2e;">⚠️ Aktivitas kamu sedang dicatat ⚠️</span>
            </p>
        `;
        document.body.appendChild(ov);
    }

    setInterval(detectDevTools, 800);
    window.addEventListener('resize', detectDevTools);
    window.addEventListener('focus', detectDevTools);

    // ============================================================
    // 7. DISABLE USER SELECT
    // ============================================================
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.style.msUserSelect = 'none';
    document.body.style.mozUserSelect = 'none';

    setTimeout(() => {
        document.querySelectorAll('input, textarea').forEach(el => {
            el.style.userSelect = 'text';
            el.style.webkitUserSelect = 'text';
        });
    }, 100);

    // ============================================================
    // 8. WELCOME LOG
    // ============================================================
    console.log('%c╔═══════════════════════════════════════════╗', 'color:#00ffc8;font-weight:bold;font-size:13px;');
    console.log('%c║      🛡️ PROTECT MODE ACTIVATED 🛡️         ║', 'color:#ff0078;font-weight:bold;font-size:13px;');
    console.log('%c║              By Hanxz                     ║', 'color:#00ffc8;font-weight:bold;font-size:13px;');
    console.log('%c╚═══════════════════════════════════════════╝', 'color:#00ffc8;font-weight:bold;font-size:13px;');

})();