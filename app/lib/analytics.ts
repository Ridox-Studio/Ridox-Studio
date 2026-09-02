/**
 * Client-side analytics helpers.
 *
 * The GA4 and Clarity tags are injected by <SiteAnalytics />. They attach
 * `gtag` and `clarity` to `window` once loaded; these helpers call them
 * defensively so nothing throws when a tag is blocked, still loading, or
 * absent (local dev without the env vars set).
 */

type GtagArgs =
  | [command: "event", eventName: string, params?: Record<string, unknown>]
  | [command: "js", date: Date]
  | [command: "config", targetId: string, params?: Record<string, unknown>];

declare global {
  interface Window {
    gtag?: (...args: GtagArgs) => void;
    clarity?: (method: string, ...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/** Fire a GA4 event, no-op if the tag is unavailable. */
export function trackEvent(name: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  window.gtag?.("event", name, params);
}

/**
 * A visitor completed the contact form. Reports to both tools:
 *
 * - GA4 `generate_lead` — the standard lead event. Mark it as a key event in
 *   GA4, import it into Google Ads as a conversion, and the campaign optimises
 *   toward people who actually enquire rather than people who just click.
 * - Clarity `lead` event + tag — lets you filter session recordings down to
 *   the visits that converted and watch what those people did.
 */
export function trackLead(details?: { budget?: string; hasCompany?: boolean }): void {
  if (typeof window === "undefined") return;

  window.gtag?.("event", "generate_lead", {
    // GA4 groups lead value by currency; we don't assign a monetary value here.
    currency: "USD",
    value: 0,
    budget_range: details?.budget,
  });

  window.clarity?.("event", "lead");
  if (details?.budget) window.clarity?.("set", "lead_budget", details.budget);
}
