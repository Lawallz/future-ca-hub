import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";

const STORAGE_KEY = "caads-intro-seen";

/** Reads the real loading progress of fonts + images + document readiness. */
function useRealAssetProgress(enabled: boolean) {
  const [target, setTarget] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    // Weighted milestones: document (30) + fonts (30) + images (40)
    let docPart = document.readyState === "complete" ? 30 : 0;
    let fontPart = 0;
    let imgPart = 0;

    const push = () => {
      if (cancelled) return;
      const total = Math.min(100, docPart + fontPart + imgPart);
      setTarget(total);
      if (total >= 100) setDone(true);
    };

    const onLoad = () => {
      docPart = 30;
      push();
    };
    if (docPart < 30) window.addEventListener("load", onLoad, { once: true });

    // Fonts
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    if (fonts?.ready) {
      fonts.ready.then(() => {
        fontPart = 30;
        push();
      });
    } else {
      fontPart = 30;
    }

    // Images present in the initial document
    const imgs = Array.from(document.images);
    if (imgs.length === 0) {
      imgPart = 40;
    } else {
      let loaded = 0;
      const bump = () => {
        loaded += 1;
        imgPart = Math.round((loaded / imgs.length) * 40);
        push();
      };
      imgs.forEach((img) => {
        if (img.complete) bump();
        else {
          img.addEventListener("load", bump, { once: true });
          img.addEventListener("error", bump, { once: true });
        }
      });
    }

    push();

    // Safety net: never hang the splash for more than 6s.
    const failsafe = window.setTimeout(() => {
      docPart = 30;
      fontPart = 30;
      imgPart = 40;
      push();
    }, 6000);

    return () => {
      cancelled = true;
      window.clearTimeout(failsafe);
      window.clearTimeout(failsafe);
      window.removeEventListener("load", onLoad);
    };
  }, [enabled]);

  return { target, done };
}

export function IntroScreen({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const [progress, setProgress] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState<boolean | null>(null); // null = undetermined (SSR safe)
  const finishing = useRef(false);
  const displayed = useRef(0);

  // Decide, on the client only, whether the intro should play at all.
  useEffect(() => {
    let seen = false;
    try {
      seen = localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      seen = false;
    }
    if (seen) {
      setActive(false);
      setHidden(true);
      onDone();
    } else {
      setActive(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { target, done } = useRealAssetProgress(active === true);

  const finish = useCallback(() => {
    if (finishing.current) return;
    finishing.current = true;
    const lastFocus = document.activeElement as HTMLElement | null;
    gsap
      .timeline()
      .to("[data-intro-inner]", { y: -30, opacity: 0, duration: 0.45, ease: "power2.in" })
      .to(root.current, {
        yPercent: -100,
        duration: 0.9,
        ease: "expo.inOut",
        onComplete: () => {
          try {
            localStorage.setItem(STORAGE_KEY, "1");
          } catch {
            /* storage unavailable — intro simply plays again next time */
          }
          document.body.style.overflow = "";
          setHidden(true);
          if (lastFocus === skipRef.current) {
            document.querySelector<HTMLElement>("header a, header button")?.focus();
          }
          onDone();
        },
      });
  }, [onDone]);

  // Entrance animation + focus management + focus trap + keyboard handling
  useEffect(() => {
    if (active !== true) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      gsap.set("[data-intro-bar]", { scaleX: 0, transformOrigin: "left center" });
      gsap
        .timeline()
        .from("[data-intro-logo]", { scale: 0.85, opacity: 0, duration: 0.8, ease: "power3.out" })
        .from("[data-intro-label]", { y: 14, opacity: 0, duration: 0.6 }, "-=0.4");
    }, root);

    skipRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        finish();
        return;
      }
      if (e.key !== "Tab") return;
      const focusables = root.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables || focusables.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }

    };

    // Keep focus inside the splash even if something else steals it.
    const onFocusIn = (e: FocusEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) {
        skipRef.current?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("focusin", onFocusIn);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("focusin", onFocusIn);
      ctx.revert();
      document.body.style.overflow = "";
      if (previouslyFocused && document.contains(previouslyFocused)) {
        // no-op: focus is redirected in finish()
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // Smoothly tween the visible counter toward the real asset progress.
  useEffect(() => {
    if (active !== true) return;
    const state = { value: displayed.current };
    const tween = gsap.to(state, {
      value: target,
      duration: 0.6,
      ease: "power2.out",
      onUpdate: () => {
        displayed.current = state.value;
        setProgress(Math.round(state.value));
      },
    });
    gsap.to("[data-intro-bar]", { scaleX: target / 100, duration: 0.6, ease: "power2.out" });
    return () => {
      tween.kill();
    };
  }, [target, active]);

  // Exit once everything is really loaded and the counter caught up.
  useEffect(() => {
    if (active !== true || !done || progress < 100) return;
    const t = window.setTimeout(finish, 300);
    return () => window.clearTimeout(t);
  }, [done, progress, active, finish]);

  if (hidden || active !== true) return null;

  return (
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label="Carregando o site do CA-ADS"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0a]"
    >
      <div className="veil pointer-events-none absolute inset-x-0 top-0 h-1/2" aria-hidden="true" />
      <div data-intro-inner className="relative flex w-[min(90vw,420px)] flex-col items-center">
        <div data-intro-logo className="flex items-center gap-3">
          <span className="relative grid h-14 w-14 place-items-center rounded-2xl border border-neon/40 bg-neon/10">
            <span className="font-display text-lg font-bold neon-text">CA</span>
            <span className="absolute inset-0 rounded-2xl shadow-[var(--shadow-neon)]" />
          </span>
          <span className="font-display text-3xl font-bold tracking-tight text-foreground">
            ADS<span className="neon-text">.</span>
          </span>
        </div>

        <p
          data-intro-label
          className="mt-6 text-[11px] tracking-[0.35em] text-muted-foreground uppercase"
        >
          IFSP — Campus São Paulo
        </p>

        <div
          className="mt-8 h-px w-full overflow-hidden bg-border"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          aria-label="Progresso do carregamento"
        >
          <div
            data-intro-bar
            className="h-px w-full origin-left scale-x-0 bg-neon shadow-[var(--shadow-neon)]"
          />
        </div>

        <div className="mt-3 flex w-full items-center justify-between text-[11px] text-muted-foreground">
          <span aria-live="polite" aria-atomic="true">
            Carregando {progress}%
          </span>
          <span className="font-display tabular-nums text-foreground" aria-hidden="true">
            {String(progress).padStart(3, "0")}%
          </span>
        </div>

        <button
          ref={skipRef}
          type="button"
          onClick={finish}
          className="mt-8 rounded-full border border-border px-4 py-2 text-[11px] tracking-[0.2em] text-muted-foreground uppercase transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-neon focus-visible:outline-none"
        >
          Pular introdução
        </button>
      </div>
    </div>
  );
}
