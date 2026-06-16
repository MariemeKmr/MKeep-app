"use client";

import { motion, AnimatePresence } from "framer-motion";
import { PartyPopper } from "lucide-react";

export default function LevelUpModal({
  open,
  level,
  onClose,
}: {
  open: boolean;
  level: number;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="card max-w-sm p-8 text-center"
            initial={{ scale: 0.5, rotate: -8 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 14 }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
              className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-xl3 border-[3px] border-ink bg-sun shadow-pop"
            >
              <PartyPopper className="h-10 w-10 text-ink" />
            </motion.div>
            <h2 className="font-display text-3xl font-700">Niveau {level} !</h2>
            <p className="mt-2 text-muted">Tu progresses à fond. Continue comme ça !</p>
            <button className="btn-primary mt-6 w-full" onClick={onClose}>
              Génial
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
