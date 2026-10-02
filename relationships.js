/* Storybook Kingdom — persistent NPC relationship memory */
(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const KEY='storybook_relationships_v1';
const load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}};
const state={people:{},...load()};
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(state))}catch{}};
const normalize=s=>(s||'Someone').trim();
function info(name){
 const key=normalize(name),r=state.people[key]||{talks:0,places:[],last:''};
 state.people[key]=r;return r
}
function level(r){return r.talks>=8?3:r.talks>=4?2:r.talks>=2?1:0}
function title(l){return ['New acquaintance','Familiar face','Friend of the kingdom','Trusted friend'][l]}
function hearts(l){return ['♡','♥','♥♥','♥♥♥'][l]}
function updateNpcBadges(){
 $$('.world-npc').forEach(n=>{
  const name=n.querySelector('small')?.textContent?.trim();if(!name)return;
  let badge=n.querySelector('.relationship-badge');
  if(!badge){badge=document.createElement('b');badge.className='relationship-badge';n.appendChild(badge)}
  const l=level(info(name));badge.textContent=hearts(l);badge.title=title(l)
 })
}
function memoryLine(name,r){
 const l=level(r),place=($('#worldTitle')?.textContent||'').replace(/^[^a-zA-Z]+/,'').trim();
 if(r.talks===1)return name+' seems pleased to meet you.';
 if(l===1)return name+' recognizes you from your earlier visit.';
 if(l===2)return name+' smiles as soon as you approach. “I was hoping I’d see you again.”';
 return name+' greets you like an old friend. “There you are. I was beginning to wonder where your road had taken you.”'
}
function record(detail){
 if(detail.type!=='npc')return;
 const name=normalize(detail.label),r=info(name);
 r.talks++;
 const place=(detail.location||'').replace(/^[^a-zA-Z]+/,'').trim();
 if(place&&!r.places.includes(place))r.places.push(place);
 r.last=place;save();
 setTimeout(()=>{
  updateNpcBadges();
  const line=$('#worldLine');if(line){
   const extra=memoryLine(name,r);
   if(extra&&!line.textContent.includes(extra))line.textContent=extra+' '+line.textContent
  }
  show(name,r)
 },160)
}
function show(name,r){
 let box=$('#relationshipToast');
 if(!box){box=document.createElement('div');box.id='relationshipToast';box.className='relationship-toast';document.body.appendChild(box)}
 const l=level(r);box.innerHTML='<strong>'+hearts(l)+' '+name+'</strong><span>'+title(l)+' · '+r.talks+' conversation'+(r.talks===1?'':'s')+'</span>';
 box.classList.add('show');clearTimeout(box.t);box.t=setTimeout(()=>box.classList.remove('show'),1800)
}
function panel(){
 const shell=$('#shellInventoryBody');if(!shell||$('#relationshipPanel'))return;
 const wrap=document.createElement('section');wrap.id='relationshipPanel';wrap.className='relationship-panel';
 wrap.innerHTML='<h3>Kingdom Relationships</h3><div id="relationshipList"></div>';
 shell.appendChild(wrap);renderList()
}
function renderList(){
 const list=$('#relationshipList');if(!list)return;
 const rows=Object.entries(state.people).sort((a,b)=>b[1].talks-a[1].talks);
 list.innerHTML=rows.length?rows.map(([name,r])=>'<div><span><b>'+escapeHTML(name)+'</b><small>'+title(level(r))+'</small></span><strong>'+hearts(level(r))+'</strong></div>').join(''):'<p>You have not gotten to know anyone yet.</p>'
}
function escapeHTML(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function mount(){
 const root=$('#livingWorld');if(!root)return false;
 document.addEventListener('storybook:interact',e=>record(e.detail));
 document.addEventListener('storybook:location',()=>setTimeout(updateNpcBadges,130));
 new MutationObserver(()=>{updateNpcBadges();if($('#shellInventoryBody')){panel();renderList()}}).observe(root,{subtree:true,childList:true});
 updateNpcBadges();return true
}
function wait(){if(mount())return;const mo=new MutationObserver(()=>{if(mount())mo.disconnect()});mo.observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait);else wait();
})();