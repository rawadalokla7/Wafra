function Shimmer({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-md ${className}`} style={{ background: 'var(--bg-secondary)' }} />
}

export function DashboardSkeleton() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <div>
        <Shimmer className="h-7 w-48" />
        <Shimmer className="mt-2 h-4 w-64" />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-card border border-[var(--border)] bg-[var(--bg-elevated)] p-5">
            <Shimmer className="h-4 w-24" />
            <Shimmer className="mt-4 h-7 w-32" />
          </div>
        ))}
      </div>

      <div>
        <Shimmer className="mb-3 h-4 w-20" />
        <div className="flex gap-4 overflow-hidden">
          {[0, 1, 2].map((i) => (
            <Shimmer key={i} className="h-32 w-56 shrink-0" />
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-card border border-[var(--border)] bg-[var(--bg-elevated)] p-6 lg:col-span-2">
          <Shimmer className="h-4 w-40" />
          <div className="mt-5 flex flex-col gap-4">
            {[0, 1, 2, 3].map((i) => (
              <Shimmer key={i} className="h-10 w-full" />
            ))}
          </div>
        </div>
        <div className="rounded-card border border-[var(--border)] bg-[var(--bg-elevated)] p-6">
          <Shimmer className="h-4 w-32" />
          <Shimmer className="mx-auto mt-6 h-36 w-36 rounded-full" />
        </div>
      </div>
    </div>
  )
}
