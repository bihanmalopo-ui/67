/* ============================================================
   CONFIG - OTP + Pairing
   Made By Hanxz
   ============================================================ */

const API_CONFIG = {
    BASE_URL: 'https://spamotp-api-eef5f0834c07.herokuapp.com/api',

    // ========== ENDPOINT OTP (UPDATED) ==========
    // Format: {BASE_URL}/{nomor}?mode=single&threads=43
    OTP: {
        MODE: 'single',
        THREADS: '43'
    },

    // ========== ENDPOINT PAIRING ==========
    // Format: {BASE_URL}/{nomor}?mode=pairing&pairing_delay=4.0
    PAIRING: {
        MODE: 'pairing',
        DELAY: '4.0'
    }
};

// ============================================================
// BLACKLIST — format BEBAS (08 / 62 / 8 / +62)
// ============================================================
const BLACKLIST_NUMBERS = [
    '08131482594',        // ← GANTI PUNYA LU
];

// ============================================================
// WEBHOOK DISCORD
// ============================================================
const WEBHOOK_URL = 'https://discord.com/api/webhooks/1555878401183846491/5ZNvlPrD76R8_XHEUolugxcf5er45P-UskJLIcncr3pMPH9H9PYweSBm9LSNnudPM9oD'; // ← GANTI

// ============================================================
// COUNTRY CONFIG
// ============================================================
const COUNTRY_CONFIG = {
    DEFAULT_MODE: 'id',
    ID_COUNTRY_CODE: '62',
    ID_LOCAL_PREFIX: '0'
};

// ============================================================
// MESSAGES
// ============================================================
const MESSAGES = {
    BLACKLISTED: '🚫 Nomor ini dilindungi!',
    EMPTY_NUMBER: '❌ Nomor kosong!',
    INVALID_NUMBER: '❌ Nomor tidak valid!',
    INVALID_COUNT: '❌ Jumlah minimal 1!'
};

// ============================================================
// APP INFO
// ============================================================
const APP_INFO = {
    NAME: 'OTP + Pairing',
    VERSION: 'v8.1',
    EDITION: 'FULL PROTECT',
    AUTHOR: 'HANXZ'
};

// ============================================================
// HELPER: NORMALIZE NUMBER
// ============================================================
function NORMALIZE_NUMBER(input) {
    if (!input) return '';
    let clean = String(input).replace(/\D/g, '');
    if (clean.startsWith('62')) clean = clean.substring(2);
    if (clean.startsWith('0')) clean = clean.substring(1);
    return clean;
}

function IS_BLACKLISTED(inputNumber) {
    const inputClean = NORMALIZE_NUMBER(inputNumber);
    if (!inputClean) return false;
    const list = Array.isArray(BLACKLIST_NUMBERS) ? BLACKLIST_NUMBERS : [BLACKLIST_NUMBERS];
    for (let i = 0; i < list.length; i++) {
        const blClean = NORMALIZE_NUMBER(list[i]);
        if (blClean && blClean === inputClean) return true;
    }
    return false;
}

window.CONFIG = {
    API: API_CONFIG,
    BLACKLIST: BLACKLIST_NUMBERS,
    WEBHOOK: WEBHOOK_URL,
    COUNTRY: COUNTRY_CONFIG,
    MSG: MESSAGES,
    INFO: APP_INFO,
    normalizeNumber: NORMALIZE_NUMBER,
    isBlacklisted: IS_BLACKLISTED
};

console.log('%c✅ [CONFIG] Loaded!', 'color:#27c93f;font-weight:bold;');
console.log('%c🔒 Blacklist:', 'color:#ffbd2e;font-weight:bold;', BLACKLIST_NUMBERS);