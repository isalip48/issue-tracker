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
        "bg-card border-r border-border flex flex-col",
        isSidebarOpen ? "w-60" : "w-16",
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-border h-16">
        {isSidebarOpen && (
          <div className="flex items-center gap-2 animate-fadee-up">
            <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center">
              <MdBugReport className="text-white size={16}" />
            </div>
            <span className="font-semibold text-sm tracking-tight">
              Issue Tracker
            </span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className={cn(
            "p-1.5 runded-md text-muted-foreground hover:text-foreground",
            "hover:bg-secondary transition-colors",
            !isSidebarOpen && "mx-auto",
          )}
        >
          <IoChevronBack
            size={18}
            className={cn(
              "transition-transform duration-300",
              !isSidebarOpen && "rotate-180",
            )}
          />
        </button>
      </div>
      <div className="p-3">
        <button
          onClick={() => navigate("/issues/new")}
          className={cn(
            "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg",
            "bg-brand-500 hover:bg-brand-600 text--white",
            "transition-colors text-sm font-medium",
            !isSidebarOpen && "justify-center px-0",
          )}
        >
          <MdAdd size={18} />
          {isSidebarOpen && <span>New Issue</span>}
        </button>
      </div>
      <nav className="flex-1 px-3 py-2 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm",
                "transition-colors group",
                isActive
                  ? "bg-brand-500/10 text-brand-500 font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary",
                !isSidebarOpen && "justify-center px-0",
              )
            }
          >
            <Icon size={20} className="shrink-0" />
            {isSidebarOpen && <span className="animate-fade-up">{label}</span>}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-border space-y-1">
        <NavLink
          to="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm",
            "text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors",
            !isSidebarOpen && "justify-center px-0",
          )}
        >
          <MdSettings size={20} className="shrink-0" />
          {isSidebarOpen && <span className="animate-fade-up">Settings</span>}
        </NavLink>

        <button
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm",
            "text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors",
            !isSidebarOpen && "justify-center px-0",
          )}
        >
          <MdLogout size={20} />
          {isSidebarOpen && <span>Logout</span>}
        </button>

        {isSidebarOpen && user && (
          <div className="flex items-center gap-2.5 px-3 py-2 mt-2">
            <div className="w-7 h-7 rounded-full bg-brand-500/20 text-brand-500 flex items-center justify-center text-xs font-semibold shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
