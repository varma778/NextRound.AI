export default function Loading() {
  return (
    <div className="flex flex-col gap-8 animate-pulse">
      {/* Hero skeleton */}
      <div className="card-cta">
        <div className="flex flex-col gap-4 max-w-xl w-full">
          <div className="h-3 w-32 bg-primary-200/20 rounded-full" />
          <div className="h-8 w-3/4 bg-white/10 rounded-lg" />
          <div className="h-4 w-full bg-white/5 rounded" />
          <div className="h-4 w-2/3 bg-white/5 rounded" />
          <div className="h-10 w-48 bg-primary-200/30 rounded-full" />
        </div>
      </div>

      {/* Feature cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card p-6 flex flex-col gap-3">
            <div className="h-5 w-3/4 bg-white/10 rounded" />
            <div className="h-3 w-full bg-white/5 rounded" />
            <div className="h-3 w-5/6 bg-white/5 rounded" />
          </div>
        ))}
      </div>

      {/* Interview cards skeleton */}
      <div className="flex flex-col gap-4">
        <div className="h-7 w-44 bg-white/10 rounded" />
        <div className="interviews-section">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="card-border w-[360px] max-sm:w-full min-h-96"
            >
              <div className="card-interview gap-4">
                <div className="flex flex-col gap-3">
                  <div className="size-[90px] rounded-full bg-white/10" />
                  <div className="h-6 w-2/3 bg-white/10 rounded mt-5" />
                  <div className="h-3 w-full bg-white/5 rounded mt-3" />
                  <div className="h-3 w-5/6 bg-white/5 rounded" />
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="size-7 rounded-full bg-white/10" />
                    ))}
                  </div>
                  <div className="h-9 w-28 bg-primary-200/20 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
