/* Storybook Kingdom — daily routines, ambient events and world-state flavor */
(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
let eventTimer=0,routineTimer=0,currentLocation='';
const pools={
 castle:[
  'A page hurries past carrying a stack of sealed letters.',
  'Two guards change posts beside the archway.',
  'A maid opens tall windows and lets fresh air into the hall.',
  'Somewhere upstairs, a bell rings twice.'
 ],
 town:[
  'A delivery cart rattles over the cobblestones.',
  'A shopkeeper steps outside to straighten a hanging sign.',
  'Two neighbors stop to trade gossip beside a flower box.',
  'A child races past with a ribbon kite.'
 ],
 shop:[
  'The shop bell jingles as another customer slips inside.',
  'A clerk rearranges a shelf and dusts the counter.',
  'Someone outside pauses to admire the window display.',
  'A parcel arrives wrapped in brown paper and string.'
 ],
 nature:[
  'A breeze runs through the leaves in a long green ripple.',
  'Birdsong rises from somewhere beyond the path.',
  'A rabbit darts through the grass and disappears.',
  'Sunlight shifts across the trail as clouds pass overhead.'
 ],
 harbor:[
  'Ropes creak softly against a nearby mast.',
  'A gull swoops low over the water.',
  'Dockworkers roll a barrel toward a waiting ship.',
  'A bell sounds from farther down the waterfront.'
 ],
 academy:[
  'A cluster of students crosses the courtyard with books under their arms.',
  'A lecturer closes a classroom door and heads toward the archives.',
  'Pages flutter in an open notebook on a stone bench.',
  'A distant clock marks the hour.'
 ],
 village:[
  'A neighbor carries fresh bread between cottages.',
  'Chickens scatter from the lane as a cart approaches.',
  'Someone shakes out a rug from an upstairs window.',
  'A garden gate swings open in the breeze.'
 ],
 underground:[
  'Water drips steadily somewhere beyond the torchlight.',
  'A loose pebble skitters down the passage.',
  'Your lantern flame leans as a cold draft passes.',
  'A distant echo makes the tunnel feel much larger.'
 ],
 festival:[
  'A trumpet fanfare bursts out from the far side of the grounds.',
  'A vendor calls out the day’s special.',
  'A group of dancers practices near the colorful tents.',
  'Someone wins a game and the crowd cheers.'
 ],
 home:[
  'The room settles into a warm, comfortable quiet.',
  'A kettle begins to murmur softly.',
  'Curtains move gently beside the open window.',
  'A familiar floorboard creaks underfoot.'
 ],
 realm:[
  'A royal messenger rides through the square.',
  'Travelers gather around a posted map.',
  'A distant banner catches the wind above the rooftops.',
  'A carriage arrives from another part of the realm.'
 ]
};
const timeLines={
 morning:'The kingdom is waking up.',
 afternoon:'The day is busy and bright.',
 evening:'Lanterns begin to glow along the roads.',
 night:'The kingdom grows quieter beneath the stars.'
};
function zone(){return $('#livingWorld')?.dataset.zone||'town'}
function place(){return ($('#worldTitle')?.textContent||'').replace(/^[^a-zA-Z]+/,'').trim()}
function time(){return $('#livingWorld')?.dataset.time||$('#worldClock')?.value||'afternoon'}
function ensureBar(){
 const shell=$('#gameShell');if(!shell||$('#worldPulse'))return;
 const bar=document.createElement('div');bar.id='worldPulse';bar.className='world-pulse';
 bar.innerHTML='<span class="world-pulse-dot"></span><strong id="worldPulseTime">Living Kingdom</strong><span id="worldPulseText">The kingdom is moving around you.</span>';
 shell.insertAdjacentElement('afterend',bar)
}
function ambient(){
 ensureBar();
 const pool=pools[zone()]||pools.town;
 const text=pool[Math.floor(Math.random()*pool.length)];
 const out=$('#worldPulseText');if(out)out.textContent=text;
 const label=$('#worldPulseTime');if(label)label.textContent='🕰️ '+time()[0].toUpperCase()+time().slice(1)+' · '+place();
 flashSpeech(text)
}
function flashSpeech(text){
 const st=$('#worldStage');if(!st)return;
 let e=$('#worldAmbientSpeech');if(!e){e=document.createElement('div');e.id='worldAmbientSpeech';e.className='world-ambient-speech';st.appendChild(e)}
 e.textContent=text;e.classList.add('show');clearTimeout(e.t);e.t=setTimeout(()=>e.classList.remove('show'),2600)
}
function routine(){
 const root=$('#livingWorld'),t=time();if(!root||root.hidden)return;
 const npcs=$$('.world-npc');
 npcs.forEach((n,i)=>{
  n.dataset.routine=t;
  const icon=n.querySelector('span');
  if(!icon)return;
  const z=zone();
  const sets={
   castle:{morning:['🧑‍🍳','🛡️','👑'],afternoon:['🛡️','👑','🧑‍💼'],evening:['🕯️','🛡️','🎻'],night:['🛡️','🌙','🕯️']},
   town:{morning:['🧺','🧑‍🌾','🥖'],afternoon:['🛍️','🧑‍🍳','🧑‍🌾'],evening:['🏮','🎻','🧑‍🍳'],night:['🏮','🌙','🛡️']},
   shop:{morning:['🧹','🧑‍💼','📦'],afternoon:['🛍️','🧑‍💼','📦'],evening:['🕯️','🧑‍💼','🛍️'],night:['🔒','🌙','🕯️']},
   nature:{morning:['🧑‍🌾','🦋','🌿'],afternoon:['🧺','🦋','🧑‍🌾'],evening:['🏮','🦊','🌿'],night:['🌙','🦉','✨']},
   harbor:{morning:['⚓','🧑‍✈️','📦'],afternoon:['⛵','🧑‍✈️','🪝'],evening:['🏮','🎻','⚓'],night:['🌙','🏮','🧑‍✈️']}
  };
  const fallback={morning:['🧺','🧑‍🌾','☀️'],afternoon:['🧑‍🌾','🧑‍🍳','🛍️'],evening:['🏮','🎻','🕯️'],night:['🌙','🏮','🦉']};
  const set=(sets[z]||fallback)[t]||fallback.afternoon;
  icon.textContent=set[i%set.length]
 })
 const desc=$('#worldPulseText');if(desc&&!desc.textContent.trim())desc.textContent=timeLines[t]||timeLines.afternoon
}
function refresh(){
 const loc=place();if(loc!==currentLocation){currentLocation=loc;setTimeout(()=>{routine();ambient()},160)}else routine()
}
function mount(){
 const root=$('#livingWorld');if(!root)return false;
 ensureBar();
 document.addEventListener('storybook:location',refresh);
 $('#worldClock')?.addEventListener('change',()=>{setTimeout(()=>{routine();ambient()},50)});
 new MutationObserver(refresh).observe(root,{attributes:true,attributeFilter:['data-time','data-zone']});
 clearInterval(eventTimer);eventTimer=setInterval(()=>{if(!root.hidden)ambient()},9000);
 clearInterval(routineTimer);routineTimer=setInterval(()=>{if(!root.hidden)routine()},4000);
 refresh();return true
}
function wait(){if(mount())return;const mo=new MutationObserver(()=>{if(mount())mo.disconnect()});mo.observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait);else wait();
})();