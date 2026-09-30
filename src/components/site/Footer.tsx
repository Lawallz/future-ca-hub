import { ArrowUp, ArrowUpRight } from "lucide-react";
import { sections, siteLinks } from "@/data/site";
import { MotionToggle } from "./MotionToggle";
export function Footer() {
  return (
    <footer className="portal-footer">
      <div className="site-container">
        <div className="footer-main">
          <div>
            <a href="#top" className="brand">
              <span className="brand-mark">
                ca<span>.</span>
              </span>
              <span>
                ADS<span className="brand-campus">IFSP / SÃO PAULO</span>
              </span>
            </a>
            <h2>
              A gente aprende.
              <br />A gente constrói junto.
            </h2>
            <p>
              Um ponto de encontro feito por estudantes
              <br />
              de Análise e Desenvolvimento de Sistemas.
            </p>
          </div>
          <nav aria-label="Explore o portal">
            <span className="eyebrow">EXPLORE</span>
            {sections.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <nav aria-label="Links externos">
            <span className="eyebrow">FIQUE POR PERTO</span>
            {[
              { label: "Fale com o CA", href: siteLinks.contact },
              { label: "Instagram", href: siteLinks.instagram },
              { label: "SUAP", href: siteLinks.suap },
              { label: "Moodle", href: siteLinks.moodle },
            ].map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">
                {link.label}
                <ArrowUpRight size={14} />
                <span className="sr-only">(nova aba)</span>
              </a>
            ))}
          </nav>
        </div>
        <div className="footer-bottom">
          <p>
            CA-ADS · IFSP Campus São Paulo
            <br />
            <small>
              Portal estudantil. Confirme informações acadêmicas nos canais institucionais.
            </small>
          </p>
          <MotionToggle />
          <a className="back-top" href="#top">
            Voltar ao topo
            <ArrowUp size={17} />
          </a>
        </div>
      </div>
    </footer>
  );
}
