/** Lightweight shimmer block used by the progressive loading states. */
export function Shimmer({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`block animate-pulse rounded-full bg-foreground/10 ${className}`}
    />
  );
}

/** Placeholder shown while a deferred section chunk is being fetched. */
export function SectionSkeleton({ label }: { label: string }) {
  return (
    <section className="px-5 py-24" aria-busy="true" aria-label={`Carregando ${label}`}>
      <div className="mx-auto max-w-6xl">
        <Shimmer className="h-3 w-32" />
        <Shimmer className="mt-4 h-8 w-72 max-w-full rounded-2xl" />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="glass rounded-3xl p-6">
              <Shimmer className="h-10 w-16 rounded-2xl" />
              <Shimmer className="mt-5 h-4 w-2/3" />
              <Shimmer className="mt-3 h-3 w-full" />
              <Shimmer className="mt-2 h-3 w-4/5" />
              <Shimmer className="mt-6 h-3 w-24" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
