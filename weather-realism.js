/* Storybook Kingdom — weather physically affects scenes and characters */
(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
function root(){return $('#livingWorld')}function stage(){return $('#worldStage')}
function render(){
 const r=root(),st=stage();if(!r||!st)return;
 let layer=$('#weatherRealism',st);if(!layer){layer=document.createElement('div');layer.id='weatherRealism';layer.className='weather-realism';st.appendChild(layer)}
 layer.replaceChildren();
 const weather=r.dataset.weather||'sunshine',inside=r.dataset.realism==='interior'||r.dataset.realism==='underground';
 r.dataset.weatherReal=weather;
 if(!inside){
  if(weather==='rain'){
   for(let i=0;i<4;i++){const p=document.createElement('i');p.className='weather-puddle';p.style.left=(16+i*22)+'%';p.style.bottom=(6+(i%2)*6)+'%';p.style.width=(48+i*7)+'px';layer.appendChild(p)}
   $$('.world-npc',st).forEach((n,i)=>{if(i<2)n.classList.add('weather-umbrella')})
  }else{
   $$('.world-npc.weather-umbrella',st).forEach(n=>n.classList.remove('weather-umbrella'))
  }
  if(weather==='snow'){
   for(let i=0;i<5;i++){const d=document.createElement('i');d.className='snow-bank';d.style.left=(8+i*21)+'%';d.style.bottom=(2+(i%2)*4)+'%';d.style.width=(55+i*6)+'px';layer.appendChild(d)}
  }
  if(weather==='mist'){
   for(let i=0;i<3;i++){const m=document.createElement('i');m.className='mist-bank';m.style.top=(26+i*18)+'%';m.style.animationDelay=(-i*1.5)+'s';layer.appendChild(m)}
  }
 }else{
  $$('.world-npc.weather-umbrella',st).forEach(n=>n.classList.remove('weather-umbrella'))
 }
 if(inside&&weather!=='sunshine'){
  const glow=document.createElement('div');glow.className='storm-inside-glow';layer.appendChild(glow)
 }
}
function footprints(){
 const r=root(),st=stage(),a=$('#worldActor');if(!r||!st||!a||r.hidden)return;
 const weather=r.dataset.weather||'sunshine';if(!['snow','rain'].includes(weather)||r.dataset.realism==='interior'||r.dataset.realism==='underground')return;
 if(!a.classList.contains('is-moving')&&!a.classList.contains('route-walk'))return;
 if(Math.random()>.22)return;
 const layer=$('#weatherRealism',st);if(!layer)return;
 const mark=document.createElement('i');mark.className='weather-footprint '+weather;
 mark.style.left=a.style.left||'50%';mark.style.top=a.style.top||'78%';layer.appendChild(mark);
 setTimeout(()=>mark.remove(),weather==='snow'?6500:3500)
}
function mount(){
 if(!root()||!stage())return false;
 document.addEventListener('storybook:location',()=>setTimeout(render,110));
 new MutationObserver(render).observe(root(),{attributes:true,attributeFilter:['data-weather','data-realism','data-scene','data-zone']});
 setInterval(footprints,180);
 render();return true
}
function wait(){if(mount())return;const mo=new MutationObserver(()=>{if(mount())mo.disconnect()});mo.observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait);else wait();
})();