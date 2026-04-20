import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "xs" | "sm" | "md";
  className?: string;
}

const sizeClasses = {
  xs: "w-3 h-3 border-[1.5px]",
  sm: "w-3.5 h-3.5 border-2",
  md: "w-4 h-4 border-2",
};

export const LoadingSpinner = ({
  size = "sm",
  className,
}: LoadingSpinnerProps) => (
  <span
    className={cn(
      "inline-block rounded-full animate-spin",
      "border-current/20 border-t-current",
      sizeClasses[size],
      className,
    )}
  />
);
