export default function Loading() {
  return (
    <section className="section-feedback animate-pulse">
      <div className="flex justify-center">
        <div className="h-10 w-96 bg-white/10 rounded-lg" />
      </div>
      <div className="flex justify-center">
        <div className="flex gap-5">
          <div className="h-6 w-40 bg-white/10 rounded" />
          <div className="h-6 w-40 bg-white/10 rounded" />
        </div>
      </div>
      <div className="h-px bg-white/10 w-full" />
      <div className="h-4 w-full bg-white/5 rounded" />
      <div className="h-4 w-5/6 bg-white/5 rounded" />

      <div className="flex flex-col gap-4">
        <div className="h-7 w-56 bg-white/10 rounded" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="h-5 w-48 bg-white/10 rounded" />
            <div className="h-3 w-full bg-white/5 rounded" />
            <div className="h-3 w-4/5 bg-white/5 rounded" />
          </div>
        ))}
      </div>

      <div className="buttons">
        <div className="h-10 flex-1 bg-dark-200/50 rounded-full" />
        <div className="h-10 flex-1 bg-primary-200/30 rounded-full" />
      </div>
    </section>
  );
}
