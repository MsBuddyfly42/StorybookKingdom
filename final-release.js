/* Storybook Kingdom — final release polish: animation, atmosphere, audio and performance */
(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const PREF='storybook_final_release_v1';
const load=()=>{try{return JSON.parse(localStorage.getItem(PREF)||'{}')}catch{return {}}};
const prefs={audio:false,volume:.28,...load()};
const save=()=>{try{localStorage.setItem(PREF,JSON.stringify(prefs))}catch{}};
let ctx=null,master=null,lastStep=0,ambientTimer=0,poseTimer=0,hidden=false;
function root(){return $('#livingWorld')}
function stage(){return $('#worldStage')}
function ensureAudio(){
 if(ctx)return true;
 try{
  ctx=new (window.AudioContext||window.webkitAudioContext)();
  master=ctx.createGain();master.gain.value=prefs.audio?prefs.volume:0;master.connect(ctx.destination);return true
 }catch{return false}
}
function tone(freq=440,dur=.12,type='sine',gain=.05,delay=0){
 if(!prefs.audio||!ensureAudio())return;
 const t=ctx.currentTime+delay,o=ctx.createOscillator(),g=ctx.createGain();
 o.type=type;o.frequency.setValueAtTime(freq,t);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(gain,t+.012);g.gain.exponentialRampToValueAtTime(.001,t+dur);
 o.connect(g);g.connect(master);o.start(t);o.stop(t+dur+.03)
}
function chord(notes,dur=.5,gain=.022){notes.forEach((n,i)=>tone(n,dur,'sine',gain,i*.035))}
function noise(dur=.08,gain=.025){
 if(!prefs.audio||!ensureAudio())return;
 const len=Math.max(1,Math.floor(ctx.sampleRate*dur)),buf=ctx.createBuffer(1,len,ctx.sampleRate),data=buf.getChannelData(0);
 for(let i=0;i<len;i++)data[i]=(Math.random()*2-1)*(1-i/len);
 const src=ctx.createBufferSource(),g=ctx.createGain();src.buffer=buf;g.gain.value=gain;src.connect(g);g.connect(master);src.start()
}
function cue(name){
 if(!prefs.audio)return;
 const cues={
  interact:()=>chord([523,659],.16,.027),travel:()=>chord([392,523,659],.42,.026),arrive:()=>chord([659,784,988],.35,.024),
  collect:()=>chord([880,1175],.24,.025),win:()=>chord([523,659,784,1047],.5,.027),buy:()=>chord([587,740,880],.3,.024),
  achievement:()=>chord([523,659,784,988],.7,.028),rest:()=>chord([330,392,494],.65,.018)
 };(cues[name]||cues.interact)()
}
function footstep(){
 const now=performance.now();if(now-lastStep<240)return;lastStep=now;noise(.055,.018);tone(90,.055,'triangle',.012)
}
function ambientChime(){
 if(!prefs.audio||document.hidden||root()?.hidden)return;
 const z=root()?.dataset.zone||'town',time=root()?.dataset.time||'afternoon';
 const sets={castle:[392,523,659],town:[440,587,659],nature:[523,659,784],harbor:[349,523,698],underground:[196,294,392],academy:[440,554,659],village:[392,494,587],realm:[330,494,659]};
 const set=sets[z]||sets.town,base=set[Math.floor(Math.random()*set.length)];
 tone(base,time==='night'?.7:.45,'sine',.009);if(Math.random()<.45)tone(base*1.5,.5,'sine',.006,.08)
}
function audioButton(){
 const actions=$('#gameShell .shell-actions');if(!actions||$('#finalAudioBtn'))return;
 const b=document.createElement('button');b.id='finalAudioBtn';b.type='button';actions.appendChild(b);
 const draw=()=>b.textContent=prefs.audio?'🔊 Sound':'🔇 Sound';
 b.addEventListener('click',async()=>{prefs.audio=!prefs.audio;save();ensureAudio();if(ctx?.state==='suspended')await ctx.resume();if(master)master.gain.setTargetAtTime(prefs.audio?prefs.volume:0,ctx.currentTime,.03);draw();if(prefs.audio)cue('arrive')});draw()
}
function particleLayer(){
 const st=stage();if(!st)return;
 let layer=$('#finalParticles',st);if(!layer){layer=document.createElement('div');layer.id='finalParticles';layer.className='final-particles';st.prepend(layer)}
 layer.replaceChildren();
 const weather=root()?.dataset.weather||'sunshine',zone=root()?.dataset.zone||'town',time=root()?.dataset.time||'afternoon';
 let glyph='✦',count=10,kind='spark';
 if(weather==='snow'){glyph='❄';count=18;kind='snow'}
 else if(weather==='rain'){glyph='·';count=22;kind='rain'}
 else if(zone==='nature'){glyph=time==='night'?'✦':'🍃';count=14;kind=time==='night'?'firefly':'leaf'}
 else if(zone==='underground'){glyph='·';count=11;kind='ember'}
 else if(zone==='harbor'){glyph='~';count=10;kind='mist'}
 for(let i=0;i<count;i++){const s=document.createElement('i');s.className=kind;s.textContent=glyph;s.style.left=(4+Math.random()*92)+'%';s.style.top=(4+Math.random()*80)+'%';s.style.animationDelay=(-Math.random()*6)+'s';s.style.animationDuration=(3+Math.random()*5)+'s';layer.appendChild(s)}
}
function animateNPCs(){
 const npcs=$$('.world-npc',stage()||document);
 npcs.forEach((n,i)=>{
  n.classList.remove('npc-look','npc-work','npc-chat','npc-stroll');
  const classes=['npc-look','npc-work','npc-chat','npc-stroll'];n.classList.add(classes[(i+Math.floor(Date.now()/4500))%classes.length])
 })
}
function reactNPC(detail){
 if(detail?.type!=='npc')return;
 const name=detail.label,match=$$('.world-npc').find(n=>n.querySelector('small')?.textContent?.trim()===name);
 if(match){match.classList.add('npc-react');setTimeout(()=>match.classList.remove('npc-react'),1200)}
 let bubble=$('#finalSpeech',stage());if(!bubble){bubble=document.createElement('div');bubble.id='finalSpeech';bubble.className='final-speech';stage()?.appendChild(bubble)}
 bubble.textContent='💬 '+name;bubble.classList.add('show');clearTimeout(bubble.t);bubble.t=setTimeout(()=>bubble.classList.remove('show'),1200)
}
function releaseBadge(){
 const bar=$('#worldPulse');if(!bar||$('#releaseBadge'))return;
 const s=document.createElement('span');s.id='releaseBadge';s.className='release-badge';s.textContent='FINAL RELEASE';bar.appendChild(s)
}
function bind(){
 document.addEventListener('storybook:interact',e=>{cue('interact');reactNPC(e.detail)});
 document.addEventListener('storybook:before-travel',()=>cue('travel'));
 document.addEventListener('storybook:location',()=>{setTimeout(()=>{cue('arrive');particleLayer();animateNPCs();releaseBadge()},140)});
 document.addEventListener('storybook:collect',()=>cue('collect'));
 document.addEventListener('storybook:activity-win',()=>cue('win'));
 document.addEventListener('storybook:purchase',()=>cue('buy'));
 document.addEventListener('storybook:home-rest',()=>cue('rest'));
 const actor=$('#worldActor');
 if(actor)new MutationObserver(()=>{if(actor.classList.contains('is-moving'))footstep()}).observe(actor,{attributes:true,attributeFilter:['class']});
 const r=root();if(r)new MutationObserver(()=>particleLayer()).observe(r,{attributes:true,attributeFilter:['data-weather','data-time','data-zone']});
}
function performance(){
 document.addEventListener('visibilitychange',()=>{hidden=document.hidden;document.documentElement.classList.toggle('game-hidden',hidden);if(ctx){if(hidden&&ctx.state==='running')ctx.suspend();else if(!hidden&&prefs.audio&&ctx.state==='suspended')ctx.resume()}});
 window.addEventListener('pagehide',()=>{clearInterval(ambientTimer);clearInterval(poseTimer)})
}
function mount(){
 if(!root()||!stage())return false;
 audioButton();particleLayer();animateNPCs();releaseBadge();bind();performance();
 clearInterval(ambientTimer);ambientTimer=setInterval(ambientChime,11000);
 clearInterval(poseTimer);poseTimer=setInterval(()=>{if(!document.hidden&&!root().hidden)animateNPCs()},4300);
 return true
}
function wait(){if(mount())return;const mo=new MutationObserver(()=>{if(mount())mo.disconnect()});mo.observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait);else wait();
})();