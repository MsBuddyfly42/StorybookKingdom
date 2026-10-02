/* Storybook Kingdom — live exterior views through interior windows */
(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s);
const scenesWithWindows=new Set(['throne','library','ballroom','chapel','nursery','home','hall','tower','academy']);
function root(){return $('#livingWorld')} function stage(){return $('#worldStage')}
function scene(){return root()?.dataset.scene||''}
function render(){
 const st=stage();if(!st)return;
 let layer=$('#windowViews',st);if(!layer){layer=document.createElement('div');layer.id='windowViews';layer.className='window-views';st.appendChild(layer)}
 layer.replaceChildren();
 if(!scenesWithWindows.has(scene()))return;
 const count=['tower','ballroom','library'].includes(scene())?2:1;
 for(let i=0;i<count;i++){
  const w=document.createElement('div');w.className='live-window '+(i?'right':'left');
  w.innerHTML='<div class="window-sky"><span class="window-orb"></span><i class="cloud c1"></i><i class="cloud c2"></i><div class="window-weather"></div></div><div class="window-frame"><i></i><b></b></div><div class="window-sill"></div>';
  layer.appendChild(w)
 }
 apply()
}
function apply(){
 const r=root(),layer=$('#windowViews');if(!r||!layer)return;
 layer.dataset.time=r.dataset.time||'afternoon';
 layer.dataset.weather=r.dataset.weather||'sunshine';
 layer.querySelectorAll('.window-weather').forEach(box=>{
  box.replaceChildren();const weather=r.dataset.weather||'sunshine';
  const glyph=weather==='rain'?'│':weather==='snow'?'❄':weather==='mist'?'~':'';
  const n=weather==='rain'?12:weather==='snow'?9:weather==='mist'?5:0;
  for(let i=0;i<n;i++){const s=document.createElement('span');s.textContent=glyph;s.style.left=(8+Math.random()*84)+'%';s.style.animationDelay=(-Math.random()*4)+'s';box.appendChild(s)}
 })
}
function mount(){
 if(!root()||!stage())return false;
 document.addEventListener('storybook:location',()=>setTimeout(render,110));
 new MutationObserver(()=>{render()}).observe(root(),{attributes:true,attributeFilter:['data-scene']});
 new MutationObserver(apply).observe(root(),{attributes:true,attributeFilter:['data-time','data-weather']});
 render();return true
}
function wait(){if(mount())return;const mo=new MutationObserver(()=>{if(mount())mo.disconnect()});mo.observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait);else wait();
})();