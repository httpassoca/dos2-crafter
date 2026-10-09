<!-- The loaded save: what changed since it was read, stashed edits, and writing back. -->
<script lang="ts">
  import { Card, Button } from 'dssoca'
  import { pending } from '../core/engine'
  import { S, SAVE } from '../state.svelte'
  import Delta from './Delta.svelte'
  import WriteModal from './WriteModal.svelte'
  import { reapplyStash, discardStash } from './inv.svelte'
  import { plural } from './helpers'

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

<Card title="Save file" meta={S.saveName || ''}>
  <div class="body">
    {#if stashN}
      <p class="warn">
        You had {stashN}
        {plural(stashN, 'change')} that were never written to a save. Put them back on top of this save?
      </p>
      <div class="acts">
        <Button onclick={reapplyStash}>Reapply them</Button>
        <Button variant="ghost" onclick={discardStash}>Discard them</Button>
      </div>
    {/if}
    {#if !p.length}
      <p class="k">Your inventory here matches this save.</p>
    {:else}
      <p class="k">{p.length} {plural(p.length, 'change')} not written to the save yet:</p>
      <div class="qis">
        {#each p.slice(0, 14) as [k, d] (k)}
          <Delta {k} changes={[{ n: d }]} />
        {/each}
        {#if p.length > 14}<span class="k">and {p.length - 14} more</span>{/if}
      </div>
      {#if loaded}
        <div class="acts"><Button variant="primary" onclick={() => (writing = true)}>Write changes to save</Button></div>
      {:else}
        <p class="k">
          Load {S.saveName || 'the same save'} again to write them. Your changes are kept and will be reapplied.
        </p>
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
