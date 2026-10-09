// Small unit tests: data integrity, checksums, LZ4 and the zip container.
import { describe, it, expect } from 'vitest'
import { createHash } from 'node:crypto'
import { crc32 as zcrc32 } from 'node:zlib'
import * as D from '../src/lib/core/data'
import * as SVT from '../src/lib/core/save'
import { loadLegacy } from './legacy'
import { rng } from './helpers'

// core/ is untyped (@ts-nocheck) legacy code: use it loosely typed, like the legacy harness
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SV: any = SVT
const L = loadLegacy()
const enc = (s: string) => new TextEncoder().encode(s)
const hex = (u8: Uint8Array) => Buffer.from(u8).toString('hex')
function randomBytes(n: number, seed: number, alphabet = 256) {
  const r = rng(seed), b = new Uint8Array(n)
  for (let i = 0; i < n; i++) b[i] = Math.floor(r() * alphabet)
  return b
}

describe('data', () => {
  it('items and recipes equal the legacy page data', () => {
    expect(D.I).toEqual(L.I)
    expect(D.R).toEqual(L.R)
    expect(Object.keys(D.I)).toEqual(Object.keys(L.I))
    expect(D.COLS).toBe(L.COLS)
    expect(D.GROUPS).toEqual(L.GROUPS)
    expect(D.allItems).toEqual(L.allItems)
    expect(D.craftable).toEqual(L.craftable)
    const idx = (m: Record<string, { i: number }[]>) => Object.fromEntries(Object.entries(m).map(([k, v]) => [k, v.map((r) => r.i)]))
    expect(idx(D.makes)).toEqual(idx(L.makes))
    expect(idx(D.uses)).toEqual(idx(L.uses))
    expect(D.nameMap()).toEqual(L.nameMap())
    for (const k in D.I) expect(D.nm(k)).toBe(L.nm(k))
  })

  it('every recipe input / output / station key exists in items', () => {
    const missing: string[] = []
    D.R.forEach((r, i) => {
      for (const [k] of r.out) if (!D.I[k]) missing.push(`R${i} out ${k}`)
      r.in.forEach((e, si) => e.o.forEach((k) => { if (!D.I[k]) missing.push(`R${i} in[${si}] ${k}`) }))
      for (const k of r.st || []) if (!D.I[k]) missing.push(`R${i} st ${k}`)
      expect(r.i).toBe(i)
    })
    expect(missing).toEqual([])
  })

  it('atlas indices fit the 25x25 atlas', () => {
    const bad = Object.entries(D.I).filter(([, it]) => !Number.isInteger(it.i) || it.i < -1 || it.i >= D.COLS * D.COLS)
    expect(bad.map(([k]) => k)).toEqual([])
  })
})

describe('checksums', () => {
  it('crc32 known vectors and node:zlib agreement', () => {
    expect(SV.crc32(enc(''))).toBe(0)
    expect(SV.crc32(enc('123456789'))).toBe(0xcbf43926)
    expect(SV.crc32(enc('The quick brown fox jumps over the lazy dog'))).toBe(0x414fa339)
    const b = randomBytes(10007, 1)
    expect(SV.crc32(b)).toBe(zcrc32(b))
    expect(SV.crc32(b)).toBe(L.crc32(b))
  })

  it('md5 known vectors, chunking and node:crypto agreement', () => {
    expect(hex(SV.md5([enc('')]))).toBe('d41d8cd98f00b204e9800998ecf8427e')
    expect(hex(SV.md5([enc('abc')]))).toBe('900150983cd24fb0d6963f7d28e17f72')
    expect(hex(SV.md5([enc('message '), enc('digest')]))).toBe('f96b697d7cb7938d525a2f31aaf161d0')
    for (const n of [55, 56, 63, 64, 65, 1000, 70001]) {
      const b = randomBytes(n, n)
      expect(hex(SV.md5([b.subarray(0, 17), b.subarray(17)]))).toBe(createHash('md5').update(b).digest('hex'))
      expect(hex(SV.md5([b]))).toBe(hex(L.md5([b])))
    }
  })

  it('xxh32 known vectors', () => {
    expect(SV.xxh32(enc(''))).toBe(0x02cc5d05)
    expect(SV.xxh32(enc('abc'))).toBe(0x32d153ff)
    for (const n of [0, 3, 15, 16, 17, 1000]) {
      const b = randomBytes(n, n + 3)
      expect(SV.xxh32(b, 7)).toBe(L.xxh32(b, 7))
    }
  })
})

