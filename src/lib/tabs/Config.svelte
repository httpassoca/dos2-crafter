<!-- Settings: interface, game mods, inventory scan options and the player's own item values.
     Everything is kept in this browser (localStorage); values are stored only for items you change. -->
<script lang="ts">
  import { Heading, Card, SegmentedControl, Switch, Button, Modal, toast, shortcut } from 'dssoca'
  import { S, IV } from '../state.svelte'
  import { t, LANGS } from '../i18n/index.svelte'
  import { I } from '../core/data'
  import ValuesTable from '../config/ValuesTable.svelte'

  const themeOptions = $derived([
    { value: 'dark', label: t('config.ui.dark') },
    { value: 'light', label: t('config.ui.light') },
  ])
  const sizeOptions = $derived(
    (['sm', 'md', 'lg'] as const).map((value) => ({ value, label: t(`app.size.${value}`) })),
  )
  const langOptions = LANGS.map((l) => ({ value: l.id, label: l.label }))
  const deepOptions = $derived([
    { value: '0', label: t('config.inv.deep0') },
    { value: '1', label: t('config.inv.deep1') },
  ])

  const changed = $derived(Object.keys(S.values).length)
  let confirming = $state(false)
  let fileEl: HTMLInputElement | undefined = $state()

  function exportValues() {
    const blob = new Blob([JSON.stringify(S.values, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'dos2-crafter-values.json'
    document.body.appendChild(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(a.href), 1000)
  }

  async function importValues(f: File | undefined) {
    if (!f) return
    try {
      const o = JSON.parse(await f.text())
      if (!o || typeof o !== 'object' || Array.isArray(o)) throw new Error('not an object')
      let n = 0
      for (const [k, v] of Object.entries(o)) {
        if (I[k] && typeof v === 'number' && Number.isFinite(v) && v > 0) {
          S.values[k] = Math.floor(v)
          n++
        }
      }
      toast.success(t('config.values.imported', { n }))
    } catch {
      toast.error(t('config.values.importBad'))
    }
    if (fileEl) fileEl.value = ''
  }

  function resetValues() {
    S.values = {}
    confirming = false
    toast.success(t('config.values.resetDone'))
  }
</script>

<div
  class="config"
  {@attach shortcut(() => ({
    id: 'config:search',
    label: t('config.sc.search'),
    keys: '/',
    group: t('app.sc.config'),
    onPress: () => (document.querySelector('.config .search input') as HTMLInputElement | null)?.focus(),
  }))}
>
  <div class="doc">
    <Heading level={1}>{t('config.title')}</Heading>
    <p class="lead">{t('config.lead')}</p>

    <div class="grid">
      <Card title={t('config.ui')} titleLevel={2}>
        <div class="fields">
          <div class="field"><span class="lbl" aria-hidden="true">{t('config.ui.theme')}</span><SegmentedControl label={t('config.ui.theme')} options={themeOptions} value={S.theme || 'dark'} onChange={(v) => (S.theme = v as 'dark' | 'light')} /></div>
          <div class="field"><span class="lbl" aria-hidden="true">{t('config.ui.size')}</span><SegmentedControl label={t('app.size')} options={sizeOptions} value={S.size || 'sm'} onChange={(v) => (S.size = v as typeof S.size)} /></div>
          <div class="field"><span class="lbl" aria-hidden="true">{t('app.lang')}</span><SegmentedControl label={t('app.lang')} options={langOptions} value={S.lang} onChange={(v) => (S.lang = v as typeof S.lang)} /></div>
        </div>
      </Card>

      <Card title={t('config.game')} titleLevel={2}>
        <div class="fields">
          <Switch label={t('mod.kit')} checked={S.mods.kit} onchange={(v) => (S.mods.kit = v)} />
          <Switch label={t('mod.herb')} checked={S.mods.herb} onchange={(v) => (S.mods.herb = v)} />
          <p class="hint">{t('config.game.hint')}</p>
        </div>
      </Card>

      <Card title={t('config.inv')} titleLevel={2}>
        <div class="fields">
          <div class="field"><span class="lbl" aria-hidden="true">{t('config.inv.deep')}</span><SegmentedControl label={t('config.inv.deep')} options={deepOptions} value={String(IV.deep)} onChange={(v) => (IV.deep = +v)} /></div>
          <Switch label={t('inventory.list.tools')} checked={!!IV.tools} onchange={(v) => (IV.tools = v ? 1 : 0)} />
          <Switch label={t('inventory.list.hand')} checked={!!IV.hand} onchange={(v) => (IV.hand = v ? 1 : 0)} />
          <p class="hint">{t('config.inv.hint')}</p>
        </div>
      </Card>
    </div>

    <Card title={t('config.values')} meta={t('config.values.meta', { n: changed })} titleLevel={2}>
      <div class="values">
        <p class="hint">{t('config.values.hint')}</p>
        <div class="acts">
          <Button onclick={exportValues} disabled={!changed}>{t('config.values.export')}</Button>
          <Button onclick={() => fileEl?.click()}>{t('config.values.import')}</Button>
          <input bind:this={fileEl} type="file" accept=".json,application/json" hidden onchange={(e) => importValues(e.currentTarget.files?.[0])} />
          <Button variant="danger" disabled={!changed} onclick={() => (confirming = true)}>{t('config.values.resetAll')}</Button>
        </div>
        <ValuesTable />
      </div>
    </Card>

    <p class="hint">{t('config.storage')}</p>
  </div>
</div>

<Modal bind:open={confirming} title={t('config.values.resetTitle')} danger size="sm">
  <p class="confirm">{t('config.values.resetBody', { n: changed })}</p>
  {#snippet footer()}
    <Button variant="ghost" onclick={() => (confirming = false)}>{t('cancel')}</Button>
    <Button variant="danger" onclick={resetValues}>{t('config.values.resetAll')}</Button>
  {/snippet}
</Modal>

<style lang="scss">
  .config {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: var(--ss-gap);
  }
  .doc {
    max-width: calc(var(--ss-s-16) * 18);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: var(--ss-block-gap);
  }
  .lead,
  .hint {
    margin: 0;
    color: var(--ss-fg-muted);
  }
  .hint {
    font-size: var(--ss-ui-sm);
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
    gap: var(--ss-block-gap);
  }
  .fields,
  .values {
    display: flex;
    flex-direction: column;
    gap: var(--ss-gap);
    min-width: 0;
  }
  .field {
    display: flex;
    flex-direction: column;
    gap: var(--ss-gap-xs);
    min-width: 0;
  }
  .lbl {
    font-size: var(--ss-ui-xs);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--ss-fg-faint);
  }
  .acts {
    display: flex;
    flex-wrap: wrap;
    gap: var(--ss-gap-sm);
  }
  .confirm {
    margin: 0;
    color: var(--ss-fg-muted);
  }
</style>
