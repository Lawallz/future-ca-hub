// src/data/products.ts
// As imagens ficam em public/produtos/ (copie a pasta "produtos" para dentro de public/).

export type ProductVariant = {
  /** Nome da estampa/modelo (aparece no seletor) */
  label: string;
  /** Caminho em /public */
  image: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  /** Preço em centavos. Use null para "Valor sob consulta". */
  priceInCents: number | null;
  /** Tamanhos disponíveis (opcional) */
  sizes?: string[];
  /** Um ou mais modelos/estampas do produto */
  variants: ProductVariant[];
  available: boolean;
};

const ROUPA = ["P", "M", "G", "GG"];

export const products: Product[] = [
  {
    id: "corta-vento",
    name: "Corta-vento",
    description: "Azul-marinho, com brasão IFSP ADS no peito e polvo gigante nas costas.",
    priceInCents: 14000,
    sizes: ROUPA,
    variants: [{ label: "Azul-marinho", image: "/produtos/corta-vento.jpg" }],
    available: true,
  },
  {
    id: "moletom-sem-capuz",
    name: "Moletom sem capuz",
    description: "Preto, com ADS em pixel art nas costas e </> na barra.",
    priceInCents: 10000,
    sizes: ROUPA,
    variants: [{ label: "Pixel ADS", image: "/produtos/moletom-sem-capuz.jpg" }],
    available: true,
  },
  {
    id: "moletom-com-capuz",
    name: "Moletom com capuz",
    description: "Preto, com polvo no peito e ADS IFSP CAAT com tentáculos nas costas.",
    priceInCents: 12000,
    sizes: ROUPA,
    variants: [{ label: "ADS IFSP CAAT", image: "/produtos/moletom-capuz.jpg" }],
    available: true,
  },
  {
    id: "moletom-capuz-manga",
    name: "Moletom com capuz e manga personalizada",
    description: "Preto, com tentáculos estampados nas mangas e IFSP - ADS no peito.",
    priceInCents: 14000,
    sizes: ROUPA,
    variants: [{ label: "Tentáculos nas mangas", image: "/produtos/moletom-capuz-manga.jpg" }],
    available: true,
  },
  {
    id: "camiseta-padrao",
    name: "Camiseta padrão",
    description: "Preta, com duas estampas à escolha. Frente discreta e arte grande nas costas.",
    priceInCents: 5000,
    sizes: ROUPA,
    variants: [
      { label: "Sexta não é dia de deploy", image: "/produtos/camiseta-padrao-deploy.jpg" },
      { label: "ADS IFSP CAAT", image: "/produtos/camiseta-padrao-caat.jpg" },
    ],
    available: true,
  },
  {
    id: "camiseta-oversized",
    name: "Camiseta oversized",
    description: "Branca, caimento largo, com polvo e arame farpado estampados nas costas.",
    priceInCents: 7000,
    sizes: ROUPA,
    variants: [{ label: "Branca", image: "/produtos/camiseta-oversized.jpg" }],
    available: true,
  },
  {
    id: "caneca-tirante",
    name: "Caneca e tirante",
    description: "Caneca roxa de alumínio com tirante verde estampado.",
    priceInCents: 3500,
    variants: [{ label: "Roxa", image: "/produtos/caneca-tirante.jpg" }],
    available: true,
  },
  {
    id: "ecobag",
    name: "Ecobag",
    description: "Algodão cru, com tentáculos na frente e ícones do dia a dia dev no verso.",
    priceInCents: 3000,
    variants: [{ label: "Cru", image: "/produtos/ecobag.jpg" }],
    available: true,
  },
  {
    id: "top-tubo",
    name: "Top tubo",
    description: "Preto, com polvo e ADS na frente e brasão IFSP ADS atrás.",
    priceInCents: 4500,
    sizes: ["P", "M", "G"],
    variants: [{ label: "Preto", image: "/produtos/top-tubo.jpg" }],
    available: true,
  },
  {
    id: "sacochila",
    name: "Sacochila",
    description: "Preta, com polvo verde e IFSP ADS em roxo e branco.",
    priceInCents: 3000,
    variants: [{ label: "Preta", image: "/produtos/sacochila.jpg" }],
    available: true,
  },
  {
    id: "shorts-fem",
    name: "Shorts feminino",
    description: "Preto com friso verde, tentáculos na lateral e ADS atrás.",
    priceInCents: 4500,
    sizes: ["P", "M", "G"],
    variants: [{ label: "Preto e verde", image: "/produtos/shorts-fem.jpg" }],
    available: true,
  },
  {
    id: "shorts-masc",
    name: "Shorts masculino",
    description: "Preto com friso verde, tentáculos na lateral, </> e ADS atrás.",
    priceInCents: 4500,
    sizes: ROUPA,
    variants: [{ label: "Preto e verde", image: "/produtos/shorts-masc.jpg" }],
    available: true,
  },
];

// Mantido porque o componente antigo importava; remova se não usar em outro lugar.
export const salesContact = "";
