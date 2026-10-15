import { conference, about } from '../../content/conference.ts';
import { tracks, tracksIntro } from '../../content/tracks.ts';
import { milestones, timelineIntro, type Milestone } from '../../content/timeline.ts';
import { programmeComponents, programmeIntro, schedule } from '../../content/programme.ts';
import { cfpBlocks, cfpIntro, journeySteps, submissionPortal } from '../../content/callForPapers.ts';
import { facultyMentors, keynoteSpeakers, speakersIntro, type Speaker } from '../../content/speakers.ts';
import { fees, payment, registrationForm, registrationIntro, registrationStatus } from '../../content/registration.ts';
import { travelBlocks, venue, venueIntro } from '../../content/venue.ts';
import { committee, committeeIntro } from '../../content/committee.ts';
import { partnerCategories, partners, partnersIntro } from '../../content/partners.ts';
import { faqGroups, faqIntro } from '../../content/faqs.ts';
import { contact, contactIntro } from '../../content/contact.ts';
import { institution } from '../../content/site.ts';
import {
  esc,
  externalAttrs,
  formatDate,
  formatDateRange,
  formatInr,
  isSafeUrl,
  monthShort,
  NEW_TAB_SR,
  parseIsoDate,
  weekday,
} from '../lib/html.ts';
import type { PaymentState } from '../payments/types.ts';
import { href, paragraphs, pendingLinkButton, sectionHeader, statusBadge, type PageContext } from './components.ts';
import { heroArt, icons, trackGlyph } from './icons.ts';

const pad2 = (n: number) => String(n).padStart(2, '0');
const byId = (id: string): Milestone | undefined => milestones.find((m) => m.id === id);

/* ---------------------------------- Hero --------------------------------- */

function hero(ctx: PageContext): string {
  const dates = formatDateRange(conference.dates.start, conference.dates.end);
  const final = byId('submission-final');
  const accept = byId('acceptance');
  const conf = byId('conference');
  const glance = [final, accept, conf].filter((m): m is Milestone => Boolean(m));

  return `<section class="hero" aria-labelledby="hero-title">
  <div class="hero-bg">${heroArt()}</div>
  <div class="container hero-inner">
    <p class="hero-kicker"><span class="hero-kicker-line" aria-hidden="true"></span>${esc(conference.name)}</p>
    <h1 id="hero-title" class="hero-title">
      <span class="hero-theme">${esc(conference.theme.title)}</span>
      <span class="hero-sub">${esc(conference.theme.subtitle)}</span>
    </h1>
    <dl class="hero-facts">
      <div class="hero-fact">
        <dt>${icons.calendar(18)} Dates</dt>
        <dd><span class="hero-fact-value">${esc(dates)}</span> ${statusBadge(conference.dates.status, { small: true })}</dd>
      </div>
      <div class="hero-fact">
        <dt>${icons.pin(18)} Venue</dt>
        <dd><span class="hero-fact-value">${esc(conference.locationLine)}</span></dd>
      </div>
      <div class="hero-fact">
        <dt>${icons.layers(18)} Format</dt>
        <dd><span class="hero-fact-value">${esc(conference.formatLine)}</span></dd>
      </div>
    </dl>
    <div class="hero-actions">
      <a class="btn btn--light" href="${href(ctx, '#tracks')}">Explore Tracks ${icons.arrowRight()}</a>
      ${
        submissionPortal.url && isSafeUrl(submissionPortal.url)
          ? `<a class="btn btn--outline-light" href="${esc(submissionPortal.url)}"${externalAttrs(submissionPortal.url)}>${esc(submissionPortal.label)} ${icons.external()}${NEW_TAB_SR}</a>`
          : `<a class="btn btn--outline-light" href="${href(ctx, '#call-for-papers')}">Call for Papers — Coming Soon</a>`
      }
    </div>
  </div>
  <div class="container">
    <div class="glance" aria-label="Key dates at a glance">
      <p class="glance-label">Key dates <span>(proposed)</span></p>
      <ul class="glance-list" role="list">
        ${glance
          .map(
            (m) => `<li><span class="glance-date">${esc(formatDateRange(m.date, m.endDate))}</span><span class="glance-what">${esc(m.label)}</span></li>`,
          )
          .join('')}
      </ul>
      <a class="glance-link" href="${href(ctx, '#dates')}">All dates ${icons.arrowRight(16)}</a>
    </div>
  </div>
</section>`;
}

