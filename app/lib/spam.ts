import "server-only";
import { promises as dns } from "node:dns";
import type { InquiryFields } from "@/app/lib/contact";

/**
 * Contact-form spam screening. Runs after parseInquiry, so fields are already
 * trimmed and shape-valid.
 *
 * Three outcomes, chosen so a real lead is never silently lost:
 *   - "error" — something a human could have got wrong (a typo'd email
 *     domain, a name with digits). Shown to the sender so they can fix it.
 *   - "block" — not sent. `category` decides what the sender is told:
 *       "pitch"  — a sales email; told the form is for project enquiries
 *                  and pointed at the inbox for pitches.
 *       "bot"    — template-bot patterns; told it looks automated, with the
 *                  inbox as a way out for false positives. Never which rule.
 *       "silent" — only a script can trip it; fake success, no signal.
 *   - "flag"  — might be a pitch, might be real. Delivered with a [Review]
 *     subject tag and NO auto-acknowledgement.
 *
 * Every rule here comes from spam that actually arrived; add to the lists as
 * new patterns show up rather than reaching for a score threshold first.
 */

export type SpamVerdict =
  | { kind: "ok" }
  | { kind: "error"; message: string }
  | { kind: "block"; category: "pitch" | "bot" | "silent"; reasons: string[] }
  | { kind: "flag"; reasons: string[] };

const BRAND = "ridoxstudio";
const OWN_DOMAIN = "ridoxstudio.com";

/** Real users mistype these; bots use them deliberately to dodge bounces. */
const DOMAIN_TYPOS: Record<string, string> = {
  "gail.com": "gmail.com",
  "gmial.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gamil.com": "gmail.com",
  "gnail.com": "gmail.com",
  "gmal.com": "gmail.com",
  "gmaill.com": "gmail.com",
  "gmail.co": "gmail.com",
  "gmail.con": "gmail.com",
  "hotmial.com": "hotmail.com",
  "hotmal.com": "hotmail.com",
  "hotmail.co": "hotmail.com",
  "yahooo.com": "yahoo.com",
  "yaho.com": "yahoo.com",
  "yahoo.co": "yahoo.com",
  "outlok.com": "outlook.com",
  "outloo.com": "outlook.com",
  "iclod.com": "icloud.com",
};

/** Throwaway inboxes — nobody hiring a studio sends from these. */
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "guerrillamail.com",
  "10minutemail.com",
  "tempmail.com",
  "temp-mail.org",
  "yopmail.com",
  "trashmail.com",
  "sharklasers.com",
  "getnada.com",
  "dispostable.com",
]);

