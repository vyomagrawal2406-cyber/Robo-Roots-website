import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";

export const EMAIL = "roborootsinitiative@gmail.com";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/curriculum", label: "Curriculum" },
  { to: "/support", label: "Support the Lab" },
  { to: "/updates", label: "Updates" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
] as const;

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 font-display text-xl text-primary">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-secondary">⚙</span>
      Robo<span className="text-secondary">Roots</span>
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: true }} className="rounded-md px-3 py-2 text-sm font-semibold text-foreground/80 hover:text-primary" activeProps={{ className: "text-secondary" }}>
              {n.label}
            </Link>
          ))}
          <Link to="/support" className="ml-2 rounded-full bg-accent px-5 py-2 text-sm font-bold text-accent-foreground hover:brightness-105">Donate</Link>
        </nav>
        <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">{open ? <X /> : <Menu />}</button>
      </div>
      {open && (
        <nav className="flex flex-col border-t border-border px-5 py-3 lg:hidden">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="py-2 font-semibold">{n.label}</Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-ink text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl">Robo<span className="text-secondary">Roots</span></p>
          <p className="mt-3 text-sm opacity-70">A student-led initiative bringing robotics, AI, and hands-on STEM education to underserved students in India.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {NAV.map((n) => <Link key={n.to} to={n.to} className="opacity-80 hover:text-secondary">{n.label}</Link>)}
        </div>
        <div className="text-sm">
          <p className="eyebrow">Get in touch</p>
          <a href={`mailto:${EMAIL}`} className="mt-2 block hover:text-accent">{EMAIL}</a>
        </div>
      </div>
      <p className="border-t border-primary-foreground/10 py-4 text-center text-xs opacity-60">© {new Date().getFullYear()} RoboRoots. Founded by Vyom Agrawal.</p>
    </footer>
  );
}

export function PageHero({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-secondary/30 blur-3xl" />
      <div className="relative mx-auto max-w-5xl px-5 py-20">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-3 text-4xl md:text-6xl">{title}</h1>
        {children && <div className="mt-5 max-w-2xl text-lg opacity-85">{children}</div>}
      </div>
    </section>
  );
}

export function Section({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`mx-auto max-w-6xl px-5 py-16 ${className}`}>{children}</section>;
}

export function CTA({ to, children, variant = "orange" }: { to: "/support" | "/gallery" | "/contact" | "/about" | "/curriculum"; children: ReactNode; variant?: "orange" | "green" | "outline" }) {
  const v = {
    orange: "bg-accent text-accent-foreground",
    green: "bg-secondary text-secondary-foreground",
    outline: "border-2 border-current",
  }[variant];
  return <Link to={to} className={`inline-flex items-center rounded-full px-6 py-3 font-bold transition hover:-translate-y-0.5 ${v}`}>{children}</Link>;
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
