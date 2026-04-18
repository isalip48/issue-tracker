import { MdDarkMode, MdLightMode, MdNotifications } from "react-icons/md";
import { useUIStore }  from "../../store/uiStore";
import { useAuthStore } from "../../store/authStore";

interface NavbarProps {
  title?: string;
}

export const Navbar = ({ title = "Dashboard" }: NavbarProps) => {
  const { isDarkMode, toggleDarkMode, isSidebarOpen } = useUIStore();
  const { user } = useAuthStore();

  return (
    <header
      className="fixed top-0 right-0 z-30 h-16 border-b border-border bg-background/80 backdrop-blur-sm flex items-center px-6"
      style={{
        left: isSidebarOpen ? "240px" : "64px",
        transition: "left 0.25s ease",
      }}
    >
      <h1 className="text-sm font-semibold flex-1">{title}</h1>

      <div className="flex items-center gap-2">

        <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors relative">
          <MdNotifications size={20} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse-dot" />
        </button>

        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          aria-label="Toggle dark mode"
        >
          {isDarkMode
            ? <MdLightMode size={20} />
            : <MdDarkMode  size={20} />
          }
        </button>

        {user && (
          <div className="w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center text-sm font-semibold ml-1">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    </header>
  );
};