(function(){
    const CONSTANTS = {
        DARK_MODE_KEY: 'ikanbot-dark-mode-enabled',
        STYLE_ID: 'global-dark-mode-style',
    };

    const css = `
        :root { --bg-color: rgba(0,0,0,0.9); --text-color:#fff; --link-color:#4ea8ff; --highlight-color:#00c853; --border-color:#555; --input-bg:#222; --input-border:#666; --selection-bg:#555;}
        html, body { background-color: var(--bg-color) !important; color: var(--text-color) !important; }
        *,*::before,*::after { background-color: transparent !important; color: var(--text-color) !important; border-color: var(--border-color) !important; }
        a, a * { color: var(--link-color) !important; }
        a:hover { color: #88ccff !important; }
        ::selection { background: var(--selection-bg) !important; color: var(--text-color) !important; }
        input,textarea,select,button { background-color: var(--input-bg) !important; color: var(--text-color) !important; border:1px solid var(--input-border) !important; }
        .vjs-progress-holder { background-color: lightyellow !important; }
        .vjs-load-progress { background-color: orange !important; }
        .vjs-play-progress { background-color: green !important; }
        .active { background-color: var(--highlight-color) !important; }
        .result-info { background-color: transparent !important; }
        .card,.container,.box,.modal,.dropdown { box-shadow:none !important; }
    `;

    let styleEl = null;

    const DarkMode = {
        injectEarlyStyle() {
            if (document.head && !document.getElementById(CONSTANTS.STYLE_ID)) {
                styleEl = document.createElement('style');
                styleEl.id = CONSTANTS.STYLE_ID;
                styleEl.textContent = css;
                document.head.appendChild(styleEl);
                styleEl.disabled = !this.isEnabled();
            }
        },
        createStyleElement() {
            if (!styleEl) {
                styleEl = document.createElement('style');
                styleEl.id = CONSTANTS.STYLE_ID;
                styleEl.textContent = css;
                document.head.appendChild(styleEl);
            }
            return styleEl;
        },
        enable() { if(styleEl) styleEl.disabled = false; },
        disable() { if(styleEl) styleEl.disabled = true; },
        isEnabled() { const val = localStorage.getItem(CONSTANTS.DARK_MODE_KEY); return val===null ? true : val==='true'; },
        setEnabled(enabled) {
            if(enabled) this.enable(); else this.disable();
            localStorage.setItem(CONSTANTS.DARK_MODE_KEY, enabled?'true':'false');
        },
        toggle() { this.setEnabled(!this.isEnabled()); }
    };

    window.DarkMode = DarkMode;
})();
