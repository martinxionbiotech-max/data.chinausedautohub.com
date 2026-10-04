# i18n Notes — DATA site language-readiness architecture

This document records the plan for future multilingual support on the DATA site.
It is documentation only — no localized pages are built yet. The shared
`BaseLayout` owns the `<head>` and is not changed from this site; this note
explains how `hreflang` will be wired in later.

## Proposed URL scheme

Locale-prefixed alternate pages under a language directory:

- Canonical (English): `https://data.chinausedautohub.com/models/byd-song-plus/`
- Alternate (zh): `https://data.chinausedautohub.com/lang/zh/models/byd-song-plus/`

The `/lang/{locale}/` prefix keeps existing English URLs stable, so current
rankings and links are preserved while adding alternates.

## hreflang placement

Each page's `<head>` (via `BaseLayout`) should emit, for every localized variant:

```html
<link rel="alternate" hreflang="en" href="https://data.chinausedautohub.com/models/byd-song-plus/" />
<link rel="alternate" hreflang="zh" href="https://data.chinausedautohub.com/lang/zh/models/byd-song-plus/" />
<link rel="alternate" hreflang="x-default" href="https://data.chinausedautohub.com/models/byd-song-plus/" />
```

Because `BaseLayout` is shared, the cleanest path is to extend `BaseLayout` with
an optional `alternates` prop (an array of `{ lang, href }`), leaving existing
sites unaffected. The DATA site pages then pass their alternates from a single
localized-metadata map rather than editing the shared component.

## Localizable metadata

- `title`, `description`: keep per-page English now; a future `i18n.ts` map keyed
  by page path supplies localized strings.
- `name_zh` / `brand.name_zh`: already available in `brands.json` and
  `models.json` — the data layer is localization-ready without new data.
- Reference content (`POWERTRAIN_DEFS`, `BODY_TYPE_DEFS`, `SPEC_FIELD_REFS`,
  `GLOSSARY_TERMS`): single source of truth in `src/lib/reference.ts`; move to a
  `{ en, zh }` shape when translation begins.

## Not started (Phase 2 scope)

- No `/lang/**` routes are generated.
- No translated content is authored.
- `hreflang` tags are not yet emitted.

This file is the touchpoint for the language rollout; it is intentionally kept
lightweight until actual translation work is scheduled.
