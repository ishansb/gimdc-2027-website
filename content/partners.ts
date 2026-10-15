/**
 * PARTNERS & SPONSORS
 *
 * IMPORTANT: list an organisation ONLY after a partnership has been formally
 * agreed and the organisation has approved use of its name and logo.
 * Prospective or approached organisations must never be listed.
 *
 * Logos: place the approved logo file in public/assets/partners/
 * (SVG or PNG, transparent background) and give its path in `logo`.
 */

export interface Partner {
  name: string;
  /** Must match one of the category names in `partnerCategories`. */
  category: string;
  logo?: string;
  url?: string;
}

export const partnersIntro = {
  heading: 'Partners & Sponsors',
  emptyTitle: 'Partnership announcements forthcoming',
  emptyText:
    'Institutional, publication, database and conference-support partners will be announced here once agreements are confirmed.',
  enquiryText: 'Organisations interested in supporting GIMDC 2027 may contact the organising team.',
};

/** Categories (shown as headings once partners are added). */
export const partnerCategories = ['Institutional partner', 'Publication partner', 'Database partner', 'Conference support'];

/*
 * Example:
 * // { name: 'Organisation name', category: 'Publication partner', logo: 'assets/partners/org.svg', url: 'https://…' },
 */
export const partners: Partner[] = [];
