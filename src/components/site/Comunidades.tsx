import { useReveal } from "@/lib/gsap-reveal";

const canais = [
  {
    titulo: "WhatsApp oficial do CA",
    desc: "Avisos, eventos e suporte direto com a gestão do Centro Acadêmico.",
    tag: "Comunidade",
    href: "https://wa.me/5511989255690",
  },
  {
    titulo: "Instagram @caat.ifspo",
    desc: "Cobertura de eventos, editais, calendário acadêmico e memes do curso.",
    tag: "Instagram",
    href: "https://www.instagram.com/caat.ifspo/",
  },
  {
    titulo: "Renegados De ADS",
    desc: "Grupo de acolhimento para quem está começando o 1º período de ADS.",
    tag: "WhatsApp",
    href: "https://chat.whatsapp.com/IZHNKdFfjiE3OaIiV5mzT4?s=cl&p=a&mlu=1",
  },
  {
    titulo: "Portal SUAP",
    desc: "Sistema acadêmico oficial para notas, faltas, requerimentos e documentos.",
    tag: "Institucional",
    href: "https://suap.ifsp.edu.br",
  },
  {
    titulo: "Ambiente Moodle",
    desc: "Plataforma de ensino à distância para entrega de tarefas e materiais das aulas.",
    tag: "Ensino",
    href: "https://eadcampus.spo.ifsp.edu.br/",
  },
  {
    titulo: "IFSP Campus São Paulo",
    desc: "Site oficial do campus com notícias, editais, horários e portarias.",
    tag: "Institucional",
    href: "https://spo.ifsp.edu.br",
  },
];

const grupos = [
  {
    nome: "Atlética e Geralzão (Principal)",
    desc: "O grupo mais utilizado para avisos gerais, resenha e esportes da atlética.",
    href: "https://chat.whatsapp.com/ESo4bN5nwzUImFRztVQIB1?mode=gi_t",
  },
  {
    nome: "Vendas do CA",
    desc: "Fique por dentro de rifas, moletons, canecas e produtos oficiais da comunidade.",
    href: "https://chat.whatsapp.com/HBCEXvH1xzoIIEuGj3ZfvU",
  },
  {
    nome: "Cursos e Bootcamp",
    desc: "Divulgação de cursos gratuitos, palestras, bootcamps e oportunidades de tecnologia.",
    href: "https://chat.whatsapp.com/D1gjhFNRvzrFrc19N9AtY0",
  },
  {
    nome: "Estágios ADS",
    desc: "Compartilhamento de vagas de estágio, processos seletivos e dicas de mercado.",
    href: "https://chat.whatsapp.com/EaIdMOhi8Qw8vL7YpCagCp",
  },
];

const communityActions = ["Falar com o CA", "Ver o Instagram", "Entrar no grupo"];
const campusActions = ["Abrir o SUAP", "Abrir o Moodle", "Ver o site do campus"];
const linkSections = [
  { title: "Falar com a turma", links: canais.slice(0, 3), actions: communityActions },
  { title: "Sistemas do campus", links: canais.slice(3), actions: campusActions },
];

export function Comunidades() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section className="relative px-5 py-20">
      <div ref={ref} className="mx-auto max-w-6xl">
        <header className="max-w-2xl">
          <p data-reveal className="text-neon-soft text-xs tracking-wide uppercase">
            Central de links
          </p>
          <h2 data-reveal className="text-foreground mt-3 text-3xl font-bold sm:text-4xl">
            Encontre sua turma e fale com o CA
          </h2>
        </header>
        <div className="mt-10 grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          {linkSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-foreground text-xl font-semibold">{section.title}</h3>
              <ul className="mt-5 divide-y divide-border border-y border-border">
                {section.links.map((c, i) => (
                  <li key={c.href}>
                    <a
                      href={c.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block py-5 focus-visible:outline-2 focus-visible:outline-offset-4"
                    >
                      <h4 className="text-foreground font-semibold">{c.titulo}</h4>
                      <p className="text-muted-foreground mt-2 text-sm">{c.desc}</p>
                      <span className="ca-link text-neon-soft mt-2 text-sm">
                        {section.actions[i]} →
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12">
          <h3 className="text-foreground text-xl font-semibold">Grupos de WhatsApp</h3>
          <p className="text-muted-foreground mt-2 text-sm">
            Vagas, cursos, produtos do CA e resenha com a turma.
          </p>
          <ul className="mt-6 grid gap-x-10 sm:grid-cols-2">
            {grupos.map((g) => (
              <li key={g.href} className="border-t border-border">
                <a
                  href={g.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block py-5 focus-visible:outline-2 focus-visible:outline-offset-4"
                >
                  <h4 className="text-foreground font-semibold">{g.nome}</h4>
                  <p className="text-muted-foreground mt-2 text-sm">{g.desc}</p>
                  <span className="ca-link text-neon-soft mt-2 text-sm">Entrar no grupo →</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
