import { MdDarkMode, MdLightMode, MdKeyboard } from "react-icons/md";
import { useUIStore } from "@/store/uiStore";
import { useAuthStore } from "@/store/authStore";

interface NavbarProps {
  onOpenShortcuts?: () => void;
}

export const Navbar = ({
  onOpenShortcuts,
}: NavbarProps) => {
  const { isDarkMode, toggleDarkMode, isSidebarOpen } = useUIStore();
  const { user } = useAuthStore();

  return (
    <header
      className="fixed top-0 right-0 z-30 h-20 flex items-center justify-end px-8 transition-all duration-300"
      style={{ left: isSidebarOpen ? "256px" : "72px" }}
    >
      <div className="flex items-center gap-1">
        {onOpenShortcuts && (
          <button
            onClick={onOpenShortcuts}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            title="Keyboard shortcuts (?)"
          >
            <MdKeyboard size={18} />
          </button>
        )}
        <button
          onClick={toggleDarkMode}
          className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors group"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? (
            <MdLightMode
              size={20}
              className="group-hover:rotate-12 transition-transform"
            />
          ) : (
            <MdDarkMode
              size={20}
              className="group-hover:-rotate-12 transition-transform"
            />
          )}
        </button>

        {user && (
          <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 text-primary shadow-[0_0_15px_rgba(99,102,241,0.15)] flex items-center justify-center text-[13px] font-bold ml-2">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    </header>
  );
};
