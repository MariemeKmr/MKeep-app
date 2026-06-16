import { LucideIcon } from "lucide-react";

export default function StatCard({
  icon: Icon,
  value,
  label,
  color,
}: {
  icon: LucideIcon;
  value: string | number;
  label: string;
  color: string;
}) {
  return (
    <div className="card p-4">
      <div
        className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl2 border-[3px] border-ink text-white"
        style={{ backgroundColor: color }}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="font-display text-2xl font-700">{value}</div>
      <div className="text-sm text-muted">{label}</div>
    </div>
  );
}
