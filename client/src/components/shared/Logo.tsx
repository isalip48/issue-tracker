import { cn } from "../../utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const Logo = ({ className, size = "md" }: LogoProps) => {
  const isSm = size === "sm";

  return (
    <div className={cn("flex items-center group select-none", className)}>
      <div className="flex flex-col">
        <span
          className={cn(
            "font-extrabold text-foreground tracking-[-0.02em] leading-[1.1] flex items-center",
            isSm ? "text-[16px]" : "text-[24px]",
          )}
        >
          <span className="opacity-90">Issue</span>
          <span>F</span>

          <span className="relative inline-flex items-center justify-center translate-y-[0.05em] mx-[0.02em] transition-transform duration-700 group-hover:rotate-180 text-primary">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-[0.9em] h-[0.9em]"
            >
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeDasharray="4 4.5"
                strokeLinecap="round"
              />
              <circle
                cx="12"
                cy="12"
                r="4"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M12 12l6-6 m0 0h-3.5 m3.5 0v3.5"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="absolute inset-0 bg-primary/30 blur-[8px] rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </span>

          <span>rge</span>
        </span>

        {!isSm && (
          <span className="text-[8.5px] font-bold text-muted-foreground/60 tracking-[0.25em] uppercase mt-1 leading-none pl-1">
            Industrial Grade
          </span>
        )}
      </div>
    </div>
  );
};
