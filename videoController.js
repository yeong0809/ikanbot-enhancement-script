(function(){
    const PLAYER_ID = 'ikanbot-player';

    const VideoController = {
        getPlayer(){ return document.getElementById(PLAYER_ID); },
        getVideo(){ const p = this.getPlayer(); return p?p.querySelector('video'):null; },
        pauseVideo(){
            const v = this.getVideo(); if(!v) return false; if(!v.paused)v.pause();
            const p = this.getPlayer(); if(p){ p.classList.add('vjs-paused'); p.classList.remove('vjs-playing'); }
            return true;
        },
        playVideo(){
            const v = this.getVideo(); if(!v) return false; if(v.paused)v.play();
            const p = this.getPlayer(); if(p){ p.classList.remove('vjs-paused'); p.classList.add('vjs-playing'); }
            return true;
        },
        togglePlayPause(){ const v = this.getVideo(); if(!v)return; v.paused?this.playVideo():this.pauseVideo(); },
        handleSpacebar(e){
            if(e.code!=='Space')return;
            if(['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) return;
            e.preventDefault(); this.togglePlayPause();
        },
        setupShortcut(){ document.addEventListener('keydown', e=>this.handleSpacebar(e)); },
        pauseVideoWhenReady(){
            const vid=this.getVideo();
            if(vid){
                if(vid.readyState>=2){ this.pauseVideo(); return; }
                const onReady=()=>{ this.pauseVideo(); vid.removeEventListener('loadeddata',onReady); vid.removeEventListener('canplay',onReady); };
                vid.addEventListener('loadeddata',onReady);
                vid.addEventListener('canplay',onReady);
                return;
            }
            const observer=new MutationObserver((mutations,obs)=>{
                const video=this.getVideo();
                if(video){
                    if(video.readyState>=2){ this.pauseVideo(); obs.disconnect(); return; }
                    const onReady=()=>{ this.pauseVideo(); video.removeEventListener('loadeddata',onReady); video.removeEventListener('canplay',onReady); obs.disconnect(); };
                    video.addEventListener('loadeddata',onReady);
                    video.addEventListener('canplay',onReady);
                }
            });
            observer.observe(document.body,{childList:true,subtree:true});
        }
    };

    window.VideoController = VideoController;
})();
