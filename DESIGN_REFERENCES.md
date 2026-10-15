# Design references and decisions

Research was carried out on 15 October 2026 using live, publicly accessible pages. The sites below were studied for **patterns only**. No text, branding, layouts, images or other assets were copied.

## Sites reviewed

| Site | URL reviewed | Patterns noted | Adapted for GIMDC as… |
|---|---|---|---|
| Academy of Management — AOM 2026 Program Navigator | https://www.aom.org/events/annual-meeting/program/ | Dates and location shown in the hero next to the title. One clear primary call to action. Content split by session type, each with the same "Important notes" block. Footer with address, policies and sponsor tiers. | A hero "facts" row (Dates · Venue · Format). One primary CTA (Explore Tracks). Repeated card patterns with a status badge on each block. |
| EURAM 2026 Conference | https://conferences.euram.academy/2026conference/faq/ | Doctoral colloquium is a top-level menu item. Tracks (SIGs) are listed under Programme. FAQ grouped by audience. The site shows the same dates differently in two places. | FAQs grouped by topic with a topic index. **All dates come from one data file** (`content/timeline.ts`) and a build check stops the conference dates disagreeing. |
| INFORMS Annual Meeting 2026 | https://meetings.informs.org/wordpress/sanfrancisco2026 | Minimal hero: title, dates, city, tagline, "sign up for updates". | A restrained hero that states only what is confirmed. No sign-up form, because there is no approved mailing list or privacy notice yet. |
| Strategic Management Society — Conferences | https://www.strategicmanagement.net/conferences-events/ | Consistent date formats. A breadcrumb trail. An accessibility statement in the footer. | One date format everywhere ("15 April 2027"). Breadcrumbs on track pages. A footer statement that the site uses no cookies or tracking. |
| EMAC Doctoral Colloquium | https://www.emac.academy/doctoral-colloquium/ (redirected from emac-online.org) | Short Purpose → Scope → Participants structure. A "next edition" call-out. | The About section follows Purpose → Objectives → Who should attend → What to expect. |
| IIM Bangalore — IMRDC 2026 call for submissions | https://www.iimb.ac.in/imrdc2026/call-submissions.php | The Call for Submissions follows Overview → Review process → Dates table → Eligibility → Numbered guidelines. Secretariat contact in the footer. | The Call for Papers is laid out as Eligibility · Submission types · Guidelines & format · Review process, with a separate submission-portal card that shows the deadlines. |
| IIM Ranchi — Doctoral Research Conference 2026 | https://iimranchi.ac.in/drc2026/ | Subject areas listed up front. A simple four-row dates list. Concrete formatting rules. | Seven track cards near the top of the page. A compact "Key dates" strip inside the hero. A placeholder structure ready for the formatting rules. |

Some patterns came from observing what these sites did **not** do well, for example conflicting dates, repeated menus, and pages framed as past events while still promoting submissions.

## Design decisions

1. **Concept: "boundaries crossed."** The hero artwork is drawn in code. Seven irregular contour rings stand for the seven boundaries. They are crossed by a network of research nodes, and one highlighted path runs from the centre out beyond the outermost ring. The same idea is reduced to an original conference mark: a ring crossed by a line of nodes. This mark is **not** a GIM logo and is not meant to look like one.
2. **Typography.** Headings use a serif for an academic voice: the Latin subset of Noto Serif CJK, which is Source Serif-based and released under the SIL OFL. Body text uses Inter (SIL OFL). Both are self-hosted, so the site makes no Google Fonts or other third-party requests.
3. **Palette (provisional).**
   - Deep navy `#0B1F3A`, chosen to sit comfortably beside GIM's blue identity.
   - A laterite accent `#A3401F`, a nod to Goa's red laterite stone.
   - Warm paper `#F7F5F0` and sand `#EAD8B2`.
   - Seven restrained track hues. Each passes WCAG AA contrast against white.

   **GIM's official brand colours could not be verified from public sources.** The gim.ac.in markup exposes no colour values, and the logo file name only suggests blue. Swap the variables at the top of `public/assets/css/site.css` once the communications team supplies brand guidelines.
4. **Status is never colour-only.** Every status badge pairs an icon with a text label (Proposed, Coming soon, To be announced, Awaiting approval).
5. **Inactive does not mean broken.** Unavailable links use a hatched, dashed "inactive" style with explicit wording. The disabled payment button is a real `disabled` button with an explanatory note.
6. **Information architecture.** A single home page follows the doctoral researcher's journey: Discover → Tracks → Call for Papers → Dates → Programme → Speakers → Registration → Venue → Committee → Partners → FAQs → Contact. Each of the seven tracks has its own page (`/tracks/<slug>/`) that you can link to directly. The header keeps six key items plus a full "Menu" so it never overflows.
7. **No decorative excess.** There is one draw-in animation on the hero path, and it is disabled under `prefers-reduced-motion`. There are no carousels, no glassmorphism, no stock photography and no countdown timer, because a countdown would imply the dates are confirmed.
