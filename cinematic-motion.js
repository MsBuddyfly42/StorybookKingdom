/* Storybook Kingdom — cinematic door and camera transitions */
(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s);
let overlayTimer=0,arriveTimer=0;
function stage(){return $('#worldStage')}
function ensure(){
 const st=stage();if(!st)return null;
 let o=$('#travelCurtain',st);
 if(!o){o=document.createElement('div');o.id='travelCurtain';o.className='travel-curtain';o.innerHTML='<div class="travel-curtain-inner"><span>✦</span><strong id="travelCurtainText">Traveling…</strong></div>';st.appendChild(o)}
 return o
}
function depart(detail){
 const st=stage(),o=ensure();if(!st||!o)return;
 const portal=$('.play-portal.play-near',st);
 if(portal){portal.classList.add('opening');setTimeout(()=>portal.classList.remove('opening'),900)}
 $('#travelCurtainText').textContent='Entering '+String(detail?.label||'the next place').replace(/^.*?(?=[A-Za-z])/,'');
 st.classList.remove('camera-arrive');st.classList.add('camera-depart');
 clearTimeout(overlayTimer);overlayTimer=setTimeout(()=>o.classList.add('show'),180)
}
function arrive(detail){
 const st=stage(),o=ensure();if(!st||!o)return;
 st.classList.remove('camera-depart');st.classList.add('camera-arrive');
 const name=String(detail?.name||'').replace(/^[^A-Za-z]+/,'').trim();
 $('#travelCurtainText').textContent=name?'Arriving at '+name:'You arrive';
 o.classList.add('show');
 clearTimeout(arriveTimer);arriveTimer=setTimeout(()=>{o.classList.remove('show');setTimeout(()=>st.classList.remove('camera-arrive'),650)},300)
}
function mount(){
 if(!stage())return false;
 ensure();
 document.addEventListener('storybook:before-travel',e=>depart(e.detail));
 document.addEventListener('storybook:location',e=>arrive(e.detail));
 return true
}
function wait(){if(mount())return;const mo=new MutationObserver(()=>{if(mount())mo.disconnect()});mo.observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait);else wait();
})();