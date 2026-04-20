import { MdCheckCircle, MdCancel, MdRefresh } from "react-icons/md";
import { cn } from "@/lib/utils";

export type TargetStatus = "Resolved" | "Closed" | "Open";

interface StatusChangeDialogProps {
  isOpen: boolean;
  targetStatus: TargetStatus;
  issueTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

const STATUS_CONFIG: Record<
  TargetStatus,
  {
    icon: React.ElementType;
    iconBg: string;
    iconColor: string;
    btnBg: string;
    heading: string;
    description: string;
  }
> = {
  Resolved: {
    icon: MdCheckCircle,
    iconBg: "bg-green-500/10",
    iconColor: "text-green-500",
    btnBg: "bg-green-500 hover:bg-green-600",
    heading: "Mark as Resolved",
    description:
      "Marking this issue as resolved means the fix has been implemented and verified. You can reopen it later if needed.",
  },
  Closed: {
    icon: MdCancel,
    iconBg: "bg-slate-500/10",
    iconColor: "text-slate-400",
    btnBg: "bg-slate-600 hover:bg-slate-700",
    heading: "Close Issue",
    description:
      "Closing this issue means it will no longer be actively tracked. Typically used for duplicates, won't-fix decisions, or stale issues.",
  },
  Open: {
    icon: MdRefresh,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
    btnBg: "bg-blue-500 hover:bg-blue-600",
    heading: "Reopen Issue",
    description:
      "Reopening this issue will set its status back to Open and make it active again. Remember to reassign it if the original assignee is no longer available.",
  },
};

export const StatusChangeDialog = ({
  isOpen,
  targetStatus,
  issueTitle,
  onConfirm,
  onCancel,
  isLoading,
}: StatusChangeDialogProps) => {
  if (!isOpen) return null;

  const config = STATUS_CONFIG[targetStatus];
  const Icon = config.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative z-10 w-full max-w-md rounded-2xl bg-card border border-border shadow-2xl animate-fade-up p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "w-11 h-11 rounded-xl flex items-center justify-center shrink-0",
              config.iconBg,
            )}
          >
            <Icon className={config.iconColor} size={24} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">
              {config.heading}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              This will update the issue status
            </p>
          </div>
        </div>

        <div className="px-3 py-2.5 rounded-lg bg-secondary/50 border border-border">
          <p className="text-xs text-muted-foreground mb-0.5">Issue</p>
          <p className="text-sm font-medium text-foreground truncate">
            {issueTitle}
          </p>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          {config.description}
        </p>

        <div className="flex gap-3 pt-1">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium border border-border text-foreground hover:bg-secondary transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              "flex-1 flex items-center justify-center gap-2",
              "px-4 py-2.5 rounded-xl text-sm font-medium text-white",
              "transition-colors disabled:opacity-50",
              config.btnBg,
            )}
          >
            {isLoading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Updating…
              </>
            ) : (
              config.heading
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
