export default function Loading() {
  return (
    <div className="flex flex-col gap-8 animate-pulse">
      {/* Interview header skeleton */}
      <div className="flex flex-row gap-4 justify-between">
        <div className="flex flex-row gap-4 items-center">
          <div className="size-10 rounded-full bg-white/10" />
          <div className="flex flex-col gap-2">
            <div className="h-6 w-44 bg-white/10 rounded" />
            <div className="h-3 w-24 bg-white/5 rounded" />
          </div>
          <div className="flex gap-2 ml-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="size-7 rounded-full bg-white/10" />
            ))}
          </div>
        </div>
        <div className="h-9 w-24 bg-dark-200 rounded-lg" />
      </div>

      {/* Call view skeleton */}
      <div className="call-view">
        <div className="card-interviewer flex-1">
          <div className="size-[120px] rounded-full bg-primary-200/20" />
          <div className="h-5 w-48 bg-white/10 rounded mt-5" />
          <div className="h-3 w-24 bg-white/5 rounded mt-2" />
        </div>
        <div className="card-border flex-1 max-md:hidden">
          <div className="card-content dark-gradient rounded-2xl min-h-full flex flex-col items-center gap-4">
            <div className="size-[120px] rounded-full bg-white/10" />
            <div className="h-5 w-36 bg-white/10 rounded" />
          </div>
        </div>
      </div>

      {/* Button skeleton */}
      <div className="flex justify-center">
        <div className="h-12 w-36 bg-success-100/30 rounded-full" />
      </div>
    </div>
  );
}
