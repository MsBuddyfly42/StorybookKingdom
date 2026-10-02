/* Storybook Kingdom — optional quest, checkpoint and exploration systems */
(()=>{'use strict';
const $=s=>document.querySelector(s);
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
 ]}
];
function currentQuest(){return quests[state.quest%quests.length]}
function currentStep(){const q=currentQuest();return q.steps[state.step]||null}
function currentPlace(){return clean($('#worldTitle')?.textContent)}
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
 panel.innerHTML='<div class="game-quest-head"><div><small>ACTIVE ADVENTURE</small><strong id="gameQuestTitle"></strong></div><span id="gameStars">⭐ 0</span></div><p id="gameQuestBody"></p><div class="game-progress"><i id="gameQuestBar"></i></div><div class="game-quest-foot"><span id="gameQuestStatus"></span><div><button id="gameQuestTravel" type="button">🧭 Show destination</button><button id="gameQuestNext" type="button">↻ Change quest</button></div></div>';
 hud.insertAdjacentElement('afterend',panel);
 $('#gameQuestTravel').addEventListener('click',showDestination);
 $('#gameQuestNext').addEventListener('click',nextQuest);
 document.addEventListener('storybook:interact',e=>advance(e.detail));
 document.addEventListener('storybook:location',render);
 render();return true
}
function wait(){if(mount())return;const mo=new MutationObserver(()=>{if(mount())mo.disconnect()});mo.observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait);else wait();
})();