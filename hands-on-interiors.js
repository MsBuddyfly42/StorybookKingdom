/* Furnished home and castle rooms with persistent, visible actions. */
(()=>{'use strict';
const $=s=>document.querySelector(s),KEY='storybook_hands_on_rooms_v1';
let state;try{state=JSON.parse(localStorage.getItem(KEY)||'{}')}catch{state={}};
state={rooms:{},day:1,...state};state.rooms=state.rooms||{};
let location='',kind='',panel,mode='idle',wakeTime='morning',timer;
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(state))}catch{}};
const room=()=>state.rooms[location]||(state.rooms[location]={phase:'measure',ingredients:0,stirs:0,batches:0});
const names={home:'Your cozy room',library:'The reading room',kitchen:'The castle kitchen'};
function setMode(next){mode=next;room().mode=next;save();render()}
function clock(t){const s=$('#worldClock');if(s){s.value=t;s.dispatchEvent(new Event('change',{bubbles:true}))}}
function action(a){
 const r=room();
 if(a==='sit'||a==='read'||a==='tea'||a==='sleep'){setMode(a);return}
 if(a==='wake'){if(mode==='sleep'){if(wakeTime==='morning'){state.day++;save()}clock(wakeTime)}setMode('idle');return}
 if(a==='stand'){setMode('idle');return}
 if(a==='ingredient'&&r.phase==='measure'){r.ingredients=Math.min(3,r.ingredients+1);if(r.ingredients===3)r.phase='mix';mode='mix'}
 if(a==='stir'&&r.phase==='mix'){r.stirs=Math.min(5,r.stirs+1);mode='mix';if(r.stirs===5)r.phase='ready'}
 if(a==='oven'&&r.phase==='ready'){r.phase='oven';r.readyAt=Date.now()+6000;mode='oven'}
 if(a==='take'&&r.phase==='oven'&&Date.now()>=r.readyAt){r.phase='done';r.batches++;mode='serve'}
 if(a==='again'&&r.phase==='done'){Object.assign(r,{phase:'measure',ingredients:0,stirs:0});mode='idle'}
 r.mode=mode;save();render()
}
function button(label,a,disabled=false){const b=document.createElement('button');b.type='button';b.textContent=label;b.disabled=disabled;b.onclick=()=>action(a);return b}
function render(){
 if(!panel||!kind)return;const r=room(),scene=panel.querySelector('.hi-scene'),caption=panel.querySelector('.hi-caption'),controls=panel.querySelector('.hi-controls');
 scene.dataset.mode=mode;scene.dataset.phase=r.phase;
 const model=$('#worldActor .human-model');const holder=scene.querySelector('.hi-person');holder.replaceChildren();if(model)holder.appendChild(model.cloneNode(true));
 controls.replaceChildren();let line='Choose a spot and settle in. Stay as long as you like.';
 if(kind==='home'){
 controls.append(button('Sit in the armchair','sit'),button('Read a book','read'),button('Pour some tea','tea'),button('Lie down in bed','sleep'),button(mode==='sleep'?'Wake up — '+wakeTime:'Get up','wake'));
 line=mode==='sleep'?'You are lying beneath the quilt. Wake up whenever you are ready.':mode==='read'?'You sit in the armchair with an open book.':mode==='tea'?'You pour a cup of tea; steam rises from the pot.':mode==='sit'?'You are seated comfortably in the armchair.':'Your chair, tea table, and bed are ready for a quiet visit.';
 }else if(kind==='library'){
 controls.append(button('Sit and read','read'),button('Turn the page','read'),button('Get up','stand'));
 line=mode==='read'?'You sit at the reading table, turning the pages of an old kingdom tale.':'Pull up a chair at the reading table.';
 }else{
 const labels={measure:['Add '+['flour','honey','milk'][r.ingredients]+' to the bowl','ingredient'],mix:['Stir the batter ('+r.stirs+'/5)','stir'],ready:['Put the tart in the oven','oven'],oven:[Date.now()>=r.readyAt?'Take the golden tart out':'Baking…','take'],done:['Bake another tart','again']};
 const [label,a]=labels[r.phase]||labels.measure;controls.append(button(label,a,r.phase==='oven'&&Date.now()<r.readyAt));
 scene.querySelector('.hi-bowl').dataset.fill=String(r.ingredients);scene.querySelector('.hi-food').textContent=r.phase==='done'?'🥧':r.phase==='oven'?'◒':' ';scene.querySelector('.hi-progress').textContent=r.phase==='mix'||r.phase==='ready'?r.stirs+'/5 stirs':r.ingredients+'/3 ingredients';
 line=r.phase==='measure'?'Measure the ingredients into the bowl.':r.phase==='mix'?'Your spoon moves through the batter. Each stir counts.':r.phase==='ready'?'The batter is smooth. It is ready for the oven.':r.phase==='oven'?'The tart is baking behind the oven door.':'A golden tart is cooling on the tray. '+r.batches+' batch'+(r.batches===1?'':'es')+' baked.';
 }
 caption.textContent=line;panel.querySelector('.hi-day').textContent='Kingdom day '+state.day;
}
function mountRoom(){
 clearInterval(timer);location=($('#worldTitle')?.textContent||'').replace(/^[^A-Za-z]+/,'').trim();kind=$('#livingWorld')?.dataset.scene||'';
 $('#handsOnInterior')?.remove();panel=null;mode='idle';
 if(!names[kind])return;
 mode=room().mode||'idle';wakeTime='morning';
 panel=document.createElement('section');panel.id='handsOnInterior';panel.className='hi-panel';panel.dataset.room=kind;
 panel.innerHTML='<header><div><small>A PLACE TO SPEND TIME</small><h2>'+names[kind]+'</h2></div><span class="hi-day"></span></header><div class="hi-scene" aria-label="Furnished interactive room"><div class="hi-window"></div><div class="hi-rug"></div><div class="hi-chair"></div><div class="hi-table"></div><div class="hi-bed"><i class="hi-pillow"></i><i class="hi-quilt"></i></div><div class="hi-shelf">📚 📚 📚</div><div class="hi-person"></div><div class="hi-book">📖</div><div class="hi-tea">🫖<i></i></div><div class="hi-bowl"><i></i></div><div class="hi-oven"><i></i></div><div class="hi-food"></div><div class="hi-progress"></div><div class="hi-zzz">Z z z</div></div><p class="hi-caption" role="status" aria-live="polite"></p><div class="hi-controls"></div>';
 $('#worldStage').insertAdjacentElement('afterend',panel);render();
 if(kind==='kitchen')timer=setInterval(()=>{if(room().phase==='oven'&&Date.now()>=room().readyAt){const b=panel?.querySelector('.hi-controls button');if(b?.disabled)render()}},500);
}
function mount(){
 if(!$('#worldStage'))return false;
 document.addEventListener('storybook:location',()=>setTimeout(mountRoom,180));
 document.addEventListener('click',e=>{
 const b=e.target.closest('#homeOverlay [data-rest]');if(!b||$('#livingWorld')?.dataset.scene!=='home')return;
 e.preventDefault();e.stopImmediatePropagation();wakeTime=b.dataset.rest;$('#homeOverlay').hidden=true;setMode('sleep');panel?.scrollIntoView({behavior:'smooth',block:'center'});
 },true);
 document.addEventListener('storybook:room-use',e=>{if(!panel)return;const n=e.detail.name;if(/read/i.test(n))setMode('read');else if(/tea/i.test(n))setMode('tea');else if(/sit/i.test(n))setMode('sit')});
 // Legacy furniture gestures now articulate the model instead of leaving it standing.
 mountRoom();return true
}
function wait(){if(mount())return;const m=new MutationObserver(()=>{if(mount())m.disconnect()});m.observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait);else wait();
})();
