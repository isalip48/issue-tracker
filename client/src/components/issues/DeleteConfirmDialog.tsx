import { MdWarning } from "react-icons/md";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

export const DeleteConfirmDialog = ({
  isOpen,
  title,
  onConfirm,
  onCancel,
  isLoading,
}: DeleteConfirmDialogProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="
          relative z-10 w-full max-w-md rounded-xl
          bg-card border border-border shadow-2xl
          animate-fade-up p-6 space-y-4
        "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
            <MdWarning className="text-red-500" size={22} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Delete Issue
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              This action cannot be undone
            </p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete{" "}
          <span className="font-medium text-foreground">"{title}"</span>? All
          activity logs for this issue will also be deleted permanently.
        </p>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="
              flex-1 px-4 py-2 rounded-lg text-sm font-medium
              border border-border text-foreground
              hover:bg-secondary transition-colors
              disabled:opacity-50
            "
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="
              flex-1 flex items-center justify-center gap-2
              px-4 py-2 rounded-lg text-sm font-medium
              bg-red-500 hover:bg-red-600 text-white
              transition-colors disabled:opacity-50
            "
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="xs" />
                Deleting...
              </>
            ) : (
              "Delete Issue"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
