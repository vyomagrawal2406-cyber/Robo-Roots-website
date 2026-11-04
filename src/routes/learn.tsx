import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ExternalLink, FileText, Play, X } from "lucide-react";
import { PageHero, Section, meta } from "@/components/site";
import { LESSON_MODULES } from "@/content/site";
import { listLessons, resourceEmbed, resourceLabel, type Lesson } from "@/lib/lessons";
import { embedUrl, thumbUrl } from "@/lib/media";

export const Route = createFileRoute("/learn")({
  head: () =>
    meta(
      "Learn | RoboRoots",
      "Free RoboRoots robotics video lessons with slides and notes, following our 8-module beginner curriculum.",
    ),
  component: Learn,
});

function Learn() {
  const [lessons, setLessons] = useState<Lesson[] | null>(null);
  const [open, setOpen] = useState<Lesson | null>(null);

  useEffect(() => {
    listLessons()
      .then(setLessons)
      .catch((e) => {
        console.error(e);
        setLessons([]);
      });
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const groups = LESSON_MODULES.map((m, k) => ({
    m,
    k,
    items: (lessons ?? []).filter((l) => l.module === m),
  })).filter((g) => g.items.length);

  return (
    <>
      <PageHero eyebrow="Free video lessons" title="Learn Robotics">
        Watch RoboRoots lessons at your own pace. Each lesson follows our beginner curriculum and
        comes with slides or notes you can view and download.
      </PageHero>
      <Section>
        {lessons === null && <p className="text-muted-foreground">Loading lessons...</p>}
        {lessons !== null && !groups.length && (
          <p className="text-muted-foreground">New lessons are coming soon. Check back shortly!</p>
        )}
        {groups.map(({ m, k, items }) => (
          <div key={m} className="mb-12">
            <div className="flex items-baseline gap-3">
              {k < LESSON_MODULES.length - 1 && (
                <span className="font-display text-3xl text-secondary">
                  {String(k + 1).padStart(2, "0")}
                </span>
              )}
              <h2 className="text-2xl text-primary">{m}</h2>
            </div>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setOpen(l)}
                  className="group overflow-hidden rounded-2xl border border-border bg-card text-left shadow-card transition hover:-translate-y-0.5"
                >
                  <div className="relative aspect-video bg-muted">
                    {l.video_url ? (
                      <>
                        <img
                          src={thumbUrl(l.video_url)}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                        <span className="absolute inset-0 grid place-items-center">
                          <span className="grid h-14 w-14 place-items-center rounded-full bg-accent text-accent-foreground shadow-card">
                            <Play className="ml-1" />
                          </span>
                        </span>
                      </>
                    ) : (
                      <span className="grid h-full place-items-center text-primary">
                        <FileText size={40} />
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg text-primary">{l.title}</h3>
                    {l.description && (
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {l.description}
                      </p>
                    )}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {l.video_url && <Tag>Video</Tag>}
                      {l.resource_url && (
                        <Tag>{resourceLabel(l.resource_url, l.resource_name)}</Tag>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </Section>
      {open && <LessonDialog lesson={open} onClose={() => setOpen(null)} />}
    </>
  );
}

function Tag({ children }: { children: string }) {
  return <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold">{children}</span>;
}

function LessonDialog({ lesson: l, onClose }: { lesson: Lesson; onClose: () => void }) {
  const doc = l.resource_url ? resourceEmbed(l.resource_url) : null;
  const kind = l.resource_url ? resourceLabel(l.resource_url, l.resource_name) : "";
  return (
    <div
      className="fixed inset-0 z-[60] overflow-y-auto bg-ink/95 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={l.title}
    >
      <div className="mx-auto max-w-4xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3 text-primary-foreground">
          <div>
            <p className="eyebrow">{l.module}</p>
            <h2 className="mt-1 text-2xl">{l.title}</h2>
          </div>
          <button
            className="grid h-11 w-11 shrink-0 place-items-center"
            aria-label="Close"
            onClick={onClose}
          >
            <X />
          </button>
        </div>
        {l.video_url && (
          <iframe
            className="mt-4 aspect-video w-full rounded-lg bg-black"
            src={embedUrl(l.video_url)}
            title={l.title}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        )}
        {l.description && (
          <p className="mt-4 whitespace-pre-line text-primary-foreground/85">{l.description}</p>
        )}
        {l.resource_url && (
          <div className="mt-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-lg text-primary-foreground">{kind}</h3>
              <a
                href={l.resource_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-bold text-accent-foreground"
              >
                Open / Download <ExternalLink size={16} />
              </a>
            </div>
            {doc && (
              <iframe
                className="mt-3 h-[70vh] w-full rounded-lg bg-white"
                src={doc}
                title={`${l.title} ${kind}`}
                allowFullScreen
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
