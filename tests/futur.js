// node tests/futur.js $PWD/test/index.html : 🔮 Le futur (séries fictives servies à la place de l'API)
const {chromium}=require('playwright');
const NOW=Math.floor(Date.UTC(2026,10,20,4,0,0)/1000/3600)*3600;
function rnd(s){return()=>{s=(s*16807)%2147483647;return s/2147483647}}
function series(kind,look,normal){const step=look==='30d'?21600:look==='1y'?86400:3600,n=look==='30d'?120:look==='1y'?11:168,r=rnd(kind.length*97+(normal?7:1)),out=[];let lp=Math.log(1000);
  for(let i=0;i<n;i++){const t=NOW-(n-1-i)*step;const hb=(new Date(t*1000).getUTCHours()+1)%24;let m;
    if(kind==='walk'){lp+=(r()-.5)*.02;m=Math.exp(lp)}
    else if(kind==='cycle'){m=1000*Math.exp(.04*Math.sin((hb-10)/24*2*Math.PI)+(r()-.5)*.004)}   // creux ~4 h, pic ~16 h (heure belge)
    else if(kind==='trend'){m=1000*Math.exp(.004*i*(step/3600)+(r()-.5)*.003)}
    else if(kind==='gap'){m=normal?2000*Math.exp((r()-.5)*.004):1000*Math.exp(.003*i*(step/3600)+(r()-.5)*.004)}
    else if(kind==='holes'){if(r()<.35)continue;lp+=(r()-.5)*.02;m=Math.exp(lp)}
    out.push({timestamp:t,avgHighPrice:Math.round(m*1.005),avgLowPrice:Math.round(m*.995),highPriceVolume:40,lowPriceVolume:40})}
  return out}
const KIND={2:'walk',3:'cycle',4:'trend',5:'gap',6:'holes'};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:900}});const errs=[];let ok=0,ko=0;const T=(c,m)=>{if(c)ok++;else{ko++;console.log('KO',m)}};
p.on('pageerror',e=>errs.push(e.message));
await p.route('**/*',r=>{const u=r.request().url();if(u.startsWith('file:'))return r.continue();
  const m=u.match(/\/api\/v2\/(osrs-hc|osrs)\/timeseries\?id=(\d+)&lookback=(\w+)/);
  if(m)return r.fulfill({contentType:'application/json',body:JSON.stringify({data:series(KIND[m[2]]||'walk',m[3],m[1]==='osrs')})});return r.abort()});
await p.goto('file://'+process.argv[2]+'?panel=0');await p.waitForTimeout(1200);
const r=await p.evaluate(async()=>{const o={};const names={2:'Walk ore',3:'Cycle bar',4:'Trend log',5:'Gap rune',6:'Holes fish'};
  for(const id in names){MAP[id]={id:+id,name:names[id],icon:'x.png',members:true};BYNAME[names[id].toLowerCase()]=+id;D24[id]={avgHighPrice:1000,highPriceVolume:300,avgLowPrice:990,lowPriceVolume:300}}
  const bad=R=>!R||R.err||[R.now,R.pred,R.lo,R.hi,R.move].some(x=>!isFinite(x))||R.rows.some(r=>r.pred!=null&&!isFinite(r.pred));
  for(const hz of ['6h','24h','7d'])for(const id of [2,3,4,5,6]){const R=await futLoad(id,hz,'bal');if(bad(R))o['nan_'+id+'_'+hz]=false;else o['ok_'+id+'_'+hz]=R.lo<=R.pred&&R.pred<=R.hi}
  let R=await futLoad(3,'24h','bal');o.cycleHours=R.hours&&R.hours.ok&&Math.abs(R.hours.buy-4)<=1&&Math.abs(R.hours.sell-16)<=1;o.cycleTested=R.hours.tested>=4;
  R=await futLoad(2,'24h','bal');o.walkNoHours=!(R.hours&&R.hours.ok);o.walkBack=R.back&&R.nb>=50&&R.nb<=100;
  R=await futLoad(4,'24h','bal');o.trendUp=R.pred>R.now&&R.strong;o.trendNoHours=!(R.hours&&R.hours.ok);const tw=R.rows.find(x=>x.k==='trend').w,sw=R.rows.find(x=>x.k==='sq').w;o.trendBeatsSq=tw>sw;
  R=await futLoad(5,'24h','agg');const g=R.rows.find(x=>x.k==='gap');o.gapCap=g.pred!=null&&g.pred<=futAt(R.N,R.t)+1e-9;
  R=await futLoad(4,'7d','bal');o.d7noBack=R.back===false&&R.conf===0;
  const Rs=await futLoad(4,'24h','safe'),Ra=await futLoad(4,'24h','agg');o.modes=Math.abs(Rs.pred-Rs.now)<Math.abs(Ra.pred-Ra.now);
  // rendu
  tab='futur';futSt.id=3;futSt.hz='24h';futSt.mode='bal';render();await new Promise(r=>setTimeout(r,300));
  const txt=document.getElementById('alertsHost').textContent;o.render=/Achète vers 4 h, revends vers 16 h/.test(txt)&&!!document.querySelector('#alertsHost svg.chart')&&!/NaN/.test(txt);
  favs.add(6);await futRunScan();const t2=document.getElementById('alertsHost').textContent;o.scan=futScan.rows.length===5&&/Scanner/.test(t2)&&!/NaN/.test(t2);
  o.scanOrder=futScan.rows[futScan.rows.length-1].R.strong===false;
  document.querySelector('[data-futid="4"]').click();o.pick=futSt.id===4&&futSt.recent[0]===4;
  return o});
for(const [k,v] of Object.entries(r))T(v,k);
await p.setViewportSize({width:560,height:900});await p.evaluate(()=>{store.set('compact',true);applyCompact();render()});await p.waitForTimeout(300);
T(await p.evaluate(()=>[...document.querySelectorAll('#alertsHost .box')].every(b=>b.getBoundingClientRect().right<=innerWidth+1)),'560 px tient dans l\'écran');
await p.screenshot({path:'/tmp/futur560.png',fullPage:false});
T(!errs.length,'erreurs JS : '+errs.join(' | '));console.log(ok+' OK, '+ko+' KO');await b.close()})();
