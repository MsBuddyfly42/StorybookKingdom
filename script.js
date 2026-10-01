const views = [...document.querySelectorAll(".view")];
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];

const state = {
  character: JSON.parse(localStorage.getItem("sk_character") || "null"),
  journal: JSON.parse(localStorage.getItem("sk_journal") || "[]"),
  clues: JSON.parse(localStorage.getItem("sk_clues") || "[]"),
  activeQuest: localStorage.getItem("sk_quest") || "",
  ribbons: Number(localStorage.getItem("sk_ribbons") || 0),
  coins: Number(localStorage.getItem("sk_coins") || 35),
  inventory: JSON.parse(localStorage.getItem("sk_inventory") || '["Festival Ribbon","Small Brass Key"]'),
  outfit: localStorage.getItem("sk_outfit") || "Traveling Cloak",
  home: localStorage.getItem("sk_home") || "Lantern Row Cottage",
  friendships: JSON.parse(localStorage.getItem("sk_friendships") || '{}'),
  occupation: localStorage.getItem("sk_occupation") || "",
  dayPhase: localStorage.getItem("sk_dayphase") || "Evening",
  lettersRead: JSON.parse(localStorage.getItem("sk_letters_read") || '[]'),
  realmVisits: JSON.parse(localStorage.getItem("sk_realm_visits") || '{}'),
  bonds: JSON.parse(localStorage.getItem("sk_bonds") || '{}'),
  furnishings: JSON.parse(localStorage.getItem("sk_furnishings") || '["Hearth Rug","Oak Table"]'),
  grandEventBadges: JSON.parse(localStorage.getItem("sk_event_badges") || '[]'),
  chainProgress: JSON.parse(localStorage.getItem("sk_chain_progress") || '{}'),
  weather: localStorage.getItem("sk_weather") || "Clear Evening",
  reputation: JSON.parse(localStorage.getItem("sk_reputation") || '{"Kindness":2,"Mystery":1,"Scholarship":1,"Courage":1,"Festive Spirit":1}'),
  kingdomDay: Number(localStorage.getItem("sk_kingdom_day") || 1),
  householdMemories: JSON.parse(localStorage.getItem("sk_household_memories") || '[]'),
  caseProgress: JSON.parse(localStorage.getItem("sk_case_progress") || '{}'),
  storybookCollection: JSON.parse(localStorage.getItem("sk_storybook_collection") || '["The Lantern Bridge Legend","Roseglass Castle Guide","Hearth & Honey Recipe Book"]'),
  unlockedTitles: JSON.parse(localStorage.getItem("sk_titles") || '[]'),
  keepsakes: JSON.parse(localStorage.getItem("sk_keepsakes") || '["Pressed Rose Petal","Festival Ribbon"]'),
  dailyEventHistory: JSON.parse(localStorage.getItem("sk_daily_event_history") || '[]'),
  memoryQuests: JSON.parse(localStorage.getItem("sk_memory_quests") || '{}'),
  underwayVisits: JSON.parse(localStorage.getItem("sk_underway_visits") || '{}'),
  villageVisits: JSON.parse(localStorage.getItem("sk_village_visits") || '{}'),
  academyLessons: JSON.parse(localStorage.getItem("sk_academy_lessons") || '[]'),
  castleShifts: JSON.parse(localStorage.getItem("sk_castle_shifts") || '{}'),
  seasonArcs: JSON.parse(localStorage.getItem("sk_season_arcs") || '{}'),
  pastimeHistory: JSON.parse(localStorage.getItem("sk_pastime_history") || '[]'),
  currentLifePath: localStorage.getItem("sk_life_path") || "Village Resident",
  favoriteHorse: localStorage.getItem("sk_favorite_horse") || "",
  horseBonds: JSON.parse(localStorage.getItem("sk_horse_bonds") || '{}'),
  feastHistory: JSON.parse(localStorage.getItem("sk_feast_history") || '[]'),
  performanceHistory: JSON.parse(localStorage.getItem("sk_performance_history") || '[]'),
  taleHistory: JSON.parse(localStorage.getItem("sk_tale_history") || '[]'),
  pauperSagaStep: Number(localStorage.getItem("sk_pauper_saga_step") || 0),
  pauperSagaChoices: JSON.parse(localStorage.getItem("sk_pauper_saga_choices") || '[]')
};

const happenings = [
  "The baker on Clover Lane is testing a cinnamon-honey tart.",
  "A silver fox was seen near the old north gate just before sunrise.",
  "The palace musicians are rehearsing for tonight’s lantern dance.",
  "Three children claim a tiny door appeared in the fountain wall.",
  "A traveling puppet theatre has set up beside Market Square.",
  "The queen’s roses bloomed one month early—and no gardener knows why."
];

const places = [
  {icon:"🏰", name:"Roseglass Castle", mood:"Royal halls & hidden stairways", text:"Walk the gallery, kitchens, throne hall, library, towers, servants’ passages, ballroom, chapel, and moonlit battlements.", actions:["Visit the Great Hall","Explore the Kitchens","Look for a Secret Stair","Climb the West Tower"]},
  {icon:"🏘️", name:"Lantern Row", mood:"Cottages & neighbors", text:"Laundry flutters above cobbled lanes. Neighbors trade news, children chase hoops, and someone is always baking something.", actions:["Visit a Cottage","Hear Village Gossip","Help at the Well","Follow the Cat"]},
  {icon:"🧺", name:"Market Square", mood:"Shops, stalls & town life", text:"Fruit sellers, ribbon merchants, booksellers, toy makers, florists, fortune tellers, and wandering performers fill the square.", actions:["Browse the Stalls","Watch a Performer","Visit the Book Cart","Try a Festival Snack"]},
  {icon:"🌲", name:"Whisperwood", mood:"Enchanted forest", text:"Mossy paths curl between ancient trees. The forest is beautiful, mysterious, and never quite maps the same way twice.", actions:["Follow the Blue Lights","Visit the Woodland Shrine","Cross the Moss Bridge","Listen for Singing"]},
  {icon:"🌷", name:"Queen’s Gardens", mood:"Quiet paths & fountains", text:"Rose arches, hedge mazes, lily ponds, stone benches, peacocks, and secluded reading nooks surround the palace walls.", actions:["Enter the Hedge Maze","Sit by the Lily Pond","Feed the Peacocks","Read Under the Arbor"]},
  {icon:"⚓", name:"Moonharbor", mood:"Ships & distant lands", text:"Lantern-lit ships arrive from faraway kingdoms carrying sailors, spices, letters, musicians, and rumors.", actions:["Walk the Pier","Talk to a Sailor","Visit the Harbor Inn","Read the Arrival Board"]},
  {icon:"⛪", name:"Bellflower Abbey", mood:"Old books & old secrets", text:"A peaceful stone abbey keeps records older than the castle itself. Its bells can be heard across the valley.", actions:["Search the Archives","Walk the Cloister","Speak to the Archivist","Read an Old Chronicle"]},
  {icon:"🍞", name:"Hearth & Honey Bakery", mood:"Warm bread & stories", text:"A tiny bakery with steamed windows, sweet rolls, pies, tea, gossip, and a table that always seems to have one open chair.", actions:["Order Something Warm","Talk to the Baker","Decorate a Tart","Sit by the Window"]},
  {icon:"🎪", name:"Festival Green", mood:"Games & celebration", text:"Banners snap in the breeze while jugglers, musicians, game booths, dancing circles, and picnic tables fill the lawn.", actions:["Play a Game","Join the Dance","Watch the Juggler","Collect a Ribbon"]}
];

const roles = [
  ["👸","Princess / Prince","Royal life, court events, secret corridors, public duties, friendships and adventures."],
  ["👑","Queen / King","Hold audiences, plan festivals, hear petitions, settle disputes, and uncover palace secrets."],
  ["🧺","Village Resident","Live in town, work a trade, attend festivals, know the neighbors, and hear every rumor first."],
  ["⚔️","Knight / Guard","Patrol the gates, escort travelers, investigate disturbances, and take royal missions."],
  ["📚","Royal Scholar","Study maps, old legends, family histories, riddles, enchanted objects, and forbidden rooms."],
  ["🧁","Baker / Shopkeeper","Run a cozy business in town, serve familiar faces, overhear gossip, and prepare for celebrations."],
  ["🌿","Healer / Herbalist","Gather plants, help villagers, visit woodland cottages, and discover old remedies and folklore."],
  ["🎭","Traveling Performer","Arrive with stories, songs, costumes, rumors, and connections to distant kingdoms."],
  ["🗝️","Mysterious Traveler","You arrived at the gate with one locked trunk, one unusual letter, and a reason you have not revealed."]
];

const stories = [
  {
    id:"clocktower",
    icon:"🕰️",
    title:"The Clock That Rang Thirteen",
    blurb:"At midnight, the castle clock strikes thirteen—and a sealed room opens for the first time in a hundred years.",
    start:"ct1",
    nodes:{
      ct1:{text:"The thirteenth bell rolls over the sleeping kingdom. In the corridor outside your room, an old door slowly opens by itself. Golden light spills across the floor.", choices:[["Enter the room","ct2"],["Wake someone first","ct3"],["Follow the tiny footprints leaving the doorway","ct4"]]},
      ct2:{text:"Inside is a miniature model of the entire kingdom. One tiny window in the model is glowing: the abandoned tower above Lantern Row.", choices:[["Touch the glowing tower","ct5"],["Search the desk","ct6"]]},
      ct3:{text:"You wake Mara, a palace maid who knows every rumor in the castle. She goes pale. 'That room belonged to the king's clockmaker,' she whispers.", choices:[["Go together","ct2"],["Ask what happened to the clockmaker","ct7"]]},
      ct4:{text:"The footprints are no larger than your thumb. They lead down three flights of stairs, under a tapestry, and into a wall that should be solid.", choices:[["Press the wall","ct8"],["Mark the spot and return to the door","ct2"]]},
      ct5:{text:"The model hums. A tiny paper bird rises from the tower and unfolds into a note: 'Before dawn, restore the missing hour.'", choices:[["Go to Lantern Row","ct9"],["Find the royal scholar","ct10"]]},
      ct6:{text:"The desk contains thirteen drawers. Twelve are empty. The last holds a silver key engraved with a sun on one side and a moon on the other.", choices:[["Take the key","ct9"],["Leave it and search the room again","ct5"]]},
      ct7:{text:"Mara says the clockmaker vanished the night he refused to remove an hour from the kingdom's history. No one understood what he meant.", choices:[["Investigate the room","ct2"],["Search the old records","ct10"]]},
      ct8:{text:"The wall opens just enough to reveal a narrow stair spiraling downward. From below comes the ticking of hundreds of clocks.", choices:[["Go down","ct11"],["Return for a lantern","ct3"]]},
      ct9:{text:"At the abandoned tower, the silver key fits a door hidden behind ivy. Inside, hundreds of clocks are stopped at the same minute.", choices:[["Wind the largest clock","ct12"],["Look for the missing hour","ct11"]]},
      ct10:{text:"The scholar finds a erased page in the royal chronicle. A festival, a promise, and an entire hour were deliberately removed from the record.", choices:[["Restore the page publicly","ct13"],["Find the clockmaker's tower first","ct9"]]},
      ct11:{text:"Below the kingdom lies the clockmaker's workshop. A final clock ticks backward. Beside it is a plaque: 'What is forgotten still happened.'", choices:[["Turn the clock forward","ct13"],["Let it keep ticking backward","ct14"]]},
      ct12:{text:"The great clock begins to move. One by one, the others awaken. Outside, forgotten music drifts into the street as villagers remember a festival erased from memory.", choices:[["Continue","ct13"]]},
      ct13:{text:"At sunrise, the thirteenth bell rings once more—not as a warning, but as a remembrance. The lost hour returns to the kingdom's history, and the sealed room becomes a public archive.", choices:[["Play again","ct1"],["Return to the story shelf","shelf"]], end:true},
      ct14:{text:"You leave the backward clock untouched. The room closes at dawn, but now you alone remember what the kingdom forgot. Some mysteries, perhaps, wait for the right day to be opened.", choices:[["Play again","ct1"],["Return to the story shelf","shelf"]], end:true}
    }
  },
  {
    id:"rose",
    icon:"🌹",
    title:"The Rose at the Winter Window",
    blurb:"A single red rose blooms during the coldest winter in memory, pointing toward a promise the royal family forgot.",
    start:"r1",
    nodes:{
      r1:{text:"Snow has covered the kingdom for six weeks. Yet every morning, one red rose appears outside the same castle window.", choices:[["Pick the rose","r2"],["Watch the window before sunrise","r3"]]},
      r2:{text:"The moment you touch it, the petals turn into tiny scraps of handwriting. They spell: 'Find Elian at the frozen fountain.'", choices:[["Go to the fountain","r4"],["Take the petals to the queen","r5"]]},
      r3:{text:"Just before dawn, an elderly woman in a blue cloak enters the garden without leaving footprints. She places the rose and whispers, 'A promise still lives.'", choices:[["Follow her","r4"],["Call out to her","r6"]]},
      r4:{text:"At the frozen fountain you find a stone plaque buried under snow. It describes a royal promise to keep the village orchard public forever.", choices:[["Show the villagers","r7"],["Search the archives first","r8"]]},
      r5:{text:"The queen recognizes the handwriting as her grandmother's. She asks you to investigate quietly before court opens.", choices:[["Search the archives","r8"],["Go to the fountain","r4"]]},
      r6:{text:"The woman turns and smiles. 'Names change. Promises should not.' Then she disappears behind the hedge.", choices:[["Search the fountain","r4"],["Tell the queen","r5"]]},
      r7:{text:"Older villagers remember the orchard before palace officials fenced it. Together, you bring the forgotten promise to court.", choices:[["Continue","r9"]]},
      r8:{text:"The archive contains the original charter. The orchard was indeed promised to the whole town, but a later clerk quietly removed the clause.", choices:[["Bring the charter to court","r9"]]},
      r9:{text:"The gates to the orchard reopen. By afternoon, children are sledding between the trees. At the winter window, the last red rose finally closes its petals.", choices:[["Play again","r1"],["Return to the story shelf","shelf"]], end:true}
    }
  },
  {
    id:"mask",
    icon:"🎭",
    title:"The Guest in the Silver Mask",
    blurb:"At the midsummer ball, an unknown guest knows a secret about the castle that no outsider should know.",
    start:"m1",
    nodes:{
      m1:{text:"The ballroom glitters with a thousand candles. Then a guest in a silver mask steps onto the floor and hands you a card: 'Meet me where the castle cannot hear us.'", choices:[["Go to the balcony","m2"],["Ask the guard to follow quietly","m3"],["Ignore the note and watch the guest","m4"]]},
      m2:{text:"The masked guest says a hidden room beneath the ballroom will be opened tonight by someone who believes it holds royal treasure.", choices:[["Ask who they are","m5"],["Go find the hidden room","m6"]]},
      m3:{text:"The guard recognizes the guest's walk—but will only say, 'I thought that person left the kingdom years ago.'", choices:[["Follow the guest","m2"],["Question the guard","m5"]]},
      m4:{text:"You notice the guest never looks at the dancers. They watch the old crest above the musicians' gallery.", choices:[["Inspect the crest","m6"],["Confront the guest","m5"]]},
      m5:{text:"The stranger removes the mask. It is Rowan, former apprentice to the royal architect, who returned after receiving a threatening letter.", choices:[["Trust Rowan","m6"],["Take Rowan to the queen","m7"]]},
      m6:{text:"Behind the crest is a lever. It opens a narrow stair to a sealed chamber—not treasure, but plans proving the castle once belonged partly to the town guilds.", choices:[["Take the plans to court","m7"],["Hide the plans until morning","m8"]]},
      m7:{text:"The queen pauses the ball and hears Rowan's evidence. By dawn, a council is called to restore the town guilds' forgotten rights.", choices:[["Play again","m1"],["Return to the story shelf","shelf"]], end:true},
      m8:{text:"You keep the plans safe until morning. The ball ends peacefully, but a much larger story is waiting for the next court session.", choices:[["Play again","m1"],["Return to the story shelf","shelf"]], end:true}
    }
  }
];

const clues = [
  {id:"mud", icon:"👣", name:"Mud on the Balcony", text:"A thin streak of pale river mud appears beneath the gallery balcony door. Palace gardeners use dark soil—not this."},
  {id:"thread", icon:"🧵", name:"Silver Thread", text:"A single silver-blue thread is caught on the display case. It matches ceremonial page uniforms, but also harbor festival banners."},
  {id:"key", icon:"🗝️", name:"The Spare Key", text:"The spare gallery key is still sealed in the guard office. The display case itself shows no sign of being forced."},
  {id:"wax", icon:"🕯️", name:"Blue Candle Wax", text:"A drop of blue wax lies behind a curtain. The gallery candles are ivory. Blue candles are used in Bellflower Abbey."},
  {id:"note", icon:"✉️", name:"Half-Burned Note", text:"A scorched note reads: '...before the procession. Do not let the old mistake happen again. —E'"},
  {id:"dust", icon:"🧱", name:"Stone Dust", text:"Fresh dust under a wall panel reveals a forgotten service passage connecting the gallery to an old archive stair."}
];

const suspects = {
  "The Royal Page":"The page had access to nearby halls, but the evidence does not explain the river mud or the archive passage.",
  "The Harbor Captain":"The river mud fits, but the captain had no reason to know about the hidden archive stair.",
  "Archivist Elian":"Correct. Elian used the forgotten service passage. The blue wax came from the abbey archives, and the note referred to an old mistake: the crown was scheduled for a procession during a storm anniversary that once caused a tragedy. Elian hid it to force the court to cancel the display—not to steal it.",
  "Lady Mirelle":"She wore silver-blue at supper, but the thread alone is not enough to connect her to the locked gallery."
};

const quests = [
  {icon:"🧁", title:"The Baker’s Missing Recipe", level:"Easy", time:"10–15 min", text:"A recipe card vanished just before the harvest contest. Search the bakery, ask three townspeople, and reconstruct the missing ingredient."},
  {icon:"🦢", title:"The Swan on Mirror Lake", level:"Gentle", time:"15–20 min", text:"A white swan keeps bringing ribbons to the same bench every evening. Find out where the ribbons come from and why."},
  {icon:"🗺️", title:"The Map Beneath the Inn", level:"Medium", time:"20–30 min", text:"Renovations reveal a painted map under the floorboards of the Harbor Inn. Four landmarks no longer exist—or so everyone thought."},
  {icon:"🔔", title:"The Bell That Won’t Ring", level:"Medium", time:"15–25 min", text:"The abbey bell falls silent before the Founders’ Festival. Climb the tower, inspect the mechanism, and follow an unexpected clue."},
  {icon:"🐉", title:"Smoke Beyond the Orchard", level:"Adventure", time:"25–35 min", text:"Villagers report smoke, strange tracks, and missing baskets beyond the eastern orchard. The explanation may not be what they fear."},
  {icon:"👑", title:"The Queen’s Seven Invitations", level:"Royal", time:"20–30 min", text:"Seven invitations were sent for a secret supper, but eight guests arrived. Discover who was never invited—and why they came."}
];

const cozyMoments = [
  ["Lantern Bridge","🏮 🌙 🏰 ✨","The river carries gold reflections beneath the old stone bridge. Somewhere in town a violin is playing softly."],
  ["Bakery Window","🍞 ☕ 🕯️ ❄️","You have the corner table. Rain taps the glass while fresh bread cools behind the counter. Nobody needs anything from you."],
  ["Queen’s Garden Arbor","🌹 📖 🦋 🌿","The garden is almost silent except for leaves and distant fountain water. A book waits beside a cushioned bench."],
  ["Moonharbor Pier","⚓ 🌌 🛶 🕯️","The ships are tied for the night. Lanterns sway on the water, and the harbor smells faintly of cedar and sea salt."],
  ["Cottage Hearth","🔥 🫖 🧶 🪟","A small fire crackles. There is tea, a soft chair, and a blanket. Outside, the village settles into evening."],
  ["Castle Library","📚 🕯️ 🪶 🌙","Tall shelves disappear into shadow. A lamp glows over an open atlas, and the castle is quiet enough to hear the clock breathe."]
];

const courtPetitions = [
  {
    people:"👑 🧑‍🌾 🧺 📜",
    title:"The Orchard Path",
    text:"A farmer asks permission to close an old public footpath that cuts through his orchard. Villagers say the path has connected two neighborhoods for generations.",
    choices:[
      ["Keep the path public","The court orders the path to remain open but funds a low fence to protect the farmer’s crops."],
      ["Close the path","The path is closed, and the court commissions a new public lane around the orchard."],
      ["Ask both sides to design a compromise","The farmer and villagers agree to seasonal hours and a fenced walkway. The court records the arrangement."]
    ]
  },
  {
    people:"👑 🧵 🎭 🪙",
    title:"The Festival Booth Dispute",
    text:"Two craft families both claim the same prime booth on Festival Green. Each has an old receipt suggesting the spot belongs to them.",
    choices:[
      ["Alternate the booth by day","The families agree to switch each morning and later decide they enjoy sharing customers."],
      ["Hold a drawing","A public drawing settles the booth fairly, though the losing family is offered another prominent location."],
      ["Create a shared pavilion","The court combines the booths into one larger artisan pavilion, and both families accept."]
    ]
  },
  {
    people:"👑 📚 🧒 🔔",
    title:"The School Bell",
    text:"Children petition the court to stop the academy bell from ringing before sunrise in winter. The headmaster insists the tradition is centuries old.",
    choices:[
      ["Move the bell later","Winter lessons begin later, and nearly everyone arrives more cheerful."],
      ["Keep the old schedule","The tradition remains, but the court provides lantern escorts for the darkest mornings."],
      ["Let the town vote on seasonal hours","The town adopts different summer and winter schedules after a public meeting."]
    ]
  }
];

