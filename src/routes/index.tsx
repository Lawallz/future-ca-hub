import { createFileRoute } from "@tanstack/react-router";
import { Suspense, lazy, useEffect, useState } from "react";
import { Header } from "@/components/site/Header";
import { Produtos } from "@/components/site/Produtos";
import { Roadmap } from "@/components/site/Roadmap";
import { Hero } from "@/components/site/Hero";
import { Horarios } from "@/components/site/Horarios";
import { BancoDeProvas } from "@/components/site/BancoDeProvas";
import { Footer } from "@/components/site/Footer";
import { LazySection } from "@/components/site/LazySection";
import { OfflineNotice } from "@/components/site/OfflineNotice";
import { UpdatePrompt } from "@/components/site/UpdatePrompt";
import { useReduceMotion } from "@/lib/motion-preference";
import { initSectionPrefetch } from "@/lib/prefetch";
import { onServiceWorkerUpdate } from "@/lib/sw-update";

// Each heavy section ships in its own chunk, fetched when it nears the viewport.

const Comunidades = lazy(() =>
  import("@/components/site/Comunidades").then((m) => ({
    default: m.Comunidades,
  })),
);
const Tutoriais = lazy(() =>
  import("@/components/site/Tutoriais").then((m) => ({ default: m.Tutoriais })),
);
const MapaCampus = lazy(() =>
  import("@/components/site/MapaCampus").then((m) => ({
    default: m.MapaCampus,
  })),
);
const ParticleField = lazy(() =>
  import("@/components/site/ParticleField").then((m) => ({
    default: m.ParticleField,
  })),
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
  const [showBackground, setShowBackground] = useState(false);
  const reduced = useReduceMotion();
  const [updateReady, setUpdateReady] = useState(false);

  // Warm section chunks only on navigation intent.
  useEffect(() => initSectionPrefetch(), []);
  useEffect(() => onServiceWorkerUpdate(() => setUpdateReady(true)), []);

  // Decorative WebGL must not compete with navigation on mobile/slow devices.
  useEffect(() => {
    const connection = navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
      deviceMemory?: number;
    };
    if (
      reduced ||
      window.matchMedia("(pointer: coarse), (max-width: 767px)").matches ||
      connection.connection?.saveData ||
      /(^|-)2g$|^3g$/.test(connection.connection?.effectiveType ?? "") ||
      (connection.deviceMemory ?? 8) <= 4
    ) {
      setShowBackground(false);
      return;
    }
    let idle: number | undefined;
    const timer = window.setTimeout(() => {
      if (window.requestIdleCallback) {
        idle = window.requestIdleCallback(() => setShowBackground(true));
      } else setShowBackground(true);
    }, 2500);
    return () => {
      window.clearTimeout(timer);
      if (idle !== undefined) window.cancelIdleCallback(idle);
    };
  }, [reduced]);

  return (
    <div className="bg-surface-deep text-foreground relative min-h-screen">
      {showBackground && (
        <Suspense fallback={null}>
          <ParticleField />
        </Suspense>
      )}
      {updateReady && <UpdatePrompt onDismiss={() => setUpdateReady(false)} />}
      <OfflineNotice />
      <div className="relative z-10">
        <Header />
        <main>
          <Hero />
          <div data-cascade>
            <BancoDeProvas />
          </div>
          <div data-cascade>
            <Horarios />
          </div>
          <Roadmap />
          <Produtos />
          <div data-cascade>
            <LazySection id="comunidades" label="comunidades">
              <Comunidades />
            </LazySection>
          </div>
          <div data-cascade>
            <LazySection id="tutoriais" label="tutoriais">
              <Tutoriais />
            </LazySection>
          </div>
          <div data-cascade>
            <LazySection id="mapa" label="mapa do campus">
              <MapaCampus />
            </LazySection>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
