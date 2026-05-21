"use client";

import { Button } from "@/components/ui/button";
import { PORTFOLIO_BASE } from "@/lib/paths";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useCallback, useState } from "react";

const fieldClass =
  "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
};

const emptyForm: FormState = {
  fullName: "",
  email: "",
  phone: "",
  topic: "",
  message: "",
};

export function ContactForm() {
  const [form, setForm] = useState<FormState>({ ...emptyForm });
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const clear = useCallback(() => {
    setForm({ ...emptyForm });
    setHoneypot("");
    setStatus("idle");
    setErrorMessage(null);
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          phone: form.phone || undefined,
          topic: form.topic || undefined,
          message: form.message,
          companyWebsite: honeypot,
        }),
      });
      const payload = (await res.json()) as {
        ok?: boolean;
        mode?: "resend" | "mailto";
        mailtoUrl?: string;
        error?: string;
      };

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(payload.error || "Something went wrong.");
        return;
      }

      if (payload.mode === "mailto" && payload.mailtoUrl) {
        window.location.href = payload.mailtoUrl;
      }

      setStatus("success");
      setForm({ ...emptyForm });
      setHoneypot("");
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please try again.");
    }
  };

  return (
    <div className="mx-auto w-full max-w-lg space-y-6">
      <div className="flex justify-start">
        <Link
          href={PORTFOLIO_BASE}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg px-2 py-1"
        >
          ← Back to portfolio
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Let&apos;s Discuss:
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Send a note with your details. If email delivery is not configured on
          this deployment, your mail app will open with a draft you can send
          manually.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="fullName" className="text-sm font-medium">
            Full name <span className="text-destructive">*</span>
          </label>
          <input
            id="fullName"
            name="fullName"
            required
            autoComplete="name"
            value={form.fullName}
            onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
            className={fieldClass}
            placeholder="Jane Doe"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email address <span className="text-destructive">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className={fieldClass}
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium">
            Phone <span className="text-muted-foreground font-normal">(optional)</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className={fieldClass}
            placeholder="+1 …"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="topic" className="text-sm font-medium">
            Topic / subject{" "}
            <span className="text-muted-foreground font-normal">(optional)</span>
          </label>
          <input
            id="topic"
            name="topic"
            value={form.topic}
            onChange={(e) => setForm((f) => ({ ...f, topic: e.target.value }))}
            className={fieldClass}
            placeholder="e.g. Collaboration, hiring, project idea"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className="text-sm font-medium">
            Message <span className="text-destructive">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            minLength={10}
            rows={6}
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            className={cn(fieldClass, "min-h-[140px] resize-y")}
            placeholder="What would you like to talk about?"
          />
        </div>

        {/* Honeypot — hidden from users */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="companyWebsite">Company website</label>
          <input
            id="companyWebsite"
            name="companyWebsite"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>

        {errorMessage ? (
          <p className="text-sm text-destructive" role="alert">
            {errorMessage}
          </p>
        ) : null}

        {status === "success" ? (
          <p className="text-sm text-muted-foreground" role="status">
            Thanks — your message was sent (or your mail app should have opened
            with a draft). You can fill the form again below anytime.
          </p>
        ) : null}

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={clear}
            disabled={status === "sending"}
          >
            Clear
          </Button>
          <Button type="submit" disabled={status === "sending"}>
            {status === "sending" ? "Sending…" : "Send"}
          </Button>
        </div>
      </form>
    </div>
  );
}
