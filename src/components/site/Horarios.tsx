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
    disciplina: "Matemática para Informática (SPOMATI)",
    professor: "Prof. João Vianei",
    dia: "Segunda-feira",
    horario: "19:00 - 22:30",
    sala: "Bloco A – Sala 310",
    periodo: "1º",
  },
  {
    disciplina: "Lógica de Programação (SPOLOG1)",
    professor: "Prof. Francisco Veríssimo",
    dia: "Terça-feira",
    horario: "19:00 - 22:30",
    sala: "Bloco C – Sala 220",
    periodo: "1º",
  },
  {
    disciplina: "Resolução de Problemas / Tecnologias da Informação (SPORHTI)",
    professor: "Prof. Cesar",
    dia: "Quarta-feira",
    horario: "19:35 - 21:05",
    sala: "Bloco A - Sala 314",
    periodo: "1º",
  },
  {
    disciplina: "Administração e Empreendedorismo (SPOADME)",
    professor: "Prof. Ronaldo",
    dia: "Quarta-feira",
    horario: "21:20 - 22:30",
    sala: "Bloco A – Sala 314",
    periodo: "1º",
  },
  {
    disciplina: "Engenharia 1 (SPOENG1)",
    professor: "Prof. Johnata",
    dia: "Quinta-feira",
    horario: "19:00 - 21:05",
    sala: "Bloco C – Sala 217",
    periodo: "1º",
  },
  {
    disciplina: "Fundamentos de Sistemas (SPOPFDS)",
    professor: "Prof. Johnata",
    dia: "Quinta-feira",
    horario: "21:20 - 22:30",
    sala: "Bloco C – Sala 217",
    periodo: "1º",
  },
  {
    disciplina: "Organização e Arquitetura de Computadores (SPOOACO)",
    professor: "Prof. André",
    dia: "Sexta-feira",
    horario: "19:00 - 22:30",
    sala: "Bloco C - Sala 213",
    periodo: "1º",
  },
  {
    disciplina: "SPOLOG2 - Lógica de Programação 2",
    professor: "Prof. Celso Gonsalez",
    dia: "Segunda-feira",
    horario: "19:00 - 22:30",
    sala: "Bloco C - Sala 213",
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
    sala: "Bloco C - Sala 213",
    periodo: "2",
  },

  {
    disciplina: "SPOEDDA - Estrutura de Dados",
    professor: "Prof. Eurides Balbino",
    dia: "Sexta-feira",
    horario: "19:00 - 22:30",
    sala: "Bloco C - Sala 214",
    periodo: "2",
  },
  {
    disciplina: "Banco de Dados 2",
    professor: "Prof. Eurides Balbino",
    dia: "Terça-feira",
    horario: "19:00 - 22:30",
    sala: "Bloco A – Sala 310",
    periodo: "1º",
  },
  {
    disciplina: "SPODWE2 - Desenvolvimento Web 2",
    professor: "Prof. Matheus Pereira",
    dia: "Segunda-feira",
    horario: "19:00 - 22:30",
    sala: "Bloco C - 219",
    periodo: "4",
  },
  {
    disciplina: "SPOENG4 - Engenharia de Software 4",
    professor: "Prof. Anderson Gomes",
    dia: "Terça-feira",
    horario: "19:00 - 22:30",
    sala: "Bloco C - 210",
    periodo: "4",
  },

  {
    disciplina: "SPOSERV - Serviços e Servidores de Rede",
    professor: "Prof. Miguel Angelo",
    dia: "Quarta-feira",
    horario: "19:00 - 22:30",
    sala: "Bloco C - 116",
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
    sala: "Bloco C - 219",
    periodo: "4",
  },

  {
    disciplina: "SPOSEGI - Segurança da Informação",
    professor: "Prof. Marcelo Tavares",
    dia: "Sexta-feira",
    horario: "20:20 - 22:30",
    sala: "Bloco C - 219",
    periodo: "4",
  },
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
