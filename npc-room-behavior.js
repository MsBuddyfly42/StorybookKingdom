/* Storybook Kingdom — NPCs use the room instead of idling in place */
(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
let timer=0;
function root(){return $('#livingWorld')} function stage(){return $('#worldStage')}
function furniture(){
 return $$('.realism-furniture .furniture',stage()||document).filter(f=>!f.classList.contains('wall')&&!f.classList.contains('ceiling'))
}
function chooseTarget(npc,i){
 const items=furniture();if(!items.length)return null;
 const preferred=items[(i+Math.floor(Date.now()/7000))%items.length];
 const x=parseFloat(preferred.style.left)||50,y=parseFloat(preferred.style.top)||60;
 return {x,y,el:preferred}
}
function wanderNPC(npc,i){
 if(!npc||npc.classList.contains('play-near')||npc.classList.contains('conversation-focus'))return;
 const target=chooseTarget(npc,i);if(!target)return;
 const current=parseFloat(npc.style.left)||20+i*27;
 const nx=Math.max(10,Math.min(90,target.x+(i%2?-5:5)));
 const bottom=Math.max(18,Math.min(40,100-target.y+3));
 npc.classList.add('npc-room-walk');
 npc.dataset.facing=nx<current?'left':'right';
 npc.style.transition='left 2.2s ease-in-out,bottom 2.2s ease-in-out';
 npc.style.left=nx+'%';npc.style.bottom=bottom+'%';
 setTimeout(()=>{npc.classList.remove('npc-room-walk');npc.classList.add('npc-room-use');setTimeout(()=>npc.classList.remove('npc-room-use'),1800)},2200)
}
function cycle(){
 if(document.hidden||root()?.hidden)return;
 $$('.world-npc',stage()||document).forEach((n,i)=>{if(Math.random()<.55)wanderNPC(n,i)})
}
function mount(){
 if(!root()||!stage())return false;
 clearInterval(timer);timer=setInterval(cycle,6500);
 document.addEventListener('storybook:location',()=>setTimeout(cycle,2500));
 return true
}
function wait(){if(mount())return;const mo=new MutationObserver(()=>{if(mount())mo.disconnect()});mo.observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait);else wait();
})();