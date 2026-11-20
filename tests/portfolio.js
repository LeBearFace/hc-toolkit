// node tests/portfolio.js $PWD/test/index.html : 💼 Mon portefeuille (saisie, FIFO, import Flipping Utilities et banque, alertes silencieuses, graphique)
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:900}});const errs=[];let ok=0,ko=0;const T=(c,m)=>{if(c)ok++;else{ko++;console.log('KO',m)}};
p.on('pageerror',e=>errs.push(e.message));
const NOW=Math.floor(Date.now()/1000);
await p.route('**/*',r=>{const u=r.request().url();if(u.startsWith('file:'))return r.continue();
  const m=u.match(/timeseries\?id=(\d+)&lookback=(\w+)/);
  if(m){const n=m[2]==='7d'?168:120,st=m[2]==='7d'?3600:21600,d=[];for(let i=0;i<n;i++)d.push({timestamp:NOW-(n-1-i)*st,avgHighPrice:1000+i,avgLowPrice:990+i,highPriceVolume:50,lowPriceVolume:50});return r.fulfill({contentType:'application/json',body:JSON.stringify({data:d})})}
  return r.abort()});
await p.goto('file://'+process.argv[2]+'?panel=0');await p.waitForTimeout(1200);
const r=await p.evaluate(async()=>{const o={};const wait=ms=>new Promise(r=>setTimeout(r,ms));
  const names={451:'Runite ore',1513:'Magic logs',385:'Shark',2:'Sans prix'};
  for(const id in names){MAP[id]={id:+id,name:names[id],icon:'x.png',members:true};BYNAME[names[id].toLowerCase()]=+id}
  LAT[451]={high:12000,low:11900};LAT[1513]={high:1000,low:990};LAT[385]={high:400,low:380};delete LAT[2];
  D24[451]={avgHighPrice:11000,avgLowPrice:10900,highPriceVolume:500,lowPriceVolume:500};D24[1513]={avgHighPrice:1000,avgLowPrice:990};
  let beeps=0;beep=()=>{beeps++};
  pf.tx=[];pf.fired={};pf.mode='bal';pf.notif=false;pf.who='Bearmoule';alertLog=[];
  tab='pf';render();await wait(100);
  o.view=!!document.querySelector('#pfForm')&&/Mon portefeuille|portefeuille/i.test(document.body.textContent);
  // saisie : prix pré-rempli
  const it=document.querySelector('#pfIt');it.value='Runite ore';it.dispatchEvent(new Event('input',{bubbles:true}));
  o.prefill=document.querySelector('#pfP').value==='12000';
  document.querySelector('#pfQ').value='500';document.querySelector('#pfP').value='10850';
  document.querySelector('#pfForm').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));await wait(150);
  o.added=pf.tx.length===1&&pf.tx[0].q===500&&pf.tx[0].p===10850&&pf.tx[0].who==='Bearmoule'&&pf.tx[0].w===WORLD;
  // FIFO : 2e achat plus cher, vente de 600 -> prend les 500 vieux + 100 nouveaux
  pfAddTx({id:451,s:'b',q:200,p:11500,t:Date.now()-1000});pfAddTx({id:451,s:'s',q:600,p:12000,t:Date.now()});
  let R=pfBook(pf.tx).find(x=>x.id===451);o.fifoQ=R.q===100&&R.avg===11500;
  o.fifoReal=Math.round(R.real)===Math.round(600*pfNet(12000,WORLD)-(500*10850+100*11500));
  o.taxOsrs=pfNet(12000,'osrs')===11760&&pfNet(12000,'hc')===12000&&pfNet(40,'osrs')===40&&pfNet(5e8,'osrs')===5e8-5e6;
  // Flipping Utilities (format Gson réel : Instant = {seconds,nanos})
  const sec=Math.floor(Date.now()/1000)-86400;
  const fu={trades:[{id:1513,name:'Magic logs',h:{sO:[{b:true,id:1513,cQIT:2000,p:900,t:{seconds:sec,nanos:5e8},s:2,st:'BOUGHT',tAA:1,tSFO:100,tQIT:2000,vSQ:true}]}},
    {id:385,name:'Shark',h:{sO:[{b:true,id:385,cQIT:300,p:450,t:{seconds:sec+60,nanos:0},s:1,st:'BUYING',tSFO:10,tQIT:800}]}}],sessionStartTime:{seconds:sec,nanos:0}};
  let L=pfParseFU(JSON.stringify(fu),'Bear Brown.json');o.fuParse=L.length===2&&L[0].who==='Bear Brown'&&L[0].t===sec*1000+500&&L[0].s==='b';
  let im=pfImportFU(L);o.fuAdd=im.add===2&&im.upd===0;
  fu.trades[1].h.sO[0].cQIT=800;fu.trades[1].h.sO[0].t={seconds:sec+600,nanos:0};fu.trades[1].h.sO[0].tSFO=910;  // même échange, terminé plus tard
  im=pfImportFU(pfParseFU(JSON.stringify(fu),'Bear Brown.json'));o.fuUpdate=im.add===0&&im.upd===1&&pf.tx.filter(x=>x.id===385).length===1&&pf.tx.find(x=>x.id===385).q===800;
  o.fuOld=pfParseFU(JSON.stringify({'Bearinda':fu}),'trades.json').every(x=>x.who==='Bearinda');
  o.fuAccountwide=pfImportFU(pfParseFU(JSON.stringify(fu),'accountwide.json')).add===0;
  o.fuBad=pfParseFU('pas du json','x.json')===null;
  // banque : seulement le surplus, au prix du moment, « estimé » ; coins et objets inconnus ignorés
  const bank=JSON.stringify([{id:1513,quantity:2500,name:'Magic logs'},{id:995,quantity:1e6},{id:999999,quantity:3},{id:2,quantity:4}]);
  pf.who='Bear Brown';const have=pfParseBank(bank);o.bankParse=have[1513]===2500&&!have[995]&&!have[999999]&&have[2]===4;
  im=pfImportBank(have,'Bear Brown');const est=pf.tx.find(x=>x.id===1513&&x.est);o.bankSurplus=im.add===2&&est&&est.q===500&&est.p===1000;
  o.bankAgain=pfImportBank(pfParseBank(bank),'Bear Brown').add===0;
  o.bankTsv=pfParseBank('Item id\tItem name\tItem quantity\n1513\tMagic logs\t7\n385\tShark\t3')[385]===3;
  // alertes : Magic logs moy. 920 (2000 à 900 + 500 estimés à 1000), se vend 1000 => +8,7 % (⚖️ seuil 8 %) ; Shark 450 -> 380 = -15,6 % (seuil -10 %) ; Runite +6 % vs moy. 24 h
  pf.fired={};alertLog=[];document.querySelector('#toasts').innerHTML='';LAT[1513]={high:1010,low:1000};
  checkAlerts();await wait(50);
  const msgs=alertLog.map(a=>a.msg).join(' | ');
  o.alertUp=/Magic logs a pompé/.test(msgs);o.alertDown=/Shark chute/.test(msgs);o.alertFast=/Runite ore grimpe vite/.test(msgs);
  o.toast=document.querySelectorAll('#toasts .toast').length>=3;o.silent=beeps===0;
  const n=alertLog.length;checkAlerts();o.noRepeat=alertLog.length===n;
  LAT[1513]={high:1100,low:1090};checkAlerts();o.nextStep=alertLog.slice(0,alertLog.length-n).some(a=>/Magic logs a pompé : \+18/.test(a.msg));
  // seuil en gp : un objet à 3 gp qui passe à 5 gp (+66 %) ne sonne pas pour 100 unités
  MAP[3]={id:3,name:'Cheap arrow',icon:'x.png'};LAT[3]={high:5,low:5};D24[3]={avgLowPrice:3};pfAddTx({id:3,s:'b',q:100,p:3});const n2=alertLog.length;checkAlerts();o.minGp=!alertLog.slice(0,alertLog.length-n2).some(a=>/Cheap arrow/.test(a.msg));
  // rendu
  render();await wait(100);const txt=document.getElementById('alertsHost').textContent;
  o.noNaN=!/NaN|undefined/.test(txt);o.na=/N\/A/.test(txt);o.estPill=/estimé/.test(txt);o.byWho=/Par perso/.test(txt);
  document.querySelector('tr[data-pfid="1513"]').click();await wait(400);
  o.detail=pf.open===1513&&!!document.querySelector('#pfDet svg.chart polygon')&&/Journal/.test(document.querySelector('#pfDet').textContent);
  // tout vendu -> position fermée, réalisé
  document.querySelector('[data-pfa="sellall"]').click();await wait(50);
  R=pfBook(pf.tx).find(x=>x.id===1513&&x.w===WORLD);o.sellAll=R.q===0&&R.real>0;
  // suppression en 2 clics
  const k=pf.tx[pf.tx.length-1].k;document.querySelector(`[data-pfdel="${k}"]`).click();o.del1=pf.tx.some(x=>x.k===k);
  document.querySelector(`[data-pfdel="${k}"]`).click();o.del2=!pf.tx.some(x=>x.k===k);
  // autre monde : affiché grisé N/A, pas caché
  pfAddTx({id:385,s:'b',q:5,p:700,w:WORLD==='hc'?'osrs':'hc'});pfSave();render();await wait(50);o.otherWorld=/change de monde/.test(document.getElementById('alertsHost').textContent);
  // vers 🔮
  pf.open=385;render();await wait(50);document.querySelector('[data-pfa="fut"]').click();await wait(50);o.toFutur=tab==='futur'&&futSt.id===385;
  // persistance
  o.saved=(store.get('pf',{}).tx||[]).length===pf.tx.length;
  tab='pf';render();
  return o});
for(const [k,v] of Object.entries(r))T(v,k);
await p.setViewportSize({width:560,height:900});await p.evaluate(()=>{store.set('compact',true);applyCompact();render()});await p.waitForTimeout(300);
T(await p.evaluate(()=>[...document.querySelectorAll('#alertsHost .box')].every(b=>b.getBoundingClientRect().right<=innerWidth+1)),'560 px tient dans l\'écran');
T(!errs.length,'erreurs JS : '+errs.join(' / '));
console.log(`portefeuille : ${ok} OK, ${ko} KO`);await b.close();process.exit(ko?1:0)})();
