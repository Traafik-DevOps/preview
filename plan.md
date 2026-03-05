# JavaScript De-Webflow Plan (Phase 1-3)

## Goals
- Own all runtime JavaScript in readable source form (no minified app logic in repo).
- Reduce shipped JS size significantly.
- Keep all existing UX/animations/navigation behavior that matters.
- Keep current form submission behavior to `dialtoneapp.com` unchanged.
- Enforce a strict no-cookies policy (no reads/writes in first-party code).
- Move commodity dependencies (for example jQuery if still needed) to CDN with fallback only where justified.

## Current Baseline (from audit)
- `index.html` loads:
  - `js/jquery-3.5.1.min.js`
  - `js/webflow.chunk.js`
  - `js/webflow.js`
  - inline custom form submit script (Dialtone endpoint)
- Cookie behavior:
  - No cookie writes found in first-party JS.
  - Webflow bundle contains a cookie read path (`_mkto_trk`) tied to legacy form logic.
- Forms:
  - Custom submit handler to `https://dialtoneapp.com/api/v1/store-data/traafik` is working and should remain the source of truth.

---

## Phase 1: Stabilize + Isolate (low risk, immediate)

### Objectives
- Stop relying on Webflow form internals.
- Isolate all custom behavior into owned source files.
- Add observability for safe migration.

### Tasks
1. Create owned JS entrypoint structure:
   - `src/js/main.js`
   - `src/js/modules/nav.js`
   - `src/js/modules/forms.js`
   - `src/js/modules/animations.js`
   - `src/js/modules/utils.js`
2. Move inline scripts from HTML into owned modules:
   - footer year script
   - Dialtone form submit script
3. Add explicit form ownership guard:
   - prevent any Webflow form submission handlers from running on owned forms
   - target by form id/class and call `preventDefault` only in owned handler
4. Add no-cookie policy guardrails:
   - lint/check step that fails on `document.cookie`
   - fail on third-party analytics snippets unless explicitly approved
5. Add baseline measurements (before changing runtime):
   - JS transferred size
   - Lighthouse performance snapshot
   - critical interaction checklist (menu, transitions, form success/error)

### Deliverables
- All custom JS moved out of HTML into readable source.
- Working form behavior unchanged.
- Baseline performance report committed.

### Exit Criteria
- Zero inline script blocks in page templates (except tiny bootstrap if required).
- Form submission parity confirmed in staging/prod smoke tests.

---

## Phase 2: Replace Webflow Runtime Incrementally (medium risk)

### Objectives
- Remove dependency on `webflow.js` / `webflow.chunk.js` for behaviors you actually use.
- Keep only minimal libraries needed.
- Start reducing bundle size aggressively.

### Tasks
1. Inventory used Webflow features on each page:
   - nav/menu collapse
   - interaction triggers (`data-w-id`, lottie wrappers, scroll/hover effects)
   - form states (`w-form-done`, `w-form-fail`)
2. Rebuild behaviors in owned code:
   - Nav/menu toggle: vanilla JS
   - Page transitions/hero interactions: GSAP or small vanilla equivalents
   - Lottie: use official lightweight player only where needed
3. Remove Webflow form runtime paths completely:
   - disable/remove Webflow form bootstrapping
   - keep only owned `forms.js`
4. Decide jQuery strategy:
   - If no plugin requires it: remove jQuery entirely
   - If temporarily needed: load from CDN (`defer`) + local fallback
5. Ship per-page JS loading:
   - only load modules required by each page
   - avoid one global heavy bundle

### Deliverables
- `webflow.js` and `webflow.chunk.js` removed from at least one pilot page (home first).
- Equivalent UX behavior verified against baseline checklist.
- jQuery removed or moved to CDN with explicit justification.

### Exit Criteria
- Pilot pages run without Webflow runtime.
- No regression in navigation, key animations, and forms.
- JS payload reduced materially (target: 40-70% on migrated pages).

---

## Phase 3: Optimize, Harden, and Standardize (medium/high value)

### Objectives
- Finalize migration across all pages.
- Enforce size/performance budgets.
- Lock in maintainability and no-cookie compliance.

### Tasks
1. Roll migration across all pages:
   - `index`, `motorists`, `law-enforcement`, `how-it-works`, etc.
2. Introduce build pipeline (esbuild or Vite):
   - readable source + minified production output
   - tree-shaking, code splitting, sourcemaps
3. Performance hardening:
   - `defer`/`type="module"`
   - preconnect only where used
   - remove dead CSS classes tied to removed Webflow features
4. Dependency policy:
   - CDN for stable vendor libs only when beneficial
   - pin versions + SRI hashes for CDN scripts
   - local vendoring fallback policy documented
5. Compliance hardening:
   - automated check for cookie APIs
   - automated check for unapproved trackers
   - documentation: “No cookies / no user tracking by default”

### Deliverables
- All pages off Webflow runtime.
- Production bundle generated from owned source and documented.
- CI checks for size budgets and cookie/tracker policy.

### Exit Criteria
- `webflow.js` and `webflow.chunk.js` fully removed from production pages.
- No `document.cookie` usage in first-party code.
- Performance budget met (define target in CI, e.g. JS < 120KB gz per primary page).

---

## Suggested Execution Order
1. Home page pilot (highest traffic + forms).
2. Shared nav/footer abstractions.
3. Remaining pages by complexity.

## Risks and Mitigations
- Risk: animation parity drift.
  - Mitigation: visual checklist + short screen recordings before/after.
- Risk: hidden Webflow dependency in markup classes.
  - Mitigation: migrate feature-by-feature, not all at once.
- Risk: CDN outage for vendor library.
  - Mitigation: SRI + optional local fallback for critical dependency.

## Definition of Done (program-level)
- All runtime JS is owned, readable source.
- No Webflow runtime scripts in production templates.
- Forms work with Dialtone endpoint on all pages.
- No cookie reads/writes in first-party JS.
- JS footprint substantially smaller and monitored in CI.
