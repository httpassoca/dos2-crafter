// Golden tests on real saves: src/lib/core/{save,writer}.ts against the legacy page, byte for byte.
// Runs only when fixtures/*.lsv exist (gitignored, personal). Nothing from a save is printed beyond
// counts / lengths / offsets, nothing is written to disk, and nothing about the saves is hardcoded:
// every edit is derived from the save itself.
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import * as SVT from '../src/lib/core/save'
import * as WT from '../src/lib/core/writer'
import { I } from '../src/lib/core/data'
import { loadLegacy, type Legacy } from './legacy'
import { rng } from './helpers'

// core/ is untyped (@ts-nocheck) legacy code: use it loosely typed, like the legacy harness
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SV: any = SVT, W: any = WT

const DIR = fileURLToPath(new URL('../fixtures/', import.meta.url))
const FIX = existsSync(DIR) ? readdirSync(DIR).filter((f) => /\.lsv$/i.test(f)).sort() : []
const SLOW = 600_000

/** crypto stand-in so new item UUIDs are the same in both pipelines */
function seededCrypto() {
  let r = rng(1234)
  return {
    reset() { r = rng(1234) },
    getRandomValues<T extends ArrayBufferView>(a: T): T {
      const b = new Uint8Array(a.buffer, a.byteOffset, a.byteLength)
      for (let i = 0; i < b.length; i++) b[i] = Math.floor(r() * 256)
      return a
    },
  }
}

/** byte equality that reports only lengths and the first differing offset */
function sameBytes(a: Uint8Array, b: Uint8Array, what: string) {
  let at = -1
  const n = Math.min(a.length, b.length)
  for (let i = 0; i < n; i++) if (a[i] !== b[i]) { at = i; break }
  if (at < 0 && a.length !== b.length) at = n
  expect(at, `${what}: lengths ${a.length} vs ${b.length}, first difference at byte ${at}`).toBe(-1)
}

const ser = (v: unknown) => JSON.stringify(v, (_k, x) => (typeof x === 'bigint' ? 'n' + x : ArrayBuffer.isView(x) ? Buffer.from(x.buffer, x.byteOffset, x.byteLength).toString('base64') : x))
/** deep equality that never prints save contents: on mismatch it reports only how many top-level entries differ */
function sameData(a: unknown, b: unknown, what: string) {
  if (ser(a) === ser(b)) return
  const ea = Object.entries((a ?? {}) as object), eb = Object.fromEntries(Object.entries((b ?? {}) as object))
  const diff = ea.filter(([k, v]) => ser(v) !== ser(eb[k])).length + Math.abs(Object.keys(eb).length - ea.length)
  expect.fail(`${what}: ${diff} top-level entries differ (of ${ea.length} / ${Object.keys(eb).length})`)
}

const copy = (u8: Uint8Array) => new Uint8Array(u8)

/** package layout, from the header only: 13 = DOS2 DE (signature at the end), else the leading LSPK version */
function packageVersion(path: string): number {
  const b = readFileSync(path), v = new DataView(b.buffer, b.byteOffset, b.byteLength), SIG = 0x4b50534c
  if (b.length > 8 && v.getUint32(b.length - 4, true) === SIG) return v.getUint32(b.length - v.getInt32(b.length - 8, true), true)
  if (v.getUint32(0, true) === SIG) return v.getUint32(4, true)
  return v.getUint32(0, true)
}
const isGlobals = (f: { name: string }) => /(^|\/)globals\.lsf$/i.test(f.name)

