export default function Loading() {
  return (
    <main className="p-8">
      <div className="h-8 w-56 bg-slate-200 rounded animate-pulse mb-2" />
      <div className="h-4 w-36 bg-slate-200 rounded animate-pulse mb-8" />
      <div className="flex flex-col gap-3">
        {[1, 2].map((i) => (
          <div key={i} className="h-20 bg-slate-200 rounded-xl animate-pulse" />
        ))}
      </div>
    </main>
  );
}
