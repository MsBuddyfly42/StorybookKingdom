/* Storybook Kingdom · The Living World — a connected atlas of every named location.
   No dependency on the older caption-based navigation; preserves existing save keys. */
(()=>{'use strict';
const KEY='storybook_living_world_v1';
const load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}};
const state={visited:[],satchel:[],journal:[],weather:'sunshine',time:'afternoon',...load()};
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(state))}catch{}};
const atlas=new Map(), byName=new Map();
const slug=s=>String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const add=(name,icon,zone,desc,actions=[],opts={})=>{
 const id=slug(name);if(atlas.has(id))return atlas.get(id);
 const o={id,name,icon,zone,desc,actions:actions.length?actions:defaultActions(zone),links:[],...opts};atlas.set(id,o);byName.set(name.toLowerCase(),id);return o;
};
const defaultActions=z=>({castle:['Look behind the tapestry','Open the carved door','Speak to the steward'],town:['Browse the local stalls','Meet a neighbor','Follow the cobblestone lane'],village:['Walk the village path','Visit the nearest cottage','Ask about a local tradition'],realm:['Explore the main square','Speak to a traveler','Find the road to the palace'],underground:['Examine the old wall','Light your lantern','Follow the stone passage'],home:['Open the window','Make a cup of tea','Look through your belongings'],shop:['Inspect the display','Talk to the shopkeeper','Choose a keepsake'],nature:['Follow the winding path','Listen to the birds','Explore the hidden clearing'],harbor:['Walk along the waterfront','Speak to a sailor','Explore the nearby buildings'],festival:['Approach the games booth','Watch the performers','Join the celebration'],academy:['Inspect a classroom','Visit the archives','Speak to a teacher']}[z]||['Explore a corner','Speak to someone','Look for a hidden detail']);
const put=(name,icon,zone,desc,actions,opts)=>add(name,icon,zone,desc,actions,opts);
// The original top-level kingdom datasets are intentionally reused, not re-invented.
if(typeof places!=='undefined')places.forEach(p=>put(p.name,p.icon,({'Roseglass Castle':'castle','Lantern Row':'town','Market Square':'town','Whisperwood':'nature','Queen’s Gardens':'nature','Moonharbor':'harbor','Bellflower Abbey':'academy','Hearth & Honey Bakery':'shop','Festival Green':'festival'})[p.name]||'town',p.text,p.actions));
if(typeof castleRooms!=='undefined')castleRooms.forEach(p=>put(p[1],p[0],'castle',p[2],p[3]));
// Distinguish the old castle adventure's smaller rooms from the richer kingdom atlas.
[['🏰','Grand Entrance Hall','A grand staircase, portraits, a glittering chandelier, and doors into every wing.'],['👑','Royal Court Chamber','The queen hears petitions beneath the kingdom banners.'],['🍞','Palace Pantry','Shelves of fresh bread, honey jars, spices and old kitchen records.'],['🗝️','Old Moon Tower','A star-shaped window reveals the whole kingdom below.'],['🌿','Royal Hedge Maze','Tall rose hedges surround an old marble fountain.'],['⚜️','Castle Courtyard','Guards, fountains and the grand gates welcome visitors.']].forEach(p=>put(p[1],p[0],'castle',p[2]));
if(typeof villagesV7!=='undefined')villagesV7.forEach(v=>put(v[1],v[0],'village',v[3]));
if(typeof realms!=='undefined')realms.forEach(r=>put(r.name,r.icon,'realm',r.text));
if(typeof underways!=='undefined')underways.forEach(u=>put(u[1],u[0],'underground',u[2],u[3]));
if(typeof townServices!=='undefined')townServices.forEach(t=>put(t.name,t.icon,(/Stable/.test(t.name)?'nature':/Inn/.test(t.name)?'harbor':'town'),t.text,t.actions));
if(typeof shops!=='undefined')shops.forEach(s=>put(s.name,s.icon,'shop',`${s.keeper} welcomes you into a busy little shop. There are actual shelves to inspect and keepsakes to collect.`,['Examine the shop window','Speak to '+s.keeper,'Browse the shelves']));
if(typeof homes!=='undefined')homes.forEach(h=>put(h.name,h.icon,'home',h.desc));
[['⚓','Moonharbor Pier','harbor','Lantern-lit boats bob on blue waves while seagulls circle overhead.'],['🛍️','Roseglass Market Lane','town','An inviting lane between the bookshop, bakery, dressmaker, and flower stalls.'],['🏰','Castle Gatehouse','castle','Two high watchtowers guard the bridge across the moat.'],['🌉','Lantern Bridge','nature','The old stone bridge glows with hanging lanterns above the river.'],['🌾','East Orchard','nature','Fruit trees, beehives and an old cottage line a sunlit track.'],['🎪','Tournament Grounds','festival','Colorful pennants rise above an open field of games and horse shows.'],['🌊','Azuremere Lighthouse','realm','The blue-roofed lighthouse looks across white sea cliffs.'],['🏔️','Everfrost Mountain Lodge','realm','A glowing hearth invites guests inside from the snow.'],['📚','Royal Academy Courtyard','academy','Young scholars cross an arcade between halls of maps, music, and history.'],['🌷','Royal Rose Arbor','nature','A winding garden path brings you to a secluded rose-covered bench.']].forEach(p=>put(p[1],p[0],p[2],p[3]));
const regions={
 'Town & Shops':['Lantern Row','Market Square','Roseglass Market Lane','Hearth & Honey Bakery','Hearth & Honey','Rose & Ribbon Clothier','The Crooked Bookmark','Thistle & Bloom','Oddments & Curios','The Crown & Kettle Tavern','Madame Liora\'s Dressmaking Rooms','Brindle\'s Blacksmith','Juniper Apothecary','Bell Street Schoolhouse','The Lavender Bathhouse'],
 'Castle & Palace':['Roseglass Castle','Castle Gatehouse','Castle Courtyard','Grand Entrance Hall','Throne Room','Royal Court Chamber','Royal Kitchens','Palace Pantry','Grand Ballroom','Royal Library','Servants’ Corridors','West Tower','Old Moon Tower','Guest Wing','Castle Chapel','Old Nursery','Hidden Passage Network'],
 'Gardens & Countryside':['Queen’s Gardens','Royal Rose Arbor','Royal Hedge Maze','Whisperwood','East Orchard','Festival Green','Tournament Grounds','Lantern Bridge','Rosegate Stables'],
 'Harbor & Abbey':['Moonharbor','Moonharbor Pier','Moonharbor Inn','Bellflower Abbey','Royal Academy Courtyard'],
 'Underground':['Old Aqueduct','Servants’ Stair Belowstairs','Forgotten Foundation Hall','River Gate Tunnel','Sealed Store Cellars','Lantern Cavern'],
 'Outlying Villages':['Barleycross','Red Orchard','Pinehollow','Reedbank','Cloudmeadow','Bellflower Hamlet'],
 'Neighboring Realms':['Azuremere','Azuremere Lighthouse','Everfrost Vale','Everfrost Mountain Lodge','Goldmeadow','Nocturne Hollow','Briarwood March','Solara Court'],
 'Your Homes':['Lantern Row Cottage','Castle Guest Chambers','Whisperwood Cottage','Moonharbor Loft',"Abbey Scholar's Room",'Garden Pavilion']
};
const find=n=>atlas.get(slug(n));
const connect=(a,b)=>{const x=find(a),y=find(b);if(!x||!y)return; if(!x.links.includes(y.id))x.links.push(y.id);if(!y.links.includes(x.id))y.links.push(x.id)};
const paths=[
 ['Roseglass Castle','Castle Gatehouse','Castle Courtyard','Grand Entrance Hall'],
 ['Grand Entrance Hall','Throne Room','Royal Court Chamber'],
 ['Grand Entrance Hall','Royal Kitchens','Palace Pantry'],
 ['Grand Entrance Hall','Royal Library','Hidden Passage Network','West Tower','Old Moon Tower'],
 ['Grand Entrance Hall','Grand Ballroom','Guest Wing','Castle Chapel','Old Nursery'],
 ['Grand Entrance Hall','Servants’ Corridors','Servants’ Stair Belowstairs','Old Aqueduct','Forgotten Foundation Hall','River Gate Tunnel','Sealed Store Cellars','Lantern Cavern'],
 ['Castle Courtyard','Queen’s Gardens','Royal Rose Arbor','Royal Hedge Maze','Garden Pavilion'],
 ['Castle Gatehouse','Lantern Row','Roseglass Market Lane','Market Square','Festival Green','Tournament Grounds'],
 ['Market Square','Hearth & Honey Bakery','Hearth & Honey'],
 ['Market Square','Rose & Ribbon Clothier','Madame Liora\'s Dressmaking Rooms'],
 ['Market Square','The Crooked Bookmark','Bell Street Schoolhouse','Royal Academy Courtyard'],
 ['Market Square','Thistle & Bloom','Juniper Apothecary'],
 ['Market Square','Oddments & Curios','Brindle\'s Blacksmith'],
 ['Market Square','The Crown & Kettle Tavern','The Lavender Bathhouse'],
 ['Market Square','Moonharbor','Moonharbor Pier','Moonharbor Inn'],
 ['Market Square','Bellflower Abbey','Royal Academy Courtyard'],
 ['Lantern Row','Lantern Row Cottage','Lantern Bridge','East Orchard','Whisperwood','Whisperwood Cottage'],
 ['Whisperwood','Rosegate Stables','Barleycross','Red Orchard','Pinehollow'],
 ['Moonharbor','Reedbank','Cloudmeadow','Bellflower Hamlet'],
 ['Moonharbor','Azuremere','Azuremere Lighthouse'],
 ['Rosegate Stables','Goldmeadow','Everfrost Vale','Everfrost Mountain Lodge'],
 ['Whisperwood','Briarwood March','Nocturne Hollow','Solara Court'],
 ['Grand Entrance Hall','Castle Guest Chambers'],['Moonharbor','Moonharbor Loft'],['Bellflower Abbey',"Abbey Scholar's Room"]
];paths.forEach(p=>p.forEach((v,i)=>i&&connect(p[i-1],v)));
// Every destination also gets a direct route to its regional hub; no stranded rooms.
const hubs={'castle':'Grand Entrance Hall','town':'Market Square','shop':'Market Square','nature':'Lantern Row','harbor':'Moonharbor','academy':'Bellflower Abbey','underground':'Hidden Passage Network','village':'Market Square','realm':'Moonharbor','festival':'Festival Green','home':'Lantern Row'};
for(const p of atlas.values())if(!p.links.length&&p.name!==hubs[p.zone])connect(p.name,hubs[p.zone]||'Market Square');
let root=null,where=null,actors=null,props=null,roads=null,dialog=null,focus=null,menu=null,busy=false,actorTimer;
const $=id=>root.querySelector(id);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const xp=p=>p.icon||'✨';
const stamp=name=>{if(!state.visited.includes(name)){state.visited.push(name);save();}};
const reward=(item)=>{if(!state.satchel.includes(item)){state.satchel.push(item);save();toast('🎒 Found '+item);}sync()};
function toast(t){const el=$('#worldToast');el.textContent=t;el.classList.add('on');clearTimeout(el.t);el.t=setTimeout(()=>el.classList.remove('on'),2200)}
function moveActor(pose){const el=$('#worldActor');if(!el)return;el.dataset.pose=pose;clearTimeout(actorTimer);actorTimer=setTimeout(()=>el.dataset.pose='idle',1800)}
function say(name,words,opts=[]){const p=$('#worldSpeaker'),line=$('#worldLine'),choices=$('#worldChoices');p.textContent=name;line.textContent=words;choices.replaceChildren();(opts.length?opts:[['Continue exploring',()=>{choices.replaceChildren();line.textContent='Choose an object, character, or connected road.'}]]).forEach(([label,fn])=>{const b=document.createElement('button');b.textContent=label;b.onclick=fn;choices.appendChild(b)})}
function theater(action,icon,done){if(busy)return;busy=true;moveActor(/walk|follow|cross|go|ride|sail/i.test(action)?'walk':/dance|sing|music|festival/i.test(action)?'dance':'reach');const e=$('#worldObject');e.textContent=icon;e.classList.add('show');toast(action);setTimeout(()=>{e.classList.remove('show');busy=false;if(done)done()},1100)}
const actionsFor=p=>p.actions.map((a,i)=>({name:a,icon:icons[i%icons.length]}));
const icons=['🔍','✨','🗝️','🌹','📜','💎','🍯'];
function interact(a,i){const p=atlas.get(where),name=a.name;theater(name,a.icon||icons[i%icons.length],()=>{
 const item=i===1?'Ribbon from '+p.name:i===2?'Postcard from '+p.name:'Memory of '+p.name;
 say('Your adventure',actionResult(p,name,i),[['Keep this discovery',()=>{reward(item);say('Storybook Journal','The moment is saved in your satchel. You can continue whenever you like.')}],['Try another activity',()=>draw()],['Just spend some time here',()=>cozy()]]);
 });}
