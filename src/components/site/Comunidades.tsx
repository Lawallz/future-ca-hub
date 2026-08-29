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
];

const grupos = [
  "Algoritmos e Lógica",
  "Estrutura de Dados",
  "Banco de Dados I e II",
  "Engenharia de Software 1",
  "Engenharia de Software 2",
  "Desenvolvimento Web",
  "Redes de Computadores",
  "Dispositivos Móveis",
  "TCC e Orientações",
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

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {canais.map((c) => (
            <a
              key={c.titulo}
              data-reveal
              href={c.href}
              target="_blank"
              rel="noreferrer noopener"
              className="glass lift group rounded-3xl p-6"
            >
              <span className="rounded-full border border-border px-3 py-1 text-[11px] text-muted-foreground">
                {c.tag}
              </span>
              <h3 className="mt-5 text-lg font-semibold text-foreground">{c.titulo}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-neon-soft">
                Entrar
                <span className="transition-transform duration-500 ease-[var(--ease-fluid)] group-hover:translate-x-1">
                  →
                </span>
              </span>
            </a>
          ))}
        </div>

        <div data-reveal className="glass mt-6 rounded-3xl p-6">
          <h3 className="text-sm font-semibold text-foreground">Grupos por matéria</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {grupos.map((g) => (
              <a
                key={g}
                href="https://chat.whatsapp.com/"
                target="_blank"
                rel="noreferrer noopener"
                className="rounded-full border border-border bg-secondary/40 px-4 py-2 text-[13px] text-muted-foreground transition-all duration-400 ease-[var(--ease-fluid)] hover:-translate-y-0.5 hover:border-neon hover:text-foreground"
              >
                {g}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
