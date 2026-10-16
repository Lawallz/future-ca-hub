/**
 * Warms up the lazy section chunks before the visitor reaches them.
 * Uses the exact same import specifiers as the React.lazy calls in the
 * route so the browser reuses the already-fetched module.
 */
const loaders: Record<string, () => Promise<unknown>> = {
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

function saveData() {
  const conn = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection;
  return Boolean(conn?.saveData);
}

/**
 * Starts prefetching on pointer/keyboard intent toward a section link.
 * Skipped entirely when the device asked to save data.
 */
export function initSectionPrefetch() {
  if (typeof window === "undefined" || saveData()) return () => {};

  const onIntent = (event: Event) => {
    const target = (event.target as HTMLElement | null)?.closest?.(
      "[data-prefetch]",
    );
    const key = target?.getAttribute("data-prefetch");
    if (key) prefetchSection(key);
  };

  document.addEventListener("pointerenter", onIntent, true);
  document.addEventListener("focusin", onIntent);
  document.addEventListener("touchstart", onIntent, {
    passive: true,
    capture: true,
  });

  return () => {
    document.removeEventListener("pointerenter", onIntent, true);
    document.removeEventListener("focusin", onIntent);
    document.removeEventListener("touchstart", onIntent, true);
  };
}
