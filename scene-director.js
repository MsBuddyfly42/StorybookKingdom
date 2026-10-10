/* Storybook Kingdom — visual scene director for distinct playable locations */
(()=>{'use strict';
const $=s=>document.querySelector(s);
const clean=s=>(s||'').replace(/^[^a-zA-Z]+/,'').trim();
const themes=[
 {re:/courtyard/i,key:'nature',props:['🏰','🌳','⛲','🌳','🏳️']},
 {re:/throne room|royal court chamber/i,key:'throne',props:['👑','⚜️','🪑','🏳️','🕯️']},
 {re:/library|archive|crooked bookmark/i,key:'library',props:['📚','📖','🪜','🕯️','🗺️']},
 {re:/kitchen|pantry|bakery|honey/i,key:'kitchen',props:['🔥','🥖','🥧','🍯','🫖']},
 {re:/ballroom/i,key:'ballroom',props:['✨','🕯️','🎻','🌹','🎭']},
 {re:/chapel|abbey/i,key:'chapel',props:['🪟','🕯️','🌸','📜','🔔']},
 {re:/nursery/i,key:'nursery',props:['🧸','🪁','📚','🛏️','⭐']},
 {re:/guest wing|guest chambers|scholar's room|loft|cottage|pavilion|home/i,key:'home',props:['🛏️','🫖','🪞','🌷','🕯️']},
 {re:/corridor|entrance hall|stair|gatehouse/i,key:'hall',props:['🕯️','🖼️','🗝️','🛡️','🚪']},
 {re:/tower/i,key:'tower',props:['🔭','⭐','🗺️','🕯️','🪟']},
 {re:/cellar|aqueduct|foundation|tunnel|cavern|passage/i,key:'underground',props:['🪨','🕯️','⛓️','💧','🗝️']},
 {re:/market|lane|row|schoolhouse|bathhouse|blacksmith|apothecary|dressmaking|shop|oddments|ribbon|bloom|tavern/i,key:'town',props:['🏮','🛍️','🌷','🧺','🪧']},
 {re:/harbor|pier|lighthouse|inn/i,key:'harbor',props:['⚓','⛵','🪝','🏮','🐚']},
 {re:/garden|arbor|maze|orchard|whisperwood|bridge|stables/i,key:'nature',props:['🌳','🌹','🌿','🦋','🪻']},
 {re:/academy/i,key:'academy',props:['📚','🎓','🗺️','✒️','🧭']},
 {re:/festival|tournament/i,key:'festival',props:['🎪','🎠','🎯','🎺','🏳️']},
 {re:/village|barleycross|red orchard|pinehollow|reedbank|cloudmeadow|hamlet/i,key:'village',props:['🏡','🌾','🧺','🐓','🌻']},
 {re:/azuremere|everfrost|goldmeadow|nocturne|briarwood|solara/i,key:'realm',props:['🏰','✨','🗺️','🌙','🏳️']}
];
function resolve(name,zone){
 const t=themes.find(x=>x.re.test(name));if(t)return t;
 const fallback={castle:'hall',shop:'town',home:'home',underground:'underground',harbor:'harbor',nature:'nature',academy:'academy',festival:'festival',village:'village',realm:'realm',town:'town'};
 return {key:fallback[zone]||'exterior',props:['🏮','🌿','✨','🪧','🌼']}
}
function placeProps(props){
 const st=$('#worldStage');if(!st)return;
 let d=$('#sceneDirector');if(!d){d=document.createElement('div');d.id='sceneDirector';d.className='scene-director';st.appendChild(d)}
 d.replaceChildren();
 const pts=[[12,33],[28,64],[50,39],[72,64],[88,34]];
 props.forEach((p,i)=>{const s=document.createElement('span');s.textContent=p;s.style.left=pts[i][0]+'%';s.style.top=pts[i][1]+'%';s.style.animationDelay=(-i*.47)+'s';d.appendChild(s)})
}
function apply(){
 const r=$('#livingWorld'),title=$('#worldTitle');if(!r||!title)return;
 const name=clean(title.textContent),zone=r.dataset.zone||'';
 if(!name)return;
 const t=resolve(name,zone);r.dataset.scene=t.key;placeProps(t.props);
 const label=$('#worldSceneLabel');if(label)label.dataset.scene=t.key
}
function mount(){
 const r=$('#livingWorld'),title=$('#worldTitle');if(!r||!title)return false;
 document.addEventListener('storybook:location',apply);
 new MutationObserver(apply).observe(title,{childList:true,characterData:true,subtree:true});
 apply();return true
}
function wait(){if(mount())return;const mo=new MutationObserver(()=>{if(mount())mo.disconnect()});mo.observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait);else wait();
})();
