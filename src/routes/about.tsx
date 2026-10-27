import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section, meta } from "@/components/site";
import h1 from "@/assets/hero-1.jpg";

export const Route = createFileRoute("/about")({
  head: () => meta("About Us — RoboRoots", "Our mission, vision, partners, brand story, and how RoboRoots aligns with India's NEP 2020."),
  component: About,
});

const WHAT: [string, string][] = [
  ["Hands-on robotics workshops", "Students learn by building, testing, and experimenting with basic robotics concepts."],
  ["Coding and AI exposure", "How code controls machines and how AI can support commands, automation, and learning."],
  ["Online follow-up sessions", "Zoom sessions so the learning does not stop after the workshop."],
  ["Curriculum development", "A beginner-friendly curriculum for Grades 6–9 that partners can deliver consistently."],
  ["Robotics mini-lab support", "Raising funds for kits, equipment, and lab infrastructure for continued practice."],
];
const PARTNERS: [string, string][] = [
  ["Srijan Ek Soch", "Provides access to students and on-ground coordination in India, reaching students who may not otherwise have structured robotics or AI exposure."],
  ["STEMVerse", "Supports the on-ground delivery model, including instructor support, equipment guidance, and structured session delivery."],
  ["RoboRoots", "Provides the vision, curriculum direction, fundraising support, online teaching continuity, and student-led program leadership."],
];

function About() {
  return (
    <>
      <PageHero eyebrow="What we do · About us" title="Learning starts at the roots.">
        To make robotics, AI, and hands-on STEM learning accessible to underserved students.
      </PageHero>

      <Section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl bg-card p-8 shadow-card">
          <p className="eyebrow">Mission</p>
          <p className="mt-3 text-lg">To make robotics, AI, and hands-on STEM learning accessible to underserved students by providing workshops, online learning support, structured curriculum, and access to robotics equipment.</p>
        </div>
        <div className="rounded-2xl bg-primary p-8 text-primary-foreground shadow-card">
          <p className="eyebrow">Vision</p>
          <p className="mt-3 text-lg">A sustainable learning pathway where students in rural and underserved communities explore robotics, coding, AI, and problem-solving with confidence — where no child is limited by lack of kits, labs, or mentors.</p>
        </div>
      </Section>

      <Section>
        <h2 className="text-3xl text-primary">What we do</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3 lg:grid-cols-5">
          {WHAT.map(([t, d], k) => (
            <div key={t} className="rounded-xl border border-border p-5">
              <p className="font-display text-3xl text-accent">0{k + 1}</p>
              <h3 className="mt-2 text-base">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </Section>

      <section className="bg-muted">
        <Section>
          <p className="eyebrow">Partnered schools & organizations</p>
          <h2 className="mt-2 text-3xl text-primary">Built together, built to last.</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {PARTNERS.map(([t, d]) => (
              <div key={t} className="rounded-xl bg-card p-6 shadow-card">
                <h3 className="text-xl text-secondary">{t}</h3>
                <p className="mt-2 text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-3xl text-muted-foreground"><strong className="text-foreground">Partnership model:</strong> initial hands-on exposure, ongoing online support, structured curriculum, access to robotics equipment, and future opportunities to build independently.</p>
        </Section>
      </section>

      <Section className="grid gap-10 md:grid-cols-2 md:items-center">
        <img src={h1} alt="Vyom teaching students" loading="lazy" width={1600} height={912} className="rounded-2xl shadow-card" />
        <div className="space-y-4 text-muted-foreground">
          <p className="eyebrow">How it started</p>
          <h2 className="text-3xl text-primary">One workshop. Fifty-seven curious builders.</h2>
          <p>RoboRoots began when Vyom Agrawal, a high school student interested in robotics, engineering, and autonomous systems, wanted to share hands-on robotics with students who had far less access to STEM resources.</p>
          <p>In India, Vyom ran a 5-day robotics and AI workshop for students connected to Srijan. What stood out was how quickly students became curious, engaged, and excited when given the chance to build. That experience became the foundation for RoboRoots.</p>
          <p>The name reflects the idea that STEM learning should begin at the roots: with access, curiosity, and confidence.</p>
        </div>
      </Section>

      <Section>
        <blockquote className="rounded-2xl border-l-8 border-secondary bg-card p-8 shadow-card">
          <p className="text-lg">"I started RoboRoots because I believe robotics should not only be available to students who already have access to expensive kits, private programs, or advanced school labs. When students build something with their own hands, robotics becomes less intimidating and more exciting. My goal is to help students experience robotics as something practical, creative, and possible."</p>
          <footer className="mt-4 font-bold text-primary">— Vyom Agrawal, Founder, RoboRoots</footer>
        </blockquote>
      </Section>

      <section className="bg-ink text-primary-foreground">
        <Section>
          <p className="eyebrow">The NEP 2020 angle</p>
          <h2 className="mt-2 text-3xl">Policy sets the direction. Access makes it real.</h2>
          <div className="mt-6 grid gap-6 opacity-85 md:grid-cols-2">
            <p>RoboRoots is inspired by India's National Education Policy 2020, especially its emphasis on experiential learning, digital literacy, coding, computational thinking, and vocational exposure.</p>
            <p>We help bridge the gap by bringing robotics kits, STEM mentors, structured curriculum, and hands-on learning to students who may not otherwise experience them.</p>
          </div>
          <p className="mt-8 font-display text-2xl text-accent">To turn robotics from something students only hear about into something they can build, test, and understand.</p>
        </Section>
      </section>
    </>
  );
}
