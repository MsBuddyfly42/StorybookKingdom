/* Storybook Kingdom — game shell, player profile, inventory, pause and autosave */
(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const KEY='storybook_player_profile_v1';
const load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}};
const profile={name:'Traveler',avatar:'🧝',...load()};
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(profile))}catch{}};
let mounted=false,saveTimer=0;
function root(){return $('#livingWorld')}
function applyAvatar(){
 const actor=$('#worldActor');if(!actor)return;
 const small=actor.querySelector('small');
 const nodes=[...actor.childNodes].filter(n=>n.nodeType===Node.TEXT_NODE);
 if(nodes.length)nodes[0].nodeValue=profile.avatar;
 else actor.insertBefore(document.createTextNode(profile.avatar),actor.firstChild);
 if(small)small.textContent=(profile.name||'YOU').toUpperCase();
 const label=$('#shellPlayerName');if(label)label.textContent=profile.avatar+' '+profile.name;
}
function showSaved(){
 const e=$('#shellSave');if(!e)return;
 e.textContent='✓ Saved';e.classList.add('on');clearTimeout(saveTimer);saveTimer=setTimeout(()=>e.classList.remove('on'),1200)
}
function readStorage(key){try{return JSON.parse(localStorage.getItem(key)||'{}')}catch{return {}}}
function fillInventory(){
 const living=readStorage('storybook_living_world_v1');
 const life=readStorage('storybook_world_life_v1');
 const game=readStorage('storybook_gameplay_v2');
 const body=$('#shellInventoryBody');if(!body)return;
 const satchel=Array.isArray(living.satchel)?living.satchel:[];
 body.innerHTML='<div class="shell-stat-grid"><span><b>✨ '+(life.charms||0)+'</b><small>Story charms</small></span><span><b>⭐ '+(game.stars||0)+'</b><small>Quest stars</small></span><span><b>🗺️ '+((living.visited||[]).length)+'</b><small>Places discovered</small></span></div><h3>Keepsakes</h3>'+(satchel.length?'<div class="shell-items">'+satchel.slice().reverse().map(x=>'<span>'+escapeHTML(String(x))+'</span>').join('')+'</div>':'<p class="shell-empty">Nothing in your satchel yet. Explore the kingdom and collect discoveries.</p>');
}
function escapeHTML(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function openPanel(id){
 $$('.shell-panel').forEach(p=>p.hidden=true);
 const p=$('#'+id);if(p){p.hidden=false;$('#gameShellOverlay').hidden=false;p.querySelector('button,input')?.focus()}
 if(id==='shellInventory')fillInventory()
 if(id==='shellProfile')syncProfileForm()
}
function closePanels(){$$('.shell-panel').forEach(p=>p.hidden=true);const o=$('#gameShellOverlay');if(o)o.hidden=true}
function syncProfileForm(){
 const name=$('#shellNameInput');if(name)name.value=profile.name;
 $$('.shell-avatar').forEach(b=>b.classList.toggle('selected',b.dataset.avatar===profile.avatar))
}
function build(){
 const r=root(),stage=$('#worldStage');if(!r||!stage||$('#gameShell'))return false;
 const shell=document.createElement('div');shell.id='gameShell';shell.className='game-shell';
 shell.innerHTML='<button id="shellProfileBtn" type="button" class="shell-player"><span id="shellPlayerName"></span><small>Character</small></button><div class="shell-actions"><button id="shellInventoryBtn" type="button">🎒 Bag</button><button id="shellPauseBtn" type="button">☰ Menu</button></div><span id="shellSave" class="shell-save">✓ Saved</span>';
 stage.insertAdjacentElement('beforebegin',shell);

 const overlay=document.createElement('div');overlay.id='gameShellOverlay';overlay.className='game-shell-overlay';overlay.hidden=true;
 overlay.innerHTML=
 '<section id="shellPause" class="shell-panel" hidden><div class="shell-panel-head"><div><small>STORYBOOK KINGDOM</small><h2>Game Menu</h2></div><button type="button" data-shell-close aria-label="Close">✕</button></div><div class="shell-menu-grid"><button type="button" data-shell-action="resume">▶ Resume</button><button type="button" data-shell-action="inventory">🎒 Inventory</button><button type="button" data-shell-action="profile">🧝 Character</button><button type="button" data-shell-action="map">🗺️ Kingdom Map</button></div><div class="shell-controls-card"><h3>Controls</h3><p><b>Move:</b> WASD / Arrow Keys</p><p><b>Sprint:</b> Hold Shift</p><p><b>Interact:</b> E or Space</p><p><b>Map:</b> Alt + M</p><p><b>Menu:</b> P or Escape</p><p><b>Mobile:</b> Use the on-screen D-pad and INTERACT button.</p></div></section>'+
 '<section id="shellInventory" class="shell-panel" hidden><div class="shell-panel-head"><div><small>YOUR ADVENTURE</small><h2>Satchel & Progress</h2></div><button type="button" data-shell-close aria-label="Close">✕</button></div><div id="shellInventoryBody"></div></section>'+
 '<section id="shellProfile" class="shell-panel" hidden><div class="shell-panel-head"><div><small>YOUR CHARACTER</small><h2>Traveler Profile</h2></div><button type="button" data-shell-close aria-label="Close">✕</button></div><label class="shell-name-label">Name<input id="shellNameInput" maxlength="18" autocomplete="off"></label><p class="shell-choice-label">Choose your traveler</p><div class="shell-avatar-grid">'+['🧝','👸','🤴','🧙','🧚','🛡️','🧑‍🌾','🧑‍🎨'].map(a=>'<button class="shell-avatar" type="button" data-avatar="'+a+'" aria-label="Use '+a+'">'+a+'</button>').join('')+'</div><button id="shellSaveProfile" class="shell-primary" type="button">Save Character</button></section>';
 document.body.appendChild(overlay);

 $('#shellPauseBtn').addEventListener('click',()=>openPanel('shellPause'));
 $('#shellInventoryBtn').addEventListener('click',()=>openPanel('shellInventory'));
 $('#shellProfileBtn').addEventListener('click',()=>openPanel('shellProfile'));
 $$('[data-shell-close]').forEach(b=>b.addEventListener('click',closePanels));
 overlay.addEventListener('click',e=>{if(e.target===overlay)closePanels()});
 $$('[data-shell-action]').forEach(b=>b.addEventListener('click',()=>{
  const a=b.dataset.shellAction;
  if(a==='resume')closePanels();
  if(a==='inventory')openPanel('shellInventory');
  if(a==='profile')openPanel('shellProfile');
  if(a==='map'){closePanels();$('#worldAtlasButton')?.click()}
 }));
 $$('.shell-avatar').forEach(b=>b.addEventListener('click',()=>{$$('.shell-avatar').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');profile.avatar=b.dataset.avatar}));
 $('#shellSaveProfile').addEventListener('click',()=>{
  const name=($('#shellNameInput').value||'Traveler').trim().slice(0,18)||'Traveler';
  profile.name=name;save();applyAvatar();showSaved();closePanels()
 });
 document.addEventListener('storybook:location',()=>{applyAvatar();showSaved()});
 document.addEventListener('storybook:interact',showSaved);
 document.addEventListener('storybook:collect',showSaved);
 document.addEventListener('keydown',e=>{
  if(root()?.hidden)return;
  if(/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName||''))return;
  if(e.key.toLowerCase()==='p'){e.preventDefault();openPanel('shellPause')}
  if(e.key==='Escape'){
   if(!$('#gameShellOverlay')?.hidden){e.preventDefault();closePanels()}
   else if(!$('#worldAtlas')?.classList.contains('open')){e.preventDefault();openPanel('shellPause')}
  }
 });
 new MutationObserver(()=>{if(!r.hidden)applyAvatar()}).observe(r,{attributes:true,attributeFilter:['hidden']});
 applyAvatar();return true
}
function wait(){if(build()){mounted=true;return}const mo=new MutationObserver(()=>{if(build()){mounted=true;mo.disconnect()}});mo.observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait);else wait();
})();