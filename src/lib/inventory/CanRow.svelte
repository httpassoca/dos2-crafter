<!-- One thing you can make: count, item, badges, value, ingredients, and Craft / Plan. -->
<script lang="ts">
  import { Badge, Button, Tooltip } from 'dssoca'
  import { ptxt, notInSave } from '../core/engine'
  import { P, planRecipe } from '../ui.svelte'
  import ItemChip from './ItemChip.svelte'
  import { qadd } from './inv.svelte'
  import { descLine, RAR_TONE, type CanItem } from './helpers'
  import { t, rarityLabel } from '../i18n/index.svelte'

  interface Props {
    x: CanItem
    /** not enough left once the queue is done */
    blocked?: boolean
  }
  let { x, blocked = false }: Props = $props()

  const r = $derived(x.r)
  const gain = $derived(x.val - x.used)
  const pt = $derived.by(() => {
    void P.values.v
    return ptxt(x.k)
  })
  const fx = $derived(blocked ? '' : descLine(x.k, 150))
</script>

<div class="rec" class:blocked>
  <div class="res">
    {#if !blocked}<span class="mx" title={t('inventory.can.max')}>{x.mx >= 50 ? '50+' : x.mx}×</span>{/if}
    <ItemChip k={x.k} main />
    {#if blocked}
      <span class="note">{t('inventory.can.blocked')}</span>
    {:else}
      {#if x.n > 1}
        <Tooltip text={t('inventory.can.crafts.tip')}
          ><Badge tone="caution">{t('inventory.can.crafts', { n: x.n })}</Badge></Tooltip
        >
      {:else}
        <Badge tone="positive">{t('inventory.can.direct')}</Badge>
      {/if}
      <Tooltip text={t('inventory.can.rar.tip')}
        ><Badge tone={RAR_TONE[x.rar]}>{rarityLabel(x.rar)}</Badge></Tooltip
      >
      {#if notInSave(x.k)}
        <Tooltip text={t('inventory.can.gameOnly.tip')}
          ><Badge tone="critical">{t('inventory.can.gameOnly')}</Badge></Tooltip
        >
      {/if}
      {#if r.m === 'kit'}
        <Tooltip text={t('mod.kit.tip')}><Badge tone="caution">{t('mod.kit')}</Badge></Tooltip>
      {:else if r.m === 'herb'}
        <Tooltip text={t('mod.herb.tip')}><Badge tone="positive">{t('mod.herb')}</Badge></Tooltip>
      {/if}
      {#if r.b}<Badge tone="info">{t('kind.enchant')}</Badge>{/if}
      {#if fx}<span class="note fx">{fx}</span>{/if}
    {/if}
  </div>
  <div class="ins">
    {#each r.in as e, si (si)}
      {#if si}<span class="plus">+</span>{/if}
      {#each e.o as k, oi (k)}
        {#if oi}<span class="or">{t('inventory.can.or')}</span>{/if}
        <ItemChip {k} q={e.q} tool={!!e.t} />
      {/each}
    {/each}
    {#if r.st && !blocked}
      <span class="at">{t('inventory.can.at')}</span>
      {#each r.st as k, oi (k)}
        {#if oi}<span class="or">{t('inventory.can.or')}</span>{/if}
        <ItemChip {k} tool />
      {/each}
    {/if}
  </div>
  <div class="pr" title={t('inventory.can.value.tip')}>
    <b>{pt}</b>
    {#if !blocked}
      {#if x.val}
        <span>{t('inventory.can.uses', { n: x.used })} <i class:up={gain > 0} class:dn={gain < 0}>{gain > 0 ? '+' : ''}{gain}</i></span>
      {:else}
        <span>{t('inventory.can.noValue')}</span>
      {/if}
    {/if}
  </div>
  <div class="rb">
    {#if blocked}
      <Button disabled>{t('inventory.can.craft')}</Button>
    {:else}
      <Button variant="primary" onclick={() => qadd(x.k)}>{t('inventory.can.craft')}</Button>
      <Button variant="ghost" title={t('inventory.can.plan.tip')} onclick={() => planRecipe(r.i)}
        >{t('plan')}</Button
      >
    {/if}
  </div>
</div>

<style lang="scss">
  // narrow column: item and ingredients on their own lines, value and buttons share one
  .rec {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: var(--ss-s-1) var(--ss-s-3);
    align-items: center;
    padding: var(--ss-s-2) var(--ss-s-1);
    border-bottom: 1px solid var(--ss-line);
    &:hover {
      background: var(--ss-hover);
    }
  }
  .res {
    grid-column: 1 / -1;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--ss-s-2);
    min-width: 0;
  }
  .mx {
    min-width: 3ch;
    font: 700 var(--ss-ui-lg) var(--ss-font-display);
    font-variant-numeric: tabular-nums;
    color: var(--ss-primary);
  }
  .note {
    flex-basis: 100%;
    color: var(--ss-fg-faint);
    font-size: var(--ss-ui-xs);
  }
  .ins {
    grid-column: 1 / -1;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--ss-s-1) var(--ss-s-2);
    min-width: 0;
    color: var(--ss-fg-muted);
  }
  .plus,
  .or {
    color: var(--ss-fg-faint);
    font-size: var(--ss-ui-xs);
  }
  .at {
    margin-left: var(--ss-s-1);
    color: var(--ss-cyan);
    font-size: var(--ss-ui-xs);
  }
  .pr {
    display: flex;
    align-items: baseline;
    gap: var(--ss-s-2);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
    b {
      font: 700 var(--ss-ui-lg) var(--ss-font-display);
      color: var(--ss-yellow);
    }
    span {
      font-size: var(--ss-ui-xs);
      color: var(--ss-fg-faint);
    }
    i {
      font-style: normal;
    }
    .up {
      color: var(--ss-primary);
    }
    .dn {
      color: var(--ss-red);
    }
  }
  .rb {
    display: flex;
    gap: var(--ss-s-1);
    align-items: center;
  }
  .blocked {
    opacity: 0.55;
    &:hover {
      background: none;
    }
  }

  // wide column: four-column row, item info gets 2/3 of the flexible space.
  // Below 1100px the ingredients column would be ~220px and wrap, so rows stay stacked.
  @container craftlist (min-width: 1100px) {
    .rec {
      grid-template-columns: minmax(0, 2fr) minmax(0, 1fr) 92px auto;
    }
    .res,
    .ins {
      grid-column: auto;
    }
    .note {
      padding-left: calc(3ch + var(--ss-s-2) + 24px + var(--ss-gap-xs));
    }
    .pr {
      flex-direction: column;
      align-items: flex-end;
      gap: 1px;
    }
  }
</style>
