<!-- Notes tab: where the data comes from and how the planner counts (legacy #v-notes). -->
<script lang="ts">
  import { Heading, Card, Link, Button, Modal, toast } from 'dssoca'
  import { resetAll } from '../state.svelte'

  let confirming = $state(false)
  let cleared = $state(false)

  function reset() {
    resetAll()
    confirming = false
    cleared = true
    toast.success('Plan and stock cleared')
  }
</script>

<div class="notes">
  <article class="doc">
    <Heading level={1}>Notes on the data</Heading>

    <Card title="Where this comes from" titleLevel={2}>
      <p>
        Every recipe is taken from the Steam guide
        <Link href="https://steamcommunity.com/sharedfiles/filedetails/?id=1137514488" external
          >Complete crafting tables (700+ positions) for DOS:II</Link
        >. Duplicate rows that the guide repeats across sections are merged, and the rune templates are expanded into one
        recipe per rune type. Icons are game art collected from the Fextralife wiki. A small number of items had no icon
        there, so they borrow a similar one or show initials.
      </p>
    </Card>

    <Card title="Gift bag mods" titleLevel={2}>
      <ul>
        <li>
          Recipes tagged <strong>crafter's kit</strong> or <strong>herb gardens</strong> only exist in the Definitive Edition
          with that mod from the Song of Nature gift bag switched on (load a save, open the menu, choose Larian modifications).
        </li>
        <li>Turning these mods on disables achievements.</li>
        <li>The planner ignores mod recipes until you switch the mod on in the top bar.</li>
      </ul>
    </Card>

    <Card title="How the planner counts" titleLevel={2}>
      <ul>
        <li>
          Tools and stations (hammer, mortar and pestle, oven, anvil and so on) are not used up, so they are listed once.
        </li>
        <li>When a craft makes more than you need, the extra is reused by other branches before anything new is crafted.</li>
        <li>
          Anything you enter as in stock is taken off the totals first, including half-finished items such as pixie dust.
        </li>
        <li>
          To scan a save: in the inventory tab, load the .lsv file from <code
            >Documents\Larian Studios\Divinity Original Sin 2 Definitive Edition\PlayerProfiles\(profile)\Savegames\Story\(save)</code
          >. The file is unpacked in your browser and is not uploaded anywhere. A globals.lsf or globals.lsx extracted with
          LSLib works too. It reads every party member's bags, including items inside containers. The game's internal item
          ids are matched to the guide's names by a hand-made table; ids it does not know are listed after the import.
        </li>
        <li>
          Effects, item details and values come from each item's page on the
          <Link href="https://divinityoriginalsin2.wiki.fextralife.com/Recipes" external>Fextralife wiki</Link>. Where the
          wiki gives no value, the base value from the
          <Link href="https://craftingdivinity.azurewebsites.net/Item/Index" external>Crafting Divinity</Link> list is used.
          Where neither has one, a value marked ≈ is estimated as the cheapest sum of the item's ingredients. For scrolls and
          skillbooks the description is the skill's. Real shop prices also scale with item level and bartering, so use these
          to compare items, not as gold amounts.
        </li>
        <li>
          Rarity is my own grouping: an item is as rare as its hardest-to-find ingredient (source orbs, alien essences and
          rune frames are rare; high quality essences, distinctive herbs and skillbooks are uncommon). Difficulty is the
          number of crafts needed, counting intermediate items.
        </li>
        <li>
          The inventory tab lists everything you can make from what you entered, in one craft or through intermediate
          crafts. A specific item covers a generic slot there: a bottle of water counts as water, a fire essence as any fire
          essence, a knife as a cutting tool.
        </li>
        <li>
          Slots that accept several items show an “or” button on the node. Items with several recipes show a ⇄ button. The
          − button stops expanding an item so you can treat it as bought or looted.
        </li>
      </ul>
    </Card>

    <Card title="Tips from the guide" titleLevel={2}>
      <ul>
        <li>Using a bottle, cup or mug of water, oil, beer or wine in a recipe gives the empty container back.</li>
        <li>Leather scraps for a leather cover must go into the combine slots one by one, not as a stack.</li>
        <li>Runes go in through Manage runes on the item's right-click menu. Extracting a rune destroys nothing.</li>
        <li>
          Some eternal artefacts are flagged as miscellaneous and cannot be used for crafting, even though they look
          identical.
        </li>
        <li>
          For herb gardens, a seedling is an empty or clay-filled bucket plus a plant. Only buckets of the armour type work.
        </li>
        <li>Quest and puzzle crafts are mostly left out, and some skillbook and scroll names are the game's internal ones.</li>
      </ul>
    </Card>

    <Card title="Writing back to your save" titleLevel={2}>
      <ul>
        <li>
          Load a <strong>.lsv</strong> save in the inventory tab, craft on the page, then use
          <strong>Write changes to save</strong>. You get a .zip with the edited save inside.
        </li>
        <li>
          Counts of stacks you already carry are changed in place. A stack you use up completely is removed, along with
          every reference the save keeps to it. If anything else in the save points at that item, such as a hotbar slot,
          one is left behind instead and you are told.
        </li>
        <li>
          An item kind you do not carry yet is created by copying another item of the same kind found anywhere in the save,
          including the level files with trader and world loot. If the save has no copy of it, that item cannot be added.
        </li>
        <li>
          The page reads the rebuilt save back before offering it, and refuses if the counts do not come out as planned. It
          has not been tested in the game itself, so always keep a copy of your save folder.
        </li>
      </ul>
    </Card>

    <div class="reset">
      <Button variant="danger" onclick={() => (confirming = true)}>Reset plan and stock</Button>
      {#if cleared}<span class="done" role="status">Plan and stock cleared</span>{/if}
    </div>
  </article>
</div>

<Modal bind:open={confirming} title="Reset plan and stock?" danger size="sm">
  <p class="confirm">
    This empties your plan, your stock, your chosen recipes and the loaded save's counts, and switches the gift bag mods
    off. The theme is kept. It cannot be undone.
  </p>
  {#snippet footer()}
    <Button variant="ghost" onclick={() => (confirming = false)}>Cancel</Button>
    <Button variant="danger" onclick={reset}>Reset everything</Button>
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
  .doc {
    max-width: calc(var(--ss-s-16) * 12);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: var(--ss-block-gap);
  }
  /* let long links wrap with the sentence around them */
  p :global(.ss-link),
  li :global(.ss-link) {
    display: inline;
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
