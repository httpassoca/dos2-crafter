<!-- Recipes tab: every recipe in the guide, searchable and filterable (legacy #v-rec). -->
<script lang="ts">
  import { Input, SegmentedControl, Pagination, EmptyState, Button, Kbd, shortcut } from 'dssoca'
  import { R, GROUPS } from '../core/data'
  import { F, resetFilters } from '../recipes/filters.svelte'
  import { matches, secName, tokens, type ModFilter } from '../recipes/text'
  import RecipeRow from '../recipes/RecipeRow.svelte'
  import { t, groupLabel } from '../i18n/index.svelte'

  const PAGE = 50
  const SEARCH_ID = 'rq'

  // category counts over the whole guide, like the original
  const counts: Record<string, number> = { All: R.length }
  R.forEach((r) => (counts[r.g] = (counts[r.g] || 0) + 1))
  const groupOptions = $derived(
    GROUPS.map((g) => ({ value: g, label: t('recipes.groupOption', { group: groupLabel(g), n: counts[g] || 0 }) })),
  )
  const modOptions = $derived(
    (['all', 'base', 'kit', 'herb'] as const).map((value) => ({ value, label: t(`recipes.version.${value}`) })),
  )

  // search box value; F.q follows it after a short pause
  let q = $state(F.q)
  $effect(() => {
    const v = q
    const timer = setTimeout(() => {
      if (F.q !== v) {
        F.q = v
        F.page = 1
      }
    }, 120)
    return () => clearTimeout(timer)
  })

  const list = $derived.by(() => {
    const toks = tokens(F.q)
    return R.filter((r) => matches(r, F.g, F.m, toks))
  })
  const perSection = $derived.by(() => {
    const c: Record<string, number> = {}
    list.forEach((r) => (c[r.s] = (c[r.s] || 0) + 1))
    return c
  })
  const pages = $derived(Math.max(1, Math.ceil(list.length / PAGE)))
  const page = $derived(Math.min(F.page, pages))
  const rows = $derived(list.slice((page - 1) * PAGE, page * PAGE))
  const filtered = $derived(F.g !== 'All' || F.m !== 'all' || !!F.q || !!q)

  let listEl = $state<HTMLElement>()
  const toTop = () => listEl?.scrollTo({ top: 0 })

  function setGroup(g: string) {
    F.g = g
    F.page = 1
    toTop()
  }
  function setMod(m: string) {
    F.m = m as ModFilter
    F.page = 1
    toTop()
  }
  function setPage(p: number) {
    F.page = p
    toTop()
  }
  function reset() {
    q = ''
    resetFilters()
    toTop()
  }
</script>

<div
  class="recipes"
  {@attach shortcut(() => ({
    id: 'rec:search',
    label: t('recipes.search'),
    keys: '/',
    group: t('recipes.shortcutGroup'),
    onPress: () => document.getElementById(SEARCH_ID)?.focus(),
  }))}
>
  <div class="filters">
    <div class="l1">
      <div class="search">
        <Input
          id={SEARCH_ID}
          bind:value={q}
          type="search"
          placeholder={t('recipes.searchPlaceholder')}
          autocomplete="off"
          aria-label={t('recipes.search')}
          clearable
        >
          {#snippet prefix()}<Kbd keys="/" />{/snippet}
        </Input>
      </div>
      <SegmentedControl label={t('recipes.version')} options={modOptions} value={F.m} onChange={setMod} />
      <span class="count" aria-live="polite">{t('recipes.count', { n: list.length, total: R.length })}</span>
      {#if filtered}
        <Button variant="ghost" size="sm" onclick={reset}>{t('recipes.resetFilters')}</Button>
      {/if}
    </div>
    <div class="groups">
      <SegmentedControl label={t('recipes.category')} options={groupOptions} value={F.g} onChange={setGroup} />
    </div>
  </div>

  <div class="list" bind:this={listEl}>
    {#if !list.length}
      <EmptyState
        variant="no-results"
        title={t('recipes.empty.title')}
        message={t('recipes.empty.message')}
      >
        {#snippet action()}
          <Button onclick={reset}>{t('recipes.clearFilters')}</Button>
        {/snippet}
      </EmptyState>
    {:else}
      {#each rows as r, i (r.i)}
        {#if i === 0 || rows[i - 1].s !== r.s}
          <div class="sec" role="heading" aria-level="2">
            <span>{secName(r.s)}</span><span>{perSection[r.s]}</span>
          </div>
        {/if}
        <RecipeRow {r} />
      {/each}
      {#if pages > 1}
        <nav class="pager" aria-label={t('recipes.pages')}>
          <Pagination page={page} pageCount={pages} onchange={setPage} />
        </nav>
      {/if}
    {/if}
  </div>
</div>

<style lang="scss">
  .recipes {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }
  .filters {
    flex: none;
    display: flex;
    flex-direction: column;
    gap: var(--ss-gap-sm);
    padding: var(--ss-gap) var(--ss-main-px);
    border-bottom: 1px solid var(--ss-line);
  }
  .l1 {
    display: flex;
    gap: var(--ss-gap);
    flex-wrap: wrap;
    align-items: center;
  }
  .search {
    flex: 1 1 calc(var(--ss-s-16) * 4);
    max-width: calc(var(--ss-s-16) * 7);
  }
  .count {
    color: var(--ss-fg-faint);
    font: var(--ss-ui-sm) var(--ss-font-mono);
    font-variant-numeric: tabular-nums;
  }
  /* twelve categories: scroll sideways rather than squeeze on narrow screens */
  .groups {
    overflow-x: auto;
    scrollbar-width: thin;
  }
  .groups :global(.ss-segmented) {
    max-width: none;
  }
  .list {
    flex: 1;
    min-height: 0;
    overflow: auto;
    padding: 0 var(--ss-main-px) var(--ss-s-10);
  }
  .sec {
    position: sticky;
    top: 0;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    padding: var(--ss-s-3) 0 var(--ss-gap-xs);
    background: var(--ss-bg);
    border-bottom: 1px solid var(--ss-line-strong);
    color: var(--ss-fg-faint);
    font: 500 var(--ss-ui-sm) var(--ss-font-mono);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .pager {
    display: flex;
    justify-content: center;
    padding-top: var(--ss-gap);
  }
  @media (max-width: 900px) {
    .filters {
      padding: var(--ss-gap);
    }
    .search {
      flex-basis: 100%;
      max-width: none;
    }
    .list {
      padding: 0 var(--ss-gap) var(--ss-s-10);
    }
  }
</style>
