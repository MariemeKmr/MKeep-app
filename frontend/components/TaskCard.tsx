"use client";

import { motion } from "framer-motion";
import { Check, Trash2, RotateCcw, Flag } from "lucide-react";
import type { Task, TaskPriority } from "@/lib/types";

const PRIORITY: Record<TaskPriority, { label: string; color: string; xp: number }> = {
  low: { label: "Cool", color: "#4CC9F0", xp: 10 },
  medium: { label: "Normal", color: "#FFC93C", xp: 20 },
  high: { label: "Urgent", color: "#FF6B6B", xp: 35 },
};

export default function TaskCard({
  task,
  onComplete,
  onReopen,
  onDelete,
}: {
  task: Task;
  onComplete: (id: number) => void;
  onReopen: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  const done = task.status === "done";
  const p = PRIORITY[task.priority];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85 }}
      className={`card flex items-center gap-3 p-4 ${done ? "opacity-70" : ""}`}
    >
      <button
        onClick={() => (done ? onReopen(task.id) : onComplete(task.id))}
        aria-label={done ? "Rouvrir la tâche" : "Terminer la tâche"}
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl2 border-[3px] border-ink transition-all active:translate-x-[2px] active:translate-y-[2px] ${
          done ? "bg-mint text-ink" : "bg-white text-transparent hover:bg-mint/30"
        }`}
      >
        <Check className="h-5 w-5" />
      </button>

      <div className="min-w-0 flex-1">
        <p className={`truncate font-display text-lg font-600 ${done ? "line-through" : ""}`}>
          {task.title}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <span className="chip" style={{ backgroundColor: `${p.color}33`, borderColor: "#2B2147" }}>
            <Flag className="h-3.5 w-3.5" style={{ color: p.color }} /> {p.label} · +{p.xp} XP
          </span>
          {task.category && <span className="chip bg-bg">{task.category}</span>}
        </div>
      </div>

      <div className="flex shrink-0 gap-1">
        {done && (
          <button
            onClick={() => onReopen(task.id)}
            aria-label="Rouvrir"
            className="grid h-9 w-9 place-items-center rounded-xl2 border-2 border-ink bg-white hover:bg-sky/20"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        )}
        <button
          onClick={() => onDelete(task.id)}
          aria-label="Supprimer"
          className="grid h-9 w-9 place-items-center rounded-xl2 border-2 border-ink bg-white hover:bg-coral/20"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}
