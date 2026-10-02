/* Storybook Kingdom — subtle camera depth and local light response */
(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s);
let raf=0,lastX=-1,lastY=-1;
function root(){return $('#livingWorld')} function stage(){return $('#worldStage')} function actor(){return $('#worldActor')}
function update(){
 const r=root(),st=stage(),a=actor();
 if(!r||!st||!a||r.hidden||document.hidden){raf=requestAnimationFrame(update);return}
 const x=parseFloat(a.style.left)||50,y=parseFloat(a.style.top)||78;
 if(Math.abs(x-lastX)>.15||Math.abs(y-lastY)>.15){
  lastX=x;lastY=y;
  const px=((x-50)/50).toFixed(3),py=((y-55)/45).toFixed(3);
  st.style.setProperty('--player-x',px);st.style.setProperty('--player-y',py);
  st.style.setProperty('--far-x',(Number(px)*-6).toFixed(2)+'px');
  st.style.setProperty('--far-y',(Number(py)*-3).toFixed(2)+'px');
  st.style.setProperty('--mid-x',(Number(px)*-3.2).toFixed(2)+'px');
  st.style.setProperty('--mid-y',(Number(py)*-1.6).toFixed(2)+'px')
 }
 raf=requestAnimationFrame(update)
}
function scene(){
 const r=root();if(!r)return;
 const sc=r.dataset.scene||r.dataset.zone||'town';
 r.classList.toggle('warm-light',/kitchen|home|hall|chapel|library/.test(sc));
 r.classList.toggle('cool-light',/tower|underground|harbor/.test(sc))
}
function mount(){
 if(!root()||!stage()||!actor())return false;
 document.addEventListener('storybook:location',scene);
 new MutationObserver(scene).observe(root(),{attributes:true,attributeFilter:['data-scene','data-zone','data-time']});
 cancelAnimationFrame(raf);raf=requestAnimationFrame(update);scene();return true
}
function wait(){if(mount())return;const mo=new MutationObserver(()=>{if(mount())mo.disconnect()});mo.observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait);else wait();
})();