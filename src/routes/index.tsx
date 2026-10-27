import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { CTA, Section, meta } from "@/components/site";
import { HERO_SLIDES, PHOTOS, PRESS } from "@/content/site";

export const Route = createFileRoute("/")({
  head: () =>
    meta(
      "RoboRoots | Robotics access from the ground up",
      "A student-led initiative bringing hands-on robotics, coding, AI, and STEM learning to underserved students in India.",
    ),
  component: Home,
});

const IMPACT: [string, string][] = [
  ["5-day", "in-person robotics and AI workshop in India"],
  ["57", "students reached through hands-on sessions"],
  ["Zoom", "online support continues the learning"],
  ["8", "module curriculum in development"],
];

const MORE = [
  "Started fundraising toward a robotics mini-lab",
  "Partnered with Srijan and STEMVerse to support delivery and scale",
];

function Home() {
  const [i, setI] = useState(0);
  const touchX = useRef<number | null>(null);
  const n = HERO_SLIDES.length;
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % n), 5000);
    return () => clearInterval(t);
  }, [i, n]);
  const onTouchEnd = (x: number) => {
    if (touchX.current === null) return;
    const dx = x - touchX.current;
    if (Math.abs(dx) > 40) setI((k) => (k + (dx < 0 ? 1 : n - 1)) % n);
    touchX.current = null;
  };
  return (
    <>
      <section
        className="relative h-[85svh] min-h-[540px] overflow-hidden bg-ink text-primary-foreground"
        onTouchStart={(e) => (touchX.current = e.touches[0]?.clientX ?? null)}
        onTouchEnd={(e) => onTouchEnd(e.changedTouches[0]?.clientX ?? 0)}
      >
        {HERO_SLIDES.map((s, k) => (
          <img
            key={k}
            src={s.src}
            alt={s.cap}
            className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ${s.contain ? "object-contain object-top bg-ink p-4 pb-64 md:p-10 md:pb-72" : "object-cover"} ${k === i ? "opacity-100" : "opacity-0"}`}
          />
        ))}
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-10 sm:px-5 md:pb-16">
          <p className="eyebrow">Student-led · India and USA</p>
          <h1 className="mt-3 max-w-4xl text-4xl leading-[1.05] sm:text-5xl md:text-7xl">
            Building robotics access from the <span className="text-secondary">ground up.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base opacity-90 sm:text-lg">
            RoboRoots is a student-led initiative bringing hands-on robotics, coding, AI, and STEM
            learning to underserved students in India.
          </p>
          <div className="mt-6 grid gap-3 sm:flex sm:flex-wrap">
            <CTA to="/support">Support the Lab</CTA>
            <CTA to="/gallery" variant="green">
              See Our Work
            </CTA>
            <CTA to="/contact" variant="outline">
              Get Involved
            </CTA>
          </div>
          <div className="mt-8 flex items-center gap-3">
            {HERO_SLIDES.map((s, k) => (
              <button
                key={k}
                aria-label={s.cap}
                onClick={() => setI(k)}
                className={`h-1.5 rounded-full transition-all ${k === i ? "w-10 bg-secondary" : "w-5 bg-primary-foreground/40"}`}
              />
            ))}
            <span className="ml-2 truncate text-sm opacity-80">{HERO_SLIDES[i]?.cap}</span>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-4 text-sm sm:px-5">
          <span className="eyebrow">As seen in</span>
          {PRESS.map((p) => (
            <span key={p.outlet} className="font-semibold text-muted-foreground">
              {p.outlet}
            </span>
          ))}
        </div>
      </section>

      <Section className="grid gap-10 md:grid-cols-2 md:items-center">
        <div>
          <p className="eyebrow">About RoboRoots</p>
          <h2 className="mt-3 text-3xl text-primary md:text-4xl">
            From one workshop to a lasting initiative.
          </h2>
          <img
            src={PHOTOS.withStudents.src}
            alt={PHOTOS.withStudents.alt}
            loading="lazy"
            className="mt-6 aspect-[3/2] w-full rounded-2xl object-cover shadow-card"
          />
        </div>
        <div className="space-y-4 text-muted-foreground">
          <p>
            RoboRoots was founded by Vyom Agrawal to make robotics and AI education more accessible
            to students who may not have access to advanced STEM labs, kits, or private programs.
          </p>
          <p>
            What began as a 5-day in-person robotics workshop in India has now grown into a
            longer-term initiative involving online learning sessions, curriculum development, local
            partnerships, and fundraising for a robotics mini-lab. Vyom has continued RoboRoots
            through Zoom sessions after the India workshop, while partnerships with Srijan and
            STEMVerse support structured delivery and lab setup.
          </p>
          <CTA to="/about" variant="green">
            Read our story
          </CTA>
        </div>
      </Section>

      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-5 md:py-16">
          <p className="eyebrow">Impact snapshot</p>
          <div className="mt-8 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {IMPACT.map(([num, l]) => (
              <div key={l} className="border-l-4 border-secondary pl-4">
                <p className="font-display text-4xl text-accent md:text-5xl">{num}</p>
                <p className="mt-2 text-sm opacity-85 md:text-base">{l}</p>
              </div>
            ))}
          </div>
          <ul className="mt-10 grid gap-2 opacity-85 md:grid-cols-2">
            {MORE.map((m) => (
              <li key={m} className="flex gap-2">
                <span className="text-secondary">✓</span>
                {m}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Section className="text-center">
        <p className="mx-auto max-w-3xl font-display text-2xl text-primary md:text-3xl">
          RoboRoots is not just about teaching robotics once. It is about creating sustained access,
          confidence, and curiosity for students who deserve the chance to build.
        </p>
        <div className="mt-8">
          <CTA to="/support">Support the Lab</CTA>
        </div>
      </Section>
    </>
  );
}
