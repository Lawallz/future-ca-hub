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
    href: "https://moodle.spo.ifsp.edu.br",
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

export function Comunidades() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section id="comunidades" className="relative px-5 py-24">
      <div ref={ref} className="mx-auto max-w-6xl">
        <header className="max-w-2xl">
          <p data-reveal className="text-[12px] tracking-[0.2em] text-neon-soft uppercase">
            Central de links
          </p>
          <h2 data-reveal className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">
            Comunidades e redes do CA
          </h2>
        </header>

        {/* Canais Oficiais, Redes e Plataformas (SUAP/Moodle/Campus) */}
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {canais.map((c) => (
            <a
              key={c.titulo}
              data-reveal
              href={c.href}
              target="_blank"
              rel="noreferrer noopener"
              className="glass lift group rounded-3xl p-6 flex flex-col justify-between"
            >
              <div>
                <span className="rounded-full border border-border px-3 py-1 text-[11px] text-muted-foreground">
                  {c.tag}
                </span>
                <h3 className="mt-5 text-lg font-semibold text-foreground">{c.titulo}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-neon-soft">
                Acessar
                <span className="transition-transform duration-500 ease-[var(--ease-fluid)] group-hover:translate-x-1">
                  →
                </span>
              </span>
            </a>
          ))}
        </div>

        {/* Grupos Específicos do WhatsApp */}
        <div data-reveal className="glass mt-6 rounded-3xl p-6 sm:p-8">
          <h3 className="text-lg font-semibold text-foreground">Grupos de WhatsApp da Comunidade</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Entre nos grupos oficiais para acompanhar o dia a dia do curso, vagas e resenha.
          </p>
          
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {grupos.map((g) => (
              <a
                key={g.nome}
                href={g.href}
                target="_blank"
                rel="noreferrer noopener"
                className="group flex flex-col justify-between rounded-2xl border border-border bg-secondary/40 p-5 transition-all duration-400 ease-[var(--ease-fluid)] hover:-translate-y-0.5 hover:border-neon"
              >
                <div>
                  <h4 className="text-base font-semibold text-foreground group-hover:text-neon-soft transition-colors">
                    {g.nome}
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground">{g.desc}</p>
                </div>
                <span className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-neon-soft">
                  Entrar no grupo
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}