"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LogIn, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setError("");
    setBusy(true);
    try {
      await login(email, password);
    } catch (e: any) {
      setError(e.message || "Connexion impossible");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="card w-full max-w-md p-8"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl2 border-[3px] border-ink bg-primary text-white shadow-pop-sm">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="font-display text-2xl font-700">Content de te revoir !</h1>
        </div>

        {error && (
          <div className="mb-4 rounded-xl2 border-2 border-ink bg-coral/20 px-4 py-2 text-sm font-semibold text-ink">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <input
            className="input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
          <input
            className="input"
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
          <button className="btn-primary w-full" onClick={submit} disabled={busy}>
            <LogIn className="h-5 w-5" /> {busy ? "Connexion…" : "Se connecter"}
          </button>
        </div>

        <p className="mt-6 text-center text-muted">
          Pas encore de compte ?{" "}
          <Link href="/register" className="font-semibold text-primary underline">
            Crée-en un
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
