import { useRef, useState, type ReactNode } from "react";
import { useReveal } from "@/lib/gsap-reveal";

/* ------------------------------------------------------------------ */
/* TIPOS                                                               */
/* ------------------------------------------------------------------ */

type AndarId = "subsolo" | "terreo" | "mezanino" | "pav1";

type Sala = {
  id: string;
  nome: string;
  tipo: string;
  numero?: string;
  cor?: string;
  andar?: AndarId;
};

type Andar = {
  id: AndarId;
  rotulo: string;
};

type Bloco = {
  id: string;
  sigla: string;
  nome: string;
  descricao: string;
  salas: Sala[];
  /** Só os blocos com mais de uma planta definem andares (mostra o seletor). */
  andares?: Andar[];
  andarPadrao?: AndarId;
};

type CelulaPlanta = {
  id: string;
  nome: string;
  tipo: string;
  cor: string;
  numero?: string;
  /** Texto curto desenhado dentro da célula (use "\n" para quebrar linha). */
  rotulo?: string;
  /** Cor do marcador de EPI desenhado no canto da célula (opcional). */
  marca?: string;
};

type LinhaPlanta = {
  altura: number;
  celulas: CelulaPlanta[];
};

type SecaoPlanta = {
  esquerda: LinhaPlanta[];
  centro: LinhaPlanta[];
  direita: LinhaPlanta[];
};

type ZonaPlanta = {
  celula: CelulaPlanta;
  x: number;
  y: number;
  w: number;
  h: number;
  escada?: { seta?: "↑" | "↓" };
  rotunda?: boolean;
};

type Retangulo = { x: number; y: number; w: number; h: number };

type PlantaAndar = {
  titulo: string;
  viewBox: [number, number];
  contorno?: Retangulo;
  corredores?: Retangulo[];
  vazios?: Retangulo[];
  anfiteatros?: { cx: number; cy: number; lado: "esq" | "dir" }[];
  rotulos?: { x: number; y: number; texto: string; rot?: number }[];
  zonas: ZonaPlanta[];
  legenda: { tipo: string; cor: string }[];
  nota?: string;
};

/* ------------------------------------------------------------------ */
/* CORES E HELPERS                                                     */
/* ------------------------------------------------------------------ */

const C_LARANJA = "#f97316";
const C_AZUL = "#7c3aed";
const C_ROSA = "#f43f5e";
const C_CEU = "#e879f9";
const C_VERDE = "#22c55e";
const C_AMBAR = "#eab308";
const C_TEAL = "#14b8a6";
const C_VIOLETA = "#a78bfa";
const C_ROXO = "#c026d3";
const C_CINZA = "#52525b";
const C_SLATE = "#64748b";

function cel(
  id: string,
  nome: string,
  tipo: string,
  cor: string,
  numero?: string,
  rotulo?: string
): CelulaPlanta {
  return { id, nome, tipo, cor, numero, rotulo };
}

function lin(altura: number, ...celulas: CelulaPlanta[]): LinhaPlanta {
  return { altura, celulas };
}

function quebrarTexto(texto: string, maxChars: number): string[] {
  const palavras = texto.split(" ");
  const linhas: string[] = [];
  let atual = "";
  for (const palavra of palavras) {
    const tentativa = atual ? `${atual} ${palavra}` : palavra;
    if (tentativa.length > maxChars && atual) {
      linhas.push(atual);
      atual = palavra;
    } else {
      atual = tentativa;
    }
  }
  if (atual) linhas.push(atual);
  return linhas;
}

/* ------------------------------------------------------------------ */
/* PLANTA VETORIZADA DO BLOCO A — 1º PAVIMENTO (salas 300–356)         */
/* Baseada no quadro de sinalização real do bloco (Reitoria / Turnos / */
/* Departamentos / Laboratórios), redesenhada no tema escuro do site.  */
/* ------------------------------------------------------------------ */

const secoesBlocoA: SecaoPlanta[] = [
  // Seção 1 — ala da Reitoria, Turismo, Humanidades e Licenciaturas
  {
    esquerda: [
      lin(44, cel("a-ctu", "Coordenadoria de Turnos e Horários (CTU) — Sala da Coordenação", "Coordenação", C_LARANJA)),
      lin(30, cel("a-236a", "Sala 236-A", "Ambiente", C_CINZA, "236-A")),
      lin(30, cel("a-328", "Sala 328", "Ambiente", C_CINZA, "328")),
      lin(30, cel("a-330a", "Sala de Pesquisa (Turismo) — 330-A", "Turismo", C_AZUL, "330-A")),
      lin(30, cel("a-330", "Sala de Projeção (Turismo) — 330", "Turismo", C_AZUL, "330")),
      lin(30, cel("a-332a", "Sala 332-A", "Ambiente", C_CINZA, "332-A")),
      lin(30, cel("a-332", "Sala 332", "Ambiente", C_CINZA, "332")),
      lin(34, cel("a-334", "Laboratório (Turismo) — 334", "Laboratório", C_AZUL, "334")),
    ],
    centro: [
      lin(
        44,
        cel("a-ouvidoria", "Ouvidoria-Geral e Serviço de Informação ao Cidadão", "Administração", C_CEU),
        cel("a-cep", "Comitê de Ética em Pesquisa (CEP)", "Pesquisa", C_CEU)
      ),
      lin(32, cel("a-299", "Departamento de Humanidades — 299", "Departamento", C_ROSA, "299")),
      lin(32, cel("a-301", "Sala Códigos e Linguagens — 301", "Sala de Aula", C_ROSA, "301")),
      lin(30, cel("a-303", "Sala 303", "Ambiente", C_CINZA, "303")),
      lin(30, cel("a-305", "Sala 305", "Ambiente", C_CINZA, "305")),
      lin(46, cel("a-turismo-dept", "Departamento de Turismo e Informática e Subáreas (A, B, C, D e E)", "Departamento", C_AZUL)),
      lin(32, cel("a-307", "Laboratório (Turismo) — 307", "Laboratório", C_AZUL, "307")),
      lin(30, cel("a-309", "Sala 309", "Ambiente", C_CINZA, "309")),
    ],
    direita: [
      lin(38, cel("a-cppd", "Comissão Permanente de Pessoal Docente (CPPD)", "Comissão", C_CEU)),
      lin(32, cel("a-300", "Coordenadoria de Auxílio Estudantil — 300", "Auxílio Estudantil", C_VERDE, "300")),
      lin(32, cel("a-302", "Laboratório de Redação — 302", "Laboratório", C_ROSA, "302")),
      lin(32, cel("a-304", "Laboratório de Redação — 304", "Laboratório", C_ROSA, "304")),
      lin(32, cel("a-306a", "Coordenadoria de Licenciaturas — 306-A", "Coordenação", C_ROSA, "306-A")),
      lin(32, cel("a-306b", "Línguas Estrangeiras Modernas — 306-B", "Coordenação", C_ROSA, "306-B")),
      lin(42, cel("a-306cd", "Coordenadoria Técnico-Pedagógica — 306-C/D", "Coordenação", C_VERDE, "306-C/D")),
      lin(30, cel("a-banheiro1", "Banheiros", "Serviço", C_SLATE)),
    ],
  },
  // Seção 2 — ala da Química e do Laboratório de Língua e Fonética
  {
    esquerda: [
      lin(28, cel("a-336", "Sala 336", "Ambiente", C_CINZA, "336")),
      lin(28, cel("a-338", "Sala 338", "Ambiente", C_CINZA, "338")),
      lin(28, cel("a-340", "Sala 340", "Ambiente", C_CINZA, "340")),
      lin(28, cel("a-342", "Sala 342", "Ambiente", C_CINZA, "342")),
      lin(28, cel("a-344", "Sala 344", "Ambiente", C_CINZA, "344")),
      lin(34, cel("a-346a", "Coordenadoria de Química — 346-A", "Coordenação", C_AMBAR, "346-A")),
      lin(28, cel("a-348", "Sala 348", "Ambiente", C_CINZA, "348")),
    ],
    centro: [
      lin(36, cel("a-311", "Laboratório de Língua e Fonética — 311", "Laboratório", C_ROSA, "311")),
      lin(28, cel("a-315", "Sala 315", "Ambiente", C_CINZA, "315")),
      lin(28, cel("a-317", "Sala 317", "Ambiente", C_CINZA, "317")),
      lin(28, cel("a-319", "Sala 319", "Ambiente", C_CINZA, "319")),
      lin(28, cel("a-321", "Sala 321", "Ambiente", C_CINZA, "321")),
      lin(28, cel("a-323", "Sala 323", "Ambiente", C_CINZA, "323")),
      lin(28, cel("a-325", "Sala 325", "Ambiente", C_CINZA, "325")),
    ],
    direita: [
      lin(28, cel("a-308", "Sala 308", "Ambiente", C_CINZA, "308")),
      lin(28, cel("a-310", "Sala 310", "Ambiente", C_CINZA, "310")),
      lin(28, cel("a-312", "Sala 312", "Ambiente", C_CINZA, "312")),
      lin(28, cel("a-314", "Sala 314", "Ambiente", C_CINZA, "314")),
      lin(28, cel("a-316", "Sala 316", "Ambiente", C_CINZA, "316")),
      lin(28, cel("a-318", "Sala 318", "Ambiente", C_CINZA, "318")),
      lin(28, cel("a-320", "Sala 320", "Ambiente", C_CINZA, "320")),
    ],
  },
  // Seção 3 — ala das Ciências, Matemática, Física e Mecânica
  {
    esquerda: [
      lin(40, cel("a-350a", "Coordenadoria de Ciências Biológicas — 350-A", "Ciências Biológicas", C_TEAL, "350-A")),
      lin(40, cel("a-352", "Sala de Projetos de Matemática — 352", "Matemática", C_VIOLETA, "352")),
      lin(60, cel("a-354", "Coordenadoria de Física — 354", "Física", C_ROXO, "354")),
    ],
    centro: [
      lin(
        40,
        cel("a-327a", "Departamento de Ciências e Matemática — 327-A", "Departamento", C_TEAL, "327-A"),
        cel("a-327", "Coordenadoria de Turnos — 327", "Coordenação", C_LARANJA, "327")
      ),
      lin(
        40,
        cel("a-329", "Sala 329", "Ambiente", C_CINZA, "329"),
        cel("a-331", "Laboratório de Física Moderna — 331", "Laboratório", C_ROXO, "331")
      ),
      lin(40, cel("a-333", "Laboratório de Mecânica II — 333", "Laboratório", C_ROXO, "333")),
      lin(60, cel("a-356", "Laboratório de Eletromagnetismo — 356", "Laboratório", C_ROXO, "356")),
    ],
    direita: [
      lin(30, cel("a-banheiro2", "Banheiros", "Serviço", C_SLATE)),
      lin(40, cel("a-322", "Laboratório de Mecânica I — 322", "Laboratório", C_VIOLETA, "322")),
      lin(40, cel("a-324", "Laboratório 2 de Biologia — 324", "Ciências Biológicas", C_TEAL, "324")),
      lin(60, cel("a-326", "Laboratório de Termodinâmica — 326", "Laboratório", C_ROXO, "326")),
    ],
  },
];

