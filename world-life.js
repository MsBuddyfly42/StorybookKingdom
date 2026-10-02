/* Storybook Kingdom — ambient life, collectibles and exploration rewards */
(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const KEY='storybook_world_life_v1';
const load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}};
const state={charms:0,found:{},milestones:[],...load()};
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(state))}catch{}};
let timer=0,scene='',wanderTimer=0,collectTimer=0;
const root=()=>$('#livingWorld'),stage=()=>$('#worldStage');
const clean=s=>(s||'').replace(/^[^a-zA-Z]+/,'').trim();
function toast(text){
 let e=$('#lifeToast');if(!e){e=document.createElement('div');e.id='lifeToast';e.className='life-toast';document.body.appendChild(e)}
 e.textContent=text;e.classList.add('show');clearTimeout(e.t);e.t=setTimeout(()=>e.classList.remove('show'),2100)
}
function updateHud(){
 const n=$('#lifeCharms');if(n)n.textContent='✨ '+state.charms+' charms';
 const v=parseInt(($('#worldVisitCount')?.textContent||'0').match(/\d+/)?.[0]||'0',10);
 const marks=[{n:10,id:'wanderer',name:'Kingdom Wanderer'},{n:25,id:'pathfinder',name:'Royal Pathfinder'},{n:50,id:'legend',name:'Storybook Legend'}];
 marks.forEach(m=>{if(v>=m.n&&!state.milestones.includes(m.id)){state.milestones.push(m.id);save();toast('🏅 Achievement: '+m.name)}});
 const badge=$('#lifeMilestone');if(badge)badge.textContent=v+' places discovered';
}
function addCompass(){
 const hud=$('#playHud');if(!hud)return;
 let c=$('#lifeCompass');if(!c){c=document.createElement('div');c.id='lifeCompass';c.className='life-compass';hud.insertAdjacentElement('afterend',c)}
 const roads=$$('#worldRoads .world-road').slice(0,4);
 c.innerHTML='<strong>🧭 Nearby paths</strong><div>'+roads.map(r=>'<span>'+escapeHTML((r.textContent||'').trim())+'</span>').join('')+'</div><small id="lifeMilestone"></small><b id="lifeCharms"></b>';
 updateHud()
}
function escapeHTML(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function seedCollectibles(){
 const st=stage();if(!st)return;
 let layer=$('#lifeCollectibles',st);if(!layer){layer=document.createElement('div');layer.id='lifeCollectibles';layer.className='life-collectibles';st.appendChild(layer)}
 layer.replaceChildren();
 const name=clean($('#worldTitle')?.textContent), key=name.toLowerCase();
 const already=state.found[key]||0, max=3;
 const pts=[[31,67],[68,54],[53,31]];
 for(let i=already;i<max;i++){
   const b=document.createElement('button');b.type='button';b.className='life-collectible';b.dataset.index=i;b.setAttribute('aria-label','Collect a story charm');
   b.style.left=pts[i][0]+'%';b.style.top=pts[i][1]+'%';b.textContent=['✦','❈','✧'][i];
   b.addEventListener('click',e=>{if(e.detail===0)collect(b,key)});layer.appendChild(b)
 }
}
function collect(el,key){
 if(!el||el.classList.contains('taken'))return;
 el.classList.add('taken');state.charms++;state.found[key]=(state.found[key]||0)+1;save();updateHud();
 document.dispatchEvent(new CustomEvent('storybook:collect',{detail:{location:clean($('#worldTitle')?.textContent),charms:state.charms}}));
 toast('✨ Story charm collected · '+state.charms+' total');setTimeout(()=>el.remove(),320)
}
function proximityCollect(){
 const p=$('#worldActor'),st=stage();if(!p||!st||root()?.hidden)return;
 const pr=p.getBoundingClientRect(), pc={x:pr.left+pr.width/2,y:pr.top+pr.height/2};
 $$('.life-collectible',st).forEach(el=>{
   const r=el.getBoundingClientRect(),dx=(r.left+r.width/2)-pc.x,dy=(r.top+r.height/2)-pc.y;
   if(Math.hypot(dx,dy)<55)collect(el,clean($('#worldTitle')?.textContent).toLowerCase())
 })
}
function wander(){
 if(matchMedia('(prefers-reduced-motion: reduce)').matches||root()?.classList.contains('ux-motion-pause'))return;
 $$('.world-npc',stage()||document).forEach((n,i)=>{
   if(n.classList.contains('play-near'))return;
   const current=parseFloat(n.style.left)||20+i*27;
   const delta=((i%2?1:-1)*(3+Math.random()*4));
   n.style.transition='left 2.4s ease-in-out';
   n.style.left=Math.max(10,Math.min(88,current+delta))+'%'
 })
}
function sceneChanged(){
 const name=clean($('#worldTitle')?.textContent);if(!name||name===scene)return;scene=name;
 setTimeout(()=>{addCompass();seedCollectibles();updateHud()},90)
}
function mount(){
 if(!root()||!stage())return false;
 document.addEventListener('storybook:location',sceneChanged);
 const obs=new MutationObserver(sceneChanged);obs.observe($('#worldTitle'),{childList:true,subtree:true,characterData:true});
 clearInterval(wanderTimer);wanderTimer=setInterval(wander,3200);
 clearInterval(collectTimer);collectTimer=setInterval(proximityCollect,120);
 new MutationObserver(updateHud).observe($('#worldVisitCount'),{childList:true,subtree:true,characterData:true});
 sceneChanged();return true
}
function wait(){if(mount())return;const mo=new MutationObserver(()=>{if(mount())mo.disconnect()});mo.observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait);else wait();
})();