function showView(name){
  views.forEach(v=>v.classList.toggle("active", v.id === `${name}View`));
  if(name!=="home"){ localStorage.setItem("sk_last_view", name); updateContinueButton(); }
  window.scrollTo({top:0,behavior:"smooth"});
  if(name==="explore") renderPlaces();
  if(name==="roleplay") renderRoles();
  if(name==="stories") renderStories();
  if(name==="mystery") renderClues();
  if(name==="quests") renderQuests();
  if(name==="games") renderGame("riddle");
  if(name==="cozy") renderCozy();
  if(name==="court") renderCourt();
  if(name==="life") renderLife();
  if(name==="people") renderPeople();
  if(name==="shops") renderShops();
  if(name==="homebase") renderHomes();
  if(name==="wardrobe") renderWardrobe();
  if(name==="carriage") renderTravel();
  if(name==="festival") renderFestivals();
  if(name==="royals") renderRoyals();
  if(name==="jobs") renderJobs();
  if(name==="letters") renderLetters();
  if(name==="realms") renderRealms();
  if(name==="clock") renderClock();
  if(name==="courtship") renderCourtship();
  if(name==="property") renderProperty();
  if(name==="townservices") renderTownServices();
  if(name==="grandevents") renderGrandEvents();
  if(name==="eventchains") renderEventChains();
  if(name==="seasons") renderSeasons();
  if(name==="household") renderHousehold();
  if(name==="reputation") renderReputation();
  if(name==="calendar") renderCalendar();
  if(name==="cases") renderCases();
  if(name==="routines") renderRoutines();
  if(name==="castleinterior") renderCastleInterior();
  if(name==="storybooks") renderStorybooks();
  if(name==="titles") renderTitles();
  if(name==="todayevents") renderTodayEvent();
  if(name==="letterslive") renderLivingLetters();
  if(name==="consequencequests") renderMemoryQuests();
  if(name==="underways") renderUnderways();
  if(name==="villages") renderVillages();
  if(name==="academy") renderAcademy();
  if(name==="castlework") renderCastleWork();
  if(name==="seasonarcs") renderSeasonArcs();
  if(name==="pastimes") renderPastimes();
  if(name==="lifepaths") renderLifePaths();
  if(name==="stables") renderStables();
  if(name==="feasts") renderFeasts();
  if(name==="theatre") renderTheatre();
  if(name==="passport") renderPassport();
  if(name==="talemaker") renderTaleMaker();
  if(name==="paupersaga") renderPauperSaga();
  if(name==="kingdomdashboard") renderKingdomDashboard();
  if(name==="savecenter") renderSaveCenter();
}

document.addEventListener("click", e=>{
  const nav = e.target.closest("[data-view]");
  if(nav) showView(nav.dataset.view);
});
$(".brand").addEventListener("click",()=>showView("home"));

function toast(msg){
  const el=$("#toast");
  el.textContent=msg; el.classList.add("show");
  setTimeout(()=>el.classList.remove("show"),1900);
}

function addJournal(text){
  const entry={text, date:new Date().toLocaleString()};
  state.journal.unshift(entry);
  state.journal=state.journal.slice(0,40);
  localStorage.setItem("sk_journal",JSON.stringify(state.journal));
  renderJournal();
}

function renderJournal(){
  const box=$("#journalEntries");
  box.innerHTML=state.journal.length ? state.journal.map(e=>`<div class="journal-entry"><div>${e.text}</div><time>${e.date}</time></div>`).join("") : "<p><em>Your journal is empty. Explore the kingdom and discoveries will appear here.</em></p>";
}
renderJournal();

$("#journalBtn").addEventListener("click",()=>{
  $("#journalDrawer").classList.add("open");
  $("#overlay").classList.remove("hidden");
  $("#journalDrawer").setAttribute("aria-hidden","false");
});
function closeJournal(){
  $("#journalDrawer").classList.remove("open");
  $("#overlay").classList.add("hidden");
  $("#journalDrawer").setAttribute("aria-hidden","true");
}
$("#closeJournal").addEventListener("click",closeJournal);
$("#overlay").addEventListener("click",closeJournal);
$("#clearJournal").addEventListener("click",()=>{
  state.journal=[]; localStorage.setItem("sk_journal","[]"); renderJournal(); toast("Journal cleared.");
});

$("#profileBtn").addEventListener("click",()=>{
  showView("roleplay");
  if(state.character) toast(`Welcome back, ${state.character.name}.`);
});

function renderHappenings(){
  $("#happenings").innerHTML=happenings.slice().sort(()=>Math.random()-.5).slice(0,4).map(x=>`<div class="happening">✨ ${x}</div>`).join("");
}
renderHappenings();

const tickers=[
  "The Moonlight Lantern Festival is gathering in Market Square.",
  "The royal kitchens are preparing a midnight pastry tasting.",
  "A storyteller from the northern road has arrived at the Harbor Inn.",
  "The palace gardens remain open late for the firefly walk."
];
let tickerIndex=0;
setInterval(()=>{
  tickerIndex=(tickerIndex+1)%tickers.length;
  $("#festivalTicker").textContent=tickers[tickerIndex];
},6500);

function renderPlaces(){
  $("#mapGrid").innerHTML=places.map((p,i)=>`
    <article class="place-card" data-place="${i}">
      <div class="place-art">${p.icon}</div>
      <h2>${p.name}</h2><strong>${p.mood}</strong><p>${p.text}</p>
    </article>`).join("");
  $$("#mapGrid .place-card").forEach(c=>c.addEventListener("click",()=>openPlace(Number(c.dataset.place))));
}
function openPlace(i){
  const p=places[i], panel=$("#locationPanel");
  panel.classList.remove("hidden");
  panel.innerHTML=`<p class="eyebrow">YOU ARRIVED</p><h2>${p.icon} ${p.name}</h2><p>${p.text}</p>
  <div class="scene-actions">${p.actions.map(a=>`<button class="choice-btn">${a}</button>`).join("")}</div>
  <p id="placeMoment" class="story-note"></p>`;
  panel.scrollIntoView({behavior:"smooth",block:"center"});
  panel.querySelectorAll(".choice-btn").forEach(btn=>btn.addEventListener("click",()=>{
    const moments=[
      `You choose to ${btn.textContent.toLowerCase()}. A small detail catches your attention and turns the moment into its own little story.`,
      `You ${btn.textContent.toLowerCase()}. Someone nearby smiles as though they recognize you from another tale.`,
      `You ${btn.textContent.toLowerCase()}. Nothing urgent happens—and somehow that makes the kingdom feel more real.`
    ];
    $("#placeMoment").textContent=moments[Math.floor(Math.random()*moments.length)];
    addJournal(`At ${p.name}, you chose to “${btn.textContent}.”`);
  }));
  addJournal(`Visited ${p.name}.`);
}

function renderRoles(){
  $("#roleGrid").innerHTML=roles.map((r,i)=>`
  <article class="role-card" data-role="${i}">
    <div class="role-art">${r[0]}</div><h2>${r[1]}</h2><p>${r[2]}</p>
    <button class="secondary-btn small">Choose this role</button>
  </article>`).join("");
  $$("#roleGrid .role-card").forEach(c=>c.addEventListener("click",()=>{
    const r=roles[Number(c.dataset.role)];
    $("#charRole").value=r[1];
    toast(`${r[1]} selected. Add a name if you like.`);
    $(".custom-role").scrollIntoView({behavior:"smooth",block:"center"});
  }));
  if(state.character){
    $("#charName").value=state.character.name||"";
    $("#charRole").value=state.character.role||"";
    $("#charHome").value=state.character.home||"";
    $("#charDetail").value=state.character.detail||"";
  }
}
$("#saveCharacter").addEventListener("click",()=>{
  const char={
    name:$("#charName").value.trim() || "The Traveler",
    role:$("#charRole").value.trim() || "mysterious visitor",
    home:$("#charHome").value.trim() || "wherever the road leads",
    detail:$("#charDetail").value.trim() || "has a talent for finding unexpected stories"
  };
  state.character=char; localStorage.setItem("sk_character",JSON.stringify(char));
  $("#characterSaved").textContent=`Saved! ${char.name}, ${char.role}, is ready to enter Storybook Kingdom.`;
  addJournal(`Created character: ${char.name}, ${char.role}.`);
});

function renderStories(){
  $("#storyShelf").classList.remove("hidden");
  $("#storyPlayer").classList.add("hidden");
  $("#storyShelf").innerHTML=stories.map(s=>`
  <article class="story-card" data-story="${s.id}">
    <div class="story-art">${s.icon}</div><h2>${s.title}</h2><p>${s.blurb}</p>
    <button class="primary-btn">Begin Story</button>
  </article>`).join("");
  $$("#storyShelf .story-card").forEach(c=>c.addEventListener("click",()=>startStory(c.dataset.story)));
}
function startStory(id){
  const s=stories.find(x=>x.id===id);
  $("#storyShelf").classList.add("hidden");
  $("#storyPlayer").classList.remove("hidden");
  renderStoryNode(s,s.start);
  addJournal(`Began the story “${s.title}.”`);
}
function renderStoryNode(story,nodeId){
  if(nodeId==="shelf"){ renderStories(); return; }
  const n=story.nodes[nodeId];
  $("#storyPlayer").innerHTML=`
    <p class="eyebrow">${story.icon} ${story.title}</p>
    <div class="story-scene"><p>${n.text}</p></div>
    <div class="choice-row">${n.choices.map((c,i)=>`<button class="choice-btn" data-next="${c[1]}">${c[0]}</button>`).join("")}</div>
    ${n.end?'<p class="story-note">One ending has been reached. This tale can be replayed to follow another path.</p>':''}
  `;
  $("#storyPlayer").querySelectorAll("[data-next]").forEach((b,i)=>b.addEventListener("click",()=>{
    addJournal(`In “${story.title},” chose: ${b.textContent}.`);
    renderStoryNode(story,b.dataset.next);
  }));
}

function renderClues(){
  const found=new Set(state.clues);
  $("#clueBoard").innerHTML=clues.map(c=>`
  <article class="clue-card ${found.has(c.id)?"examined":""}" data-clue="${c.id}">
    <span class="clue-tag">${found.has(c.id)?"Examined":"Unexamined"}</span>
    <h2>${c.icon} ${c.name}</h2>
    <p>${found.has(c.id)?c.text:"Click to inspect this clue."}</p>
  </article>`).join("");
  updateClueProgress();
  $$("#clueBoard .clue-card").forEach(card=>card.addEventListener("click",()=>{
    const c=clues.find(x=>x.id===card.dataset.clue);
    if(!state.clues.includes(c.id)){ state.clues.push(c.id); localStorage.setItem("sk_clues",JSON.stringify(state.clues)); addJournal(`Examined mystery clue: ${c.name}.`); }
    renderClues();
  }));
}
function updateClueProgress(){
  const n=state.clues.length;
  $("#clueProgress").style.width=`${n/clues.length*100}%`;
  $("#clueCount").textContent=`${n} of ${clues.length} clues examined`;
  const panel=$("#deductionPanel");
  if(n===clues.length){
    panel.classList.remove("hidden");
    $("#suspectButtons").innerHTML=Object.keys(suspects).map(s=>`<button class="choice-btn" data-suspect="${s}">${s}</button>`).join("");
    $$("#suspectButtons button").forEach(b=>b.addEventListener("click",()=>{
      $("#deductionResult").textContent=suspects[b.dataset.suspect];
      addJournal(`Made a deduction in the Star Crown case: ${b.dataset.suspect}.`);
    }));
  } else panel.classList.add("hidden");
}
$("#resetMystery").addEventListener("click",()=>{
  state.clues=[]; localStorage.setItem("sk_clues","[]"); $("#deductionResult").textContent=""; renderClues(); toast("Case reset.");
});

function renderQuests(){
  $("#questBoard").innerHTML=quests.map((q,i)=>`
    <article class="quest-card ${state.activeQuest===q.title?"active-quest":""}">
      <div class="quest-art">${q.icon}</div><h2>${q.title}</h2>
      <div class="quest-meta"><span class="badge">${q.level}</span><span class="badge">${q.time}</span></div>
      <p>${q.text}</p>
      <button class="${state.activeQuest===q.title?"secondary-btn":"primary-btn"} small" data-quest="${i}">
        ${state.activeQuest===q.title?"Currently Chosen":"Choose Quest"}
      </button>
    </article>`).join("");
  $$("#questBoard [data-quest]").forEach(b=>b.addEventListener("click",()=>{
    const q=quests[Number(b.dataset.quest)];
    state.activeQuest=q.title; localStorage.setItem("sk_quest",q.title);
    addJournal(`Chose quest: ${q.title}.`);
    renderQuests(); toast(`Quest chosen: ${q.title}`);
  }));
}

const riddles=[
  ["I have cities but no houses, forests but no trees, and rivers but no water. What am I?","map"],
  ["The more of me you take, the more you leave behind. What am I?","footsteps"],
  ["I can fill a room but take up no space. What am I?","light"],
  ["I speak without a mouth and answer when called. What am I?","echo"]
];
let currentRiddle=0;

function renderGame(type){
  $$(".tab").forEach(t=>t.classList.toggle("active",t.dataset.game===type));
  if(type==="riddle") renderRiddle();
  if(type==="memory") renderMemory();
  if(type==="fortune") renderFortune();
}
$$(".tab").forEach(t=>t.addEventListener("click",()=>renderGame(t.dataset.game)));

function renderRiddle(){
  currentRiddle=Math.floor(Math.random()*riddles.length);
  const [q]=riddles[currentRiddle];
  $("#gameStage").innerHTML=`
    <p class="eyebrow">RIDDLE BOOTH</p><p class="big-riddle">${q}</p>
    <input id="riddleAnswer" class="answer-input" placeholder="Type your answer..." />
    <div class="scene-actions"><button id="checkRiddle" class="primary-btn">Check Answer</button><button id="newRiddle" class="secondary-btn">New Riddle</button></div>
    <p id="riddleResult"></p>`;
  $("#checkRiddle").addEventListener("click",()=>{
    const ans=$("#riddleAnswer").value.trim().toLowerCase();
    const correct=riddles[currentRiddle][1];
    if(ans.includes(correct)){
      $("#riddleResult").textContent="Correct! 🎀 You earned a festival ribbon.";
      state.ribbons++; localStorage.setItem("sk_ribbons",state.ribbons); addJournal("Won a ribbon at the Riddle Booth.");
    } else $("#riddleResult").textContent="Not quite. Try again—or choose a new riddle.";
  });
  $("#newRiddle").addEventListener("click",renderRiddle);
}

function renderMemory(){
  const icons=["👑","🏰","🌹","🗝️","👑","🏰","🌹","🗝️"].sort(()=>Math.random()-.5);
  let first=null, lock=false, matches=0;
  $("#gameStage").innerHTML=`<p class="eyebrow">ROYAL MEMORY</p><h2>Match the kingdom pairs.</h2><p>Find all four pairs.</p>
    <div class="memory-grid">${icons.map((x,i)=>`<button class="memory-card" data-i="${i}" data-icon="${x}">✦</button>`).join("")}</div>
    <p id="memoryResult">Pairs found: 0 / 4</p>`;
  $$(".memory-card").forEach(card=>card.addEventListener("click",()=>{
    if(lock || card.classList.contains("matched") || card===first) return;
    card.textContent=card.dataset.icon; card.classList.add("revealed");
    if(!first){ first=card; return; }
    if(first.dataset.icon===card.dataset.icon){
      first.classList.add("matched"); card.classList.add("matched"); first=null; matches++;
      $("#memoryResult").textContent=`Pairs found: ${matches} / 4`;
      if(matches===4){
        state.ribbons++; localStorage.setItem("sk_ribbons",state.ribbons);
        $("#memoryResult").textContent="You matched them all! 🎀 Festival ribbon earned.";
        addJournal("Won a ribbon playing Royal Memory.");
      }
    } else {
      lock=true; const prev=first;
      setTimeout(()=>{ prev.textContent="✦"; card.textContent="✦"; prev.classList.remove("revealed"); card.classList.remove("revealed"); first=null; lock=false; },700);
    }
  }));
}

function renderFortune(){
  const fortunes=[
    "A stranger will bring a story worth hearing.",
    "Follow the path with lanterns, not the road with signs.",
    "Someone in the market knows more than they are saying.",
    "A quiet afternoon may become your favorite part of the kingdom.",
    "The next locked door is not necessarily meant to stay locked.",
    "A festival ribbon will become important in a future tale."
  ];
  $("#gameStage").innerHTML=`<p class="eyebrow">WHEEL OF FORTUNE & FATE</p><h2>Spin for a story prompt.</h2>
    <div id="fortuneWheel" class="wheel"><span>SPIN</span></div>
    <div style="text-align:center"><button id="spinBtn" class="primary-btn">Spin the Wheel</button><p id="fortuneText"></p></div>`;
  $("#spinBtn").addEventListener("click",()=>{
    const wheel=$("#fortuneWheel"); const turns=720+Math.floor(Math.random()*720);
    wheel.style.transform=`rotate(${turns}deg)`;
    setTimeout(()=>{
      const f=fortunes[Math.floor(Math.random()*fortunes.length)];
      $("#fortuneText").textContent=f; addJournal(`Festival fortune: “${f}”`);
    },900);
  });
}

function renderCozy(){
  $("#cozySpots").innerHTML=cozyMoments.map((c,i)=>`
  <article class="cozy-card" data-cozy="${i}">
    <div class="cozy-art">${c[1]}</div><h2>${c[0]}</h2><p>${c[2]}</p>
  </article>`).join("");
  $$("#cozySpots .cozy-card").forEach(c=>c.addEventListener("click",()=>{
    $$(".cozy-card").forEach(x=>x.classList.remove("selected")); c.classList.add("selected");
    showCozy(Number(c.dataset.cozy));
  }));
}
function showCozy(i){
  const c=cozyMoments[i];
  $("#cozyScene").innerHTML=`<div class="cozy-art">${c[1]}</div><h2>${c[0]}</h2><p>${c[2]}</p><button id="newCozyMoment" class="secondary-btn">Give Me Another Quiet Moment</button>`;
  $("#newCozyMoment").addEventListener("click",()=>showCozy(Math.floor(Math.random()*cozyMoments.length)));
}
$("#newCozyMoment").addEventListener("click",()=>showCozy(Math.floor(Math.random()*cozyMoments.length)));

function renderCourt(){
  const p=courtPetitions[Math.floor(Math.random()*courtPetitions.length)];
  const char=state.character ? `${state.character.name}, ${state.character.role}` : "Traveler";
  $("#courtScene").innerHTML=`<div class="court-people">${p.people}</div><p class="eyebrow">PETITION BEFORE THE COURT</p><h2>${p.title}</h2>
    <p><strong>${char}</strong>, the chamber grows quiet as the petition is read.</p><p>${p.text}</p>
    <div class="choice-row">${p.choices.map((c,i)=>`<button class="choice-btn" data-court="${i}">${c[0]}</button>`).join("")}</div><p id="courtResult"></p>
    <button id="anotherPetition" class="secondary-btn small">Hear Another Petition</button>`;
  $$("#courtScene [data-court]").forEach(b=>b.addEventListener("click",()=>{
    const c=p.choices[Number(b.dataset.court)];
    $("#courtResult").textContent=c[1]; addJournal(`At royal court, chose: ${c[0]}.`);
  }));
  $("#anotherPetition").addEventListener("click",renderCourt);
}

// Gentle synthesized ambience: no external audio files.
let audioCtx=null, ambientTimer=null, soundOn=false;
$("#soundBtn").addEventListener("click",()=>{
  soundOn=!soundOn;
  $("#soundBtn").textContent=soundOn?"🔊":"♫";
  if(soundOn) startAmbience(); else stopAmbience();
});
function startAmbience(){
  audioCtx = audioCtx || new (window.AudioContext||window.webkitAudioContext)();
  if(audioCtx.state==="suspended") audioCtx.resume();
  const playBell=()=>{
    if(!soundOn) return;
    const osc=audioCtx.createOscillator(), gain=audioCtx.createGain();
    osc.type="sine"; osc.frequency.value=[392,440,523.25,659.25][Math.floor(Math.random()*4)];
    gain.gain.setValueAtTime(.0001,audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(.035,audioCtx.currentTime+.03);
    gain.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+2.1);
    osc.connect(gain).connect(audioCtx.destination); osc.start(); osc.stop(audioCtx.currentTime+2.2);
  };
  playBell();
  ambientTimer=setInterval(playBell,4200);
  toast("Gentle kingdom ambience on.");
}
function stopAmbience(){
  clearInterval(ambientTimer); ambientTimer=null;
  toast("Ambience off.");
}

renderPlaces();


