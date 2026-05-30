# Tasks — Prompt Discovery by Geography (parallel agent execution)

Breaks `plan.md` into discrete tasks for **multiple Claude agents working concurrently**. Spec: `docs/specs/prompt-discovery-by-geography.md`.

## How to use this file (read first)

- **One task = one agent = one file.** Tasks are partitioned so that no two agents edit the same file → no merge conflicts. Do **not** touch files outside your task's "Owns" list.
- **Code against the [Shared contracts](#shared-contracts) below, not against other agents' internals.** The contracts are frozen; if you think one must change, stop and flag it rather than diverging.
- **Isolation:** run each task in its own git worktree/branch. Integrator merges in the order in the [Dependency graph](#dependency-graph).
- A task is "done" when its file matches its contract + acceptance criteria. Tasks T3–T5 will not `npm run build` fully green until their upstream files are merged — that's expected; self-review against the contract, build-green is checked at integration.

---

## Dependency graph

| Wave | Tasks (run in parallel within a wave) | Depends on | May edit |
|------|----------------------------------------|------------|----------|
| **1 — Foundation** | **T1** promptLibrary · **T2** QueryChip | nothing | `src/data/promptLibrary.js` (new) · `src/components/QueryChip.jsx` |
| **2 — Build** | **T3** DestinationExplorer · **T4** Hero swap | T1 (both) + T2 contract (T3) | `src/components/DestinationExplorer.jsx` (new) · `src/components/Hero.jsx` |
| **3 — Integrate** | **T5** QueryInterface wiring | T3, T2 | `src/components/QueryInterface.jsx` |
| **3 — Verify** | **T6** integration & QA | T1–T5 | none (read-only + run commands) |

> Agents *may* all start at once if they strictly follow the contracts; the merge order above still applies. T1 and T2 are the only tasks that build green in isolation.

---

## Shared contracts

These are the seams between tasks. Treat as frozen API.

### C1 — `src/data/promptLibrary.js` exports (owned by T1)

```js
// 6 SVG path strings, byte-identical to the current Hero.jsx WORLD_MAP_PATHS (lines 3-16), SAME ORDER.
// index → continent: 0 North America · 1 South America · 2 Europe · 3 Africa · 4 Asia · 5 Oceania
export const WORLD_MAP_PATHS = [ /* … */ ]

// Continent → Country → prompts taxonomy.
export const CONTINENTS = [
  {
    id: 'europe',            // string, kebab-case, unique
    name: 'Europe',          // string, display label
    mapPathIndex: 2,         // number, index into WORLD_MAP_PATHS
    comingSoon: false,       // optional boolean; true ⇒ countries === [] and region is non-selectable
    countries: [             // array (empty when comingSoon)
      { name: 'Italy', prompts: ['Renaissance art pilgrimage through Florence', /* … */] },
    ],
  },
  // …one entry per continent, all 6 mapPathIndex values 0..5 present exactly once
]
```

### C2 — `QueryChip` props (owned by T2)

```
QueryChip({ label, onClick, variant = 'prompt', selected = false, disabled = false })
```
- `variant`: `'prompt' | 'country'`. **`'prompt'` (default) must render byte-for-byte like today** so existing behaviour is unchanged.
- `selected`: active state — gold fill (`#d4a853` / `rgba(212,168,83,…)`), brighter text.
- `disabled`: dimmed, `cursor: not-allowed`, `onClick` not fired, `aria-disabled`.
- Only current consumer is `QueryInterface.jsx`; keep defaults backward-compatible.

### C3 — `DestinationExplorer` props (owned by T3)

```
DestinationExplorer({ onPromptSelect })
```
- `onPromptSelect: (promptText: string) => void` — called with the chosen prompt's text when a prompt chip is clicked. The component holds all of its own selection state; the parent only receives the final prompt string.

---

## T1 — Data module `src/data/promptLibrary.js`  *(Wave 1, no deps)*

**Owns:** `src/data/promptLibrary.js` (new). **Do not** edit `Hero.jsx` (that's T4).

**Do:**
1. Create the file and export `WORLD_MAP_PATHS` — copy the 6 path strings verbatim from `Hero.jsx:3-16`, preserving order and the continent comments.
2. Export `CONTINENTS` per **C1**. Seed **4** continents with content and mark the other 2 `comingSoon: true` with `countries: []`. Suggested seed (curated content from `plan.md`):
   - North America (idx 0): United States, Mexico
   - South America (idx 1): `comingSoon`
   - Europe (idx 2): Italy, France, Iceland
   - Africa (idx 3): Morocco, Egypt
   - Asia (idx 4): Japan, Vietnam, Uzbekistan
   - Oceania (idx 5): `comingSoon`
   - Re-home the existing six example prompts where natural (Jazz-age→USA, Cherry blossom→Japan, Silk Road→Uzbekistan, etc.).

**Acceptance:** file imports cleanly; `WORLD_MAP_PATHS.length === 6`; each `mapPathIndex` 0–5 used exactly once; seeded continents have ≥2 countries, each with 2–4 prompts; comingSoon continents have `countries: []`.

---

## T2 — `QueryChip` variants  *(Wave 1, no deps)*

**Owns:** `src/components/QueryChip.jsx`.

**Do:** Implement the **C2** prop API. Add `variant` / `selected` / `disabled` branches to the existing inline styles. Keep the current pill as the `'prompt'` default. For `disabled`, guard the `onClick` and `onMouseEnter/Leave` handlers and set `aria-disabled`. Follow the existing inline-`style` + hover-handler pattern already in the file — no className refactor.

**Acceptance:** rendering `<QueryChip label="x" onClick={fn} />` is visually identical to before; `selected` shows a gold active state; `disabled` is non-interactive and dimmed; no new deps.

---

## T3 — `DestinationExplorer` component  *(Wave 2; deps: C1, C2)*

**Owns:** `src/components/DestinationExplorer.jsx` (new). Import `WORLD_MAP_PATHS` + `CONTINENTS` from `../data/promptLibrary.js` and `QueryChip` from `./QueryChip.jsx`.

**Do:** Build the dedicated, contained explorer per `plan.md` step 2 and **C3**:
1. Local state `selectedContinentId`, `selectedCountry`.
2. **Contained map:** `<svg viewBox="0 0 1000 500">` at `width:100%, maxWidth:~520px`, mapping `WORLD_MAP_PATHS` to interactive `<path>`s — hover lift, gold selected fill + glow, dimmed `comingSoon`. A11y: `role="button"`, `tabIndex={0}`, `aria-label={name}`, `aria-pressed`, Enter/Space handler. (This is a *separate* map from the Hero backdrop — do not modify the backdrop.)
3. **Drill-down panel** (wrap in `.glass`): selected continent → country pills via `<QueryChip variant="country" selected onClick>`; coming-soon → "More destinations coming soon ✦"; selected country → prompt chips via `<QueryChip variant="prompt" onClick={() => onPromptSelect(prompt)}>`.
4. **Mobile fallback:** below ~640px render continents as a horizontal pill row driving the same selection (no precise map tap needed).
5. Entrance via inline `animation: 'fadeIn …' / 'slideUp …'` (keyframes exist in `tailwind.config.js:29-55`); use design tokens + eyebrow heading "Explore by destination".

**Acceptance:** standalone the component renders map → country → prompt drill-down; clicking a prompt calls `onPromptSelect(text)`; coming-soon regions are non-selectable with the message; keyboard-operable; matches design tokens. (Won't build green until T1 merged — fine.)

---

## T4 — `Hero.jsx` path dedupe  *(Wave 2; dep: C1)*

**Owns:** `src/components/Hero.jsx`.

**Do:** Replace the local `WORLD_MAP_PATHS` const (lines 3-16) with `import { WORLD_MAP_PATHS } from '../data/promptLibrary.js'`. Nothing else changes — the backdrop SVG, animations, and layout stay identical. (Do **not** add the explorer here; that's T5 via QueryInterface.)

**Acceptance:** Hero backdrop is visually unchanged; the local const is gone; no other edits to the file.

---

## T5 — Wire explorer into `QueryInterface.jsx`  *(Wave 3; deps: T3, C2)*

**Owns:** `src/components/QueryInterface.jsx`.

**Do:**
1. `import DestinationExplorer from './DestinationExplorer.jsx'`.
2. Remove the `EXAMPLE_QUERIES` const (lines 4-11) and the flat chip `<div>` block (lines 41-53).
3. Render `<DestinationExplorer onPromptSelect={handleChipClick} />` where the chip row was (above the textarea). Keep `handleChipClick` (lines 16-19) — it already does `setQuery(label)` + focus, which is exactly the `onPromptSelect` contract.

**Acceptance:** flat chips gone; explorer renders above the textarea; choosing a prompt fills + focuses the textarea; counter/submit/⌘-Enter unchanged.

---

## T6 — Integration & QA  *(Wave 3; deps: all)*

**Owns:** nothing (read-only + run commands). After T1–T5 are merged:
1. `cd travel-builder; npm install; npm run dev` → `http://localhost:5173`.
2. Walk the flow: hover continent → click → countries → click country → prompts → click prompt → textarea fills + focuses → ⌘/Ctrl+Enter submits.
3. Keyboard-only pass (Tab + Enter/Space on continents); mobile-width pass (pill fallback); click a coming-soon continent (South America / Oceania) → message, no console error.
4. Confirm Hero backdrop + existing loading/error/success states + `#pipeline` route unchanged.
5. `npm run build` succeeds.

**Acceptance:** all `plan.md` acceptance criteria pass; build green; no regressions.

---

## Conflict-avoidance summary

| File | Sole owner |
|------|-----------|
| `src/data/promptLibrary.js` | T1 |
| `src/components/QueryChip.jsx` | T2 |
| `src/components/DestinationExplorer.jsx` | T3 |
| `src/components/Hero.jsx` | T4 |
| `src/components/QueryInterface.jsx` | T5 |

No file appears twice → agents never collide. Merge order: **T1, T2 → T3, T4 → T5 → T6**.
