/* Storybook Kingdom — proximity-reactive doors and ambient NPC exchanges */
(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
let socialTimer=0,doorTimer=0,lastDoor=null;
function root(){return $('#livingWorld')} function stage(){return $('#worldStage')} function actor(){return $('#worldActor')}
function rect(el){const st=stage();if(!st||!el)return null;const sr=st.getBoundingClientRect(),r=el.getBoundingClientRect();return {x:(r.left+r.width/2-sr.left)/sr.width*100,y:(r.top+r.height/2-sr.top)/sr.height*100}}
function distance(a,b){return Math.hypot((a.x-b.x)*1.25,a.y-b.y)}
function playerPos(){const a=actor();return {x:parseFloat(a?.style.left)||50,y:parseFloat(a?.style.top)||78}}
function doorReact(){
 if(root()?.hidden||!stage())return;
 const p=playerPos();let best=null,d=Infinity;
 $$('.play-portal',stage()).forEach(el=>{const q=rect(el);if(!q)return;const n=distance(p,q);if(n<d){d=n;best=el}});
 $$('.play-portal.proximity-open',stage()).forEach(el=>{if(el!==best||d>17)el.classList.remove('proximity-open')});
 if(best&&d<=17&&!best.classList.contains('opening')&&!best.classList.contains('door-after-entry')){
  best.classList.add('proximity-open');lastDoor=best
 }else if(lastDoor&&d>17){lastDoor.classList.remove('proximity-open');lastDoor=null}
}
const chatter=[
 ['“Busy day.”','“It always is lately.”'],
 ['“Did you hear the bells?”','“Twice, just after noon.”'],
 ['“The road is crowded today.”','“Festival traffic, I think.”'],
 ['“Beautiful weather.”','“For now.”'],
 ['“Have you seen the traveler?”','“Just passed through.”'],
 ['“I’ll finish this before supper.”','“You said that yesterday.”']
];
function social(){
 if(document.hidden||root()?.hidden||!stage())return;
 const npcs=$$('.world-npc',stage()).filter(n=>!n.classList.contains('conversation-focus')&&!n.classList.contains('play-near'));
 if(npcs.length<2)return;
 const a=npcs[Math.floor(Math.random()*npcs.length)],others=npcs.filter(x=>x!==a);
 const b=others[Math.floor(Math.random()*others.length)];
 if(!b)return;
 const ar=rect(a),br=rect(b);if(!ar||!br||distance(ar,br)>45)return;
 a.dataset.facing=br.x<ar.x?'left':'right';b.dataset.facing=ar.x<br.x?'left':'right';
 a.classList.add('ambient-chat');b.classList.add('ambient-chat');
 const pair=chatter[Math.floor(Math.random()*chatter.length)];
 bubble(a,pair[0],'left');setTimeout(()=>bubble(b,pair[1],'right'),1000);
 setTimeout(()=>{a.classList.remove('ambient-chat');b.classList.remove('ambient-chat')},3000)
}
function bubble(npc,text,side){
 const st=stage();if(!st||!npc)return;
 const q=rect(npc);if(!q)return;
 const e=document.createElement('div');e.className='ambient-chat-bubble '+side;e.textContent=text;e.style.left=q.x+'%';e.style.top=Math.max(8,q.y-11)+'%';st.appendChild(e);
 requestAnimationFrame(()=>e.classList.add('show'));setTimeout(()=>{e.classList.remove('show');setTimeout(()=>e.remove(),220)},1500)
}
function mount(){
 if(!root()||!stage()||!actor())return false;
 clearInterval(doorTimer);doorTimer=setInterval(doorReact,120);
 clearInterval(socialTimer);socialTimer=setInterval(social,7800);
 document.addEventListener('storybook:location',()=>{lastDoor=null;setTimeout(doorReact,180)});
 return true
}
function wait(){if(mount())return;const mo=new MutationObserver(()=>{if(mount())mo.disconnect()});mo.observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait);else wait();
})();