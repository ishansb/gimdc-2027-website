/**
 * CONFERENCE — name, theme, dates and the "About GIMDC" text.
 */
import type { IsoDate, Status } from './types.ts';

export const conference = {
  name: 'GIM Doctoral Conference 2027',
  shortName: 'GIMDC 2027',

  theme: {
    title: 'Beyond Boundaries',
    subtitle: 'Advancing Knowledge Through Collaboration and Innovation',
  },

  /**
   * Conference dates. Write dates as "YYYY-MM-DD".
   * Change `status` to 'confirmed' ONLY after the dates are formally approved.
   * (The source deck also lists 22–24 April 2027 as an alternative —
   * see CONTENT_REVIEW.md, item C-01.)
   */
  dates: {
    start: '2027-04-15' as IsoDate,
    end: '2027-04-17' as IsoDate,
    status: 'proposed' as Status,
  },

  /** Short format line shown in the hero. */
  formatLine: 'Three-day doctoral research conference · Seven research tracks',

  /** Location line in the hero. Only verified information. */
  locationLine: 'Goa Institute of Management, Goa, India',
} as const;

/** ABOUT GIMDC section */
export const about = {
  heading: 'About GIMDC 2027',
  lead:
    'GIMDC 2027 is a three-day doctoral research conference at Goa Institute of Management, built around the theme “Beyond Boundaries: Advancing Knowledge Through Collaboration and Innovation”.',

  /** Each string is one paragraph. */
  purpose: [
    'Doctoral research increasingly takes place in an interconnected and rapidly changing world. GIMDC 2027 invites scholars to move beyond conventional disciplinary, technological, organizational, market, economic and social, geographical and methodological boundaries to address complex societal and organizational challenges.',
    'The conference is intended to encourage collaboration among researchers, practitioners, policymakers and communities, while supporting research that is rigorous, innovative and socially relevant.',
  ],

  objectives: [
    'Provide a platform for doctoral researchers to present and discuss their work across seven “Beyond Boundaries” tracks.',
    'Encourage interdisciplinary and collaborative approaches to complex organizational and societal problems.',
    'Strengthen research capability through method-based and paper or faculty development workshops.',
    'Connect academic inquiry with industry and policy perspectives.',
  ],

  whoShouldAttend: [
    { title: 'Doctoral scholars', text: 'Researchers at any stage of a doctoral programme in management and allied disciplines. Formal eligibility will be set out in the Call for Papers.' },
    { title: 'Faculty members', text: 'Faculty from different institutions interested in mentoring, development workshops and research exchange.' },
    { title: 'Practitioners & policymakers', text: 'Industry and policy voices interested in research that crosses boundaries.' },
  ],

  whatToExpect: [
    { title: 'Paper presentations', text: 'Parallel presentations across seven research tracks.' },
    { title: 'Method-based workshop', text: 'A research-method workshop for doctoral scholars.' },
    { title: 'Panel discussion', text: 'Industry and faculty perspectives on research beyond boundaries.' },
    { title: 'Development workshop', text: 'A faculty / paper development workshop with faculty from different institutions.' },
  ],
} as const;
