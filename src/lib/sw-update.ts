/** Tiny pub/sub bridging the service worker registration and the UI banner. */
const listeners = new Set<() => void>();
let pending = false;

export function notifyServiceWorkerUpdate() {
  pending = true;
  listeners.forEach((l) => l());
}

/** Subscribes to "new version ready"; fires immediately if it already is. */
export function onServiceWorkerUpdate(listener: () => void) {
  listeners.add(listener);
  if (pending) listener();
  return () => {
    listeners.delete(listener);
  };
}
