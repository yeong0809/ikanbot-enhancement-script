(function(){
    const ScrollController = {
        scrollToLastEpisode(elem){
            const episodes = Array.from(elem.querySelectorAll('[name="lineData"]'));
            const getNumber = s => { const match = s.match(/\d+/); return match ? parseInt(match[0],10) : 0; };
            episodes.sort((a,b)=>getNumber(b.textContent)-getNumber(a.textContent));
            episodes.forEach(ep=>elem.appendChild(ep));
            const active = elem.querySelector('.active[name="lineData"]');
            if(active) { active.scrollIntoView({behavior:'auto'}); return; }
            if(episodes.length>0) episodes[episodes.length-1].scrollIntoView({behavior:'auto'});
        },
        scrollAllLineRes(){
            const lineResElements = document.querySelectorAll('.line-res');
            if(!lineResElements.length) return;
            lineResElements.forEach(el => this.scrollToLastEpisode(el));
            window.scrollTo({top:0,left:0,behavior:'auto'});
        },
        init(){
            if(document.querySelectorAll('.line-res').length===0){
                const observer=new MutationObserver((mutations,obs)=>{
                    if(document.querySelectorAll('.line-res').length>0){ this.scrollAllLineRes(); obs.disconnect(); }
                });
                observer.observe(document.body,{childList:true,subtree:true});
            } else { this.scrollAllLineRes(); }
        }
    };

    window.ScrollController = ScrollController;
})();
