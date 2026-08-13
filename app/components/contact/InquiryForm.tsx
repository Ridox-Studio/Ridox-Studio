"use client";

import { useState } from "react";
import { MagneticButton } from "@/app/components/shared/MagneticButton";
import { SITE } from "@/app/lib/site";

const BUDGETS = [
  "Under $25k",
  "$25k – $75k",
  "$75k – $200k",
  "$200k+",
  "Not sure yet",
];

const fieldClass =
  "min-h-12 w-full rounded-lg border border-edge-subtle bg-surface-card px-4 py-3 text-content-primary transition-colors placeholder:text-content-tertiary focus:border-indigo-300";

const labelClass = "type-overline font-mono text-content-secondary";

/**
 * v1 has no backend, so the form composes a structured mail draft rather than
 * pretending to submit. Swap `handleSubmit` for a POST when the API exists.
 */
export function InquiryForm() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = `Project enquiry — ${data.get("company") || data.get("name")}`;
    const body = [
      `Name: ${data.get("name")}`,
      `Email: ${data.get("email")}`,
      `Company: ${data.get("company")}`,
      `Budget: ${data.get("budget")}`,
      "",
      String(data.get("message") ?? ""),
    ].join("\n");

    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-6 md:flex-row md:gap-4">
        <div className="flex flex-1 flex-col gap-2">
          <label htmlFor="name" className={labelClass}>
            Name
          </label>
          <input id="name" name="name" required autoComplete="name" className={fieldClass} />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={fieldClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-6 md:flex-row md:gap-4">
        <div className="flex flex-1 flex-col gap-2">
          <label htmlFor="company" className={labelClass}>
            Company
          </label>
          <input
            id="company"
            name="company"
            autoComplete="organization"
            className={fieldClass}
          />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <label htmlFor="budget" className={labelClass}>
            Budget range
          </label>
          <select
            id="budget"
            name="budget"
            defaultValue={BUDGETS[4]}
            className={`${fieldClass} field-select`}
          >
            {BUDGETS.map((budget) => (
              <option key={budget} value={budget} className="bg-surface-card">
                {budget}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className={labelClass}>
          What are you building?
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          placeholder="The system, the constraint you have hit, and the outcome you need."
          className={`${fieldClass} resize-y`}
        />
      </div>

      <div className="flex flex-col items-start gap-4">
        <MagneticButton type="submit" className="w-full justify-center md:w-auto">
          Start a reaction
        </MagneticButton>
        <p aria-live="polite" className="type-caption font-mono text-content-tertiary">
          {sent
            ? "Your mail client should now be open with the enquiry drafted."
            : `Submitting opens a pre-filled draft to ${SITE.email}.`}
        </p>
      </div>
    </form>
  );
}
