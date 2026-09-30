import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Command, Menu, Search, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { sections, siteLinks, normalizeSearch } from "@/data/site";
import { periodos } from "@/data/academics";
import { MotionToggle } from "./MotionToggle";
const searchItems = [
  ...sections.map((section) => ({ ...section, external: false })),
  ...periodos.map((period) => ({
    href: period.drive,
    label: `Materiais do ${period.n}º período`,
    description: period.disciplinas.join(" · "),
    external: true,
  })),
  { href: siteLinks.suap, label: "SUAP", description: "Sistema acadêmico do IFSP", external: true },
  {
    href: siteLinks.moodle,
    label: "Moodle",
    description: "Ambiente virtual de aprendizagem",
    external: true,
  },
];
export function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const menuButton = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);
  const results = searchItems.filter((item) =>
    normalizeSearch(`${item.label} ${item.description}`).includes(normalizeSearch(query)),
  );
  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(false);
        setSearchOpen((value) => !value);
      }
      if (event.key === "Escape" && open) {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    const outside = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", shortcut);
    document.addEventListener("pointerdown", outside);
    return () => {
      window.removeEventListener("keydown", shortcut);
      document.removeEventListener("pointerdown", outside);
    };
  }, [open]);
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length) setActive(`#${visible[0].target.id}`);
      },
      { rootMargin: "-15% 0px -60% 0px" },
    );
    sections.forEach((section) => {
      const element = document.querySelector(section.href);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);
  return (
    <header className="site-header" ref={header}>
      <div className="site-container header-inner">
        <a href="#top" className="brand" aria-label="CA ADS · início">
          <span className="brand-mark" aria-hidden="true">
            ca<span>.</span>
          </span>
          <span>
            ADS <span className="brand-campus">IFSP / SÃO PAULO</span>
          </span>
        </a>
        <nav className="desktop-nav" aria-label="Navegação principal">
          {sections.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={active === link.href ? "location" : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <Dialog
            open={searchOpen}
            onOpenChange={(value) => {
              setSearchOpen(value);
              if (!value) setQuery("");
            }}
          >
            <DialogTrigger asChild>
              <button className="search-trigger" aria-label="Buscar no portal">
                <Search size={17} />
                <span>Buscar</span>
                <kbd>
                  <Command size={11} />K
                </kbd>
              </button>
            </DialogTrigger>
            <DialogContent className="portal-search">
              <DialogTitle>O que você precisa encontrar?</DialogTitle>
              <DialogDescription>
                Busque disciplinas, materiais e atalhos do portal.
              </DialogDescription>
              <label className="search-field">
                <Search size={19} />
                <input
                  autoFocus
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Ex.: banco de dados, horários, SUAP…"
                  aria-label="Buscar recursos"
                />
              </label>
              <p className="search-count" role="status">
                {results.length} resultados
              </p>
              <div className="search-results">
                {results.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    onClick={() => setSearchOpen(false)}
                  >
                    <span>
                      <strong>{item.label}</strong>
                      <small>{item.description}</small>
                    </span>
                    <ArrowUpRight size={18} />
                    <span className="sr-only">{item.external ? "(abre em nova aba)" : ""}</span>
                  </a>
                ))}
                {!results.length && (
                  <div className="portal-empty">
                    <Search />
                    <h3>Nada por aqui ainda</h3>
                    <p>Tente uma disciplina, período ou nome de seção.</p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
          <a
            className="button button-small header-contact"
            href={siteLinks.contact}
            target="_blank"
            rel="noopener noreferrer"
          >
            Fale com o CA <ArrowUpRight size={15} />
            <span className="sr-only">(nova aba)</span>
          </a>
          <button
            className="icon-button mobile-menu-toggle"
            ref={menuButton}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-navigation" className="mobile-nav" aria-label="Navegação no celular">
          {sections.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
              <ArrowUpRight size={16} />
            </a>
          ))}
          <MotionToggle />
          <a href={siteLinks.contact} target="_blank" rel="noopener noreferrer">
            Falar com o CA ↗
          </a>
        </nav>
      )}
    </header>
  );
}
