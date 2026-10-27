import { createFileRoute } from "@tanstack/react-router";
import { CTAExternal, PageHero, Section, donateHref, mailto, meta } from "@/components/site";
import { GOAL_INR, PHOTOS, RAISED_INR } from "@/content/site";

export const Route = createFileRoute("/support")({
  head: () =>
    meta(
      "Support the Lab | RoboRoots",
      "Help build a robotics learning lab for underserved students in India. Sponsor a kit, fund the lab, or join a fundraising workshop.",
    ),
  component: Support,
});

const FUNDS = [
  "Robotics kits",
  "Motors and sensors",
  "Microcontrollers",
  "Batteries and wiring",
  "Tools and build materials",
  "Student worksheets",
  "Curriculum material",
  "Lab setup",
  "Instructor support",
  "Continued learning sessions",
];
const WAYS: [string, string][] = [
  ["Sponsor a robotics kit", "Help provide one kit or a portion of a kit for student learning."],
  [
    "Support lab setup",
    "Contribute toward the equipment and materials needed to create a usable robotics learning space.",
  ],
  [
    "Fund student learning materials",
    "Support worksheets, printed guides, practice activities, and classroom resources.",
  ],
  ["Make a general donation", "Contribute any amount toward RoboRoots' ongoing programs."],
  [
    "Host or attend a workshop",
    "Students in the U.S. learn robotics while supporting robotics education for students in India.",
  ],
];
const WORKSHOP: [string, string][] = [
  ["Audience", "Grades 4 to 8"],
  ["Duration", "60 to 90 minutes"],
  ["Format", "Interactive demo + hands-on activity"],
  ["Contribution", "Participation fee or optional donation"],
];
const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function Support() {
  const pct = Math.min(100, Math.round((RAISED_INR / GOAL_INR) * 100));
  return (
    <>
      <PageHero
        eyebrow="Support the RoboRoots Robotics Lab"
        title="Help build a robotics learning lab."
      >
        <p>For students ready to build, code, and dream bigger.</p>
        <div className="mt-6">
          <CTAExternal href={donateHref()}>Donate Now</CTAExternal>
        </div>
      </PageHero>

      <Section className="grid gap-10 md:grid-cols-2 md:items-center">
        <div className="space-y-4">
          <p className="eyebrow">Why your donation matters</p>
          <h2 className="text-3xl text-primary">
            A student's first experience with robotics should not depend on whether their school
            already has a lab.
          </h2>
          <p className="text-muted-foreground">
            Many students are curious about technology, but without access to kits, sensors, motors,
            tools, and guided instruction, robotics can feel distant and intimidating. RoboRoots
            wants to change that by creating a small, sustainable robotics learning lab where
            students can continue practicing long after their first workshop.
          </p>
          <p className="text-muted-foreground">
            The goal is to move beyond one-time exposure and create a space where students can build
            repeatedly, ask questions, test ideas, and grow more confident with STEM.
          </p>
        </div>
        <img
          src={PHOTOS.withStudents.src}
          alt={PHOTOS.withStudents.alt}
          loading="lazy"
          className="aspect-[3/2] w-full rounded-2xl object-cover shadow-card"
        />
      </Section>

      <section className="bg-primary text-primary-foreground">
        <Section>
          <p className="eyebrow">Fundraising goal</p>
          <p className="mt-3 font-display text-4xl text-accent md:text-5xl">
            ₹2 lakh{" "}
            <span className="block text-xl text-primary-foreground sm:inline md:text-2xl">
              / $2,000 to $2,500
            </span>
          </p>
          <p className="mt-3 max-w-2xl opacity-85">
            To support robotics kits, lab setup, equipment, and learning materials, with lab setup
            planned for November/December.
          </p>
          <div className="mt-6 max-w-xl">
            <div className="h-3 overflow-hidden rounded-full bg-primary-foreground/15">
              <div
                className="h-full rounded-full bg-secondary"
                style={{ width: `${Math.max(pct, 2)}%` }}
              />
            </div>
            <p className="mt-2 text-sm opacity-80">
              {inr(RAISED_INR)} raised of {inr(GOAL_INR)} ({pct}%)
            </p>
          </div>
          <p className="mt-8 font-bold">Your contribution helps fund:</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {FUNDS.map((f) => (
              <span
                key={f}
                className="rounded-full border border-primary-foreground/30 px-4 py-1.5 text-sm"
              >
                {f}
              </span>
            ))}
          </div>
        </Section>
      </section>

      <Section>
        <h2 className="text-3xl text-primary">How you can donate</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {WAYS.map(([t, d], k) => (
            <a
              key={t}
              href={k === 4 ? mailto("Host or attend a workshop") : donateHref(t)}
              className="group rounded-xl border border-border bg-card p-5 transition hover:-translate-y-1 hover:shadow-card"
            >
              <p className="eyebrow">Option {k + 1}</p>
              <h3 className="mt-2 text-base group-hover:text-secondary">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </a>
          ))}
        </div>
        <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
          <CTAExternal href={donateHref()}>Donate Now</CTAExternal>
          <CTAExternal href={donateHref("Sponsor a Kit")} variant="green">
            Sponsor a Kit
          </CTAExternal>
          <CTAExternal href={donateHref("Support the Lab")} variant="navy">
            Support the Lab
          </CTAExternal>
          <CTAExternal href={mailto("Host a Workshop")} variant="outline">
            Host a Workshop
          </CTAExternal>
        </div>
      </Section>

      <section className="bg-muted">
        <Section className="grid gap-8 md:grid-cols-2">
          <div>
            <p className="eyebrow">Fundraising workshops · USA</p>
            <h2 className="mt-2 text-3xl text-primary">Learn robotics. Fund a lab.</h2>
            <p className="mt-4 text-muted-foreground">
              RoboRoots will host beginner-friendly robotics workshops for younger students in the
              U.S. Join founder Vyom Agrawal to learn how robots move, sense, and respond while
              helping raise funds to build a robotics learning lab for underserved students in
              India.
            </p>
            <div className="mt-6">
              <CTAExternal href={mailto("Fundraising workshop sign-up")}>
                Register Interest
              </CTAExternal>
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-4 self-start rounded-2xl bg-card p-6 shadow-card">
            {WORKSHOP.map(([k, v]) => (
              <div key={k}>
                <dt className="eyebrow">{k}</dt>
                <dd className="mt-1 font-semibold">{v}</dd>
              </div>
            ))}
            <div className="col-span-2">
              <dt className="eyebrow">Purpose</dt>
              <dd className="mt-1 font-semibold">
                Funds support robotics education for underserved students in India
              </dd>
            </div>
          </dl>
        </Section>
      </section>
    </>
  );
}
