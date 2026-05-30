# Test Cases — Prompt Discovery by Geography (end-to-end)

Manual E2E test plan for the interactive continent → country → prompt explorer.
Feature spec: `prompt-discovery-by-geography.md` · Plan: `../../plan.md` · Tasks: `../../tasks.md`.

> The project has no automated test runner (per `CLAUDE.md`). These are manual cases.
> Each maps to an acceptance criterion (AC1–AC8) — see [Traceability](#traceability).

---

## Environment & setup

| Item | Value |
|------|-------|
| Start | `cd travel-builder && npm install && npm run dev` → `http://localhost:5173` |
| Build gate | `npm run build` must succeed (no TS/JSX/import errors) |
| Webhook | Full itinerary submit needs `VITE_N8N_WEBHOOK_URL` set in `.env` (restart Vite after changing). If **unset/unreachable**, submit should fail **gracefully** into the error state — which is itself a valid expected result. |
| Browsers | Chromium + one of Firefox/Safari. Desktop ≥1024px and mobile ≤640px (DevTools device toolbar). |
| Keyboard | Have a keyboard-only pass (no mouse) for the a11y group. |

**Test data (seeded `CONTINENTS` in `src/data/promptLibrary.js`):**

| Continent | State | Countries → (prompt count) |
|-----------|-------|-----------------------------|
| North America | seeded | United States (3), Mexico (2) |
| Europe | seeded | Italy (3), France (2), Iceland (2) |
| Africa | seeded | Morocco (2), Egypt (2) |
| Asia | seeded | Japan (3), Vietnam (2), Uzbekistan (2) |
| South America | **coming soon** | — |
| Oceania | **coming soon** | — |

Representative prompt strings (exact text matters for TC-A4 / TC-G3): `Jazz-age immersion in New Orleans`, `Día de los Muertos in Oaxaca`, `Loire Valley château wine route`, `Renaissance art pilgrimage through Florence`.

---

## TC-0 — Build & boot smoke

- **TC-0.1** *(P0)* `npm run build` completes with no errors. **Expected:** "✓ built" with bundled `dist/` assets.
- **TC-0.2** *(P0)* `npm run dev` boots; landing page renders with hero headline and the "Explore by destination" block; no console errors on load.

## A — Discovery happy path

- **TC-A1** *(P0, AC1)* Load page (desktop). **Expected:** eyebrow "Explore by destination"; contained world-map SVG visible (≤520px wide), centered; drill-down panel shows the italic hint **"Tap a continent to explore"**.
- **TC-A2** *(P0, AC1/AC2)* Click **Europe** on the map. **Expected:** Europe path lifts to the selected gold state (higher opacity + glow); panel shows the "EUROPE" label and country chips **Italy / France / Iceland** (country-variant pills). No prompt chips yet.
- **TC-A3** *(P0, AC2)* With Europe selected, click **Italy**. **Expected:** Italy chip shows selected (gold) state; a "Prompts" group appears with exactly Italy's 3 prompt chips.
- **TC-A4** *(P0, AC3)* Click the prompt **"Renaissance art pilgrimage through Florence"**. **Expected:** textarea value becomes that exact string (character-for-character); textarea receives focus; char counter updates to the string's length.
- **TC-A5** *(P1, AC3)* After TC-A4, click **Plan My Journey**. **Expected:** loading overlay appears; flow ends in a terminal state — itinerary result (webhook configured) **or** graceful "Journey Interrupted" error (webhook unset). No hang past the 120s timeout.
- **TC-A6** *(P1, AC3)* Pick any prompt, then press **⌘/Ctrl + Enter** in the textarea. **Expected:** same submit behavior as TC-A5 (handler still wired).

## B — Selection state machine

- **TC-B1** *(P1, AC2)* Select Europe → Italy (prompts shown), then click **Asia**. **Expected:** country row swaps to Asia's (Japan/Vietnam/Uzbekistan); **prompts are cleared** (no stale Italy prompts); selected country reset.
- **TC-B2** *(P2, AC2)* Click the **already-selected** continent again. **Expected:** it deselects; panel returns to the "Tap a continent to explore" hint.
- **TC-B3** *(P2, AC2)* Select a country, then click that **same country** chip again. **Expected:** prompt chips collapse (country deselected); country chips remain.
- **TC-B4** *(P2, AC2)* With a continent selected, click a **different country**. **Expected:** prompt chips swap to the new country's set.

## C — Coming-soon continents

- **TC-C1** *(P1, AC4)* Click **South America**. **Expected:** panel shows **"More destinations coming soon ✦"**; no country/prompt chips; **no console error**; textarea unchanged.
- **TC-C2** *(P1, AC4)* Inspect a coming-soon path (South America / Oceania). **Expected:** visibly dimmed (low opacity), `cursor: not-allowed`, cannot enter the selected state on click.
- **TC-C3** *(P2, AC4)* Repeat TC-C1 for **Oceania**. **Expected:** same coming-soon behavior.

## D — Accessibility / keyboard

- **TC-D1** *(P1, AC5)* Keyboard-only: **Tab** through the explorer. **Expected:** focus lands on each **seeded** continent (role=button) with a visible focus indicator; **coming-soon** continents are skipped (not in tab order, `tabIndex=-1`).
- **TC-D2** *(P1, AC5)* Focus a seeded continent, press **Enter**, then **Space**. **Expected:** both activate selection; Space does **not** scroll the page (default prevented).
- **TC-D3** *(P1, AC5)* Inspect a continent path's ARIA. **Expected:** `aria-label` = continent name (coming-soon appends "(coming soon)"); `aria-pressed` toggles `true`/`false` with selection.
- **TC-D4** *(P2, AC5)* Tab to country/prompt chips. **Expected:** real focusable `<button>`s, activatable by Enter/Space; disabled pills expose `aria-disabled`.
- **TC-D5** *(P2, AC5)* Inspect landmarks. **Expected:** explorer `<section aria-label="Destination Explorer">`; map svg has an `aria-label`; the equator/meridian lines and labels are `aria-hidden`.

## E — Responsive / mobile

- **TC-E1** *(P1, AC6)* Set viewport ≤640px (reload). **Expected:** SVG map is hidden; a horizontal, scrollable **continent pill row** is shown instead.
- **TC-E2** *(P1, AC6)* On mobile, tap a seeded continent pill → country → prompt. **Expected:** identical drill-down to desktop; tapping a prompt fills + focuses the textarea.
- **TC-E3** *(P2, AC6)* On mobile, the coming-soon pills (South America / Oceania). **Expected:** rendered **disabled** (dimmed, non-interactive, no selection).
- **TC-E4** *(P2, AC6)* Resize the window across the 640px boundary without reloading. **Expected:** UI switches between map and pill row reactively (matchMedia listener), selection state preserved where sensible.
- **TC-E5** *(P2, AC7)* Desktop: visually compare horizontal alignment of the explorer panel and the textarea below it. **Expected:** left/right edges align (the redundant 16px padding was removed) — no extra indent on the explorer.

## F — Non-regression (existing app)

- **TC-F1** *(P1, AC8)* Type freely in the textarea. **Expected:** input works; `n / 800` counter updates live.
- **TC-F2** *(P2, AC8)* Paste >800 characters. **Expected:** value truncates to 800; counter caps at `800 / 800`.
- **TC-F3** *(P1, AC8)* Empty / whitespace-only query. **Expected:** "Plan My Journey" disabled; non-empty enables it.
- **TC-F4** *(P1, AC8)* During submit (loading). **Expected:** textarea + button disabled/dimmed; `LoadingOverlay` visible.
- **TC-F5** *(P1, AC8)* Force an error (e.g., unset/garbage webhook, submit). **Expected:** "Journey Interrupted" panel; **Try Again** resets to idle with the explorer intact.
- **TC-F6** *(P2, AC8)* Successful itinerary (webhook configured). **Expected:** `ItineraryResult` renders; **Copy** shows the "Copied to clipboard!" toast; "Plan Another Journey" resets.
- **TC-F7** *(P2, AC8)* Navigate to `http://localhost:5173/#pipeline`. **Expected:** `PipelineDiagram` renders (explorer route unaffected).
- **TC-F8** *(P1, AC8)* Compare the **hero backdrop** world map + animations (aurora, sparkles, float) against pre-change behavior. **Expected:** visually unchanged (T4 only swapped the data source for `WORLD_MAP_PATHS`).

## G — Data integrity / content

- **TC-G1** *(P1)* Visit all 4 seeded continents. **Expected:** countries match the [test-data table](#environment--setup) exactly; counts correct.
- **TC-G2** *(P2)* For each country, count prompt chips. **Expected:** each country shows 2–4 prompts, matching `promptLibrary.js`.
- **TC-G3** *(P1, AC3)* Pick prompts containing special characters — `Día de los Muertos in Oaxaca`, `Loire Valley château wine route`. **Expected:** textarea shows the accented characters correctly (no mojibake/encoding loss).

## H — Chip component states (observed in UI)

- **TC-H1** *(P2)* Compare a **country** chip vs a **prompt** chip. **Expected:** country variant is visually heavier/brighter (stronger border/background, parchment text) but same gold-on-dark family.
- **TC-H2** *(P2)* A selected country chip. **Expected:** solid gold fill, obsidian text, bold; no hover restyle while selected.
- **TC-H3** *(P3)* Hover a disabled (coming-soon) mobile pill. **Expected:** no hover restyle, `not-allowed` cursor, click does nothing.

---

## Traceability

| AC (spec/plan) | Covered by |
|----------------|-----------|
| AC1 interactive map | TC-A1, TC-A2 |
| AC2 drill-down | TC-A2, TC-A3, TC-B1–B4 |
| AC3 prompt → query | TC-A4, TC-A5, TC-A6, TC-G3 |
| AC4 coming-soon | TC-C1, TC-C2, TC-C3 |
| AC5 keyboard/a11y | TC-D1–D5 |
| AC6 mobile fallback | TC-E1–E4 |
| AC7 visual consistency | TC-E5, TC-H1, TC-H2 |
| AC8 no regression | TC-F1–F8 |

## Priority legend

`P0` blocker / smoke · `P1` core flow · `P2` important edge · `P3` cosmetic.

## Exit criteria

All **P0/P1** cases pass; no console errors during the happy path; `npm run build` green; no regression in TC-F group.
