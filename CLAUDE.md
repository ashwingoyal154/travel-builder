# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```powershell
npm install
npm run dev        # Vite dev server, default http://localhost:5173
npm run build      # production build to dist/
npm run preview    # serve the built dist/ locally
```

No lint script, no test runner. Don't introduce one unless asked.

## Environment

Single required env var, set in `.env` (see `.env.example`):

```
VITE_N8N_WEBHOOK_URL=https://<your-n8n-host>/webhook/<id>
```

This URL is consumed in **two places** and both must be in sync:
- `vite.config.js` reads it at server start to derive the proxy *origin* (everything before the path).
- `src/hooks/useItinerary.js` reads it via `import.meta.env` at module load to derive the *path*, then calls `/api/n8n<path>` so the request goes through the dev proxy.

If you change `VITE_N8N_WEBHOOK_URL`, **restart `vite`** — both reads happen once.

## Architecture

Single-page React app with one job: take a free-text travel prompt and render whatever the n8n webhook returns.

### Request flow

```
User types prompt → App.jsx (status state machine)
  → useItinerary.submit()
    → POST /api/n8n/webhook/<id>  (browser, same-origin)
      → Vite dev proxy rewrites to <webhook origin>/webhook/<id>
        → n8n workflow runs: City Selection → City Guide → Travel Concierge agents
        → Returns text or JSON
  → onSuccess(text) → ItineraryResult parses + renders
```

The 3-agent n8n workflow is checked in as `Travel Planning Multi-Agent System.json` (importable into n8n; not consumed at runtime).

### Key files

- `src/App.jsx` — owns the entire status state machine (`idle | loading | success | error`), `Hero` / `LoadingOverlay` / `ErrorState` / `ItineraryResult` swap based on it. Also defines `Footer` and `ErrorState` inline.
- `src/hooks/useItinerary.js` — the only network code. 120 s `AbortController` timeout. Response handler tries `data.output`, then `data[0].output`, then stringifies — n8n agent nodes wrap output differently depending on workflow shape, so be careful changing this fallback chain.
- `src/components/ItineraryResult.jsx` — **heuristic** text parsing: splits the LLM's response on `/^(Day|DAY)\s+\d+/m` to build `DayCard`s, then `lower.search(/budget|cost…/)` / `/packing list|essentials…/` to pull out the budget and packing sections. If `Day N` isn't found, it falls back to rendering the raw text in a `<pre>`. The parsing is intentionally loose because the LLM output format isn't guaranteed.
- `vite.config.js` — dev proxy at `/api/n8n` → `<webhook origin>`, with path rewrite to strip the `/api/n8n` prefix.

### Production gotcha

The Vite proxy is **dev-only**. A real deployment must either (a) host an equivalent reverse proxy/rewrite at `/api/n8n/*`, or (b) call the n8n webhook directly and have n8n send CORS headers. Don't assume `npm run build && deploy` will work end-to-end without one of these.

## Styling

Tailwind is set up (`tailwind.config.js` defines the gold/obsidian/parchment palette + Playfair/Cormorant/Inter fonts; `src/index.css` has `@tailwind` directives and custom `.glass`, `.grain`, `.card-hover`, `.text-gradient-gold`, `.textarea-glass` component classes), **but most components use inline `style={{…}}` with the same hex values rather than Tailwind utility classes**. This is the existing convention — don't refactor to className unless the user asks. If you add new UI, match the surrounding style; the inline approach lets each component carry its own animations/transitions explicitly.

Design tokens (use these exact values to stay consistent):
- Backgrounds: `#0a0a0f` (obsidian), `#0d1b2a` (navy), `#1e3a5f` (slate-blue)
- Accents: `#d4a853` (gold), `#e8c97a` (gold-light)
- Text: `#f5f0e8` (parchment), `#8a9ab0` (ash)
- Fonts: Playfair Display (display headings), Cormorant Garamond (italic accents), Inter (body), Courier New (eyebrow labels)
