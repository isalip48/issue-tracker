// client/src/components/shared/SubmitButton.tsx
interface SubmitButtonProps {
  isPending:    boolean;
  label:        string;
  pendingLabel: string;
  disabled?:    boolean;
}

export const SubmitButton = ({
  isPending,
  label,
  pendingLabel,
  disabled = false,
}: SubmitButtonProps) => (
  <button
    type="submit"
    disabled={isPending || disabled}
    className="
      flex items-center gap-2 px-6 py-2.5 rounded-lg
      text-sm font-medium text-white
      bg-brand-500 hover:bg-brand-600
      transition-colors shadow-lg shadow-brand-500/20
      disabled:opacity-50 disabled:cursor-not-allowed
      active:scale-[0.99]
    "
  >
    {isPending ? (
      <>
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        {pendingLabel}
      </>
    ) : label}
  </button>
);