/**
 * Automated checks (Node's built-in test runner — no extra packages).
 * Run with:  npm test
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import { esc, formatDateRange, formatInr, isSafeUrl, parseIsoDate } from '../src/lib/html.ts';
import { hostAllowed, resolvePayment } from '../src/payments/providers.ts';
import { validateContent } from '../src/lib/validate.ts';
import { build } from '../src/build.ts';
import { keynoteSpeakers, facultyMentors } from '../content/speakers.ts';
import { partners } from '../content/partners.ts';
import { payment, registrationStatus } from '../content/registration.ts';
import { site } from '../content/site.ts';
import { tracks } from '../content/tracks.ts';

const base = { mode: 'hosted-link' as const, hostedLinkUrl: 'https://pages.razorpay.com/gimdc', allowedHosts: ['gim.ac.in', 'razorpay.com', 'rzp.io'], approvalReference: 'REF-1' };

test('escapes HTML so content cannot inject markup', () => {
  assert.equal(esc('<script>"x"&\'y\''), '&lt;script&gt;&quot;x&quot;&amp;&#39;y&#39;');
});

test('formats dates and rupees', () => {
  assert.equal(formatDateRange('2027-04-15', '2027-04-17'), '15–17 April 2027');
  assert.equal(formatDateRange('2027-01-20'), '20 January 2027');
  assert.equal(formatInr(5000), '₹5,000');
  assert.equal(formatInr(125000), '₹1,25,000');
  assert.throws(() => parseIsoDate('2027-02-30'));
});

test('only safe link schemes are allowed', () => {
  assert.ok(isSafeUrl('https://gim.ac.in'));
  assert.ok(isSafeUrl('mailto:someone@gim.ac.in'));
  assert.ok(!isSafeUrl('javascript:alert(1)'));
  assert.ok(!isSafeUrl(''));
});

test('disabled payment mode always resolves to disabled', () => {
  assert.equal(resolvePayment({ config: { ...payment, mode: 'disabled' }, registrationStatus: 'open' }).kind, 'disabled');
});

test('hosted payment link activates only when every safety condition is met', () => {
  assert.equal(resolvePayment({ config: base, registrationStatus: 'open' }).kind, 'hosted-link');
  assert.equal(resolvePayment({ config: { ...base, approvalReference: '' }, registrationStatus: 'open' }).kind, 'disabled');
  assert.equal(resolvePayment({ config: base, registrationStatus: 'coming-soon' }).kind, 'disabled');
  assert.equal(resolvePayment({ config: { ...base, hostedLinkUrl: 'http://pages.razorpay.com/x' }, registrationStatus: 'open' }).kind, 'disabled');
  assert.equal(resolvePayment({ config: { ...base, hostedLinkUrl: 'https://evil-razorpay.com.example.net/x' }, registrationStatus: 'open' }).kind, 'disabled');
  assert.equal(resolvePayment({ config: { ...base, mode: 'razorpay-checkout' }, registrationStatus: 'open' }).kind, 'disabled');
});

test('host allow-list matches exact hosts and sub-domains only', () => {
  assert.ok(hostAllowed('pages.razorpay.com', ['razorpay.com']));
  assert.ok(hostAllowed('gim.ac.in', ['gim.ac.in']));
  assert.ok(!hostAllowed('notrazorpay.com', ['razorpay.com']));
});

test('content passes validation with no errors', () => {
  const r = validateContent();
  assert.deepEqual(r.errors, []);
});

test('validator detects secrets', () => {
  const r = validateContent({ 'content/x.ts': "const k = 'rzp_live_ABCDEFGH12345';" });
  assert.ok(r.errors.some((e) => e.includes('secret')));
});


test('built site: pages, disabled payment, no data collection, no prospective names', () => {
  process.env.SITE_URL = 'https://example.github.io/gimdc-2027-website/';
  const { pages } = build();
  assert.equal(pages.length, 1 + tracks.length);
  const html = readFileSync(join('dist', 'index.html'), 'utf8');

  if (resolvePayment({ config: payment, registrationStatus }).kind === 'disabled') {
    assert.match(html, /<button[^>]*disabled[^>]*>[\s\S]*?Proceed to Payment/);
    assert.match(html, /Online payment integration pending institutional approval/);
  }
  assert.doesNotMatch(html, /<form|<input|<textarea/i, 'no forms may collect data');
  assert.doesNotMatch(html, /razorpay\.com\/v1|checkout\.js/i);
  assert.doesNotMatch(html, /href="#"/);
  if (!site.allowIndexing) assert.match(html, /noindex/);

  // Speakers and partners show only the neutral announcement state until confirmed entries exist.
  const confirmed = [...keynoteSpeakers, ...facultyMentors].filter((sp) => sp.status === 'confirmed');
  if (confirmed.length === 0) assert.match(html, /Speakers to be announced/);
  const shownSpeakers = (html.match(/class="speaker-card"/g) ?? []).length;
  assert.equal(shownSpeakers, confirmed.length, 'only confirmed speakers may be shown');
  if (partners.length === 0) assert.match(html, /Partnership announcements forthcoming/);
  // Internal approval language must not appear.
  for (const phrase of ['Approval sought', 'Director', 'budget', 'revenue-sharing']) assert.ok(!html.includes(phrase), `"${phrase}" must not appear`);

  // Every internal link to a track page resolves to a built page.
  const built = new Set(readdirSync(join('dist', 'tracks')));
  for (const m of html.matchAll(/href="tracks\/([^/"]+)\/"/g)) assert.ok(built.has(m[1]!), `missing track page ${m[1]}`);

  // Every in-page anchor has a matching id.
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  for (const m of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.has(m[1]!), `anchor #${m[1]} has no target`);

  const notFound = readFileSync(join('dist', '404.html'), 'utf8');
  assert.match(notFound, /href="\/gimdc-2027-website\/assets\/css\/site\.css"/);
});
