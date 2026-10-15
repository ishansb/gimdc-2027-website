/**
 * RESEARCH TRACKS — the seven "Beyond Boundaries" tracks.
 *
 * Each track gets its own card on the home page and its own detail page at
 *   /tracks/<slug>/
 * Do not change a `slug` after the site is public (it is part of the web address).
 *
 * `icon` chooses one of the built-in line drawings:
 *   'disciplinary' | 'technological' | 'organizational' | 'market' |
 *   'economic-social' | 'geographical' | 'methodological'
 */

export type TrackIcon =
  | 'disciplinary'
  | 'technological'
  | 'organizational'
  | 'market'
  | 'economic-social'
  | 'geographical'
  | 'methodological';

export interface Track {
  number: number;
  slug: string;
  title: string;
  /** One-sentence core idea (from the proposal deck). */
  focus: string;
  /** Key areas, shown as tags. */
  keyAreas: string[];
  /** Optional groups of extra areas shown on the detail page. */
  areaGroups?: { label: string; items: string[] }[];
  icon: TrackIcon;
}

export const tracksIntro = {
  heading: 'Theme & Tracks',
  lead:
    'Seven tracks, each asking how research can move beyond a particular boundary. Together they form the academic architecture of GIMDC 2027.',
  themeStatement:
    'Beyond Boundaries reflects the evolving nature of research in an interconnected and rapidly changing world. By transcending traditional limitations, doctoral researchers can generate knowledge that is both academically rigorous and socially relevant.',
  /** Shown on every track page until the Call for Papers is published. */
  pendingNote:
    'Detailed track descriptions, suggested topics and track chairs will be published with the official Call for Papers.',
};

export const tracks: Track[] = [
  {
    number: 1,
    slug: 'disciplinary',
    title: 'Beyond Disciplinary Boundaries',
    focus: 'Different disciplines come together to understand complex management problems.',
    keyAreas: ['Strategy', 'Marketing', 'Finance', 'HR', 'Operations', 'Policy', 'Psychology', 'Economics', 'Technology', 'Sociology'],
    areaGroups: [
      { label: 'Management disciplines', items: ['Strategy', 'Marketing', 'Finance', 'HR', 'Operations', 'Policy'] },
      { label: 'Allied disciplines', items: ['Psychology', 'Economics', 'Technology', 'Sociology'] },
    ],
    icon: 'disciplinary',
  },
  {
    number: 2,
    slug: 'technological',
    title: 'Beyond Technological Boundaries',
    focus: 'AI, digital transformation and emerging technologies reshape organizations and society.',
    keyAreas: ['Generative AI', 'Digital transformation', 'Analytics', 'Cybersecurity', 'FinTech', 'Responsible AI'],
    icon: 'technological',
  },
  {
    number: 3,
    slug: 'organizational',
    title: 'Beyond Organizational Boundaries',
    focus: 'Work, leadership and organizational life are moving beyond the traditional workplace.',
    keyAreas: ['Hybrid work', 'Remote work', 'Gig work', 'Boundaryless work', 'Leadership', 'Talent', 'Well-being', 'Culture', 'Diversity & inclusion', 'Psychological safety'],
    areaGroups: [
      { label: 'Where and how work happens', items: ['Hybrid work', 'Remote work', 'Gig work', 'Boundaryless work'] },
      { label: 'People and organizational life', items: ['Leadership', 'Talent', 'Well-being', 'Culture', 'Diversity & inclusion', 'Psychological safety'] },
    ],
    icon: 'organizational',
  },
  {
    number: 4,
    slug: 'market',
    title: 'Beyond Market Boundaries',
    focus: 'Value creation increasingly occurs through ecosystems, partnerships and entrepreneurial action.',
    keyAreas: ['Marketing', 'Entrepreneurship', 'Innovation', 'Business models', 'Open innovation', 'Ecosystems'],
    icon: 'market',
  },
  {
    number: 5,
    slug: 'economic-social',
    title: 'Beyond Economic & Social Boundaries',
    focus: 'Organizations create value for people, planet and prosperity — not profit alone.',
    keyAreas: ['ESG', 'Sustainability', 'Circular economy', 'Climate action', 'Inclusion', 'Social impact', 'Sustainable finance'],
    icon: 'economic-social',
  },
  {
    number: 6,
    slug: 'geographical',
    title: 'Beyond Geographical Boundaries',
    focus: 'Ideas, talent, technology and capital increasingly move across borders.',
    keyAreas: ['Talent', 'Capital', 'Technology', 'Ideas', 'Trade', 'Innovation'],
    areaGroups: [
      { label: 'What moves across borders', items: ['Talent', 'Capital', 'Technology', 'Ideas', 'Trade', 'Innovation'] },
      { label: 'Regions', items: ['Asia', 'Europe', 'India', 'Americas', 'Africa', 'MENA', 'Oceania'] },
    ],
    icon: 'geographical',
  },
  {
    number: 7,
    slug: 'methodological',
    title: 'Beyond Methodological Boundaries',
    focus: 'New data and combinations of methods can reveal what conventional approaches miss.',
    keyAreas: ['Mixed methods', 'Systematic literature reviews', 'Meta-analysis', 'Netnography', 'Bibliometrics', 'Causal inference', 'Text analytics'],
    icon: 'methodological',
  },
];
