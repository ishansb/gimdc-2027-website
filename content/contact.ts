/**
 * CONTACT DETAILS
 *
 * Fill in `email` only with an official, approved conference mailbox
 * (for example an @gim.ac.in address created for GIMDC). Leave it as ""
 * until then — the site will show "To be announced".
 */

export const contactIntro = {
  heading: 'Contact',
  lead: 'For enquiries about GIMDC 2027.',
};

export const contact = {
  /** Official conference email, e.g. 'gimdc@gim.ac.in' — ONLY once it exists. */
  email: '',
  emailPendingText: 'Official conference email to be announced',

  /** Optional phone number in international format, e.g. '+91 832 …'. */
  phone: '',

  /** Social media links (leave empty if none). */
  social: [] as { label: string; url: string }[],
};
