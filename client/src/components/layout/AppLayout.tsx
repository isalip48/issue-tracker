import { Outlet } from "react-router-dom";
import { useUIStore } from "@/store/uiStore";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";

export const AppLayout = () => {
  const { isSidebarOpen } = useUIStore();

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
      </div>
    </div>
  );
};
