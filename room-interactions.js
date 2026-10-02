/* Storybook Kingdom — usable furniture and environmental interactions */
(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const clean=s=>(s||'').replace(/^[^A-Za-z]+/,'').trim();
const sceneActions={
 throne:[
  {x:50,y:61,icon:'🪑',name:'Sit near the throne',line:'You sit for a moment beneath the kingdom banners. The room feels much larger when it is quiet.',pose:'sit'},
  {x:18,y:31,icon:'🏳️',name:'Inspect the royal banner',line:'The banner is hand-stitched with tiny gold thread. Some of the symbols look much older than the castle itself.'}
 ],
 library:[
  {x:50,y:63,icon:'📖',name:'Read at the table',line:'You settle at the reading table and turn a few pages. Dust glitters in the lamplight.',pose:'sit'},
  {x:15,y:48,icon:'📚',name:'Browse the shelves',line:'Rows of old titles disappear into shadow. One shelf is devoted entirely to forgotten roads and vanished villages.'},
  {x:83,y:35,icon:'🪟',name:'Look from the library window',line:'From the tall window, you can see lanterns beginning to glow along the castle road.'}
 ],
 kitchen:[
  {x:15,y:54,icon:'🔥',name:'Warm by the hearth',line:'The hearth warms your hands while the kitchen bustles behind you.',pose:'sit'},
  {x:52,y:65,icon:'🥧',name:'Lean on the worktable',line:'The worktable smells faintly of flour, apples, and honey. Someone has left a cooling tart nearby.'}
 ],
 ballroom:[
  {x:50,y:63,icon:'💃',name:'Practice a dance step',line:'You cross the polished floor slowly, counting the steps until they feel natural.',pose:'dance'},
  {x:16,y:43,icon:'🪞',name:'Look into the ballroom mirror',line:'The enormous mirror reflects the chandeliers, the empty floor, and every open doorway behind you.'}
 ],
 chapel:[
  {x:50,y:64,icon:'🕯️',name:'Sit quietly',line:'You sit beneath the colored windows for a peaceful moment. Nothing needs your attention here.',pose:'sit'},
  {x:50,y:33,icon:'🪟',name:'Study the stained glass',line:'Colored light spills across the floor in ruby, blue, and gold shapes.'}
 ],
 nursery:[
  {x:72,y:64,icon:'🛏️',name:'Sit on the window seat',line:'You sit near the old bed and listen to the castle settle around you.',pose:'sit'},
  {x:31,y:65,icon:'🧸',name:'Pick up the old teddy bear',line:'The little bear is worn smooth from years of being loved. You carefully set it back where you found it.'}
 ],
 home:[
  {x:28,y:66,icon:'🪑',name:'Sit down',line:'You settle into the chair and enjoy the feeling of being home.',pose:'sit'},
  {x:22,y:35,icon:'🪟',name:'Look out the window',line:'Outside, the kingdom keeps moving while your room remains warm and quiet.'},
  {x:50,y:65,icon:'🫖',name:'Have some tea',line:'You pour a warm cup of tea and stay awhile.',pose:'sit'}
 ],
 hall:[
  {x:50,y:32,icon:'🖼️',name:'Study the portrait',line:'The painted figure seems stern at first, but there is almost a smile hidden in the eyes.'},
  {x:31,y:62,icon:'🏺',name:'Inspect the old vase',line:'The vase bears a tiny maker’s mark from a village you have not visited yet.'}
 ],
 tower:[
  {x:53,y:54,icon:'🔭',name:'Look through the telescope',line:'Through the telescope you can see village roofs, distant roads, and a silver line of sea far beyond the hills.'},
  {x:27,y:62,icon:'🗺️',name:'Study the map table',line:'The old map shows several roads that no longer appear on modern kingdom maps.'}
 ],
 academy:[
  {x:50,y:65,icon:'✒️',name:'Sit at the study table',line:'You sit among scattered notes and practice sheets while distant classroom voices echo through the halls.',pose:'sit'},
  {x:50,y:32,icon:'🗺️',name:'Study the wall map',line:'Colored pins mark villages, rivers, trade roads, and the neighboring realms.'}
 ],
 underground:[
  {x:16,y:50,icon:'🕯️',name:'Check the wall lantern',line:'The lantern flame bends toward a faint draft coming through the stonework.'},
  {x:68,y:41,icon:'⛓️',name:'Inspect the old chain',line:'The chain is rusted but strong. It once held something heavy against the wall.'}
 ],
 town:[
  {x:74,y:68,icon:'🪵',name:'Rest by the street table',line:'You pause beside the street table and watch people pass along the cobblestones.',pose:'sit'},
  {x:50,y:28,icon:'🪧',name:'Read the town notice board',line:'The notice board lists deliveries, festival announcements, and one handwritten request for help.'}
 ],
 harbor:[
  {x:21,y:69,icon:'⚓',name:'Sit near the mooring post',line:'You sit near the water and listen to ropes creak against the boats.',pose:'sit'},
  {x:62,y:40,icon:'⛵',name:'Watch the ships',line:'Small boats cross the harbor while a larger ship waits beyond the breakwater.'}
 ],
 nature:[
  {x:34,y:71,icon:'🪨',name:'Sit on the stone',line:'You rest on the sun-warmed stone while leaves rustle overhead.',pose:'sit'},
  {x:51,y:42,icon:'🦋',name:'Watch the butterflies',line:'A butterfly loops through the clearing before disappearing among the flowers.'}
 ],
 festival:[
  {x:27,y:63,icon:'🎯',name:'Watch the game booth',line:'Someone lands a perfect throw and a little crowd breaks into applause.'},
  {x:49,y:42,icon:'🎪',name:'Step beneath the festival tent',line:'Music, laughter, and the smell of sweets make the whole tent feel bright and busy.'}
 ],
 village:[
  {x:38,y:70,icon:'🧺',name:'Sit beside the baskets',line:'You rest beside the lane while neighbors carry on with their afternoon.',pose:'sit'},
  {x:20,y:48,icon:'🏡',name:'Look toward the cottages',line:'Smoke curls from chimneys while someone opens a garden gate down the road.'}
 ],
 realm:[
  {x:31,y:66,icon:'🗺️',name:'Check the travel map',line:'The map shows the road back to Roseglass as well as several routes deeper into this realm.'},
  {x:69,y:59,icon:'✨',name:'Take in the view',line:'You stop for a moment and take in a place that feels different from anywhere else in the kingdom.',pose:'sit'}
 ]
};
function root(){return $('#livingWorld')}function stage(){return $('#worldStage')}function scene(){return root()?.dataset.scene||root()?.dataset.zone||'town'}
function layer(){
 const st=stage();if(!st)return null;
 let l=$('#roomUseLayer',st);if(!l){l=document.createElement('div');l.id='roomUseLayer';l.className='room-use-layer';st.appendChild(l)}
 return l
}
function render(){
 const l=layer();if(!l)return;l.replaceChildren();
 const actions=sceneActions[scene()]||[];
 actions.forEach((a,i)=>{
  const b=document.createElement('button');b.type='button';b.className='world-hotspot room-use';b.style.left=a.x+'%';b.style.top=a.y+'%';
  b.innerHTML='<span>'+a.icon+'</span><small>'+a.name+'</small>';
  b.addEventListener('click',e=>{if(e.detail===0)use(a)});l.appendChild(b)
 })
}
function use(a){
 const actor=$('#worldActor');if(actor&&a.pose){actor.dataset.pose=a.pose;clearTimeout(actor.roomPoseTimer);actor.roomPoseTimer=setTimeout(()=>actor.dataset.pose='idle',2600)}
 const speaker=$('#worldSpeaker'),line=$('#worldLine'),choices=$('#worldChoices');
 if(speaker)speaker.textContent='Your surroundings';
 if(line)line.textContent=a.line;
 if(choices){choices.replaceChildren();const c=document.createElement('button');c.textContent='Continue exploring';c.addEventListener('click',()=>{choices.replaceChildren();line.textContent='Walk around and see what else you can use.'});choices.appendChild(c)}
 document.dispatchEvent(new CustomEvent('storybook:room-use',{detail:{scene:scene(),name:a.name,location:clean($('#worldTitle')?.textContent)}}))
}
function mount(){
 if(!root()||!stage())return false;
 document.addEventListener('storybook:location',()=>setTimeout(render,120));
 new MutationObserver(render).observe(root(),{attributes:true,attributeFilter:['data-scene','data-zone']});
 render();return true
}
function wait(){if(mount())return;const mo=new MutationObserver(()=>{if(mount())mo.disconnect()});mo.observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait);else wait();
})();