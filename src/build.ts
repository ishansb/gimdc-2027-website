/**
 * GIMDC 2027 static site builder.
 *
 * Run with:  npm run build   (or: node src/build.ts)
 * Output:    dist/  — plain HTML, CSS, JS and assets that any web server
 *            (GitHub Pages, GIM's own server, a CMS file area) can host.
 *
 * Environment variables (optional):
 *   SITE_URL  Public address ending in "/", e.g. https://user.github.io/repo/
 *             Ignored when content/site.ts sets `siteUrl`.
 */
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { site } from '../content/site.ts';
import { conference } from '../content/conference.ts';
import { tracks } from '../content/tracks.ts';
import { payment, registrationStatus } from '../content/registration.ts';
import { validateContent } from './lib/validate.ts';
import { resolvePayment } from './payments/providers.ts';
import { renderPage } from './render/layout.ts';
import { renderHome } from './render/home.ts';
import { renderNotFoundMain, renderTrackMain } from './render/pages.ts';
import type { PageContext } from './render/components.ts';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'dist');

function normaliseSiteUrl(raw: string): string {
  const u = new URL(raw);
  u.pathname = `${u.pathname.replace(/\/+$/, '')}/`;
  u.search = '';
  u.hash = '';
  return u.toString();
}

function readContentSources(): Record<string, string> {
  const dir = join(ROOT, 'content');
  return Object.fromEntries(readdirSync(dir).filter((f) => f.endsWith('.ts')).map((f) => [`content/${f}`, readFileSync(join(dir, f), 'utf8')]));
}

function write(rel: string, html: string): void {
  const file = join(OUT, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}

export function build(): { pages: string[] } {
  const siteUrl = normaliseSiteUrl(site.siteUrl || process.env.SITE_URL || 'http://localhost:4173/');
  const basePath = new URL(siteUrl).pathname;

  // 1. Validate content
  const { errors, warnings } = validateContent(readContentSources());
  for (const w of warnings) console.warn(`⚠  ${w}`);
  if (errors.length) {
    for (const e of errors) console.error(`✖  ${e}`);
    throw new Error(`Content check failed with ${errors.length} error(s). Nothing was published.`);
  }

  // 2. Payment state (disabled unless every safety condition is met)
  const paymentState = resolvePayment({ config: payment, registrationStatus });
  if (paymentState.kind === 'disabled') {
    console.log(`ℹ  Online payment is DISABLED: ${paymentState.reasons.join(' ')}`);
  } else {
    console.log(`ℹ  Online payment ENABLED via approved hosted page: ${paymentState.url}`);
  }

  // 3. Fresh output folder with static assets
  rmSync(OUT, { recursive: true, force: true });
  mkdirSync(OUT, { recursive: true });
  cpSync(join(ROOT, 'public'), OUT, { recursive: true });

  const pages: string[] = [];

  // 4. Home page
  const homeCtx: PageContext = { rel: '', siteUrl, pagePath: '', isHome: true };
  write(
    'index.html',
    renderPage(homeCtx, { title: site.title, description: site.description }, renderHome(homeCtx, paymentState)),
  );
  pages.push('');

  // 5. One page per track
  for (const t of tracks) {
    const pagePath = `tracks/${t.slug}/`;
    const ctx: PageContext = { rel: '../../', siteUrl, pagePath, isHome: false };
    write(
      `${pagePath}index.html`,
      renderPage(
        ctx,
        { title: `Track ${t.number}: ${t.title} · ${conference.shortName}`, description: `${t.title} — ${t.focus} A research track of ${conference.name}.` },
        renderTrackMain(ctx, t),
      ),
    );
    pages.push(pagePath);
  }

  // 6. 404 page — served by GitHub Pages at any depth, so it uses absolute paths.
  const nfCtx: PageContext = { rel: basePath, siteUrl, pagePath: '404.html', isHome: false };
  write('404.html', renderPage(nfCtx, { title: `Page not found · ${conference.shortName}`, description: site.description, noindex: true }, renderNotFoundMain(nfCtx)));

  // 7. robots.txt and sitemap.xml
  write(
    'robots.txt',
    site.allowIndexing ? `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}sitemap.xml\n` : `# Demonstration build: indexing disabled (content/site.ts → allowIndexing)\nUser-agent: *\nDisallow: /\n`,
  );
  const today = new Date().toISOString().slice(0, 10);
  write(
    'sitemap.xml',
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
      .map((p) => `  <url><loc>${siteUrl}${p}</loc><lastmod>${today}</lastmod></url>`)
      .join('\n')}\n</urlset>\n`,
  );
  write('.nojekyll', '');

  // 8. Safety net: no dead "#" links and no payment scripts in the output.
  for (const p of [...pages.map((x) => `${x}index.html`), '404.html']) {
    const html = readFileSync(join(OUT, p), 'utf8');
    if (/href="#"/.test(html)) throw new Error(`${p}: contains a dead href="#" link.`);
    if (/checkout\.razorpay\.com|api\.razorpay\.com/i.test(html)) throw new Error(`${p}: references a Razorpay script or API — not allowed in this build.`);
  }
  if (!existsSync(join(OUT, 'assets/css/site.css'))) throw new Error('Missing assets/css/site.css');

  console.log(`✔  Built ${pages.length + 1} pages for ${siteUrl} → dist/`);
  return { pages };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    build();
  } catch (e) {
    console.error(`\n✖  Build failed: ${(e as Error).message}`);
    process.exit(1);
  }
}
