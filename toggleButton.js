(function(){
    const TOGGLE_BTN_ID = 'dark-mode-toggle-btn';

    const ToggleButton = {
        create() {
            let btn = document.getElementById(TOGGLE_BTN_ID);
            if(btn) return btn;

            btn = document.createElement('button');
            btn.id = TOGGLE_BTN_ID;
            btn.title = 'Toggle Dark Mode';
            btn.setAttribute('aria-pressed', 'false');
            Object.assign(btn.style, {
                padding:'6px 10px', backgroundColor:'#444', color:'#fff', border:'none', borderRadius:'4px',
                cursor:'pointer', fontSize:'20px', opacity:'0.8', transition:'opacity 0.2s ease', userSelect:'none'
            });

            btn.addEventListener('mouseenter', ()=>btn.style.opacity='1');
            btn.addEventListener('mouseleave', ()=>btn.style.opacity='0.8');
            btn.addEventListener('click', ()=>{
                window.DarkMode.toggle();
                btn.setAttribute('aria-pressed', window.DarkMode.isEnabled()?'true':'false');
                btn.textContent = window.DarkMode.isEnabled()?'🌙 Dark On':'☀️ Dark Off';
            });

            btn.textContent = window.DarkMode.isEnabled()?'🌙 Dark On':'☀️ Dark Off';
            return btn;
        }
    };

    window.ToggleButton = ToggleButton;
})();
