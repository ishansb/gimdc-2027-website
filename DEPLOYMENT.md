# Deployment guide

The site is a **static site**: `npm run build` turns the content files into plain HTML, CSS, JS and assets in `dist/`. Any web server can host `dist/`. No database, server-side code or third-party services are involved.

All internal links and asset paths are **relative**, so the same build works at any address (`https://user.github.io/repo/`, `https://gim.ac.in/gimdc/`, or a sub-domain). Only these depend on the final address, and they are configured, not hard-coded:

- canonical, Open Graph and sitemap URLs → `SITE_URL` environment variable, or `siteUrl` in `content/site.ts`
- the `404.html` page, which uses absolute paths because servers show it at any depth → derived from the same URL

---

## 1. GitHub Pages (demonstration)

**One-time setup** (repository admin):

1. Repository → **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Push to `main`. The workflow `.github/workflows/deploy.yml` runs `npm ci` (installs TypeScript only), then type check → tests → build → deploy.
3. The live URL appears in the workflow run (`deploy` job) and under Settings → Pages.

**Redeploy after a content change:** commit to `main` (e.g. with the GitHub web editor, see `CONTENT_EDITING_GUIDE.md`). Deployment is automatic, in about 1–3 minutes. To redeploy without a change: **Actions → Build and deploy to GitHub Pages → Run workflow**.

**Local build (developers):**

```bash
# Requires Node.js 22.18 or newer (runs TypeScript directly; no bundler)
npm ci
npm run check                       # type check + tests + build
SITE_URL=https://example.org/gimdc/ npm run build
BASE_PATH=/gimdc/ npm run preview   # http://localhost:4173/gimdc/
python3 scripts/qa_check.py http://localhost:4173/gimdc/   # optional browser QA (needs Playwright)
```

---

## 2. Migrating to gim.ac.in

### Information GIM IT must supply

| Item | Example / note |
|---|---|
| Approved public address | `https://gim.ac.in/gimdc/` or `https://gimdc.gim.ac.in/` |
| Hosting model | Static files on the web server, or pages inside the existing CMS (gim.ac.in appears to run Drupal, judging by its `/sites/default/files/` paths. **IT should confirm.**) |
| Deployment method | SFTP/rsync, CI pipeline, CMS upload, or manual copy |
| Web server | Apache/Nginx/IIS (affects 404 handling and caching) |
| HTTPS certificate coverage for the path or sub-domain | Required |
| Analytics policy | The site currently has **no** analytics. Add only an approved, privacy-reviewed tool, with notice. |
| Content-Security-Policy and other security headers | The site needs only `'self'` for scripts, styles, fonts and images |
| Official logo, brand colours, institutional header/footer requirements | See `content/site.ts` and the CSS variables |
| Who will edit content after launch | See CONTENT_EDITING_GUIDE §6 for CMS options |

### Scenario A — GIM IT supports static hosting (recommended)

1. In `content/site.ts` set `siteUrl: 'https://gim.ac.in/gimdc/'`, `previewNotice.show: false`, and `allowIndexing: true` (only after approval).
2. Build: `npm ci && npm run check`.
3. Copy the **contents** of `dist/` into the approved folder (e.g. `/var/www/gim.ac.in/gimdc/`).
4. Configure the server to serve `index.html` for directory URLs and to use `gimdc/404.html` for missing pages under the path. Examples:
   - Apache (`.htaccess` in the folder): `ErrorDocument 404 /gimdc/404.html`
   - Nginx: `location /gimdc/ { try_files $uri $uri/ /gimdc/404.html; }`
5. Caching: `assets/fonts/*` and `assets/img/*` can be cached long-term. Keep HTML, CSS and JS on a short cache (file names are not fingerprinted).
6. Enable gzip/brotli for `.html`, `.css`, `.js`, `.svg`, `.xml`.
7. Optional: keep GitHub Actions as the build system and add a deploy step (rsync/SFTP) using **repository secrets** configured by IT. Never commit server credentials.

### Scenario B — GIM uses an existing CMS

The renderer separates content (`content/*.ts`) from presentation (`src/render/*.ts`, `public/assets/css/site.css`), so the design can be moved in pieces:

| Reusable as-is | Needs adaptation |
|---|---|
| `public/assets/css/site.css` (design system; scope it under a wrapper class such as `.gimdc` to avoid clashing with the CMS theme) | Header and footer: replace with the CMS's institutional header/footer, or keep ours inside the CMS page body |
| `public/assets/js/site.js` (menu, section highlighting; no dependencies) | Navigation: map our sections to CMS pages or anchors |
| Fonts, images, favicon in `public/assets/` | Track pages: create one CMS page per track using the generated HTML in `dist/tracks/*/index.html` as the template |
| The generated HTML in `dist/` as section templates | Content editing moves into the CMS. Use `content/*.ts` as the field list for CMS content types (e.g. Track: number, title, focus, key areas) |
| `src/payments` logic (as a specification) | Payment button: point to the approved hosted payment page from a CMS field |

Steps: build once → copy section markup from `dist/index.html` into CMS blocks → upload `assets/` to the CMS file area → include `site.css` and `site.js` in the page or theme → recreate the editable fields as CMS content types → set up redirects from the demo URL.

### Migration checklist

- [ ] Institutional approval of content (see `CONTENT_REVIEW.md` checklist) and of launch
- [ ] Final address and hosting model agreed with GIM IT
- [ ] HTTPS working on the final address
- [ ] `siteUrl` set; build shows the correct canonical URL in page source
- [ ] Official logo and brand colours applied
- [ ] Demo notice removed (`previewNotice.show: false`)
- [ ] `allowIndexing: true`; `robots.txt` allows crawling; sitemap submitted (optional)
- [ ] 404 handling configured for the path
- [ ] Analytics: none, or an approved tool with a privacy notice
- [ ] Privacy notice published if any data collection or payment is enabled
- [ ] Payment: follow `PAYMENT_INTEGRATION.md` activation checklist (production gateway, approved terms)
- [ ] Redirect or retire the GitHub Pages demo: replace its home page with a notice linking to the official address, or disable Pages under Settings → Pages
- [ ] Post-launch QA: run `scripts/qa_check.py` against the live URL; test on phone and desktop

The production site does not depend on the GitHub Pages URL or the repository name. Both come from configuration.
