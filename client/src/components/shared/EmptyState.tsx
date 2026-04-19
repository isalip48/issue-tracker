import { type ReactNode, type ElementType } from "react";
import { MdBugReport } from "react-icons/md";

interface EmptyStateProps {
  icon?: ElementType;
  title: string;
  description?: string;
  action?: ReactNode;
  variant?: "default" | "simple";
}

export const EmptyState = ({
  icon: Icon = MdBugReport,
  title,
  description,
  action,
  variant = "simple",
}: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    {variant === "default" ? (
      <div className="relative mb-4">
        <div className="absolute inset-0 bg-primary/10 blur-xl rounded-full" />
        <div className="relative p-4 rounded-2xl bg-secondary/40 border border-border/50">
          <Icon size={28} className="text-primary/40" />
        </div>
      </div>
    ) : (
      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <Icon size={26} className="text-primary" />
      </div>
    )}

    <p className="text-sm font-semibold text-foreground tracking-tight">
      {title}
    </p>
    {description && (
      <p className="text-xs text-muted-foreground mt-1 max-w-xs leading-relaxed">
        {description}
      </p>
    )}
    {action && <div className="mt-4">{action}</div>}
  </div>
);
