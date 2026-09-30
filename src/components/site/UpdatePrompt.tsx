import { applyServiceWorkerUpdate } from "@/lib/register-sw";

/** Banner shown when a newer cached version of the site is ready. */
export function UpdatePrompt({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div
      role="status"
      className="fixed inset-x-0 top-20 z-[70] px-4 sm:inset-x-auto sm:right-6 sm:w-[24rem] sm:px-0"
    >
      <div className="glass border-border flex items-center gap-3 rounded-3xl border p-4 shadow-2xl">
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="bg-neon absolute inline-flex h-full w-full animate-ping rounded-full opacity-70" />
          <span className="bg-neon relative inline-flex h-2.5 w-2.5 rounded-full" />
        </span>
        <p className="text-muted-foreground flex-1 text-sm">
          <span className="text-foreground font-medium">Nova versão disponível.</span> Atualize para
          carregar o conteúdo mais recente.
        </p>
        <button
          type="button"
          onClick={applyServiceWorkerUpdate}
          className="bg-neon text-surface-deep rounded-full px-3 py-1.5 text-xs font-semibold transition-transform duration-300 hover:scale-105"
        >
          Atualizar
        </button>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dispensar aviso de atualização"
          className="text-muted-foreground hover:text-foreground transition-colors duration-300"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
