# Content review — GIMDC 2027 demonstration website

**Prepared:** 15 October 2026 · **Status:** for organiser review

This file lists every place where the three source documents disagree, are ambiguous, or are silent, and the provisional value the demonstration site uses. Nothing here has been approved. Please work through the decisions table at the end and update the content files (see `CONTENT_EDITING_GUIDE.md`).

Source documents reviewed (not published in this repository):

- **[P]** *GIMDC 2027 Proposal for Director Approval* (Word)
- **[D]** *GIMDC 2027 PROPOSAL 12th Aug* (PowerPoint deck)
- **[W]** *GIMDC 2027 Website Structure* (Word)

> This repository may be public (GitHub Pages on a free plan needs a public repository). For that reason this file does **not** repeat the names of prospective speakers or organisations approached for partnership, or any internal budget or approval detail.

---

## A. Conflicts between sources

| ID | Topic | What the sources say | Demo site uses | Decision needed |
|---|---|---|---|---|
| C-01 | **Conference dates** | [P] 15–17 April 2027. [D] "1st proposed date 15–17 April 2027; 2nd proposed date 22–24 April 2027", within a 12–25 April window that "can change". | **15–17 April 2027**, labelled *Proposed* everywhere it appears. | Confirm final dates. Update `content/conference.ts` **and** the `conference` milestone in `content/timeline.ts` (the build refuses to publish if they differ). |
| C-02 | **Registration fee and GST** | [P] "INR 5,000 inclusive of GST". [D] "5000 with GST" (could be read as *plus* GST). | **₹5,000**, "Inclusive of GST (as stated in the proposal)", labelled *Proposed*. | Finance to confirm whether ₹5,000 includes GST, the GST rate and treatment, and whether any category (e.g. faculty, international) pays differently. |
| C-03 | **Accommodation** | [P] "INR 800 per night, including meals". [D] "Stay: 800 per night (Includes meals)". Neither states location, capacity, number of nights or booking process. | **₹800 per night, includes meals**, "Availability to be confirmed". | Confirm where participants stay, capacity, nights covered and how booking works. |
| C-04 | **Workshop naming** | [P] "Faculty development workshop — faculty participation from different institutions". [D] "Paper Development Workshop: Faculties from various institution". [W] "Faculty/Paper Development Workshop". | **"Faculty / paper development workshop"**, "Final format to be confirmed". | Decide whether this is a Faculty Development Workshop (for faculty), a Paper Development Workshop (for doctoral authors), or both. |
| C-05 | **Registration opens before acceptance** | [P] timeline: registration opens **1 Feb 2027**, acceptance notifications **15 Feb 2027**, registration closes 1 Mar 2027. | Shown exactly as in [P]; the build prints a warning. Copy says registration is "for authors after acceptance". | Confirm whether registration should open after acceptances, or whether early registration is intended (e.g. for non-presenting attendees). |
| C-06 | **Method workshop wording** | [P] "Method-based workshop — research-method workshop for doctoral scholars". [D] "Workshop-Method Based". | "Research-method workshop" (programme) / "Method-based workshop" (About). | Confirm the public title. |
| C-07 | **Track 6 scope** | [D] lists regions (Asia, Europe, India, Americas, Africa, MENA, Oceania) and flows (talent, capital, technology, ideas, trade, innovation). [P] lists only the flows. | Track 6 page shows both groups; the home-page card shows flows only. | Confirm whether regions should be part of the public track description. |
| C-08 | **Primary call to action** | [W] asks for a prominent "Submit Your Paper" button. No submission portal exists yet. | Header shows **"Call for Papers"** linking to the CFP section; the portal button shows "Submission portal — coming soon" (not clickable). Becomes "Submit your paper" automatically once a portal URL is added. | Provide the approved portal link (see D-01). |
| C-09 | **Speakers section** | [W] "Keynote speakers; Faculty mentors; To be announced where not confirmed." [P]/[D] list prospective invitees. | Neutral "Speakers to be announced" state. **No names published.** | Add speakers only after written confirmation (see `content/speakers.ts`). |
| C-10 | **Partners section** | [W] "Confirmed partners only". [P]/[D] list organisations to be approached. | Neutral "Partnership announcements forthcoming" state. **No organisations published.** | Add partners only after agreements and logo permissions (see `content/partners.ts`). |

