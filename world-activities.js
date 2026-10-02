/* Storybook Kingdom — playable location activities and mini-games */
(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const KEY='storybook_world_activities_v1';
const load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}};
const state={coins:0,wins:0,badges:[],plays:0,...load()};
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(state))}catch{}};
let active=null,timer=0,raf=0,needle=0,dir=1,sequence=[],input=[];
const activities=[
 {re:/moonharbor|pier|lighthouse/i,id:'fishing',name:'Harbor Fishing',icon:'🎣',type:'timing',reward:3,badge:'Harbor Angler',prompt:'Stop the marker inside the golden catch zone.'},
 {re:/tournament grounds/i,id:'archery',name:'Royal Archery',icon:'🏹',type:'timing',reward:4,badge:'Royal Archer',prompt:'Release your shot when the marker reaches the center.'},
 {re:/kitchen|pantry|bakery|hearth & honey/i,id:'baking',name:'Royal Baking',icon:'🥧',type:'memory',reward:3,badge:'Kingdom Baker',prompt:'Remember the ingredient order, then repeat it.'},
 {re:/ballroom/i,id:'dance',name:'Ballroom Steps',icon:'💃',type:'timing',reward:4,badge:'Ballroom Dancer',prompt:'Hit the beat as the marker crosses the glowing center.'},
 {re:/garden|arbor|orchard|maze/i,id:'garden',name:'Garden Gathering',icon:'🌷',type:'memory',reward:3,badge:'Garden Keeper',prompt:'Remember the flower pattern and repeat it.'},
 {re:/library|bookmark|archive/i,id:'riddle',name:'Library Riddle',icon:'📚',type:'memory',reward:4,badge:'Royal Scholar',prompt:'Remember the rune sequence from the old page.'},
 {re:/aqueduct|cavern|tunnel|cellar|passage|belowstairs|foundation/i,id:'lantern',name:'Lantern Trial',icon:'🏮',type:'timing',reward:4,badge:'Lantern Keeper',prompt:'Steady the lantern when the flame reaches the safe zone.'},
 {re:/academy|schoolhouse|abbey/i,id:'lesson',name:'Scholar’s Memory',icon:'🎓',type:'memory',reward:4,badge:'Academy Scholar',prompt:'Study the symbol sequence and repeat it.'},
 {re:/festival green|festival|market square/i,id:'rings',name:'Festival Ring Toss',icon:'🎯',type:'timing',reward:3,badge:'Festival Champion',prompt:'Time your throw when the marker reaches the target.'},
 {re:/stables/i,id:'stable',name:'Stable Challenge',icon:'🐴',type:'memory',reward:3,badge:'Stable Friend',prompt:'Remember the grooming order and repeat it.'}
];
const timingRanges={fishing:[42,60],archery:[46,55],dance:[44,58],lantern:[40,62],rings:[45,57]};
const symbols={
 baking:['🥚','🍯','🌾','🍎'],
 garden:['🌹','🌷','🌻','🪻'],
 riddle:['✦','◈','☾','♛'],
 lesson:['📜','🗺️','✒️','🔔'],
 stable:['🪮','🥕','🪣','🧲']
};
function clean(s){return (s||'').replace(/^[^A-Za-z]+/,'').trim()}
function place(){return clean($('#worldTitle')?.textContent)}
function activityFor(){const p=place();return activities.find(a=>a.re.test(p))}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function station(){
 const st=$('#worldStage');if(!st)return;
 $('#activityStation')?.remove();
 const a=activityFor();if(!a)return;
 const b=document.createElement('button');b.id='activityStation';b.className='world-hotspot activity-station';b.type='button';b.style.left='82%';b.style.top='46%';
 b.innerHTML='<span>'+a.icon+'</span><small>'+escapeHTML(a.name)+'</small>';
 b.addEventListener('click',e=>{if(e.detail===0)open(a)});
 st.appendChild(b)
}
function overlay(){
 let o=$('#activityOverlay');
 if(o)return o;
 o=document.createElement('div');o.id='activityOverlay';o.className='activity-overlay';o.hidden=true;
 o.innerHTML='<section class="activity-card"><div class="activity-head"><div><small>LOCATION ACTIVITY</small><h2 id="activityTitle"></h2></div><button id="activityClose" type="button" aria-label="Close">✕</button></div><p id="activityPrompt"></p><div id="activityGame"></div><div class="activity-footer"><span id="activityStatus"></span><button id="activityAgain" type="button" hidden>Play again</button></div></section>';
 document.body.appendChild(o);$('#activityClose').addEventListener('click',close);$('#activityAgain').addEventListener('click',()=>open(active));o.addEventListener('click',e=>{if(e.target===o)close()});return o
}
function open(a){
 active=a;state.plays++;save();
 const o=overlay();o.hidden=false;$('#activityTitle').textContent=a.icon+' '+a.name;$('#activityPrompt').textContent=a.prompt;$('#activityStatus').textContent='';$('#activityAgain').hidden=true;
 if(a.type==='timing')startTiming(a);else startMemory(a)
}
function close(){cancelAnimationFrame(raf);clearTimeout(timer);const o=$('#activityOverlay');if(o)o.hidden=true}
function startTiming(a){
 const game=$('#activityGame');needle=8;dir=1;
 const range=timingRanges[a.id]||[44,58];
 game.innerHTML='<div class="timing-game"><div class="timing-track"><i class="timing-target" style="left:'+range[0]+'%;width:'+(range[1]-range[0])+'%"></i><b id="timingNeedle"></b></div><button id="timingStop" type="button">STOP</button></div>';
 const n=$('#timingNeedle'),stop=$('#timingStop');let last=performance.now();
 function tick(now){const dt=Math.min(.04,(now-last)/1000);last=now;needle+=dir*58*dt;if(needle>=96){needle=96;dir=-1}if(needle<=4){needle=4;dir=1}n.style.left=needle+'%';raf=requestAnimationFrame(tick)}
 stop.addEventListener('click',()=>{cancelAnimationFrame(raf);stop.disabled=true;const win=needle>=range[0]&&needle<=range[1];finish(win,a)});
 raf=requestAnimationFrame(tick)
}
function makeSeq(a){
 const pool=symbols[a.id]||['✦','◈','☾','♛'];const len=4+Math.min(2,Math.floor(state.wins/5));
 return Array.from({length:len},()=>pool[Math.floor(Math.random()*pool.length)])
}
function startMemory(a){
 const game=$('#activityGame');sequence=makeSeq(a);input=[];
 const pool=symbols[a.id]||['✦','◈','☾','♛'];
 game.innerHTML='<div class="memory-game"><div id="memoryDisplay">'+sequence.join(' ')+'</div><p id="memoryHint">Study the sequence…</p><div id="memoryChoices">'+pool.map(s=>'<button type="button" data-symbol="'+s+'">'+s+'</button>').join('')+'</div></div>';
 $$('#memoryChoices button').forEach(b=>b.disabled=true);
 timer=setTimeout(()=>{const d=$('#memoryDisplay');if(d)d.textContent='? ? ? ?';const h=$('#memoryHint');if(h)h.textContent='Repeat the sequence';$$('#memoryChoices button').forEach(b=>{b.disabled=false;b.addEventListener('click',()=>pick(b.dataset.symbol,a))})},1800)
}
function pick(symbol,a){
 input.push(symbol);const d=$('#memoryDisplay');if(d)d.textContent=input.join(' ');
 const i=input.length-1;if(input[i]!==sequence[i]){finish(false,a);return}
 if(input.length===sequence.length)finish(true,a)
}
function finish(win,a){
 const status=$('#activityStatus');$$('#activityGame button').forEach(b=>b.disabled=true);
 if(win){
  state.wins++;state.coins+=a.reward;if(!state.badges.includes(a.badge))state.badges.push(a.badge);save();
  status.textContent='✨ Success! +'+a.reward+' kingdom coins · '+a.badge;
  document.dispatchEvent(new CustomEvent('storybook:activity-win',{detail:{activity:a.id,reward:a.reward,coins:state.coins,badge:a.badge}}))
 }else status.textContent='Almost! Try again when you’re ready.';
 $('#activityAgain').hidden=false;renderWallet()
}
function renderWallet(){
 let w=$('#activityWallet');
 if(!w){
  const compass=$('#lifeCompass');if(!compass)return;
  w=document.createElement('b');w.id='activityWallet';w.className='activity-wallet';compass.appendChild(w)
 }
 w.textContent='🪙 '+state.coins+' coins'
}
function addInventory(){
 const body=$('#shellInventoryBody');if(!body||$('#activityBadges'))return;
 const box=document.createElement('section');box.id='activityBadges';box.className='activity-badges';box.innerHTML='<h3>Activity Badges</h3><div></div>';body.appendChild(box);
 const list=box.querySelector('div');list.innerHTML=state.badges.length?state.badges.map(x=>'<span>🏅 '+escapeHTML(x)+'</span>').join(''):'<p>No activity badges yet.</p>'
}
function mount(){
 const root=$('#livingWorld');if(!root)return false;
 overlay();document.addEventListener('storybook:location',()=>setTimeout(()=>{station();renderWallet()},100));
 new MutationObserver(()=>{station();renderWallet();if($('#shellInventoryBody'))addInventory()}).observe(root,{subtree:true,childList:true});
 station();renderWallet();return true
}
function wait(){if(mount())return;const mo=new MutationObserver(()=>{if(mount())mo.disconnect()});mo.observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait);else wait();
})();