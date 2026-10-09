# dos2-crafter — agent notes

Crafting planner for Divinity: Original Sin 2 DE. Svelte 5 (runes) + Vite + TypeScript, pnpm only.
Styled with the **dssoca** design system (npm `dssoca`, source + docs at `../dssoca`).

## Layout
- `legacy/original.html` — the original single-file page. Reference for behaviour, copy text and visuals.
- `src/lib/data/*.json` — items (872) and recipes (772). `public/atlas.webp` — icon atlas, 25×25 cells.
- `src/lib/core/data.ts` — `I`, `R`, `makes`, `uses`, `nm`, `GROUPS`, `nameMap`, `nkey`, `allItems`, `craftable`.
- `src/lib/core/engine.ts` — planner/inventory engine, ported verbatim from the legacy page (same names).
- `src/lib/core/save.ts` — LSPK v13 / LSF v3 reader + writer (after LSLib), ported verbatim.
- `src/lib/core/writer.ts` — write pipeline: `prepareWrite` → `groupChanges` → `buildWrite`.
- `src/lib/state.svelte.ts` — persisted state `S` (localStorage `dos2craft:v1`), `IV`, `Q`, `SAVE`.
- `src/lib/ui.svelte.ts` — `P.values` / `P.plan` deriveds, `openItem`, `addTarget`, `planRecipe`, …
- `src/lib/tabs/*.svelte` — one per tab. `src/lib/components/` — shared UI (ItemIcon, ItemDrawer).

## Rules
- Use dssoca components wherever one fits. Scoped `<style lang="scss">`, `--ss-*` tokens only:
  no colour literals, zero border-radius, size tokens for chrome. `ss-` class prefix only for dssoca.
- Read `P.values` before calling engine `price`/`ptxt`/`RAR`/`VAL`/`recipeFor` so the caller re-runs.
- core/ is verbatim legacy code pinned by golden tests: change behaviour only on purpose, with a test.
- No personal data: never commit saves (`fixtures/` is gitignored), profile names, ids or paths.
- UI text goes through `t()` (`src/lib/i18n/`): one dictionary per area (`en` + `pt` with the same
  keys and `{placeholders}`, enforced by `test/i18n.test.ts`). Game data (item names, effects) stays English.
- `pnpm test` (Vitest; golden tests run when `fixtures/*.lsv` exist), `pnpm check`, `pnpm build`.
