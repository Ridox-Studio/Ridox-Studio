"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { ArrowRight } from "lucide-react";
import { BUDGETS, DEFAULT_BUDGET } from "@/app/lib/contact";
import { submitInquiry, type InquiryState } from "@/app/contact/actions";
import { trackLead } from "@/app/lib/analytics";

const INITIAL: InquiryState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="nd-btn nd-btn--action">
      {pending ? "Sending…" : "Send enquiry"}
      {!pending && <ArrowRight size={18} aria-hidden="true" />}
    </button>
  );
}

/**
 * Same contract as the live form: posts to the `submitInquiry` Server Action,
 * carries the honeypot and the `startedAt` timing field the spam screen reads,
 * and fires the same analytics lead event. Only the markup is new.
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
  const startedAt = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (startedAt.current) startedAt.current.value = String(Date.now());
  }, []);

  useEffect(() => {
    if (state.status === "success" && !tracked.current) {
      tracked.current = true;
      trackLead({ budget: state.budget, hasCompany: Boolean(fields.company) });
    }
  }, [state, fields.company]);

  const set =
    (key: keyof typeof fields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setFields((f) => ({ ...f, [key]: e.target.value }));

  if (state.status === "success") {
    return (
      <div aria-live="polite" className="nd-form__done">
        <span className="nd-label nd-eyebrow">
          <span className="nd-slash" />
          Enquiry received
        </span>
        <p className="nd-h3" style={{ fontFamily: "var(--nd-font-display)" }}>
          Thanks, it is in our inbox.
        </p>
        <p className="nd-body">An engineer replies within two working days.</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="nd-form" noValidate>
      <div className="nd-form__pair">
        <div className="nd-field">
          <label htmlFor="name" className="nd-label">
            Name
          </label>
          <input
            id="name"
            name="name"
            required
            autoComplete="name"
            value={fields.name}
            onChange={set("name")}
            className="nd-input"
          />
        </div>
        <div className="nd-field">
          <label htmlFor="email" className="nd-label">
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
            className="nd-input"
          />
        </div>
      </div>

      <div className="nd-form__pair">
        <div className="nd-field">
          <label htmlFor="company" className="nd-label">
            Company
          </label>
          <input
            id="company"
            name="company"
            autoComplete="organization"
            value={fields.company}
            onChange={set("company")}
            className="nd-input"
          />
        </div>
        <div className="nd-field">
          <label htmlFor="budget" className="nd-label">
            Budget range
          </label>
          <select
            id="budget"
            name="budget"
            value={fields.budget}
            onChange={set("budget")}
            className="nd-input nd-input--select"
          >
            {BUDGETS.map((budget) => (
              <option key={budget} value={budget}>
                {budget}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="nd-field">
        <label htmlFor="message" className="nd-label">
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
          className="nd-input nd-input--area"
        />
      </div>

      {/* Honeypot: visually hidden, off the tab order. Bots fill it; people do not. */}
      <div aria-hidden="true" className="nd-form__trap">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input ref={startedAt} type="hidden" name="startedAt" defaultValue="" />

      <div className="nd-form__foot">
        <SubmitButton />
        <p
          aria-live="polite"
          className={state.status === "error" ? "nd-small nd-form__error" : "nd-small"}
        >
          {state.status === "error"
            ? state.message
            : "We reply to every enquiry within two working days."}
        </p>
      </div>
    </form>
  );
}
