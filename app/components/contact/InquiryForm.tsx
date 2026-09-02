"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { MagneticButton } from "@/app/components/shared/MagneticButton";
import { BUDGETS, DEFAULT_BUDGET } from "@/app/lib/contact";
import { submitInquiry, type InquiryState } from "@/app/contact/actions";
import { trackLead } from "@/app/lib/analytics";

const fieldClass =
  "min-h-12 w-full rounded-lg border border-edge-subtle bg-surface-card px-4 py-3 text-content-primary transition-colors placeholder:text-content-tertiary focus:border-indigo-300";

const labelClass = "type-overline font-mono text-content-secondary";

const INITIAL: InquiryState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <MagneticButton type="submit" disabled={pending} className="w-full justify-center md:w-auto">
      {pending ? "Sending…" : "Start a reaction"}
    </MagneticButton>
  );
}

/**
 * Submits through the `submitInquiry` Server Action. The Zoho SMTP credentials
 * live only in server-side env vars — they are never bundled or sent to the
 * browser. Fields are controlled so a validation error does not wipe the form.
 */
export function InquiryForm() {
  const [state, formAction] = useActionState(submitInquiry, INITIAL);
  const [fields, setFields] = useState({
    name: "",
    email: "",
    company: "",
    budget: DEFAULT_BUDGET as string,
    message: "",
  });
  const tracked = useRef(false);

  useEffect(() => {
    if (state.status === "success" && !tracked.current) {
      tracked.current = true;
      trackLead({ budget: state.budget, hasCompany: Boolean(fields.company) });
    }
  }, [state, fields.company]);

  const set = (key: keyof typeof fields) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => setFields((f) => ({ ...f, [key]: e.target.value }));

  if (state.status === "success") {
    return (
      <div
        aria-live="polite"
        className="flex flex-col gap-3 rounded-lg border border-edge-subtle bg-surface-card px-6 py-8"
      >
        <p className="type-overline font-mono text-amber-400">Enquiry received</p>
        <p className="type-body text-content-secondary">
          Thanks — it is in our inbox and a confirmation email is on its way to you. An
          engineer replies within two working days.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex w-full flex-col gap-6" noValidate>
      <div className="flex flex-col gap-6 md:flex-row md:gap-4">
        <div className="flex flex-1 flex-col gap-2">
          <label htmlFor="name" className={labelClass}>
            Name
          </label>
          <input
            id="name"
            name="name"
            required
            autoComplete="name"
            value={fields.name}
            onChange={set("name")}
            className={fieldClass}
          />
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
            value={fields.email}
            onChange={set("email")}
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
            value={fields.company}
            onChange={set("company")}
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
            value={fields.budget}
            onChange={set("budget")}
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
          value={fields.message}
          onChange={set("message")}
          placeholder="The system, the constraint you have hit, and the outcome you need."
          className={`${fieldClass} resize-y`}
        />
      </div>

      {/* Honeypot — visually hidden, off the tab order. Bots fill it; humans don't. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col items-start gap-4">
        <SubmitButton />
        <p
          aria-live="polite"
          className={`type-caption font-mono ${
            state.status === "error" ? "text-red-400" : "text-content-tertiary"
          }`}
        >
          {state.status === "error"
            ? state.message
            : "We reply to every enquiry within two working days."}
        </p>
      </div>
    </form>
  );
}
