// @ts-nocheck — ported verbatim from the original single-file page; behaviour is pinned by tests.
// Planner and inventory engine: valuation, rarity, plan totals, the tree layout, "what can I make" and the craft queue.
import { I, R, makes, nm, craftable, nameMap, nkey } from './data'
import { S, IV } from '../state.svelte'

export const enabled=r=>!r.m||S.mods[r.m];
export const recipesFor=k=>(makes[k]||[]).filter(enabled);
export let cost={},best={};
export function costs(){valuate();cost={};best={};for(const k in I)if(!recipesFor(k).length)cost[k]=1;
  let ch=true,n=0;while(ch&&n++<80){ch=false;for(const r of R){if(!enabled(r))continue;let c=1,ok=true;
    for(const e of r.in){if(e.t)continue;let m=Infinity;for(const o of e.o)if(cost[o]!=null&&cost[o]<m)m=cost[o];if(m===Infinity){ok=false;break}c+=m*e.q}
    if(!ok)continue;for(const [k,q] of r.out){const cc=c/q;if(cost[k]==null||cc<cost[k]-1e-9){cost[k]=cc;best[k]=r.i;ch=true}}}}}
export let VAL={},RAR={};
export const RARE=new Set(['sourceorb','sovereignsorb','eternalartefact','eternaltablet','eternalplate','ultimateaugmentorherb','superiorstardustherb','voidtouchedlivewoodfragments','runeframeofpower','mysticalruneframe']),UNC=new Set(['luckyrabbitpaw','creepyeye','livewood','livewoodlog','fancyfeather','ancienthumanskull','disembodiedhand','pilgrimsshell']);
export function baseRar(k){const n=I[k].n,v=I[k].v||0;if(RARE.has(k)||/^Alien |with Source$/.test(n)||v>=300)return 3;if(UNC.has(k)||/^(High Quality|Distinctive) |Skillbook$/.test(n)||v>=90)return 2;return 1}
export function valuate(){VAL={};RAR={};for(const k in I){if(I[k].v)VAL[k]=I[k].v;if(!recipesFor(k).some(r=>!r.b))RAR[k]=baseRar(k)}
  let ch=true,n=0;while(ch&&n++<40){ch=false;for(const r of R){if(!enabled(r)||r.b)continue;let c=0,rr=1,ok=true;
    for(const e of r.in){if(e.t)continue;let m=Infinity,mr=Infinity;for(const o of e.o){const v=VAL[o]!=null?VAL[o]:(recipesFor(o).some(x=>!x.b)?null:0);if(v!=null&&v<m)m=v;if(RAR[o]!=null&&RAR[o]<mr)mr=RAR[o]}
      if(m===Infinity||mr===Infinity){ok=false;break}c+=m*e.q;if(mr>rr)rr=mr}
    if(!ok)continue;const tq=r.out.reduce((a,o)=>a+o[1],0);for(const [k] of r.out){if(RAR[k]==null||rr<RAR[k]){RAR[k]=rr;ch=true}if(I[k].v)continue;const cc=Math.round(c/tq);if(cc>0&&(VAL[k]==null||cc<VAL[k])){VAL[k]=cc;ch=true}}}}}
export const price=k=>VAL[k]||0,ptxt=k=>VAL[k]?(I[k].v?'':'≈')+VAL[k]:'?',RN=['','common','uncommon','rare'],RC=['','neutral','info','deg'];
export function recipeFor(k){const rs=recipesFor(k);if(!rs.length)return null;const c=S.rc[k];return rs.find(r=>r.i===c)||rs.find(r=>r.i===best[k])||rs[0]}
export function optFor(r,si){const e=r.in[si];if(e.o.length===1)return e.o[0];const c=S.oc[r.i+':'+si];if(c!=null)return e.o[c%e.o.length];let b=e.o[0],m=Infinity;for(const o of e.o){const v=cost[o]==null?1e9:cost[o];if(v<m){m=v;b=o}}return b}
export function kind(k){if(I[k].t)return 'tool or station';const r=(makes[k]||[])[0];if(r)return r.b?'enchant':r.g.toLowerCase();return 'raw material'}
export function compute(){const stock=Object.assign({},S.stock),extra={},gather=new Map(),used={},crafts=new Map(),tools=new Set();
  function need(k,q,path){const x=Math.min(extra[k]||0,q);if(x>0){extra[k]-=x;q-=x}
    const h=Math.min(stock[k]||0,q);if(h>0){stock[k]-=h;q-=h;used[k]=(used[k]||0)+h}if(q<=0)return;
    const r=recipeFor(k);if(!r||S.col[k]||path.includes(k)){gather.set(k,(gather.get(k)||0)+q);return}
    const out=(r.out.find(o=>o[0]===k)||[k,1])[1],n=Math.ceil(q/out);path.push(k);
    r.in.forEach((e,si)=>{const o=optFor(r,si);if(e.t)tools.add(o);else need(o,e.q*n,path)});
    if(r.st)tools.add(r.st.join('|'));path.pop();
    crafts.set(r.i,(crafts.get(r.i)||0)+n);
    for(const [ok,oq] of r.out){const made=oq*n-(ok===k?q:0);if(made>0)extra[ok]=(extra[ok]||0)+made}}
  for(const t of S.targets)need(t.k,t.q,[]);
  const left={};for(const k in extra)if(extra[k]>0)left[k]=extra[k];
  return {gather,used,crafts,tools,left}}
