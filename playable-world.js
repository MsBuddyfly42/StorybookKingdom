/* Storybook Kingdom — turn the Living World into a controllable 2D game */
(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const game={
  mounted:false,active:false,x:50,y:76,facing:'right',
  keys:new Set(),raf:0,last:0,near:null,portals:[],observer:null,
  speed:24,moveTarget:null,pendingSpawn:null,sceneTimer:0
};
function root(){return $('#livingWorld')}
function stage(){return $('#worldStage')}
function player(){return $('#worldActor')}
function isTyping(){return /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName||'')}
function pctPos(el){
  const st=stage();if(!st||!el)return null;
  const sr=st.getBoundingClientRect(), r=el.getBoundingClientRect();
  if(!sr.width||!sr.height)return null;
  return {x:((r.left+r.width/2-sr.left)/sr.width)*100,y:((r.top+r.height/2-sr.top)/sr.height)*100};
}
function setPlayer(){
  const p=player();if(!p)return;
  p.style.left=game.x+'%';p.style.top=game.y+'%';
  p.dataset.facing=game.facing;
}
function distance(a,b){
  const dx=(a.x-b.x)*1.35,dy=(a.y-b.y);
  return Math.hypot(dx,dy);
}
function targetLabel(t){
  if(!t)return '';
  if(t.type==='portal')return 'Travel to '+t.label;
  if(t.type==='npc')return 'Talk to '+t.label;
  return t.label;
}
function collectTargets(){
  const st=stage();if(!st)return [];
  const list=[];
  $$('.world-hotspot',st).forEach((el,i)=>{const p=pctPos(el);if(p)list.push({type:'object',el,pos:p,label:el.querySelector('small')?.textContent||'Explore',action:()=>el.click()})});
  $$('.world-npc',st).forEach((el,i)=>{const p=pctPos(el);if(p)list.push({type:'npc',el,pos:p,label:el.querySelector('small')?.textContent||'Someone',action:()=>el.click()})});
  game.portals.forEach(p=>{const pos=pctPos(p.el);if(pos)list.push({...p,pos})});
  return list;
}
function updateNear(){
  const here={x:game.x,y:game.y};
  let nearest=null,best=Infinity;
  collectTargets().forEach(t=>{const d=distance(here,t.pos);if(d<best){best=d;nearest=t}});
  $$('.play-near',stage()||document).forEach(el=>el.classList.remove('play-near'));
  game.near=best<=13?nearest:null;
  if(game.near?.el)game.near.el.classList.add('play-near');
  const label=$('#playObjective'),btn=$('#playInteract'),mobile=$('#playActionMobile');
  if(game.near){
    const txt=targetLabel(game.near);
    if(label)label.textContent='Nearby: '+txt;
    if(btn){btn.disabled=false;btn.textContent='✦ '+txt}
    if(mobile){mobile.disabled=false;mobile.classList.add('ready');mobile.textContent='INTERACT'}
  }else{
    if(label)label.textContent='Walk near a person, object, doorway, or road to interact.';
    if(btn){btn.disabled=true;btn.textContent='✦ Nothing nearby'}
    if(mobile){mobile.disabled=true;mobile.classList.remove('ready');mobile.textContent='INTERACT'}
  }
}
function interact(){
  if(!game.active||!game.near)return;
  const t=game.near;
  game.moveTarget=null;
  document.dispatchEvent(new CustomEvent('storybook:interact',{detail:{type:t.type,label:t.label,location:$('#worldTitle')?.textContent||''}}));
  if(t.el)t.el.classList.remove('play-near');
  game.near=null;
  t.action();
  setTimeout(()=>{buildPortals();updateNear()},140);
}
function move(dx,dy,dt){
  if(!game.active)return;
  if(dx||dy)game.moveTarget=null;
  const boost=game.keys.has('shift')?1.65:1;
  const scale=game.speed*boost*dt;
  if(dx){game.x=clamp(game.x+dx*scale,5,95);game.facing=dx<0?'left':'right'}
  if(dy)game.y=clamp(game.y+dy*scale,18,88);
  const p=player();if(p)p.classList.toggle('is-moving',!!(dx||dy));
  setPlayer();updateNear();
}
function frame(ts){
  if(!game.active){game.raf=requestAnimationFrame(frame);return}
  const dt=Math.min(.034,(ts-game.last)/1000||.016);game.last=ts;
  let dx=0,dy=0;
  if(game.keys.has('arrowleft')||game.keys.has('a'))dx--;
  if(game.keys.has('arrowright')||game.keys.has('d'))dx++;
  if(game.keys.has('arrowup')||game.keys.has('w'))dy--;
  if(game.keys.has('arrowdown')||game.keys.has('s'))dy++;
  if(!dx&&!dy&&game.moveTarget){
    const tx=game.moveTarget.x-game.x,ty=game.moveTarget.y-game.y,dist=Math.hypot(tx,ty);
    if(dist<1.2){game.moveTarget=null}
    else{dx=tx/dist;dy=ty/dist}
  }
  if(dx&&dy&&!game.moveTarget){dx*=.707;dy*=.707}
  move(dx,dy,dt);
  game.raf=requestAnimationFrame(frame);
}
function buildPortals(){
  const st=stage(),roads=$$('#worldRoads .world-road');if(!st)return;
  let layer=$('#playPortals',st);
  if(!layer){layer=document.createElement('div');layer.id='playPortals';layer.className='play-portals';st.appendChild(layer)}
  layer.replaceChildren();game.portals=[];
  const positions=[
    [10,73],[90,73],[22,27],[78,27],[50,22],[50,71],[14,42],[86,42]
  ];
  roads.slice(0,8).forEach((road,i)=>{
    const [x,y]=positions[i%positions.length];
    const door=document.createElement('div');
    door.className='play-portal';
    door.style.left=x+'%';door.style.top=y+'%';
    const label=(road.textContent||'Next location').trim();
    door.innerHTML='<span class="play-door">'+(i<2?'🚪':'🛤️')+'</span><small>'+label.replace(/[<>&]/g,'')+'</small>';
    layer.appendChild(door);
    game.portals.push({type:'portal',el:door,label,action:()=>{
      game.pendingSpawn=x<25?{x:88,y:76}:x>75?{x:12,y:76}:y<40?{x:50,y:82}:{x:50,y:30};
      road.click();
    }});
  });
  updateNear();
}
function resetPlayer(){
  const spawn=game.pendingSpawn;game.pendingSpawn=null;
  game.x=spawn?.x??50;game.y=spawn?.y??78;game.facing=game.x>50?'left':'right';setPlayer();
  const p=player();if(p)p.classList.remove('is-moving');
}
function sceneChanged(){
  if(!root()||root().hidden)return;
  clearTimeout(game.sceneTimer);
  game.sceneTimer=setTimeout(()=>{
    game.active=true;root().classList.add('play-mode');
    resetPlayer();buildPortals();updateNear();showTip();
    document.dispatchEvent(new CustomEvent('storybook:location',{detail:{name:$('#worldTitle')?.textContent||'',zone:root().dataset.zone||''}}));
  },55);
}
let tipTimer=0;
function showTip(){
  const tip=$('#playInstructions');if(!tip)return;
  tip.classList.add('show');clearTimeout(tipTimer);tipTimer=setTimeout(()=>tip.classList.remove('show'),3000);
}
function addHud(){
  const st=stage();if(!st||$('#playHud'))return;
  const hud=document.createElement('div');hud.id='playHud';hud.className='play-hud';
  hud.innerHTML='<div><strong>🎮 Play Mode</strong><div class="play-help">Move: Arrow Keys / WASD · Interact: E or Space · Mobile: on-screen controls</div></div><button id="playInteract" class="play-interact" type="button" disabled>✦ Nothing nearby</button><div id="playObjective" class="play-objective">Walk near something to interact.</div>';
  st.insertAdjacentElement('beforebegin',hud);
  $('#playInteract').addEventListener('click',interact);
  const controls=document.createElement('div');controls.className='play-controls';controls.setAttribute('aria-label','Movement controls');
  controls.innerHTML='<button class="up" type="button" data-dir="up" aria-label="Move up">▲</button><button class="left" type="button" data-dir="left" aria-label="Move left">◀</button><button class="down" type="button" data-dir="down" aria-label="Move down">▼</button><button class="right" type="button" data-dir="right" aria-label="Move right">▶</button>';
  st.appendChild(controls);
  const action=document.createElement('button');action.id='playActionMobile';action.className='play-action-mobile';action.type='button';action.disabled=true;action.textContent='INTERACT';action.addEventListener('click',interact);st.appendChild(action);
  const tip=document.createElement('div');tip.id='playInstructions';tip.className='play-instructions';tip.textContent='Walk around the scene. When something glows, press E or INTERACT.';st.appendChild(tip);
  $$('.play-controls button',st).forEach(btn=>{
    const map={up:'arrowup',down:'arrowdown',left:'arrowleft',right:'arrowright'};
    const key=map[btn.dataset.dir];
    const down=e=>{e.preventDefault();game.keys.add(key);btn.setPointerCapture?.(e.pointerId)};
    const up=e=>{e.preventDefault();game.keys.delete(key)};
    btn.addEventListener('pointerdown',down);btn.addEventListener('pointerup',up);btn.addEventListener('pointercancel',up);btn.addEventListener('lostpointercapture',up);
  });
}
function patchLabels(){
  const start=$('#livingWorldStart');if(start)start.textContent='🎮 Play Storybook Kingdom';
  const nav=[...document.querySelectorAll('button')].find(b=>(b.textContent||'').includes('Explore Every Location'));if(nav)nav.textContent='🎮 Play the Whole Kingdom';
  const old=$('#immersiveStartBtn');if(old)old.textContent='🎬 Story Mode';
  const exp=$('.mode-card.forest h2');if(exp)exp.textContent='Playable World';
  const p=$('.mode-card.forest p');if(p)p.textContent='Control your character and walk through the castle, village, forest, market, harbor, gardens, cottages, and hidden paths.';
  const b=$('.mode-card.forest button');if(b)b.textContent='Start Playing';
}
function mount(){
  const r=root(),st=stage();if(!r||!st)return false;
  if(game.mounted)return true;game.mounted=true;
  addHud();patchLabels();
  r.setAttribute('aria-label','Playable Storybook Kingdom');
  game.observer=new MutationObserver(muts=>{
    let changed=false;
    for(const m of muts){
      if(m.target.id==='worldTitle'||m.target.id==='worldRoads'||m.target.id==='worldObjects'||m.target.id==='worldActors'||m.target.closest?.('#worldRoads,#worldObjects,#worldActors')){changed=true;break}
    }
    if(changed)setTimeout(sceneChanged,0);
  });
  game.observer.observe(r,{subtree:true,childList:true,characterData:true});
  new MutationObserver(()=>{game.active=!r.hidden;if(game.active)sceneChanged();else game.keys.clear()}).observe(r,{attributes:true,attributeFilter:['hidden']});
  st.addEventListener('click',e=>{
    if(!game.active||e.detail===0)return;
    const target=e.target.closest('.world-hotspot,.world-npc,.play-portal');
    if(!target)return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    const pos=pctPos(target);if(pos){game.moveTarget={x:pos.x,y:clamp(pos.y+5,18,88)};showTip()}
  },true);
  st.addEventListener('pointerdown',e=>{
    if(!game.active||e.target.closest('button,.world-hotspot,.world-npc,.play-portal'))return;
    const r=st.getBoundingClientRect();
    game.moveTarget={x:clamp(((e.clientX-r.left)/r.width)*100,5,95),y:clamp(((e.clientY-r.top)/r.height)*100,18,88)};
  });
  document.addEventListener('keydown',e=>{
    if(!game.active||isTyping())return;
    const k=e.key.toLowerCase();
    if(['arrowleft','arrowright','arrowup','arrowdown','w','a','s','d','shift'].includes(k)){if(k!=='shift')e.preventDefault();game.keys.add(k)}
    if((k==='e'||e.code==='Space')&&!$('#worldAtlas')?.classList.contains('open')){e.preventDefault();interact()}
  });
  document.addEventListener('keyup',e=>game.keys.delete(e.key.toLowerCase()));
  window.addEventListener('blur',()=>game.keys.clear());
  game.raf=requestAnimationFrame(frame);
  if(!r.hidden)sceneChanged();
  return true;
}
function wait(){
  if(mount())return;
  const mo=new MutationObserver(()=>{if(mount())mo.disconnect()});mo.observe(document.body,{childList:true,subtree:true});
  setTimeout(()=>mount(),1000);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait);else wait();
})();
