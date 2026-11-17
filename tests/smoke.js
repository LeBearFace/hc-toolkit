const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];
p.on('pageerror',e=>errs.push('PAGEERR '+e.message));p.on('console',m=>{if(m.type()==='error')errs.push('CONSOLE '+m.text().slice(0,200))});
await p.route('**/*',r=>r.request().url().startsWith('file:')?r.continue():r.abort());
await p.goto('file://'+process.argv[2]);await p.waitForTimeout(2500);
const tabs=await p.evaluate(()=>Object.keys(VIEWS));console.log("tabs",tabs.join(","));
for(const t of tabs){try{await p.evaluate(t=>{tab=t;render()},t);await p.waitForTimeout(300)}catch(e){errs.push('CLICK '+t+' '+e.message)}}
console.log([...new Set(errs.filter(e=>!/net::ERR_FAILED|Failed to fetch|ERR_INTERNET/.test(e)))].join('\n')||'no js errors');await b.close()})();
