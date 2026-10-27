import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { DONATE_URL, EMAIL } from "@/content/site";

export { EMAIL };

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/curriculum", label: "Curriculum" },
  { to: "/support", label: "Support the Lab" },
  { to: "/updates", label: "Updates" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
] as const;

export const mailto = (subject: string) => `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}`;

// Donation link: the configured donation page, or an email while none is set up.
export function donateHref(subject = "Donation") {
  return DONATE_URL || mailto(subject);
}

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 font-display text-xl text-primary">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-secondary">
        ⚙
      </span>
      Robo<span className="text-secondary">Roots</span>
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-5">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: true }}
              className="rounded-md px-3 py-2 text-sm font-semibold text-foreground/80 hover:text-primary"
              activeProps={{ className: "text-secondary" }}
            >
              {n.label}
            </Link>
          ))}
          <a
            href={donateHref()}
            className="ml-2 rounded-full bg-accent px-5 py-2 text-sm font-bold text-accent-foreground hover:brightness-105"
          >
            Donate
          </a>
        </nav>
        <div className="flex items-center gap-2 lg:hidden">
          <a
            href={donateHref()}
            className="rounded-full bg-accent px-4 py-2 text-sm font-bold text-accent-foreground"
          >
            Donate
          </a>
          <button
            className="grid h-10 w-10 place-items-center"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
            aria-expanded={open}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="flex h-[calc(100dvh-65px)] flex-col overflow-y-auto border-t border-border bg-background px-4 py-3 lg:hidden">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              activeOptions={{ exact: true }}
              activeProps={{ className: "text-secondary" }}
              className="border-b border-border py-4 text-lg font-semibold"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-ink text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-5 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl">
            Robo<span className="text-secondary">Roots</span>
          </p>
          <p className="mt-3 text-sm opacity-70">
            A student-led initiative bringing robotics, AI, and hands-on STEM education to
            underserved students in India through workshops, curriculum, online learning, and
            lab-building support.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className="py-1 opacity-80 hover:text-secondary">
              {n.label}
            </Link>
          ))}
        </div>
        <div className="text-sm">
          <p className="eyebrow">Get in touch</p>
          <a href={`mailto:${EMAIL}`} className="mt-2 block break-all hover:text-accent">
            {EMAIL}
          </a>
        </div>
      </div>
      <p className="border-t border-primary-foreground/10 px-4 py-4 text-center text-xs opacity-60">
        © {new Date().getFullYear()} RoboRoots. Founded by Vyom Agrawal.
      </p>
    </footer>
  );
}

export function PageHero({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-secondary/30 blur-3xl" />
      <div className="relative mx-auto max-w-5xl px-4 py-14 sm:px-5 md:py-20">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-3 text-4xl md:text-6xl">{title}</h1>
        {children && <div className="mt-5 max-w-2xl text-lg opacity-85">{children}</div>}
      </div>
    </section>
  );
}

export function Section({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`mx-auto max-w-6xl px-4 py-12 sm:px-5 md:py-16 ${className}`}>
      {children}
    </section>
  );
}

const CTA_STYLES = {
  orange: "bg-accent text-accent-foreground",
  green: "bg-secondary text-secondary-foreground",
  navy: "bg-primary text-primary-foreground",
  outline: "border-2 border-current",
};
const ctaClass = (v: keyof typeof CTA_STYLES) =>
  `inline-flex items-center justify-center rounded-full px-6 py-3 font-bold transition hover:-translate-y-0.5 ${CTA_STYLES[v]}`;

export function CTA({
  to,
  children,
  variant = "orange",
}: {
  to: "/support" | "/gallery" | "/contact" | "/about" | "/curriculum" | "/updates";
  children: ReactNode;
  variant?: keyof typeof CTA_STYLES;
}) {
  return (
    <Link to={to} className={ctaClass(variant)}>
      {children}
    </Link>
  );
}

export function CTAExternal({
  href,
  children,
  variant = "orange",
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof CTA_STYLES;
}) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      className={ctaClass(variant)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}

export function meta(title: string, description: string) {
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  };
}
