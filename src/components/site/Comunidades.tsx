import {
  ArrowUpRight,
  HeartHandshake,
  Instagram,
  MessageCircle,
  MessagesSquare,
} from "lucide-react";
import { siteLinks } from "@/data/site";
const channels = [
  {
    title: "Fale com o CA",
    description: "Uma dúvida, uma ideia ou algo que precisa mudar? A conversa começa aqui.",
    tag: "ATENDIMENTO",
    href: siteLinks.contact,
    icon: HeartHandshake,
    color: "lime",
    action: "Chamar no WhatsApp",
  },
  {
    title: "Acompanhe de perto",
    description: "Eventos, avisos e a vida no campus pelo olhar de quem também está aqui.",
    tag: "@CAAT.IFSPO",
    href: siteLinks.instagram,
    icon: Instagram,
    color: "violet",
    action: "Abrir Instagram",
  },
  {
    title: "Encontre sua turma",
    description:
      "Renegados de ADS: um espaço para trocar experiências e se conectar com outros estudantes.",
    tag: "COMUNIDADE",
    href: siteLinks.community,
    icon: MessagesSquare,
    color: "blue",
    action: "Conhecer o grupo",
  },
];
export function Comunidades() {
  return (
    <section id="comunidades" className="portal-section">
      <div className="site-container">
        <header className="section-heading">
          <div>
            <p className="eyebrow">03 / NINGUÉM SE FORMA SOZINHO</p>
            <h2>
              O curso fica melhor
              <br />
              com a gente junto.
            </h2>
            <p>Troque conhecimento, participe das conversas e faça parte do Centro Acadêmico.</p>
          </div>
        </header>
        <div className="community-grid">
          {channels.map(({ title, description, tag, href, icon: Icon, color, action }) => (
            <a
              key={title}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="community-card"
            >
              <div className="community-card-top">
                <span className={`shortcut-icon ${color}`}>
                  <Icon size={24} />
                </span>
                <ArrowUpRight size={20} />
              </div>
              <span className="eyebrow">{tag}</span>
              <h3>{title}</h3>
              <p>{description}</p>
              <span className="community-action">
                {action} <ArrowUpRight size={16} />
              </span>
              <span className="sr-only">(abre em nova aba)</span>
            </a>
          ))}
        </div>
        <div className="contribution-banner">
          <MessageCircle size={30} />
          <div>
            <h3>Procurando um grupo de uma disciplina?</h3>
            <p>Peça o convite ao CA. Os links específicos ainda não foram cadastrados.</p>
          </div>
          <a
            className="button button-outline"
            href={siteLinks.contact}
            target="_blank"
            rel="noopener noreferrer"
          >
            Pedir um convite <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
