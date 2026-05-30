# Specification — Prompt Discovery by Geography (Interactive World Map)

| | |
|---|---|
| **Status** | Draft |
| **Area** | `travel-builder` front-end (idle hero / query interface) |
| **Related epic** | Inspiration & Discovery |
| **Author** | — |
| **Last updated** | 2026-05-30 |

---

## 1. Overview

Replace the flat row of six example prompts on the landing screen with a geographic discovery experience: travellers click a **continent** on the hero's existing world-map SVG, drill into a **country**, and pick from curated **abstract trip prompts**. Selecting a prompt drops it into the query box, ready to edit or submit. Launch scope is a **curated starter set**, not exhaustive coverage.

---

## 2. Background & problem

The idle hero ("Where do you want to go?") presents six undifferentiated example prompts in a single centered row (`src/components/QueryInterface.jsx:4-11`, `EXAMPLE_QUERIES`), rendered as `QueryChip` pills.

- The prompts mix scales and regions ("WW2 historical sites across Europe", "Hemingway's literary trails") with no organizing principle, so a newcomer can't quickly find something relevant to *where* they're curious about.
- There's no signal of breadth — it doesn't convey that the product can plan a journey anywhere.
- The hero already renders a decorative `WORLD_MAP_PATHS` SVG (`src/components/Hero.jsx:3-16`), one path per continent (North America, South America, Europe, Africa, Asia, Australia), sitting unused as an interaction surface.

---

## 3. Goals

- Let travellers browse curated prompts organized **Continent → Country → Prompts**.
- Make the hero world map the primary, intuitive entry point into that browsing.
- Keep prompts abstract/evocative, consistent with the current voice.
- Make selecting a prompt seamlessly populate and focus the query box (existing behaviour).
- Feel visually impressive and welcoming to first-time travellers.

## 4. Non-goals (out of scope)

- AI-generated or dynamically fetched prompt suggestions (this is a static curated dataset).
- Search / filter across the library, favourites, or per-user personalization.
- City-level (third tier) granularity — Continent → Country → Prompt only.
- Any backend / n8n workflow changes — purely front-end discovery UI.
- Exhaustive coverage of every continent and country (intentionally a starter set; growth is a content edit, not a code change).

---

## 5. User stories

- **As a** first-time traveller who doesn't know how to phrase a trip idea, **I want to** click a continent on the world map and browse prompts by country, **so that** I can pick an inspiring, relevant idea and start in one tap.
- **As a** returning user, **I want** picking a prompt to fill the query box so I can tweak it before submitting.
- **As a** keyboard or mobile user, **I want** the same drill-down without needing a precise map tap.

---

## 6. Functional requirements

### 6.1 Content taxonomy & data model

A single static source of truth: `src/data/promptLibrary.js`.

```js
export const CONTINENTS = [
  {
    id: 'europe',
    name: 'Europe',
    mapPathIndex: 2,            // ties this continent to WORLD_MAP_PATHS[2]
    countries: [
      { name: 'Italy',  prompts: ['Renaissance art pilgrimage through Florence', /* … */] },
      { name: 'France', prompts: ['Impressionist trails of Provence', /* … */] },
      // …
    ],
  },
  // …
]
```

`mapPathIndex` keeps the data and the SVG paths in sync. Continents with no `countries` are treated as "coming soon".

**Starter-set targets:**
- All 6 hero continents appear on the map; **3–4** are seeded with content at launch.
- Each seeded continent: **2–3 countries**.
- Each country: **2–4 abstract prompts**.
- The existing six `EXAMPLE_QUERIES` are re-homed into appropriate buckets (e.g. Jazz-age New Orleans → Americas/USA; Cherry blossom → Asia/Japan; Silk Road → Asia/Uzbekistan).

Illustrative taxonomy (final copy curated during build):

```
Europe   → Italy (Renaissance art pilgrimage · Slow-food Tuscany road trip · Roman ruins after dark)
           France (Impressionist trails of Provence · Loire Valley château wine route)
           Iceland (Northern lights & geothermal springs)
Asia     → Japan (Cherry blossom immersion · Ancient temple trail, Kyoto · Tokyo neon nightlife)
           Vietnam (Street-food odyssey, Hanoi→Saigon · Halong Bay slow cruise)
           Uzbekistan (Silk Road cities overland)
Americas → USA (Jazz-age New Orleans · Route 66 desert road trip)
           Peru (Inca trail to Machu Picchu)
           Mexico (Día de los Muertos in Oaxaca)
Africa   → Morocco (Imperial cities & Sahara nights · Atlas Berber villages)
           Egypt (Nile cruise through the dynasties)
```

### 6.2 Interaction flow

1. Idle hero shows the interactive map with a short prompt ("Tap a continent to explore" or similar).
2. **Click a continent** → its country pills appear in a panel below the map; the continent shows a selected state.
3. **Click a country** → that country's prompt chips appear; the country shows a selected state.
4. **Click a prompt** → the textarea value is set to that prompt and the textarea is focused (reuse `handleChipClick`, `QueryInterface.jsx:16-19`). User can edit and submit (button or ⌘/Ctrl+Enter).
5. Selecting a different continent/country swaps the panel content and updates the active indicators.

