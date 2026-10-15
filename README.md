# GIMDC 2027 — Conference website

Website for the **GIM Doctoral Conference 2027** at Goa Institute of Management.
Theme: *Beyond Boundaries: Advancing Knowledge Through Collaboration and Innovation*.

> **Demonstration build.** Dates, fees, programme and venue details are *proposed* and subject to institutional approval. Speakers and partners are shown as "to be announced" until confirmed. Online payment is **disabled**.

| | |
|---|---|
| **Live demo** | Published by GitHub Pages; the address is shown under *Settings → Pages* and in each Actions run |
| **Edit content** | [`CONTENT_EDITING_GUIDE.md`](CONTENT_EDITING_GUIDE.md) — for non-technical staff |
| **Open content questions** | [`CONTENT_REVIEW.md`](CONTENT_REVIEW.md) |
| **Deploy / move to gim.ac.in** | [`DEPLOYMENT.md`](DEPLOYMENT.md) |
| **Payments (Razorpay plan)** | [`PAYMENT_INTEGRATION.md`](PAYMENT_INTEGRATION.md), [`REGISTRATION_TERMS_DRAFT.md`](REGISTRATION_TERMS_DRAFT.md) |
| **Design research** | [`DESIGN_REFERENCES.md`](DESIGN_REFERENCES.md) |
| **QA results** | [`ACCESSIBILITY_AND_TESTING.md`](ACCESSIBILITY_AND_TESTING.md) |

## How it works

```
content/        ← all editable text, dates, fees, links (TypeScript data files)
src/
  build.ts      ← static-site generator (validates content, renders pages, writes dist/)
  render/       ← page templates (HTML strings, all content escaped)
  payments/     ← payment integration boundary (disabled / hosted-link / checkout)
  lib/          ← helpers and content validation
public/assets/  ← CSS design system, small JS enhancement, self-hosted fonts, images
tests/          ← automated checks (node:test)
scripts/        ← local preview server, optional browser QA script
dist/           ← generated site (not committed)
```

### Why this stack

The brief suggested React + Vite. This site uses a **zero-runtime-dependency TypeScript static generator** instead, because for an institutional content site it is simpler to maintain, migrate and secure:

- **Pre-rendered HTML.** Every page works without JavaScript, loads fast, and is fully readable by search engines and screen readers.
- **No framework or bundler.** Node.js 22+ runs the TypeScript directly. The only development dependency is TypeScript, for type checking. That means a tiny supply-chain surface and nothing to keep upgrading.
- **Portable output.** `dist/` is plain files with relative paths. It can be copied to `gim.ac.in`, any static host, or into a CMS page.
- **Typed content layer.** Mistakes in content files (bad dates, unknown statuses, unsafe links, secrets) are caught at build time, and a failed build never replaces the live site.

The content/presentation split is the same one a React app would have, so a move to React or a CMS later would reuse the content files directly.

## Commands

```bash
npm ci                 # install TypeScript (the only dev dependency)
npm run check          # type check + tests + build
npm run build          # build to dist/ (set SITE_URL=https://…/ for correct canonical links)
npm run preview        # serve dist/ at http://localhost:4173/
```

Requires Node.js **22.18 or newer**.

## Privacy and security

- No cookies, analytics, trackers, third-party fonts, CDNs or embeds. The map is a plain outbound link.
- No forms. No personal data is collected.
- All content is HTML-escaped. Links are limited to `https:`, `mailto:`, `tel:` and relative paths. External links use `rel="noopener noreferrer"`.
- The build rejects files that look like they contain secrets (e.g. Razorpay keys).
- Search-engine indexing is **off** for the demonstration (`noindex` + `robots.txt`), so the demo never competes with the official GIM website.

## Licence and attribution

See [`LICENSE.md`](LICENSE.md) and [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md).
