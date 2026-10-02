import { useState } from "react";
import { useReveal } from "@/lib/gsap-reveal";

type Aula = {
  disciplina: string;
  professor: string;
  dia: string;
  horario: string;
  sala: string;
  periodo: string;
};

const aulas: Aula[] = [
  {
    disciplina: "SPOMATI - Matemática para Informática",
    professor: "Prof. João Vianei",
    dia: "Segunda-feira",
    horario: "19:00 - 22:30",
    sala: "Bloco A – Sala 310",
    periodo: "1º",
  },
  {
    disciplina: "SPOLOG1 - Lógica de Programação 1",
    professor: "Prof. Francisco Veríssimo",
    dia: "Terça-feira & Sexta-feira",
    horario: "19:00 - 22:30",
    sala: "Bloco C – Sala 220/213",
    periodo: "1º",
  },
  {
    disciplina: "SPORHTI - Recursos Humanos e Tecnologia da Informação",
    professor: "Prof. Cesar",
    dia: "Quarta-feira",
    horario: "19:35 - 21:05",
    sala: "Bloco A - Sala 314",
    periodo: "1º",
  },
  {
    disciplina: "SPOADME - Administração de Empresas",
    professor: "Prof. Ronaldo",
    dia: "Quarta-feira",
    horario: "21:20 - 22:30",
    sala: "Bloco A – Sala 314",
    periodo: "1º",
  },
  {
    disciplina: "SPOENG1 - Engenharia 1",
    professor: "Prof. Johnata",
    dia: "Quinta-feira",
    horario: "19:00 - 21:05",
    sala: "Bloco C – Sala 217",
    periodo: "1º",
  },
  {
    disciplina: "SPOPFDS - Práticas e Ferramentas de Desenvolvimento de Software",
    professor: "Prof. Johnata",
    dia: "Quinta-feira",
    horario: "21:20 - 22:30",
    sala: "Bloco C – Sala 217",
    periodo: "1º",
  },
  {
    disciplina: "SPOOACO - Organização e Arquitetura de Computadores",
    professor: "Prof. André",
    dia: "Terça-feira & Sexta-feira",
    horario: "19:00 - 22:30",
    sala: "Bloco C - Sala 213/220",
    periodo: "1º",
  },
  {
    disciplina: "SPOLOG2 - Lógica de Programação 2",
    professor: "Prof. Celso Gonsalez",
    dia: "Segunda-feira",
    horario: "19:00 - 22:30",
    sala: "Bloco C - Sala 213/222",
    periodo: "2",
  },

  {
    disciplina: "SPOBDD1 - Banco de Dados 1",
    professor: "Prof. Eurides Balbino",
    dia: "Terça-feira",
    horario: "19:00 - 22:30",
    sala: "Bloco C - Sala 216",
    periodo: "2",
  },

  {
    disciplina: "SPOENG2 - Engenharia de Software 2",
    professor: "Prof. Antonio Palladino",
    dia: "Quarta-feira",
    horario: "19:00 - 22:30",
    sala: "Bloco C - Sala 217",
    periodo: "2",
  },

  {
    disciplina: "SPOSOPE - Sistemas Operacionais",
    professor: "Prof. Marcelo Tavares Santana",
    dia: "Quinta-feira",
    horario: "19:00 - 22:30",
    sala: "Bloco C - Sala 213/214",
    periodo: "2",
  },

  {
    disciplina: "SPOEDDA - Estrutura de Dados",
    professor: "Prof. Eurides Balbino",
    dia: "Sexta-feira",
    horario: "19:00 - 22:30",
    sala: "Bloco C - Sala 214/219",
    periodo: "2",
  },
  {
    disciplina: "SPOBD2 - Redes de Computadores",
    professor: "Prof. Paulo Abreu",
    dia: "Segunda-feira",
    horario: "19:00 - 22:30",
    sala: "Bloco C - Sala 116",
    periodo: "3",
  },
  {
    disciplina: "SPOENG3 - Engenharia de Software 3",
    professor: "Prof. Domingos Bernardo Gomes Santos",
    dia: "Terça-feira",
    horario: "19:00 - 22:30",
    sala: "Bloco C - Sala 212/219",
    periodo: "3",
  },
  {
    disciplina: "SPOLOG3 - Linguagem de Programação 1",
    professor: "Prof. Eurides Balbino",
    dia: "Quarta-feira",
    horario: "19:00 - 22:30",
    sala: "Bloco C - Sala 219",
    periodo: "3",
  },
  {
    disciplina: "SPOBD2 - Banco de Dados 2",
    professor: "Prof. Paulo Abreu",
    dia: "Quarta-feira",
    horario: "19:00 - 22:30",
    sala: "Bloco C - Sala 220",
    periodo: "3",
  },
  {
    disciplina: "SPODWE1 - Desenvolvimento Web 1",
    professor: "Prof. Matheus Pereira",
    dia: "Quinta-feira",
    horario: "19:00 - 22:30",
    sala: "Bloco C - Sala 134/222",
    periodo: "3",
  },
  {
    disciplina: "SPOEMPR - Empreendedorismo",
    professor: "Prof. Cesar Lopes",
    dia: "Sexta-feira",
    horario: "19:00 - 21:05",
    sala: "Bloco C - Sala 215",
    periodo: "3",
  },
  {
    disciplina: "SPODWE2 - Desenvolvimento Web 2",
    professor: "Prof. Matheus Pereira",
    dia: "Segunda-feira",
    horario: "19:00 - 22:30",
    sala: "Bloco C - 219/220",
    periodo: "4",
  },
  {
    disciplina: "SPOENG4 - Engenharia de Software 4",
    professor: "Prof. Anderson Gomes",
    dia: "Terça-feira",
    horario: "19:00 - 22:30",
    sala: "Bloco C - 210/222",
    periodo: "4",
  },

  {
    disciplina: "SPOSERV - Serviços e Servidores de Rede",
    professor: "Prof. Miguel Angelo",
    dia: "Quarta-feira",
    horario: "19:00 - 22:30",
    sala: "Bloco C - 116/222",
    periodo: "4",
  },

  {
    disciplina: "SPOLPG2 - Linguagem de Programação 2",
    professor: "Prof. Ronaldo Nogueira",
    dia: "Quinta-feira",
    horario: "19:00 - 22:30",
    sala: "Bloco C - 219",
    periodo: "4",
  },

  {
    disciplina: "SPOGEPR - Gestão de Projetos",
    professor: "Prof. Cesar Lopes",
    dia: "Sexta-feira",
    horario: "19:00 - 20:20",
    sala: "Bloco C - 134",
    periodo: "4",
  },

  {
    disciplina: "SPOSEGI - Segurança da Informação",
    professor: "Prof. Marcelo Tavares",
    dia: "Sexta-feira",
    horario: "20:20 - 22:30",
    sala: "Bloco C - 134/215",
    periodo: "4",
  },
  {
    disciplina: "SPOLPG3 - Linguagem de Programação 3",
    professor: "Prof. Ronaldo Nogueira",
    dia: "Segunda-feira",
    horario: "19:00 - 22:30",
    sala: "Bloco C - 221",
    periodo: "5",
  },
  {
    disciplina: "SPOPIE1 - Projeto Integrado de Extensão 1",
    professor: "Prof. Marcelo Tavares Santana & Prof. Johnata Souza Santicioli",
    dia: "Terça-feira",
    horario: "19:00 - 22:30",
    sala: "Bloco C - 217",
    periodo: "5",
  },
  {
    disciplina: "SPOSISD - Sistemas Distribuídos",
    professor: "Prof. Jonas Aparecido Marcheseli",
    dia: "Quarta-feira",
    horario: "19:00 - 22:30",
    sala: "Bloco C - 116/222",
    periodo: "5",
  },
  {
    disciplina: "SPOESTA - Estatística e Probabilidade",
    professor: "Prof. Josceli",
    dia: "Quinta-feira",
    horario: "19:00 - 21:05",
    sala: "Bloco C - 219",
    periodo: "5",
  },
  {
    disciplina: "SPOMOPN - Modelagem e Otimização de Processos de Negócio",
    professor: "Prof. Allyson Alves de Souza & Prof. Jonas Aparecido Marcheseli",
    dia: "Sexta-feira",
    horario: "19:00 - 20:20",
    sala: "Bloco C - 134",
    periodo: "5",
  },
  {
    disciplina: "SPOPWEB - Programação Dinâmica para Web",
    professor: "Prof. Allyson Alves de Souza & Prof. Jonas Aparecido Marcheseli",
    dia: "Sexta-feira",
    horario: "20:20 - 22:30",
    sala: "Bloco C - 134/215",
    periodo: "5",
  },
  {
    disciplina: "SPOLESC - Laboratório de Escalabilidade de Sistemas",
    professor: "Prof. Fabio Vieira do Amaral",
    dia: "Segunda-feira",
    horario: "19:00 - 22:30",
    sala: "Bloco C - 216",
    periodo: "6",
  },
  {
    disciplina: "SPOINCD - Introdução à Ciência de Dados",
    professor: "Prof. João Vianei Tamanini",
    dia: "Terça-feira",
    horario: "19:00 - 22:30",
    sala: "Bloco C - 134",
    periodo: "6",
  },
  {
    disciplina: "SPOPIE2 - Projeto Integrado de Extensão 2",
    professor: "Prof. Marcelo Tavares Santana & Prof. Johnata Souza Santicioli",
    dia: "Quarta-feira",
    horario: "19:00 - 22:30",
    sala: "Bloco C - 216",
    periodo: "6",
  },
  {
    disciplina: "SPOGGTI - Gestão de Governança de TI",
    professor: "Prof. Cesar Lopes Fernandes",
    dia: "Quinta-feira",
    horario: "19:00 - 21:05",
    sala: "Bloco C - 215",
    periodo: "6",
  },
  {
    disciplina: "SPOECSO - Ética, Cidadania e Sociedade",
    professor: "Prof. Henrique Aparecido Marson",
    dia: "Quinta-feira",
    horario: "21:20 - 22:30",
    sala: "Bloco A - 338",
    periodo: "6",
  },
  {
    disciplina: "SPOPIE2 - Projeto Integrado de Extensão 2",
    professor: "Prof. Marcelo Tavares Santana & Prof. Johnata Souza Santicioli",
    dia: "Sexta-feira",
    horario: "19:00 - 22:30",
    sala: "Bloco C - 216",
    periodo: "6",
  }
];

