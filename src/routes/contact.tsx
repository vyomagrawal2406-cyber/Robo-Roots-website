import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { EMAIL, PageHero, Section, meta } from "@/components/site";

export const Route = createFileRoute("/contact")({
  head: () => meta("Get Involved — RoboRoots", "Donate, partner, host a workshop, or volunteer with RoboRoots. Contact us today."),
  component: Contact,
});

const field = "w-full rounded-lg border border-input bg-card px-4 py-3 outline-none focus:ring-2 focus:ring-ring";

function Contact() {
  const [f, setF] = useState({ name: "", email: "", org: "", want: "Donate", message: "" });
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const body = `Name: ${f.name}\nEmail: ${f.email}\nOrganization: ${f.org}\nI want to: ${f.want}\n\n${f.message}`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(`RoboRoots — ${f.want}`)}&body=${encodeURIComponent(body)}`;
  };
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value });
  return (
    <>
      <PageHero eyebrow="Contact" title="Get Involved">
        Interested in supporting RoboRoots, hosting a workshop, donating equipment, or partnering with us? We would love to hear from you.
      </PageHero>
      <Section className="grid gap-10 md:grid-cols-[1fr_1.4fr]">
        <div>
          <p className="eyebrow">Email us</p>
          <a href={`mailto:${EMAIL}`} className="mt-2 block break-all font-display text-2xl text-primary hover:text-secondary">{EMAIL}</a>
          <p className="mt-4 text-muted-foreground">For partnerships, donations, workshops, or questions.</p>
        </div>
        <form onSubmit={submit} className="grid gap-4 rounded-2xl bg-card p-6 shadow-card">
          <input required placeholder="Name" className={field} value={f.name} onChange={set("name")} />
          <input required type="email" placeholder="Email" className={field} value={f.email} onChange={set("email")} />
          <input placeholder="Organization" className={field} value={f.org} onChange={set("org")} />
          <select className={field} value={f.want} onChange={set("want")}>
            {["Donate", "Partner", "Host a Workshop", "Volunteer", "Learn More"].map((o) => <option key={o}>{o}</option>)}
          </select>
          <textarea required rows={5} placeholder="Message" className={field} value={f.message} onChange={set("message")} />
          <button className="rounded-full bg-accent px-6 py-3 font-bold text-accent-foreground">Send Message</button>
        </form>
      </Section>
    </>
  );
}