// ---------- Kingdom Life expansion ----------
const kingdomPeople = [
  {id:"queen",avatar:"👑",name:"Queen Elowen",role:"Queen of Roseglass",tags:["warm","observant","loves old customs"],line:"A kingdom is made of ordinary mornings as much as coronations.",gift:"Pressed Rose",rumors:["The west tower windows were lit long after midnight.","She is quietly planning a village supper with no formal seating."]},
  {id:"prince",avatar:"🤴",name:"Prince Lucien",role:"Royal heir & amateur mapmaker",tags:["curious","restless","good-humored"],line:"I know three roads that are not on any official map.",gift:"Tiny Compass",rumors:["Lucien has been sketching the old orchard wall.","He challenged the stablemaster to a dawn race and lost badly."]},
  {id:"mara",avatar:"🧹",name:"Mara Bell",role:"Palace maid",tags:["quick-witted","kind","knows everything"],line:"I do not gossip. I simply happen to hear the truth before everyone else.",gift:"Lavender Sachet",rumors:["A guest asked for directions to a room that has been sealed for years.","The cooks are hiding a second dessert from the royal steward."]},
  {id:"tomas",avatar:"🍞",name:"Tomas Hearth",role:"Village baker",tags:["generous","dramatic","early riser"],line:"Sit down. No mystery was ever solved properly on an empty stomach.",gift:"Honey Bun",rumors:["Someone ordered twelve pastries and asked that each be wrapped separately in blue paper.","The miller swears he heard violin music from the empty orchard."]},
  {id:"elin",avatar:"📚",name:"Archivist Elin Vale",role:"Keeper of Bellflower records",tags:["scholarly","dry humor","secretive"],line:"Old documents are rarely silent. People simply stop asking them questions.",gift:"Bookplate",rumors:["A page is missing from the oldest festival ledger.","The abbey received a letter sealed with wax from a kingdom that no longer exists."]},
  {id:"joren",avatar:"🛡️",name:"Captain Joren",role:"Captain of the gate guard",tags:["steady","protective","bad singer"],line:"Most trouble announces itself. The interesting kind wears good shoes and smiles politely.",gift:"Guard Token",rumors:["A carriage entered through the east gate with curtains drawn.","Three children have discovered a shortcut the guards somehow missed."]},
  {id:"mina",avatar:"🧺",name:"Mina Thistle",role:"Market florist",tags:["cheerful","romantic","excellent memory"],line:"Flowers remember seasons. People remember stories. I sell a little of both.",gift:"Ribbon Bouquet",rumors:["Someone keeps leaving white roses at the fountain before sunrise.","Mina believes two people in town are secretly courting."]},
  {id:"pip",avatar:"🧒",name:"Pip Rowan",role:"Village errand runner",tags:["mischievous","brave","everywhere at once"],line:"I can get anywhere in town faster than a horse if nobody asks how.",gift:"Lucky Marble",rumors:["Pip found a key behind a loose brick near the clocktower.","He says there is a cat that rides the bread cart every Tuesday."]},
  {id:"celeste",avatar:"🎻",name:"Celeste Vane",role:"Traveling violinist",tags:["elegant","mysterious","well-traveled"],line:"Every kingdom dances differently when nobody important is watching.",gift:"Silver Music Pin",rumors:["Celeste recognizes the melody played by the old clock at thirteen.","She once performed at a winter palace beyond the mountains."]}
];

const shops = [
  {icon:"🧁",name:"Hearth & Honey",keeper:"Tomas Hearth",items:[["Honey Bun","🍯",4],["Berry Tart","🥧",6],["Festival Cake Slice","🍰",7],["Tea Parcel","🫖",5]]},
  {icon:"👗",name:"Rose & Ribbon Clothier",keeper:"Madame Aurelia",items:[["Rose Ball Gown","👗",18],["Velvet Court Coat","🧥",18],["Festival Dress","💃",14],["Embroidered Cloak","🥻",12]]},
  {icon:"📚",name:"The Crooked Bookmark",keeper:"Master Wynn",items:[["Pocket Fairy Tales","📕",8],["Kingdom Map","🗺️",7],["Blank Story Journal","📓",5],["Old Riddle Book","📖",9]]},
  {icon:"🌷",name:"Thistle & Bloom",keeper:"Mina Thistle",items:[["Ribbon Bouquet","💐",6],["Pressed Rose","🌹",4],["Lavender Sachet","💜",5],["Wildflower Crown","🌼",8]]},
  {icon:"🗝️",name:"Oddments & Curios",keeper:"Mr. Quill",items:[["Tiny Compass","🧭",10],["Mystery Key","🗝️",11],["Brass Music Box","🎵",15],["Moonstone Trinket","🔮",17]]}
];

const homes = [
  {icon:"🏡",name:"Lantern Row Cottage",desc:"A warm two-room cottage with flower boxes, a little kitchen, window seat, and neighbors close enough to wave to.",scene:"🔥 🪟 🫖 🧺"},
  {icon:"🏰",name:"Castle Guest Chambers",desc:"High ceilings, a carved bed, balcony doors, palace bells, and enough corridors outside to get delightfully lost.",scene:"🕯️ 🛏️ 🪞 👑"},
  {icon:"🌿",name:"Whisperwood Cottage",desc:"A moss-roof cottage just inside the forest edge with herb shelves, a stone hearth, and fox tracks outside most mornings.",scene:"🌲 🔥 🌿 🦊"},
  {icon:"⚓",name:"Moonharbor Loft",desc:"Rooms above a quiet chandlery overlooking ships, gulls, lanterns, and travelers arriving from distant roads and seas.",scene:"🌊 🪟 ⚓ 🏮"},
  {icon:"📚",name:"Abbey Scholar's Room",desc:"A simple stone room with a writing desk, narrow bed, shelves, and bells that mark the day from across the cloister.",scene:"📚 🪶 🕯️ 🔔"},
  {icon:"🌹",name:"Garden Pavilion",desc:"A fanciful little residence near the queen's gardens, wrapped in roses and close to fountains, hedges, and peacocks.",scene:"🌹 ⛲ 🦚 🌙"}
];

const baseOutfits = [
  ["Traveling Cloak","🧥","Practical and comfortable for wandering anywhere."],
  ["Village Sunday Best","👒","Neat, cheerful clothes for market days and family suppers."],
  ["Royal Blue Court Dress","💙","Formal enough for an audience without being too grand."],
  ["Knight's Ceremonial Tunic","🛡️","Polished, respectable, and suitable for the palace courtyard."],
  ["Scholar's Robes","📚","Soft layered robes with ink-safe sleeves and many pockets."],
  ["Festival Ribbons","🎀","Bright ribbons, embroidered trim, and bells at the cuff."]
];

const travelOptions = [
  {icon:"🚶",name:"Walk the Cobbled Lanes",cost:0,scene:"You take the long way through town. A shopkeeper sweeps the step, two children race past, and somebody waves from an upstairs window."},
  {icon:"🐎",name:"Ride Horseback",cost:2,scene:"Your horse carries you beyond the last cottages where the road opens to orchards, low hills, and a distant view of Roseglass Castle."},
  {icon:"🛞",name:"Take the Royal Carriage",cost:4,scene:"The carriage rolls beneath flowering trees. People glance up as the crest passes, and the driver tells you a bit of news from the north gate."},
  {icon:"🛶",name:"Harbor Boat Ride",cost:3,scene:"A small boat glides beyond Moonharbor. From the water, the kingdom looks like an illustration: castle towers, green hills, and a ribbon of lanterns."},
  {icon:"🌲",name:"Forest Pony Trail",cost:3,scene:"The pony knows the path better than you do. It stops beside a hollow oak where someone has left a tiny bouquet tied with blue thread."},
  {icon:"🌙",name:"Midnight Carriage",cost:5,scene:"At midnight, the streets are almost empty. The carriage lamps paint moving gold circles on the stones while the clocktower follows you with thirteen quiet chimes."}
];

const festivals = [
  {icon:"🏮",season:"Spring",name:"Lantern Bloom Festival",desc:"Thousands of flower-shaped lanterns float through Market Square while musicians play from balconies.",activities:["Make a lantern","Join the evening dance","Taste flower-crown pastries"]},
  {icon:"🌹",season:"Late Spring",name:"Rose Court Week",desc:"Garden picnics, costume promenades, flower judging, court music, and open palace gardens.",activities:["Design a flower crown","Attend a garden audience","Enter the rose maze"]},
  {icon:"🎪",season:"Summer",name:"Midsummer Fair",desc:"Games, ribbons, acrobats, puppet theatres, pie contests, dancing, and a huge sunset feast on Festival Green.",activities:["Play three booths","Watch the puppet play","Join the feast"]},
  {icon:"🌾",season:"Autumn",name:"Harvest Homecoming",desc:"The village decorates every doorway, bakes for days, and holds a long table supper through Lantern Row.",activities:["Judge the pies","Decorate a doorway","Dance in the lane"]},
  {icon:"🕯️",season:"Late Autumn",name:"Night of Old Stories",desc:"Candles line the castle walls while families gather to tell legends, ghost tales, mysteries, and stories of the kingdom's founding.",activities:["Tell a story","Hear a castle legend","Explore by candlelight"]},
  {icon:"❄️",season:"Winter",name:"Winter Star Ball",desc:"Snow lanterns, silver banners, music, formal dancing, midnight chocolate, and one masked dance before the clock strikes twelve.",activities:["Choose a mask","Dance in the ballroom","Visit the chocolate table"]}
];

const dailyMoments = [
  ["Breakfast at Hearth & Honey","Tomas saves you the window table. A warm roll arrives before you even order.",3,"Honey Bun"],
  ["A Letter at the Door","A child delivers a folded note inviting you to a small supper in Lantern Row.",2,"Cream Invitation"],
  ["Rain in Market Square","A sudden shower sends everyone beneath awnings, where strangers begin sharing gossip and pastries.",2,"Market Token"],
  ["A Quiet Palace Morning","You are allowed into the great hall before visitors arrive. Sunlight crosses the empty floor.",3,"Golden Bookmark"],
  ["Help with Festival Banners","Mina needs one extra pair of hands tying ribbons across the square. Nobody rushes you.",4,"Festival Ribbon"]
];

function saveLife(){
  localStorage.setItem("sk_coins",state.coins);
  localStorage.setItem("sk_inventory",JSON.stringify(state.inventory));
  localStorage.setItem("sk_outfit",state.outfit);
  localStorage.setItem("sk_home",state.home);
  localStorage.setItem("sk_friendships",JSON.stringify(state.friendships));
}
function addItem(item){ if(!state.inventory.includes(item)) state.inventory.push(item); saveLife(); }
function spendCoins(n){ if(state.coins<n) return false; state.coins-=n; saveLife(); return true; }
function earnCoins(n){ state.coins+=n; saveLife(); }
function friendship(id){ return state.friendships[id]||0; }
function bumpFriendship(id,n=1){ state.friendships[id]=Math.min(10,friendship(id)+n); saveLife(); }

function renderLife(){
  $("#lifeStats").innerHTML=`
    <div class="stat-chip"><strong>🪙 ${state.coins}</strong><span>Kingdom coins</span></div>
    <div class="stat-chip"><strong>🏡 ${state.home}</strong><span>Current home</span></div>
    <div class="stat-chip"><strong>👗 ${state.outfit}</strong><span>Current outfit</span></div>
    <div class="stat-chip"><strong>🎒 ${state.inventory.length}</strong><span>Keepsakes collected</span></div>`;
  const d=dailyMoments[new Date().getDate()%dailyMoments.length];
  $("#dailyMomentTitle").textContent=d[0]; $("#dailyMomentText").textContent=d[1]; $("#dailyMomentResult").textContent="";
  $("#dailyMomentBtn").onclick=()=>{ earnCoins(d[2]); addItem(d[3]); $("#dailyMomentResult").textContent=`You lived the moment, earned ${d[2]} coins, and received: ${d[3]}.`; addJournal(`Kingdom Life: ${d[0]} — received ${d[3]}.`); renderLife(); };
}

function renderPeople(){
  $("#peopleGrid").innerHTML=kingdomPeople.map(p=>`<article class="person-card" data-person="${p.id}"><div class="avatar">${p.avatar}</div><h2>${p.name}</h2><strong>${p.role}</strong><div class="person-tags">${p.tags.map(t=>`<span class="person-tag">${t}</span>`).join("")}</div><div class="friend-meter"><span style="width:${friendship(p.id)*10}%"></span></div><small>Friendship ${friendship(p.id)} / 10</small></article>`).join("");
  $$("#peopleGrid [data-person]").forEach(c=>c.onclick=()=>openPerson(c.dataset.person));
}
function openPerson(id){
  const p=kingdomPeople.find(x=>x.id===id), scene=$("#personScene"); scene.classList.remove("hidden");
  scene.innerHTML=`<p class="eyebrow">${p.role}</p><h2>${p.avatar} ${p.name}</h2><p class="dialogue">“${p.line}”</p><div class="scene-actions"><button id="talkPerson" class="primary-btn">Talk a While</button><button id="gossipPerson" class="secondary-btn">Hear a Rumor</button><button id="giftPerson" class="secondary-btn">Exchange a Small Gift</button></div><p id="personResult"></p>`;
  $("#talkPerson").onclick=()=>{ bumpFriendship(id); earnCoins(1); $("#personResult").textContent=`You spend an easy few minutes talking. Friendship rises to ${friendship(id)}/10. You also earn 1 coin for taking part in kingdom life.`; addJournal(`Talked with ${p.name}.`); renderPeople(); };
  $("#gossipPerson").onclick=()=>{ $("#personResult").textContent=p.rumors[Math.floor(Math.random()*p.rumors.length)]; addJournal(`${p.name} shared a rumor.`); };
  $("#giftPerson").onclick=()=>{ addItem(p.gift); bumpFriendship(id,2); $("#personResult").textContent=`${p.name} gives you a ${p.gift}. Friendship rises to ${friendship(id)}/10.`; addJournal(`${p.name} gave you: ${p.gift}.`); renderPeople(); };
  scene.scrollIntoView({behavior:"smooth",block:"center"});
}

function renderShops(){
  $("#walletBar").innerHTML=`<strong>🪙 Wallet: ${state.coins} kingdom coins</strong><span>🎒 ${state.inventory.length} keepsakes</span>`;
  $("#shopGrid").innerHTML=shops.map((s,i)=>`<article class="shop-card" data-shop="${i}"><div class="shop-icon">${s.icon}</div><h2>${s.name}</h2><p>Shopkeeper: ${s.keeper}</p><button class="secondary-btn small">Enter Shop</button></article>`).join("");
  $$("#shopGrid [data-shop]").forEach(c=>c.onclick=()=>openShop(Number(c.dataset.shop)));
}
function openShop(i){
  const s=shops[i], scene=$("#shopScene"); scene.classList.remove("hidden");
  scene.innerHTML=`<p class="eyebrow">WELCOME TO</p><h2>${s.icon} ${s.name}</h2><p>${s.keeper} greets you from behind the counter.</p><div class="item-list">${s.items.map((it,j)=>`<div class="shop-item ${state.inventory.includes(it[0])?'owned':''}"><strong>${it[1]} ${it[0]}</strong><p class="price">🪙 ${it[2]}</p><button class="${state.inventory.includes(it[0])?'secondary-btn':'primary-btn'} small" data-buy="${j}">${state.inventory.includes(it[0])?'Owned':'Buy'}</button></div>`).join("")}</div><p id="shopResult"></p>`;
  scene.querySelectorAll("[data-buy]").forEach(b=>b.onclick=()=>{ const it=s.items[Number(b.dataset.buy)]; if(state.inventory.includes(it[0])){ $("#shopResult").textContent="You already own that."; return;} if(!spendCoins(it[2])){ $("#shopResult").textContent="You do not have enough kingdom coins yet. Talk to people, play, explore, or live a daily moment to earn more."; return;} addItem(it[0]); $("#shopResult").textContent=`Purchased ${it[0]} for ${it[2]} coins.`; addJournal(`Bought ${it[0]} at ${s.name}.`); renderShops(); openShop(i); });
  scene.scrollIntoView({behavior:"smooth",block:"center"});
}

function renderHomes(){
  $("#homeChoices").innerHTML=homes.map(h=>`<article class="home-card ${state.home===h.name?'selected':''}" data-home="${h.name}"><div class="home-icon">${h.icon}</div><h2>${h.name}</h2><p>${h.desc}</p></article>`).join("");
  $$("#homeChoices [data-home]").forEach(c=>c.onclick=()=>{ state.home=c.dataset.home; saveLife(); addJournal(`Chose a new home: ${state.home}.`); renderHomes(); });
  const h=homes.find(x=>x.name===state.home)||homes[0]; $("#homeScene").innerHTML=`<div class="home-scene-art">${h.scene}</div><p class="eyebrow">HOME TONIGHT</p><h2>${h.name}</h2><p>${h.desc}</p><div class="scene-actions"><button class="choice-btn" id="restHome">Have a Quiet Evening</button><button class="choice-btn" id="inviteHome">Invite Someone for Tea</button><button class="choice-btn" id="journalHome">Write by the Window</button></div><p id="homeResult"></p>`;
  $("#restHome").onclick=()=>$("#homeResult").textContent="You change into comfortable clothes, light a lamp, and let the kingdom carry on without you for a while.";
  $("#inviteHome").onclick=()=>{ earnCoins(1); $("#homeResult").textContent="A familiar face stops by. Tea turns into stories, and you earn 1 kingdom coin for participating in daily life."; };
  $("#journalHome").onclick=()=>{ addJournal(`Spent a quiet evening writing at ${state.home}.`); $("#homeResult").textContent="You write down one small thing you do not want to forget."; };
}

function renderWardrobe(){
  const available=[...baseOutfits];
  if(state.inventory.includes("Rose Ball Gown")) available.push(["Rose Ball Gown","👗","A sweeping rose-colored gown for dances and formal court nights."]);
  if(state.inventory.includes("Velvet Court Coat")) available.push(["Velvet Court Coat","🧥","Deep velvet with polished buttons and a formal cut."]);
  if(state.inventory.includes("Festival Dress")) available.push(["Festival Dress","💃","Bright, light, and made for dancing beneath outdoor lanterns."]);
  if(state.inventory.includes("Embroidered Cloak")) available.push(["Embroidered Cloak","🥻","A warm cloak stitched with tiny stars and leaves."]);
  const current=available.find(o=>o[0]===state.outfit)||available[0];
  $("#outfitNow").innerHTML=`<div class="big-outfit">${current[1]}</div><p class="eyebrow">WEARING NOW</p><h2>${current[0]}</h2><p>${current[2]}</p>`;
  $("#wardrobeGrid").innerHTML=available.map(o=>`<article class="outfit-card ${state.outfit===o[0]?'selected':''}" data-outfit="${o[0]}"><div class="outfit-icon">${o[1]}</div><h2>${o[0]}</h2><p>${o[2]}</p></article>`).join("");
  $$("#wardrobeGrid [data-outfit]").forEach(c=>c.onclick=()=>{ state.outfit=c.dataset.outfit; saveLife(); addJournal(`Changed outfit to ${state.outfit}.`); renderWardrobe(); });
}

function renderTravel(){
  $("#travelGrid").innerHTML=travelOptions.map((t,i)=>`<article class="travel-card" data-travel="${i}"><div class="travel-icon">${t.icon}</div><h2>${t.name}</h2><p>${t.cost?`Fare: 🪙 ${t.cost}`:'Free'}</p></article>`).join("");
  $$("#travelGrid [data-travel]").forEach(c=>c.onclick=()=>openTravel(Number(c.dataset.travel)));
}
function openTravel(i){ const t=travelOptions[i], scene=$("#travelScene"); scene.classList.remove("hidden"); if(t.cost && !spendCoins(t.cost)){ scene.innerHTML=`<h2>${t.icon} ${t.name}</h2><p>You need ${t.cost} coins for this ride. Walking the cobbled lanes is always free.</p>`; return;} const finds=["Blue Ribbon","Smooth River Stone","Tiny Bell","Old Postcard","Pressed Fern","Copper Button"]; const found=Math.random()<.48?finds[Math.floor(Math.random()*finds.length)]:null; if(found)addItem(found); scene.innerHTML=`<div class="travel-scene-art">${t.icon} ✨ 🏰</div><h2>${t.name}</h2><p>${t.scene}</p>${found?`<p><strong>You found:</strong> ${found}</p>`:"<p>The journey is quiet. Nothing special has to happen for it to be worth taking.</p>"}`; addJournal(`Traveled by: ${t.name}${found?` and found ${found}`:''}.`); scene.scrollIntoView({behavior:"smooth",block:"center"}); }

function renderFestivals(){
  $("#festivalGrid").innerHTML=festivals.map((f,i)=>`<article class="festival-card" data-festival="${i}"><div class="festival-icon">${f.icon}</div><div class="season">${f.season}</div><h2>${f.name}</h2><p>${f.desc}</p></article>`).join("");
  $$("#festivalGrid [data-festival]").forEach(c=>c.onclick=()=>openFestival(Number(c.dataset.festival)));
}
function openFestival(i){ const f=festivals[i], scene=$("#festivalScene"); scene.classList.remove("hidden"); scene.innerHTML=`<div class="festival-scene-art">${f.icon} 🎶 🏮 🎀</div><p class="eyebrow">${f.season}</p><h2>${f.name}</h2><p>${f.desc}</p><div class="scene-actions">${f.activities.map((a,j)=>`<button class="choice-btn" data-fa="${j}">${a}</button>`).join("")}</div><p id="festivalResult"></p>`; scene.querySelectorAll("[data-fa]").forEach(b=>b.onclick=()=>{ const a=f.activities[Number(b.dataset.fa)]; earnCoins(2); if(Math.random()<.5)addItem(`${f.name} Ribbon`); $("#festivalResult").textContent=`You choose to ${a.toLowerCase()}. You earn 2 kingdom coins and the festival carries on around you.`; addJournal(`${f.name}: ${a}.`); }); scene.scrollIntoView({behavior:"smooth",block:"center"}); }


