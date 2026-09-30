export type Periodo = {
  n: number;
  titulo: string;
  disciplinas: string[];
  drive: string;
  prefetch: string;
};

export const periodos: Periodo[] = [
  {
    n: 1,
    prefetch: "horarios",
    titulo: "1º Período",
    disciplinas: [
      "Matemática pra Informática",
      "Lógica de Programação 1",
      "Recursos Humanos para TI",
      "Organização e Arquitetura de Computadores",
      "Engenharia de Software 1",
      "Administração de Empresas",
      "Práticas e Ferramentas de Desenvolvimento de Software",
    ],
    drive: "https://drive.google.com/drive/folders/1dYIoauPGnCOlBXUpe8vHO1M-ZT1_I558?usp=sharing",
  },
  {
    n: 2,
    prefetch: "horarios",
    titulo: "2º Período",
    disciplinas: [
      "Estrutura de Dados",
      "Lógica de Programação 2",
      "Banco de Dados 1",
      "Engenharia de Software 2",
      "Sistemas Operacionais",
    ],
    drive: "https://drive.google.com/drive/folders/1KXGyiNFsOEvNF-yfDWHhrKz0hxow8T_9?usp=sharing",
  },
  {
    n: 3,
    prefetch: "comunidades",
    titulo: "3º Período",
    disciplinas: [
      "Engenharia de Software 3",
      "Banco de Dados II",
      "Redes de Computadores",
      "Desenvolvimento Web I",
      "Linguagem de Programação 1",
      "Empreendedorismo",
    ],
    drive: "https://drive.google.com/drive/folders/1Lq_K_8M_IvEWyMYvxNKgqeC1bOlKyem7?usp=sharing",
  },
  {
    n: 4,
    prefetch: "comunidades",
    titulo: "4º Período",
    disciplinas: [
      "Desenvolvimento Web II",
      "Linguagem de Programação 2",
      "Segurança da Informação",
      "Engenharia de Software 4",
      "Serviços e Servidores de Rede",
      "Gestão de Projetos",
    ],
    drive: "https://drive.google.com/drive/folders/1A4x3WjYKqi27E0dOKPeF1XUuFDTpCIcu?usp=sharing",
  },
  {
    n: 5,
    prefetch: "tutoriais",
    titulo: "5º Período",
    disciplinas: [
      "Projeto Integrado de Extensão 1",
      "Linguagem de Programação 3",
      "Programação Dinâmica pra Web",
      "Sistemas Distribuídos",
      "Estatística e Probabilidade",
      "Modelagem de Processos de Negócios",
    ],
    drive: "https://drive.google.com/drive/folders/1JtqLhYgXb6IIOC80Q5F37v_S5U_ka0CU?usp=sharing",
  },
  {
    n: 6,
    prefetch: "mapa",
    titulo: "6º Período",
    disciplinas: [
      "Ética, Cidadania e Sociedade",
      "Projeto Integrado de Extensão 2",
      "Introdução à Ciência de Dados",
      "Introdução à Otimização Combinatória",
      "Laboratório de Escalabilidade de Sistemas",
      "Gestão e Governança da Tecnologia da Informação",
    ],
    drive: "https://drive.google.com/drive/folders/1cug5eLSLpTq2KoKHoF0-9HEqi12kWanG?usp=sharing",
  },
];

export type Aula = {
  disciplina: string;
  professor: string;
  dia: string;
  horario: string;
  sala: string;
  periodo: string;
};

export const aulas: Aula[] = [
  {
    disciplina: "Matemática para Informática (SPOMATI)",
    professor: "Prof. João Vianei",
    dia: "Segunda-feira",
    horario: "19:00 - 22:30",
    sala: "Bloco A – Sala 310",
    periodo: "1",
  },
  {
    disciplina: "Lógica de Programação (SPOLOG1)",
    professor: "Prof. Francisco Veríssimo",
    dia: "Terça-feira",
    horario: "19:00 - 22:30",
    sala: "Bloco C – Sala 220",
    periodo: "1",
  },
  {
    disciplina: "Resolução de Problemas / Tecnologias da Informação (SPORHTI)",
    professor: "Prof. Cesar",
    dia: "Quarta-feira",
    horario: "19:35 - 21:05",
    sala: "Bloco A - Sala 314",
    periodo: "1",
  },
  {
    disciplina: "Administração e Empreendedorismo (SPOADME)",
    professor: "Prof. Ronaldo",
    dia: "Quarta-feira",
    horario: "21:20 - 22:30",
    sala: "Bloco A – Sala 314",
    periodo: "1",
  },
  {
    disciplina: "Engenharia 1 (SPOENG1)",
    professor: "Prof. Johnata",
    dia: "Quinta-feira",
    horario: "19:00 - 21:05",
    sala: "Bloco C – Sala 217",
    periodo: "1",
  },
  {
    disciplina: "Fundamentos de Sistemas (SPOPFDS)",
    professor: "Prof. Johnata",
    dia: "Quinta-feira",
    horario: "21:20 - 22:30",
    sala: "Bloco C – Sala 217",
    periodo: "1",
  },
  {
    disciplina: "Organização e Arquitetura de Computadores (SPOOACO)",
    professor: "Prof. André",
    dia: "Sexta-feira",
    horario: "19:00 - 22:30",
    sala: "Bloco C - Sala 213",
    periodo: "1",
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
    periodo: "1",
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
