import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useUIStore } from "@/store/uiStore";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { CommandPalette } from "@/components/shared/CommandPalette";
import { KeyboardShortcutsModal } from "@/components/shared/KeyboardShortcutsModal";
import { useAppShortcuts } from "@/hooks/useKeyboardShortcuts";


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



  return (
    <div className="h-screen bg-background relative overflow-hidden">
      <Sidebar />

      <div
        className="relative z-10 flex flex-col h-screen transition-all duration-300 ease-out"
        style={{ marginLeft: isSidebarOpen ? "256px" : "72px" }}
      >
        <Navbar />
        <main className="flex-1 pt-20 p-8 overflow-hidden">
          <Outlet />
        </main>

        {location.pathname !== "/settings" && (
          <div className="px-8 -mt-6">
            <p className="text-[8px] text-muted-foreground flex items-center gap-1.5">
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
        )}
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
