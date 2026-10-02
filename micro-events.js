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