# Implementation Plan — Prompt Discovery by Geography (Interactive World Map)

Implements the spec at `docs/specs/prompt-discovery-by-geography.md`.

## Context

The idle hero shows six flat, region-mixed example prompts (`src/components/QueryInterface.jsx:4-11`, `EXAMPLE_QUERIES`) with no organizing principle, and the hero's decorative world-map SVG (`src/components/Hero.jsx:3-16`) is unused as an interaction surface. We're replacing the flat chip row with a **Continent → Country → Prompt** explorer driven by a clickable map, so first-time travellers can browse curated abstract trip ideas geographically. Picking a prompt fills and focuses the query box (existing behaviour) so they can edit and submit.

## Decisions locked in

- **Dedicated contained map**, rendered inside the explorer panel near the query box — *not* the full-bleed backdrop. The backdrop map stays purely decorative. (Avoids the z-index/overlap fight with the headline and textarea.)
- **Curated starter set** scope: a few continents seeded now, others shown as "coming soon".
- **Six continents map 1:1** to the existing `WORLD_MAP_PATHS` entries (North America, South America, Europe, Africa, Asia, Oceania) — so each clickable region is exactly one SVG path. (Spec's combined "Americas" is split into North/South America to match the SVG.)

## Architecture

```
QueryInterface  (owns query state, textareaRef, handleChipClick)
└─ DestinationExplorer  onPromptSelect={handleChipClick}
   ├─ <InteractiveWorldMap>   contained SVG, paths = WORLD_MAP_PATHS, click → select continent
   └─ <DrillDownPanel>        country pills → prompt chips (reuse QueryChip)
```

Data flows one way: `promptLibrary.js` → `DestinationExplorer` (local selection state) → `onPromptSelect(promptText)` → existing `handleChipClick` sets `query` + focuses textarea. No new query plumbing.

## Files

### New
- **`src/data/promptLibrary.js`** — single source of truth. Exports `WORLD_MAP_PATHS` (moved here from `Hero.jsx` to dedupe) and `CONTINENTS` taxonomy.
- **`src/components/DestinationExplorer.jsx`** — interactive map + drill-down panel; owns `selectedContinentId` / `selectedCountry`; takes `onPromptSelect`.

### Modified
- **`src/components/Hero.jsx`** — import `WORLD_MAP_PATHS` from the data module instead of the local const (lines 3-16); backdrop map otherwise unchanged.
- **`src/components/QueryInterface.jsx`** — render `<DestinationExplorer onPromptSelect={handleChipClick} />` above the textarea; remove the flat `EXAMPLE_QUERIES` row (or keep a small "popular" shortcut sourced from the new data — optional).
- **`src/components/QueryChip.jsx`** — add optional `variant` prop (`'country' | 'prompt'`) + `selected` / `disabled` styling; defaults preserve current look.

## Step-by-step

1. **Data module** — create `src/data/promptLibrary.js`:
   - Move `WORLD_MAP_PATHS` out of `Hero.jsx` into this file and `export` it; update `Hero.jsx` to import it.
   - Add `CONTINENTS`, each linked to its path by `mapPathIndex` (the index order is fixed: `0` N.America, `1` S.America, `2` Europe, `3` Africa, `4` Asia, `5` Oceania).
   - Seed 4 continents; mark the rest `comingSoon`. Re-home the existing six prompts where natural.

   ```js
   export const WORLD_MAP_PATHS = [ /* moved from Hero.jsx, same 6 strings */ ]

   export const CONTINENTS = [
     { id: 'north-america', name: 'North America', mapPathIndex: 0, countries: [
       { name: 'United States', prompts: ['Jazz-age immersion in New Orleans', 'Route 66 desert road trip', 'National parks of the American West'] },
       { name: 'Mexico',        prompts: ['Día de los Muertos in Oaxaca', 'Yucatán cenotes & Maya ruins'] },
     ]},
     { id: 'south-america', name: 'South America', mapPathIndex: 1, comingSoon: true, countries: [] },
     { id: 'europe', name: 'Europe', mapPathIndex: 2, countries: [
       { name: 'Italy',   prompts: ['Renaissance art pilgrimage through Florence', 'Slow-food road trip across Tuscany', 'Roman ruins after dark'] },
       { name: 'France',  prompts: ['Impressionist trails of Provence', 'Loire Valley château wine route'] },
       { name: 'Iceland', prompts: ['Northern lights & geothermal springs', 'Viking heritage saga trail'] },
     ]},
     { id: 'africa', name: 'Africa', mapPathIndex: 3, countries: [
       { name: 'Morocco', prompts: ['Imperial cities & Sahara nights', 'Atlas Mountains Berber villages'] },
       { name: 'Egypt',   prompts: ['Nile cruise through the ancient dynasties'] },
     ]},
     { id: 'asia', name: 'Asia', mapPathIndex: 4, countries: [
       { name: 'Japan',      prompts: ['Cherry blossom season immersion', 'Ancient temple trail in Kyoto', 'Tokyo neon nightlife crawl'] },
       { name: 'Vietnam',    prompts: ['Street-food odyssey, Hanoi to Saigon', 'Halong Bay slow cruise'] },
       { name: 'Uzbekistan', prompts: ['Ancient Silk Road cities overland'] },
     ]},
     { id: 'oceania', name: 'Oceania', mapPathIndex: 5, comingSoon: true, countries: [] },
   ]
   ```

2. **`DestinationExplorer.jsx`** — build the component:
   - State: `const [continentId, setContinentId] = useState(null)` and `const [country, setCountry] = useState(null)`.
   - **Contained map:** render an `<svg viewBox="0 0 1000 500">` at `width:100%, maxWidth:~520px`, mapping `WORLD_MAP_PATHS` to `<path>`s. Each path is interactive:
     - hover (non-coming-soon): raise `fillOpacity` + `cursor:pointer` (inline `onMouseEnter/Leave`, matching the `QueryChip`/submit-button pattern).
     - selected continent: gold fill (`#d4a853`) + glow (`filter: drop-shadow`), others dim.
     - coming-soon: lower opacity, `cursor:not-allowed`, no selection.
     - a11y: `role="button"`, `tabIndex={0}`, `aria-label={continent.name}`, `aria-pressed={selected}`, `onKeyDown` Enter/Space → select.
   - **Drill-down panel** below the map (wrap in `.glass`):
     - When a continent is selected → show its country pills via `<QueryChip variant="country" selected={…}>`; coming-soon continent → show "More destinations coming soon ✦".
     - When a country is selected → show its prompt chips via `<QueryChip variant="prompt" onClick={() => onPromptSelect(prompt)}>`.
   - Entrance: reuse `animation: 'fadeIn …'` / `'slideUp …'` (keyframes already defined in `tailwind.config.js:29-55`, applied inline like `Hero.jsx`).
   - Small heading/eyebrow ("Explore by destination") in the Courier-New eyebrow style for polish.

3. **Wire into `QueryInterface.jsx`** — import and mount above the textarea block; pass `onPromptSelect={handleChipClick}` (the existing handler at lines 16-19 already does `setQuery(label)` + `textareaRef.current?.focus()`). Remove the `EXAMPLE_QUERIES` flat-chip block (lines 41-53) — or keep a trimmed "popular" row fed from `promptLibrary` (optional, default: remove).

4. **Dedupe map paths in `Hero.jsx`** — replace the local `WORLD_MAP_PATHS` const with `import { WORLD_MAP_PATHS } from '../data/promptLibrary.js'`. No visual change to the backdrop.

5. **`QueryChip.jsx` variants** — add `variant`, `selected`, `disabled` props with sensible inline-style branches; keep the current pill as the default so existing usages are unaffected.

6. **Mobile fallback** — below ~640px the contained map is small; render the continents as a horizontal pill row (same `onSelect`) above the panel so selection never needs a precise map tap. Same data, same drill-down.

## Styling (reuse, don't invent)

- Tokens: gold `#d4a853` / `#e8c97a`, parchment `#f5f0e8`, ash `#8a9ab0`, obsidian `#0a0a0f`; fonts Playfair (display), Cormorant (italic accents), Inter (body), Courier New (eyebrow).
- Reuse `.glass` / `.glass-strong` (`src/index.css:46-59`) for the panel, `.card-hover` for lift, and the existing `QueryChip` pill aesthetic.
- Follow the inline-`style={{…}}` convention used throughout — no Tailwind-className refactor of existing components.

## Accessibility checklist

- Continents keyboard-reachable (Tab) + activatable (Enter/Space); `aria-label` per continent; `aria-pressed` for selection.
- Visible focus ring on map regions and chips.
- Country/prompt controls are real `<button>`s (via `QueryChip`).
- Coming-soon regions are not focusable as actions / clearly disabled.

## Edge cases & non-regression

- Coming-soon continent → graceful message, no dead click, no console error.
- Explorer renders only in the idle hero (it lives inside `Hero`, which `App.jsx` dims on `success` and hides under overlays on `loading`/`error`).
- Unchanged: textarea + `/800` counter, ⌘/Ctrl+Enter submit, loading/error/success states, `#pipeline` route.

## Verification

1. `cd travel-builder; npm install; npm run dev` → open `http://localhost:5173`.
2. Hover a seeded continent → affordance; click → country pills appear; click a country → prompt chips appear.
3. Click a prompt → textarea fills + focuses; ⌘/Ctrl+Enter → itinerary loads (or graceful error if `VITE_N8N_WEBHOOK_URL` unset).
4. Tab to continents, activate with Enter/Space → focus ring + selection state correct.
5. Resize to mobile width → continent pill fallback completes the drill-down.
6. Click a coming-soon continent (South America / Oceania) → message shown, no error.
7. Confirm backdrop hero map and all existing flows are visually unchanged; `npm run build` succeeds.

## Out of scope

AI-generated suggestions; search/filter; favourites/personalization; city-level tier; backend/n8n changes; exhaustive continent coverage.

## Suggested commit order

1. `data: add promptLibrary + share WORLD_MAP_PATHS` (new data module + Hero import swap).
2. `feat: QueryChip variants` (additive).
3. `feat: DestinationExplorer component`.
4. `feat: wire explorer into QueryInterface, remove flat example chips`.
5. `feat: mobile fallback + a11y pass`.
