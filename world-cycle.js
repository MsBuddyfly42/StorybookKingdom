/* Storybook Kingdom — optional automatic time and weather cycle */
(()=>{'use strict';
const $=s=>document.querySelector(s);
const KEY='storybook_world_cycle_v1';
const load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}};
const state={autoTime:true,autoWeather:true,...load()};
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(state))}catch{}};
const times=['morning','afternoon','evening','night'];
const weather=['sunshine','sunshine','mist','rain','sunshine','snow'];
let timeTimer=0,weatherTimer=0;
function root(){return $('#livingWorld')}
function setSelect(id,value){
 const el=$(id);if(!el||el.value===value)return;
 el.value=value;el.dispatchEvent(new Event('change',{bubbles:true}))
}
function nextTime(){
 if(!state.autoTime||root()?.hidden)return;
 const current=$('#worldClock')?.value||'afternoon',i=times.indexOf(current);
 setSelect('#worldClock',times[(Math.max(0,i)+1)%times.length])
}
function nextWeather(){
 if(!state.autoWeather||root()?.hidden)return;
 const zone=root()?.dataset.zone||'town';
 let pool=weather;
 if(zone==='underground')pool=['mist','mist','sunshine'];
 if(zone==='harbor')pool=['sunshine','mist','rain','sunshine'];
 if(zone==='realm'&&/Everfrost/i.test($('#worldTitle')?.textContent||''))pool=['snow','snow','mist'];
 let next=pool[Math.floor(Math.random()*pool.length)];
 setSelect('#worldWeather',next)
}
function render(){
 const t=$('#cycleTimeToggle'),w=$('#cycleWeatherToggle');
 if(t)t.textContent=state.autoTime?'⏳ Auto time: On':'⏸ Auto time: Off';
 if(w)w.textContent=state.autoWeather?'🌦 Auto weather: On':'🌤 Auto weather: Off'
}
function mountControls(){
 const panel=$('#shellPause .shell-controls-card');if(!panel||$('#worldCycleControls'))return false;
 const box=document.createElement('div');box.id='worldCycleControls';box.className='world-cycle-controls';
 box.innerHTML='<h3>Living World</h3><p>The kingdom can change time and weather while you explore. Turn either one off whenever you want complete control.</p><div><button id="cycleTimeToggle" type="button"></button><button id="cycleWeatherToggle" type="button"></button></div>';
 panel.insertAdjacentElement('afterend',box);
 $('#cycleTimeToggle').addEventListener('click',()=>{state.autoTime=!state.autoTime;save();render()});
 $('#cycleWeatherToggle').addEventListener('click',()=>{state.autoWeather=!state.autoWeather;save();render()});
 render();return true
}
function mount(){
 if(!root())return false;
 const mo=new MutationObserver(mountControls);mo.observe(document.body,{subtree:true,childList:true});mountControls();
 clearInterval(timeTimer);timeTimer=setInterval(nextTime,180000);
 clearInterval(weatherTimer);weatherTimer=setInterval(nextWeather,240000);
 document.addEventListener('storybook:location',()=>{if(state.autoWeather&&Math.random()<.14)setTimeout(nextWeather,1300)});
 return true
}
function wait(){if(mount())return;const mo=new MutationObserver(()=>{if(mount())mo.disconnect()});mo.observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait);else wait();
})();