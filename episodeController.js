(function(){
    const EpisodeController = {
        // getAllEpisodes() {
        //     return Array.from(document.querySelectorAll('[name="lineData"]'));
        // },
        getAllEpisodes(){
            const container = this.getCurrentLineRes();
            if(!container) return [];
            return Array.from(container.querySelectorAll('[name="lineData"]'));
        },
        getCurrentLineRes(){
            const activeEp = document.querySelector('[name="lineData"].active');
            if(activeEp) return activeEp.closest('.line-res');

            // fallback: first line-res
            return document.querySelector('.line-res');
        },
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
            this.updateEpisodeBar();
        },
        goToPrevious(){
            const idx=this.getCurrentEpisodeIndex();
            if(idx>0) this.goToEpisode(idx-1);
        },
        goToNext(){
            const idx=this.getCurrentEpisodeIndex();
            const eps=this.getAllEpisodes();
            if(idx>=0 && idx<eps.length-1) this.goToEpisode(idx+1);
        },
        handleArrowKeys(e){
            if(['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) return;
            if(e.code==='Comma'){ e.preventDefault(); this.goToPrevious(); }
            else if(e.code==='Period'){ e.preventDefault(); this.goToNext(); }
        },
        setupShortcut(){
            document.addEventListener('keydown', e=>this.handleArrowKeys(e));
        },

        // -----------------------------
        // Episode Bar Functions
        // -----------------------------
        createEpisodeBar(){
            if(document.getElementById('episode-bar')) return;
            const bar = document.createElement('div');
            bar.id = 'episode-bar';
            Object.assign(bar.style, {
                position: 'fixed',
                top: '160px',
                right: '10px',
                width: '240px',
                maxHeight: '80vh',
                overflowY: 'auto',
                background: 'rgba(0,0,0,0.6)',
                borderRadius: '8px',
                padding: '5px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 9999
            });
            document.body.appendChild(bar);
        },
        updateEpisodeBar(){
            const bar = document.getElementById('episode-bar');
            if(!bar) return;

            const episodes = this.getAllEpisodes();
            if(!episodes.length) return; // exit if still empty

            bar.innerHTML = '';
            episodes.forEach((ep, index) => {
                const dot = document.createElement('div');
                dot.style.width = '100%';
                dot.style.borderRadius = '8px';
                dot.style.margin = '4px 0';
                dot.style.cursor = 'pointer';
                dot.style.transition = 'all 0.2s ease';
                dot.style.border = '1px solid #e5e9ef';
                dot.style.display = 'flex';
                dot.style.justifyContent = 'center';
                dot.style.setProperty(
                  'background-color',
                  ep.classList.contains('active') ? 'green' : undefined,
                  'important'
                );
                dot.title = ep.textContent || `Episode ${index + 1}`;

                const label = document.createElement('span');
                label.textContent = ep.textContent || `Episode ${index + 1}`;
                label.style.color = 'white';
                label.style.fontSize = '32px';
                dot.appendChild(label);

                dot.style.transform = 'scale(0.8)'
                dot.addEventListener('click', ()=>this.goToEpisode(index));
                dot.addEventListener('mouseenter', ()=>dot.style.transform='scale(1)');
                dot.addEventListener('mouseleave', ()=>dot.style.transform='scale(0.8)');
                bar.appendChild(dot);
            });

            const activeIndex = this.getCurrentEpisodeIndex();
            if(activeIndex >= 0){
                const activeDot = bar.children[activeIndex];
                if(activeDot) activeDot.scrollIntoView({behavior:'smooth', block:'center'});
            }
        },

        // Wait until episodes are loaded
        init(){
            this.setupShortcut();
            this.createEpisodeBar();

            const checkEpisodes = () => {
                const episodes = this.getAllEpisodes();
                if(episodes.length){
                    this.updateEpisodeBar();
                    return true;
                }
                return false;
            };

            // First try immediately
            if(!checkEpisodes()){
                // Use MutationObserver if episodes not yet rendered
                const observer = new MutationObserver(() => {
                    if(checkEpisodes()) observer.disconnect();
                });
                observer.observe(document.body, {childList:true, subtree:true});
            }
        }
    };

    window.EpisodeController = EpisodeController;
})();
