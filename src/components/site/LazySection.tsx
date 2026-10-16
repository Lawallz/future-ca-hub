import { Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { SectionSkeleton } from "./Skeletons";

/**
 * Mounts its children (a React.lazy section) only when the placeholder gets
 * close to the viewport, so each section chunk is fetched on demand.
 */
export function LazySection({
  id,
  label,
  children,
  rootMargin = "400px",
}: {
  id: string;
  label: string;
  children: ReactNode;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onHash = () => {
      if (window.location.hash === `#${id}`) setShow(true);
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [id]);

  useEffect(() => {
    const el = ref.current;
    if (!el || show) return;
    if (typeof IntersectionObserver === "undefined") {
      setShow(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [show, rootMargin]);

  return (
    <div ref={ref} id={id} className="scroll-mt-20">
      {show ? (
        <Suspense fallback={<SectionSkeleton label={label} />}>
          {children}
        </Suspense>
      ) : (
        <SectionSkeleton label={label} />
      )}
    </div>
  );
}
