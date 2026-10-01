/* Storybook Kingdom — progressive experience enhancements.
   Additive: existing quests, all kingdom destinations and saved games are preserved. */
(()=>{'use strict';
const $=s=>document.querySelector(s);
const KEY='storybook_ux_v1';
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}};
const state={recent:[],motion:true,...read()};
const persist=()=>{try{localStorage.setItem(KEY,JSON.stringify(state))}catch{}};
let lastName='',worldOpen=false,fxTimer=0,worldObserver,atlasObserver;
const say=t=>{let n=$('#uxLive');if(n){n.textContent='';requestAnimationFrame(()=>n.textContent=t)}};
const world=()=>$('#livingWorld');
const openWorld=()=>world()&&!world().hidden;
const entryFor=name=>window.StorybookWorld?.locations()?.find(p=>p.name===name);
function remember(name){if(!name||name===lastName)return;const entry=entryFor(name);lastName=name;if(!entry)return;state.recent=[entry.id,...state.recent.filter(id=>id!==entry.id)].slice(0,14);persist();updateBar();updateResume()}
function animateArrival(){const root=world();if(!root||matchMedia('(prefers-reduced-motion: reduce)').matches||!state.motion)return;root.classList.remove('ux-entering');void root.offsetWidth;root.classList.add('ux-entering');clearTimeout(fxTimer);fxTimer=setTimeout(()=>root.classList.remove('ux-entering'),800)}
function button(label,fn,cls=''){const b=document.createElement('button');b.type='button';b.textContent=label;if(cls)b.className=cls;b.addEventListener('click',fn);return b}
function goRecent(){const list=window.StorybookWorld?.locations?.()||[];const now=entryFor($('#worldTitle')?.textContent?.replace(/^[^a-zA-Z]+/,'').trim());const dest=state.recent.map(id=>list.find(p=>p.id===id)).find(p=>p&&p.id!==now?.id);if(dest){window.StorybookWorld.open(dest.id);say('Returned to '+dest.name)}}
function updateBar(){const b=$('#uxTravelBar');if(!b)return;const label=b.querySelector('.ux-current');const name=$('#worldTitle')?.textContent?.trim()||'Your kingdom';label.textContent='✧ Exploring '+name;const prev=b.querySelector('#uxPrevious');prev.disabled=state.recent.length<2;const motion=b.querySelector('#uxMotion');motion.textContent=state.motion?'✨ Motion on':'⏸ Motion paused';world()?.classList.toggle('ux-motion-pause',!state.motion)}
function openMap(){const map=$('#worldAtlas');if(!map)return;const trigger=$('#worldAtlasButton');if(!map.classList.contains('open'))trigger?.click();setTimeout(()=>$('#worldSearch')?.focus(),70)}
function closeMap(){const map=$('#worldAtlas');if(map?.classList.contains('open')){$('#worldAtlasClose')?.click();$('#worldAtlasButton')?.focus()}}
function initWorld(){
 const root=world();if(!root||$('#uxTravelBar'))return;
 const bar=document.createElement('nav');bar.id='uxTravelBar';bar.className='ux-travel-bar';bar.setAttribute('aria-label','Quick kingdom travel');
 const label=document.createElement('strong');label.className='ux-current';
 const back=button('↶ Previous place',goRecent);back.id='uxPrevious';back.title='Return to your previously visited location';
 const map=button('🗺️ All locations',openMap);map.title='Search and browse every location';
 const motion=button('',()=>{state.motion=!state.motion;persist();updateBar()});motion.id='uxMotion';motion.title='Pause or resume ambient movement';
 bar.append(label,back,map,motion);
 const scene=$('#worldStage');scene?.insertAdjacentElement('beforebegin',bar);
 const worldTitle=$('#worldTitle');
 let initial=true;
 worldObserver=new MutationObserver(()=>{const name=worldTitle.textContent.replace(/^[^a-zA-Z]+/,'').trim();if(name&&name!==lastName){remember(name);if(!initial)animateArrival();initial=false;say('Arrived at '+name)}});
 worldObserver.observe(worldTitle,{childList:true,characterData:true,subtree:true});
 root.addEventListener('click',e=>{
   const npc=e.target.closest('.world-npc');
   if(npc){root.querySelectorAll('.world-npc').forEach(x=>x.classList.remove('ux-selected'));npc.classList.add('ux-selected');say('Talking to '+(npc.querySelector('small')?.textContent||'your new friend'))}
   const spot=e.target.closest('.world-hotspot');if(spot){spot.classList.add('ux-route-spotlight');setTimeout(()=>spot.classList.remove('ux-route-spotlight'),1100)}
 });
 const atlas=$('#worldAtlas');if(atlas){
   const title=atlas.querySelector('h2');
   if(title&&!title.parentElement.classList.contains('ux-map-head')){const header=document.createElement('div');header.className='ux-map-head';title.parentNode.insertBefore(header,title);header.append(title);const close=$('#worldAtlasClose');if(close)header.append(close)}
   atlas.setAttribute('role','dialog');atlas.setAttribute('aria-modal','true');atlas.setAttribute('aria-label','Search the whole kingdom');
   atlas.setAttribute('aria-hidden','true');
   const mapEntries=$('#worldMapEntries');
   if(mapEntries)mapEntries.setAttribute('aria-label','Destinations');
   atlasObserver=new MutationObserver(()=>{const opened=atlas.classList.contains('open');atlas.setAttribute('aria-hidden',String(!opened));root.classList.toggle('ux-map-open',opened);if(opened&&document.activeElement!==$('#worldSearch')&&!atlas.contains(document.activeElement))$('#worldSearch')?.focus()});
   atlasObserver.observe(atlas,{attributes:true,attributeFilter:['class']});
   $('#worldSearch')?.addEventListener('keydown',e=>{if(e.key==='Enter'){const first=atlas.querySelector('#worldMapEntries [data-place]');if(first){e.preventDefault();first.click();$('#worldAtlasButton')?.focus()}}});
   $('#worldMapEntries')?.addEventListener('click',()=>$('#worldAtlasButton')?.focus());
 }
 root.querySelectorAll('.world-time select').forEach(el=>{el.setAttribute('aria-label',el.closest('label')?.textContent?.trim()||'Scene setting')});
 updateBar();
}
function updateResume(){
 let host=$('#uxResume');const hero=$('.hero-buttons');
 if(!hero)return;
 if(!host){host=document.createElement('div');host.id='uxResume';host.className='ux-resume';hero.insertAdjacentElement('afterend',host)}
 const last=state.recent[0];const entry=window.StorybookWorld?.locations()?.find(x=>x.id===last);
 host.replaceChildren();
 const text=document.createElement('strong');text.textContent=entry?'🏰 Continue your adventure: '+entry.name:'🏰 Your kingdom is ready whenever you are.';
 const btn=button(entry?'Continue exploring →':'Enter the living kingdom →',()=>window.StorybookWorld?.open(entry?.id||'castle-courtyard'));host.append(text,btn);
}
function init(){
 if($('#uxLive'))return;
 const live=document.createElement('div');live.id='uxLive';live.className='ux-live';live.setAttribute('role','status');live.setAttribute('aria-live','polite');document.body.append(live);
 const skip=document.createElement('a');skip.href='#mainContent';skip.className='ux-skip';skip.textContent='Skip to the kingdom';document.body.prepend(skip);
 const main=document.querySelector('main');if(main&&!main.id)main.id='mainContent';else if(main)skip.href='#'+main.id;
 document.querySelectorAll('button').forEach(b=>{if((b.textContent||'').trim()==='✕'&&!b.getAttribute('aria-label'))b.setAttribute('aria-label','Close')});
 const enter=$('#livingWorldStart');if(enter){enter.classList.add('ux-launch');enter.textContent='🏰 Enter the Living Kingdom';enter.setAttribute('aria-label','Enter Storybook Kingdom and explore all destinations')};
 const story=$('#rgStartBtn');if(story){story.classList.add('ux-launch');story.setAttribute('aria-label','Play the castle mystery adventure')};
 initWorld();updateResume();
 document.addEventListener('keydown',e=>{
  const typing=/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName||'');
  if(e.key==='Escape'){if($('#worldAtlas')?.classList.contains('open')){e.preventDefault();closeMap();return}return}
  if(!openWorld())return;
  if((e.key==='/'&&!typing)||(e.altKey&&e.key.toLowerCase()==='m')){e.preventDefault();openMap()}
 });
 const root=world();if(root){new MutationObserver(()=>{const shown=openWorld();if(shown!==worldOpen){worldOpen=shown;if(shown){updateBar();say('Welcome to the Living Kingdom')}else updateResume()}}).observe(root,{attributes:true,attributeFilter:['hidden']})}
 const params=new URLSearchParams(location.search);
 if(params.has('reduce-motion')){state.motion=false;updateBar()}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
