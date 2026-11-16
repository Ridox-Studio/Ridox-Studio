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
    <button type="submit" disabled={pending} className="nx-btn">
      {pending ? "Sending" : "Send enquiry"}
      {!pending && <ArrowRight size={16} aria-hidden="true" />}
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
      <div aria-live="polite" className="nx-form__done">
        <span className="nx-label nx-label--fg">
          <span className="nx-slash">/</span> Enquiry received
        </span>
        <p className="nx-statement">Thanks, it is in our inbox.</p>
        <p className="nx-body">An engineer replies within two working days.</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="nx-form" noValidate>
      <div className="nx-form__pair">
        <div className="nx-field">
          <label htmlFor="name" className="nx-label">
            Name
          </label>
          <input
            id="name"
            name="name"
            required
            autoComplete="name"
            value={fields.name}
            onChange={set("name")}
            className="nx-input"
          />
        </div>
        <div className="nx-field">
          <label htmlFor="email" className="nx-label">
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
            className="nx-input"
          />
        </div>
      </div>

      <div className="nx-form__pair">
        <div className="nx-field">
          <label htmlFor="company" className="nx-label">
            Company
          </label>
          <input
            id="company"
            name="company"
            autoComplete="organization"
            value={fields.company}
            onChange={set("company")}
            className="nx-input"
          />
        </div>
        <div className="nx-field">
          <label htmlFor="budget" className="nx-label">
            Budget range
          </label>
          <select
            id="budget"
            name="budget"
            value={fields.budget}
            onChange={set("budget")}
            className="nx-input nx-input--select"
          >
            {BUDGETS.map((budget) => (
              <option key={budget} value={budget}>
                {budget}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="nx-field">
        <label htmlFor="message" className="nx-label">
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
          className="nx-input nx-input--area"
        />
      </div>

      {/* Honeypot: visually hidden, off the tab order. Bots fill it; people do not. */}
      <div aria-hidden="true" className="nx-form__trap">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input ref={startedAt} type="hidden" name="startedAt" defaultValue="" />

      <div className="nx-form__foot">
        <SubmitButton />
        <p
          aria-live="polite"
          className={state.status === "error" ? "nx-body nx-form__error" : "nx-body"}
        >
          {state.status === "error"
            ? state.message
            : "We reply to every enquiry within two working days."}
        </p>
      </div>
    </form>
  );
}
