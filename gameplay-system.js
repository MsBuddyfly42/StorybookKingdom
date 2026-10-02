/* Storybook Kingdom — optional quest, checkpoint and exploration systems */
(()=>{'use strict';
const $=s=>document.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const KEY='storybook_gameplay_v2';
const load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}};
const state={quest:0,step:0,stars:0,completed:[],...load()};
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(state))}catch{}};
const clean=s=>(s||'').replace(/^[^a-zA-Z]+/,'').trim();
const quests=[
 {id:'crown',title:'The Lantern Crown',reward:5,steps:[
  {place:'Castle Courtyard',type:'npc',text:'Find someone in the Castle Courtyard who knows why the royal lantern went dark.'},
  {place:'Royal Library',type:'object',text:'Search the Royal Library for a record about the old lantern crown.'},
  {place:'Whisperwood',type:'object',text:'Follow the clue into Whisperwood and investigate something unusual.'},
  {place:'Moonharbor Pier',type:'npc',text:'Ask someone at Moonharbor Pier about the blue-glass shipment.'},
  {place:'Throne Room',type:'npc',text:'Return to the Throne Room and report what you discovered.'}
 ]},
 {id:'bell',title:'The Bellflower Secret',reward:6,steps:[
  {place:'Bellflower Abbey',type:'object',text:'Explore Bellflower Abbey and look for the missing page.'},
  {place:'Royal Academy Courtyard',type:'npc',text:'Ask a scholar in the Royal Academy Courtyard about the page.'},
  {place:'Old Aqueduct',type:'object',text:'Search the Old Aqueduct for the symbol described by the scholar.'},
  {place:'Lantern Cavern',type:'object',text:'Investigate Lantern Cavern for the hidden bellflower seal.'},
  {place:'Bellflower Abbey',type:'npc',text:'Bring the secret back to someone at Bellflower Abbey.'}
 ]},
 {id:'masquerade',title:'The Midnight Masquerade',reward:7,steps:[
  {place:'Rose & Ribbon Clothier',type:'npc',text:'Speak with someone at Rose & Ribbon Clothier about a mask ordered for the royal ball.'},
  {place:'Grand Ballroom',type:'object',text:'Search the Grand Ballroom for the silver ribbon that fell from the missing mask.'},
  {place:'Guest Wing',type:'npc',text:'Ask a guest in the Guest Wing whether they saw anyone carrying a silver mask.'},
  {place:'Royal Hedge Maze',type:'object',text:'Follow the masquerade clue into the Royal Hedge Maze.'},
  {place:'Grand Ballroom',type:'npc',text:'Return to the Grand Ballroom and reveal what happened before the first dance.'}
 ]},
 {id:'recipe',title:'The Baker’s Missing Recipe',reward:5,steps:[
  {place:'Hearth & Honey Bakery',type:'npc',text:'Talk to the baker about the recipe that vanished before the morning bake.'},
  {place:'Roseglass Market Lane',type:'object',text:'Search Roseglass Market Lane for a dropped ingredient list.'},
  {place:'Palace Pantry',type:'object',text:'Look through the Palace Pantry for the unusual spice named in the list.'},
  {place:'Royal Kitchens',type:'npc',text:'Ask someone in the Royal Kitchens who last borrowed the recipe.'},
  {place:'Hearth & Honey Bakery',type:'npc',text:'Return to the bakery with the answer and help save the afternoon pastries.'}
 ]},
 {id:'harbor',title:'Lanterns of Moonharbor',reward:6,steps:[
  {place:'Moonharbor Pier',type:'npc',text:'Ask the harbor crew why several pier lanterns went dark at once.'},
  {place:'Moonharbor',type:'object',text:'Search Moonharbor for a trail of blue wax.'},
  {place:'Lantern Bridge',type:'object',text:'Inspect Lantern Bridge for the missing lantern glass.'},
  {place:'Azuremere Lighthouse',type:'npc',text:'Ask the lighthouse keeper about a ship that passed before dawn.'},
  {place:'Moonharbor Pier',type:'object',text:'Return to the pier and relight the final lantern.'}
 ]},
 {id:'tower',title:'The Star Map of Old Moon Tower',reward:7,steps:[
  {place:'Old Moon Tower',type:'object',text:'Investigate the star-shaped window in Old Moon Tower.'},
  {place:'Royal Library',type:'npc',text:'Ask someone in the Royal Library about the missing constellation map.'},
  {place:'West Tower',type:'object',text:'Search the West Tower for a matching brass star marker.'},
  {place:'Nocturne Hollow',type:'npc',text:'Find a traveler in Nocturne Hollow who recognizes the old star symbol.'},
  {place:'Old Moon Tower',type:'object',text:'Return to Old Moon Tower and complete the forgotten star map.'}
 ]},
 {id:'harvest',title:'The Village Harvest Festival',reward:5,steps:[
  {place:'Barleycross',type:'npc',text:'Ask the villagers in Barleycross what the harvest festival still needs.'},
  {place:'Red Orchard',type:'object',text:'Gather a clue to the missing apple cart in Red Orchard.'},
  {place:'Pinehollow',type:'npc',text:'Ask someone in Pinehollow about the musician who promised to perform.'},
  {place:'Festival Green',type:'object',text:'Help prepare Festival Green before the celebration begins.'},
  {place:'Barleycross',type:'npc',text:'Return to Barleycross and join the villagers as the festival opens.'}
 ]},
 {id:'below',title:'The Key Beneath the Castle',reward:8,steps:[
  {place:'Servants’ Stair Belowstairs',type:'object',text:'Inspect the servants’ stair for the old key mark scratched into the stone.'},
  {place:'Sealed Store Cellars',type:'object',text:'Search the Sealed Store Cellars for the lock that matches the mark.'},
  {place:'Forgotten Foundation Hall',type:'npc',text:'Ask the lantern keeper what used to stand in the Forgotten Foundation Hall.'},
  {place:'River Gate Tunnel',type:'object',text:'Follow the old foundation clue through the River Gate Tunnel.'},
  {place:'Hidden Passage Network',type:'object',text:'Use what you learned to uncover a forgotten door in the Hidden Passage Network.'}
 ]},
 {id:'quiet',title:'A Lovely Day in the Kingdom',reward:4,steps:[
  {place:'Queen’s Gardens',type:'npc',text:'Spend a little time talking with someone in the Queen’s Gardens.'},
  {place:'The Crooked Bookmark',type:'object',text:'Browse something interesting at The Crooked Bookmark.'},
  {place:'Moonharbor Inn',type:'npc',text:'Stop by Moonharbor Inn and share a quiet conversation.'},
  {place:'Royal Rose Arbor',type:'object',text:'Finish the day with a peaceful discovery at the Royal Rose Arbor.'}
 ]}
];
function currentQuest(){return quests[state.quest%quests.length]}
function currentStep(){const q=currentQuest();return q.steps[state.step]||null}
function currentPlace(){return clean($('#worldTitle')?.textContent)}
function routeTo(destination){
 const locs=window.StorybookWorld?.locations?.()||[];
 const current=locs.find(x=>x.name===currentPlace()),goal=locs.find(x=>x.name===destination);
 if(!current||!goal)return [];
 const byId=new Map(locs.map(x=>[x.id,x])),queue=[[current.id]],seen=new Set([current.id]);
 while(queue.length){
  const path=queue.shift(),id=path[path.length-1];
  if(id===goal.id)return path.map(x=>byId.get(x)).filter(Boolean);
  const node=byId.get(id);
  for(const next of node?.links||[]){
   if(!seen.has(next)){seen.add(next);queue.push(path.concat(next))}
  }
 }
 return []
}
function updateRoute(){
 const s=currentStep(),hint=$('#gameRouteHint');
 $$('.play-portal.quest-route').forEach(x=>x.classList.remove('quest-route'));
 if(!s){if(hint)hint.textContent='';return}
 if(!hint)return;
 if(currentPlace()===s.place){
  hint.textContent='📍 You are at the quest location. Find the required person or object.';
  return
 }
 const route=routeTo(s.place),next=route[1];
 if(!next){hint.textContent='🗺️ Open the map to find '+s.place;return}
 const remaining=Math.max(1,route.length-1);
 hint.textContent='🧭 Next road: '+next.name+' · '+remaining+' travel step'+(remaining===1?'':'s')+' away';
 setTimeout(()=>{
  $$('.play-portal').forEach(p=>{
   const label=p.querySelector('small')?.textContent||'';
   if(label.includes(next.name))p.classList.add('quest-route')
  })
 },120)
}
function render(){
 const q=currentQuest(),s=currentStep();
 if($('#gameStars'))$('#gameStars').textContent='⭐ '+state.stars;
 const title=$('#gameQuestTitle'),body=$('#gameQuestBody'),bar=$('#gameQuestBar'),status=$('#gameQuestStatus');
 if(!title)return;
 title.textContent=s?q.title:'Quest complete';
 body.textContent=s?s.text:'Choose another quest whenever you feel like playing a story.';
 const done=s?state.step:q.steps.length;
 bar.style.width=Math.round((done/q.steps.length)*100)+'%';
 status.textContent=s?('Step '+(state.step+1)+' of '+q.steps.length+' · '+s.place):('Completed · +'+q.reward+' stars');
 const btn=$('#gameQuestTravel');
 if(btn){btn.disabled=!s;btn.textContent=s?'🧭 Show destination':'✓ Quest completed'}
 updateRoute();
}
function advance(detail){
 const s=currentStep();if(!s)return;
 const place=currentPlace();
 if(place!==s.place||detail.type!==s.type)return;
 state.step++;
 const q=currentQuest();
 if(state.step>=q.steps.length){
   if(!state.completed.includes(q.id)){state.completed.push(q.id);state.stars+=q.reward}
 }
 save();render();flash(state.step>=q.steps.length?'✨ Quest complete! Your kingdom remembers this adventure.':'✨ Quest updated! Follow the next clue.');
}
function flash(text){
 let e=$('#gameFlash');
 if(!e){e=document.createElement('div');e.id='gameFlash';e.className='game-flash';document.body.appendChild(e)}
 e.textContent=text;e.classList.add('show');clearTimeout(e.t);e.t=setTimeout(()=>e.classList.remove('show'),2300)
}
function nextQuest(){
 state.quest=(state.quest+1)%quests.length;state.step=0;save();render();flash('New quest: '+currentQuest().title)
}
function showDestination(){
 const s=currentStep();if(!s)return;
 const map=$('#worldAtlas');if(map&&!map.classList.contains('open'))$('#worldAtlasButton')?.click();
 setTimeout(()=>{const search=$('#worldSearch');if(search){search.value=s.place;search.dispatchEvent(new Event('input',{bubbles:true}));search.focus()}},80)
}
function mount(){
 const hud=$('#playHud');if(!hud||$('#gameQuestPanel'))return false;
 const panel=document.createElement('section');panel.id='gameQuestPanel';panel.className='game-quest-panel';
 panel.innerHTML='<div class="game-quest-head"><div><small>ACTIVE ADVENTURE</small><strong id="gameQuestTitle"></strong></div><span id="gameStars">⭐ 0</span></div><p id="gameQuestBody"></p><div id="gameRouteHint" class="game-route-hint"></div><div class="game-progress"><i id="gameQuestBar"></i></div><div class="game-quest-foot"><span id="gameQuestStatus"></span><div><button id="gameQuestTravel" type="button">🧭 Show destination</button><button id="gameQuestNext" type="button">↻ Change quest</button></div></div>';
 hud.insertAdjacentElement('afterend',panel);
 $('#gameQuestTravel').addEventListener('click',showDestination);
 $('#gameQuestNext').addEventListener('click',nextQuest);
 document.addEventListener('storybook:interact',e=>advance(e.detail));
 document.addEventListener('storybook:location',()=>{render();setTimeout(updateRoute,180)});
 render();return true
}
function wait(){if(mount())return;const mo=new MutationObserver(()=>{if(mount())mo.disconnect()});mo.observe(document.body,{childList:true,subtree:true})}
window.StorybookGame={
 quests:()=>quests.map(q=>({id:q.id,title:q.title,reward:q.reward,steps:q.steps.map(s=>({...s}))})),
 state:()=>({...state,completed:[...(state.completed||[])]}),
 selectQuest:id=>{const i=quests.findIndex(q=>q.id===id);if(i>=0){state.quest=i;state.step=0;save();render();flash('New quest: '+quests[i].title);return true}return false}
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait);else wait();
})();