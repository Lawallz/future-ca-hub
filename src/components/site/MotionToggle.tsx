import { useReduceMotion, setReduceMotion } from "@/lib/motion-preference";

/** Toggle that lets the visitor reduce animations; persisted in localStorage. */
export function MotionToggle({ className = "" }: { className?: string }) {
  const reduced = useReduceMotion();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={reduced}
      aria-label="Reduzir animações do site"
      title={reduced ? "Animações reduzidas" : "Animações completas"}
      onClick={() => setReduceMotion(!reduced)}
      className={`border-border bg-secondary/40 text-muted-foreground hover:border-neon hover:text-foreground focus-visible:ring-neon inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[11px] tracking-[0.12em] uppercase transition-colors duration-300 focus-visible:ring-2 focus-visible:outline-none ${className}`}
    >
      <span
        aria-hidden="true"
        className={`border-border relative flex h-3.5 w-6 items-center rounded-full border ${
          reduced ? "bg-secondary" : "bg-neon/30"
        }`}
      >
        <span
          className={`bg-neon h-2 w-2 rounded-full transition-transform duration-300 ease-[var(--ease-fluid)] ${
            reduced ? "translate-x-0.5" : "translate-x-3"
          }`}
        />
      </span>
      {reduced ? "Animações off" : "Animações on"}
    </button>
  );
}
