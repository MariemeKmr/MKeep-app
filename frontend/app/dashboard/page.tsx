"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Plus, Zap, CheckCircle2, Flame, Target, ListTodo } from "lucide-react";

import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import type { Task, Stats, TaskPriority } from "@/lib/types";

import XPBar from "@/components/XPBar";
import StatCard from "@/components/StatCard";
import WeeklyChart from "@/components/WeeklyChart";
import TaskCard from "@/components/TaskCard";
import TaskModal from "@/components/TaskModal";
import LevelUpModal from "@/components/LevelUpModal";

function fireConfetti() {
  confetti({
    particleCount: 90,
    spread: 70,
    origin: { y: 0.7 },
    colors: ["#7C5CFF", "#FF6B9D", "#34D399", "#FFC93C", "#4CC9F0"],
  });
}

export default function DashboardPage() {
  const { user, refresh } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [levelUp, setLevelUp] = useState<number | null>(null);
  const [filter, setFilter] = useState<"active" | "done">("active");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [t, s] = await Promise.all([api.listTasks(), api.stats()]);
    setTasks(t);
    setStats(s);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const createTask = async (data: { title: string; description?: string; priority: TaskPriority; category?: string }) => {
    await api.createTask(data);
    await load();
  };

  const completeTask = async (id: number) => {
    const res = await api.completeTask(id);
    fireConfetti();
    if (res.leveled_up) setTimeout(() => setLevelUp(res.new_level), 400);
    await Promise.all([load(), refresh()]);
  };

  const reopenTask = async (id: number) => {
    await api.reopenTask(id);
    await Promise.all([load(), refresh()]);
  };

  const deleteTask = async (id: number) => {
    await api.deleteTask(id);
    await Promise.all([load(), refresh()]);
  };

  const active = tasks.filter((t) => t.status !== "done");
  const done = tasks.filter((t) => t.status === "done");
  const shown = filter === "active" ? active : done;

  if (!user || !stats || loading) {
    return <div className="grid h-40 place-items-center text-muted">Chargement…</div>;
  }

  return (
    <div className="space-y-6">
      <XPBar
        level={stats.level}
        xpIntoLevel={stats.xp_into_level}
        xpForNext={stats.xp_for_next}
        progressPct={stats.progress_pct}
        streak={stats.current_streak}
        avatarColor={user.avatar_color}
        username={user.username}
      />

      {/* Stats rapides */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={Zap} value={stats.xp} label="XP total" color="#7C5CFF" />
        <StatCard icon={CheckCircle2} value={stats.done_tasks} label="terminées" color="#34D399" />
        <StatCard icon={Flame} value={stats.current_streak} label="série" color="#FF6B6B" />
        <StatCard icon={Target} value={`${stats.completion_rate}%`} label="réussite" color="#FFC93C" />
      </div>

      <WeeklyChart data={stats.weekly} />

      {/* Liste des tâches */}
      <div className="card p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("active")}
              className={`chip ${filter === "active" ? "bg-primary text-white" : "bg-white"}`}
            >
              <ListTodo className="h-4 w-4" /> À faire ({active.length})
            </button>
            <button
              onClick={() => setFilter("done")}
              className={`chip ${filter === "done" ? "bg-mint text-ink" : "bg-white"}`}
            >
              <CheckCircle2 className="h-4 w-4" /> Faites ({done.length})
            </button>
          </div>
          <button onClick={() => setModalOpen(true)} className="btn-primary px-4 py-2 text-sm">
            <Plus className="h-4 w-4" /> Nouvelle
          </button>
        </div>

        {shown.length === 0 ? (
          <div className="py-10 text-center">
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3 }} className="mb-2 text-4xl">
              <Target className="mx-auto h-12 w-12 text-primary" />
            </motion.div>
            <p className="font-display text-lg font-600">
              {filter === "active" ? "Aucune quête en cours" : "Rien de terminé… encore !"}
            </p>
            <p className="text-muted">
              {filter === "active" ? "Ajoute ta première tâche et commence à gagner de l’XP." : "Termine une tâche pour la voir apparaître ici."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {shown.map((t) => (
                <TaskCard key={t.id} task={t} onComplete={completeTask} onReopen={reopenTask} onDelete={deleteTask} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Bouton flottant mobile */}
      <button
        onClick={() => setModalOpen(true)}
        aria-label="Nouvelle tâche"
        className="fixed bottom-24 right-5 z-40 grid h-14 w-14 place-items-center rounded-xl3 border-[3px] border-ink bg-pink text-white shadow-pop sm:hidden"
      >
        <Plus className="h-7 w-7" />
      </button>

      <TaskModal open={modalOpen} onClose={() => setModalOpen(false)} onCreate={createTask} />
      <LevelUpModal open={levelUp !== null} level={levelUp ?? 0} onClose={() => setLevelUp(null)} />
    </div>
  );
}
