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
      "Acompanhe a publicação dos editais de assistência estudantil no site ou mural do campus.",
      "Preencha os anexos solicitados e separe a documentação socioeconômica necessária.",
      "Submeta a inscrição e os comprovantes dentro do prazo estipulado através do SUAP.",
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
  {
    titulo: "Solicitação de Carteirinha Estudantil (Passe Escolar)",
    passos: [
      "Acesse o SUAP e baixe a sua Declaração de Matrícula atualizada.",
      "Entre no site da SPTrans (municipal) ou EMTU (intermunicipal) e solicite o cadastro de estudante.",
      "Após a aprovação, siga as instruções para validar o benefício nos postos credenciados ou totens.",
    ],
  },
  {
    titulo: "Emissão de Histórico Escolar e Declarações",
    passos: [
      "Entre no SUAP com seu prontuário e senha.",
      "Navegue até Ensino → Alunos → Documentos do Aluno.",
      "Escolha o documento desejado (Histórico ou Declaração de Vínculo) e baixe o PDF autenticado.",
    ],
  },
  {
    titulo: "Justificativa de Falta (Atestado Médico)",
    passos: [
      "Confira o prazo limite no regulamento (geralmente até 3 dias úteis após o retorno).",
      "Abra um Requerimento Eletrônico no SUAP selecionando a categoria de justificativa de faltas.",
      "Anexe o atestado médico digitalizado em PDF de forma legível e envie para a Secretaria.",
    ],
  },
  {
    titulo: "Empréstimo de Livros e Reserva na Biblioteca",
    passos: [
      "Acesse o sistema da biblioteca do IFSP utilizando suas credenciais institucionais.",
      "Consulte o acervo físico ou digital e utilize a opção de Reserva se necessário.",
      "Vá até o balcão da biblioteca para retirar o livro utilizando o prontuário ou carteirinha.",
    ],
  },
  {
    titulo: "Pacote Office e GitHub Student Developer Pack",
    passos: [
      "Utilize seu e-mail institucional (@aluno.ifsp.edu.br) para liberar o Microsoft Office 365 gratuito.",
      "Cadastre-se no GitHub Student Developer Pack usando o mesmo e-mail acadêmico.",
      "Aproveite ferramentas de desenvolvimento e licenças de software profissionais sem custo.",
    ],
  },
  {
    titulo: "Participação em Projetos de Extensão e Iniciação Científica",
    passos: [
      "Fique atento aos editais publicados na página oficial do campus e no SUAP ao longo do ano.",
      "Converse com os professores da sua área de interesse para alinhar propostas de planos de trabalho.",
      "Submeta a inscrição dentro do prazo exigido pelo edital vigente.",
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
