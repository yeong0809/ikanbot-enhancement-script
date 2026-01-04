(function(){
    const ButtonWrapper = {
        create(){
            if(!document.body) return;
            const container = document.createElement('div');
            Object.assign(container.style,{
                position:'fixed', top:'12px', right:'12px', zIndex:'9999', display:'flex', gap:'6px'
            });
            document.body.appendChild(container);

            function styleBtn(btn, fontSize='35px'){
                Object.assign(btn.style,{
                    padding:'6px 10px', backgroundColor:'#444', color:'#fff', border:'none',
                    borderRadius:'4px', cursor:'pointer', fontSize:fontSize, opacity:'0.8',
                    transition:'opacity 0.2s ease', userSelect:'none', lineHeight:'1',
                });
                btn.addEventListener('mouseenter',()=>btn.style.opacity='1');
                btn.addEventListener('mouseleave',()=>btn.style.opacity='0.8');
            }

            // Previous Button
            const prevBtn = document.createElement('button');
            prevBtn.textContent='◀️'; prevBtn.title='Previous Episode';
            styleBtn(prevBtn);
            prevBtn.addEventListener('click', ()=>window.EpisodeController.goToPrevious());
            container.appendChild(prevBtn);

            // Next Button
            const nextBtn = document.createElement('button');
            nextBtn.textContent='▶️'; nextBtn.title='Next Episode';
            styleBtn(nextBtn);
            nextBtn.addEventListener('click', ()=>window.EpisodeController.goToNext());
            container.appendChild(nextBtn);

            // Dark Mode button
            const darkBtn = document.getElementById('dark-mode-toggle-btn') || window.ToggleButton.create();
            container.appendChild(darkBtn);
        }
    };

    window.ButtonWrapper = ButtonWrapper;
})();
