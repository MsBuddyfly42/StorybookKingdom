/* Storybook Kingdom — spatial physics, room boundaries and depth */
(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const gameState={lastX:50,lastY:78,blocked:false};
function root(){return $('#livingWorld')}
function stage(){return $('#worldStage')}
function actor(){return $('#worldActor')}
function pctRect(el){
 const st=stage();if(!st||!el)return null;
 const sr=st.getBoundingClientRect(),r=el.getBoundingClientRect();
 if(!sr.width||!sr.height)return null;
 return {
  l:(r.left-sr.left)/sr.width*100,r:(r.right-sr.left)/sr.width*100,
  t:(r.top-sr.top)/sr.height*100,b:(r.bottom-sr.top)/sr.height*100
 }
}
function playerPos(){
 const a=actor();if(!a)return {x:50,y:78};
 const x=parseFloat(a.style.left)||50,y=parseFloat(a.style.top)||78;
 return {x,y}
}
function bounds(){
 const mode=root()?.dataset.realism||'outdoor',scene=root()?.dataset.scene||root()?.dataset.zone||'town';
 if(mode==='interior')return {l:9,r:91,t:25,b:86};
 if(mode==='underground')return {l:8,r:92,t:23,b:87};
 if(scene==='harbor')return {l:7,r:93,t:27,b:86};
 return {l:5,r:95,t:22,b:88}
}
function furnitureRects(){
 return $$('.realism-furniture .furniture',stage()||document).map(el=>{
  const r=pctRect(el);if(!r)return null;
  const pad=el.classList.contains('large')?2.7:el.classList.contains('table')?3.4:1.7;
  return {l:r.l-pad,r:r.r+pad,t:r.t-pad,b:r.b+pad,el}
 }).filter(Boolean)
}
function npcRects(){
 return $('.world-npc',stage()||document).map(el=>{const r=pctRect(el);return r?{...r,el}:null}).filter(Boolean)
}
function portalRects(){
 return $$('.play-portal',stage()||document).map(el=>{const r=pctRect(el);return r?{...r,el}:null}).filter(Boolean)
}
function inside(x,y,r,pad=0){return x>r.l-pad&&x<r.r+pad&&y>r.t-pad&&y<r.b+pad}
function nearestPortal(x,y){
 let best=null,d=Infinity;
 portalRects().forEach(r=>{
  const cx=(r.l+r.r)/2,cy=(r.t+r.b)/2,n=Math.hypot(cx-x,cy-y);
  if(n<d){d=n;best={r,d}}
 });
 return best
}
function canStand(x,y){
 const b=bounds();
 if(x<b.l||x>b.r||y<b.t||y>b.b)return false;
 const near=nearestPortal(x,y);
 for(const n of npcRects()){
  if(inside(x,y,n,0.6)){
   const cx=(n.l+n.r)/2,cy=(n.t+n.b)/2;
   if(Math.hypot(cx-x,cy-y)<4.2)return false
  }
 }
 for(const r of furnitureRects()){
  if(inside(x,y,r,1.5)){
   if(near&&near.d<8)return true;
   return false
  }
 }
 return true
}
function correct(){
 const a=actor();if(!a||root()?.hidden)return;
 let {x,y}=playerPos(),b=bounds();
 x=Math.max(b.l,Math.min(b.r,x));y=Math.max(b.t,Math.min(b.b,y));
 if(!canStand(x,y)){
  x=gameState.lastX;y=gameState.lastY;gameState.blocked=true;showBlocked()
 }else{
  gameState.lastX=x;gameState.lastY=y;gameState.blocked=false
 }
 const nx=x+'%',ny=y+'%';if(a.style.left!==nx)a.style.left=nx;if(a.style.top!==ny)a.style.top=ny;
 depth(y);
 faceNearby();
}
function depth(y){
 const a=actor();if(!a)return;
 const min=.78,max=1.08,scale=min+(Math.max(24,Math.min(88,y))-24)/(88-24)*(max-min);
 const ds=scale.toFixed(3);if(a.style.getPropertyValue('--depth-scale')!==ds)a.style.setProperty('--depth-scale',ds);
 a.style.zIndex=String(20+Math.round(y));
 $$('.world-npc',stage()||document).forEach(n=>{
  const r=pctRect(n);if(!r)return;
  const cy=(r.t+r.b)/2,ns=min+(Math.max(24,Math.min(88,cy))-24)/(88-24)*(max-min);
  const nd=ns.toFixed(3);if(n.style.getPropertyValue('--npc-depth')!==nd)n.style.setProperty('--npc-depth',nd);n.style.zIndex=String(18+Math.round(cy))
 })
}
function approachPose(){
 const a=actor(),near=$('.play-near',stage()||document);if(!a)return;
 a.classList.toggle('near-door',!!near?.classList.contains('play-portal'));
 a.classList.toggle('near-person',!!near?.classList.contains('world-npc'));
 if(near?.classList.contains('play-portal')){
  const r=pctRect(near);if(r){const cx=(r.l+r.r)/2;a.dataset.facing=cx<playerPos().x?'left':'right'}
 }
}
function faceNearby(){
 const a=actor();if(!a)return;
 const pos=playerPos(),near=$('.play-near',stage()||document);
 if(!near)return;
 const r=pctRect(near);if(!r)return;
 const cx=(r.l+r.r)/2;
 a.dataset.facing=cx<pos.x?'left':'right';
 approachPose();
 if(near.classList.contains('world-npc')){
  const nr=pctRect(near),nx=(nr.l+nr.r)/2;
  near.dataset.facing=pos.x<nx?'left':'right'
 }
}
function showBlocked(){
 let e=$('#physicsHint',stage());if(!e){e=document.createElement('div');e.id='physicsHint';e.className='physics-hint';e.textContent='You can’t walk through that.';stage()?.appendChild(e)}
 e.classList.add('show');clearTimeout(e.t);e.t=setTimeout(()=>e.classList.remove('show'),600)
}
function markFloor(){
 const st=stage();if(!st)return;
 let grid=$('#walkableFloor',st);if(!grid){grid=document.createElement('div');grid.id='walkableFloor';grid.className='walkable-floor';st.appendChild(grid)}
 const b=bounds();grid.style.left=b.l+'%';grid.style.right=(100-b.r)+'%';grid.style.top=b.t+'%';grid.style.bottom=(100-b.b)+'%'
}
function mount(){
 if(!root()||!stage()||!actor())return false;
 gameState.lastX=playerPos().x;gameState.lastY=playerPos().y;
 document.addEventListener('storybook:location',()=>setTimeout(()=>{const p=playerPos();gameState.lastX=p.x;gameState.lastY=p.y;markFloor();correct()},140));
 new MutationObserver(()=>{markFloor();correct()}).observe(root(),{attributes:true,attributeFilter:['data-realism','data-scene','data-zone']});
 setInterval(()=>{if(!document.hidden&&!root().hidden)correct()},70);
 markFloor();correct();return true
}
function wait(){if(mount())return;const mo=new MutationObserver(()=>{if(mount())mo.disconnect()});mo.observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait);else wait();
})();