import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { EMAIL, PageHero, Section, meta } from "@/components/site";
import { WEB3FORMS_KEY } from "@/content/site";

export const Route = createFileRoute("/contact")({
  head: () =>
    meta(
      "Get Involved | RoboRoots",
      "Donate, partner, host a workshop, or volunteer with RoboRoots. Contact us today.",
    ),
  component: Contact,
});

const field =
  "w-full rounded-lg border border-input bg-card px-4 py-3 text-base outline-none focus:ring-2 focus:ring-ring";
const OPTIONS = ["Donate", "Partner", "Host a Workshop", "Volunteer", "Learn More"];

function Contact() {
  const [f, setF] = useState({ name: "", email: "", org: "", want: "Donate", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const subject = `RoboRoots: ${f.want}`;
    if (!WEB3FORMS_KEY) {
      const body = `Name: ${f.name}\nEmail: ${f.email}\nOrganization: ${f.org}\nI want to: ${f.want}\n\n${f.message}`;
      window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject,
          from_name: "RoboRoots website",
          name: f.name,
          email: f.email,
          organization: f.org,
          i_want_to: f.want,
          message: f.message,
        }),
      });
      const data = (await res.json()) as { success?: boolean };
      setStatus(data.success ? "sent" : "error");
      if (data.success) setF({ name: "", email: "", org: "", want: "Donate", message: "" });
    } catch {
      setStatus("error");
    }
  };
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) =>
    setF({ ...f, [k]: e.target.value });

  return (
    <>
      <PageHero eyebrow="Contact" title="Get Involved">
        Interested in supporting RoboRoots, hosting a workshop, donating equipment, partnering with
        us, or learning more about the program? We would love to hear from you.
      </PageHero>
      <Section className="grid gap-10 md:grid-cols-[1fr_1.4fr]">
        <div>
          <p className="eyebrow">Email us</p>
          <a
            href={`mailto:${EMAIL}`}
            className="mt-2 block break-all font-display text-xl text-primary hover:text-secondary sm:text-2xl"
          >
            {EMAIL}
          </a>
          <p className="mt-4 text-muted-foreground">
            For partnerships, donations, workshops, or questions.
          </p>
        </div>
        {status === "sent" ? (
          <div className="rounded-2xl bg-card p-8 text-center shadow-card">
            <p className="font-display text-2xl text-secondary">Thank you!</p>
            <p className="mt-2 text-muted-foreground">
              Your message has been sent. We will get back to you soon.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-6 font-bold text-primary underline"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="grid gap-4 rounded-2xl bg-card p-5 shadow-card sm:p-6">
            <label className="grid gap-1 text-sm font-semibold">
              Name
              <input
                required
                autoComplete="name"
                className={field}
                value={f.name}
                onChange={set("name")}
              />
            </label>
            <label className="grid gap-1 text-sm font-semibold">
              Email
              <input
                required
                type="email"
                autoComplete="email"
                className={field}
                value={f.email}
                onChange={set("email")}
              />
            </label>
            <label className="grid gap-1 text-sm font-semibold">
              Organization
              <input
                autoComplete="organization"
                className={field}
                value={f.org}
                onChange={set("org")}
              />
            </label>
            <label className="grid gap-1 text-sm font-semibold">
              I want to
              <select className={field} value={f.want} onChange={set("want")}>
                {OPTIONS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-1 text-sm font-semibold">
              Message
              <textarea
                required
                rows={5}
                className={field}
                value={f.message}
                onChange={set("message")}
              />
            </label>
            {status === "error" && (
              <p className="text-sm text-destructive">
                Something went wrong. Please email us directly at {EMAIL}.
              </p>
            )}
            <button
              disabled={status === "sending"}
              className="rounded-full bg-accent px-6 py-3 font-bold text-accent-foreground disabled:opacity-60"
            >
              {status === "sending" ? "Sending..." : "Send Message"}
            </button>
          </form>
        )}
      </Section>
    </>
  );
}
