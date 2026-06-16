"use client";

import { motion } from "framer-motion";

const COLORS = ["#7C5CFF", "#FF6B9D", "#34D399", "#FFC93C", "#4CC9F0", "#FF6B6B", "#9B5DE5"];

export default function WeeklyChart({ data }: { data: { day: string; done: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.done));
  return (
    <div className="card p-5">
      <h3 className="mb-4 font-display text-lg font-600">Cette semaine</h3>
      <div className="flex h-40 items-end justify-between gap-2">
        {data.map((d, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex h-32 w-full items-end justify-center">
              <motion.div
                className="w-full rounded-t-xl2 border-[3px] border-ink"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
                initial={{ height: 0 }}
                animate={{ height: `${(d.done / max) * 100}%` }}
                transition={{ type: "spring", stiffness: 120, damping: 16, delay: i * 0.05 }}
              >
                {d.done > 0 && (
                  <div className="-mt-6 text-center font-display text-sm font-700">{d.done}</div>
                )}
              </motion.div>
            </div>
            <span className="text-xs font-semibold text-muted">{d.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
