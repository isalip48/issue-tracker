import { NavLink, useNavigate } from "react-router-dom";
import {
  MdDashboard,
  MdBugReport,
  MdAdd,
  MdSettings,
  MdLogout,
} from "react-icons/md";
import { IoChevronBack } from "react-icons/io5";
import { useUIStore } from "../../store/uiStore";
import { useAuthStore } from "../../store/authStore";
import { Logo } from "../shared/Logo";
import { cn } from "../../utils";

const navItems = [
  { to: "/dashboard", icon: MdDashboard, label: "Dashboard" },
  { to: "/issues", icon: MdBugReport, label: "Issues" },
];

export const Sidebar = () => {
  const { isSidebarOpen, toggleSidebar } = useUIStore();
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <aside
      className={cn(
        "sidebar-transition fixed left-0 top-0 h-screen z-40",
        "bg-background/20 backdrop-blur-xl border-r border-white/5 flex flex-col",
        isSidebarOpen ? "w-64" : "w-[72px]",
      )}
    >
      <div className="flex items-center justify-between p-4 h-20 mb-2">
        {isSidebarOpen ? (
          <div className="pl-2 animate-in fade-in duration-500 justify-center">
            <Logo size="md" />
          </div>
        ) : (
          <div className="w-full flex justify-center animate-in fade-in duration-500">
            <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-4 h-4 text-primary"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeDasharray="4 4.5"
                  strokeLinecap="round"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
        )}
        {isSidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all duration-300"
          >
            <IoChevronBack
              size={18}
              className="transition-transform duration-300"
            />
          </button>
        )}
      </div>

      {!isSidebarOpen && (
        <div className="flex justify-center mb-4">
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300"
          >
            <IoChevronBack
              size={18}
              className="rotate-180 transition-transform duration-300"
            />
          </button>
        </div>
      )}

      <div className="px-4 pb-4">
        <button
          onClick={() => navigate("/issues/new")}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border",
            "bg-primary/10 border-primary/20 text-primary font-semibold shadow-[0_0_15px_rgba(99,102,241,0.15)]",
            "hover:bg-primary/20 hover:border-primary/40 hover:shadow-[0_0_25px_rgba(99,102,241,0.25)] transition-all duration-300",
            !isSidebarOpen && "justify-center px-0 w-10 h-10 mx-auto",
          )}
        >
          <MdAdd size={20} className={cn(!isSidebarOpen && "absolute")} />
          {isSidebarOpen && <span className="tracking-wide">New Issue</span>}
        </button>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-2 relative">
        <div className="absolute inset-y-0 left-8 w-px bg-gradient-to-b from-border/0 via-border/20 to-border/0 -z-10" />

        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "group flex items-center gap-4 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 relative",
                isActive
                  ? "bg-secondary/60 text-foreground border border-border/50 shadow-lg"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/40 border border-transparent",
                !isSidebarOpen && "justify-center px-0 w-10 h-10 mx-auto",
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute left-3 w-5 h-5 bg-primary/20 blur-md rounded-full -z-10" />
                )}

                <Icon
                  size={20}
                  className={cn(
                    "shrink-0 transition-colors duration-300 z-10",
                    isActive ? "text-primary" : "group-hover:text-foreground",
                  )}
                />
                {isSidebarOpen && (
                  <span
                    className={cn(
                      "tracking-wide text-[13px]",
                      isActive ? "text-foreground font-semibold" : "",
                    )}
                  >
                    {label}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 space-y-2 mt-auto">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              "group flex items-center gap-4 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300",
              isActive
                ? "bg-secondary/60 text-foreground border border-border/50 shadow-lg"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/40 border border-transparent",
              !isSidebarOpen && "justify-center px-0 w-10 h-10 mx-auto",
            )
          }
        >
          <MdSettings
            size={20}
            className="shrink-0 group-hover:rotate-90 transition-transform duration-500"
          />
          {isSidebarOpen && (
            <span className="tracking-wide text-[13px]">Settings</span>
          )}
        </NavLink>

        <button
          onClick={handleLogout}
          className={cn(
            "w-full group flex items-center gap-4 px-3 py-2.5 rounded-xl text-[13px] font-medium",
            "text-muted-foreground hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 border border-transparent transition-all duration-300",
            !isSidebarOpen && "justify-center px-0 w-10 h-10 mx-auto",
          )}
        >
          <MdLogout size={20} className="shrink-0" />
          {isSidebarOpen && <span className="tracking-wide">Logout</span>}
        </button>

        {isSidebarOpen && user && (
          <div className="flex items-center gap-3 px-3 py-3 mt-4 rounded-xl bg-secondary/20 border border-border/30">
            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center text-[11px] font-bold shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-foreground truncate tracking-tight">
                {user.name}
              </p>
              <p className="text-[11px] text-muted-foreground truncate tracking-wider">
                {user.email}
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
