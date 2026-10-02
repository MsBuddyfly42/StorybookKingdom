/* Storybook Kingdom — browsable quest book */
(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
function api(){return window.StorybookGame}
function statusFor(id){
 const st=api()?.state?.()||{};
 if((st.completed||[]).includes(id))return 'completed';
 const quests=api()?.quests?.()||[],active=quests[st.quest];
 return active?.id===id?'active':'available'
}
function openBook(){
 const panel=$('#shellQuestBook'),overlay=$('#gameShellOverlay');
 if(!panel||!overlay)return;
 $$('.shell-panel').forEach(p=>p.hidden=true);
 panel.hidden=false;overlay.hidden=false;render();
 panel.querySelector('button')?.focus()
}
function render(){
 const list=$('#questBookList');if(!list||!api())return;
 const quests=api().quests(),st=api().state();
 list.replaceChildren();
 quests.forEach(q=>{
  const card=document.createElement('article');card.className='quest-card '+statusFor(q.id);
  const status=statusFor(q.id);
  card.innerHTML='<div class="quest-card-head"><div><small>'+(status==='completed'?'COMPLETED':status==='active'?'ACTIVE QUEST':'AVAILABLE')+'</small><h3>'+escapeHTML(q.title)+'</h3></div><span>⭐ '+q.reward+'</span></div><ol>'+q.steps.map(s=>'<li><strong>'+escapeHTML(s.place)+'</strong><span>'+escapeHTML(s.text)+'</span></li>').join('')+'</ol>';
  const btn=document.createElement('button');btn.type='button';btn.className='quest-start';
  btn.textContent=status==='active'?'✓ Currently Active':status==='completed'?'↻ Replay Quest':'▶ Start Quest';
  btn.addEventListener('click',()=>{
   api().selectQuest(q.id);render();
   const overlay=$('#gameShellOverlay');if(overlay)overlay.hidden=true;
   $$('.shell-panel').forEach(p=>p.hidden=true);
   const target=$('#gameQuestPanel');target?.scrollIntoView({behavior:'smooth',block:'center'})
  });
  card.appendChild(btn);list.appendChild(card)
 });
 const summary=$('#questBookSummary');if(summary)summary.textContent=(st.completed||[]).length+' of '+quests.length+' adventures completed · ⭐ '+(st.stars||0)+' quest stars';
}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function mount(){
 const shell=$('#gameShell'),overlay=$('#gameShellOverlay');if(!shell||!overlay||!api())return false;
 if($('#shellQuestBtn'))return true;
 const actions=shell.querySelector('.shell-actions');
 const btn=document.createElement('button');btn.id='shellQuestBtn';btn.type='button';btn.textContent='📜 Quests';btn.addEventListener('click',openBook);actions?.prepend(btn);
 const panel=document.createElement('section');panel.id='shellQuestBook';panel.className='shell-panel quest-book-panel';panel.hidden=true;
 panel.innerHTML='<div class="shell-panel-head"><div><small>YOUR ADVENTURES</small><h2>Quest Book</h2></div><button type="button" data-quest-close aria-label="Close">✕</button></div><p id="questBookSummary" class="quest-book-summary"></p><div id="questBookList"></div>';
 overlay.appendChild(panel);
 panel.querySelector('[data-quest-close]').addEventListener('click',()=>{panel.hidden=true;overlay.hidden=true});
 document.addEventListener('storybook:location',render);
 document.addEventListener('storybook:interact',()=>setTimeout(render,100));
 render();return true
}
function wait(){if(mount())return;const mo=new MutationObserver(()=>{if(mount())mo.disconnect()});mo.observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait);else wait();
})();