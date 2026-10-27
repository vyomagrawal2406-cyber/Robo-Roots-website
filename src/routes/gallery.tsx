import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Play, X } from "lucide-react";
import { PageHero, Section, meta } from "@/components/site";
import { GALLERY, type GalleryItem } from "@/content/site";
import { embedUrl, listMedia, thumbUrl } from "@/lib/media";

export const Route = createFileRoute("/gallery")({
  head: () =>
    meta(
      "Gallery | RoboRoots",
      "Photos and videos from RoboRoots workshops in India, students building robots, and newspaper coverage.",
    ),
  component: Gallery,
});

const thumb = (item: GalleryItem) => (item.type === "image" ? item.src : thumbUrl(item.url));

function Gallery() {
  const [added, setAdded] = useState<GalleryItem[]>([]);
  const all = [...added, ...GALLERY];
  const categories = ["All", ...new Set(all.map((g) => g.category))];
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState<GalleryItem | null>(null);
  const items = filter === "All" ? all : all.filter((g) => g.category === filter);

  // Photos and videos added from /admin, newest first.
  useEffect(() => {
    listMedia()
      .then((docs) =>
        setAdded(
          docs.map((d): GalleryItem =>
            d.kind === "image"
              ? { type: "image", src: thumbUrl(d.url), cap: d.cap, category: d.category }
              : { type: "video", url: d.url, cap: d.cap, category: d.category },
          ),
        ),
      )
      .catch(console.error);
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

  return (
    <>
      <PageHero eyebrow="Workshops · Press · Milestones" title="Gallery">
        RoboRoots documents its workshops, student learning moments, and program milestones to show
        how hands-on STEM access can create curiosity and confidence.
      </PageHero>
      <Section>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${filter === c ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-border"}`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          {items.map((item) => (
            <button
              key={item.cap + thumb(item)}
              onClick={() => setOpen(item)}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted text-left sm:aspect-square"
            >
              <img
                src={thumb(item)}
                alt={item.cap}
                loading="lazy"
                className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105"
              />
              {item.type === "video" && (
                <span className="absolute inset-0 grid place-items-center">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-accent text-accent-foreground shadow-card">
                    <Play className="ml-1" />
                  </span>
                </span>
              )}
              <span className="absolute bottom-0 left-0 right-0 bg-hero-overlay p-3 text-xs font-bold text-primary-foreground sm:p-4 sm:text-sm">
                {item.cap}
              </span>
            </button>
          ))}
        </div>
        <p className="mt-8 text-sm text-muted-foreground">
          Photos are shared with permission from program partners and are used only to document
          RoboRoots' educational work. Student privacy and consent are important to us.
        </p>
      </Section>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex flex-col bg-ink/95 p-4"
          onClick={() => setOpen(null)}
          role="dialog"
          aria-modal="true"
          aria-label={open.cap}
        >
          <button
            className="ml-auto grid h-11 w-11 place-items-center text-primary-foreground"
            aria-label="Close"
            onClick={() => setOpen(null)}
          >
            <X />
          </button>
          <div
            className="flex min-h-0 flex-1 items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {open.type === "image" ? (
              <img
                src={open.src}
                alt={open.cap}
                className="max-h-full max-w-full rounded-lg object-contain"
              />
            ) : (
              <iframe
                className="aspect-video w-full max-w-4xl rounded-lg"
                src={embedUrl(open.url)}
                title={open.cap}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
          <p className="pt-3 text-center text-sm font-semibold text-primary-foreground">
            {open.cap}
          </p>
        </div>
      )}
    </>
  );
}
