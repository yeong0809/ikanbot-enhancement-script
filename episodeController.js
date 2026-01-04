(function(){
    const EpisodeController = {
        getAllEpisodes() { return Array.from(document.querySelectorAll('[name="lineData"]')); },
        getCurrentEpisodeIndex() {
            const eps = this.getAllEpisodes();
            return eps.findIndex(ep => ep.classList.contains('active'));
        },
        goToEpisode(index){
            const eps = this.getAllEpisodes();
            if(!eps.length) return;
            index = Math.max(0, Math.min(index, eps.length-1));
            eps.forEach(ep => ep.classList.remove('active'));
            const target = eps[index];
            target.classList.add('active');
            target.scrollIntoView({behavior:'auto'});
            if(typeof target.click === 'function') target.click();
        },
        goToPrevious(){ const idx=this.getCurrentEpisodeIndex(); if(idx>0) this.goToEpisode(idx-1); },
        goToNext(){ const idx=this.getCurrentEpisodeIndex(); const eps=this.getAllEpisodes(); if(idx>=0 && idx<eps.length-1) this.goToEpisode(idx+1); },
        handleArrowKeys(e){
            if(['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) return;
            if(e.code==='Comma'){ e.preventDefault(); this.goToPrevious(); }
            else if(e.code==='Period'){ e.preventDefault(); this.goToNext(); }
        },
        setupShortcut(){ document.addEventListener('keydown', e=>this.handleArrowKeys(e)); }
    };

    window.EpisodeController = EpisodeController;
})();
