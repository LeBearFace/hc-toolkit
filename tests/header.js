const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const res=[];
for(const [w,compact] of [[560,true],[700,false],[827,false],[1000,false],[1200,false],[1280,false],[1500,false]]){
 const p=await b.newPage({viewport:{width:w,height:900}});await p.route('**/*',r=>r.request().url().startsWith('file:')?r.continue():r.abort());
 await p.goto('file://'+process.argv[2]+(compact?'?panel=1':'?panel=0'));await p.waitForTimeout(800);
 const r=await p.evaluate(()=>{const ids=['q','palBtn','refresh','auto','compactBtn','menu'];const o={};ids.forEach(i=>{const e=document.getElementById(i);if(!e){o[i]='absent';return}const r=e.getBoundingClientRect();o[i]=r.width===0?'caché':(r.right<=innerWidth+1&&r.left>=0?Math.round(r.width):'HORS ÉCRAN')});o.hh=document.getElementById('hd').offsetHeight;return o});
 res.push(w+(compact?' panneau':'')+' '+JSON.stringify(r));await p.close()}
console.log(res.join('\n'));await b.close()})();
