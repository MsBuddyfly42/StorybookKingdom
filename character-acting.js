/* Storybook Kingdom — conversation choreography and character acting */
(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
let activeNPC=null,lastLine='',bubbleRAF=0;
function stage(){return $('#worldStage')} function actor(){return $('#worldActor')}
function npcByName(name){return $$('.world-npc',stage()||document).find(n=>n.querySelector('small')?.textContent?.trim()===name)}
function faceEachOther(npc){const a=actor();if(!a||!npc)return;const ax=parseFloat(a.style.left)||50,nx=parseFloat(npc.style.left)||50;a.dataset.facing=nx<ax?'left':'right';npc.dataset.facing=ax<nx?'left':'right';a.classList.add('conversation-focus');npc.classList.add('conversation-focus','npc-speaking')}
function clearConversation(){cancelAnimationFrame(bubbleRAF);$('#speakerBubble',stage()||document)?.classList.remove('show');const a=actor();a?.classList.remove('conversation-focus','actor-listening','actor-speaking','actor-react','actor-point','actor-read','actor-warm','actor-wave','actor-give');if(activeNPC){activeNPC.classList.remove('conversation-focus','npc-speaking','npc-listening','npc-react','npc-point','npc-read','npc-warm','npc-wave','npc-give');activeNPC=null}}
function poseFromText(text){const s=String(text||'').toLowerCase();if(/point|look|there|road|path|door|map/.test(s))return'point';if(/book|read|page|letter|record|archive|note/.test(s))return'read';if(/warm|hearth|fire|flame/.test(s))return'warm';if(/give|hand|take|gift|parcel|basket|recipe|key/.test(s))return'give';if(/hello|welcome|good to see|there you are|see you again/.test(s))return'wave';if(/surprise|what|missing|strange|secret|mystery/.test(s))return'react';return'talk'}
function applyPose(el,type,prefix){if(!el)return;const classes=['talk','point','read','warm','give','wave','react'].map(x=>prefix+'-'+x);el.classList.remove(...classes);el.classList.add(prefix+'-'+type);clearTimeout(el.poseTimer);el.poseTimer=setTimeout(()=>el.classList.remove(prefix+'-'+type),type==='talk'?1800:1300)}
function positionBubble(){
 const bubble=$('#speakerBubble',stage());if(!bubble||!bubble.classList.contains('show'))return;
 const who=bubble.dataset.who==='npc'?activeNPC:actor();
 if(!who)return;
 const sr=stage().getBoundingClientRect(),r=who.getBoundingClientRect();
 let x=((r.left+r.width/2-sr.left)/sr.width)*100;
 let y=((r.top-sr.top)/sr.height)*100;
 bubble.style.left=Math.max(12,Math.min(88,x))+'%';
 bubble.style.top=Math.max(8,Math.min(70,y-5))+'%';
 bubbleRAF=requestAnimationFrame(positionBubble)
}
function speakerBubble(who,text,name){
 const st=stage();if(!st)return;
 let b=$('#speakerBubble',st);if(!b){b=document.createElement('div');b.id='speakerBubble';b.className='speaker-bubble';b.innerHTML='<strong></strong><p></p>';st.appendChild(b)}
 b.dataset.who=who;b.querySelector('strong').textContent=name||'';b.querySelector('p').textContent=String(text||'').slice(0,105)+(String(text||'').length>105?'…':'');
 b.classList.add('show');cancelAnimationFrame(bubbleRAF);positionBubble();
 clearTimeout(b.t);b.t=setTimeout(()=>{b.classList.remove('show');cancelAnimationFrame(bubbleRAF)},Math.max(1800,Math.min(4200,String(text||'').length*42)))
}
function lineChanged(){const line=$('#worldLine')?.textContent?.trim()||'';if(!line||line===lastLine)return;lastLine=line;const speaker=$('#worldSpeaker')?.textContent?.trim()||'';if(activeNPC){const type=poseFromText(line);if(speaker&&activeNPC.querySelector('small')?.textContent?.trim()===speaker){activeNPC.classList.add('npc-speaking');activeNPC.classList.remove('npc-listening');actor()?.classList.add('actor-listening');actor()?.classList.remove('actor-speaking');applyPose(activeNPC,type,'npc')}else{activeNPC.classList.add('npc-listening');activeNPC.classList.remove('npc-speaking');actor()?.classList.add('actor-speaking');actor()?.classList.remove('actor-listening');applyPose(actor(),type,'actor')}}}
function begin(detail){if(detail?.type!=='npc')return;clearConversation();const npc=npcByName(detail.label);if(!npc)return;activeNPC=npc;faceEachOther(npc);const bubble=ensureBubble();bubble.querySelector('strong').textContent=detail.label;bubble.classList.add('show');clearTimeout(bubble.t);bubble.t=setTimeout(()=>bubble.classList.remove('show'),1800);setTimeout(lineChanged,120)}
function ensureBubble(){let b=$('#conversationCue',stage());if(b)return b;b=document.createElement('div');b.id='conversationCue';b.className='conversation-cue';b.innerHTML='<span>💬</span><strong></strong>';stage()?.appendChild(b);return b}
function roomAct(detail){const a=actor();if(!a)return;const name=String(detail?.name||'').toLowerCase();if(/read|book|shelves|map/.test(name))applyPose(a,'read','actor');else if(/warm|hearth/.test(name))applyPose(a,'warm','actor');else if(/look|watch|study|inspect/.test(name))applyPose(a,'point','actor');else if(/tea|sit|rest/.test(name))a.dataset.pose='sit';else applyPose(a,'talk','actor')}
function activityAct(e){const a=actor();if(!a)return;const id=e?.detail?.activity||'';if(id==='dance')a.dataset.pose='dance';else if(id==='archery')applyPose(a,'point','actor');else if(id==='baking')applyPose(a,'give','actor');else applyPose(a,'react','actor');clearTimeout(a.activityPoseTimer);a.activityPoseTimer=setTimeout(()=>{a.dataset.pose='idle';a.classList.remove('actor-react','actor-point','actor-give')},1800)}
function observeDialogue(){const line=$('#worldLine'),speaker=$('#worldSpeaker');if(!line||!speaker)return;const obs=new MutationObserver(lineChanged);obs.observe(line,{childList:true,subtree:true,characterData:true});obs.observe(speaker,{childList:true,subtree:true,characterData:true})}
function mount(){if(!stage()||!actor())return false;ensureBubble();observeDialogue();document.addEventListener('storybook:interact',e=>begin(e.detail));document.addEventListener('storybook:room-use',e=>roomAct(e.detail));document.addEventListener('storybook:activity-win',activityAct);document.addEventListener('storybook:location',()=>{clearConversation();lastLine=''});document.addEventListener('storybook:before-travel',clearConversation);return true}
function wait(){if(mount())return;const mo=new MutationObserver(()=>{if(mount())mo.disconnect()});mo.observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait);else wait();
})();