/* --------------------------------- About --------------------------------- */

function aboutSection(): string {
  return `<section class="section" id="about" aria-labelledby="about-title">
  <div class="container">
    <div class="about-grid">
      <div class="about-main">
        ${sectionHeader({ id: 'about', eyebrow: 'About GIMDC', heading: about.heading, lead: about.lead })}
        <div class="prose">${paragraphs(about.purpose)}</div>
      </div>
      <aside class="about-aside" aria-labelledby="objectives-title">
        <h3 id="objectives-title" class="h-small">Objectives</h3>
        <ol class="numbered" role="list">${about.objectives.map((o, i) => `<li><span class="num" aria-hidden="true">${pad2(i + 1)}</span><span>${esc(o)}</span></li>`).join('')}</ol>
      </aside>
    </div>
    <div class="split-cards">
      <div>
        <h3 class="h-small">Who should attend</h3>
        <ul class="mini-cards" role="list">${about.whoShouldAttend.map((w) => `<li class="mini-card"><h4>${esc(w.title)}</h4><p>${esc(w.text)}</p></li>`).join('')}</ul>
      </div>
      <div>
        <h3 class="h-small">What participants can expect</h3>
        <ul class="mini-cards mini-cards--2" role="list">${about.whatToExpect.map((w) => `<li class="mini-card mini-card--quiet"><h4>${esc(w.title)}</h4><p>${esc(w.text)}</p></li>`).join('')}</ul>
      </div>
    </div>
  </div>
</section>`;
}

/* --------------------------------- Tracks -------------------------------- */

export function trackTitleHtml(title: string): string {
  // Emphasise the boundary word: "Beyond <em>Disciplinary</em> Boundaries"
  const m = /^Beyond (.+) Boundaries$/.exec(title);
  return m ? `Beyond <em>${esc(m[1])}</em> Boundaries` : esc(title);
}

function tracksSection(ctx: PageContext): string {
  const cards = tracks
    .map((t) => {
      const shown = t.keyAreas.slice(0, 4);
      const more = t.keyAreas.length - shown.length;
      return `<li class="track-card" data-track="${t.number}">
        <div class="track-card-top">
          <span class="track-num">Track ${pad2(t.number)}</span>
          <span class="track-glyph">${trackGlyph(t.icon, 44)}</span>
        </div>
        <h3 class="track-title"><a class="stretched" href="${ctx.rel}tracks/${esc(t.slug)}/">${trackTitleHtml(t.title)}</a></h3>
        <p class="track-focus">${esc(t.focus)}</p>
        <ul class="chips chips--sm" role="list">${shown.map((a) => `<li class="chip">${esc(a)}</li>`).join('')}${more > 0 ? `<li class="chip chip--more">+${more} more</li>` : ''}</ul>
        <span class="track-more" aria-hidden="true">Track details ${icons.arrowRight(16)}</span>
      </li>`;
    })
    .join('');

  return `<section class="section section--tint" id="tracks" aria-labelledby="tracks-title">
  <div class="container">
    ${sectionHeader({ id: 'tracks', eyebrow: 'Seven research tracks', heading: tracksIntro.heading, lead: tracksIntro.lead })}
    <ul class="track-grid" role="list">
      <li class="track-intro">
        <p class="track-intro-kicker">The theme</p>
        <p class="track-intro-title">${esc(conference.theme.title)}</p>
        <p class="track-intro-text">${esc(tracksIntro.themeStatement)}</p>
      </li>
      ${cards}
    </ul>
  </div>
</section>`;
}

/* ----------------------------- Call for papers ---------------------------- */

