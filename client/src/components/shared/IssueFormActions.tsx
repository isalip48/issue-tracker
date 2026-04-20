import { SubmitButton } from "@/components/shared/SubmitButton";

interface IssueFormActionsProps {
  isPending: boolean;
  disabled?: boolean;
  label: string;
  pendingLabel: string;
  discardLabel?: string;
  onDiscard: () => void;
  secondaryLabel?: string;
  onSecondary: () => void;
}

export const IssueFormActions = ({
  isPending,
  disabled,
  label,
  pendingLabel,
  discardLabel = "Discard",
  onDiscard,
  secondaryLabel = "Cancel",
  onSecondary,
}: IssueFormActionsProps) => (
  <div className="flex items-center justify-between pt-5 border-t border-border/60 pb-4">
    <button
      type="button"
      onClick={onDiscard}
      className="text-sm font-medium text-muted-foreground hover:text-red-400 transition-colors"
    >
      {discardLabel}
    </button>

    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onSecondary}
        className="px-5 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
      >
        {secondaryLabel}
      </button>
      <SubmitButton
        isPending={isPending}
        disabled={disabled}
        label={label}
        pendingLabel={pendingLabel}
      />
    </div>
  </div>
);
