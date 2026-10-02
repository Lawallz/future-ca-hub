import { useState } from "react";
import { ShoppingBag, ArrowUpRight, FileText } from "lucide-react";
import { products, salesContact, type Product } from "@/data/products";

const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

// Substitua pelo link de resposta do seu formulário (trocando /edit por /viewform no final)
const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/10nVw3qW27-E5ZFs8bDixCGshMgNFJa2S8WEvq911D3Q/viewform";

function ProductCard({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [option, setOption] = useState(product.options?.[0] ?? "");

  return (
    <article className="glass flex flex-col rounded-3xl p-6">
      {product.image ? (
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="mb-5 aspect-square w-full rounded-2xl object-cover"
        />
      ) : (
        <ShoppingBag className="text-neon-soft mb-5 h-10 w-10" aria-hidden="true" />
      )}
      <h3 className="text-foreground text-lg font-semibold">{product.name}</h3>
      <p className="text-muted-foreground mt-2 flex-1 text-sm">{product.description}</p>
      <p className="text-neon-soft mt-5 text-xl font-semibold">
        {product.priceInCents === null
          ? "Valor sob consulta"
          : money.format(product.priceInCents / 100)}
      </p>
      {product.available ? (
        <>
          <div className="mt-5 flex flex-wrap gap-3">
            {Boolean(product.options?.length) && (
              <label className="text-muted-foreground flex-1 text-sm">
                Opção
                <select
                  aria-label={`Opção de ${product.name}`}
                  value={option}
                  onChange={(e) => setOption(e.target.value)}
                  className="border-border bg-surface-deep text-foreground mt-2 block w-full rounded-xl border p-3"
                >
                  {product.options!.map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
              </label>
            )}
            <label className="text-muted-foreground text-sm">
              Quantidade
              <select
                aria-label={`Quantidade de ${product.name}`}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="border-border bg-surface-deep text-foreground mt-2 block rounded-xl border p-3"
              >
                {Array.from({ length: 10 }, (_, i) => (
                  <option key={i + 1}>{i + 1}</option>
                ))}
              </select>
            </label>
          </div>
          <a
            href={GOOGLE_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="border-neon bg-neon/10 text-neon-soft hover:bg-neon/20 mt-5 flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold"
          >
            Fazer pedido / Formulário <ArrowUpRight size={16} />
            <span className="sr-only">no Google Forms, nova aba</span>
          </a>
        </>
      ) : (
        <p className="border-border text-muted-foreground mt-5 rounded-xl border p-3 text-center text-sm">
          Indisponível no momento
        </p>
      )}
    </article>
  );
}

export function Produtos() {
  return (
    <section id="produtos" className="relative scroll-mt-20 px-5 py-24">
      <div className="mx-auto max-w-6xl">
        <header className="max-w-2xl">
          <p className="text-neon-soft text-[12px] tracking-[0.2em] uppercase">Produtos do CA</p>
          <h2 className="text-foreground mt-3 text-3xl font-bold sm:text-4xl">
            Leve o CA com você
          </h2>
          <p className="text-muted-foreground mt-3">
            Confira os produtos da comunidade e preencha o formulário para garantir o seu.
          </p>
        </header>

        {products.length ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="glass mt-10 rounded-3xl p-8 sm:p-10">
            <ShoppingBag className="text-neon-soft h-10 w-10" aria-hidden="true" />
            <h3 className="text-foreground mt-5 text-xl font-semibold">Catálogo em preparação</h3>
            <p className="text-muted-foreground mt-3 max-w-xl">
              Os produtos, fotos e valores serão publicados aqui assim que estiverem definidos. Quer
              saber das próximas vendas? Acesse nosso formulário ou fale com o CA.
            </p>
            <a
              href={GOOGLE_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="border-border text-foreground hover:border-neon mt-6 inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm"
            >
              Acessar formulário de pedidos <ArrowUpRight size={16} />
              <span className="sr-only">no Google Forms, nova aba</span>
            </a>
          </div>
        )}

        <p className="text-muted-foreground mt-5 text-xs">
          O link direciona para o formulário oficial de encomendas. Disponibilidade, pagamento e retirada são confirmados pelo CA.
        </p>
      </div>
    </section>
  );
}