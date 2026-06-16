"use client";

import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import { api } from "@/lib/api";
import type { Achievement } from "@/lib/types";
import AchievementBadge from "@/components/AchievementBadge";

export default function AchievementsPage() {
  const [items, setItems] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.achievements().then((a) => {
      setItems(a);
      setLoading(false);
    });
  }, []);

  const unlocked = items.filter((a) => a.unlocked).length;

  if (loading) return <div className="grid h-40 place-items-center text-muted">Chargement…</div>;

  return (
    <div className="space-y-6">
      <div className="card flex items-center gap-4 p-5">
        <div className="grid h-14 w-14 place-items-center rounded-xl2 border-[3px] border-ink bg-sun shadow-pop-sm">
          <Trophy className="h-7 w-7 text-ink" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-700">Tes succès</h1>
          <p className="text-muted">
            {unlocked}/{items.length} débloqués — continue de jouer pour tous les obtenir !
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {items.map((a) => (
          <AchievementBadge key={a.code} a={a} />
        ))}
      </div>
    </div>
  );
}
