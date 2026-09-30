import {
  ArrowDown,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  MapPin,
  MessagesSquare,
  Terminal,
} from "lucide-react";
import { siteLinks } from "@/data/site";
import { PeriodPicker, useStudentPreferences } from "./StudentPreferences";
export function Hero() {
  const { period } = useStudentPreferences();
  return (
    <>
      <section id="top" className="portal-hero">
        <div className="hero-grid" aria-hidden="true" />
        <div className="site-container hero-layout">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="status-dot" /> POR ESTUDANTES. PARA ESTUDANTES.
            </p>
            <h1>
              Sua vida no campus.
              <br />
              <span>Mais conectada.</span>
            </h1>
            <p className="hero-description">
              Da primeira aula ao último projeto: materiais, horários e pessoas para caminhar com
              você em ADS.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#provas">
                Encontrar materiais <ArrowUpRight size={18} />
              </a>
              <a className="button button-outline" href="#horarios">
                <CalendarDays size={17} />
                Consultar horários
              </a>
            </div>
            <div className="hero-footnote">
              <span className="avatar-stack" aria-hidden="true">
                <span>{"{ }"}</span>
                <span>{"</>"}</span>
                <span>ca.</span>
              </span>
              <p>
                Centro Acadêmico de ADS<strong>IFSP · Campus São Paulo</strong>
              </p>
            </div>
          </div>
          <div className="student-board">
            <div className="board-top">
              <span>
                <Terminal size={17} /> SEU PONTO DE PARTIDA
              </span>
              <span className="board-dots" aria-hidden="true">
                •••
              </span>
            </div>
            <div className="board-title">
              <span className="eyebrow">MENOS ABAS ABERTAS</span>
              <h2>Mais tempo para o que importa.</h2>
              <p>Escolha seu próximo passo.</p>
            </div>
            <div className="board-shortcuts">
              {[
                {
                  href: "#provas",
                  title: "Bora estudar?",
                  description: "Materiais dos 6 períodos",
                  icon: BookOpen,
                  color: "lime",
                },
                {
                  href: "#horarios",
                  title: "Qual é a próxima?",
                  description: "Sua grade, sem complicação",
                  icon: CalendarDays,
                  color: "blue",
                },
                {
                  href: "#mapa",
                  title: "Encontre sua sala",
                  description: "Explore o mapa do campus",
                  icon: MapPin,
                  color: "violet",
                },
                {
                  href: "#comunidades",
                  title: "Você não está só",
                  description: "Conecte-se com a comunidade",
                  icon: MessagesSquare,
                  color: "peach",
                },
              ].map(({ href, title, description, icon: Icon, color }) => (
                <a key={href} href={href}>
                  <span className={`shortcut-icon ${color}`}>
                    <Icon size={21} />
                  </span>
                  <span>
                    <strong>{title}</strong>
                    <small>{description}</small>
                  </span>
                  <ArrowUpRight size={17} />
                </a>
              ))}
            </div>
            <div className="board-bottom">
              <span className="status-dot" />
              Construído em comunidade <span>ADS / IFSP</span>
            </div>
          </div>
        </div>
        <a className="hero-scroll" href="#provas">
          Explore o portal <ArrowDown size={15} />
        </a>
      </section>
      <div className="semester-strip">
        <div className="site-container semester-inner">
          <div>
            <span className="eyebrow">O PORTAL DO SEU JEITO</span>
            <h2>{period ? `Vamos de ${period}º período?` : "Em qual período você está?"}</h2>
            <p>Filtra materiais e horários. Sua escolha fica neste navegador.</p>
          </div>
          <PeriodPicker />
        </div>
      </div>
      <div className="site-container essential-links">
        <span>NA MOCHILA DIGITAL</span>
        <a href={siteLinks.suap} target="_blank" rel="noopener noreferrer">
          SUAP <ArrowUpRight size={14} />
          <span className="sr-only">(nova aba)</span>
        </a>
        <a href={siteLinks.moodle} target="_blank" rel="noopener noreferrer">
          Moodle <ArrowUpRight size={14} />
          <span className="sr-only">(nova aba)</span>
        </a>
        <a href="#tutoriais">
          Guia de sobrevivência <ArrowUpRight size={14} />
        </a>
        <a href={siteLinks.contact} target="_blank" rel="noopener noreferrer">
          Contribuir com materiais <ArrowUpRight size={14} />
          <span className="sr-only">(nova aba)</span>
        </a>
      </div>
    </>
  );
}
