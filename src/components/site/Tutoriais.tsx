import { useReveal } from "@/lib/gsap-reveal";

const tutoriais = [
  {
    titulo: "Primeiro acesso ao SUAP / Moodle",
    passos: [
      "Acesse suap.ifsp.edu.br e clique em “Entrar”.",
      "Use o mesmo login do SUAP (prontuário sem a letra) e sua senha.",
      "Localize as suas disciplinas do período em “Locais e Horários de Aula”.",
    ],
  },
  {
    titulo: "Declaração de matrícula no SUAP",
    passos: [
      "Entre em suap.ifsp.edu.br com prontuário e senha.",
      "Vá em Meus Dados → Documentos → Atestado de Matrícula.",
      "Selecione as opções que deseja e baixe o arquivo.",
    ],
  },
  {
    titulo: "Wi-Fi e e-mail institucional",
    passos: [
      "Conecte na rede IFSP e autentique com as credenciais do SUAP.",
      "Ative o e-mail @aluno.ifsp.edu.br no primeiro login do Google.",
      "Com ele você libera Drive, acesso e apps educacionais.",
    ],
  },
  {
    titulo: "Auxílios estudantis e editais",
    passos: [
      "SEILANSEICOMOFAZISSO AINDA",
      "VO VE I TI AVISO.",
      "EENVIA PELO SUAP",
    ],
  },
  {
    titulo: "Trancamento e ajuste de matrícula",
    passos: [
      "Confira o calendário acadêmico para os prazos do semestre.",
      "Solicite pelo SUAP através do Requerimento 'Cancelamento de Disciplina' ou 'Ajuste de Matrícula'.",
      "Valide o comprovante antes do fim do período de ajuste.",
    ],
  },
  {
    titulo: "Como contribuir com o banco de provas",
    passos: [
      "Digitalize a prova ou o material em PDF legível.",
      "Nomeie como Disciplina_Ano_Semestre_Professor.",
      "Envie no WhatsApp do CA para publicarmos no Drive.",
    ],
  },
];

export function Tutoriais() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section id="tutoriais" className="relative px-5 py-24">
      <div ref={ref} className="mx-auto max-w-6xl">
        <header className="max-w-2xl">
          <p data-reveal className="text-[12px] tracking-[0.2em] text-neon-soft uppercase">
            Guias rápidos
          </p>
          <h2 data-reveal className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">
            Tutoriais e acessos úteis
          </h2>
          <p data-reveal className="mt-3 text-muted-foreground">
            Para calouros e veteranos resolverem o burocrático em minutos.
          </p>
        </header>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tutoriais.map((t) => (
            <article key={t.titulo} data-reveal className="glass lift rounded-3xl p-6">
              <h3 className="text-base font-semibold text-foreground">{t.titulo}</h3>
              <ol className="mt-4 space-y-3">
                {t.passos.map((p, i) => (
                  <li key={p} className="flex gap-3 text-sm text-muted-foreground">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border text-[11px] text-neon-soft">
                      {i + 1}
                    </span>
                    {p}
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
