import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section, meta } from "@/components/site";

export const Route = createFileRoute("/updates")({
  head: () => meta("Updates — RoboRoots", "News from RoboRoots: India workshops, online sessions, curriculum, lab fundraising, and U.S. workshops."),
  component: Updates,
});

const UPDATES: [string, string, string][] = [
  ["U.S. Workshops", "U.S. Robotics Fundraising Workshop — Coming Soon", "A beginner robotics workshop for younger students in the U.S. Proceeds support robotics learning access for students in India."],
  ["Lab Fundraising", "Robotics Mini-Lab Fundraising Begins", "Raising funds for a mini-lab where students can keep practicing with kits, sensors, motors, and structured learning material."],
  ["Online Learning", "Online Sessions Continue", "After the India workshop, Zoom sessions reinforce concepts and maintain learning continuity."],
  ["India Workshop", "RoboRoots India Workshop Completed", "A 5-day hands-on robotics and AI workshop introduced students to components, coding logic, AI concepts, and building."],
];

function Updates() {
  return (
    <>
      <PageHero eyebrow="Timeline" title="Updates">Workshops in the USA, India, and everything in between.</PageHero>
      <Section className="max-w-3xl">
        <ol className="relative border-l-4 border-secondary pl-8">
          {UPDATES.map(([c, t, d]) => (
            <li key={t} className="relative mb-10">
              <span className="absolute -left-[46px] top-1 h-5 w-5 rounded-full border-4 border-background bg-accent" />
              <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">{c}</span>
              <h2 className="mt-3 text-xl text-primary">{t}</h2>
              <p className="mt-2 text-muted-foreground">{d}</p>
            </li>
          ))}
        </ol>
      </Section>
    </>
  );
}
