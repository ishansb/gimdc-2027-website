import { STATUS_LABELS, type PendingLink, type Status } from '../../content/types.ts';
import { esc, externalAttrs, isSafeUrl, NEW_TAB_SR, isExternal } from '../lib/html.ts';
import { icons, statusIcon } from './icons.ts';

/** Page rendering context. `rel` is the relative prefix back to the site root ("" or "../../"). */
export interface PageContext {
  rel: string;
  /** Absolute site URL ending in "/" (used for canonical and social links). */
  siteUrl: string;
  /** Path of this page relative to the site root, e.g. "" or "tracks/market/". */
  pagePath: string;
  isHome: boolean;
}

export function statusBadge(status: Status, opts: { label?: string; small?: boolean } = {}): string {
  const label = opts.label ?? STATUS_LABELS[status];
  return `<span class="status status--${esc(status)}${opts.small ? ' status--sm' : ''}">${statusIcon(status)}<span>${esc(label)}</span></span>`;
}

export function sectionHeader(opts: { eyebrow?: string; heading: string; lead?: string; id: string; status?: Status; align?: 'left' | 'center' }): string {
  return `<header class="section-header${opts.align === 'center' ? ' section-header--center' : ''}">
    ${opts.eyebrow ? `<p class="eyebrow">${esc(opts.eyebrow)}</p>` : ''}
    <h2 id="${esc(opts.id)}-title">${esc(opts.heading)}</h2>
    ${opts.lead ? `<p class="lead">${esc(opts.lead)}</p>` : ''}
    ${opts.status ? `<div class="section-status">${statusBadge(opts.status)}</div>` : ''}
  </header>`;
}

/** Resolve a link from content: absolute https stays as is; relative paths are prefixed with `rel`. */
export function href(ctx: PageContext, url: string): string {
  if (url.startsWith('#')) return `${ctx.rel}${url}`;
  if (isExternal(url) || url.startsWith('mailto:') || url.startsWith('tel:')) return url;
  return `${ctx.rel}${url.replace(/^\.\//, '')}`;
}

/**
 * Render a link that may not exist yet. When `url` is empty, an accessible,
 * clearly-labelled disabled control is shown instead of a dead "#" link.
 */
export function pendingLinkButton(link: PendingLink, opts: { variant?: 'primary' | 'secondary'; id?: string } = {}): string {
  const variant = opts.variant ?? 'primary';
  const idAttr = opts.id ? ` id="${esc(opts.id)}"` : '';
  if (link.url && isSafeUrl(link.url)) {
    return `<a class="btn btn--${variant}" href="${esc(link.url)}"${externalAttrs(link.url)}${idAttr}>${esc(link.label)} ${isExternal(link.url) ? icons.external() + NEW_TAB_SR : icons.arrowRight()}</a>`;
  }
  // Plain text styled as an inactive control: not focusable, not clickable, and
  // its wording ("… coming soon") states the status for every user.
  return `<span class="btn btn--unavailable"${idAttr}>${icons.lock()}<span>${esc(link.unavailableLabel)}</span></span>`;
}

export function chips(items: readonly string[], cls = 'chip'): string {
  return `<ul class="chips" role="list">${items.map((i) => `<li class="${cls}">${esc(i)}</li>`).join('')}</ul>`;
}

export function paragraphs(items: readonly string[]): string {
  return items.map((p) => `<p>${esc(p)}</p>`).join('');
}
