export type Product = {
  id: string;
  name: string;
  description: string;
  priceInCents: number | null;
  image?: string;
  options?: string[];
  available: boolean;
};
// Cadastre apenas produtos reais aprovados pelo CA. Preço null = sob consulta.
// Imagens podem ser adicionadas em public/produtos e referenciadas por /produtos/arquivo.webp.
export const products: Product[] = [];
export const salesContact = "https://wa.me/5511989255690";
export function productInquiry(product: Product, quantity: number, option: string) {
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10)
    throw new Error("Quantidade inválida");
  if (!product.available) throw new Error("Produto indisponível");
  if (product.options?.length && !product.options.includes(option))
    throw new Error("Selecione uma opção");
  const message = `Olá, CA! Tenho interesse em ${quantity} unidade(s) de ${product.name}${option ? ` — opção: ${option}` : ""}. Podem confirmar disponibilidade, valor e retirada?`;
  return `${salesContact}?text=${encodeURIComponent(message)}`;
}
