/**
 * Content checks run on every build. Errors stop the build (so a broken site
 * is never published); warnings are printed but do not stop it.
 */
import { site, institution } from '../../content/site.ts';
import { conference } from '../../content/conference.ts';
import { tracks } from '../../content/tracks.ts';
import { milestones } from '../../content/timeline.ts';
import { submissionPortal } from '../../content/callForPapers.ts';
import { keynoteSpeakers, facultyMentors } from '../../content/speakers.ts';
import { partners, partnerCategories } from '../../content/partners.ts';
import { fees, payment, registrationForm } from '../../content/registration.ts';
import { contact } from '../../content/contact.ts';
import { navigation } from '../../content/navigation.ts';
import { STATUS_LABELS, type Status } from '../../content/types.ts';
import { isSafeUrl, parseIsoDate } from './html.ts';

export interface ValidationResult {
  errors: string[];
  warnings: string[];
}

const SECRET_PATTERNS = [/rzp_(live|test)_[A-Za-z0-9]{6,}/, /key[_-]?secret/i, /-----BEGIN [A-Z ]*PRIVATE KEY-----/, /ghp_[A-Za-z0-9]{20,}/];

const isStatus = (s: string): s is Status => Object.prototype.hasOwnProperty.call(STATUS_LABELS, s);
const EMAIL = /^[^\s@<>"']+@[^\s@<>"']+\.[a-z]{2,}$/i;

export function validateContent(sourceTexts: Record<string, string> = {}): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const date = (label: string, iso: string) => {
    try {
      parseIsoDate(iso);
    } catch (e) {
      errors.push(`${label}: ${(e as Error).message}`);
    }
  };
  const url = (label: string, u: string) => {
    if (u && !isSafeUrl(u)) errors.push(`${label}: "${u}" is not an allowed link (use https://, mailto: or a relative path).`);
    if (/^http:\/\//i.test(u)) errors.push(`${label}: use https:// instead of http://`);
  };

  // Site
  if (site.siteUrl && !/^https:\/\/.+\/$/.test(site.siteUrl)) errors.push('site.siteUrl must start with https:// and end with "/".');
  url('institution.website', institution.website);

  // Conference dates
  date('conference.dates.start', conference.dates.start);
  date('conference.dates.end', conference.dates.end);
  if (conference.dates.end < conference.dates.start) errors.push('conference.dates.end is before conference.dates.start.');
  if (!isStatus(conference.dates.status)) errors.push(`conference.dates.status "${conference.dates.status}" is not a known status.`);

  // Timeline
  let prev = '';
  const ids = new Set<string>();
  for (const m of milestones) {
    date(`timeline "${m.label}"`, m.date);
    if (m.endDate) date(`timeline "${m.label}" endDate`, m.endDate);
    if (!isStatus(m.status)) errors.push(`timeline "${m.label}": unknown status "${m.status}".`);
    if (ids.has(m.id)) errors.push(`timeline: duplicate id "${m.id}".`);
    ids.add(m.id);
    if (prev && m.date < prev) warnings.push(`timeline: "${m.label}" is out of date order.`);
    prev = m.date;
  }
  const conf = milestones.find((m) => m.id === 'conference');
  if (conf && (conf.date !== conference.dates.start || (conf.endDate ?? conf.date) !== conference.dates.end)) {
    errors.push('timeline "conference" dates do not match conference.dates — update both files together.');
  }
  const regOpen = milestones.find((m) => m.id === 'registration-opens');
  const accept = milestones.find((m) => m.id === 'acceptance');
  if (regOpen && accept && regOpen.date < accept.date) {
    warnings.push('Registration opens before acceptance notifications (see CONTENT_REVIEW.md C-05).');
  }

  // Tracks
  const slugs = new Set<string>();
  tracks.forEach((t, i) => {
    if (t.number !== i + 1) errors.push(`tracks: "${t.title}" should be number ${i + 1}.`);
    if (!/^[a-z0-9-]+$/.test(t.slug)) errors.push(`tracks: slug "${t.slug}" may only contain lowercase letters, numbers and hyphens.`);
    if (slugs.has(t.slug)) errors.push(`tracks: duplicate slug "${t.slug}".`);
    slugs.add(t.slug);
    if (t.keyAreas.length === 0) warnings.push(`tracks: "${t.title}" has no key areas.`);
  });

  // Links
  url('submissionPortal.url', submissionPortal.url);
  url('registrationForm.url', registrationForm.url);
  if (submissionPortal.url && submissionPortal.status !== 'open') warnings.push('submissionPortal.url is set but its status is not "open".');

  // Speakers: only confirmed speakers are ever shown.
  for (const s of [...keynoteSpeakers, ...facultyMentors]) {
    if (s.status !== 'confirmed') warnings.push(`speakers: "${s.name}" is not "confirmed" and will NOT be shown.`);
    if (s.profileUrl) url(`speaker "${s.name}" profileUrl`, s.profileUrl);
  }

  // Partners
  for (const p of partners) {
    if (!partnerCategories.includes(p.category)) errors.push(`partners: "${p.name}" uses unknown category "${p.category}".`);
    if (p.url) url(`partner "${p.name}" url`, p.url);
  }

  // Fees
  for (const f of fees) {
    if (!Number.isFinite(f.amount) || f.amount < 0) errors.push(`fees: "${f.label}" amount must be a positive number.`);
  }

  // Contact
  if (contact.email && !EMAIL.test(contact.email)) errors.push(`contact.email "${contact.email}" is not a valid email address.`);
  for (const s of contact.social) url(`contact.social "${s.label}"`, s.url);

  // Navigation
  for (const n of navigation) if (!/^[a-z0-9-]+$/.test(n.id)) errors.push(`navigation: invalid id "${n.id}".`);

  // Payment safety
  if (!['disabled', 'hosted-link', 'razorpay-checkout'].includes(payment.mode)) errors.push(`payment.mode "${payment.mode}" is not recognised.`);

  // Secrets must never be committed.
  for (const [file, text] of Object.entries(sourceTexts)) {
    for (const re of SECRET_PATTERNS) {
      if (re.test(text.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, ''))) errors.push(`${file}: looks like it contains a secret key or credential (${re}). Remove it — secrets must never be in this repository.`);
    }
  }

  return { errors, warnings };
}
