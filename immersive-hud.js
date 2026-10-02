/* Storybook Kingdom — cinematic HUD auto-hide */
(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const KEY='storybook_cinematic_hud_v1';
const load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}};
const state={enabled:true,...load()};
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(state))}catch{}};
let idleTimer=0;
function root(){return $('#livingWorld')}
function wake(){
 const r=root();if(!r||r.hidden)return;
 r.classList.remove('hud-resting');
 clearTimeout(idleTimer);
 if(state.enabled&&!$('#gameShellOverlay')?.hidden===false)return;
 if(state.enabled)idleTimer=setTimeout(rest,4200)
}
function rest(){
 const r=root();if(!r||r.hidden||!state.enabled)return;
 if(!$('#gameShellOverlay')?.hidden||$('#worldAtlas')?.classList.contains('open')||$('.activity-overlay:not([hidden]),.shop-overlay:not([hidden]),.home-overlay:not([hidden])'))return;
 r.classList.add('hud-resting')
}
function renderToggle(){
 const b=$('#cinematicHudToggle');if(b)b.textContent=state.enabled?'🎬 Cinematic HUD: On':'🧭 Cinematic HUD: Off'
}
function addToggle(){
 const box=$('#worldCycleControls');if(!box||$('#cinematicHudToggle'))return;
 const b=document.createElement('button');b.id='cinematicHudToggle';b.type='button';box.querySelector('div')?.appendChild(b);
 b.addEventListener('click',()=>{state.enabled=!state.enabled;save();root()?.classList.remove('hud-resting');renderToggle();wake()});renderToggle()
}
function important(){
 wake();
 setTimeout(wake,160)
}
function mount(){
 const r=root();if(!r)return false;
 ['pointermove','pointerdown','touchstart','keydown'].forEach(ev=>document.addEventListener(ev,wake,{passive:true}));
 ['storybook:interact','storybook:location','storybook:collect','storybook:activity-win','storybook:purchase','storybook:room-use'].forEach(ev=>document.addEventListener(ev,important));
 const mo=new MutationObserver(()=>{addToggle();wake()});mo.observe(document.body,{subtree:true,childList:true});
 addToggle();wake();return true
}
function wait(){if(mount())return;const mo=new MutationObserver(()=>{if(mount())mo.disconnect()});mo.observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait);else wait();
})();