// ---------- Deeper Kingdom expansion ----------
const royals = [
  {icon:"👑",name:"Queen Elowen Roseglass",title:"Queen of Storybook Kingdom",text:"Warm in public, observant in private, and famous for remembering the names of ordinary townspeople. She inherited the throne after a decade spent studying law, history, and village administration.",secret:"She keeps a handwritten notebook of unresolved promises made by earlier rulers."},
  {icon:"🤴",name:"Prince Lucien Roseglass",title:"Crown Prince",text:"A capable rider, enthusiastic amateur historian, and occasional escapee from overly formal court dinners. Lucien is happiest talking with craftspeople and harbor crews.",secret:"He has quietly been learning breadmaking from Tomas before sunrise."},
  {icon:"👵",name:"Dowager Queen Amabel",title:"The Queen Mother",text:"Elegant, sharp-witted, and old enough to remember three different versions of nearly every court scandal. She lives in the east wing overlooking the rose terraces.",secret:"She knows why one portrait in the Hall of Monarchs is always covered during winter."},
  {icon:"🧒",name:"Lady Cecily Roseglass",title:"Young Royal Cousin",text:"Curious, energetic, and forever slipping away from tutors to investigate kitchens, towers, stables, and anything marked 'private.'",secret:"She claims there is a room in the castle that only appears on rainy afternoons."},
  {icon:"🦚",name:"Lord Rowan Vale",title:"Royal Steward",text:"Not royal by blood, but part of palace life for decades. Rowan manages ceremonies, household budgets, visiting delegations, and crises nobody else notices.",secret:"He possesses the oldest surviving floor plan of Roseglass Castle."},
  {icon:"📜",name:"House of Roseglass",title:"Family Chronicle",text:"The dynasty began when Lady Seraphine of Rose Hill united three feuding valley towns through marriage alliances, shared markets, and a new charter rather than conquest.",secret:"The original charter granted villagers more rights than later copies recorded."}
];

const jobs = [
  {icon:"🍞",name:"Bakery Assistant",pay:6,place:"Hearth & Honey Bakery",task:"Knead morning dough, glaze honey buns, carry two warm loaves to Lantern Row, and hear the first gossip of the day."},
  {icon:"📚",name:"Archive Clerk",pay:7,place:"Bellflower Abbey",task:"Sort old letters, copy a fragile village record, return maps to the right cabinet, and notice one date written twice."},
  {icon:"🌷",name:"Garden Keeper",pay:6,place:"Queen's Gardens",task:"Trim rose arches, refill bird baths, guide visitors through the maze, and rescue a ribbon tangled in a hedge."},
  {icon:"🐎",name:"Stable Hand",pay:8,place:"Castle Stables",task:"Brush two horses, prepare a carriage team, polish tack, and learn which horse refuses to cross Lantern Bridge after dark."},
  {icon:"🧵",name:"Dressmaker's Helper",pay:7,place:"Silken Thread",task:"Match ribbons to fabrics, pin a festival hem, deliver a parcel to the palace, and help choose buttons for a mysterious midnight coat."},
  {icon:"⚒️",name:"Blacksmith's Apprentice",pay:9,place:"Ember & Iron Forge",task:"Pump the bellows, sort horseshoes, carry repaired hinges to the castle, and watch a tiny silver key take shape."},
  {icon:"🛎️",name:"Harbor Inn Helper",pay:7,place:"Moonharbor",task:"Set tables, carry travel trunks, deliver supper upstairs, and overhear a sailor describing lights beyond the western cliffs."},
  {icon:"🎭",name:"Festival Performer",pay:8,place:"Festival Green",task:"Help set the stage, join a short performance, gather applause ribbons, and share supper with the troupe afterward."}
];

const mailItems = [
  {id:"invite",icon:"💌",from:"Roseglass Palace",title:"Invitation to a Moonlit Supper",body:"You are cordially invited to supper in the small glass conservatory after the evening bells. This is not a formal state dinner. Comfortable finery is encouraged; speeches are not."},
  {id:"bakery",icon:"🥐",from:"Tomas at Hearth & Honey",title:"A Very Important Pastry Emergency",body:"I made too many cinnamon-pear twists again. Please consider this an official request for assistance before Mara tells the entire palace I cannot count trays."},
  {id:"gazette1",icon:"📰",from:"The Roseglass Gazette",title:"Peacock Delays Court Procession",body:"Yesterday's garden procession began twelve minutes late after the palace's oldest peacock planted himself directly in front of the royal carriage and refused every diplomatic solution offered."},
  {id:"notice",icon:"📯",from:"Town Hall",title:"Festival Street Notice",body:"Lantern Row will close to carriage traffic tomorrow evening for dancing, tables, musicians, flower garlands, and one extremely optimistic pie contest."},
  {id:"mysterymail",icon:"✉️",from:"Unsigned",title:"Do You Know What Is Beneath the Fountain?",body:"If you visit Market Square after the last bell, look at the third stone beneath the lion fountain. Do not bring a shovel. You will understand why."},
  {id:"gazette2",icon:"📰",from:"The Roseglass Gazette",title:"Harbor Cat Appointed Unofficial Inspector",body:"A striped cat known locally as Admiral has spent seven mornings inspecting incoming fish baskets. Harbor workers report that his standards are rigorous and his salary remains entirely sardine-based."}
];

const realms = [
  {icon:"🌊",name:"Azuremere",mood:"Sea cliffs & blue-roofed villages",text:"A coastal realm of lighthouse towns, salt gardens, sea caves, musicians, and a palace built along bright white cliffs.",scene:"You arrive by harbor boat as bells echo from the cliff road. Market awnings snap in the ocean wind, and a blue-domed palace watches the bay."},
  {icon:"🏔️",name:"Everfrost Vale",mood:"Mountain halls & winter villages",text:"A high northern valley of stone lodges, snowy passes, hot springs, winter markets, and an old mountain court.",scene:"The road climbs into cold clear air. Warm lanterns shine from timber houses while steam rises from the public spring beside the gate."},
  {icon:"🌻",name:"Goldmeadow",mood:"Farms, fairs & sunny roads",text:"Wide fields, windmills, orchard villages, horse fairs, river picnics, and a modest country manor where the local duchess holds open suppers.",scene:"Sunflowers line the road into town. Someone is tuning a fiddle near the inn, and wagons are gathering for an evening market."},
  {icon:"🌙",name:"Nocturne Hollow",mood:"Moon gardens & old libraries",text:"A quiet twilight realm of observatories, moonflower gardens, black-stone libraries, masked festivals, and scholars of old legends.",scene:"Even before sunset, lanterns glow violet along the streets. The great observatory dome is opening as booksellers light candles outside their stalls."},
  {icon:"🌲",name:"Briarwood March",mood:"Deep forest roads & fortified towns",text:"An ancient woodland borderland with hunting lodges, ranger towers, fortified villages, herbalists, and miles of old road beneath the trees.",scene:"Your carriage enters beneath enormous oaks. Wooden watchtowers rise beyond fern-covered walls, and a ranger lifts a hand in greeting."},
  {icon:"☀️",name:"Solara Court",mood:"Golden plazas & formal court life",text:"A warmer southern kingdom of tiled courtyards, fountains, citrus gardens, brilliant fabrics, diplomats, dancers, and elaborate royal ceremonies.",scene:"The city gates open onto a sunlit plaza full of fountains and orange trees. Palace musicians are rehearsing while courtiers cross the arcade."}
];

const phases = {
  "Morning": {icon:"🌅",desc:"Mist hangs over the river. Bakers open shutters, stable doors swing wide, servants cross palace courtyards, and Market Square slowly wakes.",events:["Buy warm bread before the line forms","Walk the garden while dew still covers the roses","Watch the palace kitchens begin breakfast"]},
  "Afternoon": {icon:"☀️",desc:"The kingdom is busiest now. Shops are open, carts crowd the square, court sessions are underway, and children race along the fountain steps.",events:["Browse the crowded market","Attend an open court session","Take a carriage through the orchard road"]},
  "Evening": {icon:"🌇",desc:"Shopkeepers light lamps and supper smells drift through the lanes. Musicians begin in the square while castle windows turn gold.",events:["Have supper at the Harbor Inn","Join music in Market Square","Walk Lantern Bridge at sunset"]},
  "Night": {icon:"🌙",desc:"Most doors are closed, but the kingdom is not asleep. Guards make rounds, tavern windows glow, stars hang over the towers, and hidden paths feel different.",events:["Walk beneath the castle towers","Listen for the midnight bell","Visit the quiet harbor lanterns"]}
};

function saveDeep(){
  localStorage.setItem("sk_occupation",state.occupation);
  localStorage.setItem("sk_dayphase",state.dayPhase);
  localStorage.setItem("sk_letters_read",JSON.stringify(state.lettersRead));
  localStorage.setItem("sk_realm_visits",JSON.stringify(state.realmVisits));
  localStorage.setItem("sk_bonds",JSON.stringify(state.bonds));
  localStorage.setItem("sk_furnishings",JSON.stringify(state.furnishings));
  localStorage.setItem("sk_event_badges",JSON.stringify(state.grandEventBadges));
  localStorage.setItem("sk_chain_progress",JSON.stringify(state.chainProgress));
}

function renderRoyals(){
  $("#royalGrid").innerHTML=royals.map((r,i)=>`<article class="person-card" data-royal="${i}"><div class="avatar">${r.icon}</div><p class="eyebrow">${r.title}</p><h2>${r.name}</h2><p>${r.text}</p></article>`).join("");
  $$("#royalGrid [data-royal]").forEach(c=>c.onclick=()=>{const r=royals[Number(c.dataset.royal)],box=$("#royalScene");box.classList.remove("hidden");box.innerHTML=`<div class="big-outfit">${r.icon}</div><p class="eyebrow">${r.title}</p><h2>${r.name}</h2><p>${r.text}</p><h3>Whispered court detail</h3><p>${r.secret}</p><div class="scene-actions"><button id="royalJournal" class="secondary-btn">Add to Journal</button></div>`;$("#royalJournal").onclick=()=>{addJournal(`Royal lore — ${r.name}: ${r.secret}`);toast("Royal lore added to your journal.");};box.scrollIntoView({behavior:"smooth",block:"center"});});
}

function renderJobs(){
  $("#jobStatus").innerHTML=`<p class="eyebrow">YOUR CURRENT TRADE</p><h2>${state.occupation||"No occupation chosen"}</h2><p>${state.occupation?"Keep it as long as you like or choose another trade below.":"You can role-play without a job. Choosing one simply unlocks workday scenes and coin earnings."}</p>`;
  $("#jobGrid").innerHTML=jobs.map((j,i)=>`<article class="shop-card" data-job="${i}"><div class="shop-icon">${j.icon}</div><h2>${j.name}</h2><p>${j.place}</p><span class="badge">🪙 ${j.pay} per shift</span></article>`).join("");
  $$("#jobGrid [data-job]").forEach(c=>c.onclick=()=>openJob(Number(c.dataset.job)));
}
function openJob(i){const j=jobs[i],box=$("#jobScene");box.classList.remove("hidden");box.innerHTML=`<p class="eyebrow">${j.place}</p><h2>${j.icon} ${j.name}</h2><p>${j.task}</p><div class="scene-actions"><button id="takeJob" class="primary-btn">Choose This Occupation</button><button id="workShift" class="secondary-btn">Work One Short Shift</button></div><p id="jobResult"></p>`;$("#takeJob").onclick=()=>{state.occupation=j.name;saveDeep();addJournal(`Chose occupation: ${j.name}.`);renderJobs();toast(`${j.name} selected.`);};$("#workShift").onclick=()=>{earnCoins(j.pay);addJournal(`Worked a shift as ${j.name} at ${j.place}.`);$("#jobResult").textContent=`Shift complete. You earn ${j.pay} kingdom coins. ${j.task}`;};box.scrollIntoView({behavior:"smooth",block:"center"});}

function renderLetters(){
  const read=new Set(state.lettersRead);
  $("#mailGrid").innerHTML=mailItems.map((m,i)=>`<article class="story-card" data-mail="${i}"><div class="story-art">${m.icon}</div><p class="eyebrow">${read.has(m.id)?"READ":"NEW"} • ${m.from}</p><h2>${m.title}</h2><p>${read.has(m.id)?"Open again":"Something is waiting inside."}</p></article>`).join("");
  $$("#mailGrid [data-mail]").forEach(c=>c.onclick=()=>openMail(Number(c.dataset.mail)));
}
function openMail(i){const m=mailItems[i],box=$("#mailScene");if(!state.lettersRead.includes(m.id))state.lettersRead.push(m.id);saveDeep();box.classList.remove("hidden");box.innerHTML=`<div class="story-art">${m.icon}</div><p class="eyebrow">FROM ${m.from}</p><h2>${m.title}</h2><p>${m.body}</p><div class="scene-actions"><button id="saveMail" class="secondary-btn">Save Note in Journal</button></div>`;$("#saveMail").onclick=()=>{addJournal(`Mail — ${m.title}: ${m.body}`);toast("Saved to your journal.");};renderLetters();box.scrollIntoView({behavior:"smooth",block:"center"});}

function renderRealms(){
  $("#realmGrid").innerHTML=realms.map((r,i)=>`<article class="place-card" data-realm="${i}"><div class="place-art">${r.icon}</div><h2>${r.name}</h2><strong>${r.mood}</strong><p>${r.text}</p><span class="badge">Visits: ${state.realmVisits[r.name]||0}</span></article>`).join("");
  $$("#realmGrid [data-realm]").forEach(c=>c.onclick=()=>visitRealm(Number(c.dataset.realm)));
}
function visitRealm(i){const r=realms[i],box=$("#realmScene");state.realmVisits[r.name]=(state.realmVisits[r.name]||0)+1;saveDeep();box.classList.remove("hidden");box.innerHTML=`<div class="travel-scene-art">${r.icon} ✨ 🗺️</div><p class="eyebrow">ARRIVED IN ${r.name.toUpperCase()}</p><h2>${r.mood}</h2><p>${r.scene}</p><div class="scene-actions"><button class="choice-btn">Visit the local market</button><button class="choice-btn">Find an inn</button><button class="choice-btn">Walk toward the palace</button><button class="choice-btn">Simply look around</button></div><p id="realmMoment"></p>`;box.querySelectorAll(".choice-btn").forEach(b=>b.onclick=()=>{$("#realmMoment").textContent=`You ${b.textContent.toLowerCase()}. The visit adds another small piece to what you know about ${r.name}.`;addJournal(`${r.name}: ${b.textContent}.`);});addJournal(`Visited neighboring realm: ${r.name}.`);renderRealms();box.scrollIntoView({behavior:"smooth",block:"center"});}

function renderClock(){
  $("#clockChoices").innerHTML=Object.entries(phases).map(([name,p])=>`<article class="cozy-card ${state.dayPhase===name?'selected':''}" data-phase="${name}"><div class="cozy-art">${p.icon}</div><h2>${name}</h2><p>${p.desc}</p></article>`).join("");
  $$("#clockChoices [data-phase]").forEach(c=>c.onclick=()=>{state.dayPhase=c.dataset.phase;saveDeep();renderClock();addJournal(`Set the kingdom atmosphere to ${state.dayPhase}.`);});
  const p=phases[state.dayPhase];$("#clockScene").innerHTML=`<div class="cozy-art">${p.icon} 🏰 ✨</div><p class="eyebrow">${state.dayPhase.toUpperCase()} IN STORYBOOK KINGDOM</p><h2>${p.desc}</h2><div class="scene-actions">${p.events.map(e=>`<button class="choice-btn">${e}</button>`).join("")}</div><p id="clockResult"></p>`;$("#clockScene").querySelectorAll(".choice-btn").forEach(b=>b.onclick=()=>{$("#clockResult").textContent=`You choose to ${b.textContent.toLowerCase()}. There is no timer and nowhere else you need to be.`;addJournal(`${state.dayPhase}: ${b.textContent}.`);});
}


// ===== V4: SOCIAL LIFE, PROPERTY, TOWN SERVICES, GRAND EVENTS & LIVING STORYLINES =====
const companions = [
  {icon:"🎻",name:"Celeste Vale",role:"Traveling violinist",vibe:"Warm, adventurous, observant",outing:"Walk the lantern bridge after her evening performance."},
  {icon:"📚",name:"Archivist Elin",role:"Royal archivist",vibe:"Quiet, witty, curious",outing:"Share tea among the abbey archives while rain taps the windows."},
  {icon:"⚓",name:"Captain Joren",role:"Harbor captain",vibe:"Steady, humorous, well-traveled",outing:"Take a sunset harbor sail and trade stories about distant ports."},
  {icon:"🌷",name:"Mina Bell",role:"Florist",vibe:"Bright, practical, kind",outing:"Help choose flowers for a village wedding and wander the gardens afterward."},
  {icon:"🛡️",name:"Sir Rowan",role:"Castle guard",vibe:"Loyal, thoughtful, protective",outing:"Walk the quiet battlements after the final gate check."},
  {icon:"🎭",name:"Avery Quill",role:"Playwright",vibe:"Funny, dramatic, imaginative",outing:"Attend a rehearsal at the little town theatre and choose the ending of a scene."}
];

const furniture = [
  ["🛏️","Carved Canopy Bed",18],["📚","Tall Storybook Shelf",12],["🕯️","Brass Lantern Set",7],["🌹","Rose Window Box",5],
  ["🪞","Gilded Standing Mirror",14],["🧶","Woven Hearth Rug",9],["🖼️","Moonharbor Painting",11],["🫖","Tea Table & Two Chairs",13],
  ["🔥","Copper Hearth Screen",10],["🎼","Small Music Stand",8],["🌿","Herb Drying Rack",6],["🧰","Traveler's Writing Desk",15]
];

const townServices = [
  {icon:"🍲",name:"The Crown & Kettle Tavern",text:"Warm stew, music, darts, travelers, rumors, and a corner table near the fire.",actions:["Order supper","Hear a rumor","Join a table game","Listen to the fiddler"]},
  {icon:"🛎️",name:"Moonharbor Inn",text:"A three-story inn overlooking the docks with guest rooms, a parlor, and an owner who remembers everybody.",actions:["Book a room","Read the guestbook","Sit in the parlor","Ask about travelers"]},
  {icon:"🐴",name:"Rosegate Stables",text:"Brush horses, choose a mount, help with tack, or take a quiet country ride.",actions:["Brush a horse","Choose a trail ride","Help in the stable","Name a favorite horse"]},
  {icon:"🔨",name:"Brindle's Blacksmith",text:"The forge rings from morning to dusk. Tools, horseshoes, hinges, locks, and ceremonial metalwork are made here.",actions:["Watch the forge","Order a keepsake","Help sort tools","Ask about an unusual lock"]},
  {icon:"👗",name:"Madame Liora's Dressmaking Rooms",text:"Silks, wool, ribbons, court clothes, village clothes, masks, gloves, and festival costumes.",actions:["Plan an outfit","Choose fabric","Try on a mask","Ask about court fashion"]},
  {icon:"🌿",name:"Juniper Apothecary",text:"Herbs hang from ceiling beams while jars of teas, soaps, salves, and fragrant sachets line the shelves.",actions:["Blend a tea","Buy a sachet","Learn an herb","Chat with Juniper"]},
  {icon:"🏫",name:"Bell Street Schoolhouse",text:"A bright one-room schoolhouse for letters, numbers, maps, music, and town history.",actions:["Visit a lesson","Read the old map","Help with story hour","Ring the hand bell"]},
  {icon:"🛁",name:"The Lavender Bathhouse",text:"Warm mineral baths, tiled pools, towels, candles, and a quiet courtyard for resting.",actions:["Take a warm soak","Sit in the courtyard","Choose lavender soap","Have tea afterward"]}
];

const grandEvents = [
  {icon:"🎭",name:"The Roseglass Masquerade",badge:"Silver Mask",intro:"Masks, candlelight, hidden identities, orchestra music, balcony conversations, and one guest nobody recognizes.",choices:["Dance beneath the chandeliers","Follow the unknown silver mask","Visit the moonlit balcony","Join the midnight supper"]},
  {icon:"🏇",name:"The Autumn Tournament",badge:"Tournament Ribbon",intro:"Riders, archery targets, mock swordplay, cheering villagers, food tents, and decorated horses fill the field.",choices:["Watch the joust","Try festival archery","Visit the horse tents","Cheer for the village team"]},
  {icon:"💍",name:"A Royal Wedding Day",badge:"Wedding Favor",intro:"Church bells ring across town while balconies fill with flowers and the entire route to the castle becomes a celebration.",choices:["Watch the procession","Help decorate the square","Attend the feast","Dance at the evening celebration"]},
  {icon:"❄️",name:"Winter Star Holiday",badge:"Crystal Star",intro:"Snow, lanterns, hot cider, choir songs, gift stalls, skating, and a huge star above the castle gate.",choices:["Go skating","Drink hot cider","Visit the gift market","Hear the castle choir"]},
  {icon:"👑",name:"Coronation Jubilee",badge:"Golden Crest",intro:"Banners cover every street while the court opens the castle grounds for music, speeches, food, and historic ceremonies.",choices:["Enter the great hall","Watch the balcony ceremony","Tour the royal exhibits","Join the town feast"]},
  {icon:"🌾",name:"Village Harvest Homecoming",badge:"Harvest Garland",intro:"Tables stretch across Market Square with pies, preserves, music, games, family reunions, and baskets of autumn flowers.",choices:["Judge the pie table","Join the folk dance","Make a harvest wreath","Sit with the storytellers"]}
];

