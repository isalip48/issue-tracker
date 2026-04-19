import type { IssueStatus } from "../../types";
import { cn } from "../../lib/utils";

interface StatusBadgeProps {
  status: IssueStatus | string;
  className?: string;
}

const statusConfig: Record<
  string,
  { label: string; className: string; }
> = {
  Open: {
    label: "Open",
    className: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  },
  "In Progress": {
    label: "In Progress",
    className: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  },
  Resolved: {
    label: "Resolved",
    className: "bg-green-500/10 text-green-500 border-green-500/20",
  },
  Closed: {
    label: "Closed",
    className: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  },
};

export const StatusBadge = ({
  status,
  className,
}: StatusBadgeProps) => {
  const config = statusConfig[status] || statusConfig["Open"];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5",
        "text-xs font-medium rounded-full border",
        "font-mono",
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  );
};
