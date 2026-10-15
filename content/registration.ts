/**
 * REGISTRATION, FEES AND PAYMENT
 *
 * Fees are shown exactly as written below. Amounts are in Indian Rupees.
 *
 * ─────────────────────────────────────────────────────────────────────────
 *  PAYMENT SAFETY
 *  Online payment stays switched OFF unless ALL of the following are true:
 *    1. payment.mode is 'hosted-link'
 *    2. payment.hostedLinkUrl is an https:// address on an approved host
 *       (see payment.allowedHosts)
 *    3. payment.approvalReference is filled in (e.g. the approval note number)
 *    4. registrationStatus is 'open'
 *  If anything is missing, the site automatically shows the disabled
 *  "Online payment integration pending institutional approval" state, and the
 *  build prints a warning explaining why.
 *
 *  NEVER put a Razorpay "Key Secret", API secret, password or token in this
 *  file or anywhere in this repository. See PAYMENT_INTEGRATION.md.
 * ─────────────────────────────────────────────────────────────────────────
 */
import type { PendingLink, Status } from './types.ts';

export interface Fee {
  id: string;
  label: string;
  /** Amount in rupees, numbers only (no commas), e.g. 5000 */
  amount: number;
  /** Shown after the amount, e.g. "per participant" or "per night". */
  unit: string;
  /** What the fee includes, as stated in the approved documents. */
  inclusions: string[];
  status: Status;
}

export type PaymentMode = 'disabled' | 'hosted-link' | 'razorpay-checkout';

export const registrationIntro = {
  heading: 'Registration & Accommodation',
  lead: 'Registration will open for authors after acceptance. Indicative fees are shown below.',
  approvalNote:
    'Final charges, eligibility, payment arrangements and accommodation are subject to institutional approval and will be confirmed before registration opens.',
};

/** Overall registration status: 'coming-soon' | 'open' | 'closed' | … */
export const registrationStatus: Status = 'coming-soon';

export const fees: Fee[] = [
  {
    id: 'registration',
    label: 'Conference registration',
    amount: 5000,
    unit: 'per participant',
    inclusions: ['Inclusive of GST (as stated in the proposal)'],
    status: 'proposed',
  },
  {
    id: 'accommodation',
    label: 'Accommodation',
    amount: 800,
    unit: 'per night',
    inclusions: ['Includes meals', 'Availability to be confirmed'],
    status: 'proposed',
  },
];

/** Optional registration-interest form. Leave `url` as "" unless a real, approved form exists. */
export const registrationForm: PendingLink = {
  label: 'Registration form',
  url: '',
  unavailableLabel: 'Registration form — available when registration opens',
  status: 'coming-soon',
};

export const payment = {
  /**
   * 'disabled'          → no online payment (current setting).
   * 'hosted-link'       → button opens an approved hosted payment page
   *                       (e.g. a GIM-owned Razorpay Payment Page/Link).
   * 'razorpay-checkout' → custom checkout. Requires a secure server; NOT
   *                       available on GitHub Pages. The site refuses to
   *                       activate this mode. See PAYMENT_INTEGRATION.md.
   */
  mode: 'disabled' as PaymentMode,

  /** Approved hosted payment page address (https only). */
  hostedLinkUrl: '',

  /** Only links on these hosts (or their sub-domains) can be activated. */
  allowedHosts: ['gim.ac.in', 'razorpay.com', 'rzp.io'],

  /** Reference of the formal approval, e.g. "GIM/FIN/2027/012". Required to activate. */
  approvalReference: '',

  statusTitle: 'Online payment integration pending institutional approval',
  statusText: 'Payment will open here once the official payment facility is activated. No payment details are collected on this website.',
  buttonLabel: 'Proceed to Payment',
};
