import { ArrowUpRight, ChevronDown, GraduationCap } from "lucide-react";
import { siteLinks } from "@/data/site";
const guides = [
  {
    title: "Primeiro acesso ao SUAP e ao Moodle",
    tag: "COMECE AQUI",
    steps: [
      "Abra o SUAP pelo link abaixo. Se ainda não tiver acesso, use as opções de recuperação ou procure o atendimento acadêmico.",
      "O Moodle tem um acesso próprio. Confira as orientações de autenticação e as disciplinas disponíveis no portal.",
      "Se uma disciplina não aparecer, confirme com o professor ou com a secretaria antes de criar outro cadastro.",
    ],
    href: siteLinks.suap,
    action: "Acessar SUAP",
  },
  {
    title: "Preciso de uma declaração de matrícula",
    tag: "DOCUMENTOS",
    steps: [
      "Acesse o SUAP e consulte a área de dados e documentos do estudante.",
      "Confira se a declaração disponível corresponde ao documento solicitado e se os seus dados estão corretos.",
      "Se não localizar o documento, peça orientação ao atendimento acadêmico pelo canal indicado no sistema.",
    ],
    href: siteLinks.suap,
    action: "Abrir SUAP",
  },
  {
    title: "Wi-Fi e e-mail institucional",
    tag: "CONECTIVIDADE",
    steps: [
      "Consulte no SUAP as informações de acesso à sua conta institucional.",
      "Siga as orientações do campus para a rede Wi-Fi e para a ativação do e-mail.",
      "Não compartilhe sua senha. Em caso de falha, procure o suporte de TI do campus.",
    ],
    href: siteLinks.suap,
    action: "Consultar minha conta",
  },
  {
    title: "Auxílios estudantis e editais",
    tag: "PERMANÊNCIA",
    steps: [
      "Os critérios, documentos e prazos dependem do edital vigente.",
      "Peça ao CA o link do edital e o canal de atendimento responsável pela assistência estudantil.",
      "Leia o documento completo e guarde o comprovante da inscrição. Este portal não recebe inscrições.",
    ],
    href: siteLinks.contact,
    action: "Pedir orientação ao CA",
  },
  {
    title: "Ajustes de matrícula e trancamento",
    tag: "VIDA ACADÊMICA",
    steps: [
      "Confira os prazos no calendário acadêmico vigente.",
      "Consulte as orientações e os requerimentos disponíveis no SUAP para a sua situação.",
      "Antes de concluir a solicitação, confirme as consequências com o atendimento acadêmico e guarde o protocolo.",
    ],
    href: siteLinks.suap,
    action: "Consultar SUAP",
  },
  {
    title: "Como contribuir com os materiais",
    tag: "COLABORE",
    steps: [
      "Separe um PDF legível e remova dados pessoais que não precisam ser compartilhados.",
      "Use um nome como Disciplina_Ano_Semestre_Professor para facilitar a organização.",
      "Envie ao WhatsApp do CA apenas materiais que você tem autorização para compartilhar.",
    ],
    href: siteLinks.contact,
    action: "Enviar ao CA",
  },
];
export function Tutoriais() {
  return (
    <section id="tutoriais" className="portal-section guides-section">
      <div className="site-container guides-layout">
        <header className="section-heading">
          <div>
            <span className="shortcut-icon lime">
              <GraduationCap size={26} />
            </span>
            <p className="eyebrow">04 / UM EMPURRÃOZINHO</p>
            <h2>
              Calouro ou veterano,
              <br />
              pode chegar.
            </h2>
            <p>
              Orientações para as dúvidas que aparecem no caminho. Os procedimentos e prazos devem
              ser conferidos nos canais do campus.
            </p>
            <a
              className="text-link"
              href={siteLinks.contact}
              target="_blank"
              rel="noopener noreferrer"
            >
              Não encontrou sua dúvida? Fale com o CA <ArrowUpRight size={16} />
            </a>
          </div>
        </header>
        <div className="guide-list">
          {guides.map((guide, index) => (
            <details key={guide.title} className="guide">
              <summary>
                <span className="guide-number">0{index + 1}</span>
                <span>{guide.title}</span>
                <ChevronDown size={19} />
              </summary>
              <div className="guide-content">
                <p className="eyebrow">{guide.tag}</p>
                <ol>
                  {guide.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
                <a
                  className="text-link"
                  href={guide.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {guide.action} <ArrowUpRight size={16} />
                  <span className="sr-only">(nova aba)</span>
                </a>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
