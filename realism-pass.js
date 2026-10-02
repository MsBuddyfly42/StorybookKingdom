/* Storybook Kingdom — architectural realism and believable spatial staging */
(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const interiorScenes=new Set(['throne','library','kitchen','ballroom','chapel','nursery','home','hall','tower','academy']);
const outdoorScenes=new Set(['town','harbor','nature','festival','village','realm','exterior']);
const wallDecor={
 throne:['🏳️','🕯️','👑','🕯️','🏳️'],
 library:['📚','🕯️','🪜','🕯️','📚'],
 kitchen:['🪝','🥘','🔥','🫕','🪝'],
 ballroom:['🪞','🕯️','✨','🕯️','🪞'],
 chapel:['🪟','🕯️','✦','🕯️','🪟'],
 nursery:['🖼️','⭐','🧸','⭐','🖼️'],
 home:['🖼️','🕯️','🪟','🕯️','🖼️'],
 hall:['🖼️','🕯️','⚜️','🕯️','🖼️'],
 tower:['🪟','⭐','🔭','⭐','🪟'],
 academy:['🗺️','🕯️','🎓','🕯️','📚'],
 underground:['🪨','🕯️','⛓️','🕯️','🪨']
};
function root(){return $('#livingWorld')}
function stage(){return $('#worldStage')}
function scene(){return root()?.dataset.scene||root()?.dataset.zone||'exterior'}
function clean(s){return (s||'').replace(/^[^A-Za-z]+/,'').trim()}
function ensureArchitecture(){
 const st=stage();if(!st)return;
 let room=$('#realismArchitecture',st);
 if(room)return room;
 room=document.createElement('div');room.id='realismArchitecture';room.className='realism-architecture';
 room.innerHTML='<div class="realism-ceiling"></div><div class="realism-backwall"><div class="realism-wall-decor"></div><div class="realism-baseboard"></div></div><div class="realism-sidewall left"></div><div class="realism-sidewall right"></div><div class="realism-floor-grid"></div><div class="realism-rug"></div><div class="realism-facade"><div class="realism-facade-roof"></div><div class="realism-facade-window w1"></div><div class="realism-facade-window w2"></div><div class="realism-facade-sign"></div></div><div class="realism-path"></div>';
 st.insertBefore(room,st.firstChild);
 return room
}
function setArchitecture(){
 const r=root(),st=stage(),arch=ensureArchitecture();if(!r||!st||!arch)return;
 const sc=scene(),place=clean($('#worldTitle')?.textContent);
 r.dataset.realism=interiorScenes.has(sc)?'interior':sc==='underground'?'underground':'outdoor';
 arch.dataset.theme=sc;
 arch.className='realism-architecture theme-'+sc;
 const decor=arch.querySelector('.realism-wall-decor');
 const icons=wallDecor[sc]||wallDecor.hall;
 decor.innerHTML=icons.map((x,i)=>'<span style="left:'+(10+i*20)+'%">'+x+'</span>').join('');
 const sign=arch.querySelector('.realism-facade-sign');if(sign)sign.textContent=place;
 positionNPCs();
 stylizePortals();
 subtleHotspots();
}
function stylizePortals(){
 const st=stage();if(!st)return;
 const portals=$$('.play-portal',st);
 portals.forEach((p,i)=>{
  p.classList.remove('door-back','door-left','door-right','door-front','route-path','route-gate');
  const x=parseFloat(p.style.left)||50,y=parseFloat(p.style.top)||50;
  const interior=root()?.dataset.realism==='interior'||root()?.dataset.realism==='underground';
  let type;
  if(interior){
   if(x<=18)type='door-left';
   else if(x>=82)type='door-right';
   else if(y<=35)type='door-back';
   else type='door-front';
  }else{
   if(i<2)type='route-gate'; else type='route-path';
  }
  p.classList.add(type);
  const oldIcon=p.querySelector('.play-door');
  if(oldIcon){
   oldIcon.textContent='';
   oldIcon.innerHTML='<i class="door-panel a"></i><i class="door-panel b"></i><i class="door-knob"></i>';
  }
  const label=p.querySelector('small');if(label)label.setAttribute('aria-hidden','true');
 })
}
function positionNPCs(){
 const st=stage();if(!st)return;
 const npcs=$$('.world-npc',st),sc=scene();
 const layouts={
  throne:[[26,72],[50,65],[75,72]],library:[[20,72],[52,72],[80,72]],kitchen:[[24,72],[51,69],[76,72]],
  ballroom:[[23,72],[50,67],[78,72]],chapel:[[25,73],[50,69],[76,73]],nursery:[[27,72],[52,70],[77,72]],
  home:[[25,73],[53,70],[78,73]],hall:[[20,72],[50,67],[81,72]],tower:[[26,72],[51,67],[76,72]],
  academy:[[22,72],[50,68],[78,72]],underground:[[28,72],[53,68],[76,72]],
  town:[[20,75],[51,70],[80,75]],harbor:[[20,70],[50,68],[78,72]],nature:[[22,74],[52,71],[79,74]],
  village:[[22,75],[50,71],[78,75]],festival:[[20,72],[50,68],[81,72]],realm:[[22,73],[51,69],[78,73]]
 };
 const pts=layouts[sc]||layouts.town;
 npcs.forEach((n,i)=>{const pt=pts[i%pts.length];n.style.left=pt[0]+'%';n.style.bottom=(100-pt[1])+'%';n.dataset.staged='true'})
}
function subtleHotspots(){
 const st=stage();if(!st)return;
 $$('.world-hotspot',st).forEach(h=>{
  if(h.id==='activityStation'||h.id==='shopStation'||h.id==='homeStation')return;
  h.classList.add('realism-hotspot');
  const small=h.querySelector('small');if(small)small.setAttribute('aria-hidden','true')
 })
}
function updateDoorLabels(){
 const near=$('.play-portal.play-near',stage()||document);
 $$('.play-portal small',stage()||document).forEach(s=>s.setAttribute('aria-hidden',s.parentElement!==near?'true':'false'));
}
function observer(){
 const st=stage(),r=root();if(!st||!r)return;
 new MutationObserver(()=>{stylizePortals();positionNPCs();subtleHotspots();updateDoorLabels()}).observe(st,{subtree:true,childList:true});
 new MutationObserver(setArchitecture).observe(r,{attributes:true,attributeFilter:['data-scene','data-zone','data-realism']});
 setInterval(updateDoorLabels,250);
}
function mount(){
 if(!root()||!stage())return false;
 ensureArchitecture();setArchitecture();observer();
 document.addEventListener('storybook:location',()=>setTimeout(setArchitecture,90));
 return true
}
function wait(){if(mount())return;const mo=new MutationObserver(()=>{if(mount())mo.disconnect()});mo.observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait);else wait();
})();