### 6.3 States & edge cases

- **Coming-soon continents** (no seeded content) are visually distinct (dimmed / non-active) and either non-clickable or surface a graceful "More destinations coming soon" message — no dead clicks, no console errors.
- The explorer renders only in the **idle** state; it must not appear during `loading`, `success`, or `error`.
- No regression: free-text textarea, char counter (`/800`), ⌘/Ctrl+Enter submit, loading/error/success overlays, and the `#pipeline` route all continue to work.

---

## 7. UX & visual design

- Place the explorer in the idle hero between the gold divider (`Hero.jsx:267`) and `QueryInterface` (`Hero.jsx:298`) — or fold it into the top of `QueryInterface` so it sits directly above the textarea.
- Reuse the hero's existing animated map rather than drawing a second one: the same `<path>`s become buttons. Keep the float/aurora ambience; raise the map's `zIndex` (currently `0`, behind content) so paths receive pointer events.
- Hover affordance on continents: fill/opacity lift + `cursor: pointer`. Selected continent gets a premium gold glow / higher opacity while the rest dim slightly.
- Reuse `QueryChip` for country pills and prompt chips (optionally add a `variant` prop to distinguish "country" vs "prompt").
- Honor existing design tokens and the inline-`style` convention (gold `#d4a853`/`#e8c97a`, parchment `#f5f0e8`, ash `#8a9ab0`, obsidian backgrounds; Playfair / Cormorant / Inter fonts). No Tailwind-className refactor of existing components.

## 8. Accessibility

- Continents are keyboard reachable (Tab) and activatable (Enter/Space), each with an accessible name (`aria-label="Europe"`).
- Selection state is exposed via `aria-pressed` / `aria-expanded`; a visible focus ring is present.
- Country and prompt controls are real `<button>`s (already focusable via `QueryChip`).
- SVG paths used as buttons get `role="button"` + `tabIndex={0}` (or are wrapped appropriately) since paths aren't natively focusable.

## 9. Responsive / mobile

- The map is small and decorative at mobile widths. Provide a fallback that delivers the same Continent → Country → Prompt drill-down without a precise map tap — e.g. a row of continent pills (or an accordion of country buckets) driven by the same `promptLibrary` data.

---

## 10. Technical design

- **New data module:** `src/data/promptLibrary.js` — the `CONTINENTS` structure above; single source of truth for both content and `mapPathIndex` links.
- **New component:** `src/components/DestinationExplorer.jsx` — owns `selectedContinent` / `selectedCountry` local state; renders the interactive map + country/prompt panels; exposes `onPromptSelect(prompt)`.
- **Refactor `Hero.jsx`:** share `WORLD_MAP_PATHS` (import from a shared module or the data file) so the ambient backdrop and the explorer use one definition; mount `DestinationExplorer`.
- **Wire selection to the query box:** simplest path is to render `DestinationExplorer` inside `QueryInterface` (which already owns `textareaRef` and `setQuery`) and pass `onPromptSelect = handleChipClick`.
- **Replace** the flat `EXAMPLE_QUERIES` row with the explorer (optionally keep a small "popular" shortcut row sourced from the same data).
- **`QueryChip.jsx`:** optional `variant` prop for country vs prompt styling.

**Files touched:** `src/data/promptLibrary.js` (new), `src/components/DestinationExplorer.jsx` (new), `src/components/QueryInterface.jsx`, `src/components/Hero.jsx`, `src/components/QueryChip.jsx` (optional).

---

## 11. Acceptance criteria

1. Each hero-map continent is individually hoverable and clickable with a clear affordance and a distinct selected state.
2. Clicking a continent reveals its country pills; clicking a country reveals its prompt chips; reselecting swaps content and updates active indicators.
3. Clicking a prompt sets the textarea value to that prompt and focuses it (via existing `handleChipClick`).
4. Coming-soon continents are visually distinct and produce no dead clicks or errors.
5. Continents are keyboard-operable with accessible names and announced selection state.
6. A mobile/small-screen fallback delivers the same drill-down.
7. New UI matches existing design tokens and the inline-style convention.
8. No regression to textarea, counter, submit, loading/error/success, or the `#pipeline` route.

## 12. Testing & verification (manual)

1. `cd travel-builder && npm install && npm run dev`; open `http://localhost:5173`.
2. Hover continents → affordance appears; click a seeded continent → country pills show; click a country → prompt chips show.
3. Click a prompt → textarea fills and focuses; ⌘/Ctrl+Enter → itinerary loads (or graceful error if webhook unset).
4. Tab to continents, activate with Enter/Space; confirm focus ring + selection state.
5. Resize to mobile width → fallback picker completes the drill-down.
6. Click a coming-soon continent → no dead click / no console error.
7. `npm run build` → completes without errors.

## 13. Open questions / future work

- Which 3–4 continents to seed first, and final prompt copy per bucket.
- Whether to add a "Surprise me" shortcut that picks a random prompt.
- Future: city-level tier, search/filter, and content-managed (vs hardcoded) library.
