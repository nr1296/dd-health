export default function Loading() {
  return (
    <main className="p-8">
      <div className="h-8 w-48 bg-slate-200 rounded animate-pulse mb-8" />
      <div className="flex flex-col gap-3">
        {[1, 2].map((i) => (
          <div key={i} className="h-28 bg-slate-200 rounded-xl animate-pulse" />
        ))}
      </div>
    </main>
  );
}
