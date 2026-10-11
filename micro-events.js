/* Storybook Kingdom — optional location micro-events */
(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s);
const clean=s=>(s||'').replace(/^[^a-zA-Z]+/,'').trim();
let lastPlace='',cooldown=0;
const events=[
 {re:/ballroom/i,title:'Ballroom Rehearsal',icon:'🎻',text:'Musicians begin a rehearsal while two dancers quietly count their steps.',action:'Watch for a moment'},
 {re:/kitchen|pantry|bakery/i,title:'Kitchen Rush',icon:'🥧',text:'A tray has to reach the dining hall before it cools.',action:'Help carry the tray'},
 {re:/library|archive|bookmark/i,title:'A Book Left Open',icon:'📖',text:'A book on a nearby table has been left open to a page marked with blue ribbon.',action:'Look at the marked page'},
 {re:/harbor|pier|lighthouse/i,title:'A Ship Arrives',icon:'⛵',text:'A small blue-sailed ship glides toward the docks with a sealed parcel aboard.',action:'Walk toward the dock'},
 {re:/garden|arbor|maze|orchard/i,title:'Unexpected Visitor',icon:'🦋',text:'A bright butterfly circles an old stone marker before settling nearby.',action:'Follow the butterfly'},
 {re:/throne|court chamber/i,title:'Royal Petition',icon:'📜',text:'A nervous villager waits nearby, clutching a folded petition.',action:'Listen quietly'},
 {re:/chapel|abbey/i,title:'The Bell Rings',icon:'🔔',text:'A single bell sounds and echoes through the stone halls.',action:'Listen to the echo'},
 {re:/nursery/i,title:'A Forgotten Toy',icon:'🧸',text:'A small wooden toy rolls from beneath an old cabinet as you pass.',action:'Pick it up'},
 {re:/tunnel|aqueduct|cavern|cellar|passage/i,title:'A Strange Echo',icon:'🕯️',text:'A sound answers your footsteps from farther down the passage.',action:'Investigate the echo'},
 {re:/market|lane|row|tavern|shop/i,title:'Street Performer',icon:'🎺',text:'A performer begins a tune and nearby shoppers slow down to listen.',action:'Stay for the song'},
 {re:/academy/i,title:'A Lesson Spills Outside',icon:'🎓',text:'A teacher leads a small class into the courtyard to study an old map.',action:'Join the lesson'},
 {re:/festival|tournament/i,title:'A Contest Begins',icon:'🎯',text:'A crowd gathers around a game booth as the next contest starts.',action:'Try the contest'},
 {re:/village|barleycross|pinehollow|reedbank|cloudmeadow/i,title:'Neighborly Favor',icon:'🧺',text:'A neighbor is carrying more baskets than they can comfortably manage.',action:'Offer to help'}
];
function choose(place){return events.find(e=>e.re.test(place))}
function show(e){
 const st=$('#worldStage');if(!st||$('#microEvent'))return;
 const card=document.createElement('div');card.id='microEvent';card.className='micro-event';
 card.innerHTML='<button class="micro-close" type="button" aria-label="Dismiss event">✕</button><span class="micro-icon">'+e.icon+'</span><div><small>HAPPENING NEARBY</small><strong>'+e.title+'</strong><p>'+e.text+'</p></div><button class="micro-action" type="button">'+e.action+'</button>';
 st.appendChild(card);
 card.querySelector('.micro-close').addEventListener('click',()=>card.remove());
 card.querySelector('.micro-action').addEventListener('click',()=>{
   const btn=$('#playInteract');
   card.classList.add('accepted');
   card.querySelector('.micro-action').disabled=true;
   card.querySelector('.micro-action').textContent='✓ Joined';
   const flash=$('#worldAmbientSpeech');
   if(flash){flash.textContent='You join the moment for a little while. The world carries on around you.';flash.classList.add('show');setTimeout(()=>flash.classList.remove('show'),2500)}
   setTimeout(()=>card.remove(),1500)
 });
 setTimeout(()=>{if(card.isConnected&&!card.classList.contains('accepted'))card.classList.add('soft')},7000)
}
function maybe(){
 const place=clean($('#worldTitle')?.textContent);
 if(!place||place===lastPlace)return;
 lastPlace=place;
 if(['town','village','festival','harbor'].includes($('#livingWorld')?.dataset.zone)||/courtyard|garden|arbor/i.test(place))return;
 const e=choose(place);if(!e)return;
 clearTimeout(cooldown);
 cooldown=setTimeout(()=>{if(!$('#livingWorld')?.hidden)show(e)},4200)
}
function mount(){
 const title=$('#worldTitle');if(!title)return false;
 document.addEventListener('storybook:location',maybe);
 new MutationObserver(maybe).observe(title,{childList:true,characterData:true,subtree:true});
 maybe();return true
}
function wait(){if(mount())return;const mo=new MutationObserver(()=>{if(mount())mo.disconnect()});mo.observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait);else wait();
})();
/* Optional hands-on neighborhood life. Existing adventures keep their saves. */
(()=>{'use strict';
const $=s=>document.querySelector(s),KEY='storybook_neighborhood_life_v1';
let state;try{state=JSON.parse(localStorage.getItem(KEY)||'{}')}catch{state={}};
state=state&&typeof state==='object'?state:{};state.days=state.days||{};state.festivals=state.festivals||{};
let panel,activeKey='',busy=false,arrivalTimer,renderTimer;
const jobs={
 morning:{title:'Morning deliveries',who:'The village courier',verb:'parcel',icon:'📦',task:'Pick up a parcel, then choose a doorstep to deliver it.',targets:['Bakery doorstep','Market doorstep','Castle doorstep'],routine:'The courier carries the morning post along the lane.'},
 afternoon:{title:'Flowers for the square',who:'The town gardener',verb:'flower basket',icon:'🌷',task:'Pick up a flower basket and carry it to an empty planter.',targets:['Bridge planter','Market planter','Castle planter'],routine:'The gardener gathers flowers while neighbors browse the stalls.'},
 evening:{title:'Light the neighborhood',who:'The lantern keeper',verb:'lantern',icon:'🏮',task:'Pick up a lantern and carry it to a waiting lamp post.',targets:['Bridge lamp','Market lamp','Castle lamp'],routine:'The lantern keeper walks the road as evening lights come on.'},
 night:{title:'Stories beneath the stars',who:'The village storyteller',verb:'storybook',icon:'📖',task:'Carry a storybook to each reading cushion before the gathering.',targets:['Blue cushion','Rose cushion','Gold cushion'],routine:'The storyteller settles in with a book as the village grows quiet.'}
};
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(state))}catch{}};
function day(){let n=1;try{n=JSON.parse(localStorage.getItem('storybook_hands_on_rooms_v1')||'{}').day||1}catch{}return new Intl.DateTimeFormat('en-CA',{timeZone:'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())+' / '+n}
const place=()=>($('#worldTitle')?.textContent||'').replace(/^[^A-Za-z]+/,'').trim();
const time=()=>$('#worldClock')?.value||'afternoon';
function eligible(){const z=$('#livingWorld')?.dataset.zone;return ['town','village','festival','harbor'].includes(z)||/courtyard|garden|arbor/i.test(place())}
function identity(){return day()+'|'+place()+'|'+time()}
function record(key=activeKey){return state.days[key]||(state.days[key]={joined:false,carrying:null,placed:[false,false,false],used:[false,false,false],choice:''})}
function makeButton(label,fn,disabled=false){const b=document.createElement('button');b.type='button';b.textContent=label;b.disabled=disabled;b.onclick=fn;return b}
function cloneCharacter(selector,holder){const model=$(selector);if(model)holder.appendChild(model.cloneNode(true))}
function render(){
 clearTimeout(renderTimer);const name=place(),t=time(),j=jobs[t]||jobs.afternoon,key=identity();
 $('#neighborhoodLife')?.remove();panel=null;if(!eligible())return;
 activeKey=key;const r=record();r.used=r.used||[false,false,false];busy=false;
 panel=document.createElement('section');panel.id='neighborhoodLife';panel.className='nl-panel';panel.dataset.time=t;
 const title=document.createElement('h2');title.textContent=j.title;panel.append(title);
 const optional=document.createElement('p');optional.className='nl-intro';optional.textContent='Happening in '+name+' · '+t+' · Optional';panel.append(optional);
 const last=state.festivals[name];if(last){const memory=document.createElement('p');memory.className='nl-memory';memory.textContent=last==='village'?'Your choice lives on: neighbors are preparing a flower-filled village picnic.':'Your choice lives on: gold ribbons are being prepared for a castle reception.';panel.append(memory);panel.dataset.festival=last}
 const scene=document.createElement('div');scene.className='nl-scene';scene.setAttribute('aria-label','Village lane with a courier, your character, and three destinations');
 scene.innerHTML='<div class="nl-sky"></div><div class="nl-cottage cottage-one"><i></i></div><div class="nl-cottage cottage-two"><i></i></div><div class="nl-cottage cottage-three"><i></i></div><div class="nl-path"></div><div class="nl-bunting"></div><div class="nl-neighbor"><span class="nl-routine-prop"></span></div><div class="nl-player"><span class="nl-carried"></span></div><div class="nl-targets"></div><div class="nl-items"></div>';
 panel.append(scene);cloneCharacter('.world-npc .human-model',scene.querySelector('.nl-neighbor'));cloneCharacter('#worldActor .human-model',scene.querySelector('.nl-player'));
 scene.querySelector('.nl-routine-prop').textContent=j.icon;scene.querySelector('.nl-carried').textContent=r.carrying===null?'':j.icon;
 if(t==='night')scene.querySelector('.nl-neighbor').classList.add('nl-seated');
 const routine=document.createElement('p');routine.className='nl-routine';routine.textContent=j.routine;panel.append(routine);
 const caption=document.createElement('p');caption.className='nl-caption';caption.setAttribute('role','status');caption.setAttribute('aria-live','polite');panel.append(caption);
 const controls=document.createElement('div');controls.className='nl-controls';panel.append(controls);
 const count=r.placed.filter(Boolean).length;
 if(!r.joined){caption.textContent='Watch the neighborhood, join in, or keep wandering.';controls.append(makeButton('Join this neighborhood moment',()=>{r.joined=true;save();render()}));}
 else if(count<3){caption.textContent=(r.carrying===null?j.task:'You are carrying '+j.verb+' '+(r.carrying+1)+'. Choose a destination.')+' '+count+'/3 placed.';}
 else{caption.textContent='All three '+(t==='morning'?'parcels are delivered':t==='afternoon'?'flower baskets are planted':t==='evening'?'lanterns are lit':'storybooks are ready')+'. '+(r.choice?'Your festival choice is saved.':'Where would you like the next gathering?');if(!r.choice){controls.append(makeButton('Plan a village picnic',()=>choose('village')),makeButton('Plan a castle reception',()=>choose('castle')));}}
 for(let i=0;i<3;i++){
 const destination=makeButton((r.placed[i]?j.icon+' ✓ ':'')+j.targets[i],()=>deliver(i),!r.joined||r.carrying===null||r.placed[i]);destination.className='nl-destination';destination.dataset.slot=String(i);destination.dataset.placed=String(r.placed[i]);scene.querySelector('.nl-targets').append(destination);
 const item=makeButton('Pick up '+j.verb+' '+(i+1),()=>{if(busy||r.carrying!==null||r.used[i])return;r.carrying=i;save();render()},!r.joined||r.carrying!==null||r.used[i]);item.className='nl-item';item.textContent=r.used[i]?'✓':j.icon+' '+(i+1);item.setAttribute('aria-label','Pick up '+j.verb+' '+(i+1));scene.querySelector('.nl-items').append(item)
 }
 controls.append(makeButton('Keep wandering',()=>{panel.remove();panel=null}));
 $('#worldStage')?.insertAdjacentElement('afterend',panel);
 function choose(choice){if(key!==activeKey||r.choice)return;r.choice=choice;state.festivals[name]=choice;save();render()}
 function deliver(slot){
 if(busy||r.carrying===null||r.placed[slot]||key!==activeKey)return;
 busy=true;const item=r.carrying;const player=scene.querySelector('.nl-player');player.style.setProperty('--destination',[22,50,78][slot]+'%');player.classList.add('nl-delivering');
 scene.querySelectorAll('button').forEach(b=>b.disabled=true);caption.textContent='Walking to '+j.targets[slot].toLowerCase()+' with '+j.verb+' '+(item+1)+'…';
 clearTimeout(arrivalTimer);arrivalTimer=setTimeout(()=>{r.placed[slot]=true;r.used[item]=true;r.carrying=null;save();busy=false;if(key===identity())render()},1100)
 }
}
function mount(){if(!$('#worldStage'))return false;
 document.addEventListener('storybook:location',()=>{clearTimeout(renderTimer);renderTimer=setTimeout(render,220)});
 $('#worldClock')?.addEventListener('change',()=>{clearTimeout(renderTimer);renderTimer=setTimeout(render,220)});
 document.addEventListener('storybook:home-rest',()=>{clearTimeout(renderTimer);renderTimer=setTimeout(render,220)});
 render();return true}
function wait(){if(mount())return;const m=new MutationObserver(()=>{if(mount())m.disconnect()});m.observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait);else wait();
})();
