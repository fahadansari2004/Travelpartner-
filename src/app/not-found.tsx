import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-6 animate-float">
        <Compass size={40} />
      </div>
      <h1 className="text-6xl font-bold text-white font-[family-name:var(--font-playfair)]">
        404
      </h1>
      <h2 className="text-2xl font-semibold text-slate-300 mt-2 font-[family-name:var(--font-playfair)]">
        Destination Not Found
      </h2>
      <p className="text-slate-400 text-sm max-w-md mt-3 leading-relaxed">
        It seems you have wandered off the mapped trail. The page or destination you were looking for does not exist or has moved.
      </p>
      <div className="mt-8 flex gap-4">
        <Button variant="amber" size="lg">
          <Link href="/">Return Home</Link>
        </Button>
        <Button variant="outline" size="lg">
          <Link href="/destinations">Explore Catalog</Link>
        </Button>
      </div>
    </div>
  );
}
