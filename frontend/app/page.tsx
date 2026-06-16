"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Trophy, Flame, Zap } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Landing() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.replace("/dashboard");
  }, [loading, user, router]);

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 py-16 text-center">
      
      {/* 💥 Le logo écrit en ENORME et animé au chargement */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 150, damping: 10 }}
        className="mb-8"
      >
        <span className="logo-mkeep text-8xl sm:text-11xl tracking-widest inline-block transform -rotate-1 select-none">
          MKeep
        </span>
      </motion.div>

      {/* Slogan Accrocheur */}
      <h1 className="font-display text-4xl font-bold leading-tight sm:text-6xl text-ink mt-2">
        Transforme ta <span className="text-primary">to-do list</span> en{" "}
        <span className="text-pink">jeu</span>.
      </h1>
      
      <p className="mt-6 max-w-xl text-lg sm:text-xl text-muted font-sans font-medium">
        MKeep récompense chaque tâche terminée : gagne de l’XP, monte de niveau,
        entretiens tes séries et débloque des succès. Aussi simple qu’une liste,
        aussi satisfaisant qu’un jeu.
      </p>

      {/* Boutons d'Action Arcade */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link href="/register" className="btn-primary text-lg px-6 py-4 flex items-center gap-2">
          <Zap className="h-5 w-5 fill-sun text-sun" /> Commencer à jouer
        </Link>
        <Link href="/login" className="btn-ghost text-lg px-6 py-4">
          J’ai déjà un compte
        </Link>
      </div>

      {/* Grille de Fonctionnalités (Cartes Neo-Brutalistes) */}
      <div className="mt-16 grid w-full grid-cols-1 gap-5 sm:grid-cols-3">
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
            className="card p-6 text-left group cursor-pointer"
          >
            <div className={`mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl2 border-[3px] border-ink ${f.color} text-white shadow-pop-sm group-hover:scale-105 transition-transform`}>
              <f.icon className="h-6 w-6 text-ink" />
            </div>
            <h3 className="font-display text-xl font-bold text-ink">{f.label}</h3>
            <p className="mt-1 text-muted font-sans font-medium">{f.text}</p>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
