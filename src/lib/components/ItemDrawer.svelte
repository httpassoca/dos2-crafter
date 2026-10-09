<!-- Item details, as a side sheet over the page. Opens when ui.item is set (legacy openItem / closeDrawer). -->
<script lang="ts">
  import { Modal, Badge, Button, NumberField, Link, Tooltip, Card } from 'dssoca'
  import { I, makes, uses, nm } from '../core/data'
  import { VAL, RAR, RN, ptxt, recipeFor, enabled, kind } from '../core/engine'
  import { S } from '../state.svelte'
  import { ui, P, closeItem, addTarget, setStock } from '../ui.svelte'
  import ItemIcon from './ItemIcon.svelte'
  import RecipeRow from '../recipes/RecipeRow.svelte'

  const USED_MAX = 80
  const RAR_TONE = ['neutral', 'neutral', 'info', 'caution'] as const

  const k = $derived(ui.item)
  const it = $derived(k ? I[k] : null)
  const mk = $derived(k ? makes[k] || [] : [])
  const us = $derived(k ? uses[k] || [] : [])
  // engine tables: read P.values first so this re-runs when the mods change
  const eng = $derived.by(() => {
    void P.values.v
    if (!k) return null
    const cur = recipeFor(k)
    return {
      val: (VAL as Record<string, number>)[k] as number | undefined,
      rar: (RAR as Record<string, number>)[k] as number | undefined,
      ptxt: ptxt(k) as string,
      kind: kind(k) as string,
      cur: cur && enabled(cur) ? (cur.i as number) : -1,
    }
  })
  const valueSource = $derived(
    it?.v ? (it.vs === 'f' ? 'Value from the Fextralife wiki' : 'Base value from the Crafting Divinity list') : 'Estimated from its ingredients',
  )
  const borrowed = $derived(!!(it as { p?: unknown } | null)?.p)

  // back to the top when another item opens in place
  let top = $state<HTMLElement>()
  $effect(() => {
    void k
    top?.parentElement?.scrollTo({ top: 0 })
  })

  function add() {
    const key = k
    if (!key) return
    closeItem()
    addTarget(key)
  }
</script>

