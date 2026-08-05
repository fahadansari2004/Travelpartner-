export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4 text-center p-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-slate-800" />
        <div className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin" />
      </div>
      <p className="text-sm font-medium text-slate-400 animate-pulse font-[family-name:var(--font-playfair)]">
        Curating your horizon...
      </p>
    </div>
  );
}
