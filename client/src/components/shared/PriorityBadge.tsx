import type { IssuePriority } from "@/types";
import { cn } from "@/lib/utils";

interface PriorityBadgeProps {
  priority: IssuePriority | string;
  showIcon?: boolean;
  className?: string;
}

const priorityConfig: Record<string, { label: string; className: string }> = {
  Low: {
    label: "Low",
    className: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  },
  Medium: {
    label: "Medium",
    className: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  High: {
    label: "High",
    className: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  },
  Critical: {
    label: "Critical",
    className: "bg-red-500/10 text-red-500 border-red-500/20",
  },
};

export const PriorityBadge = ({ priority, className }: PriorityBadgeProps) => {
  const config = priorityConfig[priority] || priorityConfig["Medium"];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5",
        "text-xs font-medium rounded-full border font-mono",
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  );
};