describe('lz4', () => {
  it('frame compress → decompress round trip, same bytes as legacy', () => {
    for (const [n, alpha] of [[0, 256], [1, 256], [5000, 4], [70000, 16], [300000, 256]]) {
      const b = randomBytes(n, n + 11, alpha)
      const c = SV.lz4FrameCompress(b)
      expect(hex(c)).toBe(hex(L.lz4FrameCompress(b)))
      expect(hex(SV.lz4Frame(c, n))).toBe(hex(b))
    }
  })
})

describe('zipStore', () => {
  it('produces a valid single-entry stored zip', () => {
    const data = randomBytes(4321, 5), name = 'Some Save.lsv'
    const z = SV.zipStore(name, data)
    expect(hex(z)).toBe(hex(L.zipStore(name, data)))
    const v = new DataView(z.buffer, z.byteOffset, z.byteLength)
    const nl = enc(name).length
    // local header
    expect(v.getUint32(0, true)).toBe(0x04034b50)
    expect(v.getUint16(8, true)).toBe(0) // stored
    expect(v.getUint32(14, true)).toBe(zcrc32(data))
    expect(v.getUint32(18, true)).toBe(data.length)
    expect(v.getUint32(22, true)).toBe(data.length)
    expect(v.getUint16(26, true)).toBe(nl)
    expect(new TextDecoder().decode(z.subarray(30, 30 + nl))).toBe(name)
    expect(hex(z.subarray(30 + nl, 30 + nl + data.length))).toBe(hex(data))
    // central directory
    const cd = 30 + nl + data.length
    expect(v.getUint32(cd, true)).toBe(0x02014b50)
    expect(v.getUint32(cd + 16, true)).toBe(zcrc32(data))
    expect(v.getUint32(cd + 42, true)).toBe(0) // local header offset
    // end of central directory
    const eo = z.length - 22
    expect(v.getUint32(eo, true)).toBe(0x06054b50)
    expect(v.getUint16(eo + 10, true)).toBe(1)
    expect(v.getUint32(eo + 12, true)).toBe(46 + nl)
    expect(v.getUint32(eo + 16, true)).toBe(cd)
  })
})

describe('statName', () => {
  it('matches legacy for every known stats id and synthetic patterns', () => {
    const ids = [...Object.keys(SV.STAT), 'LOOT_Rune_Flame_Giant', 'SKILLBOOK_Fire_Fireball', 'SCROLL_Unknown_Thing', 'GRN_Grenade_Foo_A', 'CON_Something_Else_A', 'X']
    for (const s of ids) expect(SV.statName(s)).toEqual(L.statName(s))
  })
})

describe('LSPK v13 package (synthetic)', () => {
  const files = () => [
    { name: 'meta.lsf', data: randomBytes(3000, 21, 8) },
    { name: 'globals.lsf', data: randomBytes(90000, 22, 32) },
    { name: 'levelcache/somewhere.lsf', data: randomBytes(20000, 23) },
    { name: 'SaveInfo.json', data: enc('{"x":1}') },
  ]
  it('lsvWrite is identical to legacy and lsvFiles / lsvFile read it back', async () => {
    const a = await SV.lsvWrite(files(), 6, 3), b = await L.lsvWrite(files(), 6, 3)
    expect(hex(a)).toBe(hex(b))
    const back = await SV.lsvFiles(a), lback = await L.lsvFiles(b)
    expect(back.map((f: { name: string }) => f.name)).toEqual(files().map((f) => f.name))
    files().forEach((f, i) => {
      expect(hex(back[i].data)).toBe(hex(f.data))
      expect(hex(lback[i].data)).toBe(hex(f.data))
    })
    expect([back.pkgFlags, back.priority]).toEqual([2, 3]) // solid flag (4) is cleared on write
    expect(hex(await SV.lsvFile(a, 'globals.lsf'))).toBe(hex(files()[1].data))
    // unchanged files keep their compressed bytes: repacking is stable
    expect(hex(await SV.lsvWrite(back, back.pkgFlags, back.priority))).toBe(hex(a))
    // a changed file is recompressed
    back[1].data = randomBytes(500, 24); back[1].changed = true
    lback[1].data = randomBytes(500, 24); lback[1].changed = true
    const c = await SV.lsvWrite(back, back.pkgFlags, back.priority)
    expect(hex(c)).toBe(hex(await L.lsvWrite(lback, lback.pkgFlags, lback.priority)))
    expect(hex((await SV.lsvFiles(c))[1].data)).toBe(hex(randomBytes(500, 24)))
  })
})