<div class="sheet">
  <Modal
    bind:open={() => ui.item !== null, (v) => !v && closeItem()}
    aria-label={k ? nm(k) : 'Item details'}
  >
    {#snippet header()}
      {#if k && it && eng}
        <div class="hd">
          <ItemIcon {k} size={56} />
          <div class="hd-tx">
            <h2>{it.n}</h2>
            <div class="tags">
              <Badge>{eng.kind}</Badge>
              {#if mk.length}<Badge tone="positive">{mk.length} recipe{mk.length > 1 ? 's' : ''}</Badge>{/if}
              {#if us.length}<Badge tone="info">used in {us.length}</Badge>{/if}
              {#if eng.val}
                <Tooltip text={valueSource} placement="bottom">
                  <Badge>value {eng.ptxt}</Badge>
                </Tooltip>
              {/if}
              {#if eng.rar}<Badge tone={RAR_TONE[eng.rar]}>{RN[eng.rar]}</Badge>{/if}
            </div>
          </div>
        </div>
      {/if}
    {/snippet}

    {#if k && it && eng}
      <div class="bd" bind:this={top}>
        <div class="acts">
          {#if mk.length}<Button variant="primary" onclick={add}>Add to plan</Button>{/if}
          <div class="stock">
            <NumberField
              label="In stock"
              min={0}
              bind:value={() => S.stock[k] || 0, (v) => setStock(k, v ?? 0)}
            />
          </div>
        </div>

        {#if it.d}
          {@const d = it.d}
          <Card title={d.e ? (d.s ? 'What the skill does' : 'What it does') : undefined} titleLevel={3}>
            <div class="desc">
              {#if d.e}
                <ul>
                  {#each d.e as x, i (i)}<li>{x}</li>{/each}
                </ul>
              {/if}
              {#if d.m}
                <dl>
                  {#each d.m as [a, b], i (i)}
                    <div><dt>{a}</dt><dd>{b}</dd></div>
                  {/each}
                  {#if eng.val}<div><dt>Value</dt><dd>{eng.ptxt}</dd></div>{/if}
                </dl>
              {/if}
              {#if d.w}
                <Link size="sm" href="https://divinityoriginalsin2.wiki.fextralife.com/{encodeURI(d.w)}" external
                  >Full entry on the Fextralife wiki</Link
                >
              {/if}
            </div>
          </Card>
        {/if}

        {#if borrowed}
          <p class="faint">No exact icon was found for this item, so it borrows a similar one.</p>
        {/if}

        {#if mk.length}
          <section>
            <Card title="How to make it" titleLevel={3}>
              <div class="rows">
                {#each mk as r (r.i)}
                  <RecipeRow {r} use={k} cur={eng.cur === r.i} compact />
                {/each}
              </div>
            </Card>
            {#if mk.some((r) => !enabled(r))}
              <p class="faint">
                Recipes that need a gift bag mod are only planned when that mod is switched on in the top bar.
              </p>
            {/if}
          </section>
        {:else}
          <p class="muted">The guide has no recipe for this. Find it, loot it or buy it.</p>
        {/if}

        {#if us.length}
          <section>
            <Card title="Used in" titleLevel={3}>
              <div class="rows">
                {#each us.slice(0, USED_MAX) as r (r.i)}
                  <RecipeRow {r} compact />
                {/each}
              </div>
            </Card>
            {#if us.length > USED_MAX}
              <p class="faint">Showing the first {USED_MAX} of {us.length}. Search the recipes tab for the rest.</p>
            {/if}
          </section>
        {/if}
      </div>
    {/if}
  </Modal>
</div>

<style lang="scss">
  .sheet {
    display: contents;
  }
  /* dssoca Modal, pinned to the right edge as a full-height side sheet */
  .sheet :global(.ss-modal) {
    width: min(calc(var(--ss-s-16) * 9), 100vw);
    max-width: 100vw;
    height: 100vh;
    height: 100dvh;
    max-height: none;
    margin: 0 0 0 auto;
    border: 0;
    border-left: 1px solid var(--ss-line-strong);
    background: var(--ss-bg);
    padding-top: env(safe-area-inset-top, 0px);
    padding-bottom: env(safe-area-inset-bottom, 0px);
  }
  .sheet :global(.ss-modal > div) {
    height: 100%;
    max-height: none;
  }
  .sheet :global(.ss-modal > div > div) {
    flex: 1 1 auto;
    min-height: 0;
  }
  .hd {
    flex: 1;
    min-width: 0;
    display: flex;
    gap: var(--ss-gap);
    align-items: center;
  }
  .hd-tx {
    flex: 1;
    min-width: 0;
  }
  h2 {
    margin: 0;
    font: 400 var(--ss-size-h3) / 1.15 var(--ss-font-display);
    color: var(--ss-fg-shine);
  }
  .tags {
    display: flex;
    gap: var(--ss-gap-xs);
    flex-wrap: wrap;
    margin-top: var(--ss-gap-xs);
  }
  .bd {
    display: flex;
    flex-direction: column;
    gap: var(--ss-gap);
  }
  .acts {
    display: flex;
    gap: var(--ss-gap);
    align-items: flex-end;
    flex-wrap: wrap;
  }
  .stock {
    width: calc(var(--ss-s-16) * 2.5);
  }
  .desc {
    font-size: var(--ss-size-sm);
    display: flex;
    flex-direction: column;
    gap: var(--ss-gap-sm);
  }
  .desc ul {
    margin: 0;
    padding-left: var(--ss-s-4);
    display: flex;
    flex-direction: column;
    gap: var(--ss-gap-xs);
    color: var(--ss-fg);
  }
  .desc dl {
    display: flex;
    flex-wrap: wrap;
    gap: var(--ss-gap-xs) var(--ss-s-5);
    margin: 0;
  }
  .desc dl div {
    display: flex;
    gap: var(--ss-gap-xs);
    align-items: baseline;
  }
  .desc dt {
    font: var(--ss-ui-xs) var(--ss-font-mono);
    color: var(--ss-fg-faint);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .desc dd {
    margin: 0;
    color: var(--ss-fg);
    font-variant-numeric: tabular-nums;
  }
  section {
    display: flex;
    flex-direction: column;
    gap: var(--ss-gap-xs);
  }
  .rows {
    display: flex;
    flex-direction: column;
  }
  p {
    margin: 0;
  }
  .faint {
    color: var(--ss-fg-faint);
    font-size: var(--ss-ui-sm);
  }
  .muted {
    color: var(--ss-fg-muted);
  }
  @media (prefers-reduced-motion: no-preference) {
    .sheet :global(.ss-modal[open]) {
      animation: sheet-in var(--ss-dur) var(--ss-ease);
    }
  }
  @keyframes sheet-in {
    from {
      transform: translateX(100%);
    }
  }
</style>
