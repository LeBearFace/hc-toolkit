// node tests/empire.js $PWD/test/index.html [dossier flipping-utilities réel] : 🏦 Mon empire (import dossier, FIFO multi-persos, tests de marché, ventes PNJ, chronos, Vitrine, 560 px)
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:900}});const errs=[];let ok=0,ko=0;const T=(c,m)=>{if(c)ok++;else{ko++;console.log('KO',m)}};
p.on('pageerror',e=>errs.push(e.message));
await p.route('**/*',r=>r.request().url().startsWith('file:')?r.continue():r.abort());
await p.goto('file://'+process.argv[2]+'?panel=0');await p.waitForTimeout(1200);
const r=await p.evaluate(async()=>{const o={};const wait=ms=>new Promise(r=>setTimeout(r,ms));
  const names={1347:'Rune warhammer',22000:'Broken dragon hook',385:'Shark',451:'Runite ore'};
  for(const id in names){MAP[id]={id:+id,name:names[id],icon:'x.png',value:41600};BYNAME[names[id].toLowerCase()]=+id}
  MAP[385].value=300;LAT[1347]={high:25000,low:24000};LAT[451]={high:11000,low:10800};
  SHOPS.push({shop:'Test smithy',item:'Rune warhammer',buy:16640,delta:30,stock:Infinity});
  empTx={};emp.npc=[];emp.chr=[];emp.ses=[];emp.marks={};emp.rules={on:false,min:1000,one:false,items:[]};emp.f={w:'all',per:'all',who:'',src:''};emp.open=null;
  const T0=Date.now()-5*864e5;const off=(b,id,q,p,t,u)=>({uuid:u,b,id,cQIT:q,p,t,s:1,st:b?'BOUGHT':'SOLD'});
  const fu=(trades)=>JSON.stringify({version:1,trades,sessionStartTime:T0});
  // jeu normal : Bearmoule achète 10 marteaux, Bearinda en revend 6 (taxe 2 %), 1 test à 1 gp ; Bear Final vend 2 hooks jamais achetés (butin)
  const A=fu([{id:1347,name:'Rune warhammer',h:{sO:[off(true,1347,4,20000,T0,'u1'),off(true,1347,10,20000,T0+1000,'u1')]}}]);
  const B=fu([{id:1347,name:'Rune warhammer',h:{sO:[off(false,1347,6,25000,T0+3600e3,'u2'),off(false,1347,1,1,T0+7200e3,'u3')]}}]);
  const C=fu([{id:22000,name:'Broken dragon hook',h:{sO:[off(false,22000,2,30000000,T0,'u4')]}}]);
  const H=fu([{id:385,name:'Shark',h:{sO:[off(true,385,100,400,T0,'h1'),off(false,385,100,450,T0+60e3,'h2')]}}]);
  let L=empParseFU(A,'flipping-utilities/Bearmoule.json');o.parse=L.length===1&&L[0].q===10&&L[0].w==='osrs'&&L[0].who==='Bearmoule';
  o.backup=empParseFU(A,'flipping-utilities/Bearmoule.backup.json')[0].who==='Bearmoule';
  o.accountwide=empParseFU(A,'flipping-utilities/accountwide.json').length===0;
  o.hcPath=empParseFU(H,'flipping-utilities\\hc\\Bearinda.json').every(x=>x.w==='hc'&&x.who==='Bearinda');
  o.bad=empParseFU('pas du json','x.json')===null;
  let im=empImport(L.concat(empParseFU(B,'flipping-utilities/Bearinda.json'),empParseFU(C,'flipping-utilities/Bear Final.json'),empParseFU(H,'flipping-utilities/hc/Bearinda.json')));
  o.import=im.add===6&&im.upd===0;
  o.reimport=empImport(empParseFU(A,'flipping-utilities/Bearmoule.backup.json')).add===0;
  let Cc=empCalc();const wh=Cc.items.find(x=>x.id===1347&&x.w==='osrs');
  const net=25000-500;o.fifo=Math.round(wh.real)===6*net-6*20000+(1-20000)&&wh.q===3&&wh.cost===60000;
  o.loot=Cc.items.find(x=>x.id===22000).loot===2*(30000000-Math.min(600000,5e6));
  o.hcNoTax=Cc.items.find(x=>x.id===385&&x.w==='hc').real===5000;
  o.perWho=Math.round(Cc.who['Bearinda'].real)===6*net-120000+(1-20000)+5000&&Cc.who['Bearmoule'].buy===200000;
  // 🧪 tests de marché
  emp.rules.on=true;Cc=empCalc();o.hideMin=Cc.hidden===1&&Cc.items.find(x=>x.id===1347&&x.w==='osrs').q===4;
  emp.rules.on=false;emp.rules.items=[{id:1347,side:'s',lo:0,hi:1000}];Cc=empCalc();o.hideRule=Cc.hidden===1;
  emp.rules.items=[];emp.marks['u3']=1;Cc=empCalc();o.hideMark=Cc.hidden===1&&Object.keys(empTx).length===6;
  emp.rules.one=true;o.hideOne=empCalc().hidden===1;emp.rules.one=false;
  // filtres
  emp.f.w='hc';o.fW=empCalc().items.every(x=>x.w==='hc');emp.f.w='all';
  emp.f.src='gws';o.fSrc=empCalc().items.every(x=>x.id===22000);emp.f.src='';
  emp.f.who='Bear Final';o.fWho=Math.round(empCalc().S.real)===0&&empCalc().S.loot>0;emp.f.who='';
  // ventes PNJ : 1re vente 16640 (40 %), puis -3 % de la valeur par vente
  o.npcPrice=empNpcPrice('Test smithy',1347,0)===16640&&empNpcPrice('Test smithy',1347,1)===Math.floor(41600*(40-3)/100);
  o.npcRev=empNpcRev('Test smithy',1347,4,2)===2*(16640+Math.floor(41600*.37));
  o.shopsFor=empShopsFor(1347)[0]==='Test smithy';
  empAddNpc({id:1347,q:3,rev:45000,shop:'Test smithy',who:'Bearinda',w:'osrs',t:T0+8e6});Cc=empCalc();o.npcFifo=Cc.items.find(x=>x.id===1347&&x.w==='osrs').q===1&&Cc.S.sellNpc===45000;
  // chronos
  emp.chr.push({k:'c1',name:'Tournée',who:'',acc:0,on:Date.now()-3600e3,a:T0-1});tab='emp';render();await wait(50);
  document.querySelector('[data-empc="stop"]').click();await wait(50);
  o.chrStop=emp.ses.length===1&&emp.chr.length===0&&Math.abs(emp.ses[0].dur-3600e3)<5000;
  const g=empSesGain(emp.ses[0]);o.chrGain=g.tot>0&&g.gph!=null;
  // rendu
  render();await wait(100);let txt=document.getElementById('alertsHost').textContent;
  o.view=/Mon empire|Ce qui marche/.test(txt)&&/Ce qui ne marche pas/.test(txt)&&/Par mois/.test(txt)&&/Chronos/.test(txt);
  o.noNaN=!/NaN|undefined|Infinity/.test(txt);o.tests=/masqué/.test(txt);
  document.querySelector('[data-empid]').click();await wait(80);o.detail=!!document.querySelector('#empDet');
  o.markBtn=!!document.querySelector('[data-empmark]');
  // formulaire PNJ
  const it=document.querySelector('#empNIt');it.value='Rune warhammer';it.dispatchEvent(new Event('change',{bubbles:true}));await wait(80);
  const q=document.querySelector('#empNQ');q.value='2';q.dispatchEvent(new Event('change',{bubbles:true}));await wait(80);
  o.npcForm=document.querySelector('#empNRev').value===String(16640+Math.floor(41600*.37));
  document.querySelector('#empNpcForm').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));await wait(80);o.npcAdd=emp.npc.length===2;
  // CSV
  let csv=null;const oc=URL.createObjectURL;URL.createObjectURL=bl=>{csv=bl;return 'blob:x'};empCsv();URL.createObjectURL=oc;o.csv=!!csv&&(await csv.text()).split('\n').length===1+6+2;
  // Vitrine : « Pack vendu »
  vtPackWin({shop:'Test smithy',items:[{id:1347,name:'Rune warhammer',Q:4,P:20000,first:16640,per:2,profit:1}],profit:1,cost:1,perWorld:1,min:5,gph:1,wmax:2,fixed:false});
  const sb=document.querySelector('#vtSold');o.vtBtn=!!sb;if(sb){sb.click();o.vtSold=emp.npc.length===3&&emp.npc[2].rev===2*(16640+Math.floor(41600*.37))}
  // 560 px
  return o});
