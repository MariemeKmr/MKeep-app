"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Trophy, Flame, Zap } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Landing() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.replace("/dashboard");
  }, [loading, user, router]);

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 py-16 text-center">
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 12 }}
        className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-xl3 border-[3px] border-ink bg-sun shadow-pop"
      >
        <Sparkles className="h-10 w-10 text-ink" />
      </motion.div>

      <h1 className="font-display text-5xl font-700 leading-tight sm:text-6xl">
        Transforme ta <span className="text-primary">to-do list</span> en{" "}
        <span className="text-pink">jeu</span>.
      </h1>
      <p className="mt-5 max-w-xl text-lg text-muted">
        MKeep récompense chaque tâche terminée : gagne de l’XP, monte de niveau,
        entretiens tes séries et débloque des succès. Aussi simple qu’une liste,
        aussi satisfaisant qu’un jeu.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link href="/register" className="btn-primary text-lg">
          <Zap className="h-5 w-5" /> Commencer à jouer
        </Link>
        <Link href="/login" className="btn-ghost text-lg">
          J’ai déjà un compte
        </Link>
      </div>

      <div className="mt-14 grid w-full grid-cols-1 gap-5 sm:grid-cols-3">
        {[
          { icon: Zap, color: "bg-primary", label: "XP & niveaux", text: "Chaque tâche rapporte des points." },
          { icon: Flame, color: "bg-coral", label: "Streaks", text: "Garde le rythme jour après jour." },
          { icon: Trophy, color: "bg-sun", label: "Succès", text: "Débloque 10 badges à collectionner." },
        ].map((f, i) => (
          <motion.div
            key={f.label}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 * i }}
            className="card p-6 text-left"
          >
            <div className={`mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl2 border-[3px] border-ink ${f.color} text-white`}>
              <f.icon className="h-6 w-6" />
            </div>
            <h3 className="font-display text-xl font-600">{f.label}</h3>
            <p className="mt-1 text-muted">{f.text}</p>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
