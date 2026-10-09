import { test, expect } from 'vitest'
import { flushSync } from 'svelte'
import { S, IV, Q } from '../src/lib/state.svelte'
import { allItems } from '../src/lib/core/data'
import { rng } from './helpers'
import { C, qadd, qinc, craftQueue, pruneQueue, importList, inv } from '../src/lib/inventory/inv.svelte'

test('scan reacts', () => {
  const r = rng(7), stock: Record<string, number> = {}
  for (let i = 0; i < 200; i++) stock[allItems[(r() * allItems.length) | 0]] = 1 + ((r() * 20) | 0)
  let runs = 0, last: any
  const stop = $effect.root(() => {
    $effect(() => { runs++; try { last = C.scan; if (last.bad.length) pruneQueue(last.bad) } catch (e) { console.log("ERR", e) } })
  })
  flushSync(); console.log("init runs", runs); S.stock = stock; flushSync()
  const n0 = C.scan.can.length
  console.log('can', n0, 'runs', runs)
  IV.deep = 0; flushSync()
  console.log('deep0 can', C.scan.can.length, 'runs', runs)
  qadd(C.scan.can[0].k); flushSync()
  console.log('queue', Q.length, 'ev', !!C.scan.ev, 'blk', C.scan.blk.length, 'runs', runs, 'deep', IV.deep)
  for (let i = 0; i < 60; i++) if (!qinc(0)) { console.log('qinc stop at', Q[0].n); break }
  flushSync()
  console.log('runs', runs, 'deep', IV.deep)
  const before = { ...S.stock }
  craftQueue(); flushSync()
  console.log('crafted; Q', Q.length, 'changed', JSON.stringify(before) !== JSON.stringify(S.stock), 'runs', runs)
  importList('12 Bone\nfoo bar baz: 3'); console.log(inv.result)
  IV.deep = 1; flushSync()
  stop()
  expect(runs).toBeLessThan(30)
})
