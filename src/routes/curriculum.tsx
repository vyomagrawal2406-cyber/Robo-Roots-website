import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section, meta } from "@/components/site";
import { MODULES } from "@/content/site";

export const Route = createFileRoute("/curriculum")({
  head: () =>
    meta(
      "Curriculum | RoboRoots",
      "An 8-module beginner robotics, coding, and AI curriculum for Grades 6 to 9 in India.",
    ),
  component: Curriculum,
});

function Curriculum() {
  return (
    <>
      <PageHero eyebrow="Curriculum for Robotics India" title="Our Curriculum">
        Designed for beginners in Grades 6 to 9 with little or no prior exposure to robotics,
        coding, or AI. The goal is to make robotics simple, hands-on, and confidence-building,
        developed with input from RoboRoots, STEMVerse, and on-ground partners so it can be
        delivered in a structured and repeatable way.
      </PageHero>
      <Section>
        <div className="grid gap-5 md:grid-cols-2">
          {MODULES.map(([t, d, items], k) => (
            <article key={t} className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <div className="flex items-baseline gap-3">
                <span className="font-display text-4xl text-secondary">
                  {String(k + 1).padStart(2, "0")}
                </span>
                <h2 className="text-xl text-primary">{t}</h2>
              </div>
              <p className="mt-3 text-muted-foreground">{d}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {items.map((i) => (
                  <span key={i} className="rounded-full bg-muted px-3 py-1 text-xs font-semibold">
                    {i}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </Section>
      <section className="bg-secondary text-secondary-foreground">
        <Section className="text-center">
          <p className="eyebrow !text-ink">Curriculum promise</p>
          <p className="mt-3 font-display text-3xl md:text-4xl">
            Simple enough to start. Structured enough to scale. Practical enough to matter.
          </p>
        </Section>
      </section>
    </>
  );
}