function cfpSection(ctx: PageContext): string {
  const final = byId('submission-final');
  const original = byId('submission-original');
  return `<section class="section" id="call-for-papers" aria-labelledby="call-for-papers-title">
  <div class="container">
    ${sectionHeader({ id: 'call-for-papers', eyebrow: 'For doctoral researchers', heading: cfpIntro.heading, lead: cfpIntro.lead, status: submissionPortal.status })}
    <ol class="journey" role="list" aria-label="Your path to GIMDC 2027">
      ${journeySteps
        .map(
          (s, i) => `<li class="journey-step"><a href="${href(ctx, s.href)}"><span class="journey-num" aria-hidden="true">${i + 1}</span><span class="journey-title">${esc(s.title)}</span><span class="journey-text">${esc(s.text)}</span></a></li>`,
        )
        .join('')}
    </ol>
    <div class="cfp-layout">
      <div class="cfp-details" id="cfp-details">
        ${cfpBlocks
          .map(
            (b) => `<article class="info-card">
              <div class="info-card-head"><h3>${esc(b.title)}</h3>${statusBadge(b.status, { small: true })}</div>
              ${paragraphs(b.body)}
              ${b.bullets ? `<ul class="bullets">${b.bullets.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
            </article>`,
          )
          .join('')}
      </div>
      <aside class="portal-card" id="submission-portal" aria-labelledby="portal-title">
        <h3 id="portal-title">Submission portal</h3>
        <p>Papers will be submitted through an official online portal. The link will appear here when submissions open.</p>
        ${pendingLinkButton(submissionPortal)}
        <dl class="portal-dates">
          ${original ? `<div><dt>Submission deadline</dt><dd>${esc(formatDate(original.date))}</dd></div>` : ''}
          ${final ? `<div><dt>Extended / final deadline</dt><dd>${esc(formatDate(final.date))}</dd></div>` : ''}
        </dl>
        <p class="fine">All dates are proposed and subject to confirmation.</p>
      </aside>
    </div>
  </div>
</section>`;
}

/* ------------------------------ Important dates --------------------------- */

function datesSection(): string {
  return `<section class="section section--ink" id="dates" aria-labelledby="dates-title">
  <div class="container">
    ${sectionHeader({ id: 'dates', eyebrow: 'Timeline', heading: timelineIntro.heading, lead: timelineIntro.lead })}
    <ol class="timeline" role="list">
      ${milestones
        .map((m) => {
          const p = parseIsoDate(m.date);
          const day = m.endDate ? `${p.day}–${parseIsoDate(m.endDate).day}` : String(p.day);
          return `<li class="timeline-item${m.highlight ? ' is-highlight' : ''}">
            <span class="timeline-dot" aria-hidden="true"></span>
            <time class="timeline-date" datetime="${esc(m.date)}">
              <span class="timeline-day">${esc(day)}</span>
              <span class="timeline-month">${esc(monthShort(m.date))} ${p.year}</span>
            </time>
            <p class="timeline-label">${esc(m.label)}</p>
            <p class="sr-only">${esc(formatDateRange(m.date, m.endDate))}${m.endDate ? '' : `, ${weekday(m.date)}`}.</p>
            ${statusBadge(m.status, { small: true })}
          </li>`;
        })
        .join('')}
    </ol>
  </div>
</section>`;
}

/* -------------------------------- Programme ------------------------------- */

function programmeSection(): string {
  const scheduleHtml =
    schedule.length > 0
      ? `<div class="schedule">${schedule
          .map(
            (d) => `<section class="schedule-day"><h3>${esc(d.label)}</h3><ul role="list">${d.sessions
              .map((s) => `<li><span class="schedule-time">${esc(s.time)}</span><span><strong>${esc(s.title)}</strong>${s.detail ? ` — ${esc(s.detail)}` : ''}</span></li>`)
              .join('')}</ul></section>`,
          )
          .join('')}</div>`
      : `<div class="notice-card">${icons.calendar(22)}<div><p class="notice-card-title">Detailed schedule</p><p>${esc(programmeIntro.scheduleNote)}</p></div>${statusBadge('to-be-announced', { small: true })}</div>`;

  return `<section class="section" id="programme" aria-labelledby="programme-title">
  <div class="container">
    ${sectionHeader({ id: 'programme', eyebrow: 'Conference format', heading: programmeIntro.heading, lead: programmeIntro.lead })}
    <ol class="format-grid" role="list">
      ${programmeComponents
        .map(
          (c, i) => `<li class="format-card">
            <span class="format-num" aria-hidden="true">${pad2(i + 1)}</span>
            <h3>${esc(c.title)}</h3>
            <p>${esc(c.description)}</p>
            ${statusBadge(c.status, { small: true })}
          </li>`,
        )
        .join('')}
    </ol>
    ${scheduleHtml}
  </div>
