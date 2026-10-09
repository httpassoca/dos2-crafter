<!-- Everything you can make from your inventory: filters, the craft queue and the list. -->
<script lang="ts">
  import { Input, Select, SegmentedControl, Switch, Tooltip, Button, EmptyState } from 'dssoca'
  import { I, nm, GROUPS } from '../core/data'
  import { SORTS, notInSave } from '../core/engine'
  import { S, IV } from '../state.svelte'
  import CanRow from './CanRow.svelte'
  import CraftQueue from './CraftQueue.svelte'
  import { C, CF } from './inv.svelte'
  import { haystack, blockedHaystack, type CanItem } from './helpers'

  let listEl: HTMLDivElement | undefined = $state()
  const top = () => listEl && (listEl.scrollTop = 0)

  // search box debounced like the original (120ms)
  let q = $state(CF.q)
  let timer: ReturnType<typeof setTimeout> | undefined
  function onsearch() {
    clearTimeout(timer)
    timer = setTimeout(() => (CF.q = q), 120)
  }
  $effect(() => () => clearTimeout(timer))

  const has = $derived(Object.keys(S.stock).some((k) => I[k]))
  const toks = $derived(CF.q.toLowerCase().split(/\s+/).filter(Boolean))

  const matched = $derived(
    C.scan.can.filter(
      (x) =>
        (!CF.own || !(S.stock[x.k] > 0)) &&
        (!CF.wr || !notInSave(x.k)) &&
        toks.every((t) => haystack(x).includes(t)),
    ),
  )
  const cnt = $derived.by(() => {
    const c: Record<string, number> = { All: matched.length }
    for (const x of matched) c[x.r.g] = (c[x.r.g] || 0) + 1
    return c
  })
  // a category with nothing left in it falls back to All
  const g = $derived(CF.g !== 'All' && !cnt[CF.g] ? 'All' : CF.g)
  const groups = $derived(
    GROUPS.filter((x) => x === 'All' || cnt[x]).map((x) => ({ value: x, label: `${x} ${cnt[x] || 0}` })),
  )

  const ord = (x: string) => GROUPS.indexOf(x)
  const byName = (a: CanItem, b: CanItem) => nm(a.k).localeCompare(nm(b.k))
  const unk = (x: CanItem) => (x.val ? 0 : 1)
  const CMP: Record<string, (a: CanItem, b: CanItem) => number> = {
    cat: (a, b) => ord(a.r.g) - ord(b.r.g) || byName(a, b),
    vhi: (a, b) => b.val - a.val || byName(a, b),
    vlo: (a, b) => unk(a) - unk(b) || a.val - b.val || byName(a, b),
    gain: (a, b) => unk(a) - unk(b) || b.val - b.used - (a.val - a.used) || byName(a, b),
    rar: (a, b) => b.rar - a.rar || b.val - a.val || byName(a, b),
    easy: (a, b) => a.n - b.n || a.kinds - b.kinds || byName(a, b),
    hard: (a, b) => b.n - a.n || b.kinds - a.kinds || byName(a, b),
    most: (a, b) => b.mx - a.mx || byName(a, b),
    name: byName,
  }
  const res = $derived((g === 'All' ? [...matched] : matched.filter((x) => x.r.g === g)).sort(CMP[CF.sort] || byName))
  const blk = $derived(
    C.scan.blk.filter((x) => (g === 'All' || x.r.g === g) && toks.every((t) => blockedHaystack(x.k).includes(t))),
  )

  const total = $derived(C.scan.can.length)
  const countText = $derived(
    total ? (res.length === total ? `${total} items you can make` : `${res.length} of ${total} craftable items`) : '',
  )

  function clearFilters() {
    q = ''
    CF.q = ''
    CF.g = 'All'
    CF.own = false
  }
</script>

