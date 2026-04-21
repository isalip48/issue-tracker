import { useEffect, useCallback } from "react";

interface ShortcutMap {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  skipIfTyping?: boolean;
}

export const useKeyboardShortcuts = (shortcuts: ShortcutMap[]) => {
  const handleKeyDown = useCallback(
    (e: globalThis.KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isTyping =
        target.tagName == "INPUT" ||
        target.tagName == "TEXTAREA" ||
        target.tagName == "SELECT" ||
        target.contentEditable;

      for (const shortcut of shortcuts) {
        if (shortcut.skipIfTyping && isTyping) continue;

        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = shortcut.ctrl ? e.ctrlKey || e.metaKey : true;
        const shiftMatch = shortcut.shift
          ? e.shiftKey
          : !e.shiftKey || !shortcut.shift;
        const altMatch = shortcut.alt ? e.altKey : true;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          e.preventDefault();
          shortcut.action();
          break;
        }
      }
    },

    [shortcuts],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
};

export const useAppShortcuts = (callbacks: {
  onNewIssue: () => void;
  onOpenSearch: () => void;
  onToggleSidebar: () => void;
  onOpenShortcuts: () => void;
  onGoToDashboard: () => void;
  onGoToIssues: () => void;
}) => {
  useKeyboardShortcuts([
    {
      key: "i",
      ctrl: true,
      action: callbacks.onNewIssue,
    },
    {
      key: "k",
      ctrl: true,
      action: callbacks.onOpenSearch,
    },
    {
      key: "b",
      ctrl: true,
      action: callbacks.onToggleSidebar,
    },
    {
      key: "h",
      ctrl: true,
      action: callbacks.onOpenShortcuts,
    },
    {
      key: "1",
      ctrl: true,
      action: callbacks.onGoToDashboard,
    },
    {
      key: "2",
      ctrl: true,
      action: callbacks.onGoToIssues,
    },
  ]);
};

export const SHORTCUT_DEFINITIONS = [
  { keys: ["Ctrl", "I"], description: "Create new issue" },
  { keys: ["Ctrl", "K"], description: "Open command palette" },
  { keys: ["Ctrl", "B"], description: "Toggle sidebar" },
  { keys: ["Ctrl", "1"], description: "Go to Dashboard" },
  { keys: ["Ctrl", "2"], description: "Go to Issues" },
  { keys: ["Ctrl", "H"], description: "Show keyboard shortcuts" },
  { keys: ["Esc"], description: "Close modal / dialog" },
];