for(const [k,v] of Object.entries(r))T(v,k);
await p.setViewportSize({width:560,height:900});await p.evaluate(()=>{tab='emp';render()});await p.waitForTimeout(150);
T(await p.evaluate(()=>document.documentElement.scrollWidth<=562),'560 px sans débordement');
// vraies données (facultatif)
const dir=process.argv[3];if(dir){const files=[];const walk=d=>fs.readdirSync(d,{withFileTypes:true}).forEach(e=>{const f=path.join(d,e.name);if(e.isDirectory())walk(f);else if(/\.json$/.test(e.name))files.push(f)});walk(dir);
  const data=files.map(f=>({n:'flipping-utilities/'+path.relative(dir,f).split(path.sep).join('/'),t:fs.readFileSync(f,'utf8')}));
  const t0=Date.now();const R=await p.evaluate(async data=>{empTx={};emp.npc=[];emp.marks={};emp.rules={on:false,min:1000,one:false,items:[]};
    let all=[];data.forEach(d=>{const L=empParseFU(d.t,d.n);if(L)all=all.concat(L)});const im=empImport(all);
    const out={add:im.add,files:data.length};for(const w of ['hc','osrs']){emp.f={w,per:'all',who:'',src:''};const C=empCalc();out[w]={real:Math.round(C.S.real),buy:C.S.buy,loot:Math.round(C.S.loot),n:C.S.n}}
    emp.f={w:'osrs',per:'all',who:'',src:'gws'};out.gws=Math.round(empCalc().S.loot+empCalc().S.real);
    emp.rules.on=true;emp.f={w:'all',per:'all',who:'',src:''};out.hidden=empCalc().hidden;emp.rules.on=false;
    tab='emp';emp.f={w:'all',per:'30',who:'',src:''};render();await new Promise(r=>setTimeout(r,100));out.txtOk=!/NaN|undefined|Infinity/.test(document.getElementById('alertsHost').textContent);
    out.size=JSON.stringify(empTx).length;out.saved=empSaveTx();return out},data);
  console.log('Vraies données :',JSON.stringify(R),'en',Date.now()-t0,'ms');T(R.txtOk&&R.saved,'vraies données : rendu et sauvegarde')}
T(!errs.length,'erreurs JS : '+errs.join(' | '));
console.log(`empire : ${ok} OK, ${ko} KO`);await b.close();process.exit(ko?1:0)})();
