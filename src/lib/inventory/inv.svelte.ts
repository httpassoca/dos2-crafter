// Inventory tab state and actions: the "what can I make" scan, the craft queue and save loading.
import { untrack } from 'svelte'
import { toast } from 'dssoca'
import { I, nm } from '../core/data'
import { evalQueue, scanCan, pending, importText } from '../core/engine'
import { saveInventory, xmlInventory, importSave, statKey, levelCreatable } from '../core/save'
import { S, IV, Q, SAVE, type QueueEntry } from '../state.svelte'
import { P } from '../ui.svelte'
import { plural, errText, type CanItem } from './helpers'

/** filters of the craftable list (kept while switching tabs, not persisted) */
export const CF = $state({ q: '', g: 'All', sort: 'cat', own: false, wr: false })

/** text box, inline result of the last import and the file being read */
export const inv = $state({
  text: '',
  result: null as null | { text: string; skip?: string[]; warn?: boolean },
  loading: '',
})

interface QueueEval {
  st: Record<string, number>
  steps: { q: QueueEntry; crafts: number }[]
  bad: QueueEntry[]
}
export interface Scan {
  /** what can be made once the queue is done */
  can: CanItem[]
  /** what could be made now but not once the queue is done */
  blk: CanItem[]
  /** the queue played on the current stock, or null when it is empty */
  ev: QueueEval | null
  /** keys of queued items that can no longer be made */
  bad: string[]
}

const plainQueue = () => Q.map((q) => ({ k: q.k, n: q.n }))

// scanCan / evalQueue read S and IV directly, and evalQueue flips IV.deep while it runs. Read every
// input here (tracked), then run the engine untracked on plain copies.
const scan: Scan = $derived.by(() => {
  void P.values.v
  void IV.deep
  void IV.tools
  void IV.hand
  void S.mods.kit
  void S.mods.herb
  const stock = { ...S.stock }
  const queue = plainQueue()
  return untrack(() => {
    const ev: QueueEval | null = queue.length ? evalQueue(stock, queue) : null
    const can: CanItem[] = scanCan(ev ? ev.st : stock)
    let blk: CanItem[] = []
    if (queue.length) {
      const have = new Set(can.map((x) => x.k))
      blk = (scanCan(stock) as CanItem[]).filter((x) => !have.has(x.k))
    }
    return { can, blk, ev, bad: ev ? ev.bad.map((q) => q.k) : [] }
  })
})

export const C = {
  get scan() {
    return scan
  },
}

/* ---------- stock ---------- */

export function addStock(k: string) {
  S.stock[k] = (S.stock[k] || 0) + 1
}
export function removeStock(k: string) {
  delete S.stock[k]
}

export function importList(t: string) {
  if (!t.trim()) {
    toast.info('Paste a list first, one item per line.')
    return
  }
  const msg: string = importText(t)
  const cut = msg.indexOf(' Not recognised: ')
  if (!msg.startsWith('Imported')) {
    toast.error(msg)
    return
  }
  if (cut < 0) {
    inv.result = null
    toast.success(msg)
  } else {
    inv.result = { text: msg, warn: true }
    toast.info(msg.slice(0, cut))
  }
}

/** "12 Bone" lines for everything in stock */
export const exportText = () =>
  Object.keys(S.stock)
    .filter((k) => I[k])
    .map((k) => S.stock[k] + ' ' + nm(k))
    .join('\n')

export function emptyInventory() {
  S.stock = {}
  S.base = null
  S.stash = null
  Q.length = 0
  inv.result = null
  toast.success('Inventory emptied.')
}

/** put changes stashed before loading this save back on top of it */
export function reapplyStash() {
  for (const [k, d] of Object.entries(S.stash || {})) S.stock[k] = Math.max(0, (S.stock[k] || 0) + d)
  for (const k in S.stock) if (!S.stock[k]) delete S.stock[k]
  S.stash = null
}
export function discardStash() {
  S.stash = null
}

/* ---------- loading a save ---------- */

let seq = 0

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SaveData = { chars: any[]; items: { Stats?: string }[] }

