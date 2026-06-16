"use client";

import { motion } from "framer-motion";
import {
  Sparkles, CheckCircle2, Zap, Rocket, Flame, Star, Crown, Sunrise, Moon, Lock,
  type LucideIcon,
} from "lucide-react";
import type { Achievement } from "@/lib/types";

// Mapping explicite : n'embarque que les icônes réellement utilisées.
const ICONS: Record<string, LucideIcon> = {
  Sparkles, CheckCircle2, Zap, Rocket, Flame, Star, Crown, Sunrise, Moon,
};

export default function AchievementBadge({ a }: { a: Achievement }) {
  const Icon = ICONS[a.icon];

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`card flex flex-col items-center p-5 text-center ${a.unlocked ? "" : "opacity-60"}`}
    >
      <div
        className="mb-3 grid h-16 w-16 place-items-center rounded-xl3 border-[3px] border-ink shadow-pop-sm"
        style={{ backgroundColor: a.unlocked ? a.color : "#E7E1F5" }}
      >
        {a.unlocked && Icon ? (
          <Icon className="h-8 w-8 text-white" />
        ) : (
          <Lock className="h-7 w-7 text-muted" />
        )}
      </div>
      <h3 className="font-display text-base font-600">{a.name}</h3>
      <p className="mt-1 text-sm text-muted">{a.description}</p>
    </motion.div>
  );
}
