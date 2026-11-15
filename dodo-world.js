/* Dodo's World: self-contained, no Firebase changes, no shared game state. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const overlay=$('dodo-world-overlay'),open=$('dodo-world-open'),close=$('dodo-world-close');
  const scene=$('dodo-world-scene'),bird=$('dodo-world-bird'),sprite=$('dodo-world-sprite');
  const barn=$('dodo-world-barn'),caption=$('dodo-world-caption'),home=$('dodo-home');
  if(!overlay||!open||!close||!scene||!bird||!sprite||!barn||!caption)return;
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  const rates={idle:76,idle_look_at_camera:86,walk:55,run:48,peck:55,jump:65,squawk:60,whacked:62};
  const art={};
  const random=(a,b)=>a+Math.random()*(b-a);
  const choose=xs=>xs[Math.floor(Math.random()*xs.length)];
  let loaded=false,visible=false,asleep=false,x=43,facing='left',state='rest';
  let token=0,raf=0,timeout=0,previousFocus=null,roamCount=0;
  const reset=()=>{++token;if(raf)cancelAnimationFrame(raf);if(timeout)clearTimeout(timeout);raf=0;timeout=0;};
  const schedule=(callback,delay)=>{const t=token;timeout=setTimeout(()=>{timeout=0;if(visible&&!document.hidden&&t===token)callback();},delay);};
  function setX(value){x=Math.max(7,Math.min(93,value));bird.style.left=`${x}%`;}
  function setFacing(direction){facing=direction;bird.classList.toggle('is-right',direction==='right');}
  function draw(name,index){const m=art[name];if(!m)return;
    index=Math.max(0,Math.min(m.frameCount-1,index));
    const col=index%m.columns,row=Math.floor(index/m.columns);
    sprite.style.backgroundImage=`url('./dodo-assets/${name}.webp')`;
    sprite.style.backgroundSize=`${m.columns*100}% ${m.rows*100}%`;
    sprite.style.backgroundPosition=`${m.columns<=1?0:col*100/(m.columns-1)}% ${m.rows<=1?0:row*100/(m.rows-1)}%`;
  }
  // One animation runner drives both the frames and horizontal movement.
  function animate(name,ms,done,travel){
    reset();state=name;const t=token,m=art[name];if(!m)return;
    const rate=rates[name]||75;let start,prev=-1;
    if(travel)setFacing(travel.to>travel.from?'right':'left');
    function tick(now){
      if(t!==token||!visible||document.hidden)return;
      if(start===undefined)start=now;
      const elapsed=now-start,progress=Math.min(1,elapsed/ms);
      const index=Math.min(m.frameCount-1,Math.floor(elapsed/rate)%m.frameCount);
      if(prev!==index){draw(name,index);prev=index;}
      if(travel)setX(travel.from+(travel.to-travel.from)*progress);
      if(progress>=1){raf=0;done?.();return;}
      raf=requestAnimationFrame(tick);
    }
    raf=requestAnimationFrame(tick);
  }
  function idle(){
    if(asleep)return;
    reset();state='idle';caption.textContent='Tap Dodo for a surprise, or tap his barn for a nap.';
    if(motion.matches){draw('idle',0);return;}
    const t=token,m=art.idle;let start,prev=-1;
    function tick(now){if(t!==token||!visible||document.hidden)return;
      if(start===undefined)start=now;
      const index=Math.floor((now-start)/rates.idle)%m.frameCount;
      if(index!==prev){draw('idle',index);prev=index;}
      raf=requestAnimationFrame(tick);
    }
    raf=requestAnimationFrame(tick);
    schedule(decide,random(3500,6500));
  }
  function decide(){
    if(asleep||!visible)return;
    const r=Math.random();
    if(r<.25){animate('idle_look_at_camera',art.idle_look_at_camera.frameCount*rates.idle_look_at_camera,idle);return;}
    const isRun=r>.73;
    let destination=random(12,82);
    if(Math.abs(destination-x)<16)destination=x<47?random(58,83):random(12,36);
    roamCount++;
    const speed=isRun?95:43; // percentage of meadow per second
    const duration=Math.max(480,Math.abs(destination-x)/speed*1000);
    caption.textContent=isRun?'Dodo has somewhere very important to be.':'Just out for a little wander…';
    animate(isRun?'run':'walk',duration,idle,{from:x,to:destination});
  }
  function react(){if(!visible||asleep||!loaded||state==='going-to-barn')return;
    if(motion.matches)return;
    const reaction=choose(['jump','peck','squawk','whacked']);
    animate(reaction,art[reaction].frameCount*rates[reaction],idle);
  }
  function goToBarn(){
    if(!visible||!loaded)return;
    if(asleep){wake();return;}
    reset();state='going-to-barn';caption.textContent='Off to his little barn…';
    if(motion.matches){fallAsleep();return;}
    const to=70;const duration=Math.max(420,Math.abs(to-x)/42*1000);
    animate('walk',duration,fallAsleep,{from:x,to});
    state='going-to-barn';
  }
  function fallAsleep(){reset();asleep=true;state='sleeping';bird.classList.add('is-sleeping');barn.classList.add('is-sleeping');barn.setAttribute('aria-label','Wake Dodo up');caption.textContent='Shhh… Dodo is having a little nap. Tap the barn to wake him.';}
  function wake(){
    reset();asleep=false;bird.classList.remove('is-sleeping');barn.classList.remove('is-sleeping');barn.setAttribute('aria-label','Send Dodo to his barn to sleep');
    setX(70);setFacing('left');draw('idle',0);caption.textContent='Up you get, sleepy Dodo!';
    if(motion.matches){idle();return;}
    schedule(()=>animate('walk',780,idle,{from:70,to:48}),450);
  }
  async function load(){
    if(loaded)return;
    const response=await fetch('./dodo-world-sprites.json',{cache:'no-cache'});
    if(!response.ok)throw Error('Missing Dodo world sprite metadata');
    Object.assign(art,await response.json());loaded=true;
    // The run sprite only loads when the world is first opened.
    for(const name of Object.keys(art)){const image=new Image();image.src=`./dodo-assets/${name}.webp`;}
  }
  function resume(){if(!visible||document.hidden||!loaded)return;
    if(asleep){fallAsleep();return;}
    if(motion.matches){reset();draw('idle',0);return;}
    idle();
  }
  async function show(){
    if(!overlay.hidden)return;
    previousFocus=document.activeElement;
    overlay.hidden=false;document.body.classList.add('dodo-world-opened');visible=true;
    close.focus();
    caption.textContent='Waking up Dodo’s world…';
    try{await load();if(!visible)return;
      bird.classList.toggle('is-sleeping',asleep);
      barn.classList.toggle('is-sleeping',asleep);
      resume();
    }catch(err){caption.textContent='Dodo’s world could not load. Try refreshing.';console.warn('Dodo world:',err);}
  }
  function hide(){
    if(overlay.hidden)return;
    visible=false;reset();overlay.hidden=true;document.body.classList.remove('dodo-world-opened');
    previousFocus?.focus?.();
  }
  open.addEventListener('click',show);
  close.addEventListener('click',hide);
  overlay.addEventListener('click',e=>{if(e.target===overlay)hide();});
  document.addEventListener('keydown',e=>{
    if(overlay.hidden)return;
    if(e.key==='Escape'){e.preventDefault();hide();}
    if(e.key==='Tab'){
      const focusable=[close,barn,bird];
      const current=focusable.indexOf(document.activeElement);
      if(e.shiftKey&&current<=0){e.preventDefault();barn.focus();}
      else if(!e.shiftKey&&current===focusable.length-1){e.preventDefault();close.focus();}
    }
  });
  bird.addEventListener('click',react);
  bird.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();react();}});
  barn.addEventListener('click',e=>{e.stopPropagation();goToBarn();});
  document.addEventListener('visibilitychange',()=>{if(!visible)return;if(document.hidden)reset();else resume();});
  motion.addEventListener?.('change',()=>{if(visible)resume();});
  // The auth overlay hides the button, preventing opening before login.
})();
