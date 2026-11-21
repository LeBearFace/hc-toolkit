// node tests/v22.js $PWD/test/index.html : 2.2 — 🧭 plan de sortie (PNJ / alch / transformer / GE / N/A) et 🧮 XP en banque
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:900}});const errs=[];let ok=0,ko=0;const T=(c,m)=>{if(c)ok++;else{ko++;console.log('KO',m)}};
p.on('pageerror',e=>errs.push(e.message));await p.route('**/*',r=>r.request().url().startsWith('file:')?r.continue():r.abort());
await p.goto('file://'+process.argv[2]+'?panel=0');await p.waitForTimeout(1200);
const r=await p.evaluate(async()=>{const o={};const wait=ms=>new Promise(r=>setTimeout(r,ms));
  const add=(id,name,v,ha,lim)=>{MAP[id]={id,name,icon:'x.png',value:v,highalch:ha,limit:lim||1000};BYNAME[name.toLowerCase()]=id};
  add(1347,'Rune warhammer',41600,24960);add(1073,'Rune platelegs',64000,38400);add(526,'Bones',1,0);add(1511,'Logs',4,2);add(52,'Arrow shaft',1,0);add(53,'Headless arrow',1,0);add(314,'Feather',2,1);add(2,'Iron cannonball',5,3);
  LAT[1347]={high:26000,low:25464};LAT[1073]={high:38000,low:37411};LAT[526]={high:120,low:110};LAT[1511]={high:60,low:55};LAT[52]={high:20,low:18};LAT[53]={high:60,low:55};LAT[314]={high:3,low:2};LAT[2]={high:11,low:10};natPrice=239;
  for(const id of [1347,1073,526,1511,52,53,314,2])D24[id]={avgHighPrice:LAT[id].high,avgLowPrice:LAT[id].low,highPriceVolume:5000,lowPriceVolume:5000};
  SHOPS.push({shop:'Test smithy',item:'Rune warhammer',buy:29050,delta:30,stock:Infinity});
  RECIPES.length=0;RECIPES.push({out:'',nm:'Bones',mats:[{n:'Bones',q:1}],sk:[{n:'Prayer',l:1,xp:4.5}],oq:1,ticks:0},
    {out:'',nm:'Logs',mats:[{n:'Logs',q:1}],sk:[{n:'Firemaking',l:1,xp:40}],oq:1,ticks:0},
    {out:'Arrow shaft',nm:'Arrow shaft',mats:[{n:'Logs',q:1}],sk:[{n:'Fletching',l:1,xp:5}],oq:15,ticks:3},
    {out:'Headless arrow',nm:'Headless arrow',mats:[{n:'Arrow shaft',q:15},{n:'Feather',q:15}],sk:[{n:'Fletching',l:1,xp:15}],oq:15,ticks:3});
  lastUpdate=Date.now();
  empTx={};empBanks={Bearmoule:{w:WORLD,bank:{t:Date.now(),items:{'Rune warhammer':10,'Rune platelegs':4,'Bones':100,'Logs':30,'Arrow shaft':150,'Mystery thing':3,'Coins':500}}},
    Bearinda:{w:WORLD,bank:{t:Date.now(),items:{'Bones':50,'Iron cannonball':1000}},skills:{t:1,lv:{Prayer:39,Firemaking:20,Fletching:10}}},
    'Bear Brown':{w:WORLD,skills:{t:1,lv:{Prayer:10,Firemaking:1,Fletching:1}}}};
  // plan de sortie
  const P=empPlan();const k=n=>P.find(r=>(r.o.name||'')===n||(MAP[r.o.id]&&MAP[r.o.id].name===n));
  o.npc=k('Rune warhammer').k==='npc'&&k('Rune warhammer').gain>0&&k('Rune warhammer').worlds>=1;
  o.alch=k('Rune platelegs').k==='alch'&&k('Rune platelegs').unit===38400-239;
  o.ge=k('Iron cannonball').k==='ge'&&k('Iron cannonball').gain===0;
  o.na=k('Mystery thing').k==='na';o.noCoins=!k('Coins');
  o.stock=empStock().hasOwnProperty(526)&&empStock()[526].q===150&&empStock('Bearinda')[526].q===50;
  // 🧮 XP en banque
  const X=xbCalc();o.prayer=X.Prayer&&X.Prayer.xp===150*4.5;o.fm=X.Firemaking&&X.Firemaking.xp===30*40;
  o.fletchBuy=X.Fletching&&X.Fletching.xpBuy>0&&X.Fletching.cost>0;   // Arrow shaft sans plumes → à acheter
  o.only=xbCalc('Bearinda').Prayer.xp===50*4.5&&!xbCalc('Bearinda').Firemaking;
  tab='emp';render();await wait(80);let txt=document.getElementById('alertsHost').textContent;o.planView=/Plan de sortie/.test(txt)&&/Vendre aux PNJ/.test(txt)&&/Test smithy/.test(txt);
  document.querySelector('[data-empplan="alch"]').click();await wait(50);o.planAlch=/Rune platelegs/.test(document.querySelector('.emp-plan tbody').textContent);
  tab='xpbank';render();await wait(80);txt=document.getElementById('alertsHost').textContent;o.xbView=/Prière/.test(txt)&&/Firemaking/.test(txt)&&/Bearinda 39→/.test(txt);
  document.querySelector('[data-xbsk="Prayer"]').click();await wait(50);o.xbDetail=/détail/.test(document.getElementById('alertsHost').textContent);
  o.noNaN=!/NaN|undefined|Infinity/.test(document.getElementById('alertsHost').textContent);
  o.rail=!!document.querySelector('#rail [data-tab="xpbank"]');
  return o});
for(const [k,v] of Object.entries(r))T(v,k);
await p.setViewportSize({width:560,height:900});for(const t of ['emp','xpbank']){await p.evaluate(t=>{tab=t;render()},t);await p.waitForTimeout(120);T(await p.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+2),'560 px : '+t)}
T(!errs.length,'erreurs JS : '+errs.join(' | '));console.log(`2.2 : ${ok} OK, ${ko} KO`);await b.close();process.exit(ko?1:0)})();
