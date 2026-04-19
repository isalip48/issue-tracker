import { MdDarkMode, MdLightMode, MdNotifications } from "react-icons/md";
import { useUIStore } from "../../store/uiStore";
import { useAuthStore } from "../../store/authStore";

export const Navbar = () => {
  const { isDarkMode, toggleDarkMode, isSidebarOpen } = useUIStore();
  const { user } = useAuthStore();

  return (
    <header
      className="fixed top-0 right-0 z-30 h-20 flex items-center justify-end px-8 transition-all duration-300"
      style={{ left: isSidebarOpen ? "256px" : "72px" }}
    >
      <div className="flex items-center gap-1">
        <button
          className="p-2.5 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors relative group"
          aria-label="Notifications"
        >
          <MdNotifications
            size={20}
            className="group-hover:scale-110 transition-transform"
          />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(99,102,241,0.8)] animate-pulse" />
        </button>

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