function alturaColuna(coluna: LinhaPlanta[]): number {
  return coluna.reduce((acc, linha) => acc + linha.altura, 0);
}

function alturaSecao(secao: SecaoPlanta): number {
  return Math.max(alturaColuna(secao.esquerda), alturaColuna(secao.centro), alturaColuna(secao.direita));
}

const LARGURA_ESQ = 210;
const LARGURA_CENTRO = 260;
const LARGURA_DIR = 210;
const GAP_COLUNAS = 18;
const X_ESQ = 20;
const X_CENTRO = X_ESQ + LARGURA_ESQ + GAP_COLUNAS;
const X_DIR = X_CENTRO + LARGURA_CENTRO + GAP_COLUNAS;
const LARGURA_TOTAL = X_DIR + LARGURA_DIR + 20;

const Y_INICIO = 78;
const DIVISOR_ALTURA = 26;

const alturasSecoes = secoesBlocoA.map(alturaSecao);
const offsetsSecoes: number[] = alturasSecoes.map((_, i) => (i === 0 ? Y_INICIO : 0));
for (let i = 1; i < alturasSecoes.length; i++) {
  offsetsSecoes[i] = offsetsSecoes[i - 1] + alturasSecoes[i - 1] + DIVISOR_ALTURA;
}
const ALTURA_TOTAL_SVG =
  offsetsSecoes[offsetsSecoes.length - 1] + alturasSecoes[alturasSecoes.length - 1] + 24;

function salasDaSecao(secao: SecaoPlanta): Sala[] {
  const colunas = [secao.esquerda, secao.centro, secao.direita];
  const salas: Sala[] = [];
  for (const coluna of colunas) {
    for (const linha of coluna) {
      for (const celula of linha.celulas) {
        salas.push({
          id: celula.id,
          nome: celula.nome,
          tipo: celula.tipo,
          cor: celula.cor,
          numero: celula.numero,
          andar: "pav1",
        });
      }
    }
  }
  return salas;
}

const salasBlocoAPav1: Sala[] = secoesBlocoA.flatMap(salasDaSecao);

const LEGENDA_BLOCO_A: { tipo: string; cor: string }[] = [
  { tipo: "Coordenações", cor: C_LARANJA },
  { tipo: "Departamentos / Salas de Aula", cor: C_ROSA },
  { tipo: "Turismo", cor: C_AZUL },
  { tipo: "Administração / Comissões", cor: C_CEU },
  { tipo: "Auxílio Estudantil / Téc. Pedagógica", cor: C_VERDE },
  { tipo: "Química", cor: C_AMBAR },
  { tipo: "Ciências Biológicas", cor: C_TEAL },
  { tipo: "Matemática / Mecânica I", cor: C_VIOLETA },
  { tipo: "Física / Laboratórios", cor: C_ROXO },
  { tipo: "Serviços (banheiros)", cor: C_SLATE },
  { tipo: "Ambientes diversos", cor: C_CINZA },
];

/* ------------------------------------------------------------------ */
/* PLANTAS VETORIZADAS A PARTIR DAS PLANTAS BAIXAS OFICIAIS            */
/* Bloco A (subsolo), Bloco C e Bloco D (térreo e mezanino).           */
/* As coordenadas foram estimadas visualmente a partir das fotos; os   */
/* ambientes sem identificação na planta ficam como corredor/vazio.    */
/* Para ajustar, edite x / y / w / h de cada ambiente.                 */
/* ------------------------------------------------------------------ */

