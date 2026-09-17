import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  tone?: "amber" | "blue" | "turquoise" | "green" | "navy";
  suffix?: string;
}

export default function StatCard({
  icon: Icon,
  label,
  value,
  tone = "navy",
  suffix,
}: StatCardProps) {
  return (
    <div className={"stat-card stat-tone-" + tone}>
      <div className="stat-icon">
        <Icon size={20} strokeWidth={2.1} />
      </div>
      <div className="stat-value">
        {value}
        {suffix && <span className="stat-suffix">{suffix}</span>}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
