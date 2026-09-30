import { useState } from "react";
import { ArrowUpRight, Bookmark, FolderOpen, Search, X } from "lucide-react";
import { periodos } from "@/data/academics";
import { normalizeSearch, siteLinks } from "@/data/site";
import { PeriodPicker, useStudentPreferences } from "./StudentPreferences";
export function BancoDeProvas() {
  const { period, setPeriod, favorites, toggleFavorite } = useStudentPreferences();
  const [query, setQuery] = useState("");
  const [savedOnly, setSavedOnly] = useState(false);
  const term = normalizeSearch(query);
  const visible = periodos.filter(
    (item) =>
      (!period || item.n === period) &&
      (!savedOnly || favorites.includes(item.n)) &&
      normalizeSearch(`${item.titulo} ${item.disciplinas.join(" ")}`).includes(term),
  );
  return (
    <section id="provas" className="portal-section">
      <div className="site-container">
        <header className="section-heading">
          <div>
            <p className="eyebrow">01 / SUA BIBLIOTECA COMPARTILHADA</p>
            <h2>
              Conhecimento bom
              <br />é conhecimento compartilhado.
            </h2>
            <p>Provas e conteúdos organizados por período, nos repositórios da comunidade.</p>
          </div>
          <a
            className="text-link"
            href={siteLinks.contact}
            target="_blank"
            rel="noopener noreferrer"
          >
            Quero contribuir <ArrowUpRight size={17} />
            <span className="sr-only">(nova aba)</span>
          </a>
        </header>
        <div className="resource-toolbar">
          <label className="search-field">
            <Search size={18} />
            <input
              type="search"
              placeholder="Busque por disciplina ou período…"
              aria-label="Buscar materiais"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <button
            className={`button button-outline ${savedOnly ? "is-selected" : ""}`}
            aria-pressed={savedOnly}
            onClick={() => setSavedOnly((value) => !value)}
          >
            <Bookmark size={16} />
            Salvos ({favorites.length})
          </button>
        </div>
        <div className="filter-caption">
          <PeriodPicker />
          <span role="status">
            {visible.length}{" "}
            {visible.length === 1 ? "repositório encontrado" : "repositórios encontrados"}
          </span>
        </div>
        <div className="material-grid">
          {visible.map((item) => (
            <article className="material-card" key={item.n}>
              <div className="material-card-top">
                <span className="period-number">0{item.n}</span>
                <button
                  className={`icon-button bookmark-button ${favorites.includes(item.n) ? "is-selected" : ""}`}
                  aria-label={`${favorites.includes(item.n) ? "Remover dos" : "Adicionar aos"} salvos: ${item.titulo}`}
                  aria-pressed={favorites.includes(item.n)}
                  onClick={() => toggleFavorite(item.n)}
                >
                  <Bookmark size={18} fill={favorites.includes(item.n) ? "currentColor" : "none"} />
                </button>
              </div>
              <div className="material-heading">
                <h3>{item.titulo}</h3>
                <span>{item.disciplinas.length} disciplinas</span>
              </div>
              <ul>
                {item.disciplinas.map((disciplina) => (
                  <li
                    key={disciplina}
                    className={
                      term && normalizeSearch(disciplina).includes(term) ? "matched-discipline" : ""
                    }
                  >
                    <span aria-hidden="true" /> {disciplina}
                  </li>
                ))}
              </ul>
              <a
                className="material-link"
                href={item.drive}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FolderOpen size={17} />
                Abrir materiais
                <ArrowUpRight size={17} />
                <span className="sr-only">do {item.n}º período (nova aba no Google Drive)</span>
              </a>
            </article>
          ))}
        </div>
        {!visible.length && (
          <div className="portal-empty">
            <Search size={28} />
            <h3>Nenhum material neste filtro</h3>
            <p>Tente outro termo ou explore os demais períodos.</p>
            <button
              className="button button-outline"
              onClick={() => {
                setQuery("");
                setPeriod(0);
                setSavedOnly(false);
              }}
            >
              <X size={16} />
              Limpar filtros
            </button>
          </div>
        )}
        <p className="section-note">
          Os links abrem pastas do Google Drive em uma nova aba. A disponibilidade dos arquivos
          depende do compartilhamento de cada pasta.
        </p>
      </div>
    </section>
  );
}
