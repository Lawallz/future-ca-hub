export function Hero() {
  return (
    <section id="top" className="relative px-5 pt-32 pb-16 sm:pt-40 sm:pb-24">
      <div className="relative mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[1.4fr_0.8fr] lg:items-end">
        <div className="min-w-0 text-left">
          <p className="text-neon-soft text-xs font-semibold tracking-wide">
            Centro Acadêmico de Análise e Desenvolvimento de Sistemas
          </p>
          <h1 className="text-foreground mt-7 text-5xl leading-[1.05] font-bold sm:text-6xl lg:text-7xl">
            ADS no IFSP.
            <br />A gente se ajuda por aqui.
          </h1>
          <p className="text-muted-foreground mt-7 max-w-xl text-base leading-relaxed sm:text-lg">
            Provas pra estudar, horários pra consultar e um mapa pra achar sua sala. O CA reuniu
            aqui os atalhos do dia a dia.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#provas" className="ca-button">
              Buscar provas
            </a>
            <a href="#horarios" className="ca-link px-3">
              Consultar horários →
            </a>
          </div>
          <p className="text-muted-foreground mt-10 text-sm">
            Organizado por estudantes de ADS · IFSP São Paulo
          </p>
        </div>
        <aside className="ca-note lg:mb-6">
          <p className="text-xl font-semibold">Chegou agora em ADS?</p>
          <p className="mt-3 text-sm leading-relaxed">
            Encontre os grupos do curso e veja como acessar os sistemas.
          </p>
          <a href="#comunidades" className="ca-link mt-5">
            Encontrar minha turma →
          </a>
        </aside>
      </div>
    </section>
  );
}