function criarZonas(prefixo: string) {
  const idDe = (chave: string) => `${prefixo}-${chave}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  const sala = (
    codigo: string,
    alt: string | null,
    x: number,
    y: number,
    w: number,
    h: number,
    tipo = "Sala",
    cor = C_CINZA
  ): ZonaPlanta => ({
    celula: cel(
      idDe(codigo),
      alt ? `${codigo} · ${alt}` : codigo,
      tipo,
      cor,
      alt ?? undefined,
      alt ? `${codigo}\n${alt}` : codigo
    ),
    x,
    y,
    w,
    h,
  });

  const lab = (codigo: string, alt: string | null, x: number, y: number, w: number, h: number) =>
    sala(codigo, alt, x, y, w, h, "Laboratório", C_ROXO);

  const espaco = (
    chave: string,
    nome: string,
    tipo: string,
    cor: string,
    x: number,
    y: number,
    w: number,
    h: number,
    rotulo?: string,
    marca?: string
  ): ZonaPlanta => ({
    celula: { ...cel(idDe(chave), nome, tipo, cor, undefined, rotulo ?? nome), marca },
    x,
    y,
    w,
    h,
  });

  const escada = (
    chave: string,
    nome: string,
    x: number,
    y: number,
    w: number,
    h: number,
    seta?: "↑" | "↓"
  ): ZonaPlanta => ({
    celula: cel(idDe(chave), nome, "Circulação", C_AMBAR),
    x,
    y,
    w,
    h,
    escada: seta ? { seta } : {},
  });

  return { sala, lab, espaco, escada };
}

const LEGENDA_PADRAO: { tipo: string; cor: string }[] = [
  { tipo: "Salas", cor: C_CINZA },
  { tipo: "Laboratórios", cor: C_ROXO },
  { tipo: "Escadas", cor: C_AMBAR },
  { tipo: "Banheiros", cor: C_SLATE },
];

/* ---------------------------- BLOCO A ------------------------------ */

function plantaASubsolo(): PlantaAndar {
  const { sala, espaco, escada } = criarZonas("a-sub");
  return {
    titulo: "BLOCO A · SUBSOLO",
    viewBox: [640, 620],
    corredores: [
      { x: 34, y: 459, w: 323, h: 33 },
      { x: 250, y: 300, w: 36, h: 159 },
      { x: 448, y: 258, w: 104, h: 234 },
    ],
    rotulos: [
      { x: 269, y: 292, texto: "BLOCO D" },
      { x: 500, y: 390, texto: "BLOCO A", rot: -90 },
    ],
    zonas: [
      sala("A117", "122", 34, 376, 72, 83),
      sala("A115", "123", 106, 376, 62, 83),
      sala("A112", "115", 168, 376, 42, 83),
      sala("A111", "116", 210, 385, 40, 74),
      sala("A109", "117", 286, 376, 71, 83),
      sala("A108", "117A", 357, 376, 91, 113),
      sala("A116", "121", 40, 492, 110, 109),
      sala("A114", "120", 150, 492, 71, 109),
      sala("A113", "119", 221, 492, 66, 109),
      sala("A110", "118", 287, 492, 76, 109),
      escada("esc-bloco-d", "Escada de ligação com o Bloco D", 253, 300, 32, 76),
      espaco("banheiros", "Banheiros", "Serviço", C_SLATE, 470, 236, 100, 40),
      {
        celula: cel("a-sub-rotunda", "Rotunda (anfiteatro)", "Área comum", C_TEAL),
        x: 405,
        y: 40,
        w: 190,
        h: 190,
        rotunda: true,
      },
    ],
    legenda: [
      { tipo: "Salas", cor: C_CINZA },
      { tipo: "Escada", cor: C_AMBAR },
      { tipo: "Banheiros", cor: C_SLATE },
      { tipo: "Rotunda", cor: C_TEAL },
    ],
  };
}

/* ---------------------------- BLOCO C ------------------------------ */

function plantaCTerreo(): PlantaAndar {
  const { sala, lab, espaco, escada } = criarZonas("c-ter");
  return {
    titulo: "BLOCO C · TÉRREO",
    viewBox: [640, 560],
    contorno: { x: 25, y: 44, w: 518, h: 480 },
    corredores: [
      { x: 142, y: 58, w: 23, h: 448 },
      { x: 430, y: 58, w: 38, h: 448 },
      { x: 165, y: 326, w: 265, h: 12 },
    ],
    vazios: [
      { x: 292, y: 58, w: 60, h: 268 },
      { x: 352, y: 146, w: 78, h: 102 },
    ],
    anfiteatros: [{ cx: 603, cy: 320, lado: "dir" }],
    zonas: [
      // Coluna esquerda
      sala("C104", "503", 60, 58, 82, 88),
      sala("C103", "502", 60, 146, 82, 96),
      sala("C102", "501", 60, 242, 82, 96),
      sala("C101", "500", 60, 338, 82, 96),
      espaco("banheiros-esq", "Banheiros", "Serviço", C_SLATE, 60, 434, 82, 72),
      // Miolo esquerdo
      sala("C105", "504", 165, 58, 127, 88),
      sala("C106", "505", 165, 146, 127, 102),
      sala("C107", "506", 165, 248, 64, 90),
      sala("C108", "507", 229, 248, 63, 90),
      sala("C109", "508A", 165, 338, 64, 76),
      sala("C110", "508B", 229, 338, 63, 76),
      sala("C111", "509", 165, 414, 127, 92),
      // Miolo direito
      sala("C131", null, 352, 58, 78, 46),
      sala("C130", null, 352, 104, 78, 42),
      sala("C122", null, 352, 248, 78, 36),
      sala("C121", null, 352, 284, 78, 36),
      sala("C117", null, 352, 370, 78, 34),
      // Coluna direita
      sala("C132", null, 468, 58, 67, 62),
      lab("C133", "LAB12", 468, 170, 67, 66),
      lab("C134", "LAB11", 468, 236, 67, 96),
      sala("C135", null, 468, 332, 67, 78),
      espaco("banheiros-dir", "Banheiros", "Serviço", C_SLATE, 468, 434, 67, 72),
      // Escadas
      escada("esc-te", "Escada superior esquerda", 142, 58, 23, 62),
      escada("esc-be", "Escada inferior esquerda", 142, 440, 23, 66),
      escada("esc-td", "Escada superior direita", 430, 58, 38, 62),
      escada("esc-bd", "Escada inferior direita", 430, 440, 38, 66),
    ],
    legenda: LEGENDA_PADRAO,
  };
}

function plantaCMezanino(): PlantaAndar {
  const { sala, lab, escada } = criarZonas("c-mez");
  return {
    titulo: "BLOCO C · MEZANINO",
    viewBox: [640, 590],
    contorno: { x: 25, y: 44, w: 518, h: 526 },
    corredores: [
      { x: 142, y: 58, w: 21, h: 432 },
      { x: 163, y: 469, w: 305, h: 21 },
      { x: 430, y: 58, w: 38, h: 432 },
    ],
    vazios: [
      { x: 231, y: 160, w: 55, h: 105 },
      { x: 225, y: 265, w: 61, h: 103 },
      { x: 231, y: 368, w: 55, h: 101 },
      { x: 286, y: 58, w: 66, h: 411 },
    ],
    anfiteatros: [{ cx: 603, cy: 346, lado: "dir" }],
    zonas: [
      // Coluna esquerda
      sala("C205", "514", 60, 58, 82, 102),
      sala("C204", "513", 60, 160, 82, 105),
      sala("C203", "512", 60, 265, 82, 103),
      sala("C202", "511", 60, 368, 82, 101),
      sala("C201", "510", 60, 469, 82, 93),
      // Miolo esquerdo
      sala("C206", "518", 163, 58, 123, 102),
      sala("C207", "517", 163, 160, 68, 105),
      sala("C208", "516", 163, 265, 62, 103),
      sala("C209", "515", 163, 368, 68, 101),
      // Laboratórios do miolo direito
      lab("C217", "LAB13", 352, 58, 78, 102),
      lab("C216", "LAB14", 352, 160, 78, 105),
      lab("C215", "LAB15", 352, 265, 78, 103),
      lab("C214", "LAB16", 352, 368, 78, 101),
      // Coluna direita
      lab("C218", "LAB1", 468, 58, 67, 102),
      lab("C219", "LAB2", 468, 160, 67, 105),
      lab("C220", "LAB3", 468, 265, 67, 103),
      lab("C221", "LAB4", 468, 368, 67, 101),
      lab("C222", "LAB5", 468, 469, 67, 93),
      // Fileira inferior
      lab("C210", "LAB9", 163, 490, 66, 72),
      lab("C211", "LAB8", 229, 490, 66, 72),
      lab("C212", "LAB7", 295, 490, 66, 72),
      lab("C213", "LAB6", 361, 490, 69, 72),
      // Escadas
      escada("esc-te", "Escada superior esquerda", 142, 58, 21, 52),
      escada("esc-be", "Escada inferior esquerda", 142, 490, 21, 72),
      escada("esc-td", "Escada superior direita", 430, 58, 38, 52),
      escada("esc-bd", "Escada inferior direita", 430, 490, 38, 72),
    ],
    legenda: [
      { tipo: "Salas", cor: C_CINZA },
      { tipo: "Laboratórios", cor: C_ROXO },
      { tipo: "Escadas", cor: C_AMBAR },
    ],
  };
}

/* ---------------------------- BLOCO D ------------------------------ */

function plantaDTerreo(): PlantaAndar {
  const { sala, espaco, escada } = criarZonas("d-ter");
  return {
    titulo: "BLOCO D · TÉRREO",
    viewBox: [640, 540],
    contorno: { x: 100, y: 44, w: 448, h: 460 },
    corredores: [
      { x: 158, y: 68, w: 32, h: 417 },
      { x: 450, y: 85, w: 35, h: 400 },
      { x: 190, y: 135, w: 260, h: 15 },
      { x: 190, y: 225, w: 260, h: 15 },
      { x: 190, y: 330, w: 260, h: 10 },
    ],
    anfiteatros: [
      { cx: 40, cy: 310, lado: "esq" },
      { cx: 608, cy: 310, lado: "dir" },
    ],
    zonas: [
      // Bloco superior
      sala("D113", "603", 190, 68, 72, 67),
      sala("D114", "604", 262, 68, 103, 67),
      sala("D115", "605", 367, 68, 83, 67),
      sala("D116", "606", 485, 85, 45, 40),
      sala("D109", "617", 190, 150, 88, 75),
      sala("D108", "615", 278, 150, 72, 75),
      sala("D107", "613", 350, 150, 100, 75),
      sala("D117", "607", 485, 140, 45, 100),
      // Coluna esquerda
      sala("D112", "602", 102, 150, 78, 85),
      sala("D111", "601", 102, 245, 78, 80),
      // Miolo
      sala("D103", "618", 190, 240, 55, 90),
      sala("D104", "616", 245, 240, 60, 90),
      sala("D105", "614", 305, 240, 70, 90),
      sala("D106", "612", 375, 240, 75, 90),
      sala("D118", "608", 485, 245, 45, 50),
      sala("D119", "609", 485, 295, 45, 55),
      // Fileira inferior
      sala("D102", "619", 190, 340, 95, 70),
      sala("D120", "611", 335, 340, 115, 70),
      sala("D101", "620", 190, 415, 45, 65),
      espaco(
        "sala-professores",
        "Sala dos Professores da DEL",
        "Sala dos Professores",
        C_VIOLETA,
        235,
        415,
        150,
        65,
        "Sala dos Professores\nda DEL"
      ),
      sala("D121", "610", 385, 415, 65, 65),
      // Serviços
      espaco("banheiros-esq", "Banheiros (esquerda)", "Serviço", C_SLATE, 102, 70, 56, 75, "Banheiros"),
      espaco("banheiros-dir", "Banheiros (direita)", "Serviço", C_SLATE, 482, 370, 48, 70, "Banheiros"),
      // Escadas
      escada("esc-te", "Escada superior esquerda", 158, 85, 32, 50),
      escada("esc-td", "Escada superior direita", 455, 85, 30, 45),
      escada("esc-be", "Escada inferior esquerda", 158, 455, 32, 30),
      escada("esc-bd", "Escada inferior direita", 452, 440, 30, 45),
    ],
    legenda: [
      { tipo: "Salas", cor: C_CINZA },
      { tipo: "Sala dos Professores", cor: C_VIOLETA },
      { tipo: "Escadas", cor: C_AMBAR },
      { tipo: "Banheiros", cor: C_SLATE },
    ],
  };
}

function plantaDMezanino(): PlantaAndar {
  const { sala, escada } = criarZonas("d-mez");
  return {
    titulo: "BLOCO D · MEZANINO",
    viewBox: [640, 540],
    contorno: { x: 100, y: 44, w: 448, h: 480 },
    corredores: [
      { x: 160, y: 73, w: 35, h: 434 },
      { x: 455, y: 73, w: 30, h: 434 },
      { x: 160, y: 140, w: 325, h: 25 },
      { x: 160, y: 443, w: 325, h: 17 },
    ],
    vazios: [{ x: 195, y: 260, w: 192, h: 95 }],
    anfiteatros: [
      { cx: 40, cy: 345, lado: "esq" },
      { cx: 608, cy: 345, lado: "dir" },
    ],
    zonas: [
      // Fileira superior
      sala("D208", "644A", 108, 73, 52, 67),
      sala("644B", null, 108, 140, 52, 20),
      sala("D209", "643", 195, 73, 65, 67),
      sala("D211", "642", 260, 73, 62, 67),
      sala("D213", "641", 322, 73, 65, 67),
      sala("D215", "640", 387, 73, 68, 67),
      sala("D217", "639", 485, 73, 55, 67),
      // Coluna esquerda
      sala("D207", "645", 108, 160, 52, 115),
      sala("D206", "646", 108, 355, 52, 85),
      sala("D201", "647", 108, 445, 52, 62),
      // Segunda fileira
      sala("D210", "647", 195, 165, 65, 95),
      sala("D212", "D1", 260, 165, 62, 95),
      sala("D214", "D2", 322, 165, 65, 95),
      sala("D216", "D3", 387, 165, 68, 95),
      sala("D220", "630", 387, 260, 68, 95),
      // Terceira fileira
      sala("D205", "D7", 195, 355, 65, 88),
      sala("D204", "D8", 260, 355, 62, 88),
      sala("D223", "D5", 322, 355, 65, 88),
      sala("D222", "D4", 387, 355, 68, 88),
      // Fileira inferior
      sala("D202", "D10", 195, 460, 65, 47),
      sala("D203", "D9", 260, 460, 62, 47),
      sala("D224", "D6", 322, 460, 65, 47),
      sala("D225", null, 387, 460, 68, 47),
      // Coluna direita
      sala("D218", "638", 485, 165, 55, 75),
      sala("D219", "637", 485, 240, 55, 115),
      sala("D221", "636", 485, 355, 55, 88),
      sala("D226", "635", 485, 447, 55, 60),
      // Escadas
      escada("esc-te", "Escada superior esquerda", 160, 73, 35, 52),
      escada("esc-td", "Escada superior direita", 455, 73, 30, 52),
      escada("esc-be", "Escada inferior esquerda", 160, 460, 35, 47),
      escada("esc-bd", "Escada inferior direita", 455, 460, 30, 47),
    ],
    legenda: [
      { tipo: "Salas", cor: C_CINZA },
      { tipo: "Escadas", cor: C_AMBAR },
    ],
  };
}

/* ---------------------------- BLOCO E ------------------------------ */
/* Os nomes das áreas sem texto na planta ("Retífica", "Fresadora" e    */
/* "Centro de Usinagem" são os únicos impressos) são provisórios.       */

const EPI_VERDE = "#22c55e";
const EPI_VERMELHO = "#ef4444";
const EPI_AZUL = "#3b82f6";

function plantaEOficina(): PlantaAndar {
  const { espaco, escada } = criarZonas("e-ofi");
  const oficina = (
    chave: string,
    nome: string,
    x: number,
    y: number,
    w: number,
    h: number,
    marca?: string,
    rotulo?: string
  ) => espaco(chave, nome, "Oficina", C_SLATE, x, y, w, h, rotulo, marca);
  const usinagem = (chave: string, nome: string, x: number, y: number, w: number, h: number, rotulo?: string) =>
    espaco(chave, nome, "Usinagem", C_LARANJA, x, y, w, h, rotulo, EPI_VERDE);

  return {
    titulo: "BLOCO E · OFICINA",
    viewBox: [680, 510],
    contorno: { x: 14, y: 38, w: 648, h: 452 },
    corredores: [
      { x: 20, y: 205, w: 636, h: 60 },
      { x: 74, y: 402, w: 456, h: 78 },
    ],
    zonas: [
      // Metade superior
      oficina("area-esq", "Área de bancadas (esquerda)", 20, 45, 111, 156, EPI_VERMELHO, "Bancadas\n(esquerda)"),
      oficina("baias-azul", "Baias (zona azul)", 133, 45, 85, 156, EPI_AZUL, "Baias\n(zona azul)"),
      oficina("baias", "Baias", 219, 45, 48, 156, undefined, "Baias"),
      oficina("bancada-central", "Bancada central", 269, 45, 120, 156, EPI_VERDE, "Bancada\ncentral"),
      oficina("bancadas-inclinadas", "Bancadas inclinadas", 392, 45, 141, 156, EPI_VERDE, "Bancadas\ninclinadas"),
      oficina("area-dir", "Área de bancadas (direita)", 536, 45, 120, 156, EPI_VERDE, "Bancadas\n(direita)"),
      // Metade inferior — usinagem
      espaco("sala-lateral", "Sala lateral", "Sala", C_CINZA, 23, 279, 51, 114, "Sala\nlateral"),
      usinagem("retifica", "Retífica", 74, 279, 99, 123),
      usinagem("fresadora", "Fresadora", 174, 279, 128, 123),
      usinagem("centro-usinagem", "Centro de Usinagem", 302, 279, 120, 123, "Centro de\nUsinagem"),
      espaco("sala-vazia", "Sala (sem equipamentos na planta)", "Sala", C_CINZA, 427, 284, 103, 103, "Sala"),
      // Escadas
      escada("esc-te", "Escada superior esquerda", 20, 205, 20, 48),
      escada("esc-be", "Escada inferior esquerda", 33, 432, 17, 40),
      escada("esc-bd", "Escada inferior direita", 452, 439, 36, 36),
    ],
    legenda: [
      { tipo: "Oficina / bancadas", cor: C_SLATE },
      { tipo: "Usinagem", cor: C_LARANJA },
      { tipo: "Escadas", cor: C_AMBAR },
      { tipo: "EPI verde (básico)", cor: EPI_VERDE },
      { tipo: "EPI vermelho / amarelo", cor: EPI_VERMELHO },
      { tipo: "EPI azul", cor: EPI_AZUL },
    ],
    nota:
      "Os marcadores coloridos indicam o equipamento de proteção exigido na área. Verde: cabelos presos, calça comprida, jaleco, óculos de segurança e sapato fechado. As demais cores aparecem cortadas na foto da legenda.",
  };
}

const plantasAndar: Record<string, PlantaAndar> = {
  "bloco-a:subsolo": plantaASubsolo(),
  "bloco-c:terreo": plantaCTerreo(),
  "bloco-c:mezanino": plantaCMezanino(),
  "bloco-d:terreo": plantaDTerreo(),
  "bloco-d:mezanino": plantaDMezanino(),
  "bloco-e:terreo": plantaEOficina(),
};

function salasDaPlanta(chave: string, andar: AndarId): Sala[] {
  return plantasAndar[chave].zonas.map(({ celula }) => ({
    id: celula.id,
    nome: celula.nome,
    tipo: celula.tipo,
    cor: celula.cor,
    numero: celula.numero,
    andar,
  }));
}

/* ------------------------------------------------------------------ */
/* COMPONENTES SVG                                                     */
/* ------------------------------------------------------------------ */

function CelulaSVG({
  x,
  y,
  width,
  height,
  celula,
  ativa,
  onClick,
  esmaecida = false,
  escalaFonte = 1,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  celula: CelulaPlanta;
  ativa: boolean;
  onClick: () => void;
  esmaecida?: boolean;
  escalaFonte?: number;
}) {
  // Reduz a fonte aos poucos até o texto caber na altura da célula.
  let fontSize = (celula.rotulo ? 9 : celula.tipo === "Ambiente" ? 10 : 8.5) * escalaFonte;
  let linhasTexto = celula.rotulo ? celula.rotulo.split("\n") : [celula.nome];
  if (!celula.rotulo) {
    for (let tentativa = 0; tentativa < 6; tentativa++) {
      linhasTexto = quebrarTexto(celula.nome, Math.max(10, Math.floor(width / (fontSize * 0.62))));
      if (linhasTexto.length * (fontSize + 2.6) <= height - 4 || fontSize <= 7) break;
      fontSize -= 0.7;
    }
  }
  linhasTexto = linhasTexto.slice(0, 4);
  const lineHeight = fontSize + 2.6;
  const blocoAltura = (linhasTexto.length - 1) * lineHeight;
  const yTexto = y + height / 2 - blocoAltura / 2 + fontSize / 3;

  return (
    <g
      onClick={onClick}
      opacity={esmaecida ? 0.22 : 1}
      className="cursor-pointer group transition-opacity duration-300"
    >
      <title>{celula.nome}</title>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx="5"
        fill={ativa ? "#1c1c22" : "#18181b"}
        stroke={ativa ? celula.cor : "#3f3f46"}
        strokeWidth={ativa ? 1.75 : 1}
        className="transition-all duration-300 group-hover:fill-neon/10 group-hover:stroke-neon"
      />
      <rect x={x + 1.5} y={y + 3} width="3" height={height - 6} rx="1.5" fill={celula.cor} opacity={ativa ? 1 : 0.7} />
      {celula.marca && (
        <circle
          cx={x + width - 10}
          cy={y + 10}
          r="5"
          fill={celula.marca}
          stroke="#09090b"
          strokeWidth="1"
          className="pointer-events-none"
        />
      )}
      {linhasTexto.map((linha, i) => (
        <text
          key={i}
          x={x + width / 2 + 3}
          y={yTexto + i * lineHeight}
          fontSize={fontSize}
          fontWeight={celula.tipo === "Ambiente" ? 600 : 500}
          textAnchor="middle"
          fill={ativa ? "#f4f4f5" : "#a1a1aa"}
          className="pointer-events-none select-none transition-colors duration-300 group-hover:fill-neon"
        >
          {linha}
        </text>
      ))}
    </g>
  );
}

function EscadaSVG({
  zona,
  ativa,
  onClick,
  esmaecida = false,
}: {
  zona: ZonaPlanta;
  ativa: boolean;
  onClick: () => void;
  esmaecida?: boolean;
}) {
  const { celula, x, y, w, h, escada } = zona;
  const degraus = Math.floor(h / 8);
  return (
    <g onClick={onClick} opacity={esmaecida ? 0.22 : 1} className="cursor-pointer group transition-opacity duration-300">
      <title>{celula.nome}</title>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="4"
        fill={ativa ? "#1c1c22" : "#18181b"}
        stroke={ativa ? celula.cor : "#3f3f46"}
        strokeWidth={ativa ? 1.75 : 1}
        className="transition-all duration-300 group-hover:fill-neon/10 group-hover:stroke-neon"
      />
      {Array.from({ length: degraus - 1 }, (_, i) => (
        <line
          key={i}
          x1={x + 4}
          x2={x + w - 4}
          y1={y + (i + 1) * 8}
          y2={y + (i + 1) * 8}
          stroke={celula.cor}
          strokeWidth="1"
          opacity={ativa ? 0.9 : 0.45}
          className="pointer-events-none"
        />
      ))}
      {escada?.seta && (
        <text
          x={x + w / 2}
          y={y + 14}
          fontSize="13"
          fontWeight="bold"
          textAnchor="middle"
          fill="#e4e4e7"
          className="pointer-events-none select-none"
        >
          {escada.seta}
        </text>
      )}
    </g>
  );
}

function RotundaSVG({
  zona,
  ativa,
  onClick,
  esmaecida = false,
}: {
  zona: ZonaPlanta;
  ativa: boolean;
  onClick: () => void;
  esmaecida?: boolean;
}) {
  const { celula, x, y, w } = zona;
  const r = w / 2;
  const cx = x + r;
  const cy = y + r;
  return (
    <g onClick={onClick} opacity={esmaecida ? 0.22 : 1} className="cursor-pointer group transition-opacity duration-300">
      <title>{celula.nome}</title>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={ativa ? "#1c1c22" : "#18181b"}
        stroke={ativa ? celula.cor : "#3f3f46"}
        strokeWidth={ativa ? 1.75 : 1}
        className="transition-all duration-300 group-hover:fill-neon/10 group-hover:stroke-neon"
      />
      {[0.84, 0.55, 0.23].map((fator) => (
        <circle
          key={fator}
          cx={cx}
          cy={cy}
          r={r * fator}
          fill="none"
          stroke={celula.cor}
          strokeWidth="1"
          opacity={ativa ? 0.9 : 0.4}
          className="pointer-events-none"
        />
      ))}
    </g>
  );
}

function VazioSVG({ x, y, w, h }: Retangulo) {
  return (
    <g className="pointer-events-none">
      <rect x={x} y={y} width={w} height={h} fill="#0c0c0f" stroke="#27272a" strokeDasharray="3 3" />
      <line x1={x} y1={y} x2={x + w} y2={y + h} stroke="#27272a" />
      <line x1={x + w} y1={y} x2={x} y2={y + h} stroke="#27272a" />
    </g>
  );
}

function AnfiteatroSVG({ cx, cy, lado }: { cx: number; cy: number; lado: "esq" | "dir" }) {
  // "dir": arcos abertos para a direita (curvam para a esquerda); "esq": o inverso.
  const sweep = lado === "dir" ? 0 : 1;
  return (
    <g className="pointer-events-none" fill="none" stroke="#3f3f46" strokeWidth="1.5">
      {[22, 40, 58].map((r) => (
        <path key={r} d={`M ${cx} ${cy - r} A ${r} ${r} 0 0 ${sweep} ${cx} ${cy + r}`} />
      ))}
      <circle cx={cx} cy={cy} r="8" stroke="#27272a" />
      <text x={cx} y={cy + 74} fontSize="7" textAnchor="middle" fill="#52525b" stroke="none" letterSpacing="1">
        ANFITEATRO
      </text>
    </g>
  );
}

function Legenda({ itens }: { itens: { tipo: string; cor: string }[] }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 px-2 text-[10px] text-muted-foreground">
      {itens.map((item) => (
        <span key={item.tipo} className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.cor }} />
          {item.tipo}
        </span>
      ))}
    </div>
  );
}

const BOTAO_ZOOM =
  "h-7 w-7 cursor-pointer rounded-full border border-border bg-background/80 text-[14px] leading-none text-muted-foreground transition-all duration-300 hover:border-neon/60 hover:text-foreground disabled:cursor-default disabled:opacity-40";

/** Aproximar (até 3x) e arrastar para mover. Cliques nos ambientes continuam funcionando. */
function ZoomPan({ children }: { children: ReactNode }) {
  const caixa = useRef<HTMLDivElement>(null);
  const arrasto = useRef<{ px: number; py: number; ox: number; oy: number } | null>(null);
  const moveu = useRef(false);
  const [t, setT] = useState({ k: 1, x: 0, y: 0 });

  const limitar = (x: number, y: number, k: number) => {
    const w = caixa.current?.clientWidth ?? 0;
    const h = caixa.current?.clientHeight ?? 0;
    return {
      k,
      x: Math.min(0, Math.max(-(k - 1) * w, x)),
      y: Math.min(0, Math.max(-(k - 1) * h, y)),
    };
  };

  const zoom = (delta: number) =>
    setT((a) => {
      const k = Math.min(3, Math.max(1, Math.round((a.k + delta) * 100) / 100));
      const w = caixa.current?.clientWidth ?? 0;
      const h = caixa.current?.clientHeight ?? 0;
      const f = k / a.k;
      return limitar(w / 2 - (w / 2 - a.x) * f, h / 2 - (h / 2 - a.y) * f, k);
    });

  return (
    <div className="relative w-full">
      <div className="absolute right-2 top-2 z-10 flex gap-1.5">
        <button type="button" aria-label="Aproximar" disabled={t.k >= 3} onClick={() => zoom(0.5)} className={BOTAO_ZOOM}>
          +
        </button>
        <button type="button" aria-label="Afastar" disabled={t.k <= 1} onClick={() => zoom(-0.5)} className={BOTAO_ZOOM}>
          −
        </button>
        {t.k > 1 && (
          <button
            type="button"
            aria-label="Restaurar visualização"
            onClick={() => setT({ k: 1, x: 0, y: 0 })}
            className={BOTAO_ZOOM}
          >
            ↺
          </button>
        )}
      </div>
      <div
        ref={caixa}
        className="w-full overflow-hidden rounded-2xl"
        style={{ touchAction: t.k > 1 ? "none" : "pan-y" }}
        onPointerDown={(e) => {
          if (t.k <= 1) return;
          arrasto.current = { px: e.clientX, py: e.clientY, ox: t.x, oy: t.y };
          moveu.current = false;
        }}
        onPointerMove={(e) => {
          const a = arrasto.current;
          if (!a) return;
          const dx = e.clientX - a.px;
          const dy = e.clientY - a.py;
          if (Math.abs(dx) + Math.abs(dy) > 4) moveu.current = true;
          setT((s) => limitar(a.ox + dx, a.oy + dy, s.k));
        }}
        onPointerUp={() => {
          arrasto.current = null;
        }}
        onPointerLeave={() => {
          arrasto.current = null;
        }}
        onClickCapture={(e) => {
          if (moveu.current) {
            e.stopPropagation();
            moveu.current = false;
          }
        }}
      >
        <div style={{ transform: `translate(${t.x}px, ${t.y}px) scale(${t.k})`, transformOrigin: "0 0" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

const CHIP_BASE =
  "cursor-pointer rounded-full border px-3 py-1 text-[11px] transition-all duration-300";

/** Renderizador único das plantas de andar (Blocos A-subsolo, C, D e E). */
function PlantaAndarSVG({
  planta,
  salaAtivaId,
  onSelecionar,
}: {
  planta: PlantaAndar;
  salaAtivaId?: string;
  onSelecionar: (id: string) => void;
}) {
  const [filtro, setFiltro] = useState<string | null>(null);
  const [largura, altura] = planta.viewBox;
  const tipos = Array.from(new Set(planta.zonas.map((z) => z.celula.tipo)));

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <ZoomPan>
        <svg
          viewBox={`0 0 ${largura} ${altura}`}
          className="h-full max-h-[600px] w-full drop-shadow-lg rounded-2xl"
          xmlns="http://www.w3.org/2000/svg"
          fontFamily="Arial, Helvetica, sans-serif"
        >
          <rect width={largura} height={altura} fill="#09090b" rx="16" />
          <text x={largura - 20} y="26" fontSize="10" fontWeight="bold" textAnchor="end" fill="#71717a" letterSpacing="1">
            {planta.titulo}
          </text>

          {planta.contorno && (
            <rect
              x={planta.contorno.x}
              y={planta.contorno.y}
              width={planta.contorno.w}
              height={planta.contorno.h}
              rx="10"
              fill="none"
              stroke="#27272a"
              strokeWidth="2"
            />
          )}

          {planta.corredores?.map((c, i) => (
            <rect key={`corredor-${i}`} x={c.x} y={c.y} width={c.w} height={c.h} fill="#101013" />
          ))}

          {planta.vazios?.map((v, i) => (
            <VazioSVG key={`vazio-${i}`} {...v} />
          ))}

          {planta.anfiteatros?.map((a, i) => (
            <AnfiteatroSVG key={`anfiteatro-${i}`} {...a} />
          ))}

          {planta.zonas.map((zona) => {
            const ativa = salaAtivaId === zona.celula.id;
            const aoClicar = () => onSelecionar(zona.celula.id);
            const esmaecida = filtro !== null && zona.celula.tipo !== filtro;
            if (zona.rotunda)
              return <RotundaSVG key={zona.celula.id} zona={zona} ativa={ativa} onClick={aoClicar} esmaecida={esmaecida} />;
            if (zona.escada)
              return <EscadaSVG key={zona.celula.id} zona={zona} ativa={ativa} onClick={aoClicar} esmaecida={esmaecida} />;
            return (
              <CelulaSVG
                key={zona.celula.id}
                x={zona.x}
                y={zona.y}
                width={zona.w}
                height={zona.h}
                celula={zona.celula}
                ativa={ativa}
                onClick={aoClicar}
                esmaecida={esmaecida}
              />
            );
          })}

          {planta.rotulos?.map((r, i) => (
            <text
              key={`rotulo-${i}`}
              x={r.x}
              y={r.y}
              fontSize="8.5"
              fontWeight="bold"
              textAnchor="middle"
              fill="#71717a"
              letterSpacing="1"
              transform={r.rot ? `rotate(${r.rot} ${r.x} ${r.y})` : undefined}
              className="pointer-events-none select-none"
            >
              {r.texto}
            </text>
          ))}
        </svg>
      </ZoomPan>

      <Legenda itens={planta.legenda} />

      {planta.nota && (
        <p className="max-w-md px-2 text-center text-[10px] leading-relaxed text-muted-foreground">{planta.nota}</p>
      )}

      {tipos.length > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2" role="group" aria-label="Destacar por tipo">
          <span className="text-[10px] text-muted-foreground">Destacar:</span>
          {tipos.map((tipo) => (
            <button
              key={tipo}
              type="button"
              aria-pressed={filtro === tipo}
              onClick={() => setFiltro(filtro === tipo ? null : tipo)}
              className={`${CHIP_BASE} ${
                filtro === tipo
                  ? "border-neon bg-neon/10 text-neon"
                  : "border-border text-muted-foreground hover:border-neon/60 hover:text-foreground"
              }`}
            >
              {tipo}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const ESCALA_FONTE_A = 1.2;

const ALAS_BLOCO_A: { id: number | "todas"; rotulo: string }[] = [
  { id: 0, rotulo: "Ala 1 · Reitoria" },
  { id: 1, rotulo: "Ala 2 · Química" },
  { id: 2, rotulo: "Ala 3 · Ciências" },
  { id: "todas", rotulo: "Ver tudo" },
];

function PlantaBlocoA({
  salaAtivaId,
  onSelecionar,
}: {
  salaAtivaId?: string;
  onSelecionar: (id: string) => void;
}) {
  const [ala, setAla] = useState<number | "todas">(0);
  const ultima = secoesBlocoA.length - 1;
  const todas = ala === "todas";

  // Recorte vertical do SVG: mostra uma ala por vez (texto maior) ou o bloco inteiro.
  const y0 = todas || ala === 0 ? 0 : offsetsSecoes[ala] - 26;
  const y1 = todas || ala === ultima ? ALTURA_TOTAL_SVG : offsetsSecoes[ala + 1] - 20;
  const mostrarCabecalho = y0 === 0;

  const svg = (
    <svg
      viewBox={`0 ${y0} ${LARGURA_TOTAL} ${y1 - y0}`}
      className="h-auto w-full drop-shadow-lg rounded-2xl"
      xmlns="http://www.w3.org/2000/svg"
      fontFamily="Arial, Helvetica, sans-serif"
    >
      <rect y={y0} width={LARGURA_TOTAL} height={y1 - y0} fill="#09090b" rx="16" />

      {mostrarCabecalho && (
        <>
          {/* Cabeçalho — REITORIA / Entrada da Reitoria / REITORIA, alinhado às 3 colunas */}
          <rect x={X_ESQ} y="16" width={LARGURA_ESQ} height="26" fill="#18181b" stroke="#3f3f46" rx="6" />
          <text
            x={X_ESQ + LARGURA_ESQ / 2}
            y="34"
            fontSize="10"
            fontWeight="bold"
            textAnchor="middle"
            fill="#e4e4e7"
            letterSpacing="1"
          >
            REITORIA
          </text>

          <rect x={X_CENTRO} y="16" width={LARGURA_CENTRO} height="26" fill="#18181b" stroke="#3f3f46" rx="6" />
          <text x={X_CENTRO + LARGURA_CENTRO / 2} y="34" fontSize="9" textAnchor="middle" fill="#a1a1aa">
            Entrada da Reitoria
          </text>

          <rect x={X_DIR} y="16" width={LARGURA_DIR} height="26" fill="#18181b" stroke="#3f3f46" rx="6" />
          <text
            x={X_DIR + LARGURA_DIR / 2}
            y="34"
            fontSize="10"
            fontWeight="bold"
            textAnchor="middle"
            fill="#e4e4e7"
            letterSpacing="1"
          >
            REITORIA
          </text>

          {/* Escada / Você está aqui / Rampa */}
          <text x={X_ESQ + 4} y="58" fontSize="10" fill="#71717a">
            Escada
          </text>
          <text x={X_CENTRO + LARGURA_CENTRO / 2} y="58" fontSize="10" fontWeight="bold" textAnchor="middle" className="fill-neon">
            VOCÊ ESTÁ AQUI
          </text>
          <text x={X_DIR + LARGURA_DIR - 4} y="58" fontSize="10" textAnchor="end" fill="#71717a">
            Rampa
          </text>
          <line x1={X_ESQ} y1="64" x2={X_DIR + LARGURA_DIR} y2="64" stroke="#27272a" strokeDasharray="4 4" />
        </>
      )}

      {secoesBlocoA.map((secao, i) => {
        if (!todas && ala !== i) return null;
        const yTopo = offsetsSecoes[i];
        return (
          <g key={i}>
            {i > 0 && (
              <>
                <text x={X_ESQ + 4} y={yTopo - 6} fontSize="10" fill="#71717a">
                  Escada
                </text>
                <text x={X_DIR + LARGURA_DIR - 4} y={yTopo - 6} fontSize="10" textAnchor="end" fill="#71717a">
                  Rampa
                </text>
                <line
                  x1={X_ESQ}
                  y1={yTopo - 14}
                  x2={X_DIR + LARGURA_DIR}
                  y2={yTopo - 14}
                  stroke="#27272a"
                  strokeDasharray="4 4"
                />
              </>
            )}
            {renderColuna(secao.esquerda, X_ESQ, yTopo, LARGURA_ESQ, salaAtivaId, onSelecionar)}
            {renderColuna(secao.centro, X_CENTRO, yTopo, LARGURA_CENTRO, salaAtivaId, onSelecionar)}
            {renderColuna(secao.direita, X_DIR, yTopo, LARGURA_DIR, salaAtivaId, onSelecionar)}
          </g>
        );
      })}
    </svg>
  );

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="flex flex-wrap items-center justify-center gap-2" role="group" aria-label="Escolher ala do bloco">
        {ALAS_BLOCO_A.map((a) => (
          <button
            key={String(a.id)}
            type="button"
            aria-pressed={ala === a.id}
            onClick={() => setAla(a.id)}
            className={`${CHIP_BASE} ${
              ala === a.id
                ? "border-neon bg-neon/10 text-neon"
                : "border-border text-muted-foreground hover:border-neon/60 hover:text-foreground"
            }`}
          >
            {a.rotulo}
          </button>
        ))}
      </div>

      {todas ? (
        <div className="max-h-[640px] w-full overflow-y-auto rounded-2xl">{svg}</div>
      ) : (
        <ZoomPan key={String(ala)}>{svg}</ZoomPan>
      )}

      <Legenda itens={LEGENDA_BLOCO_A} />
    </div>
  );
}

function renderColuna(
  linhas: LinhaPlanta[],
  x: number,
  yInicio: number,
  largura: number,
  salaAtivaId: string | undefined,
  onSelecionar: (id: string) => void
) {
  let yAtual = yInicio;
  return linhas.map((linha, li) => {
    const yLinha = yAtual;
    yAtual += linha.altura;

    if (linha.celulas.length === 1) {
      const celula = linha.celulas[0];
      return (
        <CelulaSVG
          escalaFonte={ESCALA_FONTE_A}
          key={celula.id}
          x={x}
          y={yLinha}
          width={largura}
          height={linha.altura}
          celula={celula}
          ativa={salaAtivaId === celula.id}
          onClick={() => onSelecionar(celula.id)}
        />
      );
    }

    const metade = (largura - 6) / 2;
    return (
      <g key={`par-${li}`}>
        <CelulaSVG
          escalaFonte={ESCALA_FONTE_A}
          x={x}
          y={yLinha}
          width={metade}
          height={linha.altura}
          celula={linha.celulas[0]}
          ativa={salaAtivaId === linha.celulas[0].id}
          onClick={() => onSelecionar(linha.celulas[0].id)}
        />
        <CelulaSVG
          escalaFonte={ESCALA_FONTE_A}
          x={x + metade + 6}
          y={yLinha}
          width={metade}
          height={linha.altura}
          celula={linha.celulas[1]}
          ativa={salaAtivaId === linha.celulas[1].id}
          onClick={() => onSelecionar(linha.celulas[1].id)}
        />
      </g>
    );
  });
}

function SeletorAndar({
  andares,
  andar,
  onChange,
}: {
  andares: Andar[];
  andar: AndarId | null;
  onChange: (a: AndarId) => void;
}) {
  return (
    <div className="mb-4 inline-flex flex-wrap gap-2" role="group" aria-label="Selecionar andar">
      {andares.map((a) => (
        <button
          key={a.id}
          type="button"
          aria-pressed={andar === a.id}
          onClick={() => onChange(a.id)}
          className={`rounded-full border px-4 py-1.5 text-[12px] font-medium transition-all duration-300 cursor-pointer ${
            andar === a.id
              ? "border-neon bg-neon/10 text-neon"
              : "border-border text-muted-foreground hover:border-neon/60 hover:text-foreground"
          }`}
        >
          {a.rotulo}
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* MAPA GERAL DO CAMPUS (A a H)                                        */
/* Vetorizado a partir do quadro real "Escola Técnica Federal de São   */
/* Paulo": blocos F/G/H, corredor amarelo do Bloco A, blocos E/D/C/B,  */
/* pista de atletismo, vestiários, teatro e vias de acesso.            */
/* ------------------------------------------------------------------ */

const CORES_BLOCOS: Record<string, string> = {
  F: "#7c3aed",
  G: "#71717a",
  H: "#be123c",
  E: "#7c3aed",
  D: "#15803d",
  C: "#f97316",
  B: "#c026d3",
};

function BlocoMapa({
  sigla,
  x,
  y,
  width,
  height,
  legenda,
  onClick,
  onHover,
}: {
  sigla: string;
  x: number;
  y: number;
  width: number;
  height: number;
  legenda: string;
  onClick: () => void;
  onHover: (ativo: boolean) => void;
}) {
  const cor = CORES_BLOCOS[sigla];
  return (
    <g
      onClick={onClick}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onFocus={() => onHover(true)}
      onBlur={() => onHover(false)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Abrir o Bloco ${sigla}: ${legenda}`}
      className="cursor-pointer group outline-none focus-visible:[&>rect:first-of-type]:stroke-neon"
    >
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="#18181b"
        stroke="#3f3f46"
        strokeWidth="2"
        rx="6"
        className="transition-all duration-300 group-hover:fill-neon/20 group-hover:stroke-neon"
      />
      <rect x={x + 6} y={y + 4} width={width - 12} height="4" rx="2" fill={cor} opacity="0.85" />
      <text
        x={x + width / 2}
        y={y + height / 2 + 9}
        fontSize="24"
        fontWeight="bold"
        textAnchor="middle"
        fill="#a1a1aa"
        className="group-hover:fill-neon"
      >
        {sigla}
      </text>
      <text x={x + width / 2} y={y + height - 8} fontSize="7.5" textAnchor="middle" fill="#71717a">
        {legenda}
      </text>
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* DADOS DOS BLOCOS                                                    */
/* ------------------------------------------------------------------ */

