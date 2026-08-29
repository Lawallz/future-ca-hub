import { useState } from "react";
import { useReveal } from "@/lib/gsap-reveal";

type Sala = {
  id: string;
  nome: string;
  tipo: string;
};

type Bloco = {
  id: string;
  sigla: string;
  nome: string;
  descricao: string;
  salas: Sala[];
};

const blocosCampus: Bloco[] = [
  {
    id: "bloco-a",
    sigla: "Bloco A",
    nome: "Bloco A - Licenciaturas",
    descricao: "Salas de aula, colegiados e departamentos de Licenciaturas.",
    salas: [
      { id: "a1", nome: "Salas de Aula - Licenciaturas", tipo: "Teóricas" },
      { id: "a2", nome: "Coordenações de Cursos", tipo: "Atendimento" },
    ],
  },
  {
    id: "bloco-b",
    sigla: "Bloco B",
    nome: "Bloco B - Biblioteca",
    descricao: "Acervo bibliográfico, salas de estudo individual e em grupo.",
    salas: [
      { id: "b1", nome: "Balcão de Atendimento e Empréstimo", tipo: "Biblioteca" },
      { id: "b2", nome: "Salas de Estudo em Grupo", tipo: "Pesquisa" },
    ],
  },
  {
    id: "bloco-c",
    sigla: "Bloco C",
    nome: "Bloco C - Eletrônica e Sistemas",
    descricao: "Laboratórios de eletrônica, microcontroladores e sistemas de computação.",
    salas: [
      { id: "c1", nome: "Lab de Eletrônica Digital", tipo: "Prática" },
      { id: "c2", nome: "Lab de Sistemas Embarcados", tipo: "Tecnologia" },
    ],
  },
  {
    id: "bloco-d",
    sigla: "Bloco D",
    nome: "Bloco D - Automações",
    descricao: "Laboratórios de automação industrial, robótica e pneumática.",
    salas: [
      { id: "d1", nome: "Lab de Automação Industrial", tipo: "Prática" },
      { id: "d2", nome: "Sala de Robótica", tipo: "Desenvolvimento" },
    ],
  },
  {
    id: "bloco-e",
    sigla: "Bloco E",
    nome: "Bloco E - Mecânicas",
    descricao: "Oficinas, laboratórios de mecânica dos fluidos e resistência dos materiais.",
    salas: [
      { id: "e1", nome: "Oficina Mecânica", tipo: "Prática" },
      { id: "e2", nome: "Lab de Ensaios de Materiais", tipo: "Pesquisa" },
    ],
  },
  {
    id: "bloco-f",
    sigla: "Bloco F",
    nome: "Bloco F - Diretoria",
    descricao: "Diretoria-Geral, gabinetes da direção e secretarias administrativas.",
    salas: [
      { id: "f1", nome: "Gabinete da Diretoria-Geral", tipo: "Gestão" },
      { id: "f2", nome: "Secretaria Administrativa", tipo: "Administrativo" },
    ],
  },
  {
    id: "bloco-g",
    sigla: "Bloco G",
    nome: "Bloco G - Estacionamento / Em Construção",
    descricao: "Área de estacionamento do campus e novas obras de expansão.",
    salas: [
      { id: "g1", nome: "Área de Estacionamento", tipo: "Veículos" },
      { id: "g2", nome: "Setor de Obras e Expansão", tipo: "Em Construção" },
    ],
  },
  {
    id: "bloco-h",
    sigla: "Bloco H",
    nome: "Bloco H - Engenharias",
    descricao: "Laboratórios avançados, salas de aula e coordenações de Engenharias.",
    salas: [
      { id: "h1", nome: "Laboratórios de Engenharia", tipo: "Prática" },
      { id: "h2", nome: "Coordenações de Engenharias", tipo: "Atendimento" },
    ],
  },
];

