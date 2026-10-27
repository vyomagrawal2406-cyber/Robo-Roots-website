import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section, meta } from "@/components/site";
import { UPDATES } from "@/content/site";

export const Route = createFileRoute("/updates")({
  head: () =>
    meta(
      "Updates | RoboRoots",
      "News from RoboRoots: India workshops, online sessions, curriculum, lab fundraising, and U.S. workshops.",
    ),
  component: Updates,
});

function Updates() {
  return (
    <>
      <PageHero eyebrow="Timeline" title="Updates">
        Workshops in India and the USA, online sessions, curriculum progress, and lab fundraising
        milestones.
      </PageHero>
      <Section className="max-w-3xl">
        <ol className="relative ml-2 border-l-4 border-secondary pl-6 sm:pl-8">
          {UPDATES.map((u) => (
            <li key={u.title} className="relative mb-10">
              <span className="absolute -left-[38px] top-1 h-5 w-5 rounded-full border-4 border-background bg-accent sm:-left-[46px]" />
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                  {u.category}
                </span>
                <span className="text-xs font-semibold text-muted-foreground">{u.date}</span>
              </div>
              <h2 className="mt-3 text-xl text-primary">{u.title}</h2>
              <p className="mt-2 text-muted-foreground">{u.body}</p>
            </li>
          ))}
        </ol>
      </Section>
    </>
  );
}