const blocosCampus: Bloco[] = [
  {
    id: "bloco-a",
    sigla: "Bloco A",
    nome: "Bloco A - Licenciaturas",
    descricao:
      "Reitoria, coordenadorias de curso, departamentos e laboratórios distribuídos pelas alas do bloco (salas 115 a 123 no subsolo, 200–211 no intermediário e 300–356 no 1º pavimento).",
    andares: [
      { id: "subsolo", rotulo: "Subsolo" },
      { id: "pav1", rotulo: "1º pavimento" },
    ],
    andarPadrao: "pav1",
    salas: [...salasBlocoAPav1, ...salasDaPlanta("bloco-a:subsolo", "subsolo")],
  },
  {
    id: "bloco-b",
    sigla: "Bloco B",
    nome: "Bloco B - Em Construção",
    descricao: "Bloco ainda não construído, conforme a sinalização oficial do campus.",
    salas: [{ id: "b-construcao", nome: "Bloco em construção", tipo: "Previsão de expansão do campus" }],
  },
  {
    id: "bloco-c",
    sigla: "Bloco C",
    nome: "Bloco C - Eletrônica e Sistemas",
    descricao:
      "Salas de aula (500 a 518) e laboratórios (LAB1 a LAB16) de eletrônica e sistemas, distribuídos em 2 andares: térreo e mezanino.",
    andares: [
      { id: "terreo", rotulo: "Térreo" },
      { id: "mezanino", rotulo: "Mezanino" },
    ],
    andarPadrao: "terreo",
    salas: [...salasDaPlanta("bloco-c:terreo", "terreo"), ...salasDaPlanta("bloco-c:mezanino", "mezanino")],
  },
  {
    id: "bloco-d",
    sigla: "Bloco D",
    nome: "Bloco D - Automações",
    descricao:
      "Laboratórios de automação industrial, robótica e pneumática, com salas 601 a 647 e D1 a D10, distribuídas em 2 andares: térreo e mezanino. Abriga a Sala dos Professores da DEL.",
    andares: [
      { id: "terreo", rotulo: "Térreo" },
      { id: "mezanino", rotulo: "Mezanino" },
    ],
    andarPadrao: "terreo",
    salas: [...salasDaPlanta("bloco-d:terreo", "terreo"), ...salasDaPlanta("bloco-d:mezanino", "mezanino")],
  },
  {
    id: "bloco-e",
    sigla: "Bloco E",
    nome: "Bloco E - Mecânicas",
    descricao:
      "Oficinas e laboratórios de mecânica (salas 700 a 713), com a área de usinagem (retífica, fresadora e centro de usinagem). Os marcadores coloridos indicam o EPI exigido em cada área.",
    andares: [{ id: "terreo", rotulo: "Oficina" }],
    andarPadrao: "terreo",
    salas: salasDaPlanta("bloco-e:terreo", "terreo"),
  },
  {
    id: "bloco-f",
    sigla: "Bloco F",
    nome: "Bloco F - Diretoria",
    descricao: "Diretoria-Geral, gabinetes da direção e secretarias administrativas (salas 800 a 815).",
    salas: [
      { id: "f1", nome: "Gabinete da Diretoria-Geral", tipo: "Gestão" },
      { id: "f2", nome: "Secretaria Administrativa", tipo: "Administrativo" },
    ],
  },
  {
    id: "bloco-g",
    sigla: "Bloco G",
    nome: "Bloco G - Em Construção",
    descricao: "Área do campus ainda a construir, conforme a sinalização oficial do campus.",
    salas: [{ id: "g-construcao", nome: "Bloco em construção", tipo: "Previsão de expansão do campus" }],
  },
  {
    id: "bloco-h",
    sigla: "Bloco H",
    nome: "Bloco H - Engenharias",
    descricao: "Laboratórios avançados, salas de aula e coordenações de Engenharias (salas 900 a 926).",
    salas: [
      { id: "h1", nome: "Laboratórios de Engenharia", tipo: "Prática" },
      { id: "h2", nome: "Coordenações de Engenharias", tipo: "Atendimento" },
    ],
  },
];

