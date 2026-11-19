// node tests/guides.js $PWD/test/index.html : module 📚 Guides (cases, filtres, création, coches auto, nœuds bloqués)
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1300,height:900}});const errs=[];let ok=0,ko=0;
const t=(c,m)=>{if(c){ok++;console.log('OK  '+m)}else{ko++;console.log('KO  '+m)}};
p.on('pageerror',e=>errs.push(e.message));p.on('dialog',d=>d.accept());
await p.route('**/*',r=>r.request().url().startsWith('file:')?r.continue():r.abort());
await p.goto('file://'+process.argv[2]);await p.waitForTimeout(2000);
await p.evaluate(()=>{tab='guides';render()});await p.waitForTimeout(200);
t(await p.locator('#rail [data-tab=guides]').count()===1,'onglet présent dans la barre latérale');
t(await p.locator('.gdcard').count()===7,'7 guides affichés (1 prêt + 6 à venir)');
t(await p.locator('.gdsteps li').count()>=40,'guide Bearinda : au moins 40 étapes');
t((await p.locator('.gdnow li').count())===3,'« À faire maintenant » propose 3 étapes');
// cocher Clock Tower
await p.locator('[data-gdck="bearinda-quetes|clock"]').last().check();await p.waitForTimeout(100);
t(await p.evaluate(()=>gdSt.done['bearinda-quetes'].clock===true),'case cochée enregistrée');
t(JSON.parse(await p.evaluate(()=>localStorage.getItem('hcx_gdSt'))).done['bearinda-quetes'].clock===true,'sauvegardée dans localStorage (hcx_gdSt)');
t((await p.locator('.gdcard.on').innerText()).includes('1/'),'barre de progression mise à jour');
// Perilous Moons bloqué tant que les nœuds manquent
t((await p.locator('li:has([data-gdck="bearinda-quetes|moons"]) .pill.warn').allInnerTexts()).some(x=>x.includes('🔒')),'Perilous Moons affiché 🔒 (besoins manquants)');
// perso chargé : coches auto
await p.evaluate(()=>{profile.name='Bearinda';profile.xp={Slayer:xpAt(15),Hunter:xpAt(21),Fishing:xpAt(37),Runecraft:xpAt(23),Construction:xpAt(16),Herblore:xpAt(21),Cooking:xpAt(30),Ranged:xpAt(25)};profile.quests={'Ghosts Ahoy':2,"Twilight's Promise":0};render()});
t(await p.evaluate(()=>gdNode(GUIDES[0],gdSteps(GUIDES[0]).find(x=>x.id==='hunt20')).auto),'Hunter 20 coché tout seul (21)');
t(!(await p.evaluate(()=>gdNode(GUIDES[0],gdSteps(GUIDES[0]).find(x=>x.id==='slay48')).done)),'Slayer 48 pas coché (15)');
t(await p.evaluate(()=>gdNode(GUIDES[0],gdSteps(GUIDES[0]).find(x=>x.id==='ghosts')).auto),'Ghosts Ahoy coché via WikiSync');
t((await p.locator('li:has([data-gdck="bearinda-quetes|fisles"]) .pill.warn').allInnerTexts()).some(x=>x.includes('16/46')),'Fremennik Isles : « Construction 16/46 »');
// décocher une coche auto = forcer non fait
await p.locator('[data-gdck="bearinda-quetes|hunt20"]').uncheck();await p.waitForTimeout(100);
t(await p.evaluate(()=>gdSt.done['bearinda-quetes'].hunt20===false),'décocher une coche auto la force à « pas fait »');
await p.locator('[data-gdck="bearinda-quetes|hunt20"]').check();await p.waitForTimeout(100);
t(await p.evaluate(()=>gdSt.done['bearinda-quetes'].hunt20===undefined),'recocher rend la main à WikiSync');
// filtres
await p.selectOption('[data-gdf=cat]','prayer');await p.waitForTimeout(100);
t(await p.locator('.gdcard').count()===2,'filtre Prière : 2 guides');
await p.locator('[data-gdf=showSoon]').uncheck();await p.waitForTimeout(100);
t(await p.locator('.gdcard').count()===0,'masquer les guides à venir');
await p.locator('[data-gdf=showSoon]').check();await p.selectOption('[data-gdf=cat]','all');
// guide à venir : phrase à copier
await p.locator('[data-gdopen="prayer-43"]').click();await p.waitForTimeout(100);
t((await p.locator('.gdask').innerText()).includes('Prière 43'),'guide à venir : phrase à donner à Claude');
// création
await p.locator('[data-gda=new]').first().click();await p.fill('#gdnT','Test Agilité');await p.fill('#gdnP','Bear Brown');await p.selectOption('#gdnC','agility');
await p.fill('#gdnS','# Début\nGnome course\nDraynor rooftop\n# Suite\nCanifis');await p.locator('[data-gda=create]').click();await p.waitForTimeout(100);
t(await p.locator('.gdh4').count()===2&&await p.locator('.gdsteps li').count()===3,'guide perso créé : 2 sections, 3 étapes');
t(JSON.parse(await p.evaluate(()=>localStorage.getItem('hcx_myGuides'))).length===1,'guide perso sauvegardé (hcx_myGuides)');
await p.locator('[data-gda=del]').click();await p.waitForTimeout(100);
t(await p.evaluate(()=>myGuides.length===0),'guide perso supprimé');
// épingler / désépingler
await p.locator('[data-gdopen="bearinda-quetes"]').click();await p.locator('[data-gda=pin]').click();await p.waitForTimeout(100);
t(await p.locator('.gdnow').count()===0,'désépinglé : plus de « À faire maintenant »');
// mode panneau étroit
await p.setViewportSize({width:560,height:900});await p.evaluate(()=>render());await p.waitForTimeout(200);
t(await p.evaluate(()=>document.documentElement.scrollWidth<=580),'tient dans 560 px (mode panneau)');
t(errs.length===0,'aucune erreur JS'+(errs.length?' : '+errs.join(' | '):''));
console.log(`\n${ok} OK, ${ko} KO`);await b.close();process.exit(ko?1:0)})();
