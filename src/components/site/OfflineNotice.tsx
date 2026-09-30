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
      <div className="glass border-border rounded-3xl border p-5 shadow-2xl">
        <p className="text-neon-soft text-[11px] tracking-[0.2em] uppercase">Sem conexão</p>
        <h2 className="text-foreground mt-2 text-lg font-semibold">Você está offline</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          O conteúdo já carregado continua disponível: banco de provas, grade de horários, tutoriais
          e mapa do campus. Links externos (Drive, WhatsApp, Instagram, SUAP e AVA) voltam quando a
          internet voltar.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href="#horarios"
            className="border-border text-foreground hover:border-neon rounded-full border px-3 py-1.5 text-xs transition-colors duration-300"
          >
            Horários
          </a>
          <a
            href="#tutoriais"
            className="border-border text-foreground hover:border-neon rounded-full border px-3 py-1.5 text-xs transition-colors duration-300"
          >
            Tutoriais
          </a>
          <a
            href="#mapa"
            className="border-border text-foreground hover:border-neon rounded-full border px-3 py-1.5 text-xs transition-colors duration-300"
          >
            Mapa
          </a>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="text-muted-foreground hover:text-foreground ml-auto rounded-full px-3 py-1.5 text-xs transition-colors duration-300"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
