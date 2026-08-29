import { useEffect, useState } from "react";

/**
 * Overlay shown when the browser loses connectivity, explaining what still
 * works from cache and offering the offline-safe anchors.
 */
export function OfflineNotice() {
  const [offline, setOffline] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const sync = () => {
      setOffline(!navigator.onLine);
      if (navigator.onLine) setDismissed(false);
    };
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  if (!offline || dismissed) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Você está offline"
      className="fixed inset-x-0 bottom-0 z-[70] px-4 pb-4 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[26rem] sm:px-0"
    >
      <div className="glass rounded-3xl border border-border p-5 shadow-2xl">
        <p className="text-[11px] tracking-[0.2em] text-neon-soft uppercase">Sem conexão</p>
        <h2 className="mt-2 text-lg font-semibold text-foreground">Você está offline</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          O conteúdo já carregado continua disponível: banco de provas, grade de horários,
          tutoriais e mapa do campus. Links externos (Drive, WhatsApp, Instagram, SUAP e AVA)
          voltam quando a internet voltar.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href="#horarios"
            className="rounded-full border border-border px-3 py-1.5 text-xs text-foreground transition-colors duration-300 hover:border-neon"
          >
            Horários
          </a>
          <a
            href="#tutoriais"
            className="rounded-full border border-border px-3 py-1.5 text-xs text-foreground transition-colors duration-300 hover:border-neon"
          >
            Tutoriais
          </a>
          <a
            href="#mapa"
            className="rounded-full border border-border px-3 py-1.5 text-xs text-foreground transition-colors duration-300 hover:border-neon"
          >
            Mapa
          </a>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="ml-auto rounded-full px-3 py-1.5 text-xs text-muted-foreground transition-colors duration-300 hover:text-foreground"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
