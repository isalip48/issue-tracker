import { MdCheck } from "react-icons/md";
import { cn } from "@/lib/utils";

const STATUS_STEPS = ["Open", "In Progress", "Resolved", "Closed"];

export const StatusWorkflow = ({
  currentStatus,
}: {
  currentStatus: string;
}) => {
  const currentIndex = STATUS_STEPS.includes(currentStatus)
    ? STATUS_STEPS.indexOf(currentStatus)
    : 0;

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between w-full relative">
        <div className="absolute left-[12.5%] right-[12.5%] top-4 -translate-y-1/2 h-1 bg-border/50 z-0 rounded-full" />

        {currentIndex > 0 && (
          <div
            className="absolute left-[12.5%] top-4 -translate-y-1/2 h-1 bg-brand-500 z-0 rounded-full transition-all duration-500 ease-in-out"
            style={{
              width: `${(currentIndex / (STATUS_STEPS.length - 1)) * 75}%`,
            }}
          />
        )}

        {STATUS_STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;

          return (
            <div
              key={step}
              className="relative z-10 flex flex-col items-center gap-3 w-1/4"
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ring-4 ring-card",
                  isCompleted
                    ? "bg-brand-500 border-brand-500 text-white"
                    : isActive
                      ? "bg-card border-brand-500 shadow-[0_0_15px_rgba(99,102,241,0.3)] text-brand-500"
                      : "bg-card border-border text-transparent",
                )}
              >
                {isCompleted ? (
                  <MdCheck size={18} />
                ) : isActive ? (
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-pulse" />
                ) : (
                  <div className="w-2.5 h-2.5 rounded-full bg-border/50" />
                )}
              </div>

              <span
                className={cn(
                  "text-xs font-bold uppercase tracking-wider text-center",
                  isCompleted || isActive
                    ? "text-foreground"
                    : "text-muted-foreground/40",
                )}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
