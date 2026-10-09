<!-- "Import a list": paste a list, load a save or list file, copy or empty the inventory. -->
<script lang="ts">
  import { Card, Textarea, Button, FileDrop, Spinner, toast } from 'dssoca'
  import { inv, importList, exportText, emptyInventory, loadFile } from './inv.svelte'
  import { importMsg } from './messages'
  import { t } from '../i18n/index.svelte'

  let files: File[] = $state([])
  function onfiles(fs: File[]) {
    const f = fs[0]
    files = []
    if (f) loadFile(f)
  }

  async function copy() {
    const text = exportText()
    inv.text = text
    try {
      await navigator.clipboard.writeText(text)
      toast.success(t('inventory.import.copied'))
    } catch {
      toast.info(t('inventory.import.copiedBox'))
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

<Card title={t('inventory.import.title')} meta={t('inventory.import.meta')}>
  <div class="body">
    <Textarea
      bind:value={inv.text}
      rows={6}
      aria-label={t('inventory.import.aria')}
      placeholder={'12 Bone\nEmpty Potion Bottle x4\nPenny Bun Mushroom: 3'}
    />
    <div class="acts">
      <Button variant="primary" onclick={() => importList(inv.text)}>{t('inventory.import.btn')}</Button>
      <Button variant="ghost" onclick={copy}>{t('inventory.import.copy')}</Button>
      <Button variant={armed ? 'danger' : 'ghost'} onclick={empty}>
        {armed ? t('inventory.import.confirm') : t('inventory.import.empty')}
      </Button>
    </div>
    <FileDrop
      label={t('inventory.import.drop')}
      accept=".lsv,.lsf,.lsx,.xml,.txt,.csv,.json"
      disabled={!!inv.loading}
      bind:files
      {onfiles}
    />
    {#if inv.loading}
      <p class="msg"><Spinner label={t('inventory.import.reading', { name: inv.loading })} showLabel /></p>
    {:else if inv.result}
      <div class="msg" class:warn={inv.result.warn} role="status">
        <p>{importMsg(inv.result.text)}</p>
        {#if inv.result.skip?.length}
          <details>
            <summary>{t('inventory.import.skipped', { n: inv.result.skip.length })}</summary>
            <span class="ids">{inv.result.skip.join(', ')}</span>
          </details>
        {/if}
      </div>
    {:else}
      <p class="msg">
        {t('inventory.import.helpPre')} <b>.lsv</b>
        {t('inventory.import.helpPost')}
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
