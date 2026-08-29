import { useEffect, useState } from "react";
import { useReveal } from "@/lib/gsap-reveal";
import { Shimmer } from "./Skeletons";

type Periodo = {
  n: number;
  titulo: string;
  disciplinas: string[];
  drive: string;
  prefetch: string;
};

const periodos: Periodo[] = [
  {
    n: 1,
    prefetch: "horarios",
    titulo: "1º Período",
    disciplinas: ["Matemática pra Informática", "Lógica de Programação 1", "Recursos Humanos para TI", "Organização e Arquitetura de Computadores", "Engenharia de Software 1", "Administração de Empresas", "Práticas e Ferramentas de Desenvolvimento de Software" ],
    drive: "https://drive.google.com/drive/folders/1dYIoauPGnCOlBXUpe8vHO1M-ZT1_I558?usp=sharing",
  },
  {
    n: 2,
    prefetch: "horarios",
    titulo: "2º Período",
    disciplinas: ["Estrutura de Dados", "Lógica de Programação 2", "Banco de Dados 1", "Engenharia de Software 2", "Sistemas Operacionais"],
    drive: "https://drive.google.com/drive/folders/1KXGyiNFsOEvNF-yfDWHhrKz0hxow8T_9?usp=sharing",
  },
  {
    n: 3,
    prefetch: "comunidades",
    titulo: "3º Período",
    disciplinas: ["Engenharia de Software 3", "Banco de Dados II", "Redes de Computadores", "Desenvolvimento Web I", "Linguagem de Programação 1", "Empreendedorismo"],
    drive: "https://drive.google.com/drive/folders/1Lq_K_8M_IvEWyMYvxNKgqeC1bOlKyem7?usp=sharing",
  },
  {
    n: 4,
    prefetch: "comunidades",
    titulo: "4º Período",
    disciplinas: ["Desenvolvimento Web II", "Linguagem de Programação 2", "Segurança da Informação", "Engenharia de Software 4", "Serviços e Servidores de Rede", "Gestão de Projetos"],
    drive: "https://drive.google.com/drive/folders/1A4x3WjYKqi27E0dOKPeF1XUuFDTpCIcu?usp=sharing",
  },
  {
    n: 5,
    prefetch: "tutoriais",
    titulo: "5º Período",
    disciplinas: ["Projeto Integrado de Extensão 1", "Linguagem de Programação 3", "Programação Dinâmica pra Web", "Sistemas Distribuídos", "Estatística e Probabilidade", "Modelagem de Processos de Negócios"],
    drive: "https://drive.google.com/drive/folders/1JtqLhYgXb6IIOC80Q5F37v_S5U_ka0CU?usp=sharing",
  },
  {
    n: 6,
    prefetch: "mapa",
    titulo: "6º Período",
    disciplinas: ["Ética, Cidadania e Sociedade", "Projeto Integrado de Extensão 2", "Introdução à Ciência de Dados", "Introdução à Otimização Combinatória", "Laboratório de Escalabilidade de Sistemas", "Gestão e Governança da Tecnologia da Informação"],
    drive: "https://drive.google.com/drive/folders/1cug5eLSLpTq2KoKHoF0-9HEqi12kWanG?usp=sharing",
  },
];

export function BancoDeProvas() {
  const ref = useReveal<HTMLDivElement>();
  const [ready, setReady] = useState(false);

  // Discipline links resolve after hydration, so we show skeleton rows first.
  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 260);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <section id="provas" className="relative px-5 py-24">
      <div ref={ref} className="mx-auto max-w-6xl">
        <header className="max-w-2xl">
          <p data-reveal className="text-[12px] tracking-[0.2em] text-neon-soft uppercase">
            Banco de provas
          </p>
          <h2 data-reveal className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">
            Provas e conteúdos por período
          </h2>
          <p data-reveal className="mt-3 text-muted-foreground">
            Repositórios do Google Drive organizados por ano, semestre e disciplina. Contribua
            enviando seus materiais para o CA.
          </p>
        </header>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {periodos.map((p) => (
            <a
              key={p.n}
              data-reveal
              data-prefetch={p.prefetch}
              href={p.drive}
              target="_blank"
              rel="noreferrer noopener"
              className="glass lift group relative flex flex-col rounded-3xl p-6"
            >
              <div className="flex items-start justify-between">
                <span className="font-display text-5xl font-bold text-foreground/15 transition-colors duration-500 group-hover:text-neon/50">
                  0{p.n}
                </span>
                <span className="rounded-full border border-border px-3 py-1 text-[11px] text-muted-foreground transition-colors duration-500 group-hover:border-neon group-hover:text-foreground">
                  Drive
                </span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">{p.titulo}</h3>
              <ul className="mt-3 flex flex-1 flex-col gap-1.5" aria-busy={!ready}>
                {ready
                  ? p.disciplinas.map((d) => (
                      <li
                        key={d}
                        className="flex items-center gap-2 text-sm text-muted-foreground animate-in fade-in duration-500"
                      >
                        <span className="h-1 w-1 rounded-full bg-neon-soft" />
                        {d}
                      </li>
                    ))
                  : p.disciplinas.map((d, i) => (
                      <li key={d} className="flex items-center gap-2 py-0.5">
                        <Shimmer className="h-1 w-1" />
                        <Shimmer className={i % 2 === 0 ? "h-3 w-3/5" : "h-3 w-4/5"} />
                      </li>
                    ))}
              </ul>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground">
                Abrir repositório
                <span className="transition-transform duration-500 ease-[var(--ease-fluid)] group-hover:translate-x-1">
                  →
                </span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