export function Horarios() {
  const ref = useReveal<HTMLDivElement>();
  const [periodo, setPeriodo] = useState(1);
  const aulasDoPeriodo = aulas.filter((aula) => Number.parseInt(aula.periodo, 10) === periodo);

  return (
    <section id="horarios" className="relative px-5 py-24">
      <div ref={ref} className="mx-auto max-w-6xl">
        <header className="max-w-2xl">
          <p data-reveal className="text-neon-soft text-[12px] tracking-[0.2em] uppercase">
            Noturno · Períodos / semestres
          </p>
          <h2 data-reveal className="text-foreground mt-3 text-3xl font-bold sm:text-4xl">
            Grade de horários e salas
          </h2>
          <p data-reveal className="text-muted-foreground mt-3">
            Selecione o período para consultar suas disciplinas, horários e salas.
          </p>
        </header>

        <div
          className="mt-8 flex flex-wrap gap-2"
          role="group"
          aria-label="Selecionar período ou semestre"
        >
          {[1, 2, 3, 4, 5, 6].map((numero) => (
            <button
              key={numero}
              type="button"
              aria-pressed={periodo === numero}
              aria-controls="grade-do-periodo"
              onClick={() => setPeriodo(numero)}
              className={`focus-visible:ring-neon rounded-full border px-4 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none ${periodo === numero ? "border-neon bg-neon/10 text-neon-soft" : "border-border text-muted-foreground hover:border-neon hover:text-foreground"}`}
            >
              {numero}º período
            </button>
          ))}
        </div>
        <p className="text-muted-foreground mt-4 text-sm" role="status">
          {periodo}º período · {aulasDoPeriodo.length} registros cadastrados
        </p>
        <div id="grade-do-periodo" className="glass mt-5 overflow-hidden rounded-3xl">
          <div className="border-border text-muted-foreground hidden grid-cols-[1.4fr_1fr_1fr_1fr_1.1fr] gap-4 border-b px-6 py-4 text-[11px] tracking-[0.18em] uppercase md:grid">
            <span>Disciplina</span>
            <span>Período</span>
            <span>Dia</span>
            <span>Horário</span>
            <span>Sala</span>
          </div>
          {!aulasDoPeriodo.length && (
            <p className="text-muted-foreground px-6 py-10 text-center">
              A grade do {periodo}º período ainda não foi cadastrada. Consulte seus horários no
              SUAP.
            </p>
          )}
          <ul>
            {aulasDoPeriodo.map((a, index) => (
              <li
                key={`${a.disciplina}-${index}`}
                className="border-border/70 hover:bg-secondary/50 grid gap-2 border-b px-6 py-5 transition-colors duration-400 ease-[var(--ease-fluid)] last:border-b-0 md:grid-cols-[1.4fr_1fr_1fr_1fr_1.1fr] md:items-center md:gap-4"
              >
                <div>
                  <p className="text-foreground text-sm font-semibold">{a.disciplina}</p>
                  <p className="text-muted-foreground text-[12px]">{a.professor}</p>
                </div>
                <span className="border-border text-neon-soft w-fit rounded-full border px-3 py-1 text-[11px]">
                  {Number.parseInt(a.periodo, 10)}º período
                </span>
                <span className="text-muted-foreground text-sm">{a.dia}</span>
                <span className="text-muted-foreground text-sm tabular-nums">{a.horario}</span>
                <span className="text-foreground/80 text-sm">{a.sala}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
