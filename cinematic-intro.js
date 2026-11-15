/* Our Space's cinematic opening. Auth-gated, plays once per tab session. */
(()=>{
  'use strict';
  const overlay=document.getElementById('cinematic-intro');
  const video=document.getElementById('cinematic-intro-video');
  const skip=document.getElementById('cinematic-intro-skip');
  if(!overlay||!video||!skip)return;
  const KEY='our-space-dodo-cinematic-intro-v1';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let running=false,finished=false,loadTimer=0,guardTimer=0,fadeTimer=0;
  function sendVisibility(){document.dispatchEvent(new Event('cinematic-intro-visibility'));}
  function cleanup(){
    clearTimeout(loadTimer);clearTimeout(guardTimer);clearTimeout(fadeTimer);
    video.pause();video.removeAttribute('src');video.load();
    overlay.hidden=true;overlay.classList.remove('is-ending');
    document.body.classList.remove('cinematic-intro-playing');
    running=false;sendVisibility();
  }
  function finish(immediately=false){
    if(!running||finished)return;
    finished=true;
    clearTimeout(loadTimer);clearTimeout(guardTimer);
    video.pause();
    if(immediately||reduced.matches){cleanup();return;}
    overlay.classList.add('is-ending');
    fadeTimer=setTimeout(cleanup,570);
  }
  function start(){
    if(running||finished||reduced.matches)return;
    try{if(sessionStorage.getItem(KEY)==='1')return;}catch{}
    // Do not interrupt deep-linked destination pages.
    if(location.hash&&location.hash!=='#home')return;
    try{sessionStorage.setItem(KEY,'1');}catch{}
    running=true;finished=false;
    const portrait=matchMedia('(orientation: portrait)').matches;
    const src=portrait?'./cinematic-assets/dodo-intro-mobile.mp4':'./cinematic-assets/dodo-intro-desktop.mp4';
    document.body.classList.add('cinematic-intro-playing');
    overlay.classList.remove('is-ending');overlay.hidden=false;sendVisibility();
    video.src=src;
    video.muted=true;video.playsInline=true;video.currentTime=0;
    video.load();
    // If the video is inaccessible or network-stalled, never block the app.
    loadTimer=setTimeout(()=>{if(video.readyState<2)finish(true);},4500);
    guardTimer=setTimeout(()=>finish(true),13000);
    const play=video.play();
    if(play?.catch)play.catch(()=>finish(true));
  }
  skip.addEventListener('click',()=>finish(true));
  video.addEventListener('ended',()=>finish());
  video.addEventListener('error',()=>finish(true));
  video.addEventListener('playing',()=>clearTimeout(loadTimer));
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&running)finish(true);});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&running)finish(true);});
  // A sign-out or account revocation hides this immediately, without another intro.
  window.OurSpaceIntro={start,cancel:()=>finish(true)};
})();