const URL_RE = /https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|io|co|site|pro|xyz|info|biz)\b/i;
/** "Dear … Admin", "Hi … Webmaster" — template bots addressing the site, not a person. */
const GREETING_START_RE = /^(dear|hi|hello|hey|greetings|attn)\b/i;
const SITE_ROLE_RE = /\b(admin|administrator|webmaster|site owner|website owner)\b/i;
/** Greeting the domain itself ("Hi ridoxstudio.com,") — a person would greet a name. */
const GREETS_DOMAIN_RE = new RegExp(
  `\\b(dear|hi|hello|hey|greetings|to the)\\s+(https?://)?(www\\.)?${BRAND}\\.com`,
  "i",
);
/** A proper name: letters, spaces, hyphens, apostrophes, dots. No digits. */
const PROPER_NAME_RE = /^[\p{L}\p{M}][\p{L}\p{M}' .-]*$/u;

/**
 * Pitch phrasing, not service names — a real client may well write "we need
 * SEO and a mobile app", but they never write "our team provides".
 */
const PITCH_PHRASES: RegExp[] = [
  /\bour (team|agency|company) (provides|offers|specializes|specialises)\b/i,
  /\bwe (provide|offer|specialize|specialise) (in )?(a range of|the following|services|website|web|seo|digital)\b/i,
  /\bdo you have any plans to (update|revamp|redesign|improve)\b/i,
  /\b(update|revamp|redesign|improve) your (website|site)\b/i,
  /\bwould you like (me|us) to send\b/i,
  /\bshare some of our (recent )?work\b/i,
  /\bpricing options\b/i,
  /\bsearch (engine )?index\b/i,
  /\bsubmit (your site|your website|https?:\/\/|www\.|[a-z0-9-]+\.com)/i,
  /\b(first page|top) of google\b/i,
  /\b(guest post|backlinks?|link building)\b/i,
  /\bgenerate more leads\b/i,
  /\b(white ?label|outsourc(e|ing) partner)\b/i,
];

/** Hosts the message links to, minus our own. */
function foreignLinks(message: string): string[] {
  const hosts = message.match(/\b(?:https?:\/\/)?(?:www\.)?([a-z0-9-]+(?:\.[a-z0-9-]+)*\.[a-z]{2,})(?:\/\S*)?/gi) ?? [];
  return hosts
    .map((h) => h.replace(/^https?:\/\//i, "").replace(/^www\./i, "").split("/")[0].toLowerCase())
    .filter((h) => h !== OWN_DOMAIN && !h.includes("@"));
}

/** Rules that need no network. Exported for testing. */
export function screenFields(f: InquiryFields): SpamVerdict {
  const domain = f.email.split("@")[1] ?? "";
  const block: string[] = [];

  // --- Unmistakably automated ------------------------------------------------
  if (URL_RE.test(f.name) || f.name.includes("@")) block.push("url-in-name");
  if (GREETING_START_RE.test(f.name) || SITE_ROLE_RE.test(f.name)) block.push("greeting-in-name");
  if (URL_RE.test(f.company)) block.push("url-in-company");
  if (domain.includes(BRAND) && domain !== OWN_DOMAIN) block.push("impersonating-domain");
  if (domain === OWN_DOMAIN) block.push("own-domain-sender");
  if (DISPOSABLE_DOMAINS.has(domain)) block.push("disposable-email");
  if (GREETS_DOMAIN_RE.test(f.message)) block.push("greets-domain");
  if (block.length) {
    // "Hi ridoxstudio.com, our team provides…" is a sales email, not a
    // template bot — give it the pitch message that points at the inbox.
    const pitchy = PITCH_PHRASES.some((re) => re.test(f.message));
    const contentOnly = block.every((r) => r === "greets-domain");
    return { kind: "block", category: contentOnly && pitchy ? "pitch" : "bot", reasons: block };
  }

  // --- Fixable by a human ----------------------------------------------------
  const suggestion = DOMAIN_TYPOS[domain];
  if (suggestion) {
    return {
      kind: "error",
      message: `Check your email address — did you mean @${suggestion}?`,
    };
  }
  if (!PROPER_NAME_RE.test(f.name) || f.name.split(/\s+/).length > 5) {
    return { kind: "error", message: "Please enter your real name." };
  }

  // --- Reads like a pitch ----------------------------------------------------
  const pitches = PITCH_PHRASES.filter((re) => re.test(f.message)).length;
  const links = foreignLinks(f.message).length;
  const reasons: string[] = [];
  if (pitches) reasons.push(`pitch-phrases:${pitches}`);
  if (links) reasons.push(`foreign-links:${links}`);

  // Three distinct pitch phrases is a sales email, not an enquiry.
  if (pitches >= 3) return { kind: "block", category: "pitch", reasons };
  if (pitches >= 1 || links >= 2) return { kind: "flag", reasons };
  return { kind: "ok" };
}

const DNS_TIMEOUT_MS = 3000;

/**
 * true  — the domain can receive mail (MX, or an A record as the RFC 5321
 *         fallback).
 * false — DNS positively says it can't.
 * null  — lookup failed or timed out; don't punish the sender for our network.
 */
async function domainAcceptsMail(domain: string): Promise<boolean | null> {
  const lookup = async () => {
    try {
      const mx = await dns.resolveMx(domain);
      if (mx.some((r) => r.exchange && r.exchange !== ".")) return true;
      return false; // Null MX (RFC 7505): explicitly accepts no mail.
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;
      if (code === "ENOTFOUND") return false;
      if (code !== "ENODATA") return null;
    }
    try {
      return (await dns.resolve4(domain)).length > 0;
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;
      return code === "ENOTFOUND" || code === "ENODATA" ? false : null;
    }
  };
  const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), DNS_TIMEOUT_MS));
  return Promise.race([lookup(), timeout]);
}

export async function screenInquiry(
  f: InquiryFields,
  { elapsedMs }: { elapsedMs: number | null },
): Promise<SpamVerdict> {
  // Nobody reads the form, types a name, email and message in under 3s.
  if (elapsedMs !== null && elapsedMs < 3000) {
    return { kind: "block", category: "silent", reasons: [`too-fast:${elapsedMs}ms`] };
  }

  const verdict = screenFields(f);
  if (verdict.kind === "block" || verdict.kind === "error") return verdict;

  const domain = f.email.split("@")[1] ?? "";
  if ((await domainAcceptsMail(domain)) === false) {
    return {
      kind: "error",
      message: `${domain} can't receive email — check the address and try again.`,
    };
  }
  return verdict;
}
