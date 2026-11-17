const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];
p.on('pageerror',e=>errs.push('PAGEERR '+e.message));
await p.route('**/*',r=>r.request().url().startsWith('file:')?r.continue():r.abort());
await p.goto('file://'+process.argv[2]);await p.waitForTimeout(1500);
const R={};
await p.evaluate(()=>{tab='atelier';render()});
R.sections=await p.$$eval('.atl .box h3',a=>a.map(x=>x.textContent.trim().slice(0,30)));
R.nSettings=await p.$$eval('[data-set]',a=>a.length);
// masquer « Flips »
await p.click('[data-mod="flips"]');
R.railHasFlips=await p.$$eval('#rail [data-tab="flips"]',a=>a.length);
R.hiddenStored=await p.evaluate(()=>localStorage.getItem('hcx_hidden'));
// masquer tout le groupe Bourse sauf rien
for(const t of ['big','hits','favs','all'])await p.click(`[data-mod="${t}"]`);
R.groupGe=await p.$$eval('#rail [data-group="ge"]',a=>a.length);
await p.evaluate(()=>{tab='flips';render()});R.tabAfterHidden=await p.evaluate(()=>tab);
await p.evaluate(()=>{tab='atelier';render()});
await p.click('#atlShowAll');R.railFlipsBack=await p.$$eval('#rail [data-tab="flips"]',a=>a.length);
// réglage numérique
await p.fill('[data-set="advCap"]','5000000');await p.dispatchEvent('[data-set="advCap"]','change');
R.advCap=await p.evaluate(()=>settings.advCap);R.stored=await p.evaluate(()=>JSON.parse(localStorage.getItem('hcx_settings')).advCap);
R.changedRows=await p.$$eval('tr.atl-ch',a=>a.length);
await p.waitForTimeout(50);await p.click('[data-reset="advCap"]');R.advCapReset=await p.evaluate(()=>settings.advCap);
// select + checkbox
await p.selectOption('[data-set="advRisk"]','3');await p.waitForTimeout(50);R.advRisk=await p.evaluate(()=>settings.advRisk);
await p.click('[data-set="kGloves"]');await p.waitForTimeout(50);R.kGloves=await p.evaluate(()=>settings.kGloves);
// defaults intacts
R.defaultsIntact=await p.evaluate(()=>DEFAULTS.advRisk===1&&DEFAULTS.kGloves===false&&JSON.stringify(DEFAULTS.shipCore)==='{}');
// tout remettre (2 clics)
await p.click('#atlResetAll');R.afterOne=await p.evaluate(()=>settings.advRisk);await p.click('#atlResetAll');
R.afterReset=await p.evaluate(()=>[settings.advRisk,settings.kGloves]);
// idées
await p.fill('#ideaIn','alerte Uncut jade < 40 gp');await p.press('#ideaIn','Enter');
await p.fill('#ideaIn','vue 10 persos');await p.click('#ideaAdd');
R.ideas=await p.evaluate(()=>ideas.map(x=>x.t));await p.click('[data-idone="0"]');await p.waitForTimeout(50);R.done=await p.evaluate(()=>ideas[0].done);
await p.click('[data-idel="1"]');R.ideasAfterDel=await p.evaluate(()=>ideas.length);
// sauvegarde inclut hidden/ideas
R.backupKeys=await p.evaluate(()=>Object.keys(backupData().data).join(','));
// mode panneau
await p.evaluate(()=>{document.body.classList.add('compact');tab='atelier';render()});
// palette
await p.evaluate(()=>{hiddenMods.add('flips');openPalette()});R.palHasFlips=await p.$$eval('.pal-i',a=>a.some(x=>/Flips/.test(x.textContent)));
await p.evaluate(()=>closePalette());
// gear button
await p.evaluate(()=>{tab='home';render()});await p.evaluate(()=>document.querySelector('#menu').open=true);await p.click('#menu [data-tab="atelier"]');R.gearGoes=await p.evaluate(()=>tab);
console.log(JSON.stringify(R,null,1));console.log(errs.join('\n')||'no js errors');await b.close()})();
