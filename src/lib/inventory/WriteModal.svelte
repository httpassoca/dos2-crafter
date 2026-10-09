<!-- Write the planned stock back into the loaded .lsv: review the edits, then download a zip. -->
<script lang="ts">
  import { onMount } from 'svelte'
  import { Modal, Button, Spinner } from 'dssoca'
  import { I, nm } from '../core/data'
  import { prepareWrite, groupChanges, buildWrite, type WriteJob } from '../core/writer'
  import { S, SAVE } from '../state.svelte'
  import Delta from './Delta.svelte'
  import { download, errText, type Change } from './helpers'
  import { warnMsg, errMsg } from './messages'
  import { t } from '../i18n/index.svelte'

  interface Props {
    open: boolean
  }
  let { open = $bindable() }: Props = $props()

  type Phase = 'prep' | 'review' | 'build' | 'done' | 'prepErr' | 'buildErr'
  let phase: Phase = $state('prep')
  let err = $state('')
  let fname = $state('')
  const name = SAVE.file?.name || ''
  // the job is mutated by buildWrite: keep it out of $state
  let job: WriteJob | null = null
  let res = $state.raw<WriteJob['res'] | null>(null)
  let alive = true

  const rows = $derived(
    res
      ? groupChanges({ res } as unknown as WriteJob).map(([k, o]) => {
          const c: Change[] = []
          if (o.less) c.push({ n: -o.less })
          if (o.more) c.push({ n: o.more })
          if (o.neu) c.push({ n: o.neu, note: t('inventory.write.new'), title: t('inventory.write.new.tip') })
          return [k, c] as const
        })
      : [],
  )
  const noCopy = $derived(res ? res.warn.filter((w) => /no copy/.test(w[1])) : [])
  const newStacks = $derived(res ? res.done.filter((d) => d[0] === 'new').length : 0)

  const title = $derived(t(`inventory.write.t.${phase}`, { name }))
  const busy = $derived(phase === 'prep' || phase === 'build')

  const paint = () => new Promise((r) => setTimeout(r, 30))

  onMount(() => {
    prepare()
    return () => (alive = false)
  })

  async function prepare() {
    const file = SAVE.file
    if (!file) {
      err = 'no save is loaded'
      phase = 'prepErr'
      return
    }
    await paint()
    try {
      const j = await prepareWrite(file.u8, S.base ? { ...S.base } : null, { ...S.stock })
      if (!alive) return
      job = j
      res = j.res
      phase = 'review'
    } catch (e) {
      if (!alive) return
      err = errText(e)
      phase = 'prepErr'
    }
  }

  async function build() {
    const J = job
    if (!J || !SAVE.file) return
    phase = 'build'
    await paint()
    try {
      const out = await buildWrite(J, name)
      download(out.zip, out.fname, 'application/zip')
      S.base = out.base
      S.stock = out.stock
      SAVE.file = { name, u8: out.pkg }
      job = null
      fname = out.fname
      if (alive) phase = 'done'
    } catch (e) {
      if (!alive) return
      err = errText(e)
      phase = 'buildErr'
    }
  }
</script>

<Modal bind:open {title} closeOnBackdrop={!busy} closeOnEsc={!busy} danger={phase.endsWith('Err')}>
  <div class="body">
    {#if phase === 'prep'}
      <p class="k"><Spinner label={t('inventory.write.reading', { name })} showLabel /></p>
    {:else if phase === 'build'}
      <p class="k"><Spinner label={t('inventory.write.building')} showLabel /></p>
    {:else if phase === 'review' && res}
      <section>
        <h3 class="lbl">{t('inventory.write.changes')}</h3>
        <div class="qis">
          {#each rows as [k, c] (k)}
            <Delta {k} changes={c} />
          {:else}
            <span class="k">{t('inventory.write.nothing')}</span>
          {/each}
        </div>
      </section>
      {#if noCopy.length}
        <p class="warn">
          <b>{t('inventory.write.noCopy', { names: noCopy.map((w) => nm(w[0])).join(', ') })}</b>
          {t('inventory.write.noCopyHint')}
        </p>
      {/if}
      {#if res.warn.length}
        <section>
          <h3 class="lbl">{t('inventory.write.failed')}</h3>
          <ul class="wl">
            {#each res.warn as [k, w], i (i)}
              <li><b>{I[k] ? nm(k) : k}</b>: {warnMsg(w)}</li>
            {/each}
          </ul>
        </section>
      {/if}
      <section class="risk">
        <h3 class="lbl">{t('inventory.write.before')}</h3>
        <ul class="wl">
          <li>{t('inventory.write.risk.backup')}</li>
          <li>{t('inventory.write.risk.unzipPre')} <b>{name}</b> {t('inventory.write.risk.unzipPost')}</li>
          {#if newStacks}
            <li>{t('inventory.write.risk.stacks', { n: newStacks })}</li>
          {/if}
        </ul>
      </section>
    {:else if phase === 'done'}
      <p class="k">{t('inventory.write.done', { fname, name })}</p>
    {:else if phase === 'prepErr'}
      <p class="warn" role="alert">{t('inventory.write.prepErr', { err: errMsg(err) })}</p>
    {:else if phase === 'buildErr'}
      <p class="warn" role="alert">{t('inventory.write.buildErr', { err: errMsg(err) })}</p>
    {/if}
  </div>

  {#snippet footer()}
    {#if phase === 'review' && res}
      {#if res.done.length}
        <Button variant={noCopy.length ? 'secondary' : 'primary'} onclick={build}>
          {noCopy.length ? t('inventory.write.anyway') : t('inventory.write.download')}
        </Button>
      {/if}
      <Button variant="ghost" onclick={() => (open = false)}>{t('cancel')}</Button>
    {:else if phase === 'done'}
      <Button variant="primary" onclick={() => (open = false)}>{t('close')}</Button>
    {:else if !busy}
      <Button onclick={() => (open = false)}>{t('close')}</Button>
    {/if}
  {/snippet}
</Modal>

<style lang="scss">
  .body {
    display: flex;
    flex-direction: column;
    gap: var(--ss-gap);
  }
  p {
    margin: 0;
  }
  .k {
    color: var(--ss-fg-muted);
  }
  .warn {
    color: var(--ss-yellow);
  }
  section {
    display: flex;
    flex-direction: column;
    gap: var(--ss-gap-xs);
    border-top: 1px solid var(--ss-line);
    padding-top: var(--ss-gap-sm);
  }
  .lbl {
    margin: 0;
    font: 500 var(--ss-ui-xs) var(--ss-font-mono);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--ss-fg-faint);
  }
  .qis {
    display: flex;
    flex-wrap: wrap;
    gap: var(--ss-gap-xs) var(--ss-gap);
  }
  .wl {
    margin: 0;
    padding-left: var(--ss-s-4);
    display: flex;
    flex-direction: column;
    gap: var(--ss-s-1);
    font-size: var(--ss-ui-sm);
    line-height: var(--ss-leading);
    color: var(--ss-fg-muted);
  }
  .risk .wl {
    color: var(--ss-fg);
  }
</style>
