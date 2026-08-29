export function Footer() {
  return (
    <footer className="relative border-t border-border px-5 py-14">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-sm font-bold text-foreground">
            CA<span className="neon-text">-ADS</span> · IFSP Campus São Paulo
          </p>
          <p className="mt-2 max-w-md text-[13px] text-muted-foreground">
            Centro Acadêmico de Análise e Desenvolvimento de Sistemas. Site mantido por estudantes,
            para estudantes.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { l: "WhatsApp", h: "https://chat.whatsapp.com/IZHNKdFfjiE3OaIiV5mzT4?s=cl&p=a&mlu=1"},
            { l: "Instagram", h: "https://www.instagram.com/caat.ifspo/" },
            { l: "SUAP", h: "https://suap.ifsp.edu.br" },
            { l: "Moodle", h: "https://eadcampus.spo.ifsp.edu.br/my/" },
          ].map((i) => (
            <a
              key={i.l}
              href={i.h}
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-full border border-border px-4 py-2 text-[13px] text-muted-foreground transition-all duration-400 ease-[var(--ease-fluid)] hover:border-neon hover:text-foreground"
            >
              {i.l}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
