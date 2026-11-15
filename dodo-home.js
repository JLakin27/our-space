/* Our Dodo: sprite-sheet mascot. No Firebase writes or account tracking. */
(()=>{
  'use strict';
  const home=document.getElementById('dodo-home');
  const sprite=document.getElementById('dodo-home-sprite');
  const character=document.getElementById('dodo-home-character');
  const hint=document.getElementById('dodo-home-hint');
  const view=document.getElementById('home-view');
  if(!home||!sprite||!character||!hint||!view)return;

  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const timing={idle:76,idle_look_at_camera:86,walk:55,peck:55,jump:65,squawk:60,whacked:62,die:80};
  const rand=(min,max)=>min+Math.random()*(max-min);
  const pick=list=>list[Math.floor(Math.random()*list.length)];
  const art={};let ready=false,active=false,inViewport=false,away=false,mode='stopped';
  let raf=0,timer=0,epoch=0,departureAt=0,summoned=false;

  function cancel(){epoch++;if(raf)cancelAnimationFrame(raf);raf=0;if(timer)clearTimeout(timer);timer=0;}
  function later(fn,ms){if(!active)return;const token=epoch;timer=setTimeout(()=>{timer=0;if(active&&token===epoch)fn();},ms);}
  function position(p){character.style.transform=`translateX(calc(${p}% - 12%))`;}
  function frame(name,index=0){const m=art[name];if(!m)return;
    const n=Math.max(0,Math.min(m.frameCount-1,index)),col=n%m.columns,row=Math.floor(n/m.columns);
    sprite.style.backgroundImage=`url('./dodo-assets/${name}.webp')`;
    sprite.style.backgroundSize=`${m.columns*100}% ${m.rows*100}%`;
    sprite.style.backgroundPosition=`${m.columns===1?0:col*100/(m.columns-1)}% ${m.rows===1?0:row*100/(m.rows-1)}%`;
  }
  function updateHint(){
    const exploring=away||mode==='leaving'||mode==='called';
    const returning=mode==='returning';
    home.classList.toggle('is-away',exploring);
    home.classList.toggle('is-returning',returning);
    hint.classList.toggle('is-away',exploring);
    if(returning){
      hint.textContent='Call me back';
      home.setAttribute('aria-label','Dodo is walking back');
    }else if(exploring){
      hint.textContent='Call me back';
      home.setAttribute('aria-label','Tap to call Dodo back');
    }else{
      hint.textContent='Tap me!';
      home.setAttribute('aria-label','Tap Dodo for a reaction');
    }
  }
  function playable(){return ready&&document.getElementById('auth-modal')?.hidden===true&&!document.hidden&&!view.hidden&&home.getClientRects().length>0&&inViewport;}
  function stop(){cancel();active=false;mode='stopped';}

  // Continuous, gentle idle movement when he's home (not a static base frame).
  // RAF only runs while the actual home scene is in view and the tab is visible.
  function idle(){
    if(!active)return;cancel();away=false;mode='idle';position(0);updateHint();
    const token=epoch,m=art.idle,rate=timing.idle;let start=null,prev=-1;
    function tick(now){if(!active||epoch!==token)return;if(start===null)start=now;
      const f=Math.floor((now-start)/rate)%m.frameCount;if(f!==prev){frame('idle',f);prev=f;}
      raf=requestAnimationFrame(tick);
    }
    raf=requestAnimationFrame(tick);
    const remaining=departureAt-Date.now();
    // Look around once or twice, then naturally wander off around every 25–40 seconds.
    if(remaining<=8000)later(leave,Math.max(0,remaining));
    else later(look,Math.min(rand(8500,13000),remaining-1500));
  }
  function play(name,done,options={}){
    cancel();mode=name;const token=epoch,m=art[name],rate=timing[name];
    const duration=options.duration||m.frameCount*rate;
    let first=null,last=-1;
    function tick(now){if(!active||epoch!==token)return;if(first===null)first=now;
      const elapsed=now-first,frac=Math.min(1,elapsed/duration);
      const f=Math.min(m.frameCount-1,Math.floor(elapsed/rate)%m.frameCount);
      if(f!==last){frame(name,f);last=f;}
      if(options.travel)position(options.travel.from+(options.travel.to-options.travel.from)*frac);
      if(frac>=1){raf=0;if(done)done();return;}
      raf=requestAnimationFrame(tick);
    }
    raf=requestAnimationFrame(tick);
  }
  function look(){if(!active||away)return;play('idle_look_at_camera',()=>{if(active)idle();});}
  function leave(){
    if(!active||away)return;
    summoned=false;
    // His sprite naturally faces LEFT, so he walks out to the left.
    play('walk',()=>{
      if(!active)return;
      away=true;mode='away';position(-130);frame('idle',0);updateHint();
      if(summoned)requestReturn();
      else later(returnHome,rand(10000,17000));
    },{duration:1150,travel:{from:0,to:-130}});
    mode='leaving';updateHint();
  }
  function walkIn(){
    if(!active)return;
    summoned=false;away=false;
    position(130);
    // Enter from the RIGHT, facing LEFT, without mirroring the artwork.
    play('walk',()=>{
      if(!active)return;
      departureAt=Date.now()+rand(25000,40000);
      idle();
    },{duration:1150,travel:{from:130,to:0}});
    mode='returning';updateHint();
  }
  function returnHome(){
    // Natural returns are immediate, unlike calling him with the bell.
    if(!active||mode==='returning'||mode==='called')return;
    walkIn();
  }
  function requestReturn(){
    if(!active||mode==='called'||mode==='returning')return;
    if(mode==='leaving'){
      // Finish walking out before honouring the call; never interrupt into a trick.
      summoned=true;updateHint();return;
    }
    if(!away)return;
    summoned=true;
    cancel();mode='called';updateHint();
    // A brief half-second beat before the Dodo walks back in.
    later(walkIn,500);
  }
  function react(){if(!active)return;away=false;position(0);
    play(pick(['peck','jump','squawk','whacked','die']),()=>{if(!active)return;departureAt=Date.now()+rand(25000,40000);idle();});
  }
  function begin(){if(!playable()||active)return;active=true;away=false;summoned=false;position(0);
    if(reduce.matches){cancel();mode='static';frame('idle',0);updateHint();return;}
    departureAt=Date.now()+rand(25000,40000);idle();
  }
  function reevaluate(){if(!playable()){if(active)stop();return;}begin();}
  home.addEventListener('click',()=>{
    if(!active||reduce.matches)return;
    // Call-back and trick reactions are intentionally mutually exclusive.
    if(mode==='called'||mode==='returning')return;
    if(away||mode==='leaving'){
      requestReturn();
      return;
    }
    react();
  });
  document.addEventListener('visibilitychange',reevaluate);
  reduce.addEventListener?.('change',()=>{stop();reevaluate();});
  new MutationObserver(reevaluate).observe(view,{attributes:true,attributeFilter:['hidden']});
  new MutationObserver(reevaluate).observe(document.getElementById('auth-modal'),{attributes:true,attributeFilter:['hidden']});
  const observer=new IntersectionObserver(entries=>{inViewport=entries[0]?.isIntersecting??false;reevaluate();},{threshold:.08});
  observer.observe(home);
  fetch('./dodo-assets/sprites.json').then(r=>{if(!r.ok)throw Error('Missing dodo sprites');return r.json();}).then(data=>{
    Object.assign(art,data);ready=true;
    // Load only the few animation sheets used here.
    for(const key of ['idle','idle_look_at_camera','walk','peck','jump','squawk','whacked','die']){
      const img=new Image();img.src=`./dodo-assets/${key}.webp`;
    }
    frame('idle',0);updateHint();reevaluate();
  }).catch(err=>console.warn('Dodo could not load:',err));
})();