/** Read a save (.lsv / .lsf / .lsx / .xml) or a text list (.txt / .csv / .json). */
export async function loadFile(f: File) {
  if (!/\.(lsv|lsf|lsx|xml)$/i.test(f.name)) {
    try {
      const t = await f.text()
      inv.text = t
      importList(t)
    } catch (e) {
      toast.error('That file could not be read: ' + errText(e) + '.')
    }
    return
  }
  const my = ++seq
  inv.loading = f.name
  try {
    let d: SaveData, u8: Uint8Array | null = null
    if (/\.(lsv|lsf)$/i.test(f.name)) {
      u8 = new Uint8Array(await f.arrayBuffer())
      d = await saveInventory(u8, f.name)
    } else d = xmlInventory(await f.text())
    if (my !== seq) return
    applySave(d, f.name, u8)
  } catch (e) {
    if (my === seq) toast.error('That save could not be read: ' + errText(e) + '. Nothing was changed.')
  } finally {
    if (my === seq) inv.loading = ''
  }
}

function applySave(d: SaveData, name: string, u8: Uint8Array | null) {
  const r = importSave(d)
  if (!r.stock) {
    inv.result = { text: r.msg, warn: true }
    return
  }
  const p = pending()
  if (p.length) S.stash = Object.fromEntries(p)
  S.stock = r.stock
  S.base = Object.assign({}, r.stock)
  S.saveName = name || ''
  S.creatable = [...new Set(d.items.map((it) => it.Stats && statKey(it.Stats)).filter(Boolean))] as string[]
  SAVE.file = u8 && /\.lsv$/i.test(name) ? { name, u8 } : null
  Q.length = 0
  IV.hand = 0
  inv.text = ''
  inv.result = { text: r.msg, skip: [...r.skip].sort() }
  toast.success('Loaded ' + name + '.')
  if (SAVE.file && u8) scanLevels(u8)
}

/** Items lying around in the save's levels can be copied too: add them to S.creatable. */
async function scanLevels(u8: Uint8Array) {
  try {
    const add = (await levelCreatable(u8)) as string[]
    // a newer save was loaded (or this one rewritten) meanwhile
    if (!SAVE.file || SAVE.file.u8 !== u8) return
    S.creatable = [...new Set([...(S.creatable || []), ...add])] as string[]
  } catch {
    /* level files are a bonus; the inventory is already loaded */
  }
}

/* ---------- craft queue ---------- */

export function qadd(k: string) {
  const q = Q.find((q) => q.k === k)
  if (q) q.n++
  else Q.push({ k, n: 1 })
}

/** one more of queue entry i; false when there is not enough for it */
export function qinc(i: number) {
  const qs = plainQueue()
  qs[i].n++
  const ev: QueueEval = evalQueue({ ...S.stock }, qs)
  if (ev.bad.includes(qs[i])) return false
  Q[i].n++
  return true
}
export function qdec(i: number) {
  if (--Q[i].n < 1) Q.splice(i, 1)
}
export function qrm(i: number) {
  Q.splice(i, 1)
}
export function qclear() {
  Q.length = 0
}

/** drop queued items that can no longer be made (called from an effect) */
export function pruneQueue(bad: string[]) {
  for (let i = Q.length - 1; i >= 0; i--) if (bad.includes(Q[i].k)) Q.splice(i, 1)
}

let UNDO: Record<string, number> | null = null

/** apply the queue to the stock */
export function craftQueue() {
  const ev: QueueEval = evalQueue({ ...S.stock }, plainQueue())
  const n = ev.steps.reduce((x, s) => x + s.q.n, 0)
  UNDO = { ...S.stock }
  S.stock = ev.st
  Q.length = 0
  toast.success(`Crafted ${n} ${plural(n, 'item')}.`, {
    timeout: 10_000,
    action: { label: 'Undo', onClick: undoCraft },
  })
}
function undoCraft() {
  if (!UNDO) return
  S.stock = UNDO
  UNDO = null
  toast.info('Last craft undone.')
}
