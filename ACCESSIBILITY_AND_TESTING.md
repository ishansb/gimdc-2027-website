# Accessibility and testing report

**Date:** 15 October 2026 · **Build:** demonstration · **Target:** WCAG 2.2 AA where practical

Only checks that were actually run are reported here. Tools not available in the build environment are listed as *not run*.

## 1. Automated build checks (`npm run check`)

| Check | Result |
|---|---|
| TypeScript type check (`tsc --noEmit`, strict) | Pass |
| Unit/integration tests (`node --test`, 9 tests) | 9/9 pass |
| Content validation (dates, statuses, link schemes, secret detection) | 0 errors. 1 intentional warning: registration opens before acceptance (CONTENT_REVIEW C-05) |
| Build safety net: no `href="#"`, no Razorpay script/API references | Pass |
| Payment resolves to **disabled** with the shipped configuration | Pass |
| Hosted-link interlocks (missing approval reference, wrong status, http URL, look-alike domain, checkout mode) all fall back to disabled | Pass |
| Built HTML contains no `<form>`, `<input>` or `<textarea>` | Pass |
| Speakers and partners show only the "to be announced" states | Pass |
| Every in-page anchor has a target; every track link has a built page | Pass |

## 2. Browser QA (`scripts/qa_check.py`, Chromium via Playwright, local preview under a sub-path)

| Check | Result |
|---|---|
| No horizontal overflow at 320, 375, 768, 1024, 1366, 1920 px on the home page, two track pages and the 404 page | Pass (24/24) |
| Text contrast (computed per text node against its effective background; AA 4.5:1 / 3:1 large) on 4 pages | 0 failures. The checker was confirmed to flag a deliberately low-contrast test string (1.76:1). |
| One `h1` per page, no skipped heading levels | Pass |
| All images have `alt`; all links/buttons have accessible names; no duplicate ids; `lang` set; `main` landmark | Pass |
| `target="_blank"` links use `rel="noopener noreferrer"` and announce "(opens in a new tab)" | Pass |
| No requests to third-party hosts (fonts, analytics, CDNs) | Pass (none) |
| First Tab stop is "Skip to main content" | Pass |
| Mobile menu: opens with `aria-expanded="true"`, Escape closes it, focus returns to the toggle | Pass |
| FAQ (`<details>/<summary>`) opens and closes with the keyboard | Pass |
| Visible focus indicator (3px outline) | Pass |
| Payment button is a disabled `<button>` | Pass |
| `prefers-reduced-motion: reduce` disables the hero animation | Pass |
| Navigation usable with JavaScript disabled | Pass |

## 3. Visual review (screenshots, Chromium)

Full-page screenshots at 1440 px and 390 px were inspected section by section, along with the track page at both widths. Issues found and fixed:

- the header overflowed between 1220 and 1440 px (the nav now appears from 1280 px with six items; the CTA note is hidden below 1600 px);
- the hero network path crossed the headline (it was redrawn to exit to the right, and a gradient was added behind the text);
- timeline status badges stretched to full width;
- the 6th journey step was misaligned;
- the empty-state title used a muted colour;
- track focus text was duplicated on track pages.

## 4. Not run / limitations

- **axe-core and Lighthouse** were not available in the build environment (no npm registry access), so **no axe or Lighthouse scores are claimed**. Recommended next step: run Lighthouse in Chrome DevTools on the live URL and record the scores here.
- No screen-reader session (NVDA/VoiceOver) was performed. The structure was checked programmatically only.
- Real-device testing (physical phones and tablets) was not done here. Viewport emulation was used.
- Contrast on the hero is measured against the gradient's first colour stop. Text there sits over the darkest part of the gradient.
- The serif font has no Devanagari or other Indic glyphs. The site is English-only.

## 5. Live deployment verification (15 October 2026, ~05:30 UTC)

Repository: https://github.com/ishansb/gimdc-2027-website · Live: https://ishansb.github.io/gimdc-2027-website/

| Check | Result |
|---|---|
| GitHub Actions run #1 "Build and deploy to GitHub Pages" (npm ci → type check → tests → build → deploy) | Completed successfully (47 s) |
| Home page returns 200 with the correct title, canonical URL, OG image URL and `noindex, nofollow` | Pass |
| All 7 track pages load directly by URL (fresh request) | Pass (200) |
| Unknown URL (`/no-such-page/`) returns the styled custom 404 page with absolute asset paths | Pass (HTTP 404, styled) |
| `robots.txt` (Disallow for the demo), `sitemap.xml`, CSS, JS, fonts, favicon (SVG + PNG), apple-touch icon, OG image | All 200 with correct content types |
| All five font faces loaded; no failed resource requests | Pass |
| Only first-party origin contacted (`https://ishansb.github.io`) | Pass |
| Payment button disabled; no form controls on the page | Pass |
| No horizontal overflow at the tested desktop width | Pass |

Note: anchor scrolling looked incomplete when tested in a *background* browser tab, because browsers pause smooth-scroll animation in hidden tabs. In a visible tab, the same build scrolls exactly to each section (checked locally: the Registration section lands 84 px below the top, as designed, by both direct URL and menu click).
