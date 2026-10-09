<!-- The crafting queue, and the review dialog that applies it to the stock. -->
<script lang="ts">
  import { Button, Modal, toast } from 'dssoca'
  import { nm } from '../core/data'
  import { stockDiff, notInSave } from '../core/engine'
  import { S, Q } from '../state.svelte'
  import ItemIcon from '../components/ItemIcon.svelte'
  import Delta from './Delta.svelte'
  import { C, qinc, qdec, qrm, qclear, craftQueue } from './inv.svelte'
  import { t } from '../i18n/index.svelte'

  type Diff = { used: [string, number][]; got: [string, number][] }
  const ev = $derived(C.scan.ev)
  const df: Diff = $derived(ev ? (stockDiff({ ...S.stock }, ev.st) as Diff) : { used: [], got: [] })
  const total = $derived(Q.reduce((a, q) => a + q.n, 0))
  const crafts = $derived(ev ? ev.steps.reduce((a, s) => a + s.crafts, 0) : 0)
  const gameOnly = $derived(Q.filter((q) => notInSave(q.k)))

  let review = $state(false)

  function more(i: number) {
    if (!qinc(i)) toast.info(t('inventory.queue.noMore', { name: nm(Q[i].k) }))
  }
  function done() {
    review = false
    craftQueue()
  }
</script>

{#if Q.length}
  <section class="queue" aria-label={t('inventory.queue.title')}>
    <div class="qh">
      <span class="lbl">{t('inventory.queue.title')}</span>
      <span class="k">{t('inventory.queue.summary', { n: df.used.length, total })}</span>
    </div>
    <div class="ql">
      {#each Q as q, i (q.k)}
        <span class="qe">
          <ItemIcon k={q.k} size={24} />
          <span class="nm">{nm(q.k)}</span>
          <span class="qn">×{q.n}</span>
          <Button variant="ghost" size="sm" iconOnly label={t('inventory.queue.less', { name: nm(q.k) })} onclick={() => qdec(i)}>−</Button>
          <Button variant="ghost" size="sm" iconOnly label={t('inventory.queue.more', { name: nm(q.k) })} onclick={() => more(i)}>+</Button>
          <Button
            variant="ghost"
            size="sm"
            iconOnly
            label={t('inventory.queue.remove', { name: nm(q.k) })}
            onclick={() => qrm(i)}>✕</Button
          >
        </span>
      {/each}
    </div>
    <div class="qa">
      <Button variant="primary" onclick={() => (review = true)}>{t('inventory.queue.review')}</Button>
      <Button variant="ghost" onclick={qclear}>{t('inventory.queue.clear')}</Button>
    </div>
  </section>
{/if}

<Modal bind:open={review} title={t('inventory.review.title', { n: total })}>
  <div class="body">
    <p class="k">{t('inventory.review.crafts', { n: crafts })}</p>
    <section>
      <h3 class="lbl">{t('inventory.review.used')}</h3>
      <div class="qis">
        {#each df.used as [k, n] (k)}
          <Delta {k} changes={[{ n: -n }]} />
        {:else}
          <span class="k">{t('inventory.review.nothing')}</span>
        {/each}
      </div>
    </section>
    <section>
      <h3 class="lbl">{t('inventory.review.got')}</h3>
      <div class="qis">
        {#each df.got as [k, n] (k)}
          <Delta {k} changes={[{ n }]} />
        {/each}
      </div>
    </section>
    {#if ev && ev.bad.length}
      <p class="warn">{t('inventory.review.bad', { names: ev.bad.map((q) => nm(q.k)).join(', ') })}</p>
    {/if}
    {#if gameOnly.length}
      <p class="warn">
        {t('inventory.review.gameOnly', { n: gameOnly.length, names: gameOnly.map((q) => nm(q.k)).join(', ') })}
      </p>
    {/if}
  </div>
  {#snippet footer()}
    <Button variant="primary" disabled={!Q.length} onclick={done}>{t('inventory.review.done')}</Button>
    <Button variant="ghost" onclick={() => (review = false)}>{t('inventory.review.back')}</Button>
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
