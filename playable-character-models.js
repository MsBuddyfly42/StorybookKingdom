/* Storybook Kingdom — stylized 2D human models for playable characters */
(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const palettes=[
 {skin:'#9c654d',hair:'#241813',cloth:'#714b7e',accent:'#e5c06f'},
 {skin:'#b97858',hair:'#3a281e',cloth:'#3e6289',accent:'#d8ba70'},
 {skin:'#855842',hair:'#1e1818',cloth:'#49665b',accent:'#d0b77a'},
 {skin:'#c48463',hair:'#5a3526',cloth:'#9a5363',accent:'#e9c87e'},
 {skin:'#9a674f',hair:'#35241e',cloth:'#805f48',accent:'#cab17a'},
 {skin:'#7d503c',hair:'#1d1715',cloth:'#4a566d',accent:'#b9c0cb'}
];
function hash(s){let h=0;for(const ch of String(s))h=(h*31+ch.charCodeAt(0))>>>0;return h}
function model(name,player=false){
 const p=palettes[hash(name)%palettes.length],f=(hash(name)%3)!==0;
 const wrap=document.createElement('span');wrap.className='human-model '+(f?'human-f':'human-m')+(player?' human-player':'');
 wrap.style.setProperty('--skin',p.skin);wrap.style.setProperty('--hair',p.hair);wrap.style.setProperty('--cloth',p.cloth);wrap.style.setProperty('--accent',p.accent);
 wrap.innerHTML='<i class="human-shadow"></i><i class="human-leg leg-l"></i><i class="human-leg leg-r"></i><i class="human-arm arm-l"></i><i class="human-arm arm-r"></i><i class="human-body"></i><i class="human-belt"></i><i class="human-neck"></i><i class="human-head"></i><i class="human-hair"></i><i class="human-eye eye-l"></i><i class="human-eye eye-r"></i><i class="human-mouth"></i>';
 return wrap
}
function applyPlayer(){
 const a=$('#worldActor');if(!a)return;
 if(!a.querySelector('.human-model'))a.insertBefore(model('Traveler',true),a.firstChild);
 a.classList.add('humanized')
}
function applyNPC(n){
 if(!n||n.querySelector('.human-model'))return;
 const name=n.querySelector('small')?.textContent?.trim()||'Villager';
 n.insertBefore(model(name,false),n.firstChild);n.classList.add('humanized')
}
function refresh(){
 applyPlayer();$$('.world-npc').forEach(applyNPC)
}
function mount(){
 const root=$('#livingWorld');if(!root)return false;
 refresh();
 document.addEventListener('storybook:location',()=>setTimeout(refresh,120));
 const obs=new MutationObserver(refresh);obs.observe(root,{subtree:true,childList:true});
 return true
}
function wait(){if(mount())return;const mo=new MutationObserver(()=>{if(mount())mo.disconnect()});mo.observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait);else wait();
})();