function actionResult(p,verb,i){const endings=[`You ${verb.toLowerCase()} in ${p.name}. Something you could not see from the road reveals itself: ${p.icon} a tiny detail of this place's history.`,`A local notices what you're doing and comes over to join you. Before long, you have exchanged stories and discovered a path to another corner of ${p.name}.`,`What began as a small visit to ${p.name} turns into a lovely surprise. You discover a keepsake worth remembering.`];return endings[i%endings.length]}
const peopleFor=p=>{const map={castle:['Queen Elowen','Mara Bell','Captain Joren'],town:['Mina Thistle','Tomas Hearth','Pip Rowan'],shop:['The Shopkeeper','A Visiting Traveler'],nature:['A Woodland Guide','A Friendly Villager'],harbor:['The Harbor Captain','A Traveling Musician'],academy:['Archivist Elin','A Young Scholar'],village:['The Village Elder','A Local Baker'],realm:['A Royal Messenger','A Fellow Traveler'],underground:['A Lantern Keeper'],festival:['A Traveling Performer','A Festival Guest'],home:['A Familiar Friend']};return map[p.zone]||['A Passing Villager']};
function friend(name){const lines=[`${name} smiles and invites you to explore the neighborhood together.`,`“I heard something peculiar about this part of the kingdom,” ${name} says. “Would you like to see where it happened?”`,`“We don't have to do anything important,” ${name} says. “The scenery is lovely today.”`];say(name,lines[Math.floor(Math.random()*lines.length)],[['Walk with them',()=>theater('You and '+name+' walk together','🚶',()=>{reward('Shared adventure in '+atlas.get(where).name);say(name,'You take the longer, lovelier route and exchange a few good stories.')} )],['Ask about this place',()=>say(name,atlas.get(where).desc)],["I'd like a peaceful moment",cozy]])}
function cozy(){moveActor('sit');say('A quiet moment',`You find a comfortable spot in ${atlas.get(where).name}. The world carries on around you, but you have nothing to finish. Stay as long as you like.`,[['Stay awhile',()=>{moveActor('sit');toast('🕯️ Just visiting — no pressure')}],['Explore again',draw]])}
function draw(){const p=atlas.get(where);if(!p)return;stamp(p.name);root.dataset.zone=p.zone;root.dataset.time=state.time;root.dataset.weather=state.weather;$('#worldTitle').textContent=p.icon+' '+p.name;$('#worldDescription').textContent=p.desc;$('#worldZone').textContent=p.zone.toUpperCase();$('#worldVisitCount').textContent=state.visited.length+' places discovered';$('#worldSceneLabel').textContent=p.name;$('#worldLandscape').textContent=p.icon;props.replaceChildren();actionsFor(p).forEach((a,i)=>{const b=document.createElement('button');b.className='world-hotspot';b.style.left=[17,47,77,37,66][i%5]+'%';b.style.top=[58,38,59,65,32][i%5]+'%';b.innerHTML='<span>'+a.icon+'</span><small>'+esc(a.name)+'</small>';b.onclick=()=>interact(a,i);props.appendChild(b)});actors.replaceChildren();peopleFor(p).slice(0,3).forEach((n,i)=>{const b=document.createElement('button');b.className='world-npc';b.style.left=(20+i*27)+'%';b.textContent=['🧑‍🌾','👑','🧑‍🍳'][i];b.title='Talk to '+n;b.innerHTML='<span>'+['🧑‍🌾','👑','🧑‍🍳'][i]+'</span><small>'+esc(n)+'</small>';b.onclick=()=>friend(n);actors.appendChild(b)});roads.replaceChildren();p.links.sort((a,b)=>atlas.get(a).name.localeCompare(atlas.get(b).name)).forEach(id=>{let to=atlas.get(id);const b=document.createElement('button');b.className='world-road';b.textContent=to.icon+' '+to.name;b.onclick=()=>travel(to.id);roads.appendChild(b)});$('#worldBreadcrumb').textContent='📍 '+p.name;say('Welcome to '+p.name,p.desc,[['Talk to someone',()=>friend(peopleFor(p)[0])],['Just visit',cozy]]);sync()}
function travel(id){if(!atlas.has(id))return;const dest=atlas.get(id);const prev=atlas.get(where);theater('Traveling from '+prev.name+' to '+dest.name,'🛞',()=>{where=id;draw();toast('You arrive at '+dest.name)})}
function sync(){const e=$('#worldSatchel');e.innerHTML=state.satchel.length?state.satchel.slice(-8).map(s=>'<span>'+esc(s)+'</span>').join(''):'<em>Your satchel is empty. Explore to discover keepsakes.</em>';$('#worldVisitCount').textContent=state.visited.length+' places discovered';}
function search(q){const value=q.trim().toLowerCase();return [...atlas.values()].filter(p=>p.name.toLowerCase().includes(value)||p.zone.includes(value));}
function atlasMenu(category='All Places',query=''){const sets=category==='All Places'?[...atlas.values()]:[...atlas.values()].filter(p=>(regions[category]||[]).map(slug).includes(p.id));let selected=sets.filter(p=>p.name.toLowerCase().includes(query.toLowerCase()));$('#worldSearchCount').textContent=selected.length+' destinations';menu.innerHTML=selected.sort((a,b)=>a.name.localeCompare(b.name)).map(p=>'<button data-place="'+p.id+'">'+p.icon+' <strong>'+esc(p.name)+'</strong><small>'+esc(p.zone)+'</small></button>').join('')||'<p>No destinations found.</p>';menu.querySelectorAll('[data-place]').forEach(b=>b.onclick=()=>{$('#worldAtlas').classList.remove('open');travel(b.dataset.place)})}
function openAtlas(){const at=$('#worldAtlas');at.classList.toggle('open');if(at.classList.contains('open')){$('#worldSearch').value='';$('#worldCategory').value='All Places';atlasMenu()}}
function bindLegacy(){// Location cards on the original site now get a real-world travel control.
 const mapCard=el=>{if(el.dataset.worldLinked)return;const title=el.querySelector('h2,h3')?.textContent?.trim();const id=title&&byName.get(title.toLowerCase());if(!id)return;el.dataset.worldLinked='1';const b=document.createElement('button');b.className='world-visit-button';b.textContent='🚪 Enter this place';b.onclick=e=>{e.stopPropagation();open(id)};el.appendChild(b)};
 const scan=()=>document.querySelectorAll('.place-card,.role-card,.shop-card,.home-card,.realm-card,.village-card,.underway-card,.townservice-card,.castle-room-card').forEach(mapCard);
 new MutationObserver(()=>{if(!document.hidden)scan()}).observe(document.querySelector('main')||document.body,{subtree:true,childList:true});scan();
}
function open(id){if(!root)mount();where=atlas.has(id)?id:atlas.has(state.last)?state.last:slug('Castle Courtyard');root.hidden=false;document.body.classList.add('world-open');draw();window.scrollTo({top:0,behavior:'instant'})}
function exit(){state.last=where;save();root.hidden=true;document.body.classList.remove('world-open')}
function mount(){if(root)return;root=document.createElement('section');root.id='livingWorld';root.hidden=true;root.setAttribute('aria-label','Living Storybook Kingdom, connected explorable world');root.innerHTML=`
<div class="world-top"><button id="worldBack" aria-label="Return to the main kingdom">← Main Kingdom</button><strong id="worldBreadcrumb"></strong><span id="worldVisitCount"></span><button id="worldAtlasButton">🗺️ Open Kingdom Map</button></div>
<div class="world-main"><div class="world-info"><span id="worldZone">THE KINGDOM</span><h1 id="worldTitle">Storybook Kingdom</h1><p id="worldDescription"></p><div class="world-time"><label>Time <select id="worldClock"><option>morning</option><option selected>afternoon</option><option>evening</option><option>night</option></select></label><label>Weather <select id="worldWeather"><option>sunshine</option><option>rain</option><option>snow</option><option>mist</option></select></label></div></div>
<div id="worldStage"><div class="world-sky"><div class="world-sun"></div><div class="world-cloud a"></div><div class="world-cloud b"></div><div class="world-stars">✧ ✦ ✧ ✦ ✧ ✦</div></div><div class="world-building"><div class="world-tower left"></div><div class="world-roof"></div><div class="world-gateway">✦</div><div class="world-tower right"></div><div class="world-windows">✦ ✧ ✦</div></div><div class="world-trees">🌳 🌲 🌳</div><div class="world-water"></div><div id="worldLandscape"></div><div class="world-floor"></div><div id="worldSceneLabel"></div><div id="worldObjects"></div><div id="worldActors"></div><div id="worldActor" data-pose="idle">🧝<small>YOU</small></div><div id="worldObject">✨</div><div id="worldToast" role="status"></div><div class="world-rain"></div></div>
<div class="world-dialog"><strong id="worldSpeaker"></strong><p id="worldLine"></p><div id="worldChoices"></div></div><div class="world-lower"><section class="world-roads"><h2>🚪 Where can I go from here?</h2><div id="worldRoads"></div><button id="worldSeeAll">🗺️ See every destination</button></section><section class="world-bag"><h2>🎒 Keepsakes</h2><div id="worldSatchel"></div><button id="worldRest">🕯️ Just Visit</button></section></div></div>
<aside id="worldAtlas"><h2>🗺️ The Whole Kingdom</h2><p>Every named place has its own playable scene. Search or browse below.</p><button id="worldAtlasClose">✕ Close map</button><input id="worldSearch" placeholder="Find a place to visit…" aria-label="Find a location"/><select id="worldCategory" aria-label="Area"><option>All Places</option>${Object.keys(regions).map(x=>'<option>'+esc(x)+'</option>').join('')}</select><p id="worldSearchCount"></p><div id="worldMapEntries"></div></aside>`;
 document.body.appendChild(root);props=$('#worldObjects');actors=$('#worldActors');roads=$('#worldRoads');menu=$('#worldMapEntries');
 $('#worldBack').onclick=exit;$('#worldAtlasButton').onclick=openAtlas;$('#worldSeeAll').onclick=openAtlas;$('#worldAtlasClose').onclick=()=>$('#worldAtlas').classList.remove('open');$('#worldRest').onclick=cozy;$('#worldSearch').oninput=()=>atlasMenu($('#worldCategory').value,$('#worldSearch').value);$('#worldCategory').onchange=()=>atlasMenu($('#worldCategory').value,$('#worldSearch').value);$('#worldClock').value=state.time;$('#worldWeather').value=state.weather;$('#worldClock').onchange=e=>{state.time=e.target.value;save();draw()};$('#worldWeather').onchange=e=>{state.weather=e.target.value;save();draw()};
 // One clear front-door action for the entire kingdom; existing site remains unchanged.
 const start=document.createElement('button');start.id='livingWorldStart';start.className='primary-btn';start.textContent='🗺️ Enter the Whole Living Kingdom';start.onclick=()=>open('castle-courtyard');const existing=document.querySelector('#rgStartBtn');if(existing)existing.insertAdjacentElement('afterend',start);else document.querySelector('.hero-buttons')?.append(start);
 const nav=document.createElement('button');nav.textContent='🌎 Explore Every Location';nav.className='primary-btn';nav.onclick=()=>open('market-square');document.querySelector('#exploreView .page-heading')?.append(nav);
 bindLegacy();
 if(new URLSearchParams(location.search).has('world'))open(slug(new URLSearchParams(location.search).get('world')||'Castle Courtyard'));
}
window.StorybookWorld={open,locations:()=>[...atlas.values()].map(({id,name,zone,links})=>({id,name,zone,links})),state:()=>({...state})};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
