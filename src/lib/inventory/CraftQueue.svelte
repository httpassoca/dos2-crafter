<!-- The crafting queue, and the review dialog that applies it to the stock. -->
<script lang="ts">
  import { Button, Modal, toast } from 'dssoca'
  import { nm } from '../core/data'
  import { stockDiff, notInSave } from '../core/engine'
  import { S, Q } from '../state.svelte'
  import ItemIcon from '../components/ItemIcon.svelte'
  import Delta from './Delta.svelte'
  import { C, qinc, qdec, qrm, qclear, craftQueue } from './inv.svelte'
  import { plural } from './helpers'

  type Diff = { used: [string, number][]; got: [string, number][] }
  const ev = $derived(C.scan.ev)
  const df: Diff = $derived(ev ? (stockDiff({ ...S.stock }, ev.st) as Diff) : { used: [], got: [] })
  const total = $derived(Q.reduce((a, q) => a + q.n, 0))
  const crafts = $derived(ev ? ev.steps.reduce((a, s) => a + s.crafts, 0) : 0)
  const gameOnly = $derived(Q.filter((q) => notInSave(q.k)))

  let review = $state(false)

  function more(i: number) {
    if (!qinc(i)) toast.info(`Not enough materials for one more ${nm(Q[i].k)}.`)
  }
  function done() {
    review = false
    craftQueue()
  }
</script>

{#if Q.length}
  <section class="queue" aria-label="Crafting queue">
    <div class="qh">
      <span class="lbl">Crafting queue</span>
      <span class="k">{total} to craft, using {df.used.length} {plural(df.used.length, 'kind')} of item</span>
    </div>
    <div class="ql">
      {#each Q as q, i (q.k)}
        <span class="qe">
          <ItemIcon k={q.k} size={24} />
          <span class="nm">{nm(q.k)}</span>
          <span class="qn">×{q.n}</span>
          <Button variant="ghost" size="sm" iconOnly label="One less {nm(q.k)}" onclick={() => qdec(i)}>−</Button>
          <Button variant="ghost" size="sm" iconOnly label="One more {nm(q.k)}" onclick={() => more(i)}>+</Button>
          <Button variant="ghost" size="sm" iconOnly label="Remove {nm(q.k)} from the queue" onclick={() => qrm(i)}
            >✕</Button
          >
        </span>
      {/each}
    </div>
    <div class="qa">
      <Button variant="primary" onclick={() => (review = true)}>Review and craft</Button>
      <Button variant="ghost" onclick={qclear}>Clear queue</Button>
    </div>
  </section>
{/if}

<Modal bind:open={review} title="Craft {total} {plural(total, 'item')}?">
  <div class="body">
    <p class="k">
      {crafts}
      {plural(crafts, 'craft')} in total, counting intermediate items. Your inventory on this page changes; your save only
      changes when you write it.
    </p>
    <section>
      <h3 class="lbl">Used up</h3>
      <div class="qis">
        {#each df.used as [k, n] (k)}
          <Delta {k} changes={[{ n: -n }]} />
        {:else}
          <span class="k">Nothing</span>
        {/each}
      </div>
    </section>
    <section>
      <h3 class="lbl">You get</h3>
      <div class="qis">
        {#each df.got as [k, n] (k)}
          <Delta {k} changes={[{ n }]} />
        {/each}
      </div>
    </section>
    {#if ev && ev.bad.length}
      <p class="warn">{ev.bad.map((q) => nm(q.k)).join(', ')} can no longer be made and will be skipped.</p>
    {/if}
    {#if gameOnly.length}
      <p class="warn">
        {gameOnly.map((q) => nm(q.k)).join(', ')}: your save has no item of this kind to copy, so writing to the save would
        remove the ingredients without adding it. Craft {gameOnly.length === 1 ? 'it' : 'them'} in the game instead.
      </p>
    {/if}
  </div>
  {#snippet footer()}
    <Button variant="primary" disabled={!Q.length} onclick={done}>Done, craft them</Button>
    <Button variant="ghost" onclick={() => (review = false)}>Back</Button>
  {/snippet}
</Modal>

<style lang="scss">
  .queue {
    display: flex;
    flex-direction: column;
    gap: var(--ss-s-2);
    padding: var(--ss-gap);
    border-bottom: 1px solid var(--ss-line);
    background: var(--ss-primary-soft);
    flex: none;
  }
  .qh {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: var(--ss-s-3);
  }
  .lbl {
    margin: 0;
    font: 500 var(--ss-ui-xs) var(--ss-font-mono);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--ss-fg-faint);
  }
  .k {
    color: var(--ss-fg-muted);
    font-size: var(--ss-ui-md);
  }
  .ql {
    display: flex;
    flex-wrap: wrap;
    gap: var(--ss-gap-xs);
  }
  .qe {
    font-size: var(--ss-ui-md);
    display: inline-flex;
    align-items: center;
    gap: var(--ss-gap-xs);
    padding: calc(var(--ss-s-1) / 2) calc(var(--ss-s-1) / 2) calc(var(--ss-s-1) / 2) var(--ss-gap-xs);
    border: 1px solid var(--ss-line-strong);
    background: var(--ss-bg-elev);
  }
  .qn {
    font: 700 var(--ss-ui-md) var(--ss-font-mono);
    color: var(--ss-primary);
  }
  .qa {
    display: flex;
    flex-wrap: wrap;
    gap: var(--ss-gap-xs);
  }
  .body {
    display: flex;
    flex-direction: column;
    gap: var(--ss-gap);
    p {
      margin: 0;
    }
  }
  section:not(.queue) {
    display: flex;
    flex-direction: column;
    gap: var(--ss-gap-xs);
    border-top: 1px solid var(--ss-line);
    padding-top: var(--ss-gap-sm);
  }
  .qis {
    display: flex;
    flex-wrap: wrap;
    gap: var(--ss-gap-xs) var(--ss-gap);
  }
  .warn {
    color: var(--ss-yellow);
  }
</style>
