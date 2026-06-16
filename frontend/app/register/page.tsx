"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { UserPlus, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setError("");
    if (password.length < 6) {
      setError("Le mot de passe doit faire au moins 6 caractères.");
      return;
    }
    setBusy(true);
    try {
      await register(email, username, password);
    } catch (e: any) {
      setError(e.message || "Inscription impossible");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      {/* Logo MKeep en relief cliquable pour revenir à l'accueil */}
      <Link href="/" className="logo-mkeep text-6xl mb-8 tracking-wider">
        MKeep
      </Link>

      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="card w-full max-w-md p-8"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl2 border-[3px] border-ink bg-pink text-white shadow-pop-sm">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="font-display text-2xl font-bold text-ink">Crée ton aventure</h1>
        </div>

        {error && (
          <div className="mb-4 rounded-xl2 border-2 border-ink bg-coral/20 px-4 py-2 text-sm font-semibold text-ink">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <input className="input" placeholder="Pseudo" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input className="input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input
            className="input"
            type="password"
            placeholder="Mot de passe (6+ caractères)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
          <button className="btn-pink w-full flex items-center justify-center gap-2" onClick={submit} disabled={busy}>
            <UserPlus className="h-5 w-5" /> {busy ? "Création…" : "Créer mon compte"}
          </button>
        </div>

        <p className="mt-6 text-center text-muted font-medium">
          Déjà inscrit ?{" "}
          <Link href="/login" className="font-bold text-primary underline decoration-2">
            Connecte-toi
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