<div class="cancol">
  <div class="filters">
    <div class="l1">
      <div class="search">
        <Input
          bind:value={q}
          oninput={onsearch}
          placeholder="Search by name, ingredient or effect"
          aria-label="Search what you can make"
          autocomplete="off"
        >
          {#snippet prefix()}/{/snippet}
        </Input>
      </div>
      <div class="sort">
        <Select
          label="Sort"
          bind:value={CF.sort}
          options={SORTS.map(([value, label]) => ({ value, label }))}
          onchange={top}
        />
      </div>
      <span class="k">{countText}</span>
    </div>
    <div class="groups">
      <SegmentedControl
        label="Category"
        options={groups}
        value={g}
        onChange={(v) => {
          CF.g = v
          top()
        }}
      />
    </div>
    <div class="l1">
      <SegmentedControl
        label="How far to look"
        options={[
          { value: '0', label: 'One craft away' },
          { value: '1', label: 'Including intermediate crafts' },
        ]}
        value={String(IV.deep)}
        onChange={(v) => (IV.deep = +v)}
      />
      <Tooltip text="Oven, anvil, campfire, boiling pot, bench saw and well">
        <Switch label="stations nearby" checked={!!IV.tools} onchange={(v) => (IV.tools = v ? 1 : 0)} />
      </Tooltip>
      <Tooltip
        text="Hammer, blade, mortar and pestle and other tools you carry. Switch off to count only tools in your inventory."
      >
        <Switch label="assume hand tools" checked={!!IV.hand} onchange={(v) => (IV.hand = v ? 1 : 0)} />
      </Tooltip>
      <Tooltip text="Leave out things you already carry at least one of">
        <Switch label="hide what I already have" bind:checked={CF.own} />
      </Tooltip>
      {#if S.base}
        <Tooltip text="Leave out items your save has no copy of. Those can only be crafted in the game.">
          <Switch label="only what my save can take" bind:checked={CF.wr} />
        </Tooltip>
      {/if}
    </div>
  </div>

  <CraftQueue />

  <div class="list" bind:this={listEl}>
    {#each res as x, i (x.k)}
      {#if CF.sort === 'cat' && (i === 0 || res[i - 1].r.g !== x.r.g)}
        <div class="sec"><span>{x.r.g}</span><span>{cnt[x.r.g]}</span></div>
      {/if}
      <CanRow {x} />
    {/each}
    {#if blk.length}
      <div class="sec"><span>Blocked by your queue</span><span>{blk.length}</span></div>
      {#each blk as x (x.k)}
        <CanRow {x} blocked />
      {/each}
    {/if}
    {#if !res.length && !blk.length}
      <EmptyState
        variant={has && total ? 'no-results' : 'empty'}
        title={!has ? 'Tell it what you have' : total ? 'Nothing matches these filters' : 'Nothing craftable yet'}
        message={!has
          ? 'Add the items you own on the left, or load a save, and this list fills with everything you can make from them.'
          : total
            ? 'Clear the search or pick another category.'
            : 'No recipe can be completed from this inventory. Try including intermediate crafts, or switch on a gift bag mod in the top bar.'}
      >
        {#snippet action()}
          {#if has && total}<Button onclick={clearFilters}>Clear filters</Button>{/if}
        {/snippet}
      </EmptyState>
    {/if}
  </div>
</div>

<style lang="scss">
  .cancol {
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
  }
  .filters {
    display: flex;
    flex-direction: column;
    gap: var(--ss-gap-sm);
    padding: var(--ss-gap);
    border-bottom: 1px solid var(--ss-line);
    flex: none;
  }
  .l1 {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--ss-gap);
  }
  .search {
    flex: 1 1 260px;
    max-width: 460px;
  }
  .sort {
    display: flex;
    align-items: center;
    gap: var(--ss-gap-xs);
  }
  .k {
    color: var(--ss-fg-faint);
    font-size: var(--ss-ui-md);
  }
  // twelve categories do not fit a phone: scroll them sideways
  .groups {
    overflow-x: auto;
    max-width: 100%;
  }
  .list {
    flex: 1;
    min-height: 0;
    overflow: auto;
    padding: 0 var(--ss-gap) var(--ss-gap);
    container: craftlist / inline-size;
  }
  .sec {
    position: sticky;
    top: 0;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    padding: var(--ss-s-3) 0 var(--ss-s-2);
    background: var(--ss-bg);
    border-bottom: 1px solid var(--ss-line-strong);
    font: 500 var(--ss-ui-sm) var(--ss-font-mono);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--ss-fg-faint);
  }

  // phones: the tab scrolls as a whole (see Inventory.svelte)
  @media (max-width: 900px) {
    .cancol {
      display: block;
    }
    .list {
      overflow: visible;
    }
  }
</style>
