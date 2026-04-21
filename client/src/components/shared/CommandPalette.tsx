import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdDashboard,
  MdBugReport,
  MdAdd,
  MdSettings,
  MdSearch,
  MdKeyboardReturn,
} from "react-icons/md";
import { cn } from "@/lib/utils";

interface Command {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  action: () => void;
  keywords: string[];
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette = ({ isOpen, onClose }: CommandPaletteProps) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const COMMANDS: Command[] = [
    {
      id: "dashboard",
      label: "Go to Dashboard",
      description: "View analytics and stats",
      icon: MdDashboard,
      action: () => {
        navigate("/dashboard");
        onClose();
      },
      keywords: ["dashboard", "home", "stats", "analytics"],
    },
    {
      id: "issues",
      label: "View All Issues",
      description: "Browse and filter issues",
      icon: MdBugReport,
      action: () => {
        navigate("/issues");
        onClose();
      },
      keywords: ["issues", "list", "bugs", "tasks"],
    },
    {
      id: "new-issue",
      label: "Create New Issue",
      description: "Report a new bug or task",
      icon: MdAdd,
      action: () => {
        navigate("/issues/new");
        onClose();
      },
      keywords: ["create", "new", "add", "issue", "bug"],
    },
    {
      id: "settings",
      label: "Settings",
      description: "Manage your preferences",
      icon: MdSettings,
      action: () => {
        navigate("/settings");
        onClose();
      },
      keywords: ["settings", "preferences", "account", "profile"],
    },
  ];

  const filteredCommands = query.trim()
    ? COMMANDS.filter((cmd) => {
        const q = query.toLowerCase();
        return (
          cmd.label.toLowerCase().includes(q) ||
          cmd.description.toLowerCase().includes(q) ||
          cmd.keywords.some((k) => k.includes(q))
        );
      })
    : COMMANDS;

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, filteredCommands.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div
        className="
          relative z-10 w-full max-w-lg rounded-2xl
          bg-card border border-border shadow-2xl
          animate-fade-up overflow-hidden
        "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <MdSearch size={18} className="text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search..."
            className="
              flex-1 bg-transparent text-sm text-foreground
              placeholder:text-muted-foreground outline-none
            "
          />
          <kbd className="px-1.5 py-1 rounded bg-secondary border border-border text-[10px] font-mono text-muted-foreground">
            ESC
          </kbd>
        </div>

        <div className="py-2 max-h-[300px] overflow-y-auto">
          {filteredCommands.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              No commands found for "{query}"
            </div>
          ) : (
            filteredCommands.map((cmd, index) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.id}
                  onClick={cmd.action}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
                    selectedIndex === index
                      ? "bg-brand-500/10 text-foreground"
                      : "text-foreground hover:bg-secondary",
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                      selectedIndex === index
                        ? "bg-brand-500/20"
                        : "bg-secondary",
                    )}
                  >
                    <Icon
                      size={16}
                      className={
                        selectedIndex === index
                          ? "text-brand-500"
                          : "text-muted-foreground"
                      }
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{cmd.label}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {cmd.description}
                    </p>
                  </div>
                  {selectedIndex === index && (
                    <kbd className="px-1.5 py-0.5 rounded bg-secondary border border-border text-muted-foreground shrink-0 flex items-center">
                      <MdKeyboardReturn size={13} />
                    </kbd>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
