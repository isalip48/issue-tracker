import type { ReactNode } from "react";
import { cn } from "@/utils";

export interface VisualMockupProps {
  auraColorRgba: string;
  badge: {
    label: string;
    textClass: string;
    bgBorderClass: string;
    dotClass: string;
    dotGlowRgba: string;
  };
  id: string;
  title: string;
  description: string;
  tags: string[];
  statusPill: {
    label: string;
    textClass: string;
    borderClass: string;
    boxShadowRgba: string;
    dotClass: string;
    dotGlowRgba: string;
  };
  userPill: {
    avatarNode: ReactNode;
    name: string;
  };
}

export const VisualMockup = ({
  auraColorRgba,
  badge,
  id,
  title,
  description,
  tags,
  statusPill,
  userPill,
}: VisualMockupProps) => (
  <div
    className="relative w-full h-[220px] select-none pointer-events-none flex items-center justify-center group"
    aria-hidden
  >
    <div
      className="absolute inset-0 group-hover:opacity-80 transition-opacity duration-1000"
      style={{
        backgroundImage: `radial-gradient(ellipse at center, ${auraColorRgba} 0%, transparent 70%)`,
      }}
    />

    <div className="relative w-full max-w-[280px] flex items-center justify-center">
      <div className="relative z-20 w-[95%] rounded-xl border border-border bg-card shadow-2xl p-5 transform transition-transform duration-700 group-hover:scale-105">
        <div className="flex items-center justify-between mb-4">
          <span
            className={cn(
              "text-[9px] font-bold px-2 py-1 rounded-md flex items-center gap-1.5 border",
              badge.textClass,
              badge.bgBorderClass,
            )}
          >
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full animate-pulse",
                badge.dotClass,
              )}
              style={{ boxShadow: `0 0 8px ${badge.dotGlowRgba}` }}
            />
            {badge.label}
          </span>
          <span className="text-[10px] font-medium text-muted-foreground">
            {id}
          </span>
        </div>

        <h3 className="text-[13px] font-semibold text-foreground mb-2 leading-snug tracking-tight">
          {title}
        </h3>
        <p className="text-[11px] text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
          {description}
        </p>

        <div className="flex items-center gap-2">
          {tags.map((tag, i) => (
            <div
              key={i}
              className="px-2 py-1 rounded border border-border bg-background text-[9px] text-muted-foreground font-medium"
            >
              {tag}
            </div>
          ))}
        </div>
      </div>

      <div
        className={cn(
          "absolute -top-3 right-0 z-30 flex items-center gap-2 rounded-lg border bg-card/90 backdrop-blur-md px-3 py-1.5 transform transition-transform duration-700 group-hover:translate-y-1 group-hover:-translate-x-1",
          statusPill.borderClass,
        )}
        style={{ boxShadow: `0 8px 30px ${statusPill.boxShadowRgba}` }}
      >
        <span
          className={cn("w-2 h-2 rounded-full", statusPill.dotClass)}
          style={{ boxShadow: `0 0 8px ${statusPill.dotGlowRgba}` }}
        />
        <span
          className={cn(
            "text-[9px] font-bold uppercase tracking-widest",
            statusPill.textClass,
          )}
        >
          {statusPill.label}
        </span>
      </div>

      <div className="absolute -bottom-4 left-3 z-30 flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 shadow-lg transform transition-transform duration-700 group-hover:-translate-y-1 group-hover:translate-x-1">
        {userPill.avatarNode}
        <span className="text-[10px] font-medium text-foreground">
          {userPill.name}
        </span>
      </div>
    </div>
  </div>
);