export const NW=214,NH=52,CW=256,RH=57;
export function build(){const nodes=[];let y=0,count=0;
  function mk(k,q,depth,path,parent,extra){const n=Object.assign({k,q,depth,parent,ch:[]},extra||{});nodes.push(n);count++;
    if(n.kind==='tool'){n.y=y;y+=RH;return n}
    const rs=recipesFor(k),r=recipeFor(k);n.nr=rs.length;
    if(!r)n.kind='raw';else if(S.col[k])n.kind='held';else if(path.includes(k))n.kind='cycle';else if(count>700)n.kind='held';
    else{n.kind='craft';n.r=r;const out=(r.out.find(o=>o[0]===k)||[k,1])[1];n.out=out;n.n=Math.ceil(q/out);path.push(k);
      r.in.forEach((e,si)=>{const o=optFor(r,si),ex={};if(e.o.length>1){ex.ok=r.i+':'+si;ex.on=e.o.length;ex.oi=e.o.indexOf(o)}
        if(e.t)ex.kind='tool';n.ch.push(mk(o,e.t?1:e.q*n.n,depth+1,path,n,ex))});
      if(r.st)n.ch.push(mk(r.st[0],1,depth+1,path,n,{kind:'tool',label:r.st.map(nm).join(' / '),station:1}));path.pop()}
    if(!n.ch.length){n.y=y;y+=RH}else n.y=(n.ch[0].y+n.ch[n.ch.length-1].y)/2;return n}
  const roots=S.targets.map(t=>{const n=mk(t.k,t.q,0,[],null,{root:1});y+=RH*.6;return n});
  let maxd=0;nodes.forEach(n=>{if(n.depth>maxd)maxd=n.depth});
  return {nodes,roots,w:maxd*CW+NW+40,h:Math.max(y,RH)+20}}
export const WORLD=new Set(['anvil','oven','campfire','boilingpot','cookingstation','benchsaw','well']),SOURCE=new Set(['waterbarrel','oilbarrel','beerbarrel','winebarrel','oozebarrel','beehive','oilpump','sheepwithpetpal','milkjug','bucketwithmilk','emptybarrel']);
export const SUBS={water:['bottleofwater','cupofwater','mugofwater','bucketofwater'],oil:['bottlefilledwithoil'],beer:['bottleofbeer','mugofbeer'],wine:['bottleofwine','mugofwine','glassofwine'],milk:['cupofmilk'],poison:['smallpoisonbottle','mediumpoisonbottle','largepoisonbottle','hugepoisonvial','giantpoisonvial','poisonflask'],cuttingtool:['knife','dagger'],fish:['herring','mackerel','plaice','redsnapper','chubfish'],meat:['rawredmeat','rawmutton','rabbitmeat','rawbirdleg'],wood:['log','longbranch','shortstick','woodchips'],anymetal:['metalscraps','platescraps','scalescraps','sharppieceofmetal','nails'],paper:[],honey:['jarofhoney'],sharprock:['pieceofrock'],rock:['pieceofrock'],hammer:['repairhammer'],sheetofpaper:['parchment']};
(function(){for(const k in I){if(!k.startsWith('any'))continue;const r=k.slice(3);if(k==='anyessence'){SUBS[k]=Object.keys(I).filter(x=>x.endsWith('essence')&&!x.startsWith('any'));continue}
    let m=r.match(/^(\w+?)skillbook$/);if(m){const sec='SKILLBOOKS - '+m[1];SUBS[k]=Object.keys(I).filter(x=>x.endsWith('skillbook')&&!x.includes('blank')&&!x.startsWith('any')&&(makes[x]||[]).some(q=>q.s===sec));continue}
    if(!SUBS[k])SUBS[k]=[r,'highquality'+r,'alien'+r]}
  for(const k in SUBS)SUBS[k]=SUBS[k].filter(x=>I[x])})();