</section>`;
}

/* --------------------------------- Speakers ------------------------------- */

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter((w) => /^[A-Z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join('');
}

function speakerCard(ctx: PageContext, s: Speaker): string {
  const photo = s.photo
    ? `<img src="${esc(ctx.rel + s.photo)}" alt="" width="160" height="160" loading="lazy">`
    : `<span class="speaker-initials" aria-hidden="true">${esc(initials(s.name))}</span>`;
  const name = s.profileUrl && isSafeUrl(s.profileUrl) ? `<a href="${esc(s.profileUrl)}"${externalAttrs(s.profileUrl)}>${esc(s.name)}${NEW_TAB_SR}</a>` : esc(s.name);
  return `<li class="speaker-card"><div class="speaker-photo">${photo}</div><h4>${name}</h4><p class="speaker-role">${esc(s.role)}</p><p class="speaker-aff">${esc(s.affiliation)}</p>${s.bio ? `<p class="speaker-bio">${esc(s.bio)}</p>` : ''}</li>`;
}

function speakerGroup(ctx: PageContext, title: string, list: Speaker[]): string {
  const confirmed = list.filter((s) => s.status === 'confirmed');
  if (confirmed.length === 0) {
    return `<div class="tba-card"><h3>${esc(title)}</h3>${statusBadge('to-be-announced', { small: true })}</div>`;
  }
  return `<div class="speaker-group"><h3>${esc(title)}</h3><ul class="speaker-grid" role="list">${confirmed.map((s) => speakerCard(ctx, s)).join('')}</ul></div>`;
}

function speakersSection(ctx: PageContext): string {
  const any = [...keynoteSpeakers, ...facultyMentors].some((s) => s.status === 'confirmed');
  return `<section class="section section--tint" id="speakers" aria-labelledby="speakers-title">
  <div class="container">
    ${sectionHeader({ id: 'speakers', eyebrow: 'Keynotes & mentors', heading: speakersIntro.heading, lead: speakersIntro.lead })}
    ${
      any
        ? `${speakerGroup(ctx, 'Keynote speakers', keynoteSpeakers)}${speakerGroup(ctx, 'Faculty mentors', facultyMentors)}`
        : `<div class="empty-state">
            <div class="empty-art" aria-hidden="true">${[0, 1, 2].map(() => '<span class="empty-node"></span>').join('')}</div>
            <div class="empty-body">
              <p class="empty-title">${esc(speakersIntro.emptyTitle)}</p>
              <p>${esc(speakersIntro.emptyText)}</p>
              <div class="tba-row">
                <div class="tba-card"><h3>Keynote speakers</h3>${statusBadge('to-be-announced', { small: true })}</div>
                <div class="tba-card"><h3>Faculty mentors</h3>${statusBadge('to-be-announced', { small: true })}</div>
              </div>
            </div>
          </div>`
    }
  </div>
</section>`;
}

/* ------------------------------- Registration ----------------------------- */

function paymentPanel(state: PaymentState): string {
  if (state.kind === 'hosted-link') {
    return `<div class="payment-panel is-active" aria-labelledby="payment-title">
      <div class="payment-head">${icons.shield(22)}<h3 id="payment-title">Online payment</h3>${statusBadge('open', { small: true })}</div>
      <p>You will be taken to the institute's official payment page.</p>
      <a class="btn btn--primary" href="${esc(state.url)}" target="_blank" rel="noopener noreferrer">${esc(payment.buttonLabel)} ${icons.external()}${NEW_TAB_SR}</a>
    </div>`;
  }
  return `<div class="payment-panel" aria-labelledby="payment-title">
    <div class="payment-head">${icons.shield(22)}<h3 id="payment-title">Online payment</h3>${statusBadge('awaiting-approval', { small: true })}</div>
    <p class="payment-status"><strong>${esc(payment.statusTitle)}.</strong></p>
    <button class="btn btn--primary btn--disabled" type="button" disabled aria-describedby="payment-note">${icons.lock()}<span>${esc(payment.buttonLabel)}</span></button>
    <p class="payment-note" id="payment-note">${esc(payment.statusText)}</p>
  </div>`;
}

function registrationSection(paymentState: PaymentState): string {
  const opens = byId('registration-opens');
  const closes = byId('registration-closes');
  return `<section class="section" id="registration" aria-labelledby="registration-title">
  <div class="container">
    ${sectionHeader({ id: 'registration', eyebrow: 'Fees & payment', heading: registrationIntro.heading, lead: registrationIntro.lead, status: registrationStatus })}
    <div class="reg-layout">
      <div class="fee-grid">
        ${fees
          .map(
            (f) => `<article class="fee-card">
              <div class="fee-head"><h3>${esc(f.label)}</h3>${statusBadge(f.status, { small: true })}</div>
              <p class="fee-amount"><span class="fee-value">${esc(formatInr(f.amount))}</span> <span class="fee-unit">${esc(f.unit)}</span></p>
              <ul class="ticks" role="list">${f.inclusions.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
            </article>`,
          )
          .join('')}
        <div class="reg-window">
          <p class="h-small">Registration window <span class="muted">(proposed)</span></p>
          <dl>
            ${opens ? `<div><dt>Opens</dt><dd>${esc(formatDate(opens.date))}</dd></div>` : ''}
            ${closes ? `<div><dt>Closes</dt><dd>${esc(formatDate(closes.date))}</dd></div>` : ''}
          </dl>
          <div class="reg-form-link">${pendingLinkButton(registrationForm, { variant: 'secondary' })}</div>
        </div>
        <p class="approval-note">${icons.info(18)}<span>${esc(registrationIntro.approvalNote)}</span></p>
      </div>
      ${paymentPanel(paymentState)}
    </div>
  </div>
