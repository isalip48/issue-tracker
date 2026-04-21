import { type ReactNode, type ElementType } from "react";
import { MdBugReport } from "react-icons/md";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: ElementType;
  title: string;
  description?: string;
  action?: ReactNode;
  variant?: "default" | "simple" | "not-found";
}

export const EmptyState = ({
  icon: Icon = MdBugReport,
  title,
  description,
  action,
  variant = "simple",
}: EmptyStateProps) => (
  <div className={cn(
    "flex flex-col items-center justify-center text-center animate-in fade-in duration-500",
    variant === "not-found" ? "min-h-[400px] gap-6 p-8" : "py-16"
  )}>
    {variant === "default" || variant === "not-found" ? (
      <div className="relative mb-4">
        <div className="absolute inset-0 bg-primary/10 blur-xl rounded-full opacity-50" />
        <div className={cn(
          "relative flex items-center justify-center border border-border/50 shadow-sm",
          variant === "not-found" ? "w-16 h-16 rounded-3xl bg-secondary/30" : "p-4 rounded-2xl bg-secondary/40"
        )}>
          <Icon 
            size={variant === "not-found" ? 32 : 28} 
            className={cn(variant === "not-found" ? "text-muted-foreground/50" : "text-primary/40")} 
          />
        </div>
      </div>
    ) : (
      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <Icon size={26} className="text-primary" />
      </div>
    )}

    <div className="space-y-1.5">
      <h3 className={cn(
        "font-bold tracking-tight text-foreground",
        variant === "not-found" ? "text-xl" : "text-sm"
      )}>
        {title}
      </h3>
      {description && (
        <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
          {description}
        </p>
      )}
    </div>

    {action && <div className={variant === "not-found" ? "mt-2" : "mt-4"}>{action}</div>}
  </div>
);