const livingChains = [
  {id:"hiddenheir",icon:"👑",title:"The Portrait Behind the Wall",chapters:[
    "Renovation workers uncover a painted eye behind loose plaster in the east gallery. The hidden portrait bears a royal crest nobody recognizes.",
    "The abbey records mention a child removed from the official family tree after a succession dispute nearly two centuries ago.",
    "A letter inside the portrait frame suggests the missing branch of the family did not disappear—they settled quietly in Lantern Row.",
    "An elderly resident produces a locket with the same crest. The question is no longer whether the story is true, but what the kingdom should do with the truth.",
    "The court chooses to restore the forgotten names to the public family record. No throne changes hands; history simply becomes more complete."
  ]},
  {id:"winterroad",icon:"🛷",title:"The Road That Appears in Snow",chapters:[
    "After the first heavy snow, a narrow road appears beyond the orchard where no road exists in summer.",
    "Tracks along it belong to a small sleigh, but they begin in the middle of an empty field.",
    "The road leads to an abandoned winter lodge containing fresh firewood and a guestbook signed every ten years.",
    "One signature belongs to Queen Elowen's grandmother, dated long after everyone believed the lodge had been closed.",
    "The lodge is reopened as a winter refuge for travelers, and the mysterious snow road becomes a beloved seasonal tradition."
  ]},
  {id:"festivalletters",icon:"💌",title:"Seven Letters Before the Ball",chapters:[
    "A sealed invitation arrives with no sender: 'Before the masquerade, seven truths must be delivered to seven people.'",
    "The first letters repair a friendship between two merchants and reveal an old apology hidden for years.",
    "The fourth letter warns the palace musician that someone plans to sabotage the midnight performance.",
    "The sixth letter is addressed to you. It says the sender has been watching how carefully you handled everyone else's secrets.",
    "At the ball, the sender reveals herself as a retired court messenger testing whether the kingdom still has someone trustworthy enough to carry difficult truths."
  ]}
];

function renderCourtship(){
  $("#companionGrid").innerHTML=companions.map((c,i)=>{const b=state.bonds[c.name]||0;return `<article class="person-card" data-companion="${i}"><div class="avatar">${c.icon}</div><p class="eyebrow">${c.role}</p><h2>${c.name}</h2><p>${c.vibe}</p><span class="badge">Bond ${b}/5</span></article>`}).join("");
  $$("#companionGrid [data-companion]").forEach(el=>el.onclick=()=>openCompanion(Number(el.dataset.companion)));
}
function openCompanion(i){
  const c=companions[i],b=state.bonds[c.name]||0,box=$("#companionScene");box.classList.remove("hidden");
  box.innerHTML=`<div class="big-outfit">${c.icon}</div><p class="eyebrow">${c.role}</p><h2>${c.name}</h2><p>${c.outing}</p><p><strong>Current bond:</strong> ${b}/5</p><div class="scene-actions"><button id="friendVisit" class="secondary-btn">Friendly Visit</button><button id="closerVisit" class="primary-btn">Spend More Time Together</button><button id="letterVisit" class="choice-btn">Exchange a Letter</button></div><p id="bondResult"></p>`;
  const grow=(amt,label)=>{state.bonds[c.name]=Math.min(5,(state.bonds[c.name]||0)+amt);saveDeep();addJournal(`${label} with ${c.name}. Bond is now ${state.bonds[c.name]}/5.`);$("#bondResult").textContent=`A good visit. Your bond with ${c.name} is now ${state.bonds[c.name]}/5. You decide what that relationship means.`;renderCourtship();};
  $("#friendVisit").onclick=()=>grow(1,"Shared a friendly visit");$("#closerVisit").onclick=()=>grow(1,"Spent meaningful time");$("#letterVisit").onclick=()=>grow(1,"Exchanged a letter");box.scrollIntoView({behavior:"smooth",block:"center"});
}

function renderProperty(){
  $("#propertyStatus").innerHTML=`<p class="eyebrow">${state.home.toUpperCase()}</p><h2>Your Furnishings: ${state.furnishings.length}</h2><p>${state.furnishings.join(" • ")||"Your rooms are still empty."}</p><p><strong>Wallet:</strong> 🪙 ${state.coins}</p>`;
  $("#furnitureGrid").innerHTML=furniture.map((f,i)=>`<article class="shop-card" data-furniture="${i}"><div class="shop-icon">${f[0]}</div><h2>${f[1]}</h2><span class="badge">🪙 ${f[2]}</span><p>${state.furnishings.includes(f[1])?"Already in your collection":"Add it to any home you choose."}</p></article>`).join("");
  $$("#furnitureGrid [data-furniture]").forEach(el=>el.onclick=()=>{const f=furniture[Number(el.dataset.furniture)];if(state.furnishings.includes(f[1]))return toast("You already own that furnishing.");if(state.coins<f[2])return toast("You need a few more kingdom coins.");state.coins-=f[2];state.furnishings.push(f[1]);saveDeep();addJournal(`Added ${f[1]} to the home collection.`);renderProperty();toast(`${f[1]} added to your home.`);});
  const box=$("#propertyScene");box.classList.remove("hidden");box.innerHTML=`<h2>🏡 A Room in ${state.home}</h2><p>You arrange the things you have collected. Nothing has a required placement; imagine the room exactly the way you want it.</p><div class="scene-actions"><button class="choice-btn">Read by the hearth</button><button class="choice-btn">Set the table for tea</button><button class="choice-btn">Rearrange the room</button><button class="choice-btn">Open the windows</button></div>`;
}

function renderTownServices(){
  $("#serviceGrid").innerHTML=townServices.map((s,i)=>`<article class="place-card" data-service="${i}"><div class="place-art">${s.icon}</div><h2>${s.name}</h2><p>${s.text}</p></article>`).join("");
  $$("#serviceGrid [data-service]").forEach(el=>el.onclick=()=>{const s=townServices[Number(el.dataset.service)],box=$("#serviceScene");box.classList.remove("hidden");box.innerHTML=`<div class="place-art">${s.icon}</div><h2>${s.name}</h2><p>${s.text}</p><div class="scene-actions">${s.actions.map(a=>`<button class="choice-btn">${a}</button>`).join("")}</div><p id="serviceResult"></p>`;box.querySelectorAll(".choice-btn").forEach(b=>b.onclick=()=>{$("#serviceResult").textContent=`You choose to ${b.textContent.toLowerCase()}. It becomes one more ordinary little memory from town.`;addJournal(`${s.name}: ${b.textContent}.`);});box.scrollIntoView({behavior:"smooth",block:"center"});});
}

function renderGrandEvents(){
  $("#grandEventGrid").innerHTML=grandEvents.map((e,i)=>`<article class="festival-card" data-grand="${i}"><div class="festival-icon">${e.icon}</div><h2>${e.name}</h2><p>${e.intro}</p><span class="badge">Keepsake: ${e.badge}</span></article>`).join("");
  $$("#grandEventGrid [data-grand]").forEach(el=>el.onclick=()=>{const e=grandEvents[Number(el.dataset.grand)],box=$("#grandEventScene");box.classList.remove("hidden");box.innerHTML=`<div class="travel-scene-art">${e.icon} ✨ 🎺</div><p class="eyebrow">SPECIAL EVENT</p><h2>${e.name}</h2><p>${e.intro}</p><div class="scene-actions">${e.choices.map(c=>`<button class="choice-btn">${c}</button>`).join("")}</div><p id="grandResult"></p>`;box.querySelectorAll(".choice-btn").forEach(b=>b.onclick=()=>{if(!state.grandEventBadges.includes(e.badge))state.grandEventBadges.push(e.badge);saveDeep();$("#grandResult").textContent=`You ${b.textContent.toLowerCase()}. Before you leave, you receive a ${e.badge}.`;addJournal(`${e.name}: ${b.textContent}. Keepsake earned: ${e.badge}.`);});box.scrollIntoView({behavior:"smooth",block:"center"});});
}

function renderEventChains(){
  $("#chainGrid").innerHTML=livingChains.map((s,i)=>{const p=state.chainProgress[s.id]||0;return `<article class="story-card" data-chain="${i}"><div class="story-art">${s.icon}</div><p class="eyebrow">CHAPTER ${Math.min(p+1,s.chapters.length)} OF ${s.chapters.length}</p><h2>${s.title}</h2><p>${p>=s.chapters.length?"Story complete — replay or revisit the ending.":"Continue this living storyline."}</p></article>`}).join("");
  $$("#chainGrid [data-chain]").forEach(el=>el.onclick=()=>openChain(Number(el.dataset.chain)));
}
function openChain(i){
  const s=livingChains[i],p=state.chainProgress[s.id]||0,idx=Math.min(p,s.chapters.length-1),box=$("#chainScene"),done=p>=s.chapters.length;
  box.classList.remove("hidden");box.innerHTML=`<div class="story-art">${s.icon}</div><p class="eyebrow">${done?"COMPLETED STORY":"CHAPTER "+(idx+1)}</p><h2>${s.title}</h2><p class="big-riddle" style="font-size:1.45rem">${s.chapters[idx]}</p><div class="scene-actions">${done?`<button id="resetChain" class="secondary-btn">Replay from Chapter 1</button>`:`<button id="continueChain" class="primary-btn">Continue the Story</button><button class="secondary-btn" data-view="life">Leave It Here for Now</button>`}</div><p class="story-note">Your place is saved automatically.</p>`;
  if(done)$("#resetChain").onclick=()=>{state.chainProgress[s.id]=0;saveDeep();renderEventChains();openChain(i);};
  else $("#continueChain").onclick=()=>{state.chainProgress[s.id]=p+1;saveDeep();addJournal(`${s.title}: completed chapter ${idx+1}.`);renderEventChains();if(p+1>=s.chapters.length){toast("Storyline completed.");openChain(i);}else openChain(i);};
  box.scrollIntoView({behavior:"smooth",block:"center"});
}


// V5 — return-anytime world systems
const weatherModes = [
  {icon:"🌸",name:"Spring Morning",desc:"Fresh rain beads on rose leaves while carts begin rolling into Market Square.",ideas:["Walk the gardens","Visit the flower stalls","Open the cottage windows"]},
  {icon:"☀️",name:"Summer Sunshine",desc:"The whole kingdom seems outdoors. Musicians gather near the fountain and children race along Lantern Row.",ideas:["Picnic on Festival Green","Ride to Moonharbor","Visit the fair booths"]},
  {icon:"🍂",name:"Autumn Wind",desc:"Copper leaves spin across the lanes and every bakery smells like spice, apples, and warm bread.",ideas:["Browse the harvest market","Take a carriage ride","Sit at the inn hearth"]},
  {icon:"❄️",name:"Winter Snow",desc:"Snow softens every roofline. Castle windows glow gold above quiet streets and sleigh bells pass after dark.",ideas:["Drink something warm","Visit the winter market","Watch snow from home"]},
  {icon:"🌧️",name:"Rainy Afternoon",desc:"Rain drums on awnings and stone. Shops stay lively while the streets turn silver and reflective.",ideas:["Read at the bakery","Visit the archives","Stay home for tea"]},
  {icon:"🌫️",name:"Misty Dawn",desc:"Fog curls around the castle hill. Bells sound farther away than usual, and ordinary roads feel slightly mysterious.",ideas:["Walk to the abbey","Investigate the old gate","Follow lanterns through town"]},
  {icon:"⛈️",name:"Royal Storm",desc:"Thunder rolls beyond the towers while shutters close and the castle staff rush to secure the galleries.",ideas:["Shelter in the Great Hall","Help secure the market","Listen to storm stories"]},
  {icon:"🌙",name:"Clear Evening",desc:"The sky is dark blue, windows glow across town, and lanterns draw warm paths between the castle and village.",ideas:["Cross Lantern Bridge","Attend evening court","Take a moonlit carriage"]}
];

const householdMoments = [
  ["🌅","Begin the Morning","Open the curtains, choose breakfast, and decide whether the day starts quietly or with visitors.","Kindness"],
  ["🥧","Prepare a Meal","Use whatever is in the pantry and imagine a simple household meal for yourself or guests.","Kindness"],
  ["🫖","Host Tea","Invite a familiar kingdom character or enjoy the table alone with a book.","Festive Spirit"],
  ["🌿","Tend the Garden","Water herbs, gather flowers, sweep the path, or let the garden grow a little wild.","Kindness"],
  ["✉️","Write Letters","Send a note to a friend, royal, shopkeeper, traveler, or neighboring realm.","Scholarship"],
  ["📖","Read by the Fire","Choose history, fairy tales, old mysteries, poetry, or town gossip from the shelf.","Scholarship"],
  ["🕯️","Receive an Evening Caller","A neighbor, messenger, courtier, or unexpected traveler stops by.","Mystery"],
  ["🌙","Close the House for Night","Bank the fire, check the locks, dim the lamps, and end the day with no unfinished obligation.","Courage"]
];

const kingdomDays = [
  ["Market Day","🧺","Extra stalls fill Market Square, including a bookseller and a ribbon merchant."],
  ["Quiet Court Day","⚜️","Only a few petitions are heard. The palace corridors are unusually calm."],
  ["Village Baking Day","🍞","Ovens glow all along Lantern Row and neighbors trade recipes."],
  ["Harbor Arrival Day","⚓","Three ships arrive before noon with travelers, letters, musicians, and cargo."],
  ["Garden Open Day","🌷","The Queen's Gardens open every gate and musicians perform beside the lily pond."],
  ["Story Night","📚","Old stories are told in the inn, bakery, cottages, and palace nursery after sunset."],
  ["Royal Audience","👑","The throne room opens for public petitions and ceremonial visitors."],
  ["Craft Fair","🧵","Dressmakers, woodworkers, painters, toy makers, and jewelers display their work."],
  ["Abbey Bell Day","🔔","Bellflower Abbey opens its old tower and archive gallery to visitors."],
  ["Moonharbor Supper","🐟","Long outdoor tables line the harbor as cooks prepare a community supper."],
  ["Lantern Walk","🏮","After dusk, residents carry lanterns from the village to the castle gardens."],
  ["Free Day","✨","Nothing official is scheduled. Wander, rest, role-play, shop, read, or invent your own day."]
];

const extraCases = [
  {id:"bell",icon:"🔔",title:"The Bellflower Bell at Midnight",intro:"The abbey bell rings once at midnight even though the rope is locked away and no one is in the tower.",clues:["A patch of candle soot beneath the stair","A maintenance ledger with one missing page","Tiny brass filings near the bell mechanism","A witness who heard footsteps below, not above"],suspects:["The novice bell keeper","A traveling clock repairer","Archivist Elin","No person at all"],answer:1,solution:"The traveling clock repairer had repaired an old automatic striking device and failed to tell the abbey it would trigger at midnight. The mystery was mechanical, not supernatural."},
  {id:"letters",icon:"💌",title:"The Anonymous Letters of Lantern Row",intro:"Seven neighbors receive kind but oddly specific anonymous letters predicting small events before they happen.",clues:["All letters use paper sold only at one book cart","The handwriting changes slightly from note to note","Every prediction involves public information","One envelope smells faintly of cinnamon"],suspects:["Tomas the baker","Mina the florist","Pip the errand runner","A palace clerk"],answer:2,solution:"Pip overheard errands all over town and turned harmless bits of information into dramatic predictions. The letters were meant as entertainment, not threats."},
  {id:"portrait",icon:"🖼️",title:"The Portrait That Changed Rooms",intro:"A small portrait appears in three different castle rooms over three nights, yet every room was locked.",clues:["Fresh dust outlines a narrow wall panel","The portrait frame has a servants' inventory mark","Old floor plans show connected service passages","A maid remembers the portrait being requested for restoration"],suspects:["Mara the palace maid","The royal restorer","Prince Lucien","A secret admirer"],answer:1,solution:"The royal restorer moved the portrait through old service passages while testing where its repaired varnish looked best in different light."}
];

const routines = [
  {icon:"🏰",name:"A Castle Morning",steps:["Hear the kitchen bells before sunrise.","Walk through the servants' corridor as breakfast trays move upstairs.","Pause in the gallery while the household wakes.","Choose whether to visit court, the library, or the gardens."]},
  {icon:"🏘️",name:"A Village Afternoon",steps:["Leave home after lunch and greet neighbors on Lantern Row.","Stop at the well where three conversations are happening at once.","Browse the market and watch a street performer.","End with a bakery table or a walk home through the cottages."]},
  {icon:"⚓",name:"An Evening at Moonharbor",steps:["Watch the last cargo carts leave the pier.","Read the arrival board outside the harbor office.","Eat supper near the water while musicians begin playing.","Walk the lantern-lit pier before heading home."]},
  {icon:"⛪",name:"A Quiet Abbey Day",steps:["Arrive as the morning bells finish.","Read an old chronicle in the archive room.","Walk the cloister garden after midday.","Leave before dusk with one new historical curiosity."]},
  {icon:"🎪",name:"Festival Green from Noon to Night",steps:["Arrive while booths are still opening.","Play one game or simply watch the crowd.","Stay for music and food as lanterns are lit.","Leave whenever the evening feels complete."]},
  {icon:"🌲",name:"A Whisperwood Excursion",steps:["Take the marked path beyond the orchard.","Cross the moss bridge and listen for birds.","Choose one side trail but mark your return route.","Reach town again before or after sunset—the choice is yours."]}
];

function saveV5(){
  localStorage.setItem("sk_weather",state.weather);
  localStorage.setItem("sk_reputation",JSON.stringify(state.reputation));
  localStorage.setItem("sk_kingdom_day",state.kingdomDay);
  localStorage.setItem("sk_household_memories",JSON.stringify(state.householdMemories));
  localStorage.setItem("sk_case_progress",JSON.stringify(state.caseProgress));
}
function bumpRep(kind,amt=1){ state.reputation[kind]=(state.reputation[kind]||0)+amt; saveV5(); }

function renderSeasons(){
  $("#weatherGrid").innerHTML=weatherModes.map((w,i)=>`<article class="weather-card ${state.weather===w.name?'selected':''}" data-weather="${i}"><div class="weather-icon">${w.icon}</div><h2>${w.name}</h2><p>${w.desc}</p></article>`).join("");
  $$("#weatherGrid [data-weather]").forEach(el=>el.onclick=()=>{state.weather=weatherModes[Number(el.dataset.weather)].name;saveV5();addJournal(`Changed the kingdom atmosphere to ${state.weather}.`);renderSeasons();});
  const w=weatherModes.find(x=>x.name===state.weather)||weatherModes[7];
  $("#weatherScene").innerHTML=`<div class="weather-hero">${w.icon}</div><p class="eyebrow">CURRENT KINGDOM WEATHER</p><h2>${w.name}</h2><p>${w.desc}</p><div class="scene-actions">${w.ideas.map(x=>`<button class="choice-btn">${x}</button>`).join("")}</div><p id="weatherMoment"></p>`;
  $$("#weatherScene .choice-btn").forEach(b=>b.onclick=()=>{$("#weatherMoment").textContent=`You decide to ${b.textContent.toLowerCase()}. The ${w.name.toLowerCase()} gives the whole moment its own atmosphere.`;addJournal(`${w.name}: ${b.textContent}.`);});
}

function renderHousehold(){
  $("#householdStatus").innerHTML=`<p class="eyebrow">${state.home.toUpperCase()}</p><h2>Home Today</h2><p><strong>Weather:</strong> ${state.weather} &nbsp; • &nbsp; <strong>Outfit:</strong> ${state.outfit}</p><p>${state.householdMemories.length} household moments saved.</p>`;
  $("#householdGrid").innerHTML=householdMoments.map((m,i)=>`<article class="routine-card" data-home-moment="${i}"><div class="routine-icon">${m[0]}</div><h2>${m[1]}</h2><p>${m[2]}</p></article>`).join("");
  $$("#householdGrid [data-home-moment]").forEach(el=>el.onclick=()=>{const m=householdMoments[Number(el.dataset.homeMoment)],box=$("#householdScene");box.classList.remove("hidden");box.innerHTML=`<div class="routine-icon">${m[0]}</div><h2>${m[1]}</h2><p>${m[2]}</p><p>The moment unfolds in ${state.home} while the kingdom outside is experiencing <strong>${state.weather}</strong>.</p><button id="saveHouseMoment" class="primary-btn">Live This Moment</button><p id="houseResult"></p>`;$("#saveHouseMoment").onclick=()=>{state.householdMemories.unshift(`${m[1]} at ${state.home}`);state.householdMemories=state.householdMemories.slice(0,20);bumpRep(m[3]);saveV5();addJournal(`${m[1]} at ${state.home}.`);$("#houseResult").textContent="Added to your household memories. Nothing else is required.";renderHousehold();};box.scrollIntoView({behavior:"smooth",block:"center"});});
}

function renderReputation(){
  const max=Math.max(...Object.values(state.reputation),1);
  $("#reputationBoard").innerHTML=Object.entries(state.reputation).map(([k,v])=>`<div class="rep-card"><h2>${k}</h2><div class="rep-meter"><span style="width:${Math.max(8,v/max*100)}%"></span></div><p>${v} remembered moments</p></div>`).join("");
  const top=Object.entries(state.reputation).sort((a,b)=>b[1]-a[1])[0][0];
  const rumors={Kindness:"People say you rarely pass a small problem without helping somehow.",Mystery:"Some villagers think you know more secret doors than you admit.",Scholarship:"The booksellers and archivists have started setting interesting things aside for you.",Courage:"Guards tell stories about how calmly you walk toward strange situations.","Festive Spirit":"If music starts in the square, someone usually expects you to appear eventually."};
  $("#rumorBoard").innerHTML=`<p class="eyebrow">WHAT PEOPLE ARE SAYING</p><h2>Your strongest current reputation: ${top}</h2><p class="dialogue">“${rumors[top]}”</p><p>Reputation only changes story flavor. It never locks you into a personality or closes activities.</p>`;
}

