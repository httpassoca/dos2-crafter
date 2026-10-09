<!-- Notes tab: where the data comes from and how the planner counts (legacy #v-notes). -->
<script lang="ts">
  import { Heading, Card, Link, Button, Modal, Badge, toast } from 'dssoca'
  import { resetAll } from '../state.svelte'
  import { t } from '../i18n/index.svelte'
  import Rich from './Rich.svelte'

  let confirming = $state(false)
  let cleared = $state(false)

  function reset() {
    resetAll()
    confirming = false
    cleared = true
    toast.success(t('notes.cleared'))
  }
</script>

{#snippet github()}<Link href="https://github.com/httpassoca/dos2-crafter" external>GitHub</Link>{/snippet}
{#snippet steam()}<Link href="https://steamcommunity.com/sharedfiles/filedetails/?id=1137514488" external
    >{t('notes.source.steam')}</Link
  >{/snippet}
{#snippet fextralife()}<Link href="https://divinityoriginalsin2.wiki.fextralife.com/Recipes" external
    >{t('notes.count.fextralife')}</Link
  >{/snippet}
{#snippet craftingDivinity()}<Link href="https://craftingdivinity.azurewebsites.net/Item/Index" external
    >Crafting Divinity</Link
  >{/snippet}
{#snippet kit()}<strong>{t('mod.kit')}</strong>{/snippet}
{#snippet herb()}<strong>{t('mod.herb')}</strong>{/snippet}
{#snippet path()}<code>{t('notes.count.path')}</code>{/snippet}
{#snippet lsv()}<strong>.lsv</strong>{/snippet}
{#snippet writeButton()}<strong>{t('notes.write.writeButton')}</strong>{/snippet}
{#snippet onlySave()}<strong>{t('notes.write.onlySave')}</strong>{/snippet}
{#snippet gameOnly()}<Badge tone="critical">{t('notes.write.gameOnlyBadge')}</Badge>{/snippet}

<div class="notes">
  <article class="doc">
    <Heading level={1}>{t('notes.title')}</Heading>
    <p class="lead"><Rich text={t('notes.lead')} parts={{ github }} /></p>

    <Card title={t('notes.source.title')} titleLevel={2}>
      <p>
        <Rich text={t('notes.source.body')} parts={{ steam }} />
        {#if t('notes.source.english')}{t('notes.source.english')}{/if}
      </p>
    </Card>

    <Card title={t('notes.mods.title')} titleLevel={2}>
      <ul>
        <li><Rich text={t('notes.mods.tagged')} parts={{ kit, herb }} /></li>
        <li>{t('notes.mods.achievements')}</li>
        <li>{t('notes.mods.ignored')}</li>
      </ul>
    </Card>

    <Card title={t('notes.count.title')} titleLevel={2}>
      <ul>
        <li>{t('notes.count.tools')}</li>
        <li>{t('notes.count.extra')}</li>
        <li>{t('notes.count.stock')}</li>
        <li><Rich text={t('notes.count.scan')} parts={{ path }} /></li>
        <li><Rich text={t('notes.count.values')} parts={{ fextralife, craftingDivinity }} /></li>
        <li>{t('notes.count.rarity')}</li>
        <li>{t('notes.count.inventory')}</li>
        <li>{t('notes.count.buttons')}</li>
      </ul>
    </Card>

    <Card title={t('notes.tips.title')} titleLevel={2}>
      <ul>
        <li>{t('notes.tips.container')}</li>
        <li>{t('notes.tips.leather')}</li>
        <li>{t('notes.tips.runes')}</li>
        <li>{t('notes.tips.artefacts')}</li>
        <li>{t('notes.tips.seedling')}</li>
        <li>{t('notes.tips.quests')}</li>
      </ul>
    </Card>

    <Card title={t('notes.write.title')} titleLevel={2}>
      <ul>
        <li><Rich text={t('notes.write.how')} parts={{ lsv, writeButton }} /></li>
        <li>{t('notes.write.counts')}</li>
        <li>{t('notes.write.copy')}</li>
        <li><Rich text={t('notes.write.gameOnly')} parts={{ gameOnly, onlySave }} /></li>
        <li>{t('notes.write.verify')}</li>
      </ul>
    </Card>

    <div class="reset">
      <Button variant="danger" onclick={() => (confirming = true)}>{t('notes.reset')}</Button>
      {#if cleared}<span class="done" role="status">{t('notes.cleared')}</span>{/if}
    </div>
  </article>
</div>

<Modal bind:open={confirming} title={t('notes.confirm.title')} danger size="sm">
  <p class="confirm">{t('notes.confirm.body')}</p>
  {#snippet footer()}
    <Button variant="ghost" onclick={() => (confirming = false)}>{t('cancel')}</Button>
    <Button variant="danger" onclick={reset}>{t('notes.confirm.ok')}</Button>
  {/snippet}
</Modal>

<style lang="scss">
  .notes {
    flex: 1;
    min-height: 0;
    overflow: auto;
    padding: var(--ss-main-py) var(--ss-main-px) var(--ss-s-16);
  }
  /* one readable column */
  .lead {
    margin: 0;
    color: var(--ss-fg-muted);
  }
  .doc {
    max-width: calc(var(--ss-s-16) * 12);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: var(--ss-block-gap);
  }
  /* Long links flow and wrap with the sentence (inline, not dssoca's inline-flex). Inline turns
     the whitespace between the link's label, icon and hidden "(opens in a new tab)" text into
     visible spaces, so collapse it with font-size: 0 and restore the size on the label. */
  p :global(.ss-link),
  li :global(.ss-link) {
    display: inline;
    font-size: 0;
  }
  p :global(.ss-link .label),
  li :global(.ss-link .label) {
    font-size: var(--ss-size-sm);
  }
  p :global(.ss-link .ss-link-ext),
  li :global(.ss-link .ss-link-ext) {
    margin-left: var(--ss-gap-xs);
    /* the link's own font-size is 0, so em-based alignment would collapse: use the text size */
    vertical-align: calc(var(--ss-size-sm) * -0.05);
  }
  p,
  li {
    margin: 0;
    color: var(--ss-fg-muted);
    font-size: var(--ss-size-sm);
    line-height: 1.6;
  }
  ul {
    margin: 0;
    padding-left: var(--ss-s-4);
    display: flex;
    flex-direction: column;
    gap: var(--ss-gap-xs);
  }
  li {
    break-inside: avoid;
  }
  strong {
    color: var(--ss-fg);
    font-weight: 500;
  }
  code {
    font-family: var(--ss-font-mono);
    font-size: var(--ss-ui-xs);
    color: var(--ss-fg);
    overflow-wrap: anywhere;
  }
  .reset {
    display: flex;
    align-items: center;
    gap: var(--ss-gap);
    flex-wrap: wrap;
  }
  .done {
    color: var(--ss-fg-faint);
    font-size: var(--ss-ui-sm);
  }
  .confirm {
    color: var(--ss-fg);
  }
  @media (max-width: 900px) {
    .notes {
      padding: var(--ss-gap) var(--ss-gap) var(--ss-s-10);
    }
  }
</style>
