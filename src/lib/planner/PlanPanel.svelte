<!-- Plan totals beside the tree (legacy renderPlan): metrics, materials, crafting order, tools, leftovers. -->
<script lang="ts">
  import { Badge, Card, MetricTile, NumberField } from 'dssoca'
  import { R, nm } from '../core/data'
  import { optFor } from '../core/engine'
  import { S } from '../state.svelte'
  import { P, setStock } from '../ui.svelte'
  import ItemLink from './ItemLink.svelte'

  interface Plan {
    gather: Map<string, number>
    used: Record<string, number>
    crafts: Map<number, number>
    tools: Set<string>
    left: Record<string, number>
  }
  const res = $derived(P.plan as unknown as Plan)

  const mats = $derived.by(() => {
    const m = new Map<string, { miss: number; used: number }>()
    res.gather.forEach((q, k) => m.set(k, { miss: q, used: res.used[k] || 0 }))
    for (const k in res.used) if (!m.has(k)) m.set(k, { miss: 0, used: res.used[k] })
    return [...m.entries()].sort((a, b) => b[1].miss - a[1].miss || nm(a[0]).localeCompare(nm(b[0])))
  })
  const nc = $derived([...res.crafts.values()].reduce((a, v) => a + v, 0))
  const tm = $derived(mats.reduce((a, [, m]) => a + m.miss, 0))
  const tk = $derived(mats.filter(([, m]) => m.miss).length)

  const steps = $derived.by(() => {
    void P.values.v
    return [...res.crafts.entries()].map(([ri, n]) => {
      const r = R[ri]
      return { ri, n, r, ins: r.in.map((e, si) => ({ k: optFor(r, si) as string, q: e.q, t: !!e.t })) }
    })
  })
  const tools = $derived([...res.tools].map((t) => t.split('|')))
  const left = $derived(Object.entries(res.left))
</script>

{#if S.targets.length}
  <div class="metrics">
    <MetricTile label="crafts to do" value={nc} />
    <MetricTile label="materials" value={mats.length} />
    <div class="miss" class:bad={tm} class:good={!tm}><MetricTile label="still missing" value={tm} /></div>
  </div>

  <Card title="Materials to gather">
    {#snippet action()}
      {#if tk}<Badge tone="critical">{tk} short</Badge>{:else}<Badge tone="positive">all in stock</Badge>{/if}
    {/snippet}
    <div class="rows">
      {#each mats as [k, m] (k)}
        <div class="row">
          <ItemLink {k} />
          <span class="k">need</span>
          <span class="v">{m.miss + m.used}</span>
          <span class="k" aria-hidden="true">have</span>
          <div class="have">
            <NumberField
              size="sm"
              min={0}
              bind:value={() => S.stock[k] || 0, (v) => v != null && !Number.isNaN(v) && setStock(k, v)}
              aria-label="How many {nm(k)} you have"
            />
          </div>
          <span class="v" class:miss={m.miss} class:ok={!m.miss} title={m.miss ? 'missing' : 'covered'}
            >{m.miss ? '−' + m.miss : '✓'}<span class="sr">{m.miss ? ' missing' : ' covered'}</span></span
          >
        </div>
      {:else}
        <div class="row"><span class="k">Nothing to gather.</span></div>
      {/each}
    </div>
  </Card>

  <Card title="Crafting order" meta="bottom of the tree first">
    <ol class="rows">
      {#each steps as s (s.ri)}
        <li class="step">
          <span class="n">{s.n}×</span>
          <div class="outs">
            {#each s.r.out as [k, q] (k)}<ItemLink {k} {q} min={1} />{/each}
          </div>
          <div class="from">
            <span>from</span>
            {#each s.ins as e, si (si)}<ItemLink k={e.k} q={e.q} min={1} size={20} tool={e.t} chip />{/each}
            {#if s.r.st}
              <span>at</span>
              {#each s.r.st as k, j (k)}{#if j}<span>or</span>{/if}<ItemLink {k} size={20} tool chip />{/each}
            {/if}
          </div>
        </li>
      {:else}
        <li class="row"><span class="k">No crafting needed.</span></li>
      {/each}
    </ol>
  </Card>

  {#if tools.length}
    <Card title="Tools and stations" meta="not used up">
      <div class="chips">
        {#each tools as alts, i (i)}
          <span class="alts"
            >{#each alts as k, j (k)}{#if j}<span class="k">or</span>{/if}<ItemLink
                {k}
                size={20}
                tool
                chip
              />{/each}</span
          >
        {/each}
      </div>
    </Card>
  {/if}

  {#if left.length}
    <Card title="Left over afterwards" meta="byproducts and extras">
      <div class="chips">
        {#each left as [k, q] (k)}<ItemLink {k} {q} min={1} size={20} chip />{/each}
      </div>
    </Card>
  {/if}
{/if}

<style lang="scss">
  .metrics {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--ss-gap-sm);
  }
  .miss.bad :global(.val) {
    color: var(--ss-red);
  }
  .miss.good :global(.val) {
    color: var(--ss-primary);
  }
  /* rows run edge to edge inside the card body */
  .rows {
    display: flex;
    flex-direction: column;
    margin: calc(var(--ss-panel-body-py) * -1) calc(var(--ss-panel-body-px) * -1);
    padding: 0;
    list-style: none;
    font-size: var(--ss-ui-md);
  }
  .row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--ss-gap-sm);
    padding: var(--ss-row-py) var(--ss-row-px);
    border-bottom: 1px solid var(--ss-line);
    min-width: 0;
    &:last-child {
      border-bottom: 0;
    }
  }
  .k {
    color: var(--ss-fg-faint);
    font-size: var(--ss-ui-xs);
  }
  .v {
    font: 700 var(--ss-ui-md) var(--ss-font-mono);
    font-variant-numeric: tabular-nums;
    min-width: var(--ss-s-6);
    text-align: right;
    &.miss {
      color: var(--ss-red);
    }
    &.ok {
      color: var(--ss-primary);
    }
  }
  .have {
    width: calc(var(--ss-s-16) + var(--ss-s-10));
    flex: none;
  }
  .sr {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
  .step {
    display: grid;
    grid-template-columns: var(--ss-s-8) minmax(0, 1fr);
    gap: var(--ss-gap-xs) var(--ss-gap-sm);
    padding: var(--ss-row-py) var(--ss-row-px);
    border-bottom: 1px solid var(--ss-line);
    &:last-child {
      border-bottom: 0;
    }
  }
  .n {
    font: 700 var(--ss-ui-lg) var(--ss-font-display);
    color: var(--ss-primary);
    font-variant-numeric: tabular-nums;
  }
  .outs {
    display: flex;
    flex-wrap: wrap;
    gap: var(--ss-gap-sm);
    min-width: 0;
  }
  .from {
    grid-column: 2;
    display: flex;
    flex-wrap: wrap;
    gap: var(--ss-gap-xs) var(--ss-gap-sm);
    color: var(--ss-fg-muted);
    font-size: var(--ss-ui-sm);
    align-items: center;
  }
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: var(--ss-gap-xs) var(--ss-gap);
    font-size: var(--ss-ui-sm);
  }
  .alts {
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--ss-gap-xs);
  }
</style>
