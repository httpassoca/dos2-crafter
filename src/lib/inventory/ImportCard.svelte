<!-- "Import a list": paste a list, load a save or list file, copy or empty the inventory. -->
<script lang="ts">
  import { Card, Textarea, Button, FileDrop, Spinner, toast } from 'dssoca'
  import { inv, importList, exportText, emptyInventory, loadFile } from './inv.svelte'

  let files: File[] = $state([])
  function onfiles(fs: File[]) {
    const f = fs[0]
    files = []
    if (f) loadFile(f)
  }

  async function copy() {
    const t = exportText()
    inv.text = t
    try {
      await navigator.clipboard.writeText(t)
      toast.success('Your inventory is in the box above and on the clipboard.')
    } catch {
      toast.info('Your inventory is in the box above. Copy it from there.')
    }
  }

  // two-step confirm, like the original "Click again to confirm"
  let armed = $state(false)
  let timer: ReturnType<typeof setTimeout> | undefined
  function empty() {
    clearTimeout(timer)
    if (!armed) {
      armed = true
      timer = setTimeout(() => (armed = false), 4000)
      return
    }
    armed = false
    emptyInventory()
  }
</script>

<Card title="Import a list" meta="one item per line">
  <div class="body">
    <Textarea
      bind:value={inv.text}
      rows={6}
      aria-label="Item list"
      placeholder={'12 Bone\nEmpty Potion Bottle x4\nPenny Bun Mushroom: 3'}
    />
    <div class="acts">
      <Button variant="primary" onclick={() => importList(inv.text)}>Import list</Button>
      <Button variant="ghost" onclick={copy}>Copy my inventory</Button>
      <Button variant={armed ? 'danger' : 'ghost'} onclick={empty}>
        {armed ? 'Click again to confirm' : 'Empty inventory'}
      </Button>
    </div>
    <FileDrop
      label="Load a save or list"
      accept=".lsv,.lsf,.lsx,.xml,.txt,.csv,.json"
      disabled={!!inv.loading}
      bind:files
      {onfiles}
    />
    {#if inv.loading}
      <p class="msg"><Spinner label="Reading {inv.loading}…" showLabel /></p>
    {:else if inv.result}
      <div class="msg" class:warn={inv.result.warn} role="status">
        <p>{inv.result.text}</p>
        {#if inv.result.skip?.length}
          <details>
            <summary>Show the {inv.result.skip.length} skipped ids</summary>
            <span class="ids">{inv.result.skip.join(', ')}</span>
          </details>
        {/if}
      </div>
    {:else}
      <p class="msg">
        Accepts “12 Bone”, “Bone x12”, “Bone: 12”, or a JSON object of name to count. Importing sets the count for each
        item listed and leaves the rest alone. Loading a <b>.lsv</b> save file replaces the whole inventory with what
        your party is carrying. Drop the save or a list file on the box above, or click it to pick one.
      </p>
    {/if}
  </div>
</Card>

<style lang="scss">
  .body {
    display: flex;
    flex-direction: column;
    gap: var(--ss-gap-sm);
  }
  .acts {
    display: flex;
    flex-wrap: wrap;
    gap: var(--ss-gap-xs);
  }
  .msg {
    margin: 0;
    color: var(--ss-fg-faint);
    font-size: var(--ss-ui-md);
    p {
      margin: 0;
    }
    b {
      color: var(--ss-fg);
    }
    &.warn p {
      color: var(--ss-yellow);
    }
  }
  details {
    margin-top: var(--ss-s-2);
  }
  summary {
    cursor: pointer;
  }
  .ids {
    word-break: break-all;
  }
</style>
