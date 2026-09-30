import React from "react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StudentPreferences } from "../src/components/site/StudentPreferences";
import { BancoDeProvas } from "../src/components/site/BancoDeProvas";
import { Horarios } from "../src/components/site/Horarios";
import { Header } from "../src/components/site/Header";
import { csvCell, normalizeSearch } from "../src/data/site";
beforeEach(() => localStorage.clear());
afterEach(cleanup);
function portal() {
  return render(
    <StudentPreferences>
      <BancoDeProvas />
      <Horarios />
    </StudentPreferences>,
  );
}
describe("student flows", () => {
  it("synchronizes period between materials and schedule and persists it", async () => {
    portal();
    const user = userEvent.setup();
    await user.click(
      within(screen.getAllByRole("group")[0]).getByRole("button", { name: "3º", exact: true }),
    );
    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(screen.getByText("Nenhuma aula cadastrada neste filtro")).toBeTruthy();
    expect(JSON.parse(localStorage.getItem("caads-student-preferences-v1")!).period).toBe(3);
    expect(
      within(screen.getAllByRole("group")[1])
        .getByRole("button", { name: "3º" })
        .getAttribute("aria-pressed"),
    ).toBe("true");
  });
  it("saves folders across remounts and allows filtering saved folders", async () => {
    const view = portal();
    const user = userEvent.setup();
    await user.click(screen.getAllByRole("button", { name: /Adicionar aos salvos/ })[0]);
    view.unmount();
    portal();
    await user.click(screen.getByRole("button", { name: "Salvos (1)" }));
    expect(screen.getAllByRole("article")).toHaveLength(1);
    await user.click(screen.getByRole("button", { name: /Remover dos salvos/ }));
    expect(screen.getByText("Nenhum material neste filtro")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Limpar filtros" }));
    expect(screen.getAllByRole("article")).toHaveLength(6);
  });
  it("handles corrupt saved preferences and searches without accents", async () => {
    localStorage.setItem("caads-student-preferences-v1", "{invalid");
    portal();
    await userEvent
      .setup()
      .type(screen.getByRole("searchbox", { name: "Buscar materiais" }), "zzzinexistente");
    expect(screen.getByText("Nenhum material neste filtro")).toBeTruthy();
    expect(normalizeSearch("  Programação  ")).toBe("programacao");
  });
  it("combines schedule search and weekday selection", async () => {
    portal();
    const user = userEvent.setup();
    await user.selectOptions(screen.getByRole("combobox"), "Segunda-feira");
    const schedule = document.querySelector("#horarios")!;
    expect(within(schedule as HTMLElement).getAllByRole("listitem").length).toBeGreaterThan(0);
    await user.type(screen.getByRole("searchbox", { name: "Buscar aulas" }), "zzzinexistente");
    expect(screen.getByRole("button", { name: "Exportar seleção" }).hasAttribute("disabled")).toBe(
      true,
    );
    await user.click(screen.getByRole("button", { name: "Ver todos os registros" }));
    expect(screen.getByRole("button", { name: "Exportar seleção" }).hasAttribute("disabled")).toBe(
      false,
    );
  });
  it("opens global search with keyboard, reports no matches, and closes with Escape", async () => {
    render(<Header />);
    const user = userEvent.setup();
    await user.keyboard("{Control>}k{/Control}");
    expect(screen.getByRole("dialog")).toBeTruthy();
    await user.type(screen.getByRole("searchbox", { name: "Buscar recursos" }), "zzzinexistente");
    expect(screen.getByText("Nada por aqui ainda")).toBeTruthy();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
  });
  it("quotes CSV cells and neutralizes spreadsheet formulas", () => {
    expect(csvCell('a;"b')).toBe('"a;""b"');
    expect(csvCell("=SUM(A1)")).toBe('"\'=SUM(A1)"');
  });
});
