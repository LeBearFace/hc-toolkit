// node tests/v21.js $PWD/test/index.html [dossier data-exports réel] : 2.1 — menu en espaces, banques Data Export, courbe Mon empire, 🎯 Pics répétés
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:900}});const errs=[];let ok=0,ko=0;const T=(c,m)=>{if(c)ok++;else{ko++;console.log('KO',m)}};
p.on('pageerror',e=>errs.push(e.message));const NOW=Math.floor(Date.now()/1000);
// séries fictives : id 451 = sommet touché 4 fois ; 1513 = un seul pic isolé ; 385 = plat
await p.route('**/*',r=>{const u=r.request().url();if(u.startsWith('file:'))return r.continue();const m=u.match(/timeseries\?id=(\d+)&lookback=(\w+)/);
  if(m){const id=+m[1],d=[];for(let i=0;i<168;i++){let hi=1000,lo=960;if(id===451&&[20,60,100,150].includes(i))hi=1120;if(id===1513&&i===80)hi=1600;d.push({timestamp:NOW-(167-i)*3600,avgHighPrice:hi+(i%3),avgLowPrice:lo-(i%5),highPriceVolume:40,lowPriceVolume:40})}
    return r.fulfill({contentType:'application/json',body:JSON.stringify({data:d})})}return r.abort()});
