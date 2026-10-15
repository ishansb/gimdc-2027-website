/**
 * Payment integration boundary.
 *
 * The registration section never talks to a payment provider directly.
 * It asks the configured provider for a `PaymentState` and renders that.
 * Swapping the disabled placeholder for an approved provider therefore does
 * not require any change to the page design.
 */
import type { PaymentMode } from '../../content/registration.ts';
import type { Status } from '../../content/types.ts';

export interface PaymentConfig {
  mode: PaymentMode;
  hostedLinkUrl: string;
  allowedHosts: readonly string[];
  approvalReference: string;
}

export interface PaymentContext {
  config: PaymentConfig;
  registrationStatus: Status;
}

/** What the registration section should render. */
export type PaymentState =
  | {
      kind: 'disabled';
      /** Human-readable reasons, printed as build warnings (never shown publicly). */
      reasons: string[];
    }
  | {
      kind: 'hosted-link';
      /** Validated https URL of the approved, institution-owned payment page. */
      url: string;
    };

export interface PaymentProvider {
  readonly id: PaymentMode;
  /** Decide, at build time, what the payment area should show. Must never throw for user mistakes. */
  resolve(ctx: PaymentContext): PaymentState;
}
