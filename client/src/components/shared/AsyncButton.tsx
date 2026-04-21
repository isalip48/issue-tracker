import { type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

interface AsyncButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  label?: string;
  loadingText?: string;
  variant?: "primary" | "ghost" | "destructive" | "brand";
}

const variantClasses = {
  primary:
    "bg-secondary/40 text-foreground border border-border/50 shadow-sm hover:bg-secondary/80 hover:border-border",
  ghost:
    "bg-transparent text-foreground border border-border/30 hover:bg-secondary/40 hover:border-border/60",
  destructive: "bg-red-500 hover:bg-red-600 text-white border-transparent",
  brand: "bg-brand-500 hover:bg-brand-600 text-white border-transparent shadow-lg shadow-brand-500/20",
};

export const AsyncButton = ({
  isLoading = false,
  label,
  loadingText,
  variant = "primary",
  children,
  className,
  disabled,
  ...props
}: AsyncButtonProps) => (
  <button
    {...props}
    disabled={disabled || isLoading}
    className={cn(
      "group relative h-[42px] px-6 rounded-lg",
      "transition-all duration-200 active:scale-[0.98]",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      "flex items-center justify-center gap-2 overflow-hidden",
      "text-[13px] font-semibold",
      variantClasses[variant],
      className,
    )}
  >
    {isLoading ? (
      <>
        <LoadingSpinner size="sm" />
        {(loadingText || label) && <span>{loadingText || label}</span>}
      </>
    ) : (
      <span className="relative z-10 flex items-center gap-2">
        {children || label}
      </span>
    )}
  </button>
);
