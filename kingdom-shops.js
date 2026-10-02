/* Storybook Kingdom — shops, purchases and equipable keepsakes */
(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const KEY='storybook_kingdom_shops_v1',COINS='storybook_world_activities_v1';
const load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}};
const state={owned:[],equipped:null,...load()};
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(state))}catch{}};
const catalog=[
 {id:'rose-pin',name:'Rose Pin',icon:'🌹',price:5,places:/clothier|market|bloom|dressmaking/i},
 {id:'gold-crown',name:'Little Gold Crown',icon:'👑',price:12,places:/market|oddments|castle|dressmaking/i},
 {id:'moon-charm',name:'Moon Charm',icon:'🌙',price:8,places:/oddments|bookmark|nocturne|market/i},
 {id:'lantern-charm',name:'Lantern Charm',icon:'🏮',price:7,places:/market|row|oddments|harbor/i},
 {id:'blue-ribbon',name:'Blue Ribbon',icon:'🎀',price:6,places:/ribbon|clothier|dressmaking|market/i},
 {id:'tiny-book',name:'Pocket Storybook',icon:'📕',price:6,places:/bookmark|academy|schoolhouse|market/i},
 {id:'flower-crown',name:'Flower Crown',icon:'🌸',price:9,places:/bloom|garden|market|festival/i},
 {id:'silver-bell',name:'Silver Bell',icon:'🔔',price:10,places:/abbey|oddments|market/i},
 {id:'sea-shell',name:'Moonharbor Shell',icon:'🐚',price:5,places:/harbor|pier|inn|market/i},
 {id:'star-brooch',name:'Star Brooch',icon:'⭐',price:11,places:/oddments|tower|market/i},
 {id:'royal-cloak',name:'Royal Cloak Pin',icon:'🧥',price:14,places:/clothier|dressmaking|castle/i},
 {id:'honey-jar',name:'Honey Jar',icon:'🍯',price:4,places:/honey|bakery|market/i}
];
function clean(s){return (s||'').replace(/^[^A-Za-z]+/,'').trim()}
function place(){return clean($('#worldTitle')?.textContent)}
function readCoins(){try{return JSON.parse(localStorage.getItem(COINS)||'{}')}catch{return {}}}
function coins(){return Number(readCoins().coins||0)}
function spend(n){
 const c=readCoins();if(Number(c.coins||0)<n)return false;c.coins=Number(c.coins||0)-n;localStorage.setItem(COINS,JSON.stringify(c));return true
}
function options(){
 const p=place();let items=catalog.filter(i=>i.places.test(p));
 if(!items.length&&/shop|market|town|row|lane|tavern/i.test(p))items=catalog.slice(0,6);
 return items
}
function eligible(){return options().length>0}
function station(){
 const st=$('#worldStage');if(!st)return;$('#shopStation')?.remove();
 if(!eligible())return;
 const b=document.createElement('button');b.id='shopStation';b.type='button';b.className='world-hotspot shop-station';b.style.left='15%';b.style.top='45%';
 b.innerHTML='<span>🛍️</span><small>Browse Shop</small>';b.addEventListener('click',e=>{if(e.detail===0)openShop()});st.appendChild(b)
}
function openShop(){
 let o=$('#shopOverlay');if(!o){o=document.createElement('div');o.id='shopOverlay';o.className='shop-overlay';o.hidden=true;document.body.appendChild(o)}
 o.hidden=false;renderShop()
}
function close(){const o=$('#shopOverlay');if(o)o.hidden=true}
function renderShop(){
 const o=$('#shopOverlay'),items=options();if(!o)return;
 o.innerHTML='<section class="shop-card"><div class="shop-head"><div><small>LOCAL SHOP</small><h2>🛍️ '+escapeHTML(place())+'</h2></div><div class="shop-wallet">🪙 '+coins()+'</div><button id="shopClose" type="button" aria-label="Close">✕</button></div><p>Spend coins earned from activities. Purchases stay in your collection.</p><div class="shop-grid">'+items.map(i=>itemCard(i)).join('')+'</div></section>';
 $('#shopClose').addEventListener('click',close);o.addEventListener('click',e=>{if(e.target===o)close()});
 $$('.shop-buy').forEach(b=>b.addEventListener('click',()=>buy(b.dataset.id)));
 $$('.shop-equip').forEach(b=>b.addEventListener('click',()=>equip(b.dataset.id)))
}
function itemCard(i){
 const own=state.owned.includes(i.id),eq=state.equipped===i.id,can=coins()>=i.price;
 return '<article class="shop-item '+(own?'owned ':'')+(eq?'equipped':'')+'"><span class="shop-icon">'+i.icon+'</span><div><strong>'+escapeHTML(i.name)+'</strong><small>'+(own?(eq?'Equipped':'Owned'):'🪙 '+i.price)+'</small></div>'+(own?'<button class="shop-equip" data-id="'+i.id+'" type="button">'+(eq?'✓ Equipped':'Equip')+'</button>':'<button class="shop-buy" data-id="'+i.id+'" type="button" '+(can?'':'disabled')+'>Buy</button>')+'</article>'
}
function buy(id){
 const item=catalog.find(x=>x.id===id);if(!item||state.owned.includes(id))return;
 if(!spend(item.price)){notify('You need more kingdom coins.');return}
 state.owned.push(id);state.equipped=id;save();applyEquipped();notify('✨ Purchased '+item.name);renderShop();document.dispatchEvent(new CustomEvent('storybook:purchase',{detail:{id,name:item.name}}))
}
function equip(id){
 if(!state.owned.includes(id))return;state.equipped=state.equipped===id?null:id;save();applyEquipped();renderShop();renderInventory()
}
function applyEquipped(){
 const actor=$('#worldActor');if(!actor)return;
 let e=actor.querySelector('.equipped-keep');if(!e){e=document.createElement('span');e.className='equipped-keep';actor.appendChild(e)}
 const item=catalog.find(x=>x.id===state.equipped);e.textContent=item?.icon||'';e.title=item?.name||''
}
function notify(t){
 let n=$('#shopToast');if(!n){n=document.createElement('div');n.id='shopToast';n.className='shop-toast';document.body.appendChild(n)}
 n.textContent=t;n.classList.add('show');clearTimeout(n.t);n.t=setTimeout(()=>n.classList.remove('show'),1800)
}
function renderInventory(){
 const body=$('#shellInventoryBody');if(!body)return;
 let box=$('#shopCollection');if(!box){box=document.createElement('section');box.id='shopCollection';box.className='shop-collection';box.innerHTML='<h3>Purchased Keepsakes</h3><div></div>';body.appendChild(box)}
 const list=box.querySelector('div');const owned=state.owned.map(id=>catalog.find(x=>x.id===id)).filter(Boolean);
 list.innerHTML=owned.length?owned.map(i=>'<button type="button" data-owned="'+i.id+'" class="'+(state.equipped===i.id?'equipped':'')+'">'+i.icon+' '+escapeHTML(i.name)+'</button>').join(''):'<p>No purchased keepsakes yet.</p>';
 $$('[data-owned]',list).forEach(b=>b.addEventListener('click',()=>{equip(b.dataset.owned);renderInventory()}))
}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function mount(){
 const root=$('#livingWorld');if(!root)return false;
 document.addEventListener('storybook:location',()=>setTimeout(()=>{station();applyEquipped()},120));
 document.addEventListener('storybook:activity-win',()=>{if(!$('#shopOverlay')?.hidden)renderShop()});
 new MutationObserver(()=>{station();applyEquipped();if($('#shellInventoryBody'))renderInventory()}).observe(root,{subtree:true,childList:true});
 applyEquipped();station();return true
}
function wait(){if(mount())return;const mo=new MutationObserver(()=>{if(mount())mo.disconnect()});mo.observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait);else wait();
})();