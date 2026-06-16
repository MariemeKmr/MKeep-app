"use client";

import { motion } from "framer-motion";
import { Flame, Star } from "lucide-react";

interface Props {
  level: number;
  xpIntoLevel: number;
  xpForNext: number;
  progressPct: number;
  streak: number;
  avatarColor: string;
  username: string;
}

export default function XPBar({
  level,
  xpIntoLevel,
  xpForNext,
  progressPct,
  streak,
  avatarColor,
  username,
}: Props) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-4">
        {/* Badge de niveau */}
        <motion.div
          initial={{ scale: 0.7 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 14 }}
          className="relative grid h-16 w-16 shrink-0 place-items-center rounded-xl2 border-[3px] border-ink shadow-pop-sm"
          style={{ backgroundColor: avatarColor }}
        >
          <Star className="absolute h-16 w-16 opacity-20 text-white" />
          <span className="font-display text-2xl font-700 text-white">{level}</span>
        </motion.div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-baseline justify-between gap-2">
            <p className="truncate font-display text-lg font-600">
              Niveau {level} · {username}
            </p>
            <span className="shrink-0 font-display text-sm text-muted">
              {xpIntoLevel}/{xpForNext} XP
            </span>
          </div>

          {/* Barre d'XP */}
          <div className="relative h-5 w-full overflow-hidden rounded-full border-[3px] border-ink bg-bg">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary via-pink to-sun"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progressPct, 100)}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />
          </div>
        </div>

        {/* Streak */}
        <div className="hidden shrink-0 items-center gap-2 rounded-xl2 border-[3px] border-ink bg-coral/15 px-3 py-2 sm:flex">
          <Flame className={`h-6 w-6 text-coral ${streak > 0 ? "animate-wiggle" : ""}`} />
          <div className="leading-tight">
            <div className="font-display text-xl font-700">{streak}</div>
            <div className="text-xs text-muted">jours</div>
          </div>
        </div>
      </div>
    </div>
  );
}
