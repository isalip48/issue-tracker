import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  trend?: number;
  className?: string;
}

export const StatCard = ({
  title,
  value,
  icon: Icon,
  iconColor,
  iconBg,
  trend,
  className,
}: StatCardProps) => {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border/40 bg-secondary/20 p-6 backdrop-blur-md",
        "transition-all duration-500 ease-out",
        "hover:border-primary/30 hover:bg-secondary/40 hover:shadow-[0_0_80px_rgba(99,102,241,0.12)]",
        "animate-fade-up",
        className,
      )}
    >
      <div className="absolute inset-x-0 -top-px h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-1">
          <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground font-semibold">
            {title}
          </p>
          <p className="text-4xl font-bold text-foreground tracking-tighter pt-1">
            {value}
          </p>
        </div>

        <div
          className={cn(
            "relative p-3 rounded-xl transition-transform duration-500 group-hover:scale-110",
            iconBg,
          )}
        >
          <Icon className={cn("relative z-10", iconColor)} size={24} />
          <div
            className={cn(
              "absolute inset-0 opacity-40 blur-xl rounded-full transition-opacity duration-500",
              iconBg,
            )}
          />
        </div>
      </div>

      {trend !== undefined && (
        <div className="mt-4 flex items-center gap-1.5 relative z-10">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider",
              trend >= 0
                ? "bg-green-500/10 text-green-500 border border-green-500/20"
                : "bg-red-500/10 text-red-500 border border-red-500/20",
            )}
          >
            {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </span>
          <span className="text-[11px] text-muted-foreground font-medium">
            vs last week
          </span>
        </div>
      )}
    </div>
  );
};
