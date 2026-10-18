import { useState } from "react";
import { useReveal } from "@/lib/gsap-reveal";

type Sala = {
  id: string;
  nome: string;
  tipo: string;
  numero?: string;
  cor?: string;
  andar?: 1 | 2;
};

type Bloco = {
  id: string;
  sigla: string;
  nome: string;
  descricao: string;
  salas: Sala[];
};

/* ------------------------------------------------------------------ */
/* PLANTA VETORIZADA DO BLOCO A                                        */
/* Baseada no quadro de sinalização real do bloco (Reitoria / Turnos / */
/* Departamentos / Laboratórios), redesenhada no tema escuro do site.  */
/* ------------------------------------------------------------------ */

type CelulaPlanta = {
  id: string;
  nome: string;
  tipo: string;
  cor: string;
  numero?: string;
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

function cel(id: string, nome: string, tipo: string, cor: string, numero?: string): CelulaPlanta {
  return { id, nome, tipo, cor, numero };
}

function lin(altura: number, ...celulas: CelulaPlanta[]): LinhaPlanta {
  return { altura, celulas };
}

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
        });
      }
    }
  }
  return salas;
}

const salasBlocoA: Sala[] = secoesBlocoA.flatMap(salasDaSecao);

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

function CelulaSVG({
  x,
  y,
  width,
  height,
  celula,
  ativa,
  onClick,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  celula: CelulaPlanta;
  ativa: boolean;
  onClick: () => void;
}) {
  const fontSize = celula.tipo === "Ambiente" ? 10 : 8.5;
  const maxChars = Math.max(10, Math.floor(width / 5.3));
  const linhasTexto = quebrarTexto(celula.nome, maxChars).slice(0, 3);
  const lineHeight = fontSize + 2.6;
  const blocoAltura = (linhasTexto.length - 1) * lineHeight;
  const yTexto = y + height / 2 - blocoAltura / 2 + fontSize / 3;

  return (
    <g onClick={onClick} className="cursor-pointer group">
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
          x={x}
          y={yLinha}
          width={metade}
          height={linha.altura}
          celula={linha.celulas[0]}
          ativa={salaAtivaId === linha.celulas[0].id}
          onClick={() => onSelecionar(linha.celulas[0].id)}
        />
        <CelulaSVG
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

function PlantaBlocoA({
  salaAtivaId,
  onSelecionar,
}: {
  salaAtivaId?: string;
  onSelecionar: (id: string) => void;
}) {
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <svg
        viewBox={`0 0 ${LARGURA_TOTAL} ${ALTURA_TOTAL_SVG}`}
        className="h-full max-h-[600px] w-full drop-shadow-lg rounded-2xl"
        xmlns="http://www.w3.org/2000/svg"
        fontFamily="Arial, Helvetica, sans-serif"
      >
        <rect width={LARGURA_TOTAL} height={ALTURA_TOTAL_SVG} fill="#09090b" rx="16" />

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

        {secoesBlocoA.map((secao, i) => {
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

      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 px-2 text-[10px] text-muted-foreground">
        {LEGENDA_BLOCO_A.map((item) => (
          <span key={item.tipo} className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.cor }} />
            {item.tipo}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* BLOCO C — 2 ANDARES                                                 */
/* 2º andar vetorizado a partir do desenho à mão (planta em "U" com    */
/* duas alas, corredor em U, escadas de entrada, saídas e saguão).     */
/* Os nomes/números das salas são provisórios (exceto a sala 213):     */
/* edite o campo `nome` de cada sala em `zonasBlocoC2` quando tiver    */
/* a identificação real.                                               */
/* ------------------------------------------------------------------ */

type ZonaPlanta = {
  celula: CelulaPlanta;
  x: number;
  y: number;
  w: number;
  h: number;
  escada?: { seta?: "↑" | "↓" };
};

function colunaSalas(
  idPrefixo: string,
  nomeBase: string,
  x: number,
  y0: number,
  w: number,
  h: number,
  n: number
): ZonaPlanta[] {
  return Array.from({ length: n }, (_, k) => ({
    celula: cel(`${idPrefixo}-${k + 1}`, `${nomeBase} ${k + 1}`, "Sala", C_CINZA),
    x,
    y: y0 + k * h,
    w,
    h,
  }));
}

function linhaSalas(
  idPrefixo: string,
  nomeBase: string,
  x0: number,
  y: number,
  w: number,
  h: number,
  n: number
): ZonaPlanta[] {
  return Array.from({ length: n }, (_, k) => ({
    celula: cel(`${idPrefixo}-${k + 1}`, `${nomeBase} ${k + 1}`, "Sala", C_CINZA),
    x: x0 + k * w,
    y,
    w,
    h,
  }));
}

const zonasBlocoC2: ZonaPlanta[] = [
  // Ala esquerda (externa e interna)
  ...colunaSalas("c2-ee", "Ala esquerda externa", 20, 195, 93, 61, 5),
  ...colunaSalas("c2-ei", "Ala esquerda interna", 155, 110, 108, 55, 5),
  // Ala direita (interna e externa — a última sala da externa é a 213)
  ...colunaSalas("c2-di", "Ala direita interna", 377, 110, 108, 55, 5),
  ...colunaSalas("c2-de", "Ala direita externa", 527, 195, 93, 61, 5).map((z, i, arr) =>
    i === arr.length - 1 ? { ...z, celula: cel("c2-213", "Sala 213", "Sala", C_CINZA, "213") } : z
  ),
  // Salas frontais, voltadas para o saguão
  ...linhaSalas("c2-f", "Sala frontal", 205, 425, 57.5, 75, 4),
  // Saídas (topo)
  { celula: cel("c2-saida-e", "Saída esquerda", "Saída", C_VERDE), x: 78, y: 40, w: 127, h: 70 },
  { celula: cel("c2-saida-d", "Saída direita", "Saída", C_VERDE), x: 435, y: 40, w: 127, h: 70 },
  // Escadas das saídas (topo)
  { celula: cel("c2-esc-saida-e", "Escada da saída esquerda", "Circulação", C_AMBAR), x: 78, y: 110, w: 35, h: 70, escada: {} },
  { celula: cel("c2-esc-saida-d", "Escada da saída direita", "Circulação", C_AMBAR), x: 527, y: 110, w: 35, h: 70, escada: {} },
  // Escadas de entrada (base)
  { celula: cel("c2-esc-e-sobe", "Escada de entrada esquerda — subida", "Circulação", C_AMBAR), x: 113, y: 425, w: 46, h: 75, escada: { seta: "↑" } },
  { celula: cel("c2-esc-e-desce", "Escada de entrada esquerda — descida", "Circulação", C_AMBAR), x: 159, y: 425, w: 46, h: 75, escada: { seta: "↓" } },
  { celula: cel("c2-esc-d-desce", "Escada de entrada direita — descida", "Circulação", C_AMBAR), x: 435, y: 425, w: 46, h: 75, escada: { seta: "↓" } },
  { celula: cel("c2-esc-d-sobe", "Escada de entrada direita — subida", "Circulação", C_AMBAR), x: 481, y: 425, w: 46, h: 75, escada: { seta: "↑" } },
  // Saguão
  { celula: cel("c2-saguao", "Saguão", "Área comum", C_TEAL), x: 205, y: 514, w: 230, h: 40 },
];

const salasBlocoC2: Sala[] = zonasBlocoC2.map(({ celula }) => ({
  id: celula.id,
  nome: celula.nome,
  tipo: celula.tipo,
  cor: celula.cor,
  numero: celula.numero,
  andar: 2,
}));

const LEGENDA_BLOCO_C2: { tipo: string; cor: string }[] = [
  { tipo: "Salas", cor: C_CINZA },
  { tipo: "Escadas", cor: C_AMBAR },
  { tipo: "Saídas", cor: C_VERDE },
  { tipo: "Saguão", cor: C_TEAL },
];

function EscadaSVG({
  zona,
  ativa,
  onClick,
}: {
  zona: ZonaPlanta;
  ativa: boolean;
  onClick: () => void;
}) {
  const { celula, x, y, w, h, escada } = zona;
  const degraus = Math.floor(h / 8);
  return (
    <g onClick={onClick} className="cursor-pointer group">
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

function PlantaBlocoC2({
  salaAtivaId,
  onSelecionar,
}: {
  salaAtivaId?: string;
  onSelecionar: (id: string) => void;
}) {
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <svg
        viewBox="0 0 640 580"
        className="h-full max-h-[600px] w-full drop-shadow-lg rounded-2xl"
        xmlns="http://www.w3.org/2000/svg"
        fontFamily="Arial, Helvetica, sans-serif"
      >
        <rect width="640" height="580" fill="#09090b" rx="16" />
        <text x="620" y="26" fontSize="10" fontWeight="bold" textAnchor="end" fill="#71717a" letterSpacing="1">
          2º ANDAR
        </text>

        {/* Corredor em U */}
        <path
          d="M113,110 L155,110 L155,385 L485,385 L485,110 L527,110 L527,425 L113,425 Z"
          fill="#101013"
          stroke="#27272a"
          strokeDasharray="4 4"
        />

        {zonasBlocoC2.map((zona) =>
          zona.escada ? (
            <EscadaSVG
              key={zona.celula.id}
              zona={zona}
              ativa={salaAtivaId === zona.celula.id}
              onClick={() => onSelecionar(zona.celula.id)}
            />
          ) : (
            <CelulaSVG
              key={zona.celula.id}
              x={zona.x}
              y={zona.y}
              width={zona.w}
              height={zona.h}
              celula={zona.celula}
              ativa={salaAtivaId === zona.celula.id}
              onClick={() => onSelecionar(zona.celula.id)}
            />
          )
        )}

        {/* Rótulos de entrada */}
        <text x="159" y="516" fontSize="8.5" fontWeight="bold" textAnchor="middle" fill="#71717a" letterSpacing="1">
          ENTRADA
        </text>
        <text x="481" y="516" fontSize="8.5" fontWeight="bold" textAnchor="middle" fill="#71717a" letterSpacing="1">
          ENTRADA
        </text>

        <line x1="20" y1="568" x2="620" y2="568" stroke="#27272a" strokeDasharray="4 4" />
      </svg>

      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 px-2 text-[10px] text-muted-foreground">
        {LEGENDA_BLOCO_C2.map((item) => (
          <span key={item.tipo} className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.cor }} />
            {item.tipo}
          </span>
        ))}
      </div>
    </div>
  );
}

function SeletorAndar({
  andar,
  onChange,
}: {
  andar: 1 | 2;
  onChange: (a: 1 | 2) => void;
}) {
  return (
    <div className="mb-4 inline-flex gap-2" role="group" aria-label="Selecionar andar">
      {([1, 2] as const).map((a) => (
        <button
          key={a}
          type="button"
          aria-pressed={andar === a}
          onClick={() => onChange(a)}
          className={`rounded-full border px-4 py-1.5 text-[12px] font-medium transition-all duration-300 cursor-pointer ${
            andar === a
              ? "border-neon bg-neon/10 text-neon"
              : "border-border text-muted-foreground hover:border-neon/60 hover:text-foreground"
          }`}
        >
          {a}º andar
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
}: {
  sigla: string;
  x: number;
  y: number;
  width: number;
  height: number;
  legenda: string;
  onClick: () => void;
}) {
  const cor = CORES_BLOCOS[sigla];
  return (
    <g onClick={onClick} className="cursor-pointer group">
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

export function MapaCampus() {
  const ref = useReveal<HTMLDivElement>();
  const [blocoSelecionado, setBlocoSelecionado] = useState<Bloco | null>(null);
  const [salaAtiva, setSalaAtiva] = useState<Sala | null>(null);
  const [andarAtivo, setAndarAtivo] = useState<1 | 2>(1);

  // Salas exibidas: blocos sem andar definido mostram tudo; o Bloco C filtra pelo andar.
  const salasVisiveis = blocoSelecionado
    ? blocoSelecionado.salas.filter((s) => s.andar === undefined || s.andar === andarAtivo)
    : [];

  const handleBlocoClick = (sigla: string) => {
    const blocoEncontrado = blocosCampus.find((b) => b.id === `bloco-${sigla.toLowerCase()}`);
    if (blocoEncontrado) {
      setBlocoSelecionado(blocoEncontrado);
      setSalaAtiva(null);
      setAndarAtivo(1);
    }
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

        {blocoSelecionado && (
          <div className="mt-6">
            <button
              onClick={() => {
                setBlocoSelecionado(null);
                setSalaAtiva(null);
                setAndarAtivo(1);
              }}
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
              blocoSelecionado?.id === "bloco-a" || (blocoSelecionado?.id === "bloco-c" && andarAtivo === 2)
                ? "min-h-[620px]"
                : "min-h-[500px]"
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
                  <BlocoMapa sigla="F" x={24} y={40} width={120} height={72} legenda="DIRETORIA" onClick={() => handleBlocoClick("F")} />
                  <BlocoMapa sigla="G" x={154} y={40} width={300} height={72} legenda="EM CONSTRUÇÃO" onClick={() => handleBlocoClick("G")} />
                  <BlocoMapa sigla="H" x={464} y={40} width={212} height={72} legenda="ENGENHARIAS" onClick={() => handleBlocoClick("H")} />

                  {/* Faixa amarela — Bloco A (corredor / "você está aqui") */}
                  <g onClick={() => handleBlocoClick("A")} className="cursor-pointer group">
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
                    <circle cx="182" cy="135" r="4" fill="#dc2626" />
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

                  <BlocoMapa sigla="E" x={24} y={166} width={154} height={92} legenda="MECÂNICAS" onClick={() => handleBlocoClick("E")} />
                  <BlocoMapa sigla="D" x={190} y={166} width={154} height={92} legenda="AUTOMAÇÕES" onClick={() => handleBlocoClick("D")} />
                  <BlocoMapa sigla="C" x={356} y={166} width={154} height={92} legenda="ELETRÔNICA E SISTEMAS" onClick={() => handleBlocoClick("C")} />
                  <BlocoMapa sigla="B" x={522} y={166} width={154} height={92} legenda="EM CONSTRUÇÃO" onClick={() => handleBlocoClick("B")} />

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
                  <h4 className="text-lg font-bold text-foreground mt-1">
                    {blocoSelecionado.nome}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {blocoSelecionado.descricao}
                  </p>
                </div>

                {blocoSelecionado.id === "bloco-c" && (
                  <SeletorAndar
                    andar={andarAtivo}
                    onChange={(a) => {
                      setAndarAtivo(a);
                      setSalaAtiva(null);
                    }}
                  />
                )}

                {blocoSelecionado.id === "bloco-a" ? (
                  <PlantaBlocoA
                    salaAtivaId={salaAtiva?.id}
                    onSelecionar={(id) => {
                      const sala = blocoSelecionado.salas.find((s) => s.id === id);
                      if (sala) setSalaAtiva(sala);
                    }}
                  />
                ) : blocoSelecionado.id === "bloco-c" && andarAtivo === 2 ? (
                  <PlantaBlocoC2
                    salaAtivaId={salaAtiva?.id}
                    onSelecionar={(id) => {
                      const sala = blocoSelecionado.salas.find((s) => s.id === id);
                      if (sala) setSalaAtiva(sala);
                    }}
                  />
                ) : (
                  <>
                    {blocoSelecionado.id === "bloco-c" && (
                      <p className="mb-3 rounded-2xl border border-dashed border-border/80 px-4 py-3 text-xs text-muted-foreground">
                        A planta do 1º andar ainda não foi adicionada. Por enquanto, estes são os ambientes cadastrados.
                      </p>
                    )}
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
                  </>
                )}
              </div>
            )}
          </div>

          {/* PAINEL LATERAL DINÂMICO */}
          <aside data-reveal className="glass flex flex-col rounded-3xl p-6 justify-between border border-border/80 bg-background/60">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                {blocoSelecionado
                  ? (salaAtiva ? salaAtiva.nome : blocoSelecionado.nome)
                  : "Navegação por Blocos (A - H)"}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {blocoSelecionado
                  ? (salaAtiva
                      ? `${salaAtiva.tipo} · Localizado no ${blocoSelecionado.nome}${salaAtiva.andar ? ` (${salaAtiva.andar}º andar)` : ""}.`
                      : blocoSelecionado.descricao)
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
                          onClick={() => {
                            setBlocoSelecionado(bloco);
                            setAndarAtivo(1);
                          }}
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

/* ------------------------------------------------------------------ */
/* DEMAIS BLOCOS DO CAMPUS                                             */
/* ------------------------------------------------------------------ */

const blocosCampus: Bloco[] = [
  {
    id: "bloco-a",
    sigla: "Bloco A",
    nome: "Bloco A - Licenciaturas",
    descricao:
      "Reitoria, coordenadorias de curso, departamentos e laboratórios distribuídos pelas três alas do bloco (salas 100–126 no subsolo, 200–211 no intermediário e 300–350 no 1º pavimento).",
    salas: salasBlocoA,
  },
  {
    id: "bloco-b",
    sigla: "Bloco B",
    nome: "Bloco B - Em Construção",
    descricao: "Bloco ainda não construído, conforme a sinalização oficial do campus.",
    salas: [
      { id: "b-construcao", nome: "Bloco em construção", tipo: "Previsão de expansão do campus" },
    ],
  },
  {
    id: "bloco-c",
    sigla: "Bloco C",
    nome: "Bloco C - Eletrônica e Sistemas",
    descricao: "Laboratórios de eletrônica, microcontroladores e sistemas de computação (salas 500 a 534). Possui 2 andares.",
    salas: [
      { id: "c1", nome: "Lab de Eletrônica Digital", tipo: "Prática", andar: 1 },
      { id: "c2", nome: "Lab de Sistemas Embarcados", tipo: "Tecnologia", andar: 1 },
      ...salasBlocoC2,
    ],
  },
  {
    id: "bloco-d",
    sigla: "Bloco D",
    nome: "Bloco D - Automações",
    descricao: "Laboratórios de automação industrial, robótica e pneumática (salas 600 a 626).",
    salas: [
      { id: "d1", nome: "Lab de Automação Industrial", tipo: "Prática" },
      { id: "d2", nome: "Sala de Robótica", tipo: "Desenvolvimento" },
    ],
  },
  {
    id: "bloco-e",
    sigla: "Bloco E",
    nome: "Bloco E - Mecânicas",
    descricao: "Oficinas, laboratórios de mecânica dos fluidos e resistência dos materiais (salas 700 a 713).",
    salas: [
      { id: "e1", nome: "Oficina Mecânica", tipo: "Prática" },
      { id: "e2", nome: "Lab de Ensaios de Materiais", tipo: "Pesquisa" },
    ],
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
    salas: [
      { id: "g-construcao", nome: "Bloco em construção", tipo: "Previsão de expansão do campus" },
    ],
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