</section>`;
}

/* ----------------------------------- Venue -------------------------------- */

function venueSection(): string {
  return `<section class="section section--tint" id="venue" aria-labelledby="venue-title">
  <div class="container">
    ${sectionHeader({ id: 'venue', eyebrow: 'Getting here', heading: venueIntro.heading, lead: venueIntro.lead })}
    <div class="venue-layout">
      <article class="venue-card">
        <div class="venue-art" aria-hidden="true">${trackGlyph('geographical', 64)}</div>
        <h3>${esc(venue.name)}</h3>
        <p class="venue-campus">${esc(venue.campus)}</p>
        <address>${venue.addressLines.map(esc).join('<br>')}</address>
        <div class="venue-actions">
          <a class="btn btn--secondary" href="${esc(venue.mapUrl)}" target="_blank" rel="noopener noreferrer">${icons.pin(18)} View on map ${icons.external(14)}${NEW_TAB_SR}</a>
          <a class="text-link" href="${esc(institution.website)}" target="_blank" rel="noopener noreferrer">About GIM ${icons.external(14)}${NEW_TAB_SR}</a>
        </div>
        <div class="venue-status">${statusBadge(venue.status, { small: true, label: 'Proposed venue' })}</div>
      </article>
      <div class="travel-list">
        ${travelBlocks
          .map((b) => `<article class="info-card"><div class="info-card-head"><h3>${esc(b.title)}</h3>${statusBadge(b.status, { small: true })}</div><p>${esc(b.text)}</p></article>`)
          .join('')}
      </div>
    </div>
  </div>
</section>`;
}

/* --------------------------------- Committee ------------------------------ */

function committeeSection(): string {
  return `<section class="section" id="committee" aria-labelledby="committee-title">
  <div class="container">
    ${sectionHeader({ id: 'committee', eyebrow: 'People', heading: committeeIntro.heading, lead: committeeIntro.lead })}
    <ul class="committee-grid" role="list">
      ${committee
        .map(
          (r) => `<li class="committee-card">
            <h3>${esc(r.role)}</h3>
            ${
              r.members.length
                ? `<ul role="list">${r.members.map((m) => `<li><strong>${esc(m.name)}</strong>${m.designation ? `<span>${esc(m.designation)}</span>` : ''}${m.affiliation ? `<span>${esc(m.affiliation)}</span>` : ''}</li>`).join('')}</ul>`
                : statusBadge('to-be-announced', { small: true })
            }
          </li>`,
        )
        .join('')}
    </ul>
  </div>
