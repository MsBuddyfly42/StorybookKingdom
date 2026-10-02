/* Storybook Kingdom — distant ambient population and scene life */
(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s);
const sceneSets={
  throne:['🛡️','🧑‍💼','🕯️'],
  hall:['🛡️','🧑‍💼','🧹','📜'],
  library:['🧑‍🎓','🧑‍💼','📚'],
  kitchen:['🧑‍🍳','🧑‍🍳','🧺','🥖'],
  ballroom:['💃','🕺','🎻','🧑‍💼'],
  chapel:['🧑‍💼','🕯️','📜'],
  nursery:['🧹','🧸'],
  home:['🕯️'],
  tower:['🛡️','🧑‍💼'],
  academy:['🧑‍🎓','🧑‍🎓','🧑‍🏫','📚'],
  town:['🧑‍🌾','🧑‍🍳','🧑‍🎨','🧺','🛍️'],
  harbor:['🧑‍✈️','🧑‍🌾','📦','⚓','🧑‍🎨'],
  nature:['🧑‍🌾','🦋','🧺'],
  festival:['💃','🕺','🧑‍🎨','🎺','🧑‍🌾','🎯'],
  village:['🧑‍🌾','🧑‍🍳','🧺','🐓'],
  realm:['🛡️','🧑‍💼','🧑‍🌾','🧑‍🎨'],
  underground:['🕯️','🧑‍💼']
};
function root(){return $('#livingWorld')}function stage(){return $('#worldStage')}
function scene(){return root()?.dataset.scene||root()?.dataset.zone||'town'}
function count(){
  const t=root()?.dataset.time||'afternoon',sc=scene();
  let base=['festival','town','harbor','academy'].includes(sc)?6:['ballroom','village','realm'].includes(sc)?5:3;
  if(t==='morning')base=Math.max(2,base-1);
  if(t==='night')base=Math.max(1,Math.ceil(base*.45));
  return base
}
function positions(n){
  const pts=[[14,52],[28,43],[41,54],[58,45],[72,54],[86,43],[21,61],[79,62]];
  return pts.slice(0,n)
}
function render(){
  const st=stage();if(!st)return;
  let layer=$('#ambientCrowds',st);if(!layer){layer=document.createElement('div');layer.id='ambientCrowds';layer.className='ambient-crowds';st.appendChild(layer)}
  layer.replaceChildren();
  const sc=scene(),set=sceneSets[sc]||sceneSets.town,n=count(),pts=positions(n);
  pts.forEach((pt,i)=>{
    const e=document.createElement('span');e.className='ambient-extra';
    e.textContent=set[i%set.length];e.style.left=pt[0]+'%';e.style.top=pt[1]+'%';
    const depth=.5+pt[1]/150;e.style.setProperty('--extra-scale',depth.toFixed(2));
    e.style.animationDelay=(-i*.7)+'s';e.style.animationDuration=(3.6+(i%3)*.8)+'s';
    layer.appendChild(e)
  })
}
function mount(){
  if(!root()||!stage())return false;
  document.addEventListener('storybook:location',()=>setTimeout(render,130));
  new MutationObserver(render).observe(root(),{attributes:true,attributeFilter:['data-scene','data-zone','data-time']});
  render();return true
}
function wait(){if(mount())return;const mo=new MutationObserver(()=>{if(mount())mo.disconnect()});mo.observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait);else wait();
})();