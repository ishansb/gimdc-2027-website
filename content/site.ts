/**
 * SITE SETTINGS — identity, search-engine settings and the demo notice.
 *
 * Edit the text between the quotation marks. Keep the quotation marks and the
 * comma at the end of each line. See CONTENT_EDITING_GUIDE.md for examples.
 */

export const site = {
  /** Shown in the browser tab and in link previews. */
  title: 'GIM Doctoral Conference 2027 (GIMDC 2027)',
  shortName: 'GIMDC 2027',

  /** Used by search engines and link previews (keep under ~160 characters). */
  description:
    'GIMDC 2027 at Goa Institute of Management — a three-day doctoral research conference on the theme “Beyond Boundaries: Advancing Knowledge Through Collaboration and Innovation”.',

  /**
   * The public web address of the site, ending with "/".
   *  - Leave as "" to let the build use the SITE_URL setting supplied by the
   *    hosting workflow (GitHub Pages fills this in automatically).
   *  - For the official launch, set it to the approved address, for example
   *    "https://gim.ac.in/gimdc/" (only once GIM IT has confirmed the path).
   */
  siteUrl: '',

  /**
   * Allow search engines to index the site?
   * Keep `false` for the demonstration so it never competes with the
   * official GIM website. Set to `true` only for the approved launch.
   */
  allowIndexing: false,

  /** Thin notice bar at the very top of every page. */
  previewNotice: {
    show: true,
    text: 'Demonstration website. Conference dates, fees and programme details are proposed and subject to institutional approval.',
  },

  /** Language of the site (used by screen readers and search engines). */
  language: 'en-IN',
} as const;

/**
 * INSTITUTION — host institution details.
 * The address below is taken from GIM's published mandatory disclosure.
 */
export const institution = {
  name: 'Goa Institute of Management',
  shortName: 'GIM',
  website: 'https://gim.ac.in',

  /**
   * Path to an official GIM logo file placed in public/assets/brand/.
   * Leave as "" until the GIM communications team supplies an authorised
   * logo file. While empty, a plain text name is shown instead.
   * Example: 'assets/brand/gim-logo.svg'
   */
  logoPath: '',
  logoAlt: 'Goa Institute of Management',

  campusName: 'Sanquelim Campus',
  addressLines: ['Goa Institute of Management', 'Sanquelim Campus, Poriem, Sattari', 'Goa 403505, India'],
} as const;
