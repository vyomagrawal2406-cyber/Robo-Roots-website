import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CTA, Section, meta } from "@/components/site";
import h1 from "@/assets/hero-1.jpg";
import h2 from "@/assets/hero-2.jpg";
import h3 from "@/assets/hero-3.jpg";
import news from "@/assets/news.jpg";

export const Route = createFileRoute("/")({
  head: () => meta("RoboRoots — Robotics access from the ground up", "A student-led initiative bringing hands-on robotics, coding, AI, and STEM learning to underserved students in India."),
  component: Home,
});

const SLIDES = [
  { src: h1, cap: "Vyom teaching students at Srijan" },
  { src: h2, cap: "Students working with robotics kits" },
  { src: h3, cap: "Group photo from the 5-day India workshop" },
  { src: news, cap: "In the news" },
];

const IMPACT = [
  ["5-day", "in-person robotics & AI workshop in India"],
  ["57", "students reached through hands-on sessions"],
  ["Zoom", "online support continues the learning"],
  ["8", "module curriculum in development"],
];

function Home() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);
  return (
    <>
      <section className="relative h-[88vh] min-h-[560px] overflow-hidden bg-ink text-primary-foreground">
        {SLIDES.map((s, k) => (
          <img key={k} src={s.src} alt={s.cap} width={1600} height={912} className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${k === i ? "opacity-100" : "opacity-0"}`} />
        ))}
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-16">
          <p className="eyebrow">Student-led · India & USA</p>
          <h1 className="mt-3 max-w-4xl text-5xl leading-[1.02] md:text-7xl">Building robotics access from the <span className="text-secondary">ground up.</span></h1>
          <p className="mt-5 max-w-2xl text-lg opacity-90">RoboRoots is a student-led initiative bringing hands-on robotics, coding, AI, and STEM learning to underserved students in India.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <CTA to="/support">Support the Lab</CTA>
            <CTA to="/gallery" variant="green">See Our Work</CTA>
            <CTA to="/contact" variant="outline">Get Involved</CTA>
          </div>
          <div className="mt-10 flex items-center gap-3">
            {SLIDES.map((s, k) => (
              <button key={k} aria-label={s.cap} onClick={() => setI(k)} className={`h-1.5 rounded-full transition-all ${k === i ? "w-10 bg-secondary" : "w-5 bg-primary-foreground/40"}`} />
            ))}
            <span className="ml-3 text-sm opacity-80">{SLIDES[i].cap}</span>
          </div>
        </div>
      </section>

      <Section className="grid gap-10 md:grid-cols-2 md:items-center">
        <div>
          <p className="eyebrow">About RoboRoots</p>
          <h2 className="mt-3 text-4xl text-primary">From one workshop to a lasting movement.</h2>
        </div>
        <div className="space-y-4 text-muted-foreground">
          <p>RoboRoots was founded by Vyom Agrawal to make robotics and AI education more accessible to students who may not have access to advanced STEM labs, kits, or private programs.</p>
          <p>What began as a 5-day in-person robotics workshop in India has grown into a longer-term initiative involving online learning sessions, curriculum development, local partnerships with Srijan and STEMVerse, and fundraising for a robotics mini-lab.</p>
          <CTA to="/about" variant="green">Read our story</CTA>
        </div>
      </Section>

      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <p className="eyebrow">Impact snapshot</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {IMPACT.map(([n, l]) => (
              <div key={l} className="border-l-4 border-secondary pl-4">
                <p className="font-display text-5xl text-accent">{n}</p>
                <p className="mt-2 opacity-85">{l}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 opacity-80">Plus: fundraising has begun toward a robotics mini-lab, with partners Srijan and STEMVerse supporting delivery and scale.</p>
        </div>
      </section>

      <Section className="text-center">
        <p className="mx-auto max-w-3xl font-display text-2xl text-primary md:text-3xl">RoboRoots is not just about teaching robotics once. It is about creating sustained access, confidence, and curiosity for students who deserve the chance to build.</p>
        <div className="mt-8"><CTA to="/support">Support the Lab</CTA></div>
      </Section>
    </>
  );
}
