import { useEffect, useRef } from "react";
import { useReduceMotion } from "./motion-preference";

/** Native, one-shot reveals. Content stays readable before JS and on failures. */
export function useReveal<T extends HTMLElement = HTMLDivElement>(deps: unknown[] = []) {
  const ref = useRef<T>(null);
  const reduced = useReduceMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || typeof IntersectionObserver === "undefined") return;
    const animations: Animation[] = [];
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      el.querySelectorAll<HTMLElement>("[data-reveal]").forEach((target, index) => {
        if (typeof target.animate !== "function") return;
        animations.push(target.animate(
          [{ transform: "translateY(16px)" }, { transform: "translateY(0)" }],
          { duration: 350, delay: Math.min(index * 30, 180), easing: "ease-out" },
        ));
      });
    }, { rootMargin: "0px 0px -10% 0px" });
    observer.observe(el);
    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
    };
    // Callers provide stable dependencies for the section's contents.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, ...deps]);

  return ref;
}
