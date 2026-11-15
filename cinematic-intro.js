/* Our Space cinematic welcome — branded video card that lands in the real Dodo home. */
(()=>{
  'use strict';
  const overlay=document.getElementById('cinematic-intro');
  const card=document.getElementById('cinematic-intro-card');
  const video=document.getElementById('cinematic-intro-video');
  const skip=document.getElementById('cinematic-intro-skip');
  const replay=document.getElementById('cinematic-intro-replay');
  const home=document.getElementById('dodo-home');
  if(!overlay||!card||!video||!skip)return;

  const KEY='our-space-dodo-cinematic-intro-v1'; // Keep existing once-per-tab/session rule.
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let running=false,ending=false,authConfirmed=false,token=0;
  let loadTimer=0,guardTimer=0,landTimer=0,finishTimer=0;
  const clearTimers=()=>{[loadTimer,guardTimer,landTimer,finishTimer].forEach(clearTimeout);loadTimer=guardTimer=landTimer=finishTimer=0;};
  const notify=()=>document.dispatchEvent(new Event('cinematic-intro-visibility'));
  function resetPosition(){
    for(const prop of ['position','margin','top','left','width','height','maxHeight','aspectRatio','borderRadius','zIndex','opacity'])card.style[prop]='';
  }
  function cleanup(){
    token++;clearTimers();video.pause();video.removeAttribute('src');video.load();
    overlay.hidden=true;overlay.classList.remove('is-landing','is-vanishing');resetPosition();
    document.body.classList.remove('cinematic-intro-playing');running=false;ending=false;notify();
  }
  // Transition from the final empty meadow to the ACTUAL onscreen homepage Dodo box.
  function finish(immediate=false){
    if(!running||ending)return;
    ending=true;clearTimers();video.pause();
    if(immediate||reduced.matches||!home||!home.getClientRects().length){cleanup();return;}
    // Restore the homepage's natural position before measuring its actual box.
    if(document.getElementById('home-view')?.hidden){cleanup();return;}
    const from=card.getBoundingClientRect(),to=home.getBoundingClientRect();
    if(!to.width||!to.height){cleanup();return;}
    const seq=++token;
    card.style.position='fixed';card.style.margin='0';card.style.aspectRatio='auto';card.style.maxHeight='none';
    card.style.left=from.left+'px';card.style.top=from.top+'px';
    card.style.width=from.width+'px';card.style.height=from.height+'px';
    card.style.borderRadius=getComputedStyle(card).borderRadius;
    // Force initial geometry before changing target values on the next paint.
    void card.offsetWidth;
    requestAnimationFrame(()=>{
      if(!running||seq!==token)return;
      overlay.classList.add('is-landing');
      card.style.top=to.top+'px';card.style.left=to.left+'px';
      card.style.width=to.width+'px';card.style.height=to.height+'px';
      card.style.borderRadius=getComputedStyle(home).borderRadius;
    });
    // Fade the already-shrunk video away, then resume the homepage mascot.
    landTimer=setTimeout(()=>{if(!running||seq!==token)return;overlay.classList.add('is-vanishing');},760);
    finishTimer=setTimeout(()=>{if(running&&seq===token)cleanup();},960);
  }
  function permitted(){return authConfirmed&&document.getElementById('auth-modal')?.hidden===true&&!document.hidden;}
  function start(force=false){
    // Called after Firebase confirms an allowlisted account; manual replay uses that same state.
    if(!force)authConfirmed=true;
    if(running||!permitted()||reduced.matches)return;
    if(!force){
      try{if(sessionStorage.getItem(KEY)==='1')return;}catch{}
      if(location.hash&&location.hash!=='#home')return;
      try{sessionStorage.setItem(KEY,'1');}catch{}
    }
    clearTimers();token++;
    // Navigate home for a deliberately requested replay from another section.
    if(force){
      document.querySelector('.nav-link[data-section="home"]')?.click();
      document.getElementById('close-sidebar')?.click();
      window.scrollTo({top:0,behavior:'instant'});
    }
    running=true;ending=false;
    resetPosition();overlay.classList.remove('is-landing','is-vanishing');
    document.body.classList.add('cinematic-intro-playing');overlay.hidden=false;notify();
    const portrait=matchMedia('(orientation: portrait)').matches;
    video.src=portrait?'./cinematic-assets/dodo-intro-mobile.mp4':'./cinematic-assets/dodo-intro-desktop.mp4';
    video.muted=true;video.playsInline=true;video.currentTime=0;video.load();
    const seq=token;
    loadTimer=setTimeout(()=>{if(seq===token&&running&&video.readyState<2)cleanup();},4500);
    guardTimer=setTimeout(()=>{if(seq===token&&running)cleanup();},14000);
    const promise=video.play();if(promise?.catch)promise.catch(()=>{if(seq===token&&running)cleanup();});
  }
  skip.addEventListener('click',()=>finish(true));
  replay?.addEventListener('click',()=>{if(permitted())start(true);});
  video.addEventListener('ended',()=>finish());
  video.addEventListener('error',()=>{if(running)cleanup();});
  video.addEventListener('playing',()=>{clearTimeout(loadTimer);loadTimer=0;});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&running)cleanup();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&running)finish(true);});
  // cancel() is called by Firebase on sign-out; replay is unavailable until authorised again.
  window.OurSpaceIntro={start,cancel:()=>{authConfirmed=false;if(running)cleanup();},replay:()=>start(true)};
})();