export function MapaCampus() {
  const ref = useReveal<HTMLDivElement>();
  const [blocoSelecionado, setBlocoSelecionado] = useState<Bloco | null>(null);
  const [salaAtiva, setSalaAtiva] = useState<Sala | null>(null);

  const handleBlocoClick = (sigla: string) => {
    const blocoEncontrado = blocosCampus.find((b) => b.sigla.includes(sigla));
    if (blocoEncontrado) {
      setBlocoSelecionado(blocoEncontrado);
      setSalaAtiva(null);
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
              }}
              className="glass inline-flex items-center gap-2 rounded-full px-5 py-2 text-[13px] font-medium text-neon transition-all hover:bg-neon/10 cursor-pointer"
            >
              ← Voltar para o Mapa Geral
            </button>
          </div>
        )}

        <div className="mt-6 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
          {/* MAPA SVG DARK MINIMALISTA (SILHUETAS COM HOVER NEON) */}
          <div data-reveal className="glass grid-lines relative overflow-hidden rounded-3xl p-4 min-h-[480px] flex items-center justify-center bg-background/60 border border-border/80">
            {!blocoSelecionado ? (
              <div className="w-full h-full flex items-center justify-center">
                <svg
                  viewBox="0 0 700 950"
                  className="w-full h-full max-h-[500px] drop-shadow-lg rounded-2xl"
                  xmlns="http://www.w3.org/2000/svg"
                  font-family="Arial, Helvetica, sans-serif"
                >
                  {/* Fundo Dark Geral do Mapa */}
                  <rect width="700" height="950" fill="#09090b" rx="16" />

                  {/* Terreno / Áreas Externas e Ruas em Silhueta */}
                  <path d="M 60,60 L 640,60 L 640,890 L 60,890 Z" fill="#121216" opacity="0.8" />

                  {/* QUADRA ESPORTIVA EXTERNA */}
                  <g opacity="0.4">
                    <rect x="90" y="800" width="160" height="60" fill="#18181b" stroke="#3f3f46" stroke-width="1.5" rx="4" />
                    <text x="170" y="836" font-size="11" font-weight="bold" text-anchor="middle" fill="#71717a">QUADRA</text>
                  </g>

                  {/* Bloco F (Diretoria) */}
                  <g onClick={() => handleBlocoClick("F")} className="cursor-pointer group">
                    <rect x="90" y="90" width="100" height="90" fill="#18181b" stroke="#3f3f46" stroke-width="2" rx="6" className="transition-all duration-300 group-hover:fill-neon/20 group-hover:stroke-neon" />
                    <text x="140" y="142" font-size="28" font-weight="bold" text-anchor="middle" fill="#a1a1aa" className="group-hover:fill-neon">F</text>
                    <text x="140" y="155" font-size="9" text-anchor="middle" fill="#71717a">DIRETORIAS</text>
                  </g>

                  {/* Bloco G (Estacionamento) */}
                  <g onClick={() => handleBlocoClick("G")} className="cursor-pointer group">
                    <rect x="210" y="90" width="230" height="90" fill="#18181b" stroke="#3f3f46" stroke-width="2" rx="6" className="transition-all duration-300 group-hover:fill-neon/20 group-hover:stroke-neon" />
                    <text x="325" y="132" font-size="28" font-weight="bold" text-anchor="middle" fill="#a1a1aa" className="group-hover:fill-neon">G</text>
                    <text x="325" y="155" font-size="9" text-anchor="middle" fill="#71717a">ESTACIONAMENTO</text>
                  </g>

                  {/* Bloco H (Engenharias) */}
                  <g onClick={() => handleBlocoClick("H")} className="cursor-pointer group">
                    <rect x="460" y="90" width="150" height="90" fill="#18181b" stroke="#3f3f46" stroke-width="2" rx="6" className="transition-all duration-300 group-hover:fill-neon/20 group-hover:stroke-neon" />
                    <text x="535" y="142" font-size="28" font-weight="bold" text-anchor="middle" fill="#a1a1aa" className="group-hover:fill-neon">H</text>
                    <text x="535" y="155" font-size="9" text-anchor="middle" fill="#71717a">ENGENHARIAS</text>
                  </g>

                  {/* Bloco A (Licenciaturas - Corredor Central) */}
                  <g onClick={() => handleBlocoClick("A")} className="cursor-pointer group">
                    <rect x="90" y="205" width="520" height="75" fill="#18181b" stroke="#3f3f46" stroke-width="2" rx="6" className="transition-all duration-300 group-hover:fill-neon/20 group-hover:stroke-neon" />
                    <text x="350" y="252" font-size="36" font-weight="bold" text-anchor="middle" fill="#a1a1aa" className="group-hover:fill-neon">A</text>
                    <text x="350" y="265" font-size="9" text-anchor="middle" fill="#71717a">LICENCIATURAS</text>
                  </g>

                  {/* Bloco E (Mecânicas) */}
                  <g onClick={() => handleBlocoClick("E")} className="cursor-pointer group">
                    <rect x="90" y="310" width="110" height="110" fill="#18181b" stroke="#3f3f46" stroke-width="2" rx="6" className="transition-all duration-300 group-hover:fill-neon/20 group-hover:stroke-neon" />
                    <text x="145" y="375" font-size="28" font-weight="bold" text-anchor="middle" fill="#a1a1aa" className="group-hover:fill-neon">E</text>
                    <text x="145" y="388" font-size="9" text-anchor="middle" fill="#71717a">MECÂNICAS</text>
                  </g>

                  {/* Bloco D (Automações) */}
                  <g onClick={() => handleBlocoClick("D")} className="cursor-pointer group">
                    <rect x="215" y="310" width="115" height="110" fill="#18181b" stroke="#3f3f46" stroke-width="2" rx="6" className="transition-all duration-300 group-hover:fill-neon/20 group-hover:stroke-neon" />
                    <text x="272" y="375" font-size="28" font-weight="bold" text-anchor="middle" fill="#a1a1aa" className="group-hover:fill-neon">D</text>
                    <text x="272" y="388" font-size="9" text-anchor="middle" fill="#71717a">AUTOMAÇÕES</text>
                  </g>

                  {/* Bloco C (Eletrônica e Sistemas) */}
                  <g onClick={() => handleBlocoClick("C")} className="cursor-pointer group">
                    <rect x="345" y="310" width="115" height="110" fill="#18181b" stroke="#3f3f46" stroke-width="2" rx="6" className="transition-all duration-300 group-hover:fill-neon/20 group-hover:stroke-neon" />
                    <text x="402" y="375" font-size="28" font-weight="bold" text-anchor="middle" fill="#a1a1aa" className="group-hover:fill-neon">C</text>
                    <text x="402" y="388" font-size="9" text-anchor="middle" fill="#71717a">ELETRÔNICA E SISTEMAS</text>
                  </g>

                  {/* Bloco B (Biblioteca) */}
                  <g onClick={() => handleBlocoClick("B")} className="cursor-pointer group">
                    <rect x="475" y="310" width="135" height="110" fill="#18181b" stroke="#3f3f46" stroke-width="2" rx="6" className="transition-all duration-300 group-hover:fill-neon/20 group-hover:stroke-neon" />
                    <text x="542" y="375" font-size="28" font-weight="bold" text-anchor="middle" fill="#a1a1aa" className="group-hover:fill-neon">B</text>
                    <text x="542" y="388" font-size="9" text-anchor="middle" fill="#71717a">BIBLIOTECA</text>
                  </g>

                  {/* Legenda Informativa Dark Clean */}
                  <g font-size="12" fill="#a1a1aa">
                    <rect x="90" y="450" width="520" height="325" fill="#18181b" rx="10" opacity="0.9" stroke="#27272a" />
                    <text x="350" y="482" font-size="14" font-weight="bold" text-anchor="middle" fill="#e4e4e7">📍 CLIQUE EM UM BLOCO PARA DETALHES</text>

                    <text x="125" y="520" font-size="16" font-weight="bold" fill="#fff">A</text>
                    <text x="155" y="517" font-size="13">Licenciaturas</text>

                    <text x="335" y="520" font-size="16" font-weight="bold" fill="#fff">B</text>
                    <text x="365" y="517" font-size="13">Biblioteca</text>

                    <text x="125" y="565" font-size="16" font-weight="bold" fill="#fff">C</text>
                    <text x="155" y="562" font-size="13">Eletrônica e Sistemas</text>

                    <text x="335" y="565" font-size="16" font-weight="bold" fill="#fff">D</text>
                    <text x="365" y="562" font-size="13">Automações</text>

                    <text x="125" y="610" font-size="16" font-weight="bold" fill="#fff">E</text>
                    <text x="155" y="607" font-size="13">Mecânicas</text>

                    <text x="335" y="610" font-size="16" font-weight="bold" fill="#fff">F</text>
                    <text x="365" y="607" font-size="13">Diretoria</text>

                    <text x="125" y="655" font-size="16" font-weight="bold" fill="#fff">G</text>
                    <text x="155" y="652" font-size="13">Estacionamento / Obras</text>

                    <text x="335" y="655" font-size="16" font-weight="bold" fill="#fff">H</text>
                    <text x="365" y="652" font-size="13">Engenharias</text>
                  </g>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  {blocoSelecionado.salas.map((sala) => (
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
                      ? `${salaAtiva.tipo} · Localizado no ${blocoSelecionado.nome}.`
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
                          onClick={() => setBlocoSelecionado(bloco)}
                          className="w-full rounded-xl border border-border px-3.5 py-2 text-left text-[13px] text-muted-foreground transition-all duration-300 hover:border-neon/60 hover:text-foreground hover:bg-secondary/40 flex items-center justify-between cursor-pointer"
                        >
                          <span className="font-medium text-foreground">{bloco.sigla}</span>
                          <span className="text-[11px] opacity-70 truncate max-w-[140px]">
                            {bloco.nome.split(" - ")[1]}
                          </span>
                        </button>
                      </li>
                    ))
                  : blocoSelecionado.salas.map((sala) => (
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