/**
 * What the contact-form spam screen does with real-world input.
 *
 * Run with `npm test`. Every "blocks" case below is spam that actually
 * arrived through the form; when a new kind shows up, paste it in here as a
 * case first, then change the rules in spam.ts until it passes without
 * breaking the "lets through" cases. Those are the ones that matter most: a
 * false positive is a real client refused, and nobody tells you.
 *
 * Network-free: the rule tests call screenFields directly, and the DNS tests
 * stub the lookups, so results never depend on the machine's connection.
 */
import { afterEach, describe, it, mock } from "node:test";
import assert from "node:assert/strict";
import { promises as dns } from "node:dns";
import type { InquiryFields } from "./contact.ts";
import { screenFields, screenInquiry, type SpamVerdict } from "./spam.ts";

afterEach(() => mock.restoreAll());

/** A plausible genuine enquiry; each case overrides only what it is about. */
function enquiry(overrides: Partial<InquiryFields>): InquiryFields {
  return {
    name: "Adaeze Okafor",
    email: "adaeze@gmail.com",
    company: "",
    budget: "Not sure yet",
    message: "We need a mobile app for our deliveries. Can we talk next week?",
    ...overrides,
  };
}

function expectKind(verdict: SpamVerdict, kind: SpamVerdict["kind"], category?: string) {
  assert.equal(verdict.kind, kind, `got ${JSON.stringify(verdict)}`);
  if (category) {
    assert.ok("category" in verdict && verdict.category === category, `got ${JSON.stringify(verdict)}`);
  }
}

describe("blocks: template bots (sender told it looks automated)", () => {
  it("URL and 'Admin' in the name, typo'd gmail (received 17 Oct 2026)", () => {
    expectKind(
      screenFields(
        enquiry({
          name: "Dear http://ridoxstudio.com/fekal0911 Admin",
          email: "innarusha1105@gail.com",
          company: "Sherri Evenden",
          budget: "$5k – $15k",
          message: "To the http://ridoxstudio.com/fekal0911 Owner",
        }),
      ),
      "block",
      "bot",
    );
  });

  it("same bot from a real gmail address (received 27 Sep 2026)", () => {
    expectKind(
      screenFields(
        enquiry({
          name: "Hello http://ridoxstudio.com/fekal0911 Administrator",
          email: "innarusha1105@gmail.com",
          company: "Brayden Sayre",
          message: "Dear http://ridoxstudio.com/fekal0911 Admin",
        }),
      ),
      "block",
      "bot",
    );
  });

  it("email domain impersonating ours, 'indexing' scam (received 16 Sep 2026)", () => {
    expectKind(
      screenFields(
        enquiry({
          name: "Elizabet Goulburn",
          email: "domains@search-ridoxstudio.com",
          company: "Web Search Index",
          message:
            "Greetings\n\nInclude ridoxstudio.com in Google's Search Index so it can appear in online search results!\n\nSubmit ridoxstudio.com now:\n\nindexhelp.pro",
        }),
      ),
      "block",
      "bot",
    );
  });

  it("a website in the company field", () => {
    expectKind(screenFields(enquiry({ company: "www.cheap-seo-deals.com" })), "block", "bot");
  });

  it("our own domain as the sender", () => {
    expectKind(screenFields(enquiry({ email: "hello@ridoxstudio.com" })), "block", "bot");
  });

  it("a disposable inbox", () => {
    expectKind(screenFields(enquiry({ email: "someone@mailinator.com" })), "block", "bot");
  });
});

describe("blocks: sales pitches (sender pointed at the inbox for pitches)", () => {
  it("greets our domain instead of a person, then pitches (received 25 Sep 2026)", () => {
    expectKind(
      screenFields(
        enquiry({
          name: "Maverick mkt",
          email: "maverick.bartlett84@gmail.com",
          company: "Information Technology",
          message:
            "Hi ridoxstudio.com,\n\nDo you have any plans to update, revamp, or improve your website soon?\n\nOur team provides a range of digital services, including Website Design & Development and SEO.\n\nIf you're interested, I can share some of our recent work along with a few pricing options based on your requirements.\n\nWould you like me to send you some examples and a brief proposal?",
        }),
      ),
      "block",
      "pitch",
    );
  });

  it("three or more pitch phrases, even without greeting the domain", () => {
    expectKind(
      screenFields(
        enquiry({
          name: "Sam Lee",
          message:
            "Hello, our agency offers web design. Would you like me to send samples? We have great pricing options.",
        }),
      ),
      "block",
      "pitch",
    );
  });
});

