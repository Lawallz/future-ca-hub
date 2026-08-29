import { Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { SectionSkeleton } from "./Skeletons";

/**
 * Mounts its children (a React.lazy section) only when the placeholder gets
 * close to the viewport, so each section chunk is fetched on demand.
 */
export function LazySection({
  label,
  children,
  rootMargin = "400px",
}: {
  label: string;
  children: ReactNode;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

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
    <div ref={ref}>
      {show ? (
        <Suspense fallback={<SectionSkeleton label={label} />}>{children}</Suspense>
      ) : (
        <SectionSkeleton label={label} />
      )}
    </div>
  );
}
