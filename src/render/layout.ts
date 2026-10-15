import { site, institution } from '../../content/site.ts';
import { conference } from '../../content/conference.ts';
import { navigation } from '../../content/navigation.ts';
import { submissionPortal } from '../../content/callForPapers.ts';
import { contact } from '../../content/contact.ts';
import { tracks } from '../../content/tracks.ts';
import { esc, externalAttrs, formatDateRange, isSafeUrl, NEW_TAB_SR } from '../lib/html.ts';
import { conferenceMark, icons } from './icons.ts';
import { statusBadge, type PageContext } from './components.ts';

export interface PageMeta {
  title: string;
  description: string;
  /** Override robots (e.g. 404 is always noindex). */
  noindex?: boolean;
}

function head(ctx: PageContext, meta: PageMeta, assetPrefix: string): string {
  const canonical = `${ctx.siteUrl}${ctx.pagePath}`;
  const ogImage = `${ctx.siteUrl}assets/img/og-image.png`;
  const noindex = meta.noindex || !site.allowIndexing;
  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(meta.title)}</title>
<meta name="description" content="${esc(meta.description)}">
${noindex ? '<meta name="robots" content="noindex, nofollow">' : '<meta name="robots" content="index, follow">'}
<link rel="canonical" href="${esc(canonical)}">
<meta name="theme-color" content="#0B1F3A">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.shortName)}">
<meta property="og:title" content="${esc(meta.title)}">
<meta property="og:description" content="${esc(meta.description)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:image" content="${esc(ogImage)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(`${conference.shortName} — ${conference.theme.title}: ${conference.theme.subtitle}`)}">
<meta property="og:locale" content="en_IN">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${assetPrefix}assets/img/favicon.svg" type="image/svg+xml">
<link rel="icon" href="${assetPrefix}assets/img/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="${assetPrefix}assets/img/apple-touch-icon.png">
<link rel="preload" href="${assetPrefix}assets/fonts/serif-600.woff" as="font" type="font/woff" crossorigin>
<link rel="preload" href="${assetPrefix}assets/fonts/inter-Regular.woff" as="font" type="font/woff" crossorigin>
<link rel="stylesheet" href="${assetPrefix}assets/css/site.css">
<script>document.documentElement.classList.replace('no-js','js')</script>
<script src="${assetPrefix}assets/js/site.js" defer></script>`;
}

function navHref(ctx: PageContext, id: string): string {
  return ctx.isHome ? `#${id}` : `${ctx.rel}#${id}`;
}

function brand(ctx: PageContext, assetPrefix: string): string {
  const home = ctx.isHome ? '#top' : `${ctx.rel}./`;
  const inst = institution.logoPath
    ? `<img class="brand-logo" src="${esc(assetPrefix + institution.logoPath)}" alt="${esc(institution.logoAlt)}" height="36">`
    : `<span class="brand-inst">${esc(institution.name)}</span>`;
  return `<a class="brand" href="${home}" aria-label="${esc(conference.shortName)} home">
    ${conferenceMark(38)}
    <span class="brand-text">${inst}<span class="brand-name">GIMDC <span class="brand-year">2027</span></span></span>
  </a>`;
}

function headerCta(ctx: PageContext): string {
  if (submissionPortal.url && isSafeUrl(submissionPortal.url)) {
    return `<a class="btn btn--accent header-cta" href="${esc(submissionPortal.url)}"${externalAttrs(submissionPortal.url)}>${esc(submissionPortal.label)}${NEW_TAB_SR}</a>`;
  }
  return `<a class="btn btn--accent header-cta" href="${navHref(ctx, 'call-for-papers')}">Call for Papers <span class="header-cta-note">Coming soon</span></a>`;
}

