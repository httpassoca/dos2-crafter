<!-- Every item's base value, where it comes from, and the player's own override. -->
<script lang="ts">
  import { Table, NumberField, Input, SegmentedControl, Pagination, Button, Badge, Kbd, EmptyState } from 'dssoca'
  import type { TableColumn, TableSort } from 'dssoca'
  import { nm, allItems } from '../core/data'
  import { kind, VAL, ptxt } from '../core/engine'
  import { S } from '../state.svelte'
  import { P } from '../ui.svelte'
  import { ORIGINAL, valueSource, type ValueSource } from '../values'
  import { t, kindLabel } from '../i18n/index.svelte'
  import ItemIcon from '../components/ItemIcon.svelte'
  import { openItem } from '../ui.svelte'

  const PAGE = 50
  // things you can own (enchant effects have no value of their own), already sorted by name
  const KEYS = allItems

  let q = $state('')
  let query = $state('')
  let timer: ReturnType<typeof setTimeout> | undefined
  const onsearch = () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      query = q
      page = 1
    }, 120)
  }
  let show = $state<'all' | ValueSource>('all')
  let page = $state(1)
  let sort = $state<TableSort>({ key: 'name', dir: 'asc' })

  interface Row {
    k: string
    name: string
    kind: string
    src: ValueSource
    shipped: number
    value: number
    shown: string
  }

  const rows: Row[] = $derived.by(() => {
    void P.values.v // values and sources change when overrides or mods change
    const val = VAL as Record<string, number>
    return KEYS.map((k) => ({
      k,
      name: nm(k),
      kind: kindLabel(kind(k) as string),
      src: valueSource(k),
      shipped: ORIGINAL[k].v ?? 0,
      value: val[k] ?? 0,
      shown: ptxt(k) as string,
    }))
  })
  const counts = $derived(
    rows.reduce((c, r) => ((c[r.src] = (c[r.src] || 0) + 1), c), { all: rows.length } as Record<string, number>),
  )

  const filtered = $derived.by(() => {
    const toks = query.toLowerCase().split(/\s+/).filter(Boolean)
    const list = rows.filter(
      (r) => (show === 'all' || r.src === show) && toks.every((x) => (r.name + ' ' + r.k + ' ' + r.kind).toLowerCase().includes(x)),
    )
    const dir = sort.dir === 'desc' ? -1 : 1
    const key = sort.key as keyof Row
    const numeric = key === 'shipped' || key === 'value'
    return list.sort((a, b) =>
      numeric ? ((a[key] as number) - (b[key] as number)) * dir || a.name.localeCompare(b.name) : String(a[key]).localeCompare(String(b[key])) * dir,
    )
  })
  const pageRows = $derived(filtered.slice((page - 1) * PAGE, page * PAGE))
  $effect(() => {
    // keep the page in range when filters shrink the list
    const last = Math.max(1, Math.ceil(filtered.length / PAGE))
    if (page > last) page = last
  })

  const showOptions = $derived(
    (['all', 'user', 'fextra', 'list', 'est'] as const).map((v) => ({
      value: v,
      label: `${t(`config.values.show.${v}`)} ${counts[v] || 0}`,
    })),
  )
  const TONE: Record<ValueSource, 'positive' | 'info' | 'neutral' | 'caution'> = {
    user: 'positive',
    fextra: 'info',
    list: 'neutral',
    est: 'caution',
  }

  function setValue(k: string, v: number | null) {
    if (v != null && Number.isFinite(v) && v > 0 && v !== ORIGINAL[k].v) S.values[k] = Math.floor(v)
    else delete S.values[k]
  }

  const columns: TableColumn[] = $derived([
    { key: 'name', label: t('config.values.col.item'), sortable: true, cell: itemCell },
    { key: 'kind', label: t('config.values.col.kind'), sortable: true },
    { key: 'src', label: t('config.values.col.source'), sortable: true, cell: srcCell },
    { key: 'shipped', label: t('config.values.col.shipped'), numeric: true, sortable: true, cell: shippedCell },
    { key: 'value', label: t('config.values.col.value'), numeric: true, sortable: true, cell: valueCell },
  ])
</script>

{#snippet itemCell(r: Row)}
  <button type="button" class="item" onclick={() => openItem(r.k)}>
    <ItemIcon k={r.k} size={24} /><span>{r.name}</span>
  </button>
{/snippet}
{#snippet srcCell(r: Row)}
  <Badge tone={TONE[r.src as ValueSource]}>{t(`config.values.src.${r.src}`)}</Badge>
{/snippet}
{#snippet shippedCell(r: Row)}
  <span class="num">{r.shipped || '—'}</span>
{/snippet}
{#snippet valueCell(r: Row)}
  <div class="edit">
    <NumberField
      min={1}
      size="sm"
      placeholder={r.shown}
      aria-label={t('config.values.edit', { name: r.name })}
      bind:value={() => S.values[r.k] ?? null, (v) => setValue(r.k, v)}
    />
    <Button
      variant="ghost"
      size="sm"
      iconOnly
      label={t('config.values.resetOne', { name: r.name })}
      disabled={!(r.k in S.values)}
      onclick={() => setValue(r.k, null)}>↺</Button
    >
  </div>
{/snippet}

<div class="filters">
  <div class="search">
    <Input
      label={t('config.values.search')}
      bind:value={q}
      oninput={onsearch}
      placeholder={t('config.values.searchPh')}
      autocomplete="off"
      clearable
    >
      {#snippet prefix()}<Kbd keys="/" />{/snippet}
    </Input>
  </div>
  <div class="show">
    <SegmentedControl
      label={t('config.values.show')}
      options={showOptions}
      value={show}
      onChange={(v) => {
        show = v as typeof show
        page = 1
      }}
    />
  </div>
</div>

{#if filtered.length}
  <div class="table">
    <Table {columns} rows={pageRows} bind:sort getRowKey={(r) => r.k} caption={t('config.values.caption')} />
  </div>
  {#if filtered.length > PAGE}
    <nav class="pages" aria-label={t('config.values.pages')}>
      <Pagination {page} total={filtered.length} pageSize={PAGE} onchange={(p) => (page = p)} />
    </nav>
  {/if}
{:else}
  <EmptyState variant="no-results" title={t('config.values.none')} compact>
    {#snippet action()}
      <Button
        onclick={() => {
          q = query = ''
          show = 'all'
        }}>{t('config.values.clear')}</Button
      >
    {/snippet}
  </EmptyState>
{/if}

<style lang="scss">
  .filters {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    gap: var(--ss-gap);
  }
  .search {
    flex: 1 1 240px;
    max-width: 420px;
  }
  .show {
    max-width: 100%;
    overflow-x: auto;
  }
  .table {
    overflow-x: auto;
  }
  .item {
    display: inline-flex;
    align-items: center;
    gap: var(--ss-gap-sm);
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--ss-fg);
    font: inherit;
    text-align: left;
    cursor: pointer;
    &:hover span {
      color: var(--ss-primary);
    }
    &:focus-visible {
      outline: 2px solid var(--ss-primary);
      outline-offset: 2px;
    }
  }
  .num {
    font-variant-numeric: tabular-nums;
    color: var(--ss-fg-muted);
  }
  .edit {
    display: inline-flex;
    align-items: center;
    gap: var(--ss-gap-xs);
    justify-content: flex-end;
    :global(.ss-numberfield) {
      width: calc(var(--ss-s-16) * 2);
    }
  }
  .pages {
    display: flex;
    justify-content: center;
  }
</style>
