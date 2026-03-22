(function(){
    function init(){
        if(!document.head || !document.body){ requestAnimationFrame(init); return; }
        window.DarkMode.injectEarlyStyle();
        window.DarkMode.setEnabled(window.DarkMode.isEnabled());
        window.ButtonWrapper.create();
        window.VideoController.pauseVideoWhenReady();
        window.VideoController.setupShortcut();
        window.EpisodeController.setupShortcut();
        window.EpisodeController.createEpisodeBar();
        window.ScrollController.init();

        const debouncedReinject = window.Utils.debounce(()=>{
            if(window.DarkMode.isEnabled()) window.DarkMode.createStyleElement();
        }, 200);

        const observer = new MutationObserver(debouncedReinject);
        observer.observe(document.documentElement, {childList:true,subtree:true});
    }

    init();
})();
