import "server-only";
import nodemailer from "nodemailer";
import { SITE } from "@/app/lib/site";
import type { InquiryFields } from "@/app/lib/contact";

/**
 * Zoho Mail SMTP transport.
 *
 * Required env (set in the Vercel project, not committed):
 *   ZOHO_SMTP_USER      — the full mailbox address, e.g. hello@ridoxstudio.com
 *   ZOHO_SMTP_PASSWORD  — an app-specific password (Zoho → Security → App passwords)
 * Optional:
 *   ZOHO_SMTP_HOST      — defaults to smtp.zoho.com (use smtp.zoho.eu / .in / .com.au
 *                         to match the region your Zoho account was created in)
 *   ZOHO_SMTP_PORT      — defaults to 465 (SSL). 587 also works (STARTTLS).
 *   CONTACT_NOTIFY_EMAIL — where the internal notification lands; defaults to
 *                          ZOHO_SMTP_USER. Set this to your personal address.
 */

const host = process.env.ZOHO_SMTP_HOST ?? "smtp.zoho.com";
const port = Number(process.env.ZOHO_SMTP_PORT ?? 465);
const user = process.env.ZOHO_SMTP_USER;
const pass = process.env.ZOHO_SMTP_PASSWORD;

export function mailerConfigured(): boolean {
  return Boolean(user && pass);
}

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!user || !pass) {
    throw new Error("Zoho SMTP credentials are not configured.");
  }
  transporter ??= nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // SSL on 465, STARTTLS otherwise
    auth: { user, pass },
  });
  return transporter;
}

/** hello@ridoxstudio.com — must be the authenticated mailbox or one of its aliases. */
const fromAddress = `${SITE.name} <${user ?? SITE.email}>`;
const notifyAddress = process.env.CONTACT_NOTIFY_EMAIL ?? user ?? SITE.email;

function plainSummary(f: InquiryFields): string {
  return [
    `Name:    ${f.name}`,
    `Email:   ${f.email}`,
    `Company: ${f.company || "—"}`,
    `Budget:  ${f.budget}`,
    "",
    f.message,
  ].join("\n");
}

/**
 * Sends two messages:
 *
 * 1. Internal notification → your inbox, with Reply-To set to the enquirer, so
 *    hitting "Reply" answers the client directly from hello@ridoxstudio.com.
 * 2. Auto-acknowledgement → the client, so they know it arrived.
 *
 * The internal mail is sent first and its failure is thrown; the acknowledgement
 * is best-effort so a bounce on the client's side never loses you the lead.
 */
export async function sendInquiryEmails(fields: InquiryFields): Promise<void> {
  const t = getTransporter();
  const who = fields.company ? `${fields.name} · ${fields.company}` : fields.name;

  await t.sendMail({
    from: fromAddress,
    to: notifyAddress,
    replyTo: `${fields.name} <${fields.email}>`,
    subject: `New enquiry — ${who}`,
    text: plainSummary(fields),
  });

  try {
    await t.sendMail({
      from: fromAddress,
      to: `${fields.name} <${fields.email}>`,
      replyTo: `${SITE.name} <${notifyAddress}>`,
      subject: `We've got your enquiry — ${SITE.name}`,
      text: [
        `Hi ${fields.name.split(" ")[0] || fields.name},`,
        "",
        "Thanks for reaching out to Ridox Studio. An engineer has your message and",
        "will reply within two working days — with a real answer, not a calendar link.",
        "",
        "For reference, here is what you sent:",
        "",
        plainSummary(fields),
        "",
        "— Ridox Studio",
        SITE.url,
      ].join("\n"),
    });
  } catch (error) {
    console.error("Acknowledgement email failed (lead still captured):", error);
  }
}
