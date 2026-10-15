import { tracks, tracksIntro, type Track } from '../../content/tracks.ts';
import { submissionPortal } from '../../content/callForPapers.ts';
import { milestones } from '../../content/timeline.ts';
import { esc, formatDate } from '../lib/html.ts';
import { chips, pendingLinkButton, statusBadge, type PageContext } from './components.ts';
import { icons, trackGlyph } from './icons.ts';
import { trackTitleHtml } from './home.ts';

const pad2 = (n: number) => String(n).padStart(2, '0');

export function renderTrackMain(ctx: PageContext, track: Track): string {
  const idx = tracks.findIndex((t) => t.slug === track.slug);
  const prev = tracks[(idx - 1 + tracks.length) % tracks.length]!;
  const next = tracks[(idx + 1) % tracks.length]!;
  const final = milestones.find((m) => m.id === 'submission-final');

  const groups = track.areaGroups?.length
    ? track.areaGroups.map((g) => `<div class="area-group"><h3 class="h-small">${esc(g.label)}</h3>${chips(g.items)}</div>`).join('')
    : `<div class="area-group"><h3 class="h-small">Key areas</h3>${chips(track.keyAreas)}</div>`;

  return `<div class="track-page" data-track="${track.number}">
  <section class="track-hero" aria-labelledby="track-title">
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <ol role="list">
          <li><a href="${ctx.rel}./">Home</a></li>
          <li><a href="${ctx.rel}#tracks">Theme &amp; Tracks</a></li>
          <li><span aria-current="page">Track ${pad2(track.number)}</span></li>
        </ol>
      </nav>
      <div class="track-hero-grid">
        <div>
          <p class="eyebrow eyebrow--light">Track ${pad2(track.number)} of ${tracks.length}</p>
          <h1 id="track-title" class="track-hero-title">${trackTitleHtml(track.title)}</h1>
          <p class="track-hero-focus">${esc(track.focus)}</p>
        </div>
        <div class="track-hero-glyph" aria-hidden="true">${trackGlyph(track.icon, 160)}</div>
      </div>
    </div>
  </section>
  <section class="section" aria-labelledby="areas-title">
    <div class="container track-body">
      <div class="track-main">
        <h2 id="areas-title">Scope of the track</h2>
        <p class="lead">Indicative areas for this track. The full scope will be described in the official Call for Papers.</p>
        ${groups}
        <div class="notice-card">${icons.info(22)}<div><p class="notice-card-title">More detail coming</p><p>${esc(tracksIntro.pendingNote)}</p></div>${statusBadge('coming-soon', { small: true })}</div>
      </div>
      <aside class="track-aside" aria-label="Submitting to this track">
        <div class="portal-card">
          <h2 class="h-card">Submit to this track</h2>
          <p>Submissions will open through the official portal once the Call for Papers is published.</p>
          ${pendingLinkButton(submissionPortal)}
          ${final ? `<p class="fine">Proposed final deadline: <strong>${esc(formatDate(final.date))}</strong></p>` : ''}
          <a class="text-link" href="${ctx.rel}#call-for-papers">Call for Papers ${icons.arrowRight(16)}</a>
        </div>
      </aside>
    </div>
  </section>
  <nav class="container track-pager" aria-label="Other tracks">
    <a class="pager-link" href="${ctx.rel}tracks/${esc(prev.slug)}/" rel="prev">${icons.arrowLeft()}<span><span class="pager-label">Previous · Track ${pad2(prev.number)}</span><span class="pager-title">${esc(prev.title)}</span></span></a>
    <a class="pager-all" href="${ctx.rel}#tracks">All tracks</a>
    <a class="pager-link pager-link--next" href="${ctx.rel}tracks/${esc(next.slug)}/" rel="next"><span><span class="pager-label">Next · Track ${pad2(next.number)}</span><span class="pager-title">${esc(next.title)}</span></span>${icons.arrowRight()}</a>
  </nav>
</div>`;
}

export function renderNotFoundMain(ctx: PageContext): string {
  return `<section class="section notfound" aria-labelledby="nf-title">
  <div class="container notfound-inner">
    <p class="eyebrow">Error 404</p>
    <h1 id="nf-title">This page is beyond our boundaries</h1>
    <p class="lead">The page you are looking for does not exist or may have moved.</p>
    <div class="hero-actions">
      <a class="btn btn--primary" href="${ctx.rel}">Go to the home page ${icons.arrowRight()}</a>
      <a class="btn btn--secondary" href="${ctx.rel}#tracks">Explore the tracks</a>
    </div>
  </div>
</section>`;
}
