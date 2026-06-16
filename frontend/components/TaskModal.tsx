"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus } from "lucide-react";
import type { TaskPriority } from "@/lib/types";

const PRIORITIES: { key: TaskPriority; label: string; color: string }[] = [
  { key: "low", label: "Cool", color: "#4CC9F0" },
  { key: "medium", label: "Normal", color: "#FFC93C" },
  { key: "high", label: "Urgent", color: "#FF6B6B" },
];

export default function TaskModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (data: { title: string; description?: string; priority: TaskPriority; category?: string }) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");

  const submit = () => {
    if (!title.trim()) return;
    onCreate({
      title: title.trim(),
      description: description.trim() || undefined,
      category: category.trim() || undefined,
      priority,
    });
    setTitle("");
    setDescription("");
    setCategory("");
    setPriority("medium");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="card w-full max-w-md p-6"
            initial={{ scale: 0.85, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-700">Nouvelle quête</h2>
              <button onClick={onClose} aria-label="Fermer" className="grid h-9 w-9 place-items-center rounded-xl2 border-2 border-ink hover:bg-bg">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <input className="input" placeholder="Que dois-tu accomplir ?" value={title} autoFocus onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} />
              <textarea className="input min-h-[80px] resize-none" placeholder="Détails (optionnel)" value={description} onChange={(e) => setDescription(e.target.value)} />
              <input className="input" placeholder="Catégorie (ex : Études, Perso…)" value={category} onChange={(e) => setCategory(e.target.value)} />

              <div>
                <p className="mb-2 font-display text-sm font-600">Priorité</p>
                <div className="flex gap-2">
                  {PRIORITIES.map((p) => (
                    <button
                      key={p.key}
                      onClick={() => setPriority(p.key)}
                      className={`flex-1 rounded-xl2 border-[3px] border-ink py-2 font-display font-600 transition-all ${
                        priority === p.key ? "text-white shadow-pop-sm" : "bg-white text-ink"
                      }`}
                      style={priority === p.key ? { backgroundColor: p.color } : {}}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <button className="btn-primary w-full" onClick={submit}>
                <Plus className="h-5 w-5" /> Ajouter la quête
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
