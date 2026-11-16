import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SITE } from "@/app/lib/site";
import { End, PageHead } from "../../_components/chrome";

export const metadata: Metadata = { title: "Privacy" };

/** Copy is identical to the live /privacy page; only the markup differs. */
const LAST_UPDATED = "2 September 2026";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="nx-legal__section">
      <h2 className="nx-h3">{title}</h2>
      <div className="nx-legal__body">{children}</div>
    </section>
  );
}

function Mail() {
  return (
    <a href={`mailto:${SITE.email}`} className="nx-legal__link">
      {SITE.email}
    </a>
  );
}

export default function PrivacyPage() {
  return (
    <>
      <main className="nx-stack">
        <PageHead
          label="Privacy"
          title="Privacy policy"
          lede="What we collect when you use this site, why we collect it, and the control you have over it. Plain language, no dark patterns."
        />
        <section className="nx-band" style={{ paddingTop: 0 }}>
          <div className="nx-wrap">
            <div className="nx-legal">
              <p className="nx-label">Last updated: {LAST_UPDATED}</p>
              <Section title="Who we are">
                <p>
                  {SITE.name} is a software engineering studio operating from Nigeria. For
                  anything in this policy, contact us at <Mail />. We are the data controller
                  for the information described below.
                </p>
              </Section>

              <Section title="The contact form">
                <p>
                  When you submit an enquiry we collect your name, email address, and — if you
                  provide them — your company name, budget range, and the details of your
                  message. We use this solely to reply to you and to follow up about a possible
                  engagement. The lawful basis is your consent and our taking steps at your
                  request prior to a contract.
                </p>
                <p>
                  Submissions are delivered and stored through our email provider,{" "}
                  <strong>Zoho Mail</strong>. We keep enquiry
                  correspondence for up to 24 months so we can pick a conversation back up, then
                  delete it unless it has become part of an active client relationship. We never
                  sell your information or share it for marketing.
                </p>
              </Section>

              <Section title="Analytics and how the site is measured">
                <p>We use three tools to understand how the site performs:</p>
                <ul>
                  <li>
                    <strong>Microsoft Clarity</strong> —
                    heatmaps and anonymised session replays that show how visitors move through
                    pages. Typed input and text content are masked by default. Sets cookies and
                    processes data on Microsoft&rsquo;s infrastructure.
                  </li>
                  <li>
                    <strong>Google Analytics 4</strong> —
                    aggregate traffic, referral sources, and page performance. Sets cookies;
                    IP addresses are truncated and not stored by Google. Used to measure whether
                    our advertising reaches the right people.
                  </li>
                  <li>
                    <strong>Vercel Analytics</strong> —
                    privacy-friendly, cookieless page-view and performance metrics. No
                    individual is identified.
                  </li>
                </ul>
                <p>
                  This data tells us what to improve; it is not used to build advertising
                  profiles of you. If we later run campaigns targeting the European Economic
                  Area or the UK, we will add a consent banner before any non-essential cookies
                  are set for visitors in those regions.
                </p>
              </Section>

              <Section title="Hosting and infrastructure">
                <p>
                  The site is hosted on <strong>Vercel</strong>.
                  Like any web host, Vercel processes technical request data — including IP
                  address and browser type — in server logs to deliver the site securely and
                  defend against abuse. This is our legitimate interest in operating the
                  service.
                </p>
              </Section>

              <Section title="International transfers">
                <p>
                  Microsoft, Google, Vercel and Zoho may process data outside Nigeria, including
                  in the United States and the European Union. Where that happens we rely on the
                  providers&rsquo; contractual safeguards and their compliance frameworks for
                  cross-border transfers.
                </p>
              </Section>

              <Section title="Your rights">
                <p>
                  Under the Nigeria Data Protection Act 2023 — and equivalent laws where they
                  apply to you — you can ask us to give you a copy of your data, correct it,
                  delete it, restrict how we use it, or object to a particular use. You can also
                  withdraw consent at any time. Email <Mail /> and we will respond within 30
                  days. You have the right to complain to the Nigeria Data Protection Commission
                  if you believe we have mishandled your data.
                </p>
              </Section>

              <Section title="Cookies in short">
                <p>
                  Essential cookies keep the site working. Clarity and Google Analytics set
                  analytics cookies as described above. You can block or clear cookies in your
                  browser settings, or use your browser&rsquo;s tracking-protection features,
                  without losing access to the site.
                </p>
              </Section>

              <Section title="Changes to this policy">
                <p>
                  If we adopt new tools or change how we handle data, we will update this page
                  and move the &ldquo;last updated&rdquo; date. Material changes will be made
                  clear here.
                </p>
              </Section>
            </div>
          </div>
        </section>
      </main>
      <End ask={false} />
    </>
  );
}
