# preview

## Maintenance

- Default deploy path:
  - Serve `index.html` with loose source files from `src/js/*` (no build required).
- Optional build/minify path:
  - `npm install`
  - `npm run build`
  - `npm run build:css`
  - `npm run build:watch`
- Run no-cookies audit for owned runtime code:
  - `npm run audit:no-cookies`
- Check JS gzip budget (default 120KB):
  - `npm run check:js-budget`
