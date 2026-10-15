/**
 * Shared types for the GIMDC 2027 content files.
 *
 * ADMINISTRATORS: you normally do not need to edit this file.
 * It describes the "shape" of the content so that mistakes (a misspelt
 * status, a missing field) are caught automatically when the site is built.
 */

/**
 * Every piece of information that can change state carries one of these
 * statuses. The website shows each status as a text label with an icon, so
 * meaning never depends on colour alone.
 *
 *  - "draft"             Internal draft. Not normally shown publicly.
 *  - "proposed"          Proposed by the organisers; may still change.
 *  - "awaiting-approval" Waiting for institutional approval.
 *  - "coming-soon"       Will be published / opened later.
 *  - "to-be-announced"   Names or details not yet announced.
 *  - "open"              Currently open (e.g. submissions, registration).
 *  - "closed"            Closed.
 *  - "confirmed"         Officially confirmed. Use ONLY after written approval.
 */
export type Status =
  | 'draft'
  | 'proposed'
  | 'awaiting-approval'
  | 'coming-soon'
  | 'to-be-announced'
  | 'open'
  | 'closed'
  | 'confirmed';

export const STATUS_LABELS: Record<Status, string> = {
  draft: 'Draft',
  proposed: 'Proposed',
  'awaiting-approval': 'Awaiting approval',
  'coming-soon': 'Coming soon',
  'to-be-announced': 'To be announced',
  open: 'Open',
  closed: 'Closed',
  confirmed: 'Confirmed',
};

/** A link that may not exist yet. Leave `url` empty ("") until a real, approved link exists. */
export interface PendingLink {
  /** Text shown on the button or link. */
  label: string;
  /** Full https:// address. Leave as "" while it is not available. */
  url: string;
  /** Text shown instead of the link while `url` is empty. */
  unavailableLabel: string;
  status: Status;
}

/** An ISO calendar date written as "YYYY-MM-DD", e.g. "2027-01-20". */
export type IsoDate = `${number}-${number}-${number}`;