export const owns=(s,k)=>s[k]>0||(SUBS[k]||[]).some(x=>s[x]>0);
export const avail=(s,k)=>owns(s,k)||(WORLD.has(k)?!!IV.tools:SOURCE.has(k)?false:!!IV.hand);
export function take(st,k,q){let c=null;for(const x of [k].concat(SUBS[k]||[])){if(!q)break;const h=Math.min(st[x]||0,q);if(h){c=c||Object.assign({},st);st=c;c[x]-=h;q-=h}}return {st,q}}
export function sat(k,q,st,path,d,top){if(!top){const t=take(st,k,q);st=t.st;q=t.q;if(!q)return {st,n:0}}
  if(d>(IV.deep?5:0)||path.includes(k))return null;
  for(const r of recipesFor(k)){if(r.b)continue;const out=(r.out.find(o=>o[0]===k)||[k,1])[1],n=Math.ceil(q/out);let s=st,ok=true,steps=n;
    for(const e of r.in){if(e.t){if(!e.o.some(o=>avail(s,o))){ok=false;break}continue}
      let got=null;for(const o of e.o){got=sat(o,e.q*n,s,path.concat(k),d+1);if(got)break}if(!got){ok=false;break}s=got.st;steps+=got.n}
    if(!ok)continue;if(r.st&&!r.st.some(o=>avail(s,o)))continue;
    s=Object.assign({},s);for(const [k2,oq] of r.out){const made=oq*n-(k2===k?q:0);if(made>0)s[k2]=(s[k2]||0)+made}return {st:s,n:steps,r}}
  return null}
export const SORTS=[['cat','Category'],['vhi','Value: high to low'],['vlo','Value: low to high'],['gain','Best gain over ingredients'],['rar','Rarest first'],['easy','Easiest to make'],['hard','Hardest to make'],['most','Most I can make'],['name','Name']];
export function importText(t){const map=nameMap();let ok=0;const bad=[];let rows=[];t=t.trim();
  if(t[0]==='{'||t[0]==='['){try{const o=JSON.parse(t);if(Array.isArray(o))o.forEach(x=>rows.push([x.name||x.item||x[0],x.count||x.amount||x.qty||x[1]||1]));else for(const k in o)rows.push([k,o[k]])}catch(e){return 'That looks like JSON but could not be read. Check for a missing bracket or comma.'}}
  else for(let l of t.split(/\n/)){l=l.trim();if(!l)continue;let m;if(m=l.match(/^(\d+)\s*[x×]?\s+(.+)$/i))rows.push([m[2],+m[1]]);else if(m=l.match(/^(.+?)\s*(?:[x×:;,\t]|\s-\s|\s)\s*(\d+)$/i))rows.push([m[1],+m[2]]);else rows.push([l,1])}
  for(const [n,q] of rows){const nk=nkey(String(n)),k=map[nk]||map['any'+nk]||map[nk.replace(/s$/,'')];if(k&&+q>0){S.stock[k]=Math.floor(+q);ok++}else bad.push(n)}
  return `Imported ${ok} item${ok===1?'':'s'}.`+(bad.length?` Not recognised: ${bad.slice(0,12).join(', ')}${bad.length>12?' and '+(bad.length-12)+' more':''}.`:'')}
export function evalQueue(base,Q){const keep=IV.deep;IV.deep=1;let st=Object.assign({},base);const steps=[],bad=[];
  for(const q of Q){const a=sat(q.k,q.n,st,[],0,1);if(!a){bad.push(q);continue}st=Object.assign({},a.st);st[q.k]=(st[q.k]||0)+q.n;steps.push({q,crafts:a.n})}
  IV.deep=keep;for(const k in st)if(!(st[k]>0))delete st[k];return {st,steps,bad}}
export function stockDiff(a,b){const used=[],got=[];for(const k of new Set([...Object.keys(a),...Object.keys(b)])){const d=(b[k]||0)-(a[k]||0);if(d<0)used.push([k,-d]);else if(d>0)got.push([k,d])}const s=(x,y)=>nm(x[0]).localeCompare(nm(y[0]));return {used:used.sort(s),got:got.sort(s)}}
export const notInSave=k=>!!(S.base&&S.creatable&&!S.creatable.includes(k)&&!(S.base[k]>0));
export function scanCan(st){const out=[];if(!Object.keys(st).some(k=>I[k]))return out;for(const k of craftable){const a=sat(k,1,st,[],0,1);if(!a)continue;let mx=1;while(mx<50&&sat(k,mx+1,st,[],0,1))mx++;
    let used=0,kinds=0;for(const x in st){const d=st[x]-(a.st[x]||0);if(d>0){used+=d*price(x);kinds++}}out.push({k,mx,n:a.n,r:a.r,val:price(k),used,kinds,rar:RAR[k]||1})}return out}
export function pending(){if(!S.base)return [];const out=[];for(const k of new Set([...Object.keys(S.base),...Object.keys(S.stock)])){const d=(S.stock[k]||0)-(S.base[k]||0);if(d&&I[k])out.push([k,d])}return out.sort((a,b)=>nm(a[0]).localeCompare(nm(b[0])))}
