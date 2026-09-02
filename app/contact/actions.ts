"use server";

import { headers } from "next/headers";
import { parseInquiry } from "@/app/lib/contact";
import { mailerConfigured, sendInquiryEmails } from "@/app/lib/mailer";

export type InquiryState = {
  status: "idle" | "success" | "error";
  message?: string;
  /** Echoed back on success so the client can attach it to the analytics lead event. */
  budget?: string;
};

/**
 * Best-effort per-instance rate limit. Server Action instances are short-lived
 * and not shared, so this only blunts a burst from one warm instance — enough
 * to slow a naive flood without a KV dependency. Server Actions already carry
 * a same-origin CSRF check and a per-deploy action ID, which stops the endpoint
 * being hit blind from other sites or scripts.
 */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 3;
const hits = new Map<string, number[]>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > MAX_PER_WINDOW;
}

export async function submitInquiry(
  _prev: InquiryState,
  formData: FormData,
): Promise<InquiryState> {
  const head = await headers();
  const ip =
    head.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    head.get("x-real-ip") ||
    "unknown";

  if (rateLimited(ip)) {
    return { status: "error", message: "Too many submissions. Please try again in a minute." };
  }

  const parsed = parseInquiry({
    name: formData.get("name"),
    email: formData.get("email"),
    company: formData.get("company"),
    budget: formData.get("budget"),
    message: formData.get("message"),
    website: formData.get("website"), // honeypot
  });

  if (!parsed.ok) {
    // Honeypot hit — pretend it worked so bots get no signal.
    if (parsed.spam) return { status: "success" };
    return { status: "error", message: parsed.errors.join(" ") };
  }

  if (!mailerConfigured()) {
    console.error("Contact form submitted but Zoho SMTP env vars are missing.");
    return {
      status: "error",
      message: "The form is not available right now — please email hello@ridoxstudio.com directly.",
    };
  }

  try {
    await sendInquiryEmails(parsed.fields);
  } catch (error) {
    console.error("Failed to send inquiry email:", error);
    return {
      status: "error",
      message: "Something went wrong sending your message — please email hello@ridoxstudio.com directly.",
    };
  }

  return { status: "success", budget: parsed.fields.budget };
}
