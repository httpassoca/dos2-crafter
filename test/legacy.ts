// Loads the ORIGINAL page script from legacy/original.html and evaluates its DOM-free part
// (everything before the first event listener) in an isolated function scope via node:vm.
// Each call to loadLegacy() gives a fresh instance with its own S / IV / Q / caches.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'

const HTML = fileURLToPath(new URL('../legacy/original.html', import.meta.url))

/** the source of the last <script> in the legacy page */
export function legacySource(): string {
  const s = readFileSync(HTML, 'utf8')
  const i = s.lastIndexOf('<script')
  const j = s.indexOf('>', i)
  const k = s.indexOf('</script>', j)
  if (i < 0 || j < 0 || k < 0) throw new Error('no <script> in legacy/original.html')
  return s.slice(j + 1, k)
}

/** cut before the first top-level DOM wiring; everything above is definitions only */
function definitionsOnly(src: string): string {
  const cut = src.indexOf("\ndocument.addEventListener('click'")
  if (cut < 0) throw new Error('legacy script layout changed: no top-level click listener found')
  return src.slice(0, cut)
}

// Stubs: the definitions part touches only localStorage (guarded by try/catch) at load time.
// Anything else reaching the DOM is a harness bug, so the stubs throw.
const boom = (what: string) => () => {
  throw new Error('legacy harness: unexpected DOM access (' + what + ')')
}
const documentStub = new Proxy({}, { get: (_t, p) => boom('document.' + String(p)) })
const localStorageStub = { getItem: () => null, setItem: () => {}, removeItem: () => {} }

const NAMES = `D,COLS,I,R,makes,uses,nm,GROUPS,nkey,nameMap,allItems,craftable,SKEY,
enabled,recipesFor,costs,valuate,baseRar,RARE,UNC,price,ptxt,RN,RC,recipeFor,optFor,kind,compute,
NW,NH,CW,RH,build,WORLD,SOURCE,SUBS,owns,avail,take,sat,SORTS,importText,evalQueue,stockDiff,notInSave,scanCan,pending,
STAT,SCHOOL,statName,lz4Block,lz4Frame,inflate,unpack,lsvFile,lsfRead,lsfInventory,saveInventory,xmlInventory,importSave,
CRCT,crc32,xxh32,md5,lz4Compress,lz4FrameCompress,cat,lsfModel,nameRef,namesBytes,lsfWrite,deflate,lsvWrite,lsvFiles,
u64r,u64b,i32b,u16b,getA,strA,kid,saveIndex,levelTemplates,Buffer_eq,cloneNode,setA,SAFE_REF,deleteItem,setAmount,cloneItem,
saveApply,statKey,zipStore`
  .split(/[\s,]+/)
  .filter(Boolean)

// The legacy write flow lives in DOM handlers (prepareWrite / downloadWrite / scanLevels). These are
// the same statements, in the same order, with the dialog / download / SAVE plumbing removed.
// They run inside the legacy scope, so they use the legacy primitives and caches.
const PIPELINE = `
async function __prepareWrite(u8,base,stock){
  const files=await lsvFiles(u8),g=files.find(f=>/(^|\\/)globals\\.lsf$/i.test(f.name));if(!g)throw new Error('no globals.lsf inside this save');
  const m=await lsfModel(g.data),X=saveIndex(m),want={},extra=[];for(const f of files)if(/^levelcache\\//i.test(f.name)&&/\\.lsf$/i.test(f.name)){try{extra.push(...levelTemplates(await lsfModel(f.data)))}catch(e){}}for(const k of new Set([...Object.keys(base||{}),...Object.keys(stock)]))want[k]=stock[k]||0;
  const res=saveApply(X,want,statKey,extra);
  const grp={};for(const [t,k,n] of res.done){const o=grp[k]=grp[k]||{less:0,more:0,neu:0};if(t==='less')o.less+=n;else if(t==='more')o.more+=n;else o.neu+=n}
  return {job:{files,g,m,want,res},groups:Object.entries(grp).sort((a,b)=>nm(a[0]).localeCompare(nm(b[0])))}}
async function __downloadWrite(J,name){
  J.g.data=lsfWrite(J.m).bytes;J.g.changed=true;const pkg=await lsvWrite(J.files,J.files.pkgFlags,J.files.priority);
  const back=await saveInventory(pkg,'check.lsv'),r=importSave(back),miss=[];for(const k in J.want){const ok=J.res.warn.some(w=>w[0]===k);if(!ok&&(r.stock[k]||0)!==J.want[k])miss.push(nm(k)+' ('+(r.stock[k]||0)+' instead of '+J.want[k]+')')}
  if(miss.length)throw new Error('the rebuilt save did not read back as expected: '+miss.slice(0,6).join(', '));
  const zip=zipStore(name,pkg),fname=name.replace(/\\.lsv$/i,'')+'.zip';
  const base=Object.assign({},r.stock);for(const [k] of J.res.warn)if(base[k]==null)delete base[k];
  return {pkg,zip,fname,base,stock:Object.assign({},r.stock)}}
async function __scanLevels(u8){const files=await lsvFiles(u8),add=new Set();for(const f of files){if(!/^levelcache\\/.*\\.lsf$/i.test(f.name))continue;const inv=lsfInventory(await lsfRead(f.data));for(const it of inv.items){const k=it.Stats&&statKey(it.Stats);if(k)add.add(k)}}return [...add]}
`

const TAIL = `
return {${NAMES.join(',')},__prepareWrite,__downloadWrite,__scanLevels,
  get S(){return S},set S(v){S=v},get IV(){return IV},set IV(v){IV=v},get Q(){return Q},set Q(v){Q=v},
  get VAL(){return VAL},get RAR(){return RAR},get cost(){return cost},get best(){return best},get SKEYS(){return SKEYS}}`

/** The legacy page's globals and functions. Typed loosely on purpose: it is untyped legacy code. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Legacy = Record<string, any>

let CODE: string | null = null
export function loadLegacy(opts: { window?: unknown } = {}): Legacy {
  CODE ??= definitionsOnly(legacySource()) + '\n' + PIPELINE + TAIL
  // compileFunction runs in the current realm: Maps, Sets and typed arrays compare normally with host values
  const fn = vm.compileFunction(CODE, ['document', 'localStorage', 'window'], { filename: 'legacy/original.html' })
  return fn(documentStub, localStorageStub, opts.window ?? { crypto: globalThis.crypto }) as Legacy
}