function andarInicial(bloco: Bloco): AndarId | null {
  return bloco.andarPadrao ?? bloco.andares?.[0]?.id ?? null;
}

function normalizar(texto: string): string {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function rotuloAndar(bloco: Bloco | null, id?: AndarId): string | undefined {
  return bloco?.andares?.find((a) => a.id === id)?.rotulo;
}

/* ------------------------------------------------------------------ */
/* COMPONENTE PRINCIPAL                                                */
/* ------------------------------------------------------------------ */

export function MapaCampus() {
  const ref = useReveal<HTMLDivElement>();
  const [blocoSelecionado, setBlocoSelecionado] = useState<Bloco | null>(null);
  const [salaAtiva, setSalaAtiva] = useState<Sala | null>(null);
  const [andarAtivo, setAndarAtivo] = useState<AndarId | null>(null);
  const [blocoPrevia, setBlocoPrevia] = useState<Bloco | null>(null);
  const [busca, setBusca] = useState("");

  // Blocos sem andar definido mostram tudo; os demais filtram pelo andar ativo.
  const salasVisiveis = blocoSelecionado
    ? blocoSelecionado.salas.filter((s) => s.andar === undefined || s.andar === andarAtivo)
    : [];

  const mostrarPlantaA1 = blocoSelecionado?.id === "bloco-a" && andarAtivo === "pav1";
  const plantaAtual =
    blocoSelecionado && andarAtivo ? plantasAndar[`${blocoSelecionado.id}:${andarAtivo}`] : undefined;
  const temPlanta = mostrarPlantaA1 || !!plantaAtual;

  const selecionarBloco = (bloco: Bloco) => {
    setBlocoSelecionado(bloco);
    setSalaAtiva(null);
    setBlocoPrevia(null);
    setAndarAtivo(andarInicial(bloco));
  };

  const voltarAoMapaGeral = () => {
    setBlocoSelecionado(null);
    setSalaAtiva(null);
    setAndarAtivo(null);
  };

  const handleBlocoClick = (sigla: string) => {
    const bloco = blocosCampus.find((b) => b.id === `bloco-${sigla.toLowerCase()}`);
    if (bloco) selecionarBloco(bloco);
  };

  const selecionarSalaPorId = (id: string) => {
    const sala = blocoSelecionado?.salas.find((s) => s.id === id);
    if (sala) setSalaAtiva(sala);
  };

  const andarDaSala = rotuloAndar(blocoSelecionado, salaAtiva?.andar);

  const aoPassar = (sigla: string) => (ativo: boolean) =>
    setBlocoPrevia(ativo ? (blocosCampus.find((b) => b.id === `bloco-${sigla.toLowerCase()}`) ?? null) : null);

  const termoBusca = normalizar(busca.trim());
  const resultados =
    termoBusca.length < 2
      ? []
      : blocosCampus
          .flatMap((bloco) =>
            bloco.salas
              .filter((sala) => normalizar(`${sala.nome} ${sala.numero ?? ""} ${sala.tipo}`).includes(termoBusca))
              .map((sala) => ({ bloco, sala }))
          )
          .slice(0, 8);

  const irParaSala = (bloco: Bloco, sala: Sala) => {
    setBlocoSelecionado(bloco);
    setAndarAtivo(sala.andar ?? andarInicial(bloco));
    setSalaAtiva(sala);
    setBlocoPrevia(null);
    setBusca("");
  };

  return (
    <section id="mapa" className="relative px-5 py-24">
      <div ref={ref} className="mx-auto max-w-6xl">
        <header className="max-w-2xl">
          <p data-reveal className="text-[12px] tracking-[0.2em] text-neon-soft uppercase">
            Planta Interativa do Campus
          </p>
          <h2 data-reveal className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">
            {blocoSelecionado ? blocoSelecionado.nome : "Mapa Geral do Campus (A a H)"}
          </h2>
          <p data-reveal className="mt-3 text-muted-foreground">
            {blocoSelecionado
              ? "Confira os departamentos e salas deste bloco. Clique em voltar para ver o mapa geral."
              : "Passe o mouse ou clique em qualquer bloco (A a H) na silhueta do campus abaixo."}
          </p>
        </header>

        <div className="relative mt-6 max-w-2xl">
          <input
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar sala ou laboratório (ex.: C205, LAB3, Retífica, 301)"
            aria-label="Buscar sala, laboratório ou departamento"
            className="w-full rounded-full border border-border bg-secondary/40 px-5 py-2.5 text-[13px] text-foreground transition-all duration-300 placeholder:text-muted-foreground focus:border-neon focus:outline-none"
          />
          {termoBusca.length >= 2 && (
            <ul className="absolute z-20 mt-2 w-full space-y-1 rounded-2xl border border-border/80 bg-background/95 p-1.5 shadow-lg backdrop-blur">
              {resultados.length === 0 ? (
                <li className="px-3.5 py-2 text-[12px] text-muted-foreground">Nenhum ambiente encontrado.</li>
              ) : (
                resultados.map(({ bloco, sala }) => (
                  <li key={sala.id}>
                    <button
                      type="button"
                      onClick={() => irParaSala(bloco, sala)}
                      className="w-full cursor-pointer rounded-xl px-3.5 py-2 text-left transition-all duration-300 hover:bg-secondary/60"
                    >
                      <span className="block text-[13px] font-medium text-foreground">{sala.nome}</span>
                      <span className="block text-[11px] text-muted-foreground">
                        {bloco.sigla} · {sala.tipo}
                        {rotuloAndar(bloco, sala.andar) ? ` · ${rotuloAndar(bloco, sala.andar)}` : ""}
                      </span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>

        {blocoSelecionado && (
          <div className="mt-6">
            <button
              onClick={voltarAoMapaGeral}
              className="glass inline-flex items-center gap-2 rounded-full px-5 py-2 text-[13px] font-medium text-neon transition-all hover:bg-neon/10 cursor-pointer"
            >
              ← Voltar para o Mapa Geral
            </button>
          </div>
        )}

        <div className="mt-6 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
          {/* MAPA SVG DARK MINIMALISTA (SILHUETAS COM HOVER NEON) */}
          <div
            data-reveal
            className={`glass grid-lines relative overflow-hidden rounded-3xl p-4 flex items-center justify-center bg-background/60 border border-border/80 ${
              temPlanta ? "min-h-[620px]" : "min-h-[500px]"
            }`}
          >
            {!blocoSelecionado ? (
              <div className="w-full h-full flex items-center justify-center">
                <svg
                  viewBox="0 0 700 500"
                  className="w-full h-full max-h-[520px] drop-shadow-lg rounded-2xl"
                  xmlns="http://www.w3.org/2000/svg"
                  fontFamily="Arial, Helvetica, sans-serif"
                >
                  {/* Fundo Dark Geral do Mapa */}
                  <rect width="700" height="500" fill="#09090b" rx="16" />

                  {/* Rua R. Dr. Pedro Vicente — faixa lateral direita */}
                  <rect x="680" y="30" width="16" height="400" fill="#1c1c1f" />
                  <text
                    x="688"
                    y="230"
                    fontSize="8"
                    fill="#52525b"
                    textAnchor="middle"
                    letterSpacing="1"
                    transform="rotate(-90 688 230)"
                  >
                    R. DR. PEDRO VICENTE
                  </text>

                  {/* Linha 1 — Blocos F, G, H */}
                  <BlocoMapa sigla="F" x={24} y={40} width={120} height={72} legenda="DIRETORIA" onClick={() => handleBlocoClick("F")} onHover={aoPassar("F")} />
                  <BlocoMapa sigla="G" x={154} y={40} width={300} height={72} legenda="EM CONSTRUÇÃO" onClick={() => handleBlocoClick("G")} onHover={aoPassar("G")} />
                  <BlocoMapa sigla="H" x={464} y={40} width={212} height={72} legenda="ENGENHARIAS" onClick={() => handleBlocoClick("H")} onHover={aoPassar("H")} />

                  {/* Faixa amarela — Bloco A (corredor / "você está aqui") */}
                  <g
                    onClick={() => handleBlocoClick("A")}
                    onMouseEnter={() => aoPassar("A")(true)}
                    onMouseLeave={() => aoPassar("A")(false)}
                    onFocus={() => aoPassar("A")(true)}
                    onBlur={() => aoPassar("A")(false)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleBlocoClick("A");
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label="Abrir o Bloco A: Licenciaturas"
                    className="cursor-pointer group outline-none focus-visible:[&>rect:first-of-type]:stroke-neon"
                  >
                    <rect
                      x="24"
                      y="120"
                      width="652"
                      height="30"
                      fill="#eab308"
                      rx="6"
                      className="transition-all duration-300 group-hover:fill-amber-400"
                    />
                    <line x1="160" y1="135" x2="182" y2="135" stroke="#dc2626" strokeWidth="2" />
                    <circle cx="182" cy="135" r="4" fill="#dc2626" className="motion-safe:animate-pulse" />
                    <text x="40" y="139" fontSize="9" fontWeight="bold" fill="#1c1917">
                      VOCÊ ESTÁ AQUI
                    </text>
                    <text x="600" y="142" fontSize="22" fontWeight="bold" textAnchor="middle" fill="#1c1917">
                      A
                    </text>
                  </g>

                  {/* Linha 2 — Blocos E, D, C, B (com conectores elevados) */}
                  <circle cx="184" cy="166" r="9" fill="#eab308" opacity="0.85" />
                  <circle cx="350" cy="166" r="9" fill="#eab308" opacity="0.85" />

                  <BlocoMapa sigla="E" x={24} y={166} width={154} height={92} legenda="MECÂNICAS" onClick={() => handleBlocoClick("E")} onHover={aoPassar("E")} />
                  <BlocoMapa sigla="D" x={190} y={166} width={154} height={92} legenda="AUTOMAÇÕES" onClick={() => handleBlocoClick("D")} onHover={aoPassar("D")} />
                  <BlocoMapa sigla="C" x={356} y={166} width={154} height={92} legenda="ELETRÔNICA E SISTEMAS" onClick={() => handleBlocoClick("C")} onHover={aoPassar("C")} />
                  <BlocoMapa sigla="B" x={522} y={166} width={154} height={92} legenda="EM CONSTRUÇÃO" onClick={() => handleBlocoClick("B")} onHover={aoPassar("B")} />

                  {/* Área verde — jardim, pista de atletismo, teatro e vestiários */}
                  <rect x="24" y="270" width="652" height="150" fill="#0f1a14" stroke="#1c2b21" rx="12" />

                  <ellipse cx="120" cy="336" rx="55" ry="32" fill="none" stroke="#1c2b21" strokeWidth="12" />
                  <ellipse cx="120" cy="336" rx="55" ry="32" fill="none" stroke="#2d4a3a" strokeWidth="2" />
                  <ellipse cx="120" cy="336" rx="30" ry="13" fill="#122016" stroke="#2d4a3a" strokeWidth="1" />
                  <text x="120" y="386" fontSize="7" textAnchor="middle" fill="#52525b">
                    PISTA DE ATLETISMO
                  </text>

                  <rect x="258" y="308" width="56" height="42" fill="#18181b" stroke="#3f3f46" rx="6" />
                  <circle cx="273" cy="322" r="4" fill="#3f3f46" />
                  <circle cx="299" cy="322" r="4" fill="#3f3f46" />
                  <circle cx="273" cy="338" r="4" fill="#3f3f46" />
                  <circle cx="299" cy="338" r="4" fill="#3f3f46" />
                  <text x="286" y="364" fontSize="7.5" textAnchor="middle" fill="#71717a">
                    VESTIÁRIOS
                  </text>

                  <rect x="420" y="308" width="60" height="30" fill="#18181b" stroke="#3f3f46" rx="6" />
                  <text x="450" y="327" fontSize="12" textAnchor="middle" fill="#71717a">
                    🎭
                  </text>
                  <text x="450" y="352" fontSize="7.5" textAnchor="middle" fill="#71717a">
                    TEATRO
                  </text>

                  {/* Rua Av. Cruzeiro do Sul — faixa inferior */}
                  <rect x="24" y="430" width="652" height="26" fill="#18181b" stroke="#27272a" rx="6" />
                  <text x="350" y="447" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#71717a" letterSpacing="1">
                    AV. CRUZEIRO DO SUL
                  </text>
                </svg>
              </div>
            ) : (
              /* DETALHES DO BLOCO SELECIONADO */
              <div className="w-full h-full flex flex-col justify-center animate-in fade-in duration-300">
                <div className="mb-4">
                  <span className="text-xs uppercase tracking-wider text-neon font-semibold">
                    {blocoSelecionado.sigla}
                  </span>
                  <h4 className="text-lg font-bold text-foreground mt-1">{blocoSelecionado.nome}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{blocoSelecionado.descricao}</p>
                </div>

                {blocoSelecionado.andares && blocoSelecionado.andares.length > 1 && (
                  <SeletorAndar
                    andares={blocoSelecionado.andares}
                    andar={andarAtivo}
                    onChange={(a) => {
                      setAndarAtivo(a);
                      setSalaAtiva(null);
                    }}
                  />
                )}

                {mostrarPlantaA1 ? (
                  <PlantaBlocoA salaAtivaId={salaAtiva?.id} onSelecionar={selecionarSalaPorId} />
                ) : plantaAtual ? (
                  <PlantaAndarSVG
                    key={`${blocoSelecionado.id}:${andarAtivo}`}
                    planta={plantaAtual}
                    salaAtivaId={salaAtiva?.id}
                    onSelecionar={selecionarSalaPorId}
                  />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                    {salasVisiveis.map((sala) => (
                      <div
                        key={sala.id}
                        onClick={() => setSalaAtiva(sala)}
                        className={`cursor-pointer rounded-2xl border p-4 transition-all duration-300 ${
                          salaAtiva?.id === sala.id
                            ? "border-neon bg-neon/10 text-foreground shadow-sm"
                            : "border-border/80 bg-secondary/40 text-muted-foreground hover:border-neon/50 hover:text-foreground"
                        }`}
                      >
                        <h5 className="text-sm font-bold text-foreground">{sala.nome}</h5>
                        <p className="text-xs mt-0.5 opacity-80">{sala.tipo}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* PAINEL LATERAL DINÂMICO */}
          <aside data-reveal className="glass flex flex-col rounded-3xl p-6 justify-between border border-border/80 bg-background/60">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                {blocoSelecionado
                  ? salaAtiva
                    ? salaAtiva.nome
                    : blocoSelecionado.nome
                  : blocoPrevia
                    ? blocoPrevia.nome
                    : "Navegação por Blocos (A - H)"}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {blocoSelecionado
                  ? salaAtiva
                    ? `${salaAtiva.tipo} · Localizado no ${blocoSelecionado.nome}${andarDaSala ? ` (${andarDaSala})` : ""}.`
                    : blocoSelecionado.descricao
                  : blocoPrevia
                    ? `${blocoPrevia.descricao} Clique para abrir a planta.`
                    : "Passe o mouse ou clique em qualquer bloco no mapa para visualizar os departamentos."}
              </p>
            </div>

            <div className="mt-6">
              <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase mb-3">
                {blocoSelecionado ? "Ambientes do Bloco" : "Lista Rápida de Blocos"}
              </p>
              <ul className="space-y-1.5 max-h-[260px] overflow-y-auto pr-1">
                {!blocoSelecionado
                  ? blocosCampus.map((bloco) => (
                      <li key={bloco.id}>
                        <button
                          type="button"
                          onClick={() => selecionarBloco(bloco)}
                          className="w-full rounded-xl border border-border px-3.5 py-2 text-left text-[13px] text-muted-foreground transition-all duration-300 hover:border-neon/60 hover:text-foreground hover:bg-secondary/40 flex items-center justify-between cursor-pointer"
                        >
                          <span className="font-medium text-foreground">{bloco.sigla}</span>
                          <span className="text-[11px] opacity-70 truncate max-w-[140px]">
                            {bloco.nome.split(" - ")[1]}
                          </span>
                        </button>
                      </li>
                    ))
                  : salasVisiveis.map((sala) => (
                      <li key={sala.id}>
                        <button
                          type="button"
                          onClick={() => setSalaAtiva(sala)}
                          className={`w-full rounded-xl border px-3.5 py-2 text-left text-[13px] transition-all duration-300 cursor-pointer ${
                            salaAtiva?.id === sala.id
                              ? "border-neon bg-secondary/60 text-foreground"
                              : "border-border text-muted-foreground hover:border-neon/60 hover:text-foreground"
                          }`}
                        >
                          <span className="font-medium text-foreground">{sala.nome}</span>
                          <span className="block text-[11px] opacity-70">{sala.tipo}</span>
                        </button>
                      </li>
                    ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
