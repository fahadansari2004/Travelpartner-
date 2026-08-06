"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Globe, Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("ADMIN_AUTH", "true");
          localStorage.setItem("ADMIN_AUTH", "true");
        }
        router.push("/admin");
      } else {
        setError(data.message || "Invalid admin credentials");
      }
    } catch (err) {
      setError("Authentication failed. Please check network connection.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white font-sans flex items-center justify-center p-4 selection:bg-amber-500/30 selection:text-amber-200">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 glass-card max-w-md w-full p-8 sm:p-10 rounded-3xl border border-white/20 bg-slate-900/90 shadow-2xl space-y-8">
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Globe size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold font-[family-name:var(--font-playfair)]">
              Travel<span className="gradient-text">Partner</span>
            </span>
          </Link>

          <h1 className="text-2xl font-bold font-[family-name:var(--font-playfair)]">Admin Console Login</h1>
          <p className="text-xs text-slate-400">Secure access portal for site management & enquiries desk.</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs uppercase text-slate-300 font-semibold mb-1">Admin Email</label>
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm focus-within:border-amber-400">
              <Mail size={16} className="text-slate-400" />
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent text-white focus:outline-none w-full text-xs" 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase text-slate-300 font-semibold mb-1">Password</label>
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm focus-within:border-amber-400">
              <Lock size={16} className="text-slate-400" />
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent text-white focus:outline-none w-full text-xs" 
              />
            </div>
          </div>

          <div className="pt-2">
            <Button variant="amber" size="lg" fullWidth type="submit" rightIcon={<ArrowRight size={16} />}>
              Authenticate & Open Dashboard
            </Button>
          </div>
        </form>

        <div className="text-center pt-2 border-t border-white/10">
          <Link href="/" className="text-xs text-slate-400 hover:text-amber-400 transition-colors">
            ← Return to Main Website
          </Link>
        </div>
      </div>
    </main>
  );
}
