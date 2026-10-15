/**
 * CALL FOR PAPERS — submission information and the submission portal link.
 *
 * When the official Call for Papers is approved:
 *   1. Replace each `body` below with the approved text.
 *   2. Change each `status` to 'confirmed'.
 *   3. Put the real submission portal address in `submissionPortal.url`
 *      and change its status to 'open'.
 */
import type { PendingLink, Status } from './types.ts';

export interface CfpBlock {
  title: string;
  /** One or more paragraphs. */
  body: string[];
  /** Optional bullet list. */
  bullets?: string[];
  status: Status;
}

export const cfpIntro = {
  heading: 'Call for Papers',
  lead: 'The official Call for Papers — with eligibility, submission types, formatting guidelines and the review process — will be published once approved.',
};

/** The researcher's journey, shown as numbered steps. */
export const journeySteps = [
  { title: 'Discover', text: 'Learn about the conference and its theme.', href: '#about' },
  { title: 'Choose a track', text: 'Find the track that fits your research.', href: '#tracks' },
  { title: 'Review requirements', text: 'Read the submission guidelines.', href: '#cfp-details' },
  { title: 'Check deadlines', text: 'Note the proposed submission dates.', href: '#dates' },
  { title: 'Submit', text: 'Submit when the official portal opens.', href: '#submission-portal' },
  { title: 'Register', text: 'Register after acceptance.', href: '#registration' },
];

export const cfpBlocks: CfpBlock[] = [
  {
    title: 'Eligibility',
    body: ['Eligibility criteria for doctoral scholars will be announced in the official Call for Papers.'],
    status: 'coming-soon',
  },
  {
    title: 'Submission types',
    body: ['Accepted submission types (for example, full papers or extended abstracts) will be specified in the Call for Papers.'],
    status: 'coming-soon',
  },
  {
    title: 'Guidelines & format',
    body: ['Formatting, length and anonymisation requirements will be published with the Call for Papers.'],
    status: 'coming-soon',
  },
  {
    title: 'Review process',
    body: ['Details of the review process and selection criteria will be shared with the Call for Papers.'],
    status: 'coming-soon',
  },
];

/** Submission portal. Leave `url` as "" until an approved portal exists. */
export const submissionPortal: PendingLink = {
  label: 'Submit your paper',
  url: '',
  unavailableLabel: 'Submission portal — coming soon',
  status: 'coming-soon',
};
