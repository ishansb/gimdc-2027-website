/**
 * NAVIGATION — menu labels and order.
 *
 * `id` must match a section on the home page (do not change ids).
 * `inHeader: true` shows the item in the desktop header bar; every item
 * always appears in the full menu and in the footer.
 */

export interface NavItem {
  id: string;
  label: string;
  inHeader?: boolean;
}

export const navigation: NavItem[] = [
  { id: 'about', label: 'About', inHeader: true },
  { id: 'tracks', label: 'Theme & Tracks', inHeader: true },
  { id: 'call-for-papers', label: 'Call for Papers', inHeader: true },
  { id: 'dates', label: 'Dates', inHeader: true },
  { id: 'programme', label: 'Programme' },
  { id: 'speakers', label: 'Speakers' },
  { id: 'registration', label: 'Registration', inHeader: true },
  { id: 'venue', label: 'Venue & Travel', inHeader: true },
  { id: 'committee', label: 'Committee' },
  { id: 'partners', label: 'Partners & Sponsors' },
  { id: 'faqs', label: 'FAQs' },
  { id: 'contact', label: 'Contact' },
];
