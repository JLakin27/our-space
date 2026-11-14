/* Tiny Dodo home: no Firebase access, no storage, no background animation. */
(()=>{
  'use strict';
  const home=document.getElementById('dodo-home');
  const sprite=document.getElementById('dodo-home-sprite');
  const character=document.getElementById('dodo-home-character');
  const view=document.getElementById('home-view');
  if(!home||!sprite||!character||!view)return;

  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
  const timings={base:90,idle:76,idle_look_at_camera:80,walk:55,peck:55,jump:65,squawk:60};
  const rand=(a,b)=>a+Math.random()*(b-a);
  let sheets={},ready=false,visible=false,away=false,mode='rest',handle=0,clock=0,epoch=0;
  const imageCache=[];

  function clear(){epoch++;if(handle)clearTimeout(handle);handle=0;if(clock)cancelAnimationFrame(clock);clock=0;}
  function schedule(fn,ms){if(!visible)return;const token=epoch;handle=setTimeout(()=>{handle=0;if(token===epoch&&visible)fn();},ms);}
  function draw(name,frame=0){const m=sheets[name];if(!m)return;const i=Math.max(0,Math.min(m.frameCount-1,frame));const c=i%m.columns,r=Math.floor(i/m.columns);
    sprite.style.backgroundImage=`url("./dodo-assets/${name}.webp")`;
    sprite.style.backgroundSize=`${m.columns*100}% ${m.rows*100}%`;
    sprite.style.backgroundPosition=`${m.columns===1?0:c*100/(m.columns-1)}% ${m.rows===1?0:r*100/(m.rows-1)}%`;
  }
  // Sprite artwork is visually right-heavy inside its transparent frame.
  // Centre its visible body in the little scene without editing the purchased art.
  const place=p=>{character.style.transform=`translateX(calc(${p}% - 12%))`;};
  function stop(){clear();visible=false;mode='rest';}
  function isUsable(){return ready&&!document.hidden&&!view.hidden&&home.getClientRects().length>0;}
  // Play only a finite action. Between actions, the sprite is a completely still frame.
  function clip(name,done,options={}){
    clear();mode=name;const token=epoch;const m=sheets[name],duration=(options.duration||m.frameCount*timings[name]);
    let first=0,lastFrame=-1;
    function tick(now){if(token!==epoch||!visible)return;if(!first)first=now;
      const t=Math.min(1,(now-first)/duration);
      const f=Math.min(m.frameCount-1,Math.floor((now-first)/timings[name])%m.frameCount);
      if(f!==lastFrame){draw(name,f);lastFrame=f;}
      if(options.travel){place(options.travel.from+(options.travel.to-options.travel.from)*t);}
      if(t>=1){clock=0;if(done)done();return;}
      clock=requestAnimationFrame(tick);
    }
    clock=requestAnimationFrame(tick);
  }
  function rest(){if(!visible)return;clear();mode='rest';away=false;place(0);draw('base',0);schedule(chooseActivity,rand(11000,19000));}
  function chooseActivity(){if(!visible||mode!=='rest')return;
    // After several quiet moments he occasionally takes a little walk.
    if(Math.random()<.33){leave();return;}
    clip('idle_look_at_camera',()=>{if(visible)rest();});
  }
  function leave(){if(!visible||away)return;mode='leaving';clip('walk',()=>{away=true;mode='away';place(130);draw('base',0);schedule(returnHome,rand(15000,26000));},{duration:1150,travel:{from:0,to:130}});}
  function returnHome(){if(!visible)return;away=false;mode='returning';place(130);clip('walk',()=>{if(visible)rest();},{duration:1050,travel:{from:130,to:0}});}
  function callBack(){if(!visible)return;clear();away=false;place(130);mode='returning';clip('walk',()=>{if(visible)rest();},{duration:850,travel:{from:130,to:0}});}
  function react(){if(!visible)return;const choices=['peck','jump','squawk'];const picked=choices[Math.floor(Math.random()*choices.length)];place(0);clip(picked,()=>{if(visible)rest();});}
  function start(){if(!isUsable()||visible)return;visible=true;if(reduce.matches){mode='still';place(0);draw('base',0);return;}away=false;place(0);clip('idle',()=>{if(visible)rest();});}
  function reevaluate(){const should=isUsable();if(!should){if(visible)stop();return;}if(!visible)start();}
  home.addEventListener('click',()=>{if(!visible||reduce.matches)return;if(away||mode==='leaving'||mode==='returning')callBack();else react();});
  document.addEventListener('visibilitychange',reevaluate);
  reduce.addEventListener?.('change',()=>{stop();reevaluate();});
  const observer=new IntersectionObserver(()=>reevaluate(),{threshold:.08});observer.observe(home);
  // Ensure changes from the site's normal client-side navigation pause the mascot.
  const navObserver=new MutationObserver(reevaluate);navObserver.observe(view,{attributes:true,attributeFilter:['hidden']});
  fetch('./dodo-assets/sprites.json').then(r=>{if(!r.ok)throw Error('Dodo artwork metadata missing');return r.json()}).then(m=>{
    sheets=m;ready=true;
    Object.keys(m).forEach(k=>{const img=new Image();img.src='./dodo-assets/'+k+'.webp';imageCache.push(img);});
    draw('base',0);reevaluate();
  }).catch(err=>{console.warn('Dodo artwork did not load:',err);home.setAttribute('aria-label','Dodo is resting');});
})();
