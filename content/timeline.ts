/**
 * IMPORTANT DATES — the milestone calendar.
 *
 * - Write dates as "YYYY-MM-DD". For a date range also fill `endDate`.
 * - Keep the list in date order.
 * - `highlight: true` makes a milestone stand out (use for 1–2 items).
 * - Change `status` to 'confirmed' only after formal approval.
 */
import type { IsoDate, Status } from './types.ts';

export interface Milestone {
  id: string;
  label: string;
  date: IsoDate;
  endDate?: IsoDate;
  status: Status;
  highlight?: boolean;
  note?: string;
}

export const timelineIntro = {
  heading: 'Important Dates',
  lead: 'All dates are proposed and may change. Final dates will be confirmed in the official Call for Papers.',
};

export const milestones: Milestone[] = [
  { id: 'website', label: 'Conference website goes live', date: '2026-10-25', status: 'proposed' },
  { id: 'submission-original', label: 'Submission deadline', date: '2027-01-05', status: 'proposed' },
  { id: 'submission-final', label: 'Extended / final submission deadline', date: '2027-01-20', status: 'proposed', highlight: true },
  { id: 'registration-opens', label: 'Registration opens', date: '2027-02-01', status: 'proposed' },
  { id: 'acceptance', label: 'Acceptance notifications', date: '2027-02-15', status: 'proposed' },
  { id: 'registration-closes', label: 'Registration closes', date: '2027-03-01', status: 'proposed' },
  { id: 'conference', label: 'Conference', date: '2027-04-15', endDate: '2027-04-17', status: 'proposed', highlight: true },
];
