export const siteLinks = {
  contact: "https://wa.me/5511989255690",
  community: "https://chat.whatsapp.com/IZHNKdFfjiE3OaIiV5mzT4?s=cl&p=a&mlu=1",
  instagram: "https://www.instagram.com/caat.ifspo/",
  suap: "https://suap.ifsp.edu.br",
  moodle: "https://eadcampus.spo.ifsp.edu.br/my/",
};
export const sections = [
  { href: "#provas", label: "Materiais", description: "Provas e disciplinas por período" },
  { href: "#horarios", label: "Horários", description: "Aulas, professores e salas" },
  { href: "#comunidades", label: "Comunidade", description: "Converse com o CA e com a turma" },
  { href: "#tutoriais", label: "Guias", description: "Ajuda para o dia a dia acadêmico" },
  { href: "#mapa", label: "Campus", description: "Encontre blocos e ambientes" },
];
export const normalizeSearch = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
export function csvCell(value: string) {
  return `"${(/^[\s]*[=+@-]/.test(value) ? "'" : "") + value.replaceAll('"', '""')}"`;
}