await p.goto('file://'+process.argv[2]+'?panel=0');await p.waitForTimeout(1200);
const r=await p.evaluate(async()=>{const o={};const wait=ms=>new Promise(r=>setTimeout(r,ms));
  const names={451:'Runite ore',1513:'Magic logs',385:'Shark',1347:'Rune warhammer'};for(const id in names){MAP[id]={id:+id,name:names[id],icon:'x.png',value:41600,highalch:24960,limit:1000};BYNAME[names[id].toLowerCase()]=+id}
  LAT[451]={high:1010,low:990};LAT[1513]={high:1000,low:990};LAT[385]={high:1000,low:990};LAT[1347]={high:26000,low:25464};natPrice=239;
  for(const id of [451,1513,385])D24[id]={avgHighPrice:1000,avgLowPrice:960,highPriceVolume:20000,lowPriceVolume:20000};
  SHOPS.push({shop:'Test smithy',item:'Rune warhammer',buy:29050,delta:30,stock:Infinity});
  // menu en espaces
  tab='flips';render();await wait(50);const rail=document.getElementById('rail');
  o.spaces=rail.querySelectorAll('.rg').length>=8&&rail.querySelectorAll('.rg.open').length===1&&!!rail.querySelector('[data-tab="flips"]')&&!rail.querySelector('[data-tab="tour"]');
  const all=new Set(GROUPS.flatMap(g=>g[2]));o.allPlaced=Object.keys(VIEWS).every(k=>all.has(k));
  o.icons=rail.querySelectorAll('img.ri-ico').length>=8;
  rail.querySelector('[data-group="npc"]').click();await wait(50);o.groupOpen=groupOf(tab)==='npc'&&!!document.querySelector('#rail [data-tab="tour"]')&&!document.querySelector('#rail [data-tab="flips"]');
  document.getElementById('railAll').click();await wait(30);o.railAll=!!document.querySelector('#rail [data-tab="flips"]')&&!!document.querySelector('#rail [data-tab="tour"]');document.getElementById('railAll').click();
  o.railShort=rail.scrollHeight<900;
  // Data Export
  const bank=JSON.stringify({bank:[{name:'Rune warhammer',id:9,quantity:10},{name:'Coins',id:1,quantity:5000},{name:'Mystery thing',id:2,quantity:3}]});
  const sk=JSON.stringify({skills:{Attack:{level:60,xp:1},Strength:{level:55,xp:1},Overall:{level:115,xp:2}}});const qs=JSON.stringify({quests:{questPoints:110,completed:['A','B']}});
  const dia=JSON.stringify({diaries:{Ardougne:{Easy:true,Medium:false},Desert:{Easy:true,Medium:true}}});
  o.deName=empParseDE(bank,'Bear Brown_bank_2026-11-21_18-17-26.json').who==='Bear Brown'&&empParseDE(bank,'x.json')===null&&empParseDE(bank,'Bear_friends_2026-11-21_18-17-26.json')===null;
  empBanks={};empTx={};let im=empImportDE([empParseDE(bank,'Bear Brown_bank_2026-11-21_18-17-26.json'),empParseDE(sk,'Bear Brown_skills_2026-11-21_18-17-26.json'),empParseDE(qs,'Bear Brown_quests_2026-11-21_18-17-26.json'),empParseDE(dia,'Bear Brown_diaries_2026-11-21_18-17-26.json')]);
  o.deImport=im.n===4&&empBanks['Bear Brown'].bank.items['Rune warhammer']===10&&empBanks['Bear Brown'].quests.qp===110&&empBanks['Bear Brown'].diaries.done===3;
  const old=empParseDE(bank.replace('10','99'),'Bear Brown_bank_2026-11-20_10-00-00.json');empImportDE([old]);o.deKeepLatest=empBanks['Bear Brown'].bank.items['Rune warhammer']===10;
  const C=empBankCalc();o.bankVal=C.tot===10*25464&&C.coins===5000&&C.rows[0].na===1&&C.rows[0].total===115;
  const x=empExit(1347);o.exitShop=x.best&&x.best[0]==='PNJ'&&x.shop===29050&&x.alch===24960-239;
  // Mon empire avec banques et fiche + courbe
  empTx={u1:[WORLD,'Bear Brown',451,'Runite ore',1,10,980,Date.now()-3*864e5],u2:[WORLD,'Bear Brown',451,'Runite ore',0,10,1001,Date.now()-2*864e5]};emp.npc=[];emp.open=null;emp.f={w:'all',per:'all',who:'',src:''};
  tab='emp';render();await wait(80);let txt=document.getElementById('alertsHost').textContent;o.bankSection=/Banques et persos/.test(txt)&&/Rune warhammer/.test(txt)&&/PNJ/.test(txt);
  o.missList=true;document.querySelector('[data-empwho="Bear Brown"]').click();await wait(60);o.who=!!document.querySelector('.emp-sk');
  emp.open={id:451,w:WORLD};render();await wait(300);o.chart=!!document.querySelector('#empChart svg')&&document.querySelectorAll('#empChart polygon').length===2&&/cohérent/.test(document.querySelector('#empChart').textContent);
  // 🎯 Pics répétés
  const d=(await (await fetch('https://x/api/timeseries?id=451&lookback=7d')).json()).data;const A=pkAnalyse(451,d);o.pkMust=A&&A.touches===4&&A.cls==='must';
  const d2=(await (await fetch('https://x/api/timeseries?id=1513&lookback=7d')).json()).data;const A2=pkAnalyse(1513,d2);o.pkOdd=A2&&A2.cls==='odd';
  const d3=(await (await fetch('https://x/api/timeseries?id=385&lookback=7d')).json()).data;o.pkFlat=pkAnalyse(385,d3)===null;
  pk.res=null;tab='peaks';render();await wait(1500);txt=document.getElementById('alertsHost').textContent;
  o.pkView=/Must/.test(txt)&&/Runite ore/.test(txt)&&/Oddit/.test(txt)&&!/NaN|undefined|Infinity/.test(txt);
  document.querySelector('[data-pkf="odd"]').click();await wait(50);o.pkFilter=/Magic logs/.test(document.getElementById('alertsHost').textContent)&&!/Runite ore/.test(document.querySelector('.pk-t tbody').textContent);
  o.noNaN=!/NaN|undefined/.test(document.getElementById('alertsHost').textContent+document.getElementById('rail').textContent);
  return o});
for(const [k,v] of Object.entries(r))T(v,k);
for(const w of [560,1280]){await p.setViewportSize({width:w,height:900});for(const t of ['emp','peaks','home']){await p.evaluate(t=>{tab=t;render()},t);await p.waitForTimeout(150);T(await p.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+2),`${w} px sans débordement : ${t}`)}}
const dir=process.argv[3];if(dir){const data=fs.readdirSync(dir).filter(f=>/\.json$/.test(f)).map(f=>({n:f,t:fs.readFileSync(path.join(dir,f),'utf8')}));
  const R=await p.evaluate(data=>{empBanks={};const L=data.map(d=>empParseDE(d.t,d.n)).filter(Boolean);const im=empImportDE(L);const C=empBankCalc();
    return {files:data.length,parsed:L.length,persos:Object.keys(empBanks).length,banks:C.rows.filter(r=>r.P.bank).length,items:C.items.length}},data);
  console.log('Vrais exports :',JSON.stringify(R));T(R.parsed>0&&R.banks>0,'vrais exports lus')}
T(!errs.length,'erreurs JS : '+errs.join(' | '));console.log(`2.1 : ${ok} OK, ${ko} KO`);await b.close();process.exit(ko?1:0)})();
