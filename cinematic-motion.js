/* Storybook Kingdom — cinematic door and camera transitions */
(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s);
let overlayTimer=0,arriveTimer=0;
function stage(){return $('#worldStage')} function actor(){return $('#worldActor')}
function ensure(){
 const st=stage();if(!st)return null;
 let o=$('#travelCurtain',st);
 if(!o){o=document.createElement('div');o.id='travelCurtain';o.className='travel-curtain';o.innerHTML='<div class="travel-curtain-inner"><span>✦</span><strong id="travelCurtainText">Traveling…</strong></div>';st.appendChild(o)}
 return o
}
function depart(detail){
 const st=stage(),o=ensure(),a=actor();if(!st||!o)return;
 const portal=$('.play-portal.play-near',st)||$('.play-portal.approach-arrived',st);
 if(portal){
  portal.classList.add('opening');
  const sr=st.getBoundingClientRect(),pr=portal.getBoundingClientRect(),ar=a?.getBoundingClientRect();
  if(a&&ar){
   const dx=(pr.left+pr.width/2)-(ar.left+ar.width/2);
   const dy=(pr.top+pr.height/2)-(ar.top+ar.height/2);
   a.style.setProperty('--cross-x',Math.max(-90,Math.min(90,dx))+'px');
   a.style.setProperty('--cross-y',Math.max(-70,Math.min(70,dy))+'px');
   a.classList.remove('emerging-room');a.classList.add('crossing-threshold');
  }
  setTimeout(()=>portal.classList.remove('opening'),1000)
 }
 $('#travelCurtainText').textContent='Entering '+String(detail?.label||'the next place').replace(/^.*?(?=[A-Za-z])/,'');
 st.classList.remove('camera-arrive');st.classList.add('camera-depart');
 clearTimeout(overlayTimer);overlayTimer=setTimeout(()=>o.classList.add('show'),310)
}
function arrive(detail){
 const st=stage(),o=ensure(),a=actor();if(!st||!o)return;
 st.classList.remove('camera-depart');st.classList.add('camera-arrive');
 const name=String(detail?.name||'').replace(/^[^A-Za-z]+/,'').trim();
 $('#travelCurtainText').textContent=name?'Arriving at '+name:'You arrive';
 o.classList.add('show');
 if(a){
  a.classList.remove('crossing-threshold');
  const x=parseFloat(a.style.left)||50,y=parseFloat(a.style.top)||78;
  let ex=0,ey=18,stepX=0,stepY=-10;
  if(x<22){ex=-34;ey=0;stepX=12;stepY=0}
  else if(x>78){ex=34;ey=0;stepX=-12;stepY=0}
  else if(y<45){ey=-30;stepY=12}
  else{ey=30;stepY=-12}
  a.style.setProperty('--enter-x',ex+'px');a.style.setProperty('--enter-y',ey+'px');
  a.style.setProperty('--settle-x',stepX+'px');a.style.setProperty('--settle-y',stepY+'px');
  a.classList.add('emerging-room');
  setTimeout(()=>{a.classList.remove('emerging-room');a.classList.add('settling-room');setTimeout(()=>a.classList.remove('settling-room'),520)},760)
 }
 clearTimeout(arriveTimer);arriveTimer=setTimeout(()=>{
  o.classList.remove('show');
  const entrance=[...st.querySelectorAll('.play-portal')].sort((p,q)=>{
    const pr=p.getBoundingClientRect(),qr=q.getBoundingClientRect(),ar=a?.getBoundingClientRect();
    if(!ar)return 0;
    const pc=Math.hypot(pr.left+pr.width/2-(ar.left+ar.width/2),pr.top+pr.height/2-(ar.top+ar.height/2));
    const qc=Math.hypot(qr.left+qr.width/2-(ar.left+ar.width/2),qr.top+qr.height/2-(ar.top+ar.height/2));
    return pc-qc
  })[0];
  if(entrance){entrance.classList.add('door-after-entry');setTimeout(()=>entrance.classList.remove('door-after-entry'),1300)}
  setTimeout(()=>st.classList.remove('camera-arrive'),700)
 },340)
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