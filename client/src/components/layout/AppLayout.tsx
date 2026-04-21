import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useUIStore } from "@/store/uiStore";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { CommandPalette } from "../shared/CommandPalette";
import { KeyboardShortcutsModal } from "../shared/KeyboardShortcutsModal";
import { useAppShortcuts } from "../../hooks/useKeyboardShortcuts";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/issues": "All Issues",
  "/issues/new": "Create Issue",
  "/settings": "Settings",
};

export const AppLayout = () => {
  const { isSidebarOpen, toggleSidebar } = useUIStore();
  const location = useLocation();
  const navigate = useNavigate();

  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false);

  useAppShortcuts({
    onNewIssue: () => navigate("/issues/new"),
    onOpenSearch: () => setCommandPaletteOpen(true),
    onToggleSidebar: () => toggleSidebar(),
    onOpenShortcuts: () => setShortcutsModalOpen(true),
    onGoToDashboard: () => navigate("/dashboard"),
    onGoToIssues: () => navigate("/issues"),
  });

  const title =
    pageTitles[location.pathname] ||
    (location.pathname.includes("/issues/") ? "Issue Detail" : "IssueTrack");

  return (
    <div className="min-h-screen bg-background relative">
      <Sidebar />

      <div
        className="relative z-10 flex flex-col min-h-screen transition-all duration-300 ease-out"
        style={{ marginLeft: isSidebarOpen ? "256px" : "72px" }}
      >
        <Navbar />
        <main className="flex-1 pt-20 p-8">
          <Outlet />
        </main>

        <div className="px-6 py-2 border-t border-border">
          <p className="text-[10px] text-muted-foreground flex items-center gap-1.5">
            Press
            <kbd className="px-1.5 py-0.5 rounded bg-secondary border border-border font-mono">
              Ctrl H
            </kbd>
            for keyboard shortcuts ·
            <kbd className="px-1.5 py-0.5 rounded bg-secondary border border-border font-mono">
              Ctrl I
            </kbd>
            to create issue ·
            <kbd className="px-1.5 py-0.5 rounded bg-secondary border border-border font-mono">
              Ctrl K
            </kbd>
            to search
          </p>
        </div>
      </div>
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
      <KeyboardShortcutsModal
        isOpen={shortcutsModalOpen}
        onClose={() => setShortcutsModalOpen(false)}
      />
    </div>
  );
};
