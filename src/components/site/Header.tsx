import { useEffect, useState } from "react";
import { MotionToggle } from "./MotionToggle";

const links = [
  { href: "#provas", label: "Banco de Provas" },
  { href: "#horarios", label: "Horários" },
  { href: "#roadmap", label: "Roadmap" },
  { href: "#produtos", label: "Produtos" },
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
        scrolled ? "glass border-border border-b" : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <a href="#top" className="group flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="bg-neon absolute inline-flex h-full w-full animate-ping rounded-full opacity-70" />
            <span className="bg-neon relative inline-flex h-2.5 w-2.5 rounded-full" />
          </span>
          <span className="font-display text-foreground text-sm font-bold tracking-tight">
            CA<span className="neon-text">-ADS</span>
            <span className="text-muted-foreground ml-2 text-[11px] font-medium">IFSP SPO</span>
          </span>
        </a>

        <ul className="hidden items-center gap-1 xl:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-muted-foreground hover:bg-secondary hover:text-foreground rounded-full px-2 py-2 text-[12px] transition-colors duration-300"
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
            className="border-border bg-secondary/60 text-foreground hover:border-neon hidden rounded-full border px-4 py-2 text-[13px] font-medium transition-all duration-300 hover:shadow-[var(--shadow-neon)] sm:inline-flex"
          >
            Entrar no grupo
          </a>
          <button
            type="button"
            aria-label="Abrir menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="border-border text-foreground flex h-9 w-9 items-center justify-center rounded-full border xl:hidden"
          >
            <span className="flex flex-col gap-1">
              <span className="block h-px w-4 bg-current" />
              <span className="block h-px w-4 bg-current" />
            </span>
          </button>
        </div>
      </nav>

      {open && (
        <ul className="glass border-border flex flex-col gap-1 border-t px-5 py-3 xl:hidden">
          <li className="px-3 py-2">
            <MotionToggle />
          </li>
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:bg-secondary hover:text-foreground block rounded-lg px-3 py-2 text-sm transition-colors"
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
