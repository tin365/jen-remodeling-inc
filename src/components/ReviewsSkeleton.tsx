export default function ReviewsSkeleton() {
  return (
    <div className="grid gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="p-4 sm:p-6 border border-rule-light border-l-4 border-l-rule-light animate-pulse"
          aria-hidden
        >
          <div className="flex items-start gap-3 mb-3 pb-3 border-b border-rule-light">
            <div className="w-10 h-10 rounded bg-rule-light/30 shrink-0" />
            <div className="flex-1 space-y-1">
              <div className="h-4 bg-rule-light/30 rounded w-1/3" />
              <div className="h-3 bg-rule-light/20 rounded w-1/4" />
            </div>
          </div>
          <div className="h-3 bg-rule-light/20 rounded w-1/6 mb-3" />
          <div className="space-y-2">
            <div className="h-4 bg-rule-light/20 rounded w-full" />
            <div className="h-4 bg-rule-light/20 rounded w-5/6" />
            <div className="h-4 bg-rule-light/20 rounded w-4/6" />
          </div>
        </div>
      ))}
    </div>
  )
}
