import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section, meta } from "@/components/site";

export const Route = createFileRoute("/curriculum")({
  head: () =>
    meta(
      "Curriculum | RoboRoots",
      "An 8-module beginner robotics, coding, and AI curriculum for Grades 6 to 9 in India.",
    ),
  component: Curriculum,
});

const MODULES: [string, string, string[]][] = [
  [
    "Introduction to Robotics",
    "What robots are, where they are used, and how robotics connects to real-world problems.",
    [
      "What is a robot?",
      "Robots in daily life",
      "How robots help humans",
      "Robots vs. regular machines",
    ],
  ],
  [
    "Parts of a Robot",
    "The basic physical components that make a robot work.",
    [
      "Motors",
      "Wheels",
      "Chassis",
      "Sensors",
      "Wires",
      "Batteries",
      "Microcontrollers",
      "Tools & safety",
    ],
  ],
  [
    "Circuits and Movement",
    "How electricity, circuits, and motors allow robots to move.",
    [
      "Power flow in a circuit",
      "How motors create movement",
      "Wheel & chassis design",
      "Troubleshooting movement",
    ],
  ],
  [
    "Sensors and Inputs",
    "How robots gather information from the world around them.",
    ["What sensors do", "Distance sensors", "Light, sound & touch", "Real-world automation"],
  ],
  [
    "Coding the Robot",
    "How code gives instructions to a robot.",
    ["Commands", "Loops", "Conditions", "Inputs & outputs", "Debugging", "Robotics logic"],
  ],
  [
    "Build Challenge",
    "Build or modify a robot to complete a simple task.",
    [
      "Testing designs",
      "Improving a build",
      "Teamwork",
      "Troubleshooting",
      "Explaining design decisions",
    ],
  ],
  [
    "AI and Automation",
    "Basic AI concepts in a simple, beginner-friendly way.",
    [
      "What AI means",
      "Voice commands",
      "Responding to inputs",
      "AI for automation",
      "Responsible technology",
    ],
  ],
  [
    "Final Showcase",
    "Present what they built, explain how it works, and reflect.",
    ["What they built", "Problem solved", "Challenges", "Improvements", "What they learned"],
  ],
];

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
