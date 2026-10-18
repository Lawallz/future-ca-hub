import { useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { areas, courses, dependentsOf } from "@/data/roadmap";
const normalize = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
export function Roadmap() {
  const [selected, setSelected] = useState("SPOPIE1");
  const [query, setQuery] = useState("");
  const active = courses.find((course) => course.code === selected)!;
  const next = dependentsOf(selected);
  const visible = courses.filter((course) =>
    normalize(`${course.code} ${course.name}`).includes(normalize(query)),
  );
  function select(code: string) {
    setSelected(code);
  }
  return (
    <section id="roadmap" className="relative scroll-mt-20 px-5 py-24">
      <div className="mx-auto max-w-6xl">
        <header className="max-w-2xl">
          <p className="text-neon-soft text-[12px] tracking-[0.2em] uppercase">
            Seu caminho em ADS
          </p>
          <h2 className="text-foreground mt-3 text-3xl font-bold sm:text-4xl">
            Roadmap das matérias
          </h2>
          <p className="text-muted-foreground mt-3">
            Explore os seis semestres. Selecione uma matéria para ver quais disciplinas vêm antes
            dela e quais dependem dela.
          </p>
        </header>
        <label className="glass mt-8 flex max-w-lg items-center gap-3 rounded-full px-5 py-3">
          <Search size={18} className="text-neon-soft" aria-hidden="true" />
          <span className="sr-only">Buscar matéria no roadmap</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Busque pelo nome ou código…"
            className="text-foreground min-w-0 flex-1 bg-transparent text-sm outline-none"
          />
        </label>
        <p role="status" className="text-muted-foreground mt-3 text-xs">
          {visible.length} matérias encontradas · role horizontalmente para ver os semestres.
        </p>
        <div
          className="border-border mt-6 overflow-x-auto rounded-3xl border p-4"
          role="region"
          aria-label="Matérias organizadas por semestre"
          tabIndex={0}
        >
          <div className="grid min-w-[1120px] grid-cols-6 gap-3">
            {[1, 2, 3, 4, 5, 6].map((semester) => (
              <div key={semester}>
                <h3 className="text-neon-soft mb-4 px-2 text-sm font-semibold">
                  {semester}º semestre
                </h3>
                <ul className="space-y-3">
                  {visible
                    .filter((course) => course.semester === semester)
                    .map((course) => {
                      const relation =
                        course.code === selected
                          ? "Selecionada"
                          : active.prerequisites.includes(course.code)
                            ? "Pré-requisito da selecionada"
                            : next.some((item) => item.code === course.code)
                              ? "Depende da selecionada"
                              : "";
                      return (
                        <li key={course.code}>
                          <button
                            type="button"
                            onClick={() => select(course.code)}
                            aria-pressed={course.code === selected}
                            aria-controls="roadmap-details"
                            className={`glass focus-visible:ring-neon w-full rounded-2xl border p-3 text-left transition-colors focus-visible:ring-2 focus-visible:outline-none ${relation ? "border-neon" : "border-border hover:border-neon/60"}`}
                          >
                            <span
                              className="mb-3 block h-1 w-8 rounded-full"
                              style={{ backgroundColor: areas[course.area].color }}
                              aria-hidden="true"
                            />
                            <strong className="text-foreground block text-sm">{course.code}</strong>
                            <span className="text-muted-foreground mt-2 block text-xs">
                              {course.name}
                            </span>
                            {course.optional && (
                              <span className="text-neon-soft mt-2 block text-[11px]">
                                Optativa
                              </span>
                            )}
                            {relation && (
                              <span className="text-neon-soft mt-3 block text-[10px]">
                                {relation}
                              </span>
                            )}
                            <span className="border-border text-muted-foreground mt-3 block border-t pt-2 text-[10px]">
                              {course.prerequisites.length
                                ? `Requer: ${course.prerequisites.join(" + ")}`
                                : "Sem pré-requisito indicado"}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                </ul>
              </div>
            ))}
          </div>
        </div>
        {!visible.length && (
          <div className="glass mt-4 rounded-2xl p-6">
            <p className="text-muted-foreground">Nenhuma matéria encontrada.</p>
            <button onClick={() => setQuery("")} className="text-neon-soft mt-3 text-sm underline">
              Limpar busca
            </button>
          </div>
        )}
        <div
          id="roadmap-details"
          className="glass mt-6 rounded-3xl p-6"
          aria-live="polite"
          aria-atomic="true"
        >
          <p className="text-neon-soft text-xs">
            {active.semester}º semestre{active.optional ? " · Optativa" : ""}
          </p>
          <h3 className="text-foreground mt-2 text-lg font-semibold">
            {active.code} · {active.name}
          </h3>
          <div className="mt-5 grid gap-6 sm:grid-cols-2">
            <div>
              <h4 className="text-foreground text-sm font-semibold">Pré-requisitos diretos</h4>
              <p className="text-muted-foreground mt-2 text-xs">
                {active.prerequisites.length
                  ? "Todas as matérias abaixo são pré-requisitos no diagrama:"
                  : "A imagem não indica pré-requisitos para esta matéria."}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {active.prerequisites.map((code) => (
                  <button
                    key={code}
                    onClick={() => select(code)}
                    className="border-border text-neon-soft hover:border-neon flex items-center gap-2 rounded-full border px-3 py-2 text-sm"
                  >
                    {code}
                    <ArrowRight size={14} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-foreground text-sm font-semibold">Matérias que dependem dela</h4>
              <p className="text-muted-foreground mt-2 text-xs">
                {next.length
                  ? "Esta matéria é um dos requisitos das seguintes disciplinas:"
                  : "Nenhuma dependência posterior indicada na imagem."}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {next.map((course) => (
                  <button
                    key={course.code}
                    onClick={() => select(course.code)}
                    className="border-border text-neon-soft hover:border-neon flex items-center gap-2 rounded-full border px-3 py-2 text-sm"
                  >
                    <ArrowRight size={14} />
                    {course.code}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <details className="text-muted-foreground mt-6 text-xs">
          <summary className="text-foreground cursor-pointer text-sm">
            Áreas de conhecimento
          </summary>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {Object.values(areas).map((area) => (
              <li key={area.label} className="flex items-center gap-2">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: area.color }}
                />
                {area.label}
              </li>
            ))}
          </ul>
        </details>
        <p className="text-muted-foreground mt-5 text-xs leading-relaxed">
          Relações transcritas do diagrama enviado pelo CA. “Sem pré-requisito indicado” se refere à
          imagem, não à autorização de matrícula. Confira a matriz vigente e as regras no SUAP ou
          com a coordenação.
        </p>
      </div>
    </section>
  );
}
