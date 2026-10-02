/* Storybook Kingdom — furniture, lighting and depth realism */
(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s);
const layouts={
 throne:[['🪑',50,60,'large'],['🏳️',18,28,'wall'],['🏳️',82,28,'wall'],['🕯️',31,47,'mid'],['🕯️',69,47,'mid']],
 library:[['📚',14,45,'tall'],['📚',86,45,'tall'],['🪜',27,52,'tall'],['🪵',50,64,'table'],['📖',50,54,'small']],
 kitchen:[['🔥',15,52,'large'],['🥘',28,58,'mid'],['🪵',52,66,'table'],['🥖',50,57,'small'],['🫙',81,51,'mid']],
 ballroom:[['✨',50,20,'ceiling'],['🪞',15,42,'tall'],['🪞',85,42,'tall'],['🌹',28,61,'small'],['🎻',72,61,'small']],
 chapel:[['🪟',50,31,'large'],['🕯️',28,58,'mid'],['🕯️',72,58,'mid'],['🌸',50,61,'small']],
 nursery:[['🛏️',72,62,'large'],['🧸',31,64,'mid'],['📚',19,45,'tall'],['⭐',51,32,'wall']],
 home:[['🛏️',74,63,'large'],['🪑',28,64,'mid'],['🪵',50,65,'table'],['🫖',50,56,'small'],['🪟',22,33,'wall']],
 hall:[['🛡️',17,49,'tall'],['🛡️',83,49,'tall'],['🖼️',50,31,'wall'],['🏺',31,61,'mid'],['🏺',69,61,'mid']],
 tower:[['🔭',53,52,'large'],['🗺️',27,61,'mid'],['🪟',50,29,'wall'],['🕯️',76,59,'small']],
 academy:[['📚',17,49,'tall'],['🪵',50,65,'table'],['🗺️',50,31,'wall'],['✒️',47,57,'small'],['🎓',75,60,'mid']],
 underground:[['🕯️',16,48,'mid'],['🕯️',84,48,'mid'],['🪨',28,67,'large'],['⛓️',67,39,'tall'],['💧',52,66,'small']],
 town:[['🪧',50,26,'wall'],['🧺',25,67,'mid'],['🪵',74,67,'table'],['🏮',12,45,'mid'],['🏮',88,45,'mid']],
 harbor:[['⚓',21,68,'large'],['📦',35,66,'mid'],['🪢',68,64,'mid'],['🏮',84,49,'mid'],['⛵',62,38,'large']],
 nature:[['🌳',13,53,'tall'],['🌳',87,53,'tall'],['🪨',34,70,'mid'],['🌿',66,70,'mid'],['🦋',51,41,'small']],
 festival:[['🎪',49,39,'large'],['🎯',27,62,'mid'],['🎺',73,60,'mid'],['🏳️',15,31,'wall'],['🏳️',85,31,'wall']],
 village:[['🏡',20,47,'large'],['🏡',80,47,'large'],['🧺',38,69,'mid'],['🌻',62,68,'mid']],
 realm:[['🏰',50,40,'large'],['🏳️',17,33,'wall'],['🏳️',83,33,'wall'],['🗺️',31,65,'mid'],['✨',69,58,'small']]
};
function root(){return $('#livingWorld')}function stage(){return $('#worldStage')}function scene(){return root()?.dataset.scene||root()?.dataset.zone||'town'}
function render(){
 const st=stage();if(!st)return;
 let layer=$('#realismFurniture',st);if(!layer){layer=document.createElement('div');layer.id='realismFurniture';layer.className='realism-furniture';st.appendChild(layer)}
 layer.replaceChildren();const items=layouts[scene()]||layouts.town;
 items.forEach(([icon,x,y,cls],i)=>{const e=document.createElement('span');e.textContent=icon;e.className='furniture '+cls;e.style.left=x+'%';e.style.top=y+'%';e.style.setProperty('--z',String(6+Math.round(y/10)));layer.appendChild(e)});
 lighting()
}
function lighting(){
 const st=stage();if(!st)return;
 let light=$('#realismLight',st);if(!light){light=document.createElement('div');light.id='realismLight';light.className='realism-light';st.appendChild(light)}
 const time=root()?.dataset.time||'afternoon',sc=scene();
 light.className='realism-light time-'+time+' scene-'+sc
}
function mount(){
 if(!root()||!stage())return false;
 document.addEventListener('storybook:location',()=>setTimeout(render,100));
 new MutationObserver(render).observe(root(),{attributes:true,attributeFilter:['data-scene','data-zone','data-time']});
 render();return true
}
function wait(){if(mount())return;const mo=new MutationObserver(()=>{if(mount())mo.disconnect()});mo.observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait);else wait();
})();