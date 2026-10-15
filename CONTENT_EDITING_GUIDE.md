# Content editing guide (for non-technical administrators)

You can update everything on the GIMDC 2027 website by editing **text files in the `content` folder** on GitHub. You never need to touch the design, layout or code. When you save ("commit") a change, the website rebuilds and updates itself in about 2 minutes.

---

## 1. The 3-step routine

1. **Open the file.** Go to the repository on GitHub → open the `content` folder → click the file (see the table below) → click the **pencil icon** ("Edit this file").
2. **Change the text between the quotation marks.** Keep the quotation marks `'…'`, the commas at the end of lines, and the brackets exactly as they are.
3. **Save.** Click **Commit changes…**, write a short note (e.g. "Update submission deadline"), and click **Commit changes** again.

Then wait 2–3 minutes and refresh the website. To watch progress, open the repository's **Actions** tab. A green tick means the site is live. A red cross means the change was rejected, and the website **keeps showing the previous version** (see section 5).

> **Tip:** Lines starting with `//` or between `/*` and `*/` are notes for you. They never appear on the website.

---

## 2. Which file controls what

| To change… | Edit this file |
|---|---|
| Conference name, theme, dates, About text | `content/conference.ts` |
| Important dates / deadlines | `content/timeline.ts` |
| The seven research tracks | `content/tracks.ts` |
| Call for Papers text and the **submission portal link** | `content/callForPapers.ts` |
| Programme format and day-by-day schedule | `content/programme.ts` |
| Keynote speakers and faculty mentors | `content/speakers.ts` |
| Organising committee | `content/committee.ts` |
| Partners and sponsors | `content/partners.ts` |
| Fees, registration status, **payment switch** | `content/registration.ts` |
| Venue and travel | `content/venue.ts` |
| FAQs | `content/faqs.ts` |
| Email, phone, social links | `content/contact.ts` |
| Menu labels and order | `content/navigation.ts` |
| Site title, demo notice, search-engine setting, logo | `content/site.ts` |

---

## 3. Common tasks with examples

### Change a deadline
In `content/timeline.ts`, dates are written **year-month-day**:

```ts
{ id: 'submission-final', label: 'Extended / final submission deadline', date: '2027-01-20', status: 'proposed', highlight: true },
```
Change `'2027-01-20'` to, for example, `'2027-01-25'`. Once the date is formally approved, change `'proposed'` to `'confirmed'`.

### Change the conference dates
Update **both** places, or the site will refuse to publish:
- `content/conference.ts` → `start:` and `end:`
- `content/timeline.ts` → the `conference` line (`date:` and `endDate:`)

### Open submissions (when the portal is approved)
In `content/callForPapers.ts`:
```ts
export const submissionPortal: PendingLink = {
  label: 'Submit your paper',
  url: 'https://the-approved-portal.example/gimdc2027',   // ← paste the real link
  unavailableLabel: 'Submission portal — coming soon',
  status: 'open',                                        // ← was 'coming-soon'
};
```
The header button, the hero button and every track page switch to **Submit your paper** automatically.

### Add a confirmed speaker
In `content/speakers.ts`, add an entry inside the square brackets:
```ts
export const keynoteSpeakers: Speaker[] = [
  {
    name: 'Full Name',
    role: 'Professor of Strategy',
    affiliation: 'University Name',
    bio: 'Two or three sentences approved by the speaker.',
    photo: 'assets/speakers/full-name.jpg',
    status: 'confirmed',
  },
];
```
- Only people with `status: 'confirmed'` are shown. Add someone **only after** they have confirmed in writing and the organisers have approved the announcement.
- To add a photo, open `public/assets/` on GitHub, create a `speakers` folder if needed (Add file → Upload files), and upload a square JPG under 150 KB with a simple file name like `full-name.jpg`.

### Add committee members
In `content/committee.ts`:
```ts
{ role: 'Conference Chair', members: [ { name: 'Dr Full Name', designation: 'Associate Professor', affiliation: 'Goa Institute of Management' } ] },
```

### Add a partner
Upload the approved logo to `public/assets/partners/`, then in `content/partners.ts`:
```ts
export const partners: Partner[] = [
  { name: 'Organisation Name', category: 'Publication partner', logo: 'assets/partners/organisation.svg', url: 'https://…' },
];
```
`category` must be one of the names in `partnerCategories`.

### Add or edit an FAQ
In `content/faqs.ts`, copy an existing `{ question: …, answer: [ … ] },` block and edit it. Each string inside `answer: [ ]` becomes one paragraph.

### Set the official email address
In `content/contact.ts`: `email: 'gimdc@gim.ac.in',` (use only a mailbox that actually exists).

### Change fees
In `content/registration.ts`, `amount: 5000` is the number of rupees without commas. The site adds the ₹ symbol and commas itself.

### Add the official GIM logo
Upload the authorised logo file to `public/assets/brand/`, then in `content/site.ts` set `logoPath: 'assets/brand/gim-logo.svg',`.

### Remove the "Demonstration website" bar (at official launch)
In `content/site.ts`: `show: false`. To let Google index the site, also set `allowIndexing: true`. Do this **only** on the approved official address.

---

## 4. Status words you can use

`'proposed'` · `'awaiting-approval'` · `'coming-soon'` · `'to-be-announced'` · `'open'` · `'closed'` · `'confirmed'` · `'draft'`

Write them exactly like this, in lowercase with hyphens. Any other word stops the build and keeps the old site online.

---

## 5. If something goes wrong

- **Red cross in the Actions tab:** click the failed run → **build** → the "Test and build" step. The message names the file and the problem, for example:
  `✖ timeline "Conference": Invalid calendar date "2027-02-30"`
  Fix that line and commit again. The live site is not affected until a build succeeds.
- **Undo a change:** open the file → **History** → open the previous commit → copy the old text back, or ask the technical contact to "revert" the commit.
- **Never paste passwords, API keys, Razorpay secrets or personal data** into any file. The build actively blocks common secret formats.

---

## 6. Future option: an editing screen instead of files (Level 2)

A Git-based CMS such as **Decap CMS** can give staff a form-based editor (`/admin`) that saves to this same repository. It was **not** installed for the demonstration because:

1. it needs an authentication service (GitHub OAuth through a small proxy, or GIM's own identity provider). Without one, the editor would either not work or would be **publicly writable**, which is unacceptable;
2. Decap edits YAML/JSON/Markdown files, so the current `.ts` content files would first be moved to JSON (a mechanical change; the renderer already separates content from layout).

**Recommended path:** once GIM IT chooses the hosting (see `DEPLOYMENT.md`), convert `content/*.ts` to `content/*.json` with a validation schema, add Decap with GitHub OAuth (or the institute's SSO), and restrict editor access to named staff. Until then, the GitHub web editor described above is the safe, zero-cost option.
