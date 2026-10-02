/* Storybook Kingdom — achievements and Royal Record */
(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const KEY='storybook_achievements_v1';
const load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}};
const state={earned:[],...load()};
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(state))}catch{}};
const defs=[
 {id:'first-step',icon:'👣',name:'First Steps',desc:'Enter the playable kingdom for the first time.',test:s=>s.visited>=1},
 {id:'wanderer',icon:'🗺️',name:'Kingdom Wanderer',desc:'Discover 10 locations.',test:s=>s.visited>=10},
 {id:'pathfinder',icon:'🧭',name:'Royal Pathfinder',desc:'Discover 25 locations.',test:s=>s.visited>=25},
 {id:'legend',icon:'🏰',name:'Storybook Legend',desc:'Discover 50 locations.',test:s=>s.visited>=50},
 {id:'first-charm',icon:'✨',name:'A Little Magic',desc:'Collect your first story charm.',test:s=>s.charms>=1},
 {id:'charm-hunter',icon:'💫',name:'Charm Hunter',desc:'Collect 20 story charms.',test:s=>s.charms>=20},
 {id:'first-friend',icon:'♥',name:'Familiar Face',desc:'Speak with the same character at least twice.',test:s=>s.maxTalks>=2},
 {id:'trusted',icon:'💞',name:'Trusted Friend',desc:'Build a trusted friendship with a kingdom character.',test:s=>s.maxTalks>=8},
 {id:'quester',icon:'📜',name:'A Story Begins',desc:'Complete your first quest.',test:s=>s.completed>=1},
 {id:'adventurer',icon:'⚔️',name:'Royal Adventurer',desc:'Complete 4 quests.',test:s=>s.completed>=4},
 {id:'all-quests',icon:'👑',name:'Keeper of Eight Tales',desc:'Complete all eight Storybook Kingdom adventures.',test:s=>s.completed>=8},
 {id:'first-win',icon:'🎯',name:'Game On',desc:'Win your first location activity.',test:s=>s.wins>=1},
 {id:'champion',icon:'🏅',name:'Kingdom Champion',desc:'Win 10 location activities.',test:s=>s.wins>=10},
 {id:'shopper',icon:'🛍️',name:'A Fine Purchase',desc:'Buy your first kingdom keepsake.',test:s=>s.owned>=1},
 {id:'collector',icon:'🎁',name:'Royal Collector',desc:'Own 6 purchased keepsakes.',test:s=>s.owned>=6},
 {id:'home',icon:'🏡',name:'Home Sweet Kingdom',desc:'Choose a home base in Storybook Kingdom.',test:s=>!!s.home},
 {id:'decorator',icon:'🌹',name:'Cozy Touches',desc:'Decorate one of your homes with at least three keepsakes.',test:s=>s.decor>=3}
];
function read(key){try{return JSON.parse(localStorage.getItem(key)||'{}')}catch{return {}}}
function snapshot(){
 const living=read('storybook_living_world_v1'),life=read('storybook_world_life_v1'),rel=read('storybook_relationships_v1'),
 game=read('storybook_gameplay_v2'),act=read('storybook_world_activities_v1'),shop=read('storybook_kingdom_shops_v1'),home=read('storybook_home_life_v1');
 const talks=Object.values(rel.people||{}).map(x=>Number(x.talks||0));
 const decor=Math.max(0,...Object.values(home.decor||{}).map(a=>Array.isArray(a)?a.length:0));
 return {
  visited:(living.visited||[]).length,charms:Number(life.charms||0),maxTalks:Math.max(0,...talks),
  completed:(game.completed||[]).length,wins:Number(act.wins||0),owned:(shop.owned||[]).length,
  home:home.home||'',decor
 }
}
function check(){
 const s=snapshot();let changed=false;
 defs.forEach(d=>{if(!state.earned.includes(d.id)&&d.test(s)){state.earned.push(d.id);changed=true;toast(d)}})
 if(changed){save();render()}
}
function toast(d){
 let e=$('#achievementToast');if(!e){e=document.createElement('div');e.id='achievementToast';e.className='achievement-toast';document.body.appendChild(e)}
 e.innerHTML='<span>'+d.icon+'</span><div><small>ACHIEVEMENT UNLOCKED</small><strong>'+d.name+'</strong><p>'+d.desc+'</p></div>';
 e.classList.add('show');clearTimeout(e.t);e.t=setTimeout(()=>e.classList.remove('show'),3000)
}
function openRecord(){
 const p=$('#shellRoyalRecord'),o=$('#gameShellOverlay');if(!p||!o)return;
 $$('.shell-panel').forEach(x=>x.hidden=true);p.hidden=false;o.hidden=false;render();p.querySelector('button')?.focus()
}
function render(){
 const list=$('#achievementList'),count=$('#achievementCount');if(!list)return;
 const earned=new Set(state.earned);
 if(count)count.textContent=earned.size+' of '+defs.length+' achievements';
 list.innerHTML=defs.map(d=>'<article class="'+(earned.has(d.id)?'earned':'locked')+'"><span>'+d.icon+'</span><div><strong>'+d.name+'</strong><p>'+d.desc+'</p></div><b>'+(earned.has(d.id)?'✓':'○')+'</b></article>').join('')
}
function mount(){
 const shell=$('#gameShell'),overlay=$('#gameShellOverlay');if(!shell||!overlay)return false;
 if($('#shellAchievementsBtn'))return true;
 const actions=shell.querySelector('.shell-actions');
 const btn=document.createElement('button');btn.id='shellAchievementsBtn';btn.type='button';btn.textContent='🏅 Record';btn.addEventListener('click',openRecord);actions?.prepend(btn);
 const panel=document.createElement('section');panel.id='shellRoyalRecord';panel.className='shell-panel royal-record';panel.hidden=true;
 panel.innerHTML='<div class="shell-panel-head"><div><small>YOUR STORYBOOK LEGACY</small><h2>Royal Record</h2></div><button id="achievementClose" type="button" aria-label="Close">✕</button></div><p id="achievementCount"></p><div id="achievementList"></div>';
 overlay.appendChild(panel);$('#achievementClose').addEventListener('click',()=>{panel.hidden=true;overlay.hidden=true});
 ['storybook:location','storybook:interact','storybook:collect','storybook:activity-win','storybook:purchase','storybook:home-rest'].forEach(ev=>document.addEventListener(ev,()=>setTimeout(check,80)));
 const mo=new MutationObserver(()=>setTimeout(check,80));mo.observe(document.body,{subtree:true,childList:true});
 check();render();return true
}
function wait(){if(mount())return;const mo=new MutationObserver(()=>{if(mount())mo.disconnect()});mo.observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait);else wait();
})();