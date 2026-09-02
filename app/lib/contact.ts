/** Shared contact-form contract — used by the client form and the API route. */

export const BUDGETS = [
  "Under $1k",
  "$1k – $5k",
  "$5k – $15k",
  "$15k – $50k",
  "$50k+",
  "Not sure yet",
] as const;

export type Budget = (typeof BUDGETS)[number];

export const DEFAULT_BUDGET: Budget = "Not sure yet";

export interface InquiryPayload {
  name: string;
  email: string;
  company: string;
  budget: string;
  message: string;
  /** Honeypot — real users leave this empty; bots fill every field. */
  website: string;
}

export interface InquiryFields {
  name: string;
  email: string;
  company: string;
  budget: string;
  message: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate and normalise a raw payload. Returns the clean fields, or a list of
 * human-readable errors. `spam: true` means it looked automated — the caller
 * should return a success response without sending anything.
 */
export function parseInquiry(
  raw: unknown,
): { ok: true; fields: InquiryFields } | { ok: false; errors: string[]; spam?: boolean } {
  if (typeof raw !== "object" || raw === null) {
    return { ok: false, errors: ["Malformed request."] };
  }

  const body = raw as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

  if (str(body.website)) return { ok: false, errors: [], spam: true };

  const name = str(body.name);
  const email = str(body.email).toLowerCase();
  const company = str(body.company);
  const budget = str(body.budget) || DEFAULT_BUDGET;
  const message = str(body.message);

  const errors: string[] = [];
  if (name.length < 2 || name.length > 120) errors.push("Enter your name.");
  if (!EMAIL_RE.test(email) || email.length > 200) errors.push("Enter a valid email address.");
  if (company.length > 160) errors.push("Company name is too long.");
  if (message.length < 10) errors.push("Tell us a little more about the project.");
  if (message.length > 5000) errors.push("Message is too long.");
  if (!BUDGETS.includes(budget as Budget)) errors.push("Choose a budget range.");

  if (errors.length) return { ok: false, errors };
  return { ok: true, fields: { name, email, company, budget, message } };
}
