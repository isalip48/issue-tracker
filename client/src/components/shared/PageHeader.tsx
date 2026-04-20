import { MdArrowBack } from "react-icons/md";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title?: string;
  subtitle?: React.ReactNode;
  onBack?: () => void;
  badge?: ReactNode;
  actions?: ReactNode;
  backLabel?: string;
}

export const PageHeader = ({
  title,
  subtitle,
  onBack,
  badge,
  actions,
  backLabel = "Back",
}: PageHeaderProps) => {
  return (
    <div className="flex items-center justify-between pb-6 border-b border-border/60 mb-8 animate-in fade-in slide-in-from-top-2 duration-500">
      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
            {badge}
          </div>

          {subtitle && (
            <p className="text-xs font-medium text-muted-foreground mt-1 flex items-center gap-2">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {actions}

        {onBack && (
          <button
            onClick={onBack}
            className="
              flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
              bg-primary text-primary-foreground shadow-lg shadow-primary/20
              hover:opacity-90 hover:scale-[0.98]
              active:scale-95
              transition-all duration-200
            "
          >
            <MdArrowBack size={18} />
            {backLabel}
          </button>
        )}
      </div>
    </div>
  );
};
