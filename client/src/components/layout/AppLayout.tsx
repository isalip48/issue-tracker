import { Outlet, useLocation } from "react-router-dom";
import { useUIStore } from "../../store/uiStore";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/issues": "All Issues",
  "/issues/new": "Create Issue",
  "/settings": "Settings",
};

export const AppLayout = () => {
  const { isSidebarOpen } = useUIStore();
  const location = useLocation();

   const title =
    pageTitles[location.pathname] ||
    (location.pathname.includes("/issues/") ? "Issue Detail" : "Issue Tracker");

    return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <div
        className="flex flex-col min-h-screen"
        style={{
          marginLeft: isSidebarOpen ? "240px" : "64px",
          transition: "margin-left 0.25s ease",
        }}
      >
        <Navbar title={title} />

        <main className="flex-1 pt-16 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