function renderCalendar(){
  const day=((state.kingdomDay-1)%kingdomDays.length)+1, info=kingdomDays[day-1];
  $("#calendarStatus").innerHTML=`<p class="eyebrow">STORY MONTH • DAY ${day}</p><div class="calendar-today"><span>${info[1]}</span><div><h2>${info[0]}</h2><p>${info[2]}</p></div></div><div class="scene-actions"><button id="nextKingdomDay" class="primary-btn">Turn to the Next Day</button><button id="resetKingdomMonth" class="secondary-btn">Return to Day 1</button></div>`;
  $("#calendarGrid").innerHTML=kingdomDays.map((d,i)=>`<article class="day-card ${i+1===day?'today':''}"><span>${d[1]}</span><strong>Day ${i+1}</strong><h3>${d[0]}</h3><p>${d[2]}</p></article>`).join("");
  $("#nextKingdomDay").onclick=()=>{state.kingdomDay=day===kingdomDays.length?1:day+1;saveV5();addJournal(`Turned the Kingdom Calendar to Day ${state.kingdomDay}: ${kingdomDays[state.kingdomDay-1][0]}.`);renderCalendar();};
  $("#resetKingdomMonth").onclick=()=>{state.kingdomDay=1;saveV5();renderCalendar();};
}

function renderCases(){
  $("#caseGrid").innerHTML=extraCases.map((c,i)=>{const p=state.caseProgress[c.id]||{seen:[],solved:false};return `<article class="story-card" data-case="${i}"><div class="story-art">${c.icon}</div><p class="eyebrow">${p.solved?'CASE SOLVED':`${p.seen.length}/${c.clues.length} CLUES`}</p><h2>${c.title}</h2><p>${c.intro}</p></article>`}).join("");
  $$("#caseGrid [data-case]").forEach(el=>el.onclick=()=>openExtraCase(Number(el.dataset.case)));
}
function openExtraCase(i){
  const c=extraCases[i], p=state.caseProgress[c.id]||{seen:[],solved:false}, box=$("#caseScene"); state.caseProgress[c.id]=p; box.classList.remove("hidden");
  box.innerHTML=`<div class="story-art">${c.icon}</div><p class="eyebrow">CASE FILE</p><h2>${c.title}</h2><p>${c.intro}</p><div class="case-clues">${c.clues.map((x,n)=>`<button class="clue-button ${p.seen.includes(n)?'examined':''}" data-case-clue="${n}">${p.seen.includes(n)?'✓ ':''}Clue ${n+1}: ${p.seen.includes(n)?x:'Inspect evidence'}</button>`).join("")}</div>${p.seen.length===c.clues.length?`<h3>Make a deduction</h3><div class="choice-row">${c.suspects.map((s,n)=>`<button class="choice-btn" data-case-answer="${n}">${s}</button>`).join("")}</div>`:''}<p id="caseResult">${p.solved?c.solution:''}</p><button id="resetExtraCase" class="secondary-btn small">Reset This Case</button>`;
  box.querySelectorAll('[data-case-clue]').forEach(b=>b.onclick=()=>{const n=Number(b.dataset.caseClue);if(!p.seen.includes(n))p.seen.push(n);saveV5();openExtraCase(i);});
  box.querySelectorAll('[data-case-answer]').forEach(b=>b.onclick=()=>{const n=Number(b.dataset.caseAnswer);if(n===c.answer){p.solved=true;bumpRep("Mystery");$("#caseResult").textContent=`Solved. ${c.solution}`;addJournal(`Solved case: ${c.title}.`);}else $("#caseResult").textContent="That explanation does not fit every clue yet. Try another deduction.";saveV5();renderCases();});
  $("#resetExtraCase").onclick=()=>{state.caseProgress[c.id]={seen:[],solved:false};saveV5();renderCases();openExtraCase(i);}; box.scrollIntoView({behavior:"smooth",block:"center"});
}

function renderRoutines(){
  $("#routineGrid").innerHTML=routines.map((r,i)=>`<article class="routine-card" data-routine="${i}"><div class="routine-icon">${r.icon}</div><h2>${r.name}</h2><p>${r.steps[0]} Then follow the day at your own pace.</p></article>`).join("");
  $$("#routineGrid [data-routine]").forEach(el=>el.onclick=()=>openRoutine(Number(el.dataset.routine)));
}
function openRoutine(i){
  const r=routines[i],box=$("#routineScene"); box.classList.remove("hidden");
  box.innerHTML=`<div class="routine-icon">${r.icon}</div><h2>${r.name}</h2><ol class="routine-steps">${r.steps.map(x=>`<li>${x}</li>`).join("")}</ol><p><strong>Current weather:</strong> ${state.weather}</p><div class="scene-actions"><button id="completeRoutine" class="primary-btn">Live This Routine</button><button class="secondary-btn" data-view="life">Leave It Open-Ended</button></div><p id="routineResult"></p>`;
  $("#completeRoutine").onclick=()=>{bumpRep(r.name.includes("Abbey")?"Scholarship":r.name.includes("Whisper")?"Courage":"Kindness");$("#routineResult").textContent="The routine becomes one complete little day in your Storybook Kingdom life.";addJournal(`Lived routine: ${r.name}.`);};box.scrollIntoView({behavior:"smooth",block:"center"});
}


// V6 — Living Story Expansion
const castleRooms = [
  ["🍲","Royal Kitchens","Copper pots, pastry tables, pantry doors, scullery stairs, and constant harmless gossip.",["Taste the soup","Help ice a cake","Listen near the pantry","Carry a tray upstairs"]],
  ["💃","Grand Ballroom","Mirrors, chandeliers, musicians’ gallery, polished floors, and doors opening onto a moonlit terrace.",["Practice a dance","Inspect the musicians’ gallery","Step onto the terrace","Look behind the curtains"]],
  ["👑","Throne Room","Banners, carved chairs, petition tables, ceremonial doors, and a raised dais used on formal days.",["Watch court assemble","Study the old banners","Sit in the public gallery","Speak with an attendant"]],
  ["📚","Royal Library","Ladders, atlases, fairy tales, family records, maps, locked cabinets, and warm reading lamps.",["Read a legend","Open an atlas","Ask for family history","Browse the locked-cabinet index"]],
  ["🕯️","Servants’ Corridors","Narrow passages behind the public rooms, linen closets, bell pulls, stairs, and countless shortcuts.",["Follow the bell wires","Visit the linen room","Find a shortcut","Listen to corridor gossip"]],
  ["🌙","West Tower","A winding stair leads to old guest rooms, a clock chamber, and a balcony above the sleeping town.",["Climb to the clock","Look over the town","Enter the old guest room","Watch the sunset"]],
  ["🌹","Guest Wing","Quiet suites for ambassadors, visiting relatives, performers, scholars, and unexpected royal guests.",["Read the guest book","Visit the sitting room","Inspect a sealed suite","Arrange flowers"]],
  ["⛪","Castle Chapel","A small peaceful chapel with memorial plaques, stained glass, candles, and records of royal weddings.",["Read a memorial plaque","Sit quietly","Study the wedding register","Look at the stained glass"]],
  ["🧸","Old Nursery","Toy chests, faded murals, tiny furniture, storybooks, and initials carved beneath a window seat.",["Open the toy chest","Read an old storybook","Inspect the initials","Sit in the window seat"]],
  ["🗝️","Hidden Passage Network","A growing map of concealed doors, forgotten stairs, narrow bridges, and sealed wall panels.",["Follow a draft","Test a wall panel","Mark a new passage","Return before anyone notices"]]
];

const storybookLibrary = [
  {title:"The Lantern Bridge Legend",icon:"🏮",type:"Legend",text:"Long ago, villagers placed lanterns along the river so a lost royal child could find the road home. The child returned, and the annual Lantern Walk remained long after the true details became impossible to separate from the tale."},
  {title:"Roseglass Castle Guide",icon:"🏰",type:"Guide",text:"A handwritten visitor’s guide describes public halls, towers, gardens, service stairs, old renovations, and several rooms whose names have changed across generations."},
  {title:"Hearth & Honey Recipe Book",icon:"🥧",type:"Household Book",text:"Tomas’s collection includes honey rolls, orchard pie, winter spice cakes, festival buns, broth, tea cakes, and margins full of comments from three generations of bakers."},
  {title:"Songs from Moonharbor",icon:"🎻",type:"Songbook",text:"Sailors, innkeepers, and musicians contributed songs about departures, reunions, storms, summer nights, and ridiculous arguments over fishing boats."},
  {title:"The Queen Who Walked to Market",icon:"👑",type:"Fairy Tale",text:"An old tale tells of a queen who disguised herself as an ordinary shopper and discovered that a kingdom looks very different when no one knows your title."},
  {title:"Whisperwood Field Notes",icon:"🌲",type:"Nature & Lore",text:"Generations of herbalists recorded mushrooms, birds, streams, harmless superstitions, lost footpaths, blue lights, and which stories should never be mistaken for facts."},
  {title:"The Seven Winter Letters",icon:"💌",type:"Romance & Mystery",text:"Seven letters are delivered across one winter to seven different homes. Each seems unconnected until the final letter reveals the same forgotten promise beneath them all."},
  {title:"A Child’s Map of Lantern Row",icon:"🗺️",type:"Town Lore",text:"A playful map marks shortcuts adults ignore: the best puddle after rain, a wall cats use as a road, the baker’s warm vent, and the place where musicians practice when they think nobody hears them."}
];

const titleRules = [
  ["🌷","Friend of Lantern Row","Kindness",4,"Known for showing up kindly in ordinary village moments."],
  ["🗝️","Keeper of Curious Keys","Mystery",4,"You have spent enough time around clues, passages, and peculiar locked things to earn a playful title."],
  ["📚","Reader of Old Things","Scholarship",4,"Archivists and booksellers have noticed your appetite for stories and records."],
  ["🛡️","Steady Heart","Courage",4,"You tend to walk toward strange situations without needing to become reckless."],
  ["🎀","Festival Favorite","Festive Spirit",4,"You keep finding your way back to music, games, food, banners, and celebration."],
  ["🏡","Keeper of a Cozy Home","household",3,"You have collected enough quiet household memories to make your home feel truly lived in."],
  ["🕵️","Casebook Detective","cases",2,"You have solved multiple kingdom mysteries."],
  ["🌍","Road-Walker","realms",3,"You have visited several neighboring realms and still found your way home."]
];

const dayEvents = [
  {icon:"🐈",title:"A Cat Has Chosen You for Ten Minutes",text:"A striped cat follows you from the market to the fountain, sits on your shoe, and refuses to explain itself.",choices:["Sit with the cat","Follow it","Offer a scrap of food","Continue your day"],rep:"Kindness"},
  {icon:"💌",title:"An Invitation with No Name",text:"A cream envelope asks you to attend tea at the garden pavilion at four o’clock. The handwriting is familiar, but no signature appears.",choices:["Attend tea","Ask Mara about it","Compare the handwriting","Save it for another day"],rep:"Mystery"},
  {icon:"🎻",title:"Music in an Empty Street",text:"A violin can be heard around the corner, yet when you reach the lane there is no musician—only an open upstairs window and a child quietly practicing.",choices:["Listen without interrupting","Leave a kind note","Knock and introduce yourself","Keep walking"],rep:"Kindness"},
  {icon:"🧺",title:"Market Basket Mix-Up",text:"You discover that you and another shopper accidentally exchanged nearly identical baskets.",choices:["Find the owner","Check the market clerk","Laugh and swap them back","Turn it into a tiny investigation"],rep:"Kindness"},
  {icon:"🌧️",title:"Rain Cancels Absolutely Everything",text:"A steady rain begins before noon. Nobody needs rescuing. No mystery appears. The kingdom simply gets wet.",choices:["Read at home","Visit the bakery","Walk under an umbrella","Do absolutely nothing"],rep:"Scholarship"},
  {icon:"🗝️",title:"A Key in the Fountain",text:"A small iron key rests beneath clear fountain water. It has no tag and does not match the decorative keys sold in the market.",choices:["Take it to the guard","Ask nearby shopkeepers","Keep it temporarily","Leave it exactly where it is"],rep:"Mystery"},
  {icon:"🎉",title:"An Unplanned Street Dance",text:"Two musicians begin playing outside the bakery. Within minutes, neighbors move tables aside and turn Lantern Row into a little dance floor.",choices:["Join in","Watch from a doorway","Help move chairs","Buy pastries for the musicians"],rep:"Festive Spirit"},
  {icon:"🕯️",title:"A Quiet Castle Night",text:"Nothing unusual happens. The corridors are warm, the windows are dark mirrors, and somewhere far away a clock marks the hour.",choices:["Visit the library","Walk the gallery","Go home early","Sit by a window"],rep:"Scholarship"}
];

const memoryQuestDefs = [
  {id:"orchardpromise",icon:"🍎",title:"The Orchard Promise",intro:"A new fence blocks a footpath villagers say was protected by an old royal promise.",steps:[
    {text:"At the orchard gate, the farmer says the path damages his crops. Villagers insist it belongs to everyone.",choices:[["Hear the farmer first","farmer"],["Hear the villagers first","village"],["Inspect the old boundary stones","stones"]]},
    {text:"Your first choice is remembered. Now you find a faded marker bearing a royal crest beside the path.",choices:[["Search the archives","archive"],["Ask the oldest neighbor","neighbor"],["Suggest a temporary shared path","compromise"]]},
    {text:"The final meeting begins. The earlier conversations affect who trusts your proposal, but none of the options are locked.",choices:[["Restore the old public path","public"],["Create a fenced walkway","walkway"],["Build a new path around the orchard","around"]]}
  ]},
  {id:"masqueradeguest",icon:"🎭",title:"The Guest Who Never Removed the Mask",intro:"A masked guest remains after the ballroom empties and asks for help delivering a sealed music score.",steps:[
    {text:"The guest will not give a name, only the destination: an old music room above the ballroom.",choices:[["Take the score","trust"],["Ask a guard to come","guard"],["Ask why it matters","question"]]},
    {text:"In the music room, a locked cabinet bears the same silver pattern as the guest’s mask.",choices:[["Use the score as a clue","score"],["Search the room","search"],["Return to the guest","return"]]},
    {text:"The cabinet contains no treasure—only unfinished compositions by a former royal musician.",choices:[["Give them to the palace musicians","palace"],["Return them to the masked guest","guest"],["Archive them first","archive"]]}
  ]},
  {id:"harborparcel",icon:"📦",title:"The Parcel from a Kingdom You Never Visited",intro:"A harbor clerk insists a parcel arrived in your name from a distant court you have never entered.",steps:[
    {text:"The parcel is light, neatly wrapped, and accompanied by a customs slip with your name spelled correctly.",choices:[["Open it at the harbor","open"],["Take it to the guard office","guard"],["Ask who delivered it","source"]]},
    {text:"Inside is a small illustrated book showing Storybook Kingdom from viewpoints only a traveler would know.",choices:[["Study the illustrations","study"],["Show Archivist Elin","elin"],["Ask travelers in the inn","inn"]]},
    {text:"A final page contains an invitation to visit the distant realm whenever you choose.",choices:[["Add it to your future travels","travel"],["Write a reply first","reply"],["Keep the invitation without deciding","wait"]]}
  ]}
];

function saveV6(){
  localStorage.setItem("sk_storybook_collection",JSON.stringify(state.storybookCollection));
  localStorage.setItem("sk_titles",JSON.stringify(state.unlockedTitles));
  localStorage.setItem("sk_keepsakes",JSON.stringify(state.keepsakes));
  localStorage.setItem("sk_daily_event_history",JSON.stringify(state.dailyEventHistory));
  localStorage.setItem("sk_memory_quests",JSON.stringify(state.memoryQuests));
}

function renderCastleInterior(){
  $("#castleRoomGrid").innerHTML=castleRooms.map((r,i)=>`<article class="castle-room-card" data-room="${i}"><div class="room-icon">${r[0]}</div><h2>${r[1]}</h2><p>${r[2]}</p></article>`).join("");
  $$("#castleRoomGrid [data-room]").forEach(el=>el.onclick=()=>{const r=castleRooms[Number(el.dataset.room)],box=$("#castleRoomScene");box.classList.remove("hidden");box.innerHTML=`<div class="room-icon">${r[0]}</div><p class="eyebrow">ROSEGLASS CASTLE</p><h2>${r[1]}</h2><p>${r[2]}</p><div class="choice-row">${r[3].map(x=>`<button class="choice-btn">${x}</button>`).join("")}</div><p id="roomMoment"></p>`;box.querySelectorAll(".choice-btn").forEach(b=>b.onclick=()=>{const text=`You choose to ${b.textContent.toLowerCase()}. The castle responds with a small, believable moment rather than forcing a grand adventure.`;$("#roomMoment").textContent=text;addJournal(`${r[1]}: ${b.textContent}.`);});box.scrollIntoView({behavior:"smooth",block:"center"});});
}

function renderStorybooks(){
  const unlocked=new Set(state.storybookCollection);
  $("#storybookStats").innerHTML=`<p class="eyebrow">YOUR COLLECTION</p><h2>${unlocked.size} books and lore pieces collected</h2><p>Books can be opened and reread anytime. Nothing expires.</p>`;
  $("#storybookGrid").innerHTML=storybookLibrary.map((b,i)=>`<article class="book-card" data-book="${i}"><div class="book-icon">${b.icon}</div><div class="book-meta">${b.type} • ${unlocked.has(b.title)?'Collected':'Not yet collected'}</div><h2>${b.title}</h2><p>${unlocked.has(b.title)?b.text.slice(0,110)+'…':'This book can be discovered through kingdom life.'}</p></article>`).join("");
  $$("#storybookGrid [data-book]").forEach(el=>el.onclick=()=>{const b=storybookLibrary[Number(el.dataset.book)],box=$("#storybookScene");if(!unlocked.has(b.title)){box.classList.remove("hidden");box.innerHTML=`<div class="book-icon">${b.icon}</div><h2>${b.title}</h2><p>You have not collected this one yet. Explore, visit people, open daily events, and follow stories; it can appear naturally later.</p>`;return;}box.classList.remove("hidden");box.innerHTML=`<div class="book-icon">${b.icon}</div><p class="book-meta">${b.type}</p><h2>${b.title}</h2><div class="letter-paper">${b.text}</div>`;addJournal(`Read from “${b.title}.”`);});
}

function renderTitles(){
  let solved=Object.values(state.caseProgress||{}).filter(x=>x.solved).length;
  let realmCount=Object.keys(state.realmVisits||{}).filter(k=>state.realmVisits[k]).length;
  const values={household:state.householdMemories.length,cases:solved,realms:realmCount,...state.reputation};
  titleRules.forEach(t=>{if((values[t[2]]||0)>=t[3]&&!state.unlockedTitles.includes(t[1]))state.unlockedTitles.push(t[1]);}); saveV6();
  $("#titleBoard").innerHTML=titleRules.map(t=>{const ok=state.unlockedTitles.includes(t[1]);return `<article class="title-card ${ok?'unlocked':'locked'}"><div class="title-icon">${t[0]}</div><p class="eyebrow">${ok?'UNLOCKED':'STILL BECOMING'}</p><h2>${t[1]}</h2><p>${t[4]}</p></article>`}).join("");
  $("#keepsakeBoard").innerHTML=`<p class="eyebrow">KEEPSAKES</p><h2>Small things your story has carried home</h2><div class="keepsake-list">${state.keepsakes.map(x=>`<span class="keepsake">✨ ${x}</span>`).join("")}</div>`;
}

let currentDayEvent=null;
function renderTodayEvent(){
  currentDayEvent=dayEvents[Math.floor(Math.random()*dayEvents.length)]; const e=currentDayEvent;
  $("#todayEventScene").innerHTML=`<div class="event-icon">${e.icon}</div><p class="eyebrow">TODAY IN STORYBOOK KINGDOM</p><h1>${e.title}</h1><p>${e.text}</p><div class="choice-row">${e.choices.map(x=>`<button class="choice-btn">${x}</button>`).join("")}</div><p id="todayEventResult"></p><button id="anotherDayEvent" class="secondary-btn small">See Another Kind of Day</button>`;
  $$("#todayEventScene .choice-btn").forEach(b=>b.onclick=()=>{const result=`You choose “${b.textContent}.” The moment becomes part of your day and then the kingdom continues around you.`;$("#todayEventResult").textContent=result;state.dailyEventHistory.unshift(`${e.title}: ${b.textContent}`);state.dailyEventHistory=state.dailyEventHistory.slice(0,25);bumpRep(e.rep);if(Math.random()<.35){const available=storybookLibrary.filter(x=>!state.storybookCollection.includes(x.title));if(available.length){const book=available[Math.floor(Math.random()*available.length)];state.storybookCollection.push(book.title);$("#todayEventResult").textContent+=` You also discover “${book.title}” for your Storybook Library.`;}}if(Math.random()<.3){const keeps=["Tiny Blue Button","Old Copper Token","Pressed Clover","Painted Wooden Bird","Silver Thread","Harbor Postcard"];const k=keeps[Math.floor(Math.random()*keeps.length)];if(!state.keepsakes.includes(k))state.keepsakes.push(k);}saveV6();addJournal(`${e.title}: ${b.textContent}.`);}); $("#anotherDayEvent").onclick=renderTodayEvent;
}

