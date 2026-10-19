import { useEffect, useState } from "react";
import { ShoppingBag, ArrowUpRight, X, Maximize2 } from "lucide-react";
import { products, type Product } from "@/data/products";

const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

const GOOGLE_FORM_URL =
  "https://docs.google.com/forms/d/10nVw3qW27-E5ZFs8bDixCGshMgNFJa2S8WEvq911D3Q/viewform";

function FormLink({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <a href={GOOGLE_FORM_URL} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      <ArrowUpRight size={16} aria-hidden="true" />
      <span className="sr-only">no Google Forms, nova aba</span>
    </a>
  );
}

function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar imagem"
        className="border-border text-foreground hover:border-neon absolute top-4 right-4 rounded-full border bg-black/60 p-3"
      >
        <X size={20} />
      </button>
      <img
        src={src}
        alt={alt}
        className="max-h-[90vh] max-w-full rounded-2xl object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const [variantIndex, setVariantIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const variant = product.variants[variantIndex];
  const alt = `${product.name} - ${variant.label}, frente e costas`;

  return (
    <article className="flex flex-col border-b border-border pb-6">
      <button
        type="button"
        onClick={() => setZoom(true)}
        aria-label={`Ampliar imagem de ${product.name}`}
        className="group relative mb-5 block overflow-hidden rounded-2xl bg-black"
      >
        <img
          src={variant.image}
          alt={alt}
          loading="lazy"
          className="aspect-[4/5] w-full object-cover"
        />
        <span className="absolute right-3 bottom-3 rounded-full bg-black/70 p-2 text-white opacity-80 group-hover:opacity-100">
          <Maximize2 size={16} aria-hidden="true" />
        </span>
      </button>

      <h3 className="text-foreground text-lg font-semibold">{product.name}</h3>
      <p className="text-muted-foreground mt-2 flex-1 text-sm">{product.description}</p>

      {product.variants.length > 1 && (
        <div
          className="mt-4 flex flex-wrap gap-2"
          role="group"
          aria-label={`Estampas de ${product.name}`}
        >
          {product.variants.map((v, i) => (
            <button
              key={v.label}
              type="button"
              onClick={() => setVariantIndex(i)}
              aria-pressed={i === variantIndex}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                i === variantIndex
                  ? "border-neon bg-neon/10 text-neon-soft"
                  : "border-border text-muted-foreground hover:border-neon"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      )}

      {product.sizes && (
        <p className="text-muted-foreground mt-4 text-xs">Tamanhos: {product.sizes.join(" · ")}</p>
      )}

      <p className="text-neon-soft mt-4 text-lg font-semibold">
        {product.priceInCents === null
          ? "Valor sob consulta"
          : money.format(product.priceInCents / 100)}
      </p>

      {!product.available && (
        <p className="border-border text-muted-foreground mt-4 rounded-xl border p-3 text-center text-sm">
          Indisponível no momento
        </p>
      )}

      {zoom && <Lightbox src={variant.image} alt={alt} onClose={() => setZoom(false)} />}
    </article>
  );
}

export function Produtos() {
  return (
    <section id="produtos" className="relative scroll-mt-20 px-5 py-24">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-neon-soft text-[12px] tracking-[0.2em] uppercase">Produtos do CA</p>
            <h2 className="text-foreground mt-3 text-3xl font-bold sm:text-4xl">
              Camisetas, moletons e mais coisas do CA
            </h2>
            <p className="text-muted-foreground mt-3">
              Veja o catálogo e, quando decidir o que quer, faça o pedido pelo formulário.
            </p>
          </div>
          <FormLink className="border-neon bg-neon/10 text-neon-soft hover:bg-neon/20 inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold">
            Fazer pedido
          </FormLink>
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
              Os produtos serão publicados aqui assim que estiverem definidos. Acesse o formulário
              para saber das próximas vendas.
            </p>
            <FormLink className="border-border text-foreground hover:border-neon mt-6 inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm">
              Acessar formulário de pedidos
            </FormLink>
          </div>
        )}

        <div className="mt-10 flex flex-col items-start gap-4 border-t border-border py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted-foreground max-w-xl text-sm">
            Disponibilidade, pagamento e retirada são confirmados pelo CA depois do pedido.
          </p>
          <FormLink className="border-neon bg-neon/10 text-neon-soft hover:bg-neon/20 inline-flex shrink-0 items-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold">
            Fazer pedido no formulário
          </FormLink>
        </div>
      </div>
    </section>
  );
}
