export default function ProjectsSkeleton() {
  return (
    <div className="grid gap-8 grid-cols-1">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-paper border border-rule animate-pulse"
          aria-hidden
        >
          <div className="grid grid-cols-1 md:grid-cols-2 border-b border-rule">
            <div className="aspect-[4/3] bg-rule-light/20 md:border-r border-rule" />
            <div className="aspect-[4/3] bg-rule-light/20" />
          </div>
          <div className="p-5 space-y-2">
            <div className="h-5 bg-rule-light/30 rounded w-2/3" />
            <div className="h-4 bg-rule-light/20 rounded w-full" />
            <div className="h-3 bg-rule-light/20 rounded w-1/4 mt-2" />
          </div>
        </div>
      ))}
    </div>
  )
}
