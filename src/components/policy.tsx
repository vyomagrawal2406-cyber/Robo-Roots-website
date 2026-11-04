import type { ReactNode } from "react";
import { PageHero, Section } from "@/components/site";
import { POLICY_EMAIL, POLICY_UPDATED } from "@/content/site";

export function PolicyPage({
  title,
  intro,
  sections,
}: {
  title: string;
  intro: ReactNode;
  sections: [string, ReactNode][];
}) {
  return (
    <>
      <PageHero eyebrow={`Last updated ${POLICY_UPDATED}`} title={title} />
      <Section className="max-w-3xl">
        <div className="text-lg text-muted-foreground">{intro}</div>
        {sections.map(([h, body], k) => (
          <section key={h} className="mt-10">
            <h2 className="text-2xl text-primary">
              {k + 1}. {h}
            </h2>
            <div className="mt-3 grid gap-3 leading-relaxed text-foreground/85 [&_li]:ml-5 [&_li]:list-disc [&_ul]:grid [&_ul]:gap-1">
              {body}
            </div>
          </section>
        ))}
      </Section>
    </>
  );
}

export function PolicyEmail() {
  return (
    <a href={`mailto:${POLICY_EMAIL}`} className="font-semibold text-primary underline">
      {POLICY_EMAIL}
    </a>
  );
}
