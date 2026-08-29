import { applyServiceWorkerUpdate } from "@/lib/register-sw";

/** Banner shown when a newer cached version of the site is ready. */
export function UpdatePrompt({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div
      role="status"
      className="fixed inset-x-0 top-20 z-[70] px-4 sm:inset-x-auto sm:right-6 sm:w-[24rem] sm:px-0"
    >
      <div className="glass flex items-center gap-3 rounded-3xl border border-border p-4 shadow-2xl">
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon opacity-70" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-neon" />
        </span>
        <p className="flex-1 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Nova versão disponível.</span> Atualize
          para carregar o conteúdo mais recente.
        </p>
        <button
          type="button"
          onClick={applyServiceWorkerUpdate}
          className="rounded-full bg-neon px-3 py-1.5 text-xs font-semibold text-surface-deep transition-transform duration-300 hover:scale-105"
        >
          Atualizar
        </button>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dispensar aviso de atualização"
          className="text-muted-foreground transition-colors duration-300 hover:text-foreground"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
