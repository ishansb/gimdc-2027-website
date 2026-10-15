/**
 * SPEAKERS — keynote speakers and faculty mentors.
 *
 * IMPORTANT: add a person here ONLY after they have formally confirmed their
 * participation AND the organisers have approved the announcement.
 * Invited or prospective speakers must never be listed.
 *
 * Photos: place an authorised photo in public/assets/speakers/
 * (square, at least 400 × 400 px, under 150 KB) and give its path in `photo`.
 * Leave `photo` as "" to show initials instead.
 */
import type { Status } from './types.ts';

export interface Speaker {
  name: string;
  /** e.g. "Professor of Strategy" */
  role: string;
  /** e.g. "Name of University" */
  affiliation: string;
  /** Optional short biography (2–4 sentences). */
  bio?: string;
  /** Optional path such as 'assets/speakers/firstname-lastname.jpg'. */
  photo?: string;
  /** Optional link to an official profile page. */
  profileUrl?: string;
  /** Must be 'confirmed' to appear on the site. */
  status: Status;
}

export const speakersIntro = {
  heading: 'Speakers',
  lead: 'Keynote speakers and faculty mentors will be announced as invitations are confirmed.',
  emptyTitle: 'Speakers to be announced',
  emptyText: 'Announcements will be made here once speakers have confirmed their participation.',
};

/*
 * Example (copy, remove the leading // and fill in real, confirmed details):
 *
 * // {
 * //   name: 'Full Name',
 * //   role: 'Professor of …',
 * //   affiliation: 'University …',
 * //   bio: 'Short biography …',
 * //   photo: 'assets/speakers/full-name.jpg',
 * //   profileUrl: 'https://…',
 * //   status: 'confirmed',
 * // },
 */
export const keynoteSpeakers: Speaker[] = [];

export const facultyMentors: Speaker[] = [];