</section>`;
}

/* --------------------------------- Partners ------------------------------- */

function partnersSection(ctx: PageContext): string {
  const body =
    partners.length > 0
      ? partnerCategories
          .map((cat) => {
            const list = partners.filter((p) => p.category === cat);
            if (!list.length) return '';
            return `<div class="partner-group"><h3 class="h-small">${esc(cat)}</h3><ul class="partner-grid" role="list">${list
              .map((p) => {
                const inner = p.logo ? `<img src="${esc(ctx.rel + p.logo)}" alt="${esc(p.name)}" loading="lazy">` : `<span>${esc(p.name)}</span>`;
                return `<li class="partner-card">${p.url && isSafeUrl(p.url) ? `<a href="${esc(p.url)}"${externalAttrs(p.url)}>${inner}${NEW_TAB_SR}</a>` : inner}</li>`;
              })
              .join('')}</ul></div>`;
          })
          .join('')
      : `<div class="empty-state empty-state--compact">
          <div class="empty-body">
            <p class="empty-title">${esc(partnersIntro.emptyTitle)}</p>
            <p>${esc(partnersIntro.emptyText)}</p>
            <p>${esc(partnersIntro.enquiryText)} <a class="text-link" href="${href(ctx, '#contact')}">Contact details ${icons.arrowRight(16)}</a></p>
          </div>
        </div>`;

  return `<section class="section section--tint" id="partners" aria-labelledby="partners-title">
  <div class="container">
    ${sectionHeader({ id: 'partners', eyebrow: 'Support', heading: partnersIntro.heading })}
    ${body}
  </div>
</section>`;
}

/* ----------------------------------- FAQs --------------------------------- */

function faqSection(): string {
  return `<section class="section" id="faqs" aria-labelledby="faqs-title">
  <div class="container faq-layout">
    <div>
      ${sectionHeader({ id: 'faqs', eyebrow: 'Help', heading: faqIntro.heading, lead: faqIntro.lead })}
      <nav class="faq-index" aria-label="FAQ topics"><ul role="list">${faqGroups.map((g, i) => `<li><a href="#faq-${i}">${esc(g.group)}</a></li>`).join('')}</ul></nav>
    </div>
    <div class="faq-groups">
      ${faqGroups
        .map(
          (g, i) => `<section class="faq-group" id="faq-${i}" aria-labelledby="faq-${i}-title">
            <h3 id="faq-${i}-title">${esc(g.group)}</h3>
            ${g.items
              .map(
                (f) => `<details class="faq">
                  <summary><span>${esc(f.question)}</span>${icons.chevron()}</summary>
                  <div class="faq-answer">${paragraphs(f.answer)}</div>
                </details>`,
              )
              .join('')}
          </section>`,
        )
        .join('')}
    </div>
  </div>
</section>`;
}

/* ---------------------------------- Contact ------------------------------- */

function contactSection(): string {
  const email = contact.email
    ? `<a href="mailto:${esc(contact.email)}">${esc(contact.email)}</a>`
    : `<span>${esc(contact.emailPendingText)}</span> ${statusBadge('to-be-announced', { small: true })}`;
  return `<section class="section section--ink section--contact" id="contact" aria-labelledby="contact-title">
  <div class="container">
    ${sectionHeader({ id: 'contact', eyebrow: 'Get in touch', heading: contactIntro.heading, lead: contactIntro.lead })}
    <ul class="contact-grid" role="list">
      <li class="contact-card">${icons.mail(22)}<h3>Conference email</h3><p>${email}</p></li>
      ${contact.phone ? `<li class="contact-card">${icons.info(22)}<h3>Phone</h3><p><a href="tel:${esc(contact.phone.replace(/\s+/g, ''))}">${esc(contact.phone)}</a></p></li>` : ''}
      <li class="contact-card">${icons.pin(22)}<h3>Postal address</h3><address>${institution.addressLines.map(esc).join('<br>')}</address></li>
      <li class="contact-card">${icons.globe(22)}<h3>Host institution</h3><p><a href="${esc(institution.website)}" target="_blank" rel="noopener noreferrer">${esc(institution.name)} ${icons.external(14)}${NEW_TAB_SR}</a></p></li>
    </ul>
  </div>
</section>`;
}

export function renderHome(ctx: PageContext, paymentState: PaymentState): string {
  return [
    hero(ctx),
    aboutSection(),
    tracksSection(ctx),
    cfpSection(ctx),
    datesSection(),
    programmeSection(),
    speakersSection(ctx),
    registrationSection(paymentState),
    venueSection(),
    committeeSection(),
    partnersSection(ctx),
    faqSection(),
    contactSection(),
  ].join('\n');
}