function renderLivingLetters(){
  const people=typeof kingdomPeople!=="undefined"?kingdomPeople.slice(0,6):[];
  $("#livingLetterGrid").innerHTML=people.map((p,i)=>{const f=state.friendships[p.name]||0;return `<article class="story-card" data-live-letter="${i}"><div class="story-art">💌</div><p class="eyebrow">${f>=4?'FAMILIAR LETTER':f>=2?'FRIENDLY NOTE':'NEW CORRESPONDENCE'}</p><h2>From ${p.name}</h2><p>${f>=4?'Someone who knows you well enough to mention shared moments.':f>=2?'A warm note from a familiar face.':'A polite note beginning a correspondence.'}</p></article>`}).join("") || '<p>No correspondents are available yet.</p>';
  $$("#livingLetterGrid [data-live-letter]").forEach(el=>el.onclick=()=>{const p=people[Number(el.dataset.liveLetter)],f=state.friendships[p.name]||0,box=$("#livingLetterScene");const lines=f>=4?`Dear friend, I passed ${state.home} today and thought of the conversations we have already shared. The kingdom seems to collect little memories around familiar people. If you are free, come by when you feel like it. —${p.name}`:f>=2?`Hello again. I heard you have been spending time around the kingdom, and I wanted to send a small greeting. There is no urgent business—just a friendly note. —${p.name}`:`Greetings. We have crossed paths only briefly, but Storybook Kingdom is small enough that strangers rarely remain strangers forever. —${p.name}`;box.classList.remove("hidden");box.innerHTML=`<div class="letter-paper">${lines}</div><div class="scene-actions"><button id="saveLetterKeepsake" class="secondary-btn">Keep This Letter</button><button id="replyInJournal" class="primary-btn">Write a Journal Reply</button></div><p id="letterReplyResult"></p>`;$("#saveLetterKeepsake").onclick=()=>{const k=`Letter from ${p.name}`;if(!state.keepsakes.includes(k))state.keepsakes.push(k);saveV6();$("#letterReplyResult").textContent="The letter is tucked safely into your keepsakes.";};$("#replyInJournal").onclick=()=>{addJournal(`Wrote a reply to ${p.name}.`);$("#letterReplyResult").textContent="Your reply is recorded as part of your story.";};});
}

function renderMemoryQuests(){
  $("#memoryQuestGrid").innerHTML=memoryQuestDefs.map((q,i)=>{const p=state.memoryQuests[q.id]||{step:0,choices:[]};return `<article class="quest-card" data-memory-quest="${i}"><div class="quest-art">${q.icon}</div><p class="eyebrow">PART ${Math.min(p.step+1,q.steps.length)} OF ${q.steps.length}</p><h2>${q.title}</h2><p>${q.intro}</p><div class="quest-memory">Remembered choices: ${p.choices.length?p.choices.map(x=>x.label).join(' • '):'None yet'}</div><button class="primary-btn small">${p.step>=q.steps.length?'Replay Quest':'Continue Quest'}</button></article>`}).join("");
  $$("#memoryQuestGrid [data-memory-quest]").forEach(el=>el.onclick=()=>openMemoryQuest(Number(el.dataset.memoryQuest)));
}
function openMemoryQuest(i){
  const q=memoryQuestDefs[i];let p=state.memoryQuests[q.id]||{step:0,choices:[]};if(p.step>=q.steps.length)p={step:0,choices:[]};state.memoryQuests[q.id]=p;const s=q.steps[p.step],box=$("#memoryQuestScene");box.classList.remove("hidden");box.innerHTML=`<div class="quest-art">${q.icon}</div><p class="eyebrow">${q.title} • PART ${p.step+1}</p><h2>${s.text}</h2>${p.choices.length?`<div class="quest-memory">Earlier choices remembered: ${p.choices.map(x=>x.label).join(' • ')}</div>`:''}<div class="choice-row">${s.choices.map((c,n)=>`<button class="choice-btn" data-mq-choice="${n}">${c[0]}</button>`).join("")}</div><p id="memoryQuestResult"></p>`;box.querySelectorAll('[data-mq-choice]').forEach(b=>b.onclick=()=>{const c=s.choices[Number(b.dataset.mqChoice)];p.choices.push({label:c[0],key:c[1]});p.step++;state.memoryQuests[q.id]=p;saveV6();addJournal(`${q.title}: ${c[0]}.`);if(p.step>=q.steps.length){$("#memoryQuestResult").innerHTML=`<strong>Quest chapter complete.</strong> Your path remembered: ${p.choices.map(x=>x.label).join(' → ')}. You can replay later and choose a completely different route.`;state.coins+=8;localStorage.setItem('sk_coins',state.coins);if(!state.keepsakes.includes(`${q.title} Token`))state.keepsakes.push(`${q.title} Token`);saveV6();renderMemoryQuests();}else openMemoryQuest(i);});box.scrollIntoView({behavior:'smooth',block:'center'});
}


// V7 — Wider & Deeper Kingdom Expansion
const underways = [
  ["🕯️","Old Aqueduct","A cool stone channel beneath the eastern wall where water once supplied castle fountains.",["Follow the water marks","Inspect an old maintenance door","Listen at the echo chamber"]],
  ["🗝️","Servants’ Stair Belowstairs","A narrow spiral stair connecting pantry cellars, laundry rooms, and older sealed levels.",["Climb toward the kitchens","Go down one more level","Read names scratched into the wall"]],
  ["🧱","Forgotten Foundation Hall","Massive blocks reveal that part of Roseglass Castle stands on a much older fortress.",["Study the masonry","Search for builder marks","Sit and imagine the older castle"]],
  ["🌊","River Gate Tunnel","A damp passage once used to move supplies from the river directly into castle storage rooms.",["Walk toward the river gate","Inspect the pulley room","Look for old shipping marks"]],
  ["📦","Sealed Store Cellars","Dusty rooms contain empty crates, broken furniture, festival decorations, and mislabeled trunks.",["Open a harmless crate","Read old inventory tags","Look behind stacked chairs"]],
  ["✨","Lantern Cavern","A natural cavern widened by generations of workers. Tiny mineral flecks sparkle when lantern light moves.",["Stand quietly","Sketch the cavern","Follow the marked safe path"]]
];
const villagesV7 = [
  ["🌾","Barleycross","Farm lanes & millponds","Known for grain fields, a watermill, geese that own the road, and an annual bread contest."],
  ["🍎","Red Orchard","Fruit farms & cider presses","A hillside village of orchards, packing sheds, beekeepers, and long family arguments about pie recipes."],
  ["🪵","Pinehollow","Woodland cottages","Carpenters, charcoal burners, foresters, basket makers, and a tiny chapel sit beneath tall pines."],
  ["🌊","Reedbank","River village","Fishing boats, ferry bells, reed weaving, riverside gardens, and muddy children are part of ordinary life here."],
  ["🐑","Cloudmeadow","High pasture","Shepherds, wool dyers, knitters, windy hills, and enormous skies surround this peaceful settlement."],
  ["🌸","Bellflower Hamlet","Gardens & old customs","Small enough that everybody notices visitors. Famous for flowers, preserves, songs, and very detailed local gossip."]
];
const academyLessonsV7 = [
  ["🗺️","Maps & Kingdom Roads","Read old and modern maps, compare road names, and learn why routes changed."],
  ["🌿","Herbs & Household Remedies","Learn safe fictional kingdom folklore about gardens, teas, scents, and traditional household customs."],
  ["🎻","Music & Court Dance","Practice rhythm, festival songs, ballroom steps, and the difference between court and village dances."],
  ["📜","Kingdom History","Study rulers, guilds, village charters, festivals, disasters, reforms, and ordinary lives across generations."],
  ["🧩","Riddles & Logic","Solve short word puzzles, pattern problems, clues, and old-fashioned parlor riddles."],
  ["⚜️","Court Manners","Learn introductions, invitations, seating, audiences, correspondence, and how rules differ at formal versus casual events."],
  ["🏘️","Village Life","Study trades, market days, harvest routines, cottage households, fairs, and how townspeople actually spend a normal week."],
  ["📚","Fairy-Tale Studies","Compare motifs such as hidden identity, impossible tasks, enchanted objects, promises, journeys, and transformations in original kingdom tales."]
];
const castleWorkV7 = [
  ["🍲","Kitchen Helper",6,"Roll dough, carry pantry baskets, polish copper, and help plate an ordinary staff meal."],
  ["📚","Library Assistant",7,"Return books, copy catalog cards, dust map cases, and help a visitor locate an old record."],
  ["🐎","Stable Hand",7,"Brush a gentle horse, refill water, check tack, and walk a pony around the exercise yard."],
  ["🌹","Garden Helper",6,"Deadhead roses, sweep a path, carry watering cans, and tie climbing vines."],
  ["🛎️","Guest Wing Attendant",8,"Prepare a sitting room, deliver fresh towels, arrange flowers, and carry a message downstairs."],
  ["📨","Messenger Office",8,"Sort letters by district, deliver two local notes, and return with town news."],
  ["🎪","Festival Crew",9,"Hang banners, move benches, check lanterns, and help vendors find their assigned spaces."]
];
const seasonArcsV7 = [
  {id:"springbells",icon:"🌷",title:"Spring — The Bells After Rain",steps:["Heavy spring rain reveals a buried stone bell near Bellflower Hamlet.","An old ledger suggests the bell belonged to a village school that disappeared from maps.","Residents debate whether to display it, ring it, or leave it where it was found.","The village chooses how to remember a place that no longer exists."]},
  {id:"summerfair",icon:"☀️",title:"Summer — Seven Days of the Fair",steps:["Festival wagons arrive and the Green becomes a temporary town.","A friendly rivalry grows between musicians, bakers, and game booths.","A sudden storm forces everyone to improvise together.","The final night becomes less perfect than planned—and more memorable."]},
  {id:"autumnroad",icon:"🍂",title:"Autumn — The Road Through Goldwood",steps:["A familiar woodland road begins leading travelers to the wrong bridge.","Old markers have been moved, but nobody knows whether by accident or intention.","You trace the route through harvest farms and forest edges.","The corrected road becomes part of a new autumn walking tradition."]},
  {id:"winterhouse",icon:"❄️",title:"Winter — The House with Every Window Lit",steps:["During the first snow, an empty manor outside town appears fully illuminated.","Neighbors tell three incompatible stories about who once lived there.","Inside, you discover the lights come from a caretaker preparing a public winter shelter.","The manor opens for travelers, neighbors, soup, stories, and warmth through the cold season."]}
];
const pastimesV7 = [
  ["🧁","Bake Something","Spend a little while mixing, tasting, decorating, and making the kitchen smell wonderful."],
  ["🌱","Garden","Plant herbs, trim flowers, pull a few weeds, or simply inspect what is growing."],
  ["🎣","Fish by the River","Sit beside the water. Catching anything is optional."],
  ["🧵","Sew & Mend","Work on a small piece of embroidery, repair a sleeve, or stitch a tiny keepsake pouch."],
  ["🎨","Paint","Paint a castle window, a market stall, a flower, a cloudy hill, or something completely imaginary."],
  ["📖","Read","Find a comfortable chair and disappear into one of the kingdom’s books."],
  ["🎤","Sing","Sing in the cottage, garden, empty ballroom, tavern corner, or wherever the mood strikes."],
  ["🌌","Stargaze","Take a blanket outside and learn absolutely nothing if you do not feel like naming constellations."],
  ["🧺","Picnic","Pack bread, fruit, something sweet, and choose a view."],
  ["🕯️","Do Nothing","No task appears. You are simply present in the kingdom for a while."]
];

function saveV7(){
  localStorage.setItem("sk_underway_visits",JSON.stringify(state.underwayVisits));
  localStorage.setItem("sk_village_visits",JSON.stringify(state.villageVisits));
  localStorage.setItem("sk_academy_lessons",JSON.stringify(state.academyLessons));
  localStorage.setItem("sk_castle_shifts",JSON.stringify(state.castleShifts));
  localStorage.setItem("sk_season_arcs",JSON.stringify(state.seasonArcs));
  localStorage.setItem("sk_pastime_history",JSON.stringify(state.pastimeHistory));
}
function renderUnderways(){
  $("#underwayGrid").innerHTML=underways.map((u,i)=>`<article class="story-card" data-underway="${i}"><div class="story-art">${u[0]}</div><p class="eyebrow">VISITS ${state.underwayVisits[u[1]]||0}</p><h2>${u[1]}</h2><p>${u[2]}</p></article>`).join("");
  $$("#underwayGrid [data-underway]").forEach(el=>el.onclick=()=>{const u=underways[Number(el.dataset.underway)],b=$("#underwayScene");state.underwayVisits[u[1]]=(state.underwayVisits[u[1]]||0)+1;saveV7();b.classList.remove("hidden");b.innerHTML=`<div class="story-art">${u[0]}</div><h2>${u[1]}</h2><p>${u[2]}</p><div class="choice-row">${u[3].map(x=>`<button class="choice-btn">${x}</button>`).join("")}</div><p id="underwayResult"></p>`;b.querySelectorAll(".choice-btn").forEach(x=>x.onclick=()=>{$("#underwayResult").textContent=`You choose to ${x.textContent.toLowerCase()}. The passage stays atmospheric without forcing a danger scene.`;addJournal(`Underways — ${u[1]}: ${x.textContent}.`);});});
}
function renderVillages(){
  $("#villageGrid").innerHTML=villagesV7.map((v,i)=>`<article class="place-card" data-village="${i}"><div class="place-art">${v[0]}</div><p class="eyebrow">VISITS ${state.villageVisits[v[1]]||0}</p><h2>${v[1]}</h2><strong>${v[2]}</strong><p>${v[3]}</p></article>`).join("");
  $$("#villageGrid [data-village]").forEach(el=>el.onclick=()=>{const v=villagesV7[Number(el.dataset.village)],b=$("#villageScene");state.villageVisits[v[1]]=(state.villageVisits[v[1]]||0)+1;saveV7();b.classList.remove("hidden");b.innerHTML=`<div class="place-art">${v[0]}</div><h2>${v[1]}</h2><p>${v[3]}</p><div class="choice-row"><button class="choice-btn">Visit the local shop</button><button class="choice-btn">Walk the lanes</button><button class="choice-btn">Talk with a resident</button><button class="choice-btn">Sit somewhere quiet</button></div><p id="villageResult"></p>`;b.querySelectorAll(".choice-btn").forEach(x=>x.onclick=()=>{$("#villageResult").textContent=`You ${x.textContent.toLowerCase()}. ${v[1]} becomes a little more familiar.`;addJournal(`${v[1]}: ${x.textContent}.`);});});
}
function renderAcademy(){
  $("#academyGrid").innerHTML=academyLessonsV7.map((a,i)=>`<article class="story-card" data-lesson="${i}"><div class="story-art">${a[0]}</div><p class="eyebrow">${state.academyLessons.includes(a[1])?'ATTENDED':'OPTIONAL LESSON'}</p><h2>${a[1]}</h2><p>${a[2]}</p></article>`).join("");
  $$("#academyGrid [data-lesson]").forEach(el=>el.onclick=()=>{const a=academyLessonsV7[Number(el.dataset.lesson)],b=$("#academyScene");b.classList.remove("hidden");b.innerHTML=`<div class="story-art">${a[0]}</div><h2>${a[1]}</h2><p>${a[2]}</p><p class="dialogue">The instructor keeps the lesson conversational and practical. You can leave whenever you have had enough.</p><button id="attendLesson" class="primary-btn">Attend This Lesson</button><p id="lessonResult"></p>`;$("#attendLesson").onclick=()=>{if(!state.academyLessons.includes(a[1]))state.academyLessons.push(a[1]);bumpRep("Scholarship");saveV7();$("#lessonResult").textContent="Lesson attended and added to your academy record. No homework assigned.";addJournal(`Royal Academy: ${a[1]}.`);renderAcademy();};});
}
function renderCastleWork(){
  $("#castleWorkGrid").innerHTML=castleWorkV7.map((w,i)=>`<article class="quest-card" data-shift="${i}"><div class="quest-art">${w[0]}</div><p class="eyebrow">SHIFTS ${state.castleShifts[w[1]]||0}</p><h2>${w[1]}</h2><p>${w[3]}</p><span class="badge">🪙 ${w[2]} coins</span></article>`).join("");
  $$("#castleWorkGrid [data-shift]").forEach(el=>el.onclick=()=>{const w=castleWorkV7[Number(el.dataset.shift)],b=$("#castleWorkScene");b.classList.remove("hidden");b.innerHTML=`<div class="quest-art">${w[0]}</div><h2>${w[1]}</h2><p>${w[3]}</p><button id="workCastleShift" class="primary-btn">Work One Short Shift</button><p id="shiftResult"></p>`;$("#workCastleShift").onclick=()=>{state.castleShifts[w[1]]=(state.castleShifts[w[1]]||0)+1;earnCoins(w[2]);saveV7();$("#shiftResult").textContent=`Shift finished. You earned ${w[2]} kingdom coins and may stop here.`;addJournal(`Worked a castle shift: ${w[1]}.`);renderCastleWork();};});
}
function renderSeasonArcs(){
  $("#seasonArcGrid").innerHTML=seasonArcsV7.map((a,i)=>{const p=state.seasonArcs[a.id]||0;return `<article class="story-card" data-arc="${i}"><div class="story-art">${a.icon}</div><p class="eyebrow">PART ${Math.min(p+1,a.steps.length)} OF ${a.steps.length}</p><h2>${a.title}</h2><p>${a.steps[Math.min(p,a.steps.length-1)]}</p></article>`}).join("");
  $$("#seasonArcGrid [data-arc]").forEach(el=>el.onclick=()=>{const a=seasonArcsV7[Number(el.dataset.arc)],b=$("#seasonArcScene");let p=state.seasonArcs[a.id]||0;if(p>=a.steps.length)p=0;b.classList.remove("hidden");b.innerHTML=`<div class="story-art">${a.icon}</div><p class="eyebrow">${a.title} • PART ${p+1}</p><h2>${a.steps[p]}</h2><div class="choice-row"><button class="choice-btn">Step into the scene</button><button class="choice-btn">Observe first</button><button class="choice-btn">Talk to someone nearby</button></div><p id="arcResult"></p>`;b.querySelectorAll(".choice-btn").forEach(x=>x.onclick=()=>{state.seasonArcs[a.id]=p+1;saveV7();$("#arcResult").textContent=state.seasonArcs[a.id]>=a.steps.length?"Seasonal arc complete. You can replay it later from the beginning.":"This chapter is remembered. The next part will be waiting when you return.";addJournal(`${a.title}: ${x.textContent}.`);renderSeasonArcs();});});
}
function renderPastimes(){
  $("#pastimeGrid").innerHTML=pastimesV7.map((x,i)=>`<article class="cozy-card" data-pastime="${i}"><div class="cozy-art">${x[0]}</div><h2>${x[1]}</h2><p>${x[2]}</p></article>`).join("");
  $$("#pastimeGrid [data-pastime]").forEach(el=>el.onclick=()=>{const x=pastimesV7[Number(el.dataset.pastime)],b=$("#pastimeScene");b.classList.remove("hidden");b.innerHTML=`<div class="cozy-art">${x[0]}</div><h2>${x[1]}</h2><p>${x[2]}</p><button id="livePastime" class="secondary-btn">Spend Some Time Here</button><p id="pastimeResult"></p>`;$("#livePastime").onclick=()=>{state.pastimeHistory.unshift(x[1]);state.pastimeHistory=state.pastimeHistory.slice(0,30);saveV7();$("#pastimeResult").textContent=x[1]==="Do Nothing"?"Nothing happened. That was the entire point. 🌙":"A small, peaceful piece of kingdom life is added to your day.";addJournal(`Pastime: ${x[1]}.`);};});
}


