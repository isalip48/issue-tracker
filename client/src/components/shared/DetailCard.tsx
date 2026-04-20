import * as React from "react";
import { cn } from "@/lib/utils";

interface DetailCardProps {
  children: React.ReactNode;
  className?: string;

  title?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;

  variant?: "default" | "subtle";
}

export const DetailCard = ({
  children,
  className,
  title,
  icon,
  action,
  variant = "default",
}: DetailCardProps) => {
  return (
    <div
      className={cn(
        "rounded-2xl border transition-all",
        variant === "default" &&
          "bg-card border-border/60 shadow-lg shadow-foreground/[0.02]",
        variant === "subtle" &&
          "bg-secondary/20 border-border/40",

        "hover:shadow-xl hover:-translate-y-[1px]",
        className
      )}
    >
      {(title || icon || action) && (
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border/60">
          <div className="flex items-center gap-2">
            {icon && <span className="text-brand-500">{icon}</span>}
            {title && (
              <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                {title}
              </h3>
            )}
          </div>

          {action && <div>{action}</div>}
        </div>
      )}

      <div className="p-6">{children}</div>
    </div>
  );
};