function header(ctx: PageContext, assetPrefix: string): string {
  const headerItems = navigation
    .filter((n) => n.inHeader)
    .map((n) => `<li><a href="${navHref(ctx, n.id)}" data-nav="${esc(n.id)}">${esc(n.label)}</a></li>`)
    .join('');
  const allItems = navigation
    .map((n, i) => `<li><a href="${navHref(ctx, n.id)}" data-nav="${esc(n.id)}"><span class="menu-num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>${esc(n.label)}</a></li>`)
    .join('');

  const notice = site.previewNotice.show
    ? `<div class="notice-bar" role="note"><div class="container">${icons.info(16)}<p>${esc(site.previewNotice.text)}</p></div></div>`
    : '';

  return `<a class="skip-link" href="#main">Skip to main content</a>
${notice}
<header class="site-header" id="top">
  <div class="container header-inner">
    ${brand(ctx, assetPrefix)}
    <nav class="primary-nav" aria-label="Primary">
      <ul role="list">${headerItems}</ul>
    </nav>
    <div class="header-actions">
      ${headerCta(ctx)}
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-menu">
        ${icons.menu()}${icons.close()}<span class="menu-toggle-label">Menu</span>
      </button>
    </div>
  </div>
  <div class="site-menu" id="site-menu">
    <div class="container">
      <nav aria-label="All sections">
        <ul class="menu-grid" role="list">${allItems}</ul>
      </nav>
    </div>
  </div>
</header>`;
}

function footer(ctx: PageContext): string {
  const navCol = navigation.map((n) => `<li><a href="${navHref(ctx, n.id)}">${esc(n.label)}</a></li>`).join('');
  const trackCol = tracks.map((t) => `<li><a href="${ctx.rel}tracks/${esc(t.slug)}/">${esc(t.title.replace('Beyond ', ''))}</a></li>`).join('');
  const email = contact.email
    ? `<a href="mailto:${esc(contact.email)}">${esc(contact.email)}</a>`
    : `<span class="muted-on-dark">${esc(contact.emailPendingText)}</span>`;
  const year = new Date().getFullYear();

  return `<footer class="site-footer">
  <div class="container footer-grid">
    <div class="footer-brand">
      <p class="footer-title">${esc(conference.name)}</p>
      <p class="footer-theme"><em>${esc(conference.theme.title)}:</em> ${esc(conference.theme.subtitle)}</p>
      <p class="footer-dates">${icons.calendar(18)} <span>${esc(formatDateRange(conference.dates.start, conference.dates.end))}</span> ${statusBadge(conference.dates.status, { small: true })}</p>
    </div>
    <nav class="footer-col" aria-label="Footer: sections">
      <p class="footer-heading">Conference</p>
      <ul class="footer-two-col" role="list">${navCol}</ul>
    </nav>
    <nav class="footer-col" aria-label="Footer: research tracks">
      <p class="footer-heading">Research tracks</p>
      <ul role="list">${trackCol}</ul>
    </nav>
    <div class="footer-col">
      <p class="footer-heading">Host institution</p>
      <address>${institution.addressLines.map(esc).join('<br>')}</address>
      <p><a href="${esc(institution.website)}"${externalAttrs(institution.website)}>gim.ac.in ${icons.external(14)}${NEW_TAB_SR}</a></p>
      <p class="footer-heading footer-heading--spaced">Enquiries</p>
      <p>${email}</p>
    </div>
  </div>
  <div class="container"><div class="footer-bottom">
    <p>© ${year} ${esc(institution.name)}. ${site.previewNotice.show ? 'Demonstration build — details are provisional until officially approved.' : ''}</p>
    <p>This website does not use cookies, analytics or tracking, and collects no personal data.</p>
  </div></div>
</footer>`;
}

export function renderPage(ctx: PageContext, meta: PageMeta, main: string, opts: { assetPrefix?: string } = {}): string {
  const assetPrefix = opts.assetPrefix ?? ctx.rel;
  return `<!doctype html>
<html lang="${esc(site.language)}" class="no-js">
<head>
${head(ctx, meta, assetPrefix)}
</head>
<body${ctx.isHome ? ' class="is-home"' : ''}>
${header(ctx, assetPrefix)}
<main id="main" tabindex="-1">
${main}
</main>
${footer(ctx)}
</body>
</html>
`;
}
