import { useSyncExternalStore } from "react";

export const MOTION_STORAGE_KEY = "caads-reduce-motion";
export const MOTION_CLASS = "reduce-motion";

const listeners = new Set<() => void>();
let cached: boolean | null = null;

function systemPrefersReduced() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Reads the persisted preference, falling back to the OS setting. */
export function readReduceMotion(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const stored = localStorage.getItem(MOTION_STORAGE_KEY);
    if (stored === "1") return true;
    if (stored === "0") return false;
  } catch {
    /* storage unavailable */
  }
  return systemPrefersReduced();
}

function emit() {
  listeners.forEach((l) => l());
}

/** Applies the preference to <html> so CSS can neutralize animations. */
export function applyReduceMotionClass(value: boolean) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle(MOTION_CLASS, value);
}

export function setReduceMotion(value: boolean) {
  cached = value;
  try {
    localStorage.setItem(MOTION_STORAGE_KEY, value ? "1" : "0");
  } catch {
    /* storage unavailable — preference stays for this session only */
  }
  applyReduceMotionClass(value);
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  if (cached === null) cached = readReduceMotion();
  return cached;
}

/** SSR renders the animated default; the client syncs on hydration. */
export function useReduceMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => false,
  );
}

/** Inline script that applies the class before first paint (no flash). */
export const reduceMotionBootScript = `(function(){try{var v=localStorage.getItem('${MOTION_STORAGE_KEY}');var on=v==='1'||(v===null&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);if(on)document.documentElement.classList.add('${MOTION_CLASS}');}catch(e){}})();`;
