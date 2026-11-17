// Test hors ligne du module Équipement : node tests/equip.js $PWD/index.html /chemin/equipment.json /chemin/monsters.json /chemin/fixture-prix.json
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const [,,page,eqf,monf,fixf]=process.argv;const b=await chromium.launch();const p=await b.newPage({viewport:{width:1400,height:900}});const errs=[];
p.on('pageerror',e=>errs.push('PAGEERR '+e.message));p.on('console',m=>{if(m.type()==='error')errs.push('CONSOLE '+m.text().slice(0,200))});
await p.route('**/*',r=>{const u=r.request().url();if(u.startsWith('file:'))return r.continue();
  if(u.endsWith('equipment.json'))return r.fulfill({body:fs.readFileSync(eqf),contentType:'application/json'});
  if(u.endsWith('monsters.json'))return r.fulfill({body:fs.readFileSync(monf),contentType:'application/json'});return r.abort()});
await p.goto('file://'+page);await p.waitForTimeout(2000);
const fx=JSON.parse(fs.readFileSync(fixf));
await p.evaluate(fx=>{MAP={};BYNAME={};fx.map.forEach(m=>{MAP[m.id]=m;BYNAME[m.name.toLowerCase()]=m.id});LAT=fx.lat;lastUpdate=Date.now();
  profile.name='Testeur';['Attack','Strength','Defence','Ranged','Prayer','Hitpoints','Magic'].forEach((s,i)=>profile.xp[s]=xpAt([60,60,55,60,43,60,40][i]));
  tab='equip';render()},fx);
await p.waitForFunction(()=>!!EQ,null,{timeout:30000});await p.waitForTimeout(500);
const T=Date.now();
const out=await p.evaluate(()=>{const R={};const t0=performance.now();render();R.renderMs=Math.round(performance.now()-t0);
  const find=n=>EQ.find(x=>x.n===n&&!x.v)||EQ.find(x=>x.n===n);
  // 1) whip, 99/99, sans prière ni équipement, cible déf 1 bonus 0
  eqSt.o.lv={Attack:99,Strength:99,Defence:99,Ranged:99,Magic:99,Prayer:1,Hitpoints:99};eqSt.o.pray='none';eqSt.o.pot='none';
  const tgt=Object.assign({},EQ_TRAIN,{def:1});
  R.whip=eqEval({weapon:find('Abyssal whip')},tgt,'melee');
  R.msb=eqEval({weapon:find('Magic shortbow'),ammo:find('Rune arrow')},tgt,'ranged');
  R.rcb=eqEval({weapon:find('Rune crossbow'),ammo:find('Runite bolts')},tgt,'ranged');
  R.rcbDragonBolt=eqAmmoOk(find('Rune crossbow'),find('Dragon bolts'));R.msbDragon=eqAmmoOk(find('Magic shortbow'),find('Dragon arrow'));
  eqSt.o.lv=null;eqSt.o.pray='auto';
  // 2) plan frost dragon, budget 2M, équilibré
  eqSt.o.mon='Frost dragon';eqSt.o.style='melee';eqSt.cur.melee={};eqSt.o.mode='equilibre';eqCache={};
  const t1=performance.now();render();R.renderFrostMs=Math.round(performance.now()-t1);
  R.plan=eqLastPlan.res.steps.map(s=>s.slot+':'+eqName(s.it)+':'+s.cost);R.spent=eqLastPlan.res.spent;R.planR={dps:eqLastPlan.res.r.dps,hp:eqLastPlan.res.r.hpLost,fire:eqLastPlan.res.r.fire};
  R.tiers=eqLastPlan.tiers.map(x=>x.S+' '+x.T+' '+(x.it?eqName(x.it):'-'));R.free=eqLastPlan.free.map(x=>eqName(x.it));
  R.auto=eqLastAuto.map(a=>a.name+' '+Object.keys(a.ids).length);
  eqSt.o.style='ranged';eqCache={};render();R.planRanged=eqLastPlan.res.steps.map(s=>s.slot+':'+eqName(s.it)+(s.extra?'+'+eqName(s.extra):'')+':'+s.cost);
  R.nan=/NaN|undefined/.test(document.getElementById('alertsHost').innerText);
  return R});
console.log(JSON.stringify(out,null,1));
// clics
await p.evaluate(()=>{eqSt.o.style='melee';eqSave();render()});
for(const s of ['head','body','weapon','shield']){await p.click(`[data-eqslot="${s}"]`);await p.waitForTimeout(200);const r=await p.$('[data-eqpick]');if(r)await r.click();await p.waitForTimeout(200)}
await p.click('[data-eqa="apply"]').catch(()=>{});await p.waitForTimeout(300);
await p.screenshot({path:'/tmp/eq.png',fullPage:true});
console.log([...new Set(errs.filter(e=>!/net::ERR_FAILED|Failed to fetch|ERR_INTERNET|ERR_ABORTED/.test(e)))].join('\n')||'no js errors');await b.close()})();
