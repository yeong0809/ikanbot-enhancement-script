(function(){
    const GLOBAL_CSS = `
        @media (min-width: 1920px) {
            .container {
                width: 1680px !important;
            }
        }
        @media (min-width: 1680px) {
            .container {
                width: 1280px !important;
            }
        }
    `;

    let styleEl = document.createElement('style');
    styleEl.id = 'global-extra-style';
    styleEl.textContent = GLOBAL_CSS;
    document.head?.appendChild(styleEl);
})();
