import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section, meta } from "@/components/site";
import h1 from "@/assets/hero-1.jpg";
import h2 from "@/assets/hero-2.jpg";
import h3 from "@/assets/hero-3.jpg";
import news from "@/assets/news.jpg";

export const Route = createFileRoute("/gallery")({
  head: () => meta("Gallery — RoboRoots", "Photos from Srijan workshops, students building robots, and newspaper coverage of RoboRoots."),
  component: Gallery,
});

const PICS = [
  { src: h3, cap: "Group photo — Srijan workshop", span: "md:col-span-2 md:row-span-2" },
  { src: news, cap: "Newspaper clipping", span: "" },
  { src: h1, cap: "Vyom teaching at Srijan", span: "" },
  { src: h2, cap: "Students building with kits", span: "md:col-span-3" },
];

function Gallery() {
  return (
    <>
      <PageHero eyebrow="Srijan · Press · Milestones" title="Gallery">
        RoboRoots documents its workshops, student learning moments, and program milestones to show how hands-on STEM access creates curiosity and confidence.
      </PageHero>
      <Section>
        <div className="grid auto-rows-[260px] gap-4 md:grid-cols-3">
          {PICS.map((p) => (
            <figure key={p.cap} className={`group relative overflow-hidden rounded-2xl ${p.span}`}>
              <img src={p.src} alt={p.cap} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              <figcaption className="absolute bottom-0 left-0 right-0 bg-hero-overlay p-4 text-sm font-bold text-primary-foreground">{p.cap}</figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-8 text-sm text-muted-foreground">Photos are shared with permission from program partners and are used only to document RoboRoots' educational work. Student privacy and consent are important to us.</p>
      </Section>
    </>
  );
}
