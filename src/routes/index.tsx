import { createFileRoute } from "@tanstack/react-router";
import { Suspense, lazy, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { BancoDeProvas } from "@/components/site/BancoDeProvas";
import { Footer } from "@/components/site/Footer";
import { IntroScreen } from "@/components/site/IntroScreen";
import { LazySection } from "@/components/site/LazySection";
import { OfflineNotice } from "@/components/site/OfflineNotice";
import { UpdatePrompt } from "@/components/site/UpdatePrompt";
import { useReduceMotion } from "@/lib/motion-preference";
import { initSectionPrefetch } from "@/lib/prefetch";
import { onServiceWorkerUpdate } from "@/lib/sw-update";

// Each heavy section ships in its own chunk, fetched when it nears the viewport.
const Horarios = lazy(() =>
  import("@/components/site/Horarios").then((m) => ({ default: m.Horarios })),
);
const Comunidades = lazy(() =>
  import("@/components/site/Comunidades").then((m) => ({ default: m.Comunidades })),
);
const Tutoriais = lazy(() =>
  import("@/components/site/Tutoriais").then((m) => ({ default: m.Tutoriais })),
);
const MapaCampus = lazy(() =>
  import("@/components/site/MapaCampus").then((m) => ({ default: m.MapaCampus })),
);
const ParticleField = lazy(() =>
  import("@/components/site/ParticleField").then((m) => ({ default: m.ParticleField })),
);

const title = "Centro Acadêmico de ADS - IFSP Campus São Paulo";
const description =
  "Site oficial do Centro Acadêmico de ADS do IFSP Campus São Paulo: banco de provas por período, grade de horários e salas, comunidades e mapa do campus.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [revealed, setRevealed] = useState(false);
  const [showBackground, setShowBackground] = useState(false);
  const content = useRef<HTMLDivElement>(null);
  const reduced = useReduceMotion();
  const [updateReady, setUpdateReady] = useState(false);

  // Warm the next section chunks on scroll / hover intent.
  useEffect(() => initSectionPrefetch(), []);
  useEffect(() => onServiceWorkerUpdate(() => setUpdateReady(true)), []);

  // Defer the 3D background until the browser is idle (and never when the
  // visitor asked for reduced animations).
  useEffect(() => {
    if (reduced) {
      setShowBackground(false);
      return;
    }
    const idle =
      window.requestIdleCallback?.(() => setShowBackground(true)) ??
      window.setTimeout(() => setShowBackground(true), 1200);
    return () => {
      if (typeof idle === "number") window.clearTimeout(idle);
      else window.cancelIdleCallback?.(idle as unknown as number);
    };
  }, [reduced]);

  useEffect(() => {
    if (!revealed || !content.current || reduced) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-cascade]", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
      });
    }, content);
    return () => ctx.revert();
  }, [revealed, reduced]);

  return (
    <div className="relative min-h-screen bg-surface-deep text-foreground">
      {showBackground && (
        <Suspense fallback={null}>
          <ParticleField />
        </Suspense>
      )}
      {updateReady && <UpdatePrompt onDismiss={() => setUpdateReady(false)} />}
      <OfflineNotice />
      <IntroScreen onDone={() => setRevealed(true)} />
      <div ref={content} className="relative z-10">
        <Header />
        <main>
          <Hero key={revealed ? "revealed" : "idle"} />
          <div data-cascade>
            <BancoDeProvas />
          </div>
          <div data-cascade>
            <LazySection label="grade de horários">
              <Horarios />
            </LazySection>
          </div>
          <div data-cascade>
            <LazySection label="comunidades">
              <Comunidades />
            </LazySection>
          </div>
          <div data-cascade>
            <LazySection label="tutoriais">
              <Tutoriais />
            </LazySection>
          </div>
          <div data-cascade>
            <LazySection label="mapa do campus">
              <MapaCampus />
            </LazySection>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
