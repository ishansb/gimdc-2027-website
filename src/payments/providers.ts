/**
 * Payment providers.
 *
 *  - disabledProvider      : the current demo state. Always disabled.
 *  - hostedLinkProvider    : opens an approved, institution-owned hosted
 *                            payment page (e.g. a Razorpay Payment Page created
 *                            in GIM's own Razorpay account). Activates only when
 *                            every safety check passes.
 *  - razorpayCheckoutProvider : placeholder for a future custom Checkout
 *                            integration. It deliberately REFUSES to activate,
 *                            because order creation and signature verification
 *                            need a secure server that GitHub Pages cannot provide.
 *
 * No provider loads third-party scripts, creates orders, or handles card,
 * bank or UPI details.
 */
import type { PaymentContext, PaymentProvider, PaymentState } from './types.ts';

export const disabledProvider: PaymentProvider = {
  id: 'disabled',
  resolve(): PaymentState {
    return { kind: 'disabled', reasons: ['payment.mode is "disabled".'] };
  },
};

/** True when `host` equals an allowed host or is a sub-domain of one. */
export function hostAllowed(host: string, allowed: readonly string[]): boolean {
  const h = host.toLowerCase();
  return allowed.some((a) => {
    const d = a.toLowerCase().replace(/^\.+/, '');
    return d.length > 0 && (h === d || h.endsWith(`.${d}`));
  });
}

export const hostedLinkProvider: PaymentProvider = {
  id: 'hosted-link',
  resolve({ config, registrationStatus }: PaymentContext): PaymentState {
    const reasons: string[] = [];
    let parsed: URL | null = null;

    if (config.hostedLinkUrl.trim() === '') {
      reasons.push('payment.hostedLinkUrl is empty.');
    } else {
      try {
        parsed = new URL(config.hostedLinkUrl.trim());
      } catch {
        reasons.push('payment.hostedLinkUrl is not a valid web address.');
      }
    }
    if (parsed && parsed.protocol !== 'https:') reasons.push('payment.hostedLinkUrl must start with https://');
    if (parsed && (parsed.username || parsed.password)) reasons.push('payment.hostedLinkUrl must not contain credentials.');
    if (parsed && !hostAllowed(parsed.hostname, config.allowedHosts)) {
      reasons.push(`payment.hostedLinkUrl host "${parsed.hostname}" is not in payment.allowedHosts.`);
    }
    if (config.approvalReference.trim() === '') reasons.push('payment.approvalReference is empty (formal approval required).');
    if (registrationStatus !== 'open') reasons.push(`registrationStatus is "${registrationStatus}", not "open".`);

    if (reasons.length > 0 || !parsed) return { kind: 'disabled', reasons };
    return { kind: 'hosted-link', url: parsed.toString() };
  },
};

export const razorpayCheckoutProvider: PaymentProvider = {
  id: 'razorpay-checkout',
  resolve(): PaymentState {
    return {
      kind: 'disabled',
      reasons: [
        'payment.mode "razorpay-checkout" needs a secure server for order creation and signature verification.',
        'It cannot run on static hosting and is intentionally not implemented in this build. See PAYMENT_INTEGRATION.md.',
      ],
    };
  },
};

const PROVIDERS: Record<string, PaymentProvider> = {
  disabled: disabledProvider,
  'hosted-link': hostedLinkProvider,
  'razorpay-checkout': razorpayCheckoutProvider,
};

/** Resolve the payment state. Unknown modes fall back to disabled. */
export function resolvePayment(ctx: PaymentContext): PaymentState {
  const provider = PROVIDERS[ctx.config.mode];
  if (!provider) return { kind: 'disabled', reasons: [`Unknown payment.mode "${String(ctx.config.mode)}".`] };
  return provider.resolve(ctx);
}
