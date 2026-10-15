# Payment integration plan (Razorpay) — disabled in the demonstration

## 1. Current state (demonstration)

- The Registration section shows the proposed fees, the notice **"Online payment integration pending institutional approval"**, and a real HTML **`disabled` "Proceed to Payment" button**.
- The site does **not** load any Razorpay script, call any payment API, create orders, collect card/bank/UPI data, or show any "payment successful" screen. Automated tests confirm this (`tests/site.test.ts`).
- The site contains **no forms** and collects **no personal data**.

## 2. How the switch works (integration boundary)

```
content/registration.ts   ← configuration only (mode, approved URL, approval reference)
        │
src/payments/providers.ts ← decides what to show: resolvePayment() → PaymentState
        │                     • disabledProvider       (current)
        │                     • hostedLinkProvider     (approved hosted page)
        │                     • razorpayCheckoutProvider (refuses: needs a server)
src/render/home.ts        ← paymentPanel(state) draws the same panel for any state
```

The design does not change when payment is activated. Only the button's destination changes.

**Safety interlocks.** The hosted-link mode activates **only if all** of these hold. Otherwise the build falls back to *disabled* and prints the reasons:

1. `payment.mode` is `'hosted-link'`
2. `payment.hostedLinkUrl` is a valid `https://` URL, without embedded credentials
3. its host is in `payment.allowedHosts`. Update this list to the exact domain of GIM's approved payment page, because the Razorpay domain format was not verified for this demo.
4. `payment.approvalReference` records the formal approval (e.g. a finance office note number)
5. `registrationStatus` is `'open'`

`'razorpay-checkout'` deliberately never activates in this static build.

## 3. Recommended production options (in order of preference)

### Option A — use an existing institutional payment facility
Ask GIM Finance/IT whether GIM already has:

- a Razorpay account (or another gateway) used for programme fees or MDPs;
- an approved **hosted payment page or link** (Razorpay offers no-code hosted *Payment Pages*, see https://razorpay.com/docs/payments/payment-pages.md);
- an existing payment backend or ERP integration.

If a hosted page exists or can be created **in GIM's own account**, set it as `hostedLinkUrl`. The page itself collects the payer's details, and reconciliation happens in GIM's Razorpay dashboard. This needs **no server** and works on static hosting.

### Option B — custom Razorpay Standard Checkout (needs a secure server)
Use this only if A does not meet GIM's requirements (for example, registration data must be linked to accepted papers). Follow Razorpay's documented flow (https://razorpay.com/docs/payments/payment-gateway/quick-integration/build-integration/):

1. **Server** creates an order with the Orders API (`POST /orders`, authenticated with Key ID + **Key Secret**) for the approved amount, in paise.
2. **Browser** opens Razorpay Checkout with the **public Key ID** and the `order_id`.
3. On success, Checkout returns `razorpay_payment_id`, `razorpay_order_id` and `razorpay_signature` to the browser, which forwards them to the server.
4. **Server** verifies the signature: HMAC-SHA256 of `order_id + "|" + razorpay_payment_id` using the Key Secret, where `order_id` is the one the server stored, not the one echoed back by the browser.
5. **Server** treats **webhooks** (signature-verified with the webhook secret) as the authoritative status source and calls the Payments API when an immediate check is needed.
6. Only then does the server mark the registration *confirmed* and issue a confirmation or receipt.

**Non-negotiable rules for Option B**

- The Key Secret and webhook secret live **only** on the server or in a secrets manager. They never go in this repository, in content files, in frontend code, or in client-side environment variables (`VITE_*`, `NEXT_PUBLIC_*` and similar).
- A browser redirect or client-side "success" message is **never** proof of payment.
- Implement idempotency (one order per registration attempt; ignore duplicate webhook deliveries) and handle *failed*, *pending/authorized-not-captured* and *duplicate* payments. Reconcile daily against the Razorpay dashboard or settlements.
- Never store card, bank or UPI credentials. Razorpay handles them.
- Keep transaction records and receipts out of any public web folder, with access limited to Finance.
- Hosting: GitHub Pages cannot run this server. Options include a GIM-hosted API, an institutional cloud function, or the ERP. GIM IT decides.

**Front-end change for Option B:** add `src/payments/razorpayCheckout.ts`, which loads `checkout.razorpay.com` *only* when the user clicks the button and calls the GIM server endpoint. Then remove the refusal in `razorpayCheckoutProvider` and relax the build's "no Razorpay script" safety net. This is a deliberate, reviewed code change, not a content edit.

## 4. Information the institute must supply before activation

| # | Item | Owner |
|---|---|---|
| 1 | Decision: Option A (hosted page) or Option B (custom checkout) | Finance + IT |
| 2 | Legal name of the collecting entity as registered with the gateway | Finance |
| 3 | Approved fee schedule (categories, GST treatment, early/late rates if any) | Organisers + Finance |
| 4 | Hosted payment page URL **or** server endpoint for order creation | Finance / IT |
| 5 | Exact payment domain(s) for `allowedHosts` | IT |
| 6 | Approval reference for `approvalReference` | Approving authority |
| 7 | Approved registration and refund terms (see `REGISTRATION_TERMS_DRAFT.md`) | Organisers + Finance + Legal |
| 8 | Privacy notice covering the data collected at registration and payment | Legal / Data protection |
| 9 | Support contact for payment issues and grievance contact | Organisers |
| 10 | Receipt / tax invoice process (GSTIN on invoices, issuance timeline) | Finance |

## 5. Activation checklist (Option A)

- [ ] Items 1–10 above supplied and approved
- [ ] Test payment completed in the gateway's test mode on GIM's account and reconciled
- [ ] `REGISTRATION_TERMS_DRAFT.md` finalised and published (e.g. as a terms page) and linked from the payment panel
- [ ] Privacy notice published
- [ ] `content/registration.ts`: `registrationStatus: 'open'`, `payment.mode: 'hosted-link'`, `hostedLinkUrl`, `allowedHosts`, `approvalReference` filled
- [ ] Build log shows `Online payment ENABLED via approved hosted page`
- [ ] Live check: the button opens the approved page in a new tab, and the page shows GIM's legal name and correct amount
