import { DATA } from "@/data/resume";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const contactSchema = z.object({
  fullName: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(40).optional(),
  topic: z.string().trim().max(200).optional(),
  message: z.string().trim().min(10).max(8000),
  /** Honeypot — must stay empty (bots often fill hidden fields). */
  companyWebsite: z.string().optional(),
});

function buildMailto(payload: {
  to: string;
  fullName: string;
  email: string;
  phone?: string;
  topic?: string;
  message: string;
}) {
  const subject = payload.topic?.trim()
    ? `Let's discuss: ${payload.topic.trim()}`
    : `Let's discuss — ${payload.fullName}`;
  const bodyLines = [
    `From: ${payload.fullName}`,
    `Email: ${payload.email}`,
    payload.phone?.trim() ? `Phone: ${payload.phone.trim()}` : null,
    "",
    payload.message.trim(),
  ].filter(Boolean);
  let body = bodyLines.join("\n");
  const max = 1600;
  if (body.length > max) {
    body = `${body.slice(0, max)}\n\n[Message truncated for email client limits — please reply for full text.]`;
  }
  const q = (s: string) => encodeURIComponent(s);
  return `mailto:${payload.to}?subject=${q(subject)}&body=${q(body)}`;
}

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form fields.", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;
  if (data.companyWebsite?.trim()) {
    return NextResponse.json({ ok: true });
  }

  const to = process.env.CONTACT_TO_EMAIL?.trim() || DATA.contact.email;
  const from =
    process.env.RESEND_FROM?.trim() ||
    "Portfolio contact <onboarding@resend.dev>";

  const textBody = [
    `Name: ${data.fullName}`,
    `Email: ${data.email}`,
    data.phone?.trim() ? `Phone: ${data.phone.trim()}` : null,
    data.topic?.trim() ? `Topic: ${data.topic.trim()}` : null,
    "",
    data.message.trim(),
  ]
    .filter(Boolean)
    .join("\n");

  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (apiKey) {
    try {
      const resend = new Resend(apiKey);
      const { error } = await resend.emails.send({
        from,
        to: [to],
        replyTo: data.email,
        subject: data.topic?.trim()
          ? `Portfolio: ${data.topic.trim()} (${data.fullName})`
          : `Portfolio message from ${data.fullName}`,
        text: textBody,
      });
      if (error) {
        console.error("[contact] Resend error:", error);
        return NextResponse.json(
          { error: "Could not send email right now. Please try again later." },
          { status: 502 },
        );
      }
      return NextResponse.json({ ok: true, mode: "resend" as const });
    } catch (e) {
      console.error("[contact] Resend exception:", e);
      return NextResponse.json(
        { error: "Could not send email right now. Please try again later." },
        { status: 502 },
      );
    }
  }

  return NextResponse.json({
    ok: true,
    mode: "mailto" as const,
    mailtoUrl: buildMailto({
      to,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      topic: data.topic,
      message: data.message,
    }),
  });
}
