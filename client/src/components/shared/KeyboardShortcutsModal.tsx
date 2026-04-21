import { useEffect } from "react";
import { MdKeyboard, MdClose } from "react-icons/md";
import { SHORTCUT_DEFINITIONS } from "@/hooks/useKeyboardShortcuts";

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal = ({
  isOpen,
  onClose,
}: KeyboardShortcutsModalProps) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="
          relative z-10 w-full max-w-sm rounded-2xl
          bg-card border border-border shadow-2xl
          animate-fade-up overflow-hidden
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-brand-500/10 flex items-center justify-center">
              <MdKeyboard className="text-brand-500" size={15} />
            </div>
            <h3 className="text-sm font-semibold text-foreground">
              Keyboard Shortcuts
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <MdClose size={16} />
          </button>
        </div>

        {/* Shortcuts list */}
        <div className="p-5 space-y-2">
          {SHORTCUT_DEFINITIONS.map((shortcut) => (
            <div
              key={shortcut.description}
              className="flex items-center justify-between py-1.5"
            >
              <span className="text-sm text-muted-foreground">
                {shortcut.description}
              </span>
              <div className="flex items-center gap-1">
                {shortcut.keys.map((key) => (
                  <kbd
                    key={key}
                    className="
                      px-2 py-1 rounded-md text-[11px] font-mono font-medium
                      bg-secondary border border-border
                      text-foreground shadow-sm
                    "
                  >
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