describe("blocks silently (fake success, nothing sent)", () => {
  it("submitted under 3 seconds after the form appeared", async () => {
    expectKind(await screenInquiry(enquiry({}), { elapsedMs: 800 }), "block", "silent");
  });
});

describe("asks the sender to fix something (a human may have slipped)", () => {
  it("a mistyped email domain, suggesting the fix", () => {
    const verdict = screenFields(enquiry({ email: "adaeze@gail.com" }));
    expectKind(verdict, "error");
    assert.match((verdict as { message: string }).message, /did you mean @gmail\.com\?/);
  });

  it("digits in the name", () => {
    expectKind(screenFields(enquiry({ name: "John123" })), "error");
  });

  it("more than five words in the name", () => {
    expectKind(screenFields(enquiry({ name: "Best Web Design Company In Lagos" })), "error");
  });
});

describe("flags for review (delivered as [Review], no auto-reply)", () => {
  it("a single pitch phrase", () => {
    expectKind(
      screenFields(enquiry({ message: "We can help you generate more leads. Interested in a quick chat?" })),
      "flag",
    );
  });

  it("links to two or more other sites, even from a real client", () => {
    // Worth knowing: a genuine brief with reference links lands here. It is
    // still delivered, just tagged, so check the [Review] label.
    expectKind(
      screenFields(
        enquiry({ message: "Our current site is acme-foods.com and we like how stripe.com explains pricing." }),
      ),
      "flag",
    );
  });
});

describe("lets through: genuine enquiries", () => {
  it("a client asking for SEO and an app (service names alone are not a pitch)", () => {
    expectKind(
      screenFields(
        enquiry({
          company: "Lagos Foods",
          budget: "$15k – $50k",
          message:
            "Hi Ridox Studio, we need a mobile app for deliveries and help with SEO on our current site. Can we talk next week?",
        }),
      ),
      "ok",
    );
  });

  it("a name typed in lowercase", () => {
    expectKind(
      screenFields(
        enquiry({
          name: "tunde bakare",
          email: "tunde@outlook.com",
          message: "Looking for someone to rebuild our school portal, similar to RISMS. What would that cost?",
        }),
      ),
      "ok",
    );
  });

  it("accents, apostrophes and hyphens in a name", () => {
    expectKind(screenFields(enquiry({ name: "Seán O'Brien-Smith" })), "ok");
  });

  it("one link to their own site", () => {
    expectKind(
      screenFields(enquiry({ message: "Our store is at kemi-ventures.com and checkout keeps failing on mobile." })),
      "ok",
    );
  });

  it("no timing data (JavaScript off) is not held against them", async () => {
    mock.method(dns, "resolveMx", async () => [{ exchange: "mx.example.com", priority: 10 }]);
    expectKind(await screenInquiry(enquiry({}), { elapsedMs: null }), "ok");
  });
});

describe("email domain check (DNS stubbed)", () => {
  const dnsError = (code: string) => Object.assign(new Error(code), { code });

  it("asks for a fix when the domain does not exist", async () => {
    mock.method(dns, "resolveMx", async () => {
      throw dnsError("ENOTFOUND");
    });
    const verdict = await screenInquiry(enquiry({ email: "a@no-such-domain-zz9.com" }), { elapsedMs: 20_000 });
    expectKind(verdict, "error");
    assert.match((verdict as { message: string }).message, /can't receive email/);
  });

  it("asks for a fix when the domain publishes a null MX (accepts no mail)", async () => {
    mock.method(dns, "resolveMx", async () => [{ exchange: ".", priority: 0 }]);
    expectKind(await screenInquiry(enquiry({}), { elapsedMs: 20_000 }), "error");
  });

  it("accepts a domain with no MX but an A record (RFC 5321 fallback)", async () => {
    mock.method(dns, "resolveMx", async () => {
      throw dnsError("ENODATA");
    });
    mock.method(dns, "resolve4", async () => ["203.0.113.7"]);
    expectKind(await screenInquiry(enquiry({}), { elapsedMs: 20_000 }), "ok");
  });

  it("does not punish the sender when our own DNS lookup fails", async () => {
    mock.method(dns, "resolveMx", async () => {
      throw dnsError("ETIMEOUT");
    });
    expectKind(await screenInquiry(enquiry({}), { elapsedMs: 20_000 }), "ok");
  });
});
