/**
 * ORGANISING COMMITTEE
 *
 * Add names under each role once they are approved for publication.
 * While `members` is empty the role is shown as "To be announced".
 */

export interface CommitteeMember {
  name: string;
  /** e.g. "Associate Professor, Marketing" */
  designation?: string;
  /** e.g. "Goa Institute of Management" */
  affiliation?: string;
}

export interface CommitteeRole {
  role: string;
  members: CommitteeMember[];
}

export const committeeIntro = {
  heading: 'Organising Committee',
  lead: 'The organising committee will be announced shortly.',
};

export const committee: CommitteeRole[] = [
  { role: 'Conference Chair', members: [] },
  { role: 'Co-Chairs', members: [] },
  { role: 'Faculty Coordinators', members: [] },
  { role: 'Track & Student Coordinators', members: [] },
];