describe.skipIf(!FIX.length)('save golden tests (fixtures/*.lsv)', () => {
  const crypto = seededCrypto()
  let L: Legacy
  beforeAll(() => {
    L = loadLegacy({ window: { crypto } })
    // the new cloneItem reads window.crypto; in Node there is no window
    ;(globalThis as Record<string, unknown>).window = { crypto }
  })
  afterAll(() => {
    delete (globalThis as Record<string, unknown>).window
  })

  FIX.forEach((file, fi) => {
    // only DOS2 Definitive Edition packages (v13) can be read and written; anything else must be refused the same way
    const ver = packageVersion(join(DIR, file)), ok = ver === 13
    describe(`fixture ${fi + 1} (package v${ver})`, () => {
      it.skipIf(ok)('not a DOS2 DE save: refused identically by legacy and new', async () => {
        const raw = new Uint8Array(readFileSync(join(DIR, file)))
        const err = async (f: () => Promise<unknown>) => { try { await f(); return 'no error' } catch (e) { return String((e as Error).message) } }
        const a = await err(() => SV.saveInventory(copy(raw), 'x.lsv')), b = await err(() => L.saveInventory(copy(raw), 'x.lsv'))
        expect(a).toBe(b)
        expect(a).not.toBe('no error')
        expect(await err(() => SV.lsvFiles(copy(raw)))).toBe(await err(() => L.lsvFiles(copy(raw))))
      })

      let u8: Uint8Array
      let base: Record<string, number>
      beforeAll(async () => {
        if (!ok) return
        u8 = new Uint8Array(readFileSync(join(DIR, file)))
        base = SV.importSave(await SV.saveInventory(copy(u8), 'x.lsv')).stock
      }, SLOW)

      it.runIf(ok)('reads identically: saveInventory, importSave, levelCreatable', async () => {
        const n = await SV.saveInventory(copy(u8), 'x.lsv'), l = await L.saveInventory(copy(u8), 'x.lsv')
        expect(n.chars.length).toBe(l.chars.length)
        expect(n.items.length).toBe(l.items.length)
        sameData(n.chars, l.chars, 'chars')
        sameData(n.items, l.items, 'items')
        const ni = SV.importSave(n), li = L.importSave(l)
        expect(ni.msg).toBe(li.msg)
        sameData(ni.stock, li.stock, 'importSave stock')
        sameData([...ni.skip].sort(), [...li.skip].sort(), 'importSave skip')
        expect(Object.keys(ni.stock).length).toBeGreaterThan(0)
        // creatable keys: applySave's list from globals + scanLevels' level-file pass
        const nc = (await SV.levelCreatable(copy(u8))).sort(), lc = (await L.__scanLevels(copy(u8))).sort()
        sameData(nc, lc, 'levelCreatable')
        for (const it of n.items) if (it.Stats) expect(SV.statKey(it.Stats)).toBe(L.statKey(it.Stats))
      }, SLOW)

      it.runIf(ok)('LSF round trip: lsfModel → lsfWrite decodes to the same tree and is stable', async () => {
        const files = await SV.lsvFiles(copy(u8)), lfiles = await L.lsvFiles(copy(u8))
        expect(files.length).toBe(lfiles.length)
        sameData(files.map((f: { name: string }) => f.name), lfiles.map((f: { name: string }) => f.name), 'package file names')
        expect([files.pkgFlags, files.priority]).toEqual([lfiles.pkgFlags, lfiles.priority])
        files.forEach((f: { data: Uint8Array }, i: number) => sameBytes(f.data, lfiles[i].data, `file #${i} contents`))
        const g = files.find(isGlobals)
        expect(g).toBeTruthy()
        const nb = SV.lsfWrite(await SV.lsfModel(g.data)).bytes
        const lb = L.lsfWrite(await L.lsfModel(g.data)).bytes
        sameBytes(lb, nb, 'new vs legacy lsfWrite')
        // The game compresses LSF sections differently, so compare decoded content, not bytes.
        sameData(SV.lsfInventory(await SV.lsfRead(nb)), SV.lsfInventory(await SV.lsfRead(g.data)), 'lsfWrite vs original globals.lsf (decoded)')
        const a = await SV.lsfModel(nb), b = await SV.lsfModel(g.data)
        sameBytes(SV.lsfWrite(a).bytes, SV.lsfWrite(b).bytes, 'second write is stable')
      }, SLOW)

      it.runIf(ok)('repack without edits: lsvWrite is identical between legacy and new', async () => {
        const files = await SV.lsvFiles(copy(u8)), lfiles = await L.lsvFiles(copy(u8))
        const a = await SV.lsvWrite(files, files.pkgFlags, files.priority)
        const b = await L.lsvWrite(lfiles, lfiles.pkgFlags, lfiles.priority)
        sameBytes(a, b, 'repacked .lsv')
        // and it reads back to the same inventory
        sameData(SV.importSave(await SV.saveInventory(a, 'x.lsv')).stock, base, 'repacked stock')
      }, SLOW)

      it.runIf(ok)('same edit through both write pipelines gives identical bytes and the wanted counts', async () => {
        expect(base).toBeTruthy()
        // derive the edit from the save: decrement one stack, empty another, raise a third, add kinds held only elsewhere
        const keys = Object.keys(base).sort()
        const dec = keys.find((k) => base[k] >= 2)
        const empty = keys.find((k) => k !== dec)
        const more = keys.find((k) => k !== dec && k !== empty)
        const inv = await SV.saveInventory(copy(u8), 'x.lsv')
        const inGlobals = new Set<string>(inv.items.map((it: { Stats?: string }) => it.Stats && SV.statKey(it.Stats)).filter(Boolean))
        const level: string[] = (await SV.levelCreatable(copy(u8))).sort()
        const onlyLevel = level.find((k) => !(k in base) && !inGlobals.has(k) && I[k])
        const elsewhere = [...inGlobals].sort().find((k) => !(k in base) && I[k])
        const stock: Record<string, number> = { ...base }
        if (dec) stock[dec] = base[dec] - 1
        if (empty) stock[empty] = 0
        if (more) stock[more] = base[more] + 2
        if (onlyLevel) stock[onlyLevel] = 1
        if (elsewhere) stock[elsewhere] = 2
        const name = 'edited.lsv'

        crypto.reset()
        const lp = await L.__prepareWrite(copy(u8), base, stock)
        const lout = await L.__downloadWrite(lp.job, name)

        crypto.reset()
        const job = await W.prepareWrite(copy(u8), base, stock)
        const groups = W.groupChanges(job)
        const nout = await W.buildWrite(job, name)

        sameData(job.want, lp.job.want, 'want')
        sameData(job.res.done, lp.job.res.done, 'saveApply done')
        sameData(job.res.warn, lp.job.res.warn, 'saveApply warn')
        sameData(groups, lp.groups, 'grouped changes')
        expect(job.res.done.length).toBeGreaterThanOrEqual(2)
        sameBytes(nout.pkg, lout.pkg, 'edited .lsv')
        sameBytes(nout.zip, lout.zip, 'zip')
        expect(nout.fname).toBe(lout.fname)
        sameData(nout.base, lout.base, 'new base')
        sameData(nout.stock, lout.stock, 'new stock')

        // read it back independently: every key that was not refused ends at the wanted count
        const back = SV.importSave(await SV.saveInventory(nout.pkg, 'check.lsv')).stock
        const warned = new Set(job.res.warn.map((w: [string]) => w[0]))
        let checked = 0
        for (const k in job.want) if (!warned.has(k)) { expect(back[k] || 0, 'a wanted count').toBe(job.want[k]); checked++ }
        expect(checked).toBeGreaterThan(0)
        if (dec) expect(back[dec]).toBe(base[dec] - 1)
        if (empty && !warned.has(empty)) expect(back[empty] || 0).toBe(0)
        if (more) expect(back[more]).toBe(base[more] + 2)
        if (onlyLevel && !warned.has(onlyLevel)) expect(back[onlyLevel]).toBe(1)
      }, SLOW)
    })
  })
})
