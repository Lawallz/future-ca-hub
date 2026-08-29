import { useEffect, useState } from "react";
import { MotionToggle } from "./MotionToggle";

const links = [
  { href: "#provas", label: "Banco de Provas" },
  { href: "#horarios", label: "Horários" },
  { href: "#comunidades", label: "Comunidades" },
  { href: "#tutoriais", label: "Tutoriais" },
  { href: "#mapa", label: "Mapa" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "glass border-b border-border" : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <a href="#top" className="group flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon opacity-70" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-neon" />
          </span>
          <span className="font-display text-sm font-bold tracking-tight text-foreground">
            CA<span className="neon-text">-ADS</span>
            <span className="ml-2 text-[11px] font-medium text-muted-foreground">IFSP SPO</span>
          </span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-full px-3 py-2 text-[13px] text-muted-foreground transition-colors duration-300 hover:bg-secondary hover:text-foreground"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <MotionToggle className="hidden lg:inline-flex" />
          <a
            href="https://chat.whatsapp.com/IZHNKdFfjiE3OaIiV5mzT4?s=cl&p=a&mlu=1"
            target="_blank"
            rel="noreferrer noopener"
            className="hidden rounded-full border border-border bg-secondary/60 px-4 py-2 text-[13px] font-medium text-foreground transition-all duration-300 hover:border-neon hover:shadow-[var(--shadow-neon)] sm:inline-flex"
          >
            Entrar no grupo
          </a>
          <button
            type="button"
            aria-label="Abrir menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground md:hidden"
          >
            <span className="flex flex-col gap-1">
              <span className="block h-px w-4 bg-current" />
              <span className="block h-px w-4 bg-current" />
            </span>
          </button>
        </div>
      </nav>

      {open && (
        <ul className="glass flex flex-col gap-1 border-t border-border px-5 py-3 md:hidden">
          <li className="px-3 py-2">
            <MotionToggle />
          </li>
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
