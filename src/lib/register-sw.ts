/**
 * Single guarded entry point for the generated service worker.
 * Never registers in dev, inside an iframe, or on Lovable preview hosts.
 */
function isBlockedContext() {
  if (!import.meta.env.PROD) return true;
  if (typeof window === "undefined") return true;
  if (window.self !== window.top) return true;
  const host = window.location.hostname;
  if (host.startsWith("id-preview--") || host.startsWith("preview--")) return true;
  if (host === "lovableproject.com" || host.endsWith(".lovableproject.com")) return true;
  if (host === "lovableproject-dev.com" || host.endsWith(".lovableproject-dev.com")) return true;
  if (host === "beta.lovable.dev" || host.endsWith(".beta.lovable.dev")) return true;
  if (new URLSearchParams(window.location.search).get("sw") === "off") return true;
  return false;
}

async function unregisterAppWorker() {
  if (!("serviceWorker" in navigator)) return;
  const regs = await navigator.serviceWorker.getRegistrations();
  await Promise.allSettled(
    regs
      .filter((r) => (r.active?.scriptURL ?? r.installing?.scriptURL ?? "").endsWith("/sw.js"))
      .map((r) => r.unregister()),
  );
}

let waitingWorker: ServiceWorker | null = null;

/** Applies the update that is waiting and reloads once it takes control. */
export function applyServiceWorkerUpdate() {
  if (!waitingWorker) {
    window.location.reload();
    return;
  }
  navigator.serviceWorker.addEventListener(
    "controllerchange",
    () => window.location.reload(),
    { once: true },
  );
  waitingWorker.postMessage({ type: "SKIP_WAITING" });
}

export function registerServiceWorker(onUpdateReady?: () => void) {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
  if (isBlockedContext()) {
    void unregisterAppWorker();
    return;
  }

  void navigator.serviceWorker
    .register("/sw.js", { scope: "/" })
    .then((reg) => {
      const notify = (worker: ServiceWorker | null) => {
        if (!worker || !navigator.serviceWorker.controller) return;
        waitingWorker = worker;
        onUpdateReady?.();
      };

      notify(reg.waiting);
      reg.addEventListener("updatefound", () => {
        const installing = reg.installing;
        installing?.addEventListener("statechange", () => {
          if (installing.state === "installed") notify(installing);
        });
      });
    })
    .catch(() => {
      /* offline support is a progressive enhancement */
    });
}
