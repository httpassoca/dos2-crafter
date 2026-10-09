// @ts-nocheck — same steps as the original page's prepareWrite / downloadWrite, minus the DOM.
// Write planned stock back into a loaded .lsv: diff → edit globals.lsf → repack → read back → zip.
import { nm } from './data'
import {
  lsvFiles, lsfModel, saveIndex, levelTemplates, saveApply, statKey,
  lsfWrite, lsvWrite, saveInventory, importSave, zipStore,
} from './save'

export interface WriteJob {
  files: unknown
  g: { name: string; data: Uint8Array; changed?: boolean }
  m: unknown
  /** item key → count the save should end with */
  want: Record<string, number>
  /** done: [kind ('less'|'more'|'new'|...), key, n][]; warn: [key, reason][] */
  res: { done: [string, string, number][]; warn: [string, string][] }
}

/** Plan the edits. Nothing is written yet. */
export async function prepareWrite(u8: Uint8Array, base: Record<string, number> | null | undefined, stock: Record<string, number>): Promise<WriteJob> {
  const files = await lsvFiles(u8), g = files.find(f => /(^|\/)globals\.lsf$/i.test(f.name))
  if (!g) throw new Error('no globals.lsf inside this save')
  const m = await lsfModel(g.data), X = saveIndex(m), want = {}, extra = []
  for (const f of files) if (/^levelcache\//i.test(f.name) && /\.lsf$/i.test(f.name)) { try { extra.push(...levelTemplates(await lsfModel(f.data))) } catch (e) {} }
  for (const k of new Set([...Object.keys(base || {}), ...Object.keys(stock)])) want[k] = stock[k] || 0
  const res = saveApply(X, want, statKey, extra)
  return { files, g, m, want, res }
}

/** Per item: how much goes down, up, or arrives as a new stack. */
export function groupChanges(job: WriteJob) {
  const grp: Record<string, { less: number; more: number; neu: number }> = {}
  for (const [t, k, n] of job.res.done) {
    const o = (grp[k] = grp[k] || { less: 0, more: 0, neu: 0 })
    if (t === 'less') o.less += n
    else if (t === 'more') o.more += n
    else o.neu += n
  }
  return Object.entries(grp).sort((a, b) => nm(a[0]).localeCompare(nm(b[0])))
}

/** Repack, read the result back, refuse on any mismatch, and zip it. */
export async function buildWrite(job: WriteJob, saveName: string) {
  const J = job
  J.g.data = lsfWrite(J.m).bytes; J.g.changed = true
  const pkg = await lsvWrite(J.files, J.files.pkgFlags, J.files.priority)
  const back = await saveInventory(pkg, 'check.lsv'), r = importSave(back), miss = []
  for (const k in J.want) { const ok = J.res.warn.some(w => w[0] === k); if (!ok && (r.stock[k] || 0) !== J.want[k]) miss.push(nm(k) + ' (' + (r.stock[k] || 0) + ' instead of ' + J.want[k] + ')') }
  if (miss.length) throw new Error('the rebuilt save did not read back as expected: ' + miss.slice(0, 6).join(', '))
  const zip = zipStore(saveName, pkg), fname = saveName.replace(/\.lsv$/i, '') + '.zip'
  const newBase = Object.assign({}, r.stock)
  for (const [k] of J.res.warn) if (newBase[k] == null) delete newBase[k]
  return { pkg, zip, fname, base: newBase, stock: Object.assign({}, r.stock) }
}
