<!-- The loaded save: what changed since it was read, stashed edits, and writing back. -->
<script lang="ts">
  import { Card, Button } from 'dssoca'
  import { pending } from '../core/engine'
  import { S, SAVE } from '../state.svelte'
  import Delta from './Delta.svelte'
  import WriteModal from './WriteModal.svelte'
  import { reapplyStash, discardStash } from './inv.svelte'
  import { t } from '../i18n/index.svelte'

  const p: [string, number][] = $derived.by(() => {
    void S.base
    void S.stock
    // pending() reads every key of both, so this re-runs on any edit
    return pending() as [string, number][]
  })
  const stashN = $derived(Object.keys(S.stash || {}).length)
  const loaded = $derived(!!SAVE.file && SAVE.file.name === S.saveName)
  let writing = $state(false)
</script>

<Card title={t('inventory.save.title')} meta={S.saveName || ''}>
  <div class="body">
    {#if stashN}
      <p class="warn">{t('inventory.save.stash', { n: stashN })}</p>
      <div class="acts">
        <Button onclick={reapplyStash}>{t('inventory.save.reapply')}</Button>
        <Button variant="ghost" onclick={discardStash}>{t('inventory.save.discard')}</Button>
      </div>
    {/if}
    {#if !p.length}
      <p class="k">{t('inventory.save.matches')}</p>
    {:else}
      <p class="k">{t('inventory.save.pending', { n: p.length })}</p>
      <div class="qis">
        {#each p.slice(0, 14) as [k, d] (k)}
          <Delta {k} changes={[{ n: d }]} />
        {/each}
        {#if p.length > 14}<span class="k">{t('inventory.save.more', { n: p.length - 14 })}</span>{/if}
      </div>
      {#if loaded}
        <div class="acts"><Button variant="primary" onclick={() => (writing = true)}>{t('inventory.save.write')}</Button></div>
      {:else}
        <p class="k">{t('inventory.save.reload', { name: S.saveName || t('inventory.save.sameSave') })}</p>
      {/if}
    {/if}
  </div>
</Card>

{#if writing}
  <WriteModal bind:open={writing} />
{/if}

<style lang="scss">
  .body {
    display: flex;
    flex-direction: column;
    gap: var(--ss-gap-sm);
  }
  p {
    margin: 0;
  }
  .k {
    color: var(--ss-fg-muted);
    font-size: var(--ss-ui-md);
  }
  .warn {
    color: var(--ss-yellow);
  }
  .acts {
    display: flex;
    flex-wrap: wrap;
    gap: var(--ss-gap-xs);
  }
  .qis {
    display: flex;
    flex-wrap: wrap;
    gap: var(--ss-gap-xs) var(--ss-gap);
  }
</style>
