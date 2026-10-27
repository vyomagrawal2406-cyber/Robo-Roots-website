import { createFileRoute } from "@tanstack/react-router";
import { EMAIL, PageHero, Section, meta } from "@/components/site";
import h2 from "@/assets/hero-2.jpg";

export const Route = createFileRoute("/support")({
  head: () => meta("Support the Lab — RoboRoots", "Help build a robotics learning lab for underserved students in India. Sponsor a kit, fund the lab, or join a fundraising workshop."),
  component: Support,
});

const FUNDS = ["Robotics kits", "Motors & sensors", "Microcontrollers", "Batteries & wiring", "Tools & build materials", "Student worksheets", "Curriculum material", "Lab setup", "Instructor support", "Continued sessions"];
const WAYS: [string, string][] = [
  ["Sponsor a robotics kit", "Provide one kit or a portion of a kit for student learning."],
  ["Support lab setup", "Equipment and materials for a usable robotics learning space."],
  ["Fund learning materials", "Worksheets, printed guides, practice activities, and resources."],
  ["Make a general donation", "Any amount toward RoboRoots' ongoing programs."],
  ["Host or attend a workshop", "U.S. students learn robotics while supporting students in India."],
];
const mail = (s: string) => `mailto:${EMAIL}?subject=${encodeURIComponent(s)}`;

function Support() {
  return (
    <>
      <PageHero eyebrow="Support the RoboRoots Robotics Lab" title="Help students build, code, and dream bigger.">
        <a href={mail("Donation")} className="inline-flex rounded-full bg-accent px-6 py-3 font-bold text-accent-foreground">Donate Now</a>
      </PageHero>

      <Section className="grid gap-10 md:grid-cols-2 md:items-center">
        <div className="space-y-4">
          <p className="eyebrow">Why your donation matters</p>
          <h2 className="text-3xl text-primary">A first robot shouldn't depend on whether a school has a lab.</h2>
          <p className="text-muted-foreground">Many students are curious about technology, but without kits, sensors, motors, tools, and guided instruction, robotics feels distant and intimidating. RoboRoots wants to create a small, sustainable lab where students keep practicing long after their first workshop.</p>
          <p className="text-muted-foreground">The goal is to move beyond one-time exposure — a space to build repeatedly, ask questions, test ideas, and grow confident with STEM.</p>
        </div>
        <img src={h2} alt="Students building a robot" loading="lazy" width={1600} height={912} className="rounded-2xl shadow-card" />
      </Section>

      <section className="bg-primary text-primary-foreground">
        <Section>
          <p className="eyebrow">Fundraising goal</p>
          <p className="mt-3 font-display text-5xl text-accent">₹2 lakh <span className="text-2xl text-primary-foreground">/ $2,000–$2,500</span></p>
          <p className="mt-3 max-w-2xl opacity-85">For robotics kits, lab setup, equipment, and learning materials — lab setup targeted for November/December.</p>
          <div className="mt-8 flex flex-wrap gap-2">
            {FUNDS.map((f) => <span key={f} className="rounded-full border border-primary-foreground/30 px-4 py-1.5 text-sm">{f}</span>)}
          </div>
        </Section>
      </section>

      <Section>
        <h2 className="text-3xl text-primary">How you can donate</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3 lg:grid-cols-5">
          {WAYS.map(([t, d]) => (
            <a key={t} href={mail(t)} className="group rounded-xl border border-border bg-card p-5 transition hover:-translate-y-1 hover:shadow-card">
              <h3 className="text-base group-hover:text-secondary">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </a>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={mail("Donation")} className="rounded-full bg-accent px-6 py-3 font-bold text-accent-foreground">Donate Now</a>
          <a href={mail("Sponsor a Kit")} className="rounded-full bg-secondary px-6 py-3 font-bold text-secondary-foreground">Sponsor a Kit</a>
          <a href={mail("Support the Lab")} className="rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground">Support the Lab</a>
          <a href={mail("Host a Workshop")} className="rounded-full border-2 border-primary px-6 py-3 font-bold text-primary">Host a Workshop</a>
        </div>
      </Section>

      <section className="bg-muted">
        <Section className="grid gap-8 md:grid-cols-2">
          <div>
            <p className="eyebrow">Fundraising workshops · USA</p>
            <h2 className="mt-2 text-3xl text-primary">Learn robotics. Fund a lab.</h2>
            <p className="mt-4 text-muted-foreground">Join founder Vyom Agrawal for a beginner-friendly workshop. Students learn how robots move, sense, and respond while helping raise funds for a robotics lab for underserved students in India.</p>
            <a href={mail("Fundraising workshop sign-up")} className="mt-6 inline-flex rounded-full bg-accent px-6 py-3 font-bold text-accent-foreground">Register / Donate</a>
          </div>
          <dl className="grid grid-cols-2 gap-4 rounded-2xl bg-card p-6 shadow-card">
            {[["Audience", "Grades 4–8"], ["Duration", "60–90 minutes"], ["Format", "Demo + hands-on"], ["Contribution", "Fee or optional donation"]].map(([k, v]) => (
              <div key={k}><dt className="eyebrow">{k}</dt><dd className="mt-1 font-semibold">{v}</dd></div>
            ))}
          </dl>
        </Section>
      </section>
    </>
  );
}
