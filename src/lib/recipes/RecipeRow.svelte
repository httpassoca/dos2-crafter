<!-- One recipe: results = ingredients (with "or" options) at stations. Legacy recHTML. -->
<script lang="ts">
  import { Button } from 'dssoca'
  import { planRecipe, useRecipe, closeItem } from '../ui.svelte'
  import { descLine, type NotedRecipe } from './text'
  import ItemRef from './ItemRef.svelte'
  import ModBadges from './ModBadges.svelte'
  import { t } from '../i18n/index.svelte'

  interface Props {
    r: NotedRecipe
    /** item key this recipe is shown for in the drawer: offers "Use this" */
    use?: string
    /** the recipe currently used for `use` */
    cur?: boolean
    /** narrow layout for the drawer: results on top, ingredients below */
    compact?: boolean
  }
  let { r, use, cur = false, compact = false }: Props = $props()

  const note = $derived(r.n || (!use ? descLine(r.out[0][0], 130) : ''))

  function plan() {
    const i = r.i
    closeItem()
    planRecipe(i)
  }
</script>

<div class="rec" class:cur class:compact>
  <div class="res">
    {#each r.out as [k, q], i (i)}
      {#if i}<span class="sep">+</span>{/if}
      <ItemRef {k} {q} out />
    {/each}
    <ModBadges {r} />
    {#if cur}<span class="sr">{t('recipes.row.current')}</span>{/if}
    {#if note}<span class="note">{note}</span>{/if}
  </div>
  <div class="eq" aria-hidden="true">=</div>
  <div class="ins">
    {#each r.in as e, si (si)}
      {#if si}<span class="sep">+</span>{/if}
      {#each e.o as k, oi (oi)}
        {#if oi}<span class="sep">{t('recipes.row.or')}</span>{/if}
        <ItemRef {k} q={e.q} tool={!!e.t} />
      {/each}
    {/each}
    {#if r.st}
      <span class="at">{t('recipes.row.at')}</span>
      {#each r.st as k, i (i)}
        {#if i}<span class="sep">{t('recipes.row.or')}</span>{/if}
        <ItemRef {k} tool />
      {/each}
    {/if}
  </div>
  <div class="acts">
    {#if use}
      <Button size="sm" variant={cur ? 'primary' : 'secondary'} onclick={() => useRecipe(use, r.i)}>
        {cur ? t('recipes.row.inUse') : t('recipes.row.useThis')}
      </Button>
      <Button size="sm" variant="ghost" onclick={plan}>{t('plan')}</Button>
    {:else}
      <Button size="sm" onclick={plan}>{t('plan')}</Button>
    {/if}
  </div>
</div>

<style lang="scss">
  .rec {
    display: grid;
    grid-template-columns: minmax(calc(var(--ss-s-16) * 3), calc(var(--ss-s-16) * 5)) var(--ss-s-4) minmax(0, 1fr) auto;
    gap: var(--ss-gap-xs) var(--ss-gap);
    align-items: center;
    padding: var(--ss-row-py) var(--ss-gap-xs);
    border-bottom: 1px solid var(--ss-line);
    font-size: var(--ss-size-sm);
  }
  .rec:hover {
    background: var(--ss-hover);
  }
  .rec:last-child {
    border-bottom: 0;
  }
  .cur {
    box-shadow: inset 3px 0 0 var(--ss-primary);
    background: var(--ss-primary-soft);
  }
  .res {
    display: flex;
    align-items: center;
    gap: var(--ss-gap-sm);
    min-width: 0;
    flex-wrap: wrap;
  }
  .note {
    flex-basis: 100%;
    color: var(--ss-fg-faint);
    font-size: var(--ss-ui-xs);
    padding-left: calc(var(--ss-s-8) + var(--ss-gap-sm));
  }
  .eq {
    color: var(--ss-fg-faint);
    text-align: center;
  }
  .ins {
    display: flex;
    flex-wrap: wrap;
    gap: var(--ss-gap-xs) var(--ss-gap-sm);
    align-items: center;
    min-width: 0;
    color: var(--ss-fg-muted);
  }
  .sep {
    color: var(--ss-fg-faint);
    font-size: var(--ss-ui-xs);
  }
  .at {
    color: var(--ss-cyan);
    font-size: var(--ss-ui-xs);
    margin-left: var(--ss-gap-xs);
  }
  .acts {
    display: flex;
    gap: var(--ss-gap-xs);
    align-items: center;
  }
  .sr {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
  /* In the drawer and on narrow screens: results on their own line, ingredients below. */
  .compact {
    grid-template-columns: minmax(0, 1fr) auto;
    padding: var(--ss-row-py) var(--ss-gap-sm);
  }
  .compact .res {
    grid-column: 1 / -1;
  }
  .compact .eq {
    display: none;
  }
  @media (max-width: 900px) {
    .rec {
      grid-template-columns: minmax(0, 1fr) auto;
    }
    .res {
      grid-column: 1 / -1;
    }
    .eq {
      display: none;
    }
  }
</style>
