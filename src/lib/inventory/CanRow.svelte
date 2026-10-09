<!-- One thing you can make: count, item, badges, value, ingredients, and Craft / Plan. -->
<script lang="ts">
  import { Badge, Button } from 'dssoca'
  import { ptxt, RN, notInSave } from '../core/engine'
  import { P, planRecipe } from '../ui.svelte'
  import ItemChip from './ItemChip.svelte'
  import { qadd } from './inv.svelte'
  import { descLine, RAR_TONE, type CanItem } from './helpers'

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
    {#if !blocked}<span class="mx" title="How many you can make">{x.mx >= 50 ? '50+' : x.mx}×</span>{/if}
    <ItemChip k={x.k} main />
    {#if blocked}
      <span class="note">Not enough left once your queued crafts are done</span>
    {:else}
      {#if x.n > 1}
        <span title="Crafts needed, counting intermediate items"><Badge tone="caution">{x.n} crafts</Badge></span>
      {:else}
        <Badge tone="positive">direct</Badge>
      {/if}
      <span title="Based on its hardest-to-find ingredient"><Badge tone={RAR_TONE[x.rar]}>{RN[x.rar]}</Badge></span>
      {#if notInSave(x.k)}
        <span
          title="Your save has no item of this kind to copy, so it cannot be written into the save. Craft this one in the game."
          ><Badge tone="critical">game only</Badge></span
        >
      {/if}
      {#if r.m === 'kit'}
        <span title="Needs the Crafter's Kit gift bag mod"><Badge tone="caution">crafter's kit</Badge></span>
      {:else if r.m === 'herb'}
        <span title="Needs the Herb Gardens gift bag mod"><Badge tone="positive">herb gardens</Badge></span>
      {/if}
      {#if r.b}<Badge tone="info">enchant</Badge>{/if}
      {#if fx}<span class="note fx">{fx}</span>{/if}
    {/if}
  </div>
  <div class="ins">
    {#each r.in as e, si (si)}
      {#if si}<span class="plus">+</span>{/if}
      {#each e.o as k, oi (k)}
        {#if oi}<span class="or">or</span>{/if}
        <ItemChip {k} q={e.q} tool={!!e.t} />
      {/each}
    {/each}
    {#if r.st && !blocked}
      <span class="at">at</span>
      {#each r.st as k, oi (k)}
        {#if oi}<span class="or">or</span>{/if}
        <ItemChip {k} tool />
      {/each}
    {/if}
  </div>
  <div class="pr" title="Base value of one. ≈ means estimated from its ingredients.">
    <b>{pt}</b>
    {#if !blocked}
      {#if x.val}
        <span>uses {x.used} <i class:up={gain > 0} class:dn={gain < 0}>{gain > 0 ? '+' : ''}{gain}</i></span>
      {:else}
        <span>no value known</span>
      {/if}
    {/if}
  </div>
  <div class="rb">
    {#if blocked}
      <Button disabled>Craft</Button>
    {:else}
      <Button variant="primary" onclick={() => qadd(x.k)}>Craft</Button>
      <Button variant="ghost" title="Open in the planner" onclick={() => planRecipe(r.i)}>Plan</Button>
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

  // wide column: the original's four-column row
  @container craftlist (min-width: 900px) {
    .rec {
      grid-template-columns: minmax(260px, 430px) minmax(0, 1fr) 92px auto;
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
