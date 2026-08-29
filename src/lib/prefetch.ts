/**
 * Warms up the lazy section chunks before the visitor reaches them.
 * Uses the exact same import specifiers as the React.lazy calls in the
 * route so the browser reuses the already-fetched module.
 */
const loaders: Record<string, () => Promise<unknown>> = {
  horarios: () => import("@/components/site/Horarios"),
  comunidades: () => import("@/components/site/Comunidades"),
  tutoriais: () => import("@/components/site/Tutoriais"),
  mapa: () => import("@/components/site/MapaCampus"),
};

const done = new Set<string>();

export function prefetchSection(key: keyof typeof loaders | string) {
  const load = loaders[key];
  if (!load || done.has(key)) return;
  done.add(key);
  void load().catch(() => done.delete(key));
}

/** Fetches every remaining section chunk, one at a time, while idle. */
export function prefetchAllSections() {
  const pending = Object.keys(loaders).filter((k) => !done.has(k));
  pending.reduce<Promise<unknown>>(
    (chain, key) => chain.then(() => (prefetchSection(key), undefined)),
    Promise.resolve(),
  );
}

function saveData() {
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return Boolean(conn?.saveData);
}

/**
 * Starts prefetching as soon as the visitor shows intent: any scroll
 * movement, or a pointer/keyboard focus on a prefetch-tagged element.
 * Skipped entirely when the device asked to save data.
 */
export function initSectionPrefetch() {
  if (typeof window === "undefined" || saveData()) return () => {};

  let scrolled = false;
  const onScroll = () => {
    if (scrolled) return;
    scrolled = true;
    prefetchAllSections();
    window.removeEventListener("scroll", onScroll);
  };

  const onIntent = (event: Event) => {
    const target = (event.target as HTMLElement | null)?.closest?.("[data-prefetch]");
    const key = target?.getAttribute("data-prefetch");
    if (key) prefetchSection(key);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("pointerenter", onIntent, true);
  document.addEventListener("focusin", onIntent);
  document.addEventListener("touchstart", onIntent, { passive: true, capture: true });

  return () => {
    window.removeEventListener("scroll", onScroll);
    document.removeEventListener("pointerenter", onIntent, true);
    document.removeEventListener("focusin", onIntent);
    document.removeEventListener("touchstart", onIntent, true);
  };
}