// Final-world expansion: life paths, stables, feasts, theatre, passport, tale maker, long-form saga, dashboard, backup center.
const lifePathsFinal = [
  ["👑","Royal Household","Begin the day inside the palace: breakfast with attendants, public duties, court gossip, and a private hour in the gardens."],
  ["⚜️","Noble Household","Live between manor and court, manage invitations, call on neighbors, attend functions, and navigate family expectations."],
  ["🛍️","Merchant Household","Open a shop, bargain at market, receive deliveries, know half the town by name, and close the shutters at dusk."],
  ["🧵","Artisan Household","Work with your hands as a tailor, potter, baker, carpenter, painter, or maker whose craft is part of daily town life."],
  ["🕯️","Castle Servant","Know the palace from behind the scenes: bells, corridors, trays, linens, gossip, kindness, and shortcuts no guest sees."],
  ["🌾","Farm & Orchard Life","Wake early, tend animals or trees, trade at market, share meals, watch weather, and end the day under a wide sky."],
  ["🧳","Traveler’s Life","Stay at inns, carry letters, meet strangers, move between realms, and never have to explain why you prefer the road."],
  ["🏘️","Village Resident","Know the lanes, neighbors, wells, shops, arguments, celebrations, and little routines that make the castle town feel like home."]
];
const horsesFinal = [
  ["🤍","Snowbell","Gentle white mare","calm, patient, excellent for quiet countryside rides"],
  ["🖤","Midnight","Black gelding","steady, observant, happiest on evening roads"],
  ["🤎","Chestnut","Chestnut mare","friendly, food-motivated, and fond of orchard paths"],
  ["✨","Starlight","Dapple-gray mare","elegant but sensible, often used for ceremonial rides"],
  ["🌾","Barley","Golden pony","small, clever, stubborn in funny ways, and beloved by village children"],
  ["🌲","Fern","Bay trail horse","sure-footed and comfortable on forest and hill roads"]
];
const feastsFinal = [
  ["🥐","Kitchen Breakfast","Warm rolls, fruit preserves, eggs, tea, and harmless kitchen gossip before the castle fully wakes."],
  ["🍲","Village Supper","Stew, bread, roasted vegetables, pie, neighbors dropping in, and somebody telling a story twice."],
  ["👑","Royal Banquet","Courses, musicians, formal table settings, diplomatic guests, and chances to escape onto the terrace between speeches."],
  ["🧺","Garden Picnic","Bread, cheese, berries, cakes, lemonade, blankets, shade, and no requirement to behave formally."],
  ["🎪","Festival Feast","Food stalls, honey pastries, roasted corn, pies, spiced cider, contests, and long shared tables beneath banners."],
  ["🌙","Midnight Kitchen","Leftover tart, hot tea, candlelight, a sleepy cook, and the strange comfort of being awake when most of the palace is not."]
];
const theatreFinal = [
  ["🎭","Royal Theatre","Watch an original fairy-tale play from the velvet seats or volunteer for a tiny walk-on role."],
  ["🎤","Songs in the Ballroom","Join a rehearsal, sing a solo, harmonize with the court musicians, or simply listen from the doorway."],
  ["🪆","Village Puppet Show","A traveling troupe performs a funny tale in Market Square while children argue about which puppet is the villain."],
  ["📖","Storyteller’s Night","Take the story chair at the inn, tell an old legend, invent one, or listen while somebody else holds the room."],
  ["🌾","Harvest Pageant","Villagers stage a gloriously imperfect seasonal pageant with homemade crowns, painted scenery, and enthusiastic animals."],
  ["🎻","Moonharbor Concert","Sailors and musicians trade songs on the pier as lanterns reflect across the water."]
];
const talePartsFinal = {
  hero:["a clever village baker","a forgotten royal cousin","a young mapmaker","a widowed queen who travels in disguise","a stable hand with an excellent memory","a traveling singer","a shy palace maid","a merchant’s daughter who hates being underestimated"],
  setting:["a castle where one tower has no door","a river town preparing for a lantern festival","a snowbound palace","a crowded midsummer fair","an orchard beside an abandoned manor","a harbor where a ship arrives with no crew","a village hidden beyond the royal forest","a royal wedding week full of strangers"],
  mystery:["a crown is found somewhere it should not be","every clock in town loses the same hour","an invitation arrives for a person who does not exist","a portrait changes one tiny detail each night","somebody is returning borrowed objects that were never lent","a sealed room smells suddenly of fresh roses","a child knows a passage no adult remembers","an old village song contains directions to a real place"],
  object:["a silver key","a red ribbon","a cracked music box","an unsigned letter","a brass lantern","a recipe book with missing pages","a tiny painted crown","a map stitched into a coat lining"],
  companion:["a sarcastic royal librarian","a patient baker","a nervous young guard","a cheerful flower seller","a mysterious visiting prince","an elderly gardener who remembers everything","a child messenger with too many questions","a calm horse that keeps stopping at important places"],
  ending:["a warm homecoming","a public celebration","a quiet truth revealed at dawn","a friendship that changes two families","a royal tradition rewritten","a mystery solved without punishing anyone","a road opening toward another adventure","an ending where the hero chooses ordinary happiness"]
};
const pauperSagaFinal = [
  {title:"Chapter I — The Cottage at the Edge of Lantern Row",text:"You begin in a small household where money is modest, neighbors know one another, and palace life feels like another world. A dropped royal parcel lands in your lane.",choices:["Return it unopened","Open only enough to find the owner","Ask the neighborhood who delivered it"]},
  {title:"Chapter II — An Invitation You Did Not Expect",text:"Your handling of the parcel reaches the castle. Instead of a reward, you receive an invitation to help with a one-day palace task during festival week.",choices:["Accept immediately","Ask if a friend may come","Decline the formal task but offer another kind of help"]},
  {title:"Chapter III — Behind the Golden Doors",text:"Inside the castle you discover that royal life contains work, awkwardness, kindness, boredom, gossip, and uncertainty—just like village life, only dressed differently.",choices:["Stay near the servants and learn","Observe the royal family","Explore during your free hour"]},
  {title:"Chapter IV — The Choice at Market Square",text:"A disagreement between palace planners and local sellers threatens a beloved public festival. Because you understand both sides, people unexpectedly ask for your opinion.",choices:["Defend the market families","Explain the palace concern","Build a compromise between both"]},
  {title:"Chapter V — A Place at Court",text:"Your role in the dispute earns you a standing invitation to certain public court sessions. Some villagers celebrate; others tease you about becoming 'too fancy.'",choices:["Keep village life at the center","Lean into court opportunities","Move comfortably between both worlds"]},
  {title:"Chapter VI — The Offer",text:"A permanent court appointment, a sponsored shop, and a scholarship are each offered. None is presented as the correct future.",choices:["Choose court service","Choose a business in town","Choose study and travel"]},
  {title:"Chapter VII — Happily Ever After, Rewritten",text:"Years later, your life is neither the simple rags-to-riches tale people expected nor a rejection of where you began. You decide what home, success, family, and belonging mean for yourself.",choices:["Build a life close to the palace","Return to a quieter village home","Keep several homes and several worlds"]}
];

function saveFinalWorld(){
  localStorage.setItem("sk_life_path",state.currentLifePath);
  localStorage.setItem("sk_favorite_horse",state.favoriteHorse);
  localStorage.setItem("sk_horse_bonds",JSON.stringify(state.horseBonds));
  localStorage.setItem("sk_feast_history",JSON.stringify(state.feastHistory));
  localStorage.setItem("sk_performance_history",JSON.stringify(state.performanceHistory));
  localStorage.setItem("sk_tale_history",JSON.stringify(state.taleHistory));
  localStorage.setItem("sk_pauper_saga_step",state.pauperSagaStep);
  localStorage.setItem("sk_pauper_saga_choices",JSON.stringify(state.pauperSagaChoices));
}
function renderLifePaths(){
  $("#lifePathGrid").innerHTML=lifePathsFinal.map((x,i)=>`<article class="story-card" data-life-path="${i}"><div class="story-art">${x[0]}</div><p class="eyebrow">${state.currentLifePath===x[1]?'CURRENT PATH':'TRY FOR A DAY'}</p><h2>${x[1]}</h2><p>${x[2]}</p></article>`).join("");
  $$("#lifePathGrid [data-life-path]").forEach(el=>el.onclick=()=>{const x=lifePathsFinal[Number(el.dataset.lifePath)],b=$("#lifePathScene");b.classList.remove("hidden");b.innerHTML=`<div class="story-art">${x[0]}</div><h2>${x[1]}</h2><p>${x[2]}</p><div class="choice-row"><button class="choice-btn">Live one morning</button><button class="choice-btn">Live one full day</button><button class="choice-btn">Make this my current path</button></div><p id="lifePathResult"></p>`;b.querySelectorAll(".choice-btn").forEach(btn=>btn.onclick=()=>{if(btn.textContent.includes("current")){state.currentLifePath=x[1];saveFinalWorld();renderLifePaths();}$("#lifePathResult").textContent=`${x[1]} becomes the lens for this visit. You can switch paths at any time.`;addJournal(`Life path: ${x[1]} — ${btn.textContent}.`);});});
}
function renderStables(){
  $("#stableStatus").innerHTML=`<strong>Favorite horse:</strong> ${state.favoriteHorse||'None chosen yet'} &nbsp; • &nbsp; Stable visits are always optional.`;
  $("#horseGrid").innerHTML=horsesFinal.map((h,i)=>`<article class="person-card" data-horse="${i}"><div class="person-avatar">${h[0]}</div><p class="eyebrow">BOND ${state.horseBonds[h[1]]||0}</p><h2>${h[1]}</h2><strong>${h[2]}</strong><p>${h[3]}.</p></article>`).join("");
  $$("#horseGrid [data-horse]").forEach(el=>el.onclick=()=>{const h=horsesFinal[Number(el.dataset.horse)],b=$("#horseScene");b.classList.remove("hidden");b.innerHTML=`<div class="story-art">${h[0]}</div><h2>${h[1]}</h2><p>${h[1]} is a ${h[2].toLowerCase()} who is ${h[3]}.</p><div class="choice-row"><button class="choice-btn">Groom</button><button class="choice-btn">Offer an apple</button><button class="choice-btn">Take a quiet ride</button><button class="choice-btn">Choose as favorite</button></div><p id="horseResult"></p>`;b.querySelectorAll(".choice-btn").forEach(btn=>btn.onclick=()=>{if(btn.textContent.includes("favorite"))state.favoriteHorse=h[1];else state.horseBonds[h[1]]=(state.horseBonds[h[1]]||0)+1;saveFinalWorld();$("#horseResult").textContent=btn.textContent.includes("favorite")?`${h[1]} is now your favorite mount.`:`A small moment with ${h[1]} is remembered.`;addJournal(`Royal Stables — ${h[1]}: ${btn.textContent}.`);renderStables();});});
}
function renderFeasts(){
  $("#feastGrid").innerHTML=feastsFinal.map((f,i)=>`<article class="story-card" data-feast="${i}"><div class="story-art">${f[0]}</div><h2>${f[1]}</h2><p>${f[2]}</p></article>`).join("");
  $$("#feastGrid [data-feast]").forEach(el=>el.onclick=()=>{const f=feastsFinal[Number(el.dataset.feast)],b=$("#feastScene");b.classList.remove("hidden");b.innerHTML=`<div class="story-art">${f[0]}</div><h2>${f[1]}</h2><p>${f[2]}</p><div class="choice-row"><button class="choice-btn">Help prepare</button><button class="choice-btn">Join the table</button><button class="choice-btn">Host someone</button><button class="choice-btn">Take a plate somewhere quiet</button></div><p id="feastResult"></p>`;b.querySelectorAll(".choice-btn").forEach(btn=>btn.onclick=()=>{state.feastHistory.unshift(`${f[1]} — ${btn.textContent}`);state.feastHistory=state.feastHistory.slice(0,30);saveFinalWorld();$("#feastResult").textContent=`You choose to ${btn.textContent.toLowerCase()}. The meal becomes part of your kingdom day.`;addJournal(`${f[1]}: ${btn.textContent}.`);});});
}
function renderTheatre(){
  $("#theatreGrid").innerHTML=theatreFinal.map((t,i)=>`<article class="story-card" data-theatre="${i}"><div class="story-art">${t[0]}</div><h2>${t[1]}</h2><p>${t[2]}</p></article>`).join("");
  $$("#theatreGrid [data-theatre]").forEach(el=>el.onclick=()=>{const t=theatreFinal[Number(el.dataset.theatre)],b=$("#theatreScene");b.classList.remove("hidden");b.innerHTML=`<div class="story-art">${t[0]}</div><h2>${t[1]}</h2><p>${t[2]}</p><div class="choice-row"><button class="choice-btn">Watch from the audience</button><button class="choice-btn">Join the performers</button><button class="choice-btn">Sing</button><button class="choice-btn">Help backstage</button></div><p id="theatreResult"></p>`;b.querySelectorAll(".choice-btn").forEach(btn=>btn.onclick=()=>{state.performanceHistory.unshift(`${t[1]} — ${btn.textContent}`);state.performanceHistory=state.performanceHistory.slice(0,30);saveFinalWorld();if(btn.textContent==='Sing')bumpRep('Festive Spirit');$("#theatreResult").textContent=`${btn.textContent} becomes tonight’s little performance memory.`;addJournal(`${t[1]}: ${btn.textContent}.`);});});
}
function renderPassport(){
  const realmCount=Object.values(state.realmVisits).filter(v=>v>0).length,villageCount=Object.values(state.villageVisits).filter(v=>v>0).length;
  $("#passportStats").innerHTML=`<h2>Travel Record</h2><p><strong>${realmCount}</strong> neighboring realms visited • <strong>${villageCount}</strong> outlying villages visited • Favorite travel style: ${state.favoriteHorse?`horseback with ${state.favoriteHorse}`:'whatever suits the day'}.</p>`;
  const realmRecords=realms.map(r=>({name:r.name,icon:r.icon||'🗺️',visits:state.realmVisits[r.name]||0,type:'Realm'}));
  const villageRecords=villagesV7.map(v=>({name:v[1],icon:v[0],visits:state.villageVisits[v[1]]||0,type:'Village'}));
  $("#passportGrid").innerHTML=[...realmRecords,...villageRecords].map(x=>`<article class="place-card"><div class="place-art">${x.icon}</div><p class="eyebrow">${x.type} • ${x.visits?`${x.visits} VISIT${x.visits===1?'':'S'}`:'UNVISITED'}</p><h2>${x.name}</h2><p>${x.visits?'A stamp and a few memories have been added to your passport.':'This place is still waiting for its first passport stamp.'}</p></article>`).join("")||'<p>Your travel record will fill as you visit realms and villages.</p>';
}
function makeTaleFinal(){
  const pick=a=>a[Math.floor(Math.random()*a.length)];
  return {hero:pick(talePartsFinal.hero),setting:pick(talePartsFinal.setting),mystery:pick(talePartsFinal.mystery),object:pick(talePartsFinal.object),companion:pick(talePartsFinal.companion),ending:pick(talePartsFinal.ending)};
}
function renderTaleMaker(){
  const box=$("#taleMaker"),t=makeTaleFinal();
  box.innerHTML=`<p class="eyebrow">NEW ORIGINAL PREMISE</p><h2>The Tale of ${t.object.replace(/^a |^an /,'')}</h2><p>In <strong>${t.setting}</strong>, <strong>${t.hero}</strong> discovers that <strong>${t.mystery}</strong>. The first important clue is <strong>${t.object}</strong>, and the unexpected companion is <strong>${t.companion}</strong>. If the story keeps its current tone, it may lead toward <strong>${t.ending}</strong>.</p><div class="choice-row"><button id="newTale" class="primary-btn">Make Another</button><button id="saveTale" class="secondary-btn">Save This Premise</button></div><p id="taleMakerResult"></p>`;
  $("#newTale").onclick=renderTaleMaker;$("#saveTale").onclick=()=>{state.taleHistory.unshift(t);state.taleHistory=state.taleHistory.slice(0,20);saveFinalWorld();$("#taleMakerResult").textContent='Saved to your kingdom story ideas.';addJournal(`Created a fairy-tale premise set in ${t.setting}.`);};
}
function renderPauperSaga(){
  if(state.pauperSagaStep>=pauperSagaFinal.length){$("#pauperSagaStatus").innerHTML=`<h2>Saga complete</h2><p>You reached your own version of happily ever after. Replay whenever you want to choose a different route.</p><button id="resetPauperSaga" class="secondary-btn">Replay From Chapter I</button>`;$("#pauperSagaScene").innerHTML=`<p class="eyebrow">YOUR PATH</p><h2>From Cottage to Court</h2><ol>${state.pauperSagaChoices.map((c,i)=>`<li>Chapter ${i+1}: ${c}</li>`).join('')}</ol>`;$("#resetPauperSaga").onclick=()=>{state.pauperSagaStep=0;state.pauperSagaChoices=[];saveFinalWorld();renderPauperSaga();};return;}
  const ch=pauperSagaFinal[state.pauperSagaStep];$("#pauperSagaStatus").innerHTML=`<strong>Progress:</strong> Chapter ${state.pauperSagaStep+1} of ${pauperSagaFinal.length}`;$("#pauperSagaScene").innerHTML=`<p class="eyebrow">CHAPTER ${state.pauperSagaStep+1}</p><h2>${ch.title}</h2><p>${ch.text}</p><div class="choice-row">${ch.choices.map(c=>`<button class="choice-btn" data-saga-choice="${c.replace(/"/g,'&quot;')}">${c}</button>`).join('')}</div><p id="pauperSagaResult"></p>`;$$("#pauperSagaScene [data-saga-choice]").forEach(btn=>btn.onclick=()=>{state.pauperSagaChoices.push(btn.dataset.sagaChoice);state.pauperSagaStep++;saveFinalWorld();addJournal(`From Cottage to Court — ${btn.dataset.sagaChoice}.`);$("#pauperSagaResult").textContent=state.pauperSagaStep>=pauperSagaFinal.length?'Your version of the saga is complete.':'Chapter remembered. The next part is ready.';setTimeout(renderPauperSaga,250);});
}
function renderKingdomDashboard(){
  const cards=[
    ["👤","Character",state.character?`${state.character.name} — ${state.character.role}`:'The Traveler — no custom character yet'],["🏡","Home",state.home],["🧭","Life Path",state.currentLifePath],["🪙","Kingdom Coins",state.coins],["👗","Current Outfit",state.outfit],["🐎","Favorite Horse",state.favoriteHorse||'None chosen'],["🎒","Inventory",`${state.inventory.length} collected items`],["📚","Storybook Shelf",`${state.storybookCollection.length} collected books`],["🏅","Titles",`${state.unlockedTitles.length} unlocked story titles`],["🧸","Keepsakes",`${state.keepsakes.length} keepsakes`],["👥","Friendships",`${Object.keys(state.friendships).length} familiar relationships`],["🗺️","Realm Travel",`${Object.values(state.realmVisits).filter(v=>v>0).length} neighboring realms visited`],["🏘️","Village Travel",`${Object.values(state.villageVisits).filter(v=>v>0).length} outlying villages visited`],["🎓","Academy",`${state.academyLessons.length} lessons attended`],["🕵️","Casebook",`${Object.values(state.caseProgress).filter(x=>x&&x.solved).length} extra cases solved`],["📖","Journal",`${state.journal.length} recent journal entries`]
  ];
  $("#kingdomDashboard").innerHTML=cards.map(c=>`<article class="dashboard-card"><span>${c[0]}</span><p class="eyebrow">${c[1]}</p><h2>${c[2]}</h2></article>`).join('');
}
function getKingdomSave(){
  const data={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.startsWith('sk_'))data[k]=localStorage.getItem(k);}return {app:'Storybook Kingdom',version:'Final World Save',savedAt:new Date().toISOString(),data};
}
function renderSaveCenter(){
  $("#saveCenter").innerHTML=`<h2>Your progress lives in this browser.</h2><p>Use a backup if you plan to change computers, clear browser data, or simply want an extra copy of your kingdom.</p><div class="choice-row"><button id="exportKingdom" class="primary-btn">Export Backup</button><label class="secondary-btn" style="display:inline-flex;align-items:center;cursor:pointer">Import Backup<input id="importKingdom" type="file" accept="application/json,.json" style="display:none"></label><button id="resetKingdom" class="secondary-btn">Reset Kingdom</button></div><p id="saveCenterResult"></p><div id="resetConfirm" class="hidden"><p><strong>Reset removes Storybook Kingdom saves from this browser.</strong> This cannot be undone unless you exported a backup.</p><button id="confirmResetKingdom" class="secondary-btn">Yes, Reset My Kingdom</button></div>`;
  $("#exportKingdom").onclick=()=>{const blob=new Blob([JSON.stringify(getKingdomSave(),null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`storybook-kingdom-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(url);$("#saveCenterResult").textContent='Backup exported.';};
  $("#importKingdom").onchange=e=>{const file=e.target.files[0];if(!file)return;const r=new FileReader();r.onload=()=>{try{const obj=JSON.parse(r.result);if(!obj.data||typeof obj.data!=='object')throw new Error('Invalid save');Object.entries(obj.data).forEach(([k,v])=>{if(k.startsWith('sk_'))localStorage.setItem(k,v);});$("#saveCenterResult").textContent='Backup restored. Reloading the kingdom…';setTimeout(()=>location.reload(),700);}catch(err){$("#saveCenterResult").textContent='That file is not a valid Storybook Kingdom backup.';}};r.readAsText(file);};
  $("#resetKingdom").onclick=()=>$("#resetConfirm").classList.remove('hidden');$("#confirmResetKingdom").onclick=()=>{Object.keys(localStorage).filter(k=>k.startsWith('sk_')).forEach(k=>localStorage.removeItem(k));location.reload();};
}


// Final navigation polish
const lifeCategoriesFinal = {
  people:["people","homebase","wardrobe","courtship","property","household","lifepaths","stables"],
  stories:["stories","mystery","quests","cases","eventchains","seasonarcs","consequencequests","paupersaga","talemaker","storybooks"],
  places:["explore","carriage","realms","underways","villages","castleinterior","passport","clock","seasons"],
  learning:["jobs","academy","castlework","royals","reputation","calendar"],
  leisure:["festival","grandevents","pastimes","todayevents","townservices","feasts","theatre","games","cozy","routines"],
  world:["letters","letterslive","titles","kingdomdashboard","savecenter"]
};
function categoryForLifeCard(view){
  for(const [cat,list] of Object.entries(lifeCategoriesFinal)) if(list.includes(view)) return cat;
  return "world";
}
function setupKingdomFinder(){
  const input=$("#kingdomSearch"),chips=$$("#kingdomCategoryChips [data-life-filter]");
  if(!input)return;
  $$("#lifeView .life-card").forEach(card=>card.dataset.category=categoryForLifeCard(card.dataset.view));
  let active="all";
  function apply(){
    const q=input.value.trim().toLowerCase();let shown=0;
    $$("#lifeView .life-card").forEach(card=>{
      const text=card.textContent.toLowerCase(),okCat=active==="all"||card.dataset.category===active,okText=!q||text.includes(q);
      const show=okCat&&okText;card.classList.toggle("filtered-out",!show);if(show)shown++;
    });
    $("#kingdomFinderCount").textContent=`Showing ${shown} kingdom ${shown===1?'place or activity':'places and activities'}.`;
  }
  input.oninput=apply;
  chips.forEach(ch=>ch.onclick=()=>{active=ch.dataset.lifeFilter;chips.forEach(c=>c.classList.toggle("active",c===ch));apply();});
  apply();
}
function updateContinueButton(){
  const btn=$("#continueKingdomBtn");if(!btn)return;const last=localStorage.getItem("sk_last_view");
  if(last && document.getElementById(`${last}View`)){btn.classList.remove("hidden");btn.textContent=`Continue: ${last.replace(/([A-Z])/g,' $1').replace(/^./,c=>c.toUpperCase())}`;btn.onclick=()=>showView(last);} else btn.classList.add("hidden");
}
const surpriseViewsFinal=["explore","roleplay","stories","mystery","quests","games","cozy","court","people","shops","festival","realms","courtship","grandevents","todayevents","underways","villages","pastimes","stables","feasts","theatre","talemaker"];
function surpriseKingdom(){showView(surpriseViewsFinal[Math.floor(Math.random()*surpriseViewsFinal.length)]);}
const surpriseBtn=$("#surpriseKingdomBtn");if(surpriseBtn)surpriseBtn.onclick=surpriseKingdom;
const originalRenderLifeFinal=renderLife;
renderLife=function(){originalRenderLifeFinal();setupKingdomFinder();};
updateContinueButton();
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeJournal();}});
