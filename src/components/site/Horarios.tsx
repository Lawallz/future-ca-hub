import { useState } from "react";
import { CalendarDays, Download, MapPin, Search, TriangleAlert } from "lucide-react";
import { aulas } from "@/data/academics";
import { csvCell, normalizeSearch, siteLinks } from "@/data/site";
import { PeriodPicker, useStudentPreferences } from "./StudentPreferences";
const days = ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira"];
export function Horarios() {
  const { period, setPeriod } = useStudentPreferences();
  const [day, setDay] = useState("");
  const [query, setQuery] = useState("");
  const rows = aulas
    .filter(
      (aula) =>
        (!period || Number(aula.periodo) === period) &&
        (!day || aula.dia === day) &&
        normalizeSearch(`${aula.disciplina} ${aula.professor} ${aula.sala}`).includes(
          normalizeSearch(query),
        ),
    )
    .sort(
      (a, b) =>
        days.indexOf(a.dia) - days.indexOf(b.dia) ||
        Number(a.periodo) - Number(b.periodo) ||
        a.horario.localeCompare(b.horario),
    );
  function exportSchedule() {
    const text = [
      ["Disciplina", "Professor", "Período", "Dia", "Horário", "Sala"],
      ...rows.map((aula) => [
        aula.disciplina,
        aula.professor,
        aula.periodo,
        aula.dia,
        aula.horario,
        aula.sala,
      ]),
    ]
      .map((row) => row.map(csvCell).join(";"))
      .join("\r\n");
    const url = URL.createObjectURL(
      new Blob(["\uFEFF" + text], { type: "text/csv;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "horarios-ads-consulta.csv";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <section id="horarios" className="portal-section schedule-section">
      <div className="site-container">
        <header className="section-heading">
          <div>
            <p className="eyebrow">02 / ORGANIZE SUA SEMANA</p>
            <h2>
              Seu próximo destino:
              <br />a sala certa.
            </h2>
            <p>Encontre a disciplina, o horário e o professor sem procurar em várias mensagens.</p>
          </div>
          <span className="section-tag">
            <CalendarDays size={16} />
            Noturno
          </span>
        </header>
        <div className="notice-panel">
          <TriangleAlert size={19} />
          <p>
            <strong>Uma referência para se organizar.</strong> Esta grade foi cadastrada pelo CA e
            não tem semestre de vigência informado. Confirme alterações e eventuais conflitos no{" "}
            <a href={siteLinks.suap} target="_blank" rel="noopener noreferrer">
              SUAP ↗
            </a>
            . Há registros de Banco de Dados 2 associados ao 1º período que precisam de revisão.
          </p>
        </div>
        <div className="schedule-toolbar">
          <PeriodPicker />
          <button
            className="button button-outline"
            disabled={!rows.length}
            onClick={exportSchedule}
          >
            <Download size={16} />
            Exportar seleção
          </button>
        </div>
        <div className="resource-toolbar">
          <label className="search-field">
            <Search size={18} />
            <input
              type="search"
              aria-label="Buscar aulas"
              placeholder="Disciplina, professor ou sala…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <label className="select-field">
            <span>Dia da semana</span>
            <select value={day} onChange={(event) => setDay(event.target.value)}>
              <option value="">Todos os dias</option>
              {days.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
        </div>
        <p className="result-count" role="status">
          {rows.length} {rows.length === 1 ? "aula encontrada" : "aulas encontradas"}
          {period ? ` · ${period}º período` : ""}
        </p>
        {rows.length ? (
          <div className="schedule-table">
            <div className="schedule-table-head" aria-hidden="true">
              <span>Disciplina / professor</span>
              <span>Período</span>
              <span>Dia</span>
              <span>Horário</span>
              <span>Sala</span>
            </div>
            <ul>
              {rows.map((aula, index) => (
                <li key={`${aula.disciplina}-${aula.dia}-${index}`}>
                  <div className="class-name">
                    <strong>{aula.disciplina}</strong>
                    <small>{aula.professor}</small>
                  </div>
                  <span className="period-badge">{aula.periodo}º período</span>
                  <span>{aula.dia}</span>
                  <span className="class-time">{aula.horario}</span>
                  <span className="class-room">
                    <MapPin size={14} />
                    {aula.sala}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="portal-empty">
            <CalendarDays size={28} />
            <h3>Nenhuma aula cadastrada neste filtro</h3>
            <p>
              A ausência de registros não significa que não há aulas. Confira sua grade no SUAP.
            </p>
            <button
              className="button button-outline"
              onClick={() => {
                setPeriod(0);
                setDay("");
                setQuery("");
              }}
            >
              Ver todos os registros
            </button>
          </div>
        )}
        <p className="section-note">
          Encontrou algo diferente?{" "}
          <a href={siteLinks.contact} target="_blank" rel="noopener noreferrer">
            Avise o CA para corrigirmos a grade ↗
          </a>
        </p>
      </div>
    </section>
  );
}
