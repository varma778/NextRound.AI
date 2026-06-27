export default function Loading() {
  return (
    <div className="flex flex-col gap-10 animate-pulse">
      <section className="flex flex-col gap-3">
        <div className="h-3 w-24 bg-primary-200/20 rounded-full" />
        <div className="h-8 w-72 bg-white/10 rounded-lg" />
        <div className="h-4 w-full max-w-2xl bg-white/5 rounded" />
        {/* Form skeleton */}
        <div className="space-y-5 w-full max-w-2xl mt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="h-3 w-24 bg-white/10 rounded" />
                <div className="h-12 w-full bg-dark-200 rounded-full" />
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-3 w-32 bg-white/10 rounded" />
            <div className="h-12 w-full bg-dark-200 rounded-full" />
          </div>
          <div className="h-12 w-full bg-primary-200/30 rounded-full" />
        </div>
      </section>
    </div>
  );
}
