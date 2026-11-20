// node tests/boss.js $PWD/test/index.html : simulateurs de boss (moteur de ticks, 4 boss, AFK, 560 px)
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];let ok=0,ko=0;const T=(c,m)=>{if(c)ok++;else{ko++;console.log('KO',m)}};
for(const w of [1280,560]){const p=await b.newPage({viewport:{width:w,height:900}});p.on('pageerror',e=>errs.push(e.message));
await p.route('**/*',r=>r.request().url().startsWith('file:')?r.continue():r.abort());
await p.goto('file://'+process.argv[2]+(w===560?'?panel=1':'?panel=0'));await p.waitForTimeout(1200);
const r=await p.evaluate(()=>{const o={};tab='boss';render();
 const run=(boss,opt,policy,ticks=400)=>{Object.assign(bossSt,{boss,diff:'real',len:'50',gap:3,zukJad:false},opt||{});const S=simNew(42);S.run=true;let now=0;
   for(let t=0;t<ticks&&!S.over;t++){now+=600;policy(S,now);simTick(S,now)}return S};
 // Jad : prière parfaite au tick suivant l'animation
 const perfect=(S,now)=>{const a=S.atk.filter(x=>!x.done).sort((x,y)=>x.hit-y.hit)[0];if(a&&a.style!=='typeless'&&S.pray!==a.style)simSetPray(S,a.style,now)};
 let S=run('jad',{},perfect);o.jadWin=S.res==='win'&&S.miss===0&&S.ok===50;o.jadReact=S.react.length>10&&S.react.every(x=>x>=0);
 S=run('jad',{},()=>{});o.jadDead=S.res==='dead'&&S.miss>0;
 // fenêtre : au tick t0+W la prière doit être là ; trop tard = raté
 S=run('jad',{diff:'hard'},(S,now)=>{const a=S.atk.find(x=>!x.done);if(a&&S.t>=a.hit-1&&S.t<a.hit){}else if(a&&S.t===a.t0+3)simSetPray(S,a.style,now)},40);o.hardLate=S.miss>0&&S.ok===0;
 S=run('jad',{len:'sd'},()=>{},40);o.sdOneMiss=S.res==='dead'&&S.miss===1;
 // intervalle 8 ticks
 S=run('jad',{len:'inf'},perfect,60);o.jad8=S.ok===Math.floor((60-3)/8)+1||S.ok===Math.floor((60-3-3)/8)+1;
 // 3 Jads : 3 attaques par cycle de 8, prière parfaite = 0 raté même à 1 tick d'écart
 for(const g of [3,2,1]){S=run('jad3',{gap:g,len:'50'},perfect);o['jad3_'+g]=S.res==='win'&&S.miss===0}
 S=run('jad3',{gap:3,len:'inf'},()=>{},30);const t0s=[];
 // Hunllef : style change toutes les 4 attaques
 Object.assign(bossSt,{boss:'hunllef',len:'50'});S=simNew(7);S.run=true;const styles=[];let now=0;for(let t=0;t<60;t++){now+=600;const n=S.atk.length;simTick(S,now);if(S.atk.length>n||S.atk.some(a=>a.t0===S.t))styles.push(S.atk.find(a=>a.t0===S.t).style)}
 o.hlSeq=styles.slice(0,9).join(',')==='range,range,range,range,mage,mage,mage,mage,range';
 S=simNew(7);S.run=true;S.hl.prot='melee';S.hl.wpn='range';now=0;let protChanged=0;for(let t=0;t<40;t++){now+=600;simTick(S,now);if(S.hl.prot==='range'&&!protChanged)protChanged=S.t}
 o.hlProt=protChanged>0&&S.hl.blocked>0;
 S=run('hunllef',{},(S,now)=>{perfect(S,now);if(S.hl.wpn===S.hl.prot)S.hl.wpn=S.hl.prot==='range'?'mage':'range'},2000);o.hlKill=S.res==='win'&&S.miss===0;
 // Zuk : abri ou pas
 S=run('zuk',{},(S,now)=>{S.z.tx=S.z.shX+2;perfect(S,now)},3000);o.zukWin=S.res==='win'&&S.miss===0&&!!S.z.jad;
 S=run('zuk',{},(S)=>{S.z.tx=S.z.shX>14?0:ZW-1},200);o.zukDead=S.res==='dead';
 S=run('zuk',{zukJad:true},()=>{},1);o.zukJadStart=!!S.z.jad&&S.z.hp===480;
 // prière : recliquer éteint
 S=simNew(1);simSetPray(S,'mage',0);simSetPray(S,'mage',0);o.toggle=S.pray===null;
 // records + historique
 bossSt.hist=[];bossSt.rec={};bossSt.boss='jad';bossSt.len='20';S=simNew(3);S.run=true;SIM=S;now=0;for(let t=0;t<300&&!S.over;t++){now+=600;perfect(S,now);simTick(S,now)}
 o.rec=bossSt.hist.length===1&&bossSt.rec[bsKey()].streak===20&&bossSt.rec[bsKey()].win>0;
 // rendu de chaque boss sans erreur, livre de prières à la vraie place
 for(const id of ['jad','jad3','hunllef','zuk']){bossSt.boss=id;SIM=null;render();simStart();for(let i=0;i<5;i++){simTick(SIM,performance.now());simDraw()}simEnd(SIM,'stop')}
 const cells=[...document.querySelectorAll('#bsPb > *')];o.pb=cells.length===30&&cells[16].dataset.pray==='mage'&&cells[17].dataset.pray==='range'&&cells[18].dataset.pray==='melee';
 // clavier
 bossSt.boss='jad';SIM=null;render();simStart();document.dispatchEvent(new KeyboardEvent('keydown',{key:'w'}));o.keyW=SIM.pray==='range';
 document.dispatchEvent(new KeyboardEvent('keydown',{key:' '}));o.space=SIM.paused===true;simEnd(SIM,'stop');
 // AFK
 o.afkBtn=!!document.getElementById('afkBtn');tab='home';render();document.getElementById('afkBtn').click();o.afk=tab==='boss'&&SIM.run&&!SIM.over;simEnd(SIM,'stop');
 const cv=document.getElementById('bsCv').getBoundingClientRect();o.fit=cv.right<=innerWidth+1&&cv.width>200;
 return o});
for(const [k,v] of Object.entries(r))T(v,w+' '+k);await p.close()}
const p=await b.newPage();await p.route('**/*',r=>r.request().url().startsWith('file:')?r.continue():r.abort());await p.goto('file://'+process.argv[2]+'?afk=1');await p.waitForTimeout(1500);
T(await p.evaluate(()=>tab==='boss'&&SIM&&SIM.run&&SIM.t>0),'?afk=1 lance le boss sans prix');
T(!errs.length,'erreurs JS : '+errs.join(' | '));console.log(ok+' OK, '+ko+' KO');await b.close()})();
