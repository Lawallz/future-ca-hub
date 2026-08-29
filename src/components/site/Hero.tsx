import { useEffect, useRef } from "react";
import gsap from "gsap";

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from("[data-hero-badge]", { y: 20, opacity: 0, duration: 0.7 })
        .from(
          "[data-hero-line]",
          { y: 44, opacity: 0, duration: 1, stagger: 0.1, filter: "blur(10px)" },
          "-=0.35",
        )
        .from("[data-hero-sub]", { y: 20, opacity: 0, duration: 0.8 }, "-=0.5")
        .from("[data-hero-cta]", { y: 16, opacity: 0, duration: 0.6, stagger: 0.08 }, "-=0.45")
        .from("[data-hero-stat]", { y: 16, opacity: 0, duration: 0.6, stagger: 0.08 }, "-=0.35");

      gsap.to("[data-hero-orb]", {
        yPercent: 12,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="top"
      ref={root}
      className="relative flex min-h-[92vh] items-center justify-center overflow-hidden px-5 pt-28 pb-20"
    >
      <div className="grid-lines absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="veil absolute inset-x-0 top-0 h-[70vh]" aria-hidden="true" />
      <div
        data-hero-orb
        aria-hidden="true"
        className="absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-neon/20 blur-[120px]"
      />

      <div className="relative mx-auto max-w-4xl text-center">
        <span
          data-hero-badge
          className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[12px] tracking-wide text-muted-foreground"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-neon-soft" />
          Centro Acadêmico de Análise e Desenvolvimento de Sistemas
        </span>

        <h1 className="mt-7 text-5xl leading-[0.95] font-bold sm:text-7xl md:text-8xl">
          <span data-hero-line className="block text-foreground">
            Tudo do curso
          </span>
          <span data-hero-line className="neon-text block">
            em um só lugar.
          </span>
        </h1>

        <p
          data-hero-sub
          className="mx-auto mt-7 max-w-2xl text-base text-muted-foreground sm:text-lg"
        >
          Banco de provas por período, grade de horários e salas, comunidades por matéria,
          tutoriais de SUAP e MOODLE e o mapa interativo do IFSP — Campus São Paulo.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a
            data-hero-cta
            href="#provas"
            className="rounded-full bg-neon px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-neon)] transition-all duration-500 ease-[var(--ease-fluid)] hover:scale-[1.04] hover:brightness-110"
          >
            Acessar banco de provas
          </a>
          <a
            data-hero-cta
            href="#horarios"
            className="glass rounded-full px-7 py-3.5 text-sm font-semibold text-foreground transition-all duration-500 ease-[var(--ease-fluid)] hover:scale-[1.04] hover:border-neon"
          >
            Ver grade de horários
          </a>
        </div>

        <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-3 gap-3">
          {[
            { k: "6", v: "períodos mapeados" },
            { k: "24/7", v: "acesso aos materiais" },
            { k: "100%", v: "feito por estudantes" },
          ].map((s) => (
            <div key={s.v} data-hero-stat className="glass rounded-2xl px-4 py-5">
              <dt className="font-display text-2xl font-bold text-foreground">{s.k}</dt>
              <dd className="mt-1 text-[12px] text-muted-foreground">{s.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
