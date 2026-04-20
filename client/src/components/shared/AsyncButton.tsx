import { type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

interface AsyncButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  variant?: "primary" | "ghost" | "destructive";
}

const variantClasses = {
  primary:
    "bg-secondary/40 text-foreground border border-border/50 shadow-sm hover:bg-secondary/80 hover:border-border",
  ghost:
    "bg-transparent text-foreground border border-border/30 hover:bg-secondary/40 hover:border-border/60",
  destructive: "bg-red-500 hover:bg-red-600 text-white border-transparent",
};

export const AsyncButton = ({
  isLoading = false,
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
      "group relative w-full h-[42px] rounded-lg",
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
        {loadingText && <span>{loadingText}</span>}
      </>
    ) : (
      <span className="relative z-10 transition-transform group-hover:-translate-x-0.5 duration-300">
        {children}
      </span>
    )}
  </button>
);
