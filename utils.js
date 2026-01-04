(function(){
    const Utils = (() => {
        function waitForBody(callback) {
            if (document.body) callback();
            else {
                const observer = new MutationObserver(() => {
                    if (document.body) {
                        observer.disconnect();
                        callback();
                    }
                });
                observer.observe(document.documentElement, { childList: true });
            }
        }

        function debounce(fn, delay) {
            let timer = null;
            return (...args) => {
                if (timer) clearTimeout(timer);
                timer = setTimeout(() => fn(...args), delay);
            };
        }

        return { waitForBody, debounce };
    })();

    window.Utils = Utils;
})();