## B. Information the sources do not provide (shown as placeholders)

| ID | Item | Where it appears | Placeholder shown |
|---|---|---|---|
| D-01 | Submission portal / conference-management system | Call for Papers, track pages, header | "Submission portal — coming soon" (inactive) |
| D-02 | Official conference email address | Contact, footer | "Official conference email to be announced" |
| D-03 | Eligibility criteria | Call for Papers, FAQs | "Will be announced in the official Call for Papers" |
| D-04 | Submission types, length, format, anonymisation | Call for Papers | "Will be published with the Call for Papers" |
| D-05 | Review process and selection criteria | Call for Papers | "Will be shared with the Call for Papers" |
| D-06 | Detailed three-day schedule | Programme | "To be announced" |
| D-07 | Organising committee names | Committee | Four roles, each "To be announced" |
| D-08 | Registration form | Registration | "Registration form — available when registration opens" (inactive) |
| D-09 | Payment arrangements | Registration | Disabled payment panel (see `PAYMENT_INTEGRATION.md`) |
| D-10 | Cancellation / refund policy, tax invoices | Not shown | Draft questions in `REGISTRATION_TERMS_DRAFT.md` |
| D-11 | Travel directions, nearest airport/rail, visas | Venue & Travel | "Will be published with the final programme" |
| D-12 | Certificates | FAQs | "Will be confirmed with the final programme" |
| D-13 | Official GIM logo and brand colours | Header, favicon | Text name "Goa Institute of Management" plus an original GIMDC mark; provisional palette |
| D-14 | Privacy notice | Not shown | Not needed while the site collects no data; required before any form or payment goes live |
| D-15 | Phone number | Not shown | GIM's public sources show two different general numbers (0832-2366700 in the 2025-26 mandatory disclosure; 0832-6916015 in the gim.ac.in footer), so neither is shown. |

## C. Facts used from public GIM sources

| Fact | Source |
|---|---|
| Postal address: Goa Institute of Management, Sanquelim Campus, Poriem, Sattari, Goa 403505 | GIM Mandatory Disclosure 2025-26 (gim.ac.in) and gim.ac.in footer |
| Institute website: https://gim.ac.in | gim.ac.in |

The venue is shown as *Proposed venue* because [P] says the conference is "at GIM" but no final venue confirmation was supplied.

## D. Status values used on the site

| Status | Meaning | Where used now |
|---|---|---|
| Proposed | Proposed by organisers, may change | Dates, fees, programme components, venue |
| Awaiting approval | Waiting for institutional approval | Online payment |
| Coming soon | Will open or be published later | Call for Papers, submission portal, registration, travel |
| To be announced | Names or details not yet announced | Speakers, committee, schedule, email |
| Open / Closed / Confirmed | Not used yet | Use only after formal decisions |

## E. Internal language kept off the public site

Approval requests, "approval sought", outreach plans, revenue-sharing arrangements, the brochure-base note and all budget references from [P]/[D] are not used anywhere in the website copy. An automated test checks for some of these phrases.

## F. Decisions checklist for the organisers

- [ ] C-01 Final conference dates
- [ ] C-02 Fee amount and GST treatment
- [ ] C-03 Accommodation arrangements
- [ ] C-04 Faculty vs paper development workshop
- [ ] C-05 Registration timing relative to acceptance
- [ ] C-06 Method workshop title
- [ ] C-07 Track 6 regions
- [ ] D-01 Submission portal
- [ ] D-02 Official email
- [ ] D-03 – D-05 Call for Papers text
- [ ] D-07 Committee names
- [ ] D-09 / D-10 Payment workflow and registration terms
- [ ] D-13 Official logo and brand colours
- [ ] Final approval to remove the "Demonstration website" notice and allow search indexing
