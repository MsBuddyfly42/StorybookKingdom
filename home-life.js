/* Storybook Kingdom — playable homes, rest, home base and decoration */
(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const KEY='storybook_home_life_v1',SHOP='storybook_kingdom_shops_v1';
const homes=['Lantern Row Cottage','Castle Guest Chambers','Whisperwood Cottage','Moonharbor Loft',"Abbey Scholar's Room",'Garden Pavilion'];
const load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}};
const state={home:'Lantern Row Cottage',decor:{},...load()};
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(state))}catch{}};
function clean(s){return (s||'').replace(/^[^A-Za-z]+/,'').trim()}
function place(){return clean($('#worldTitle')?.textContent)}
function atHome(){return homes.includes(place())}
function shopState(){try{return JSON.parse(localStorage.getItem(SHOP)||'{}')}catch{return {}}}
const itemIcons={
 'rose-pin':'🌹','gold-crown':'👑','moon-charm':'🌙','lantern-charm':'🏮','blue-ribbon':'🎀','tiny-book':'📕',
 'flower-crown':'🌸','silver-bell':'🔔','sea-shell':'🐚','star-brooch':'⭐','royal-cloak':'🧥','honey-jar':'🍯'
};
function homeStation(){
 $('#homeStation')?.remove();if(!atHome())return;
 const st=$('#worldStage');if(!st)return;
 const b=document.createElement('button');b.id='homeStation';b.type='button';b.className='world-hotspot home-station';b.style.left='50%';b.style.top='28%';
 b.innerHTML='<span>🛏️</span><small>Home & Rest</small>';b.addEventListener('click',e=>{if(e.detail===0)openHome()});st.appendChild(b)
}
function overlay(){
 let o=$('#homeOverlay');if(o)return o;
 o=document.createElement('div');o.id='homeOverlay';o.className='home-overlay';o.hidden=true;document.body.appendChild(o);return o
}
function openHome(){
 const o=overlay(),owned=shopState().owned||[],selected=state.decor[place()]||[];
 o.hidden=false;o.innerHTML='<section class="home-card"><div class="home-head"><div><small>YOUR SPACE</small><h2>🏡 '+escapeHTML(place())+'</h2></div><button id="homeClose" type="button" aria-label="Close">✕</button></div><p>Rest, make this your home base, or decorate it with keepsakes you own.</p><div class="home-actions"><button id="homeSetBase" type="button">'+(state.home===place()?'✓ Home Base':'🏠 Make Home Base')+'</button><button data-rest="morning" type="button">🌅 Sleep Until Morning</button><button data-rest="evening" type="button">🌇 Rest Until Evening</button><button data-rest="night" type="button">🌙 Rest Until Night</button></div><h3>Decorate</h3><div class="home-decor-list">'+(owned.length?owned.map(id=>decorButton(id,selected)).join(''):'<p>Buy keepsakes from kingdom shops to decorate your home.</p>')+'</div></section>';
 $('#homeClose').addEventListener('click',close);o.addEventListener('click',e=>{if(e.target===o)close()});
 $('#homeSetBase').addEventListener('click',()=>{state.home=place();save();notify('🏠 '+place()+' is now your home base.');openHome();updateHomeButton()});
 $$('[data-rest]').forEach(b=>b.addEventListener('click',()=>rest(b.dataset.rest)));
 $$('[data-decor]').forEach(b=>b.addEventListener('click',()=>toggleDecor(b.dataset.decor)))
}
function decorButton(id,selected){
 const icon=itemIcons[id]||'✨',on=selected.includes(id);
 return '<button type="button" data-decor="'+id+'" class="'+(on?'selected':'')+'"><span>'+icon+'</span><small>'+(on?'Placed':'Place')+'</small></button>'
}
function toggleDecor(id){
 const p=place(),arr=[...(state.decor[p]||[])],i=arr.indexOf(id);
 if(i>=0)arr.splice(i,1);else{if(arr.length>=4)arr.shift();arr.push(id)}
 state.decor[p]=arr;save();renderDecor();openHome()
}
function renderDecor(){
 const st=$('#worldStage');if(!st)return;
 let layer=$('#homeDecorLayer');if(!layer){layer=document.createElement('div');layer.id='homeDecorLayer';layer.className='home-decor-layer';st.appendChild(layer)}
 layer.replaceChildren();if(!atHome())return;
 const arr=state.decor[place()]||[],pts=[[24,49],[40,33],[62,34],[76,52]];
 arr.forEach((id,i)=>{const s=document.createElement('span');s.textContent=itemIcons[id]||'✨';s.style.left=pts[i][0]+'%';s.style.top=pts[i][1]+'%';layer.appendChild(s)})
}
function rest(t){
 const select=$('#worldClock');if(select){select.value=t;select.dispatchEvent(new Event('change',{bubbles:true}))}
 close();notify(t==='morning'?'🌅 You wake to a new morning.':t==='evening'?'🌇 The room grows warm with evening light.':'🌙 The kingdom settles into night.');
 const actor=$('#worldActor');if(actor){actor.dataset.pose='sit';setTimeout(()=>actor.dataset.pose='idle',1800)}
 document.dispatchEvent(new CustomEvent('storybook:home-rest',{detail:{home:place(),time:t}}))
}
function goHome(){
 const locs=window.StorybookWorld?.locations?.()||[],h=locs.find(x=>x.name===state.home);
 if(h){$('#gameShellOverlay').hidden=true;$$('.shell-panel').forEach(p=>p.hidden=true);window.StorybookWorld.open(h.id)}
}
function updateHomeButton(){
 const b=$('#shellHomeBtn');if(b)b.textContent='🏡 '+state.home.replace(/ Cottage| Chambers| Loft| Room| Pavilion/,'')
}
function addMenuButton(){
 const grid=$('#shellPause .shell-menu-grid');if(!grid||$('#shellHomeBtn'))return;
 const b=document.createElement('button');b.id='shellHomeBtn';b.type='button';b.addEventListener('click',goHome);grid.appendChild(b);updateHomeButton()
}
function notify(t){
 let n=$('#homeToast');if(!n){n=document.createElement('div');n.id='homeToast';n.className='home-toast';document.body.appendChild(n)}
 n.textContent=t;n.classList.add('show');clearTimeout(n.t);n.t=setTimeout(()=>n.classList.remove('show'),1900)
}
function close(){const o=$('#homeOverlay');if(o)o.hidden=true}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function mount(){
 const root=$('#livingWorld');if(!root)return false;
 overlay();document.addEventListener('storybook:location',()=>setTimeout(()=>{homeStation();renderDecor();addMenuButton()},120));
 document.addEventListener('storybook:purchase',()=>{if(atHome())renderDecor()});
 new MutationObserver(()=>{homeStation();renderDecor();addMenuButton()}).observe(root,{subtree:true,childList:true});
 homeStation();renderDecor();addMenuButton();return true
}
function wait(){if(mount())return;const mo=new MutationObserver(()=>{if(mount())mo.disconnect()});mo.observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait);else wait();
})();