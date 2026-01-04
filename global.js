(function(){
    const GLOBAL_CSS = `
        @media (min-width: 1920px) {
            .container {
                width: 1800px !important;
            }
        }
    `;

    let styleEl = document.createElement('style');
    styleEl.id = 'global-extra-style';
    styleEl.textContent = GLOBAL_CSS;
    document.head?.appendChild(styleEl);
})();
