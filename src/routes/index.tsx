import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { BancoDeProvas } from "@/components/site/BancoDeProvas";
import { Horarios } from "@/components/site/Horarios";
import { Comunidades } from "@/components/site/Comunidades";
import { Tutoriais } from "@/components/site/Tutoriais";
import { MapaCampus } from "@/components/site/MapaCampus";
import { Footer } from "@/components/site/Footer";
import { StudentPreferences } from "@/components/site/StudentPreferences";
import { OfflineNotice } from "@/components/site/OfflineNotice";
import { UpdatePrompt } from "@/components/site/UpdatePrompt";
import { onServiceWorkerUpdate } from "@/lib/sw-update";
const title = "CA-ADS · Seu ponto de encontro no IFSP São Paulo";
const description =
  "Materiais por período, horários, comunidades, guias e mapa do campus. O portal de ADS feito por estudantes do IFSP Campus São Paulo.";
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});
function Index() {
  const [updateReady, setUpdateReady] = useState(false);
  useEffect(() => onServiceWorkerUpdate(() => setUpdateReady(true)), []);
  return (
    <StudentPreferences>
      <div className="portal">
        <a href="#conteudo" className="skip-link">
          Pular para o conteúdo
        </a>
        <Header />
        {updateReady && <UpdatePrompt onDismiss={() => setUpdateReady(false)} />}
        <OfflineNotice />
        <main id="conteudo" tabIndex={-1}>
          <Hero />
          <BancoDeProvas />
          <Horarios />
          <Comunidades />
          <Tutoriais />
          <MapaCampus />
        </main>
        <Footer />
      </div>
    </StudentPreferences>
  );
}
