import { useNavigate } from "react-router-dom";
import {
  MdBugReport,
  MdRadioButtonUnchecked,
  MdAutorenew,
  MdCheckCircle,
  MdAdd,
} from "react-icons/md";
import { useIssueStats, useIssues } from "@/hooks/useIssues";
import { useAuthStore } from "@/store/authStore";
import { StatCard } from "@/components/shared/StatCard";
import { VelocityChart } from "@/components/dashboard/VelocityChart";
import { PriorityChart } from "@/components/dashboard/PriorityChart";
import { PRIORITY_COLORS } from "@/utils";
import { RecentIssuesList } from "@/components/dashboard/RecentIssuesList";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Morning";
  if (hour < 17) return "Afternoon";
  return "Evening";
};

const DashboardSkeleton = () => (
  <div className="space-y-6 animate-pulse p-4">
    <div className="h-8 w-64 bg-secondary/50 rounded-lg" />
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-32 bg-secondary/30 rounded-2xl" />
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="h-[300px] bg-secondary/30 rounded-2xl" />
      <div className="h-[300px] bg-secondary/30 rounded-2xl" />
    </div>
  </div>
);

export const Dashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const { data: statsData, isLoading: statsLoading } = useIssueStats();
  const { data: recentData, isLoading: recentLoading } = useIssues({
    page: 1,
    limit: 5,
  });

  const stats = statsData?.data;
  const issues = recentData?.data?.issues ?? [];

  const priorityChartData = stats
    ? Object.entries(stats.byPriority).map(([name, value]) => ({
        name,
        value,
        fill: PRIORITY_COLORS[name as keyof typeof PRIORITY_COLORS],
      }))
    : [];

  const trendChartData =
    stats?.trend.map((d) => ({
      date: new Date(d._id).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      issues: d.count,
    })) ?? [];

  if (statsLoading) return <DashboardSkeleton />;

  return (
    <div className="flex flex-col gap-8 h-[calc(100vh-7rem)] animate-in slide-in-from-bottom-4 fade-in duration-700 ease-out">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tighter text-foreground">
            Good {getGreeting()},{" "}
            <span className="text-primary">{user?.name?.split(" ")[0]}</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Tracking resolving velocity and high-priority bottlenecks.
          </p>
        </div>

        <button
          onClick={() => navigate("/issues/new")}
          className="
            group flex items-center gap-2 px-5 py-2.5 rounded-xl
            bg-secondary/40 text-foreground border border-border/30 backdrop-blur-md
            hover:bg-primary/10 hover:border-primary/40 hover:text-primary
            transition-all duration-300 shadow-sm hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]
          "
        >
          <MdAdd
            size={20}
            className="text-muted-foreground group-hover:text-primary transition-colors"
          />
          <span className="text-sm font-semibold tracking-wide">New Issue</span>
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Issues"
          value={stats?.total ?? 0}
          icon={MdBugReport}
          iconColor="text-primary"
          iconBg="bg-primary/10"
        />
        <StatCard
          title="Open"
          value={stats?.byStatus.Open ?? 0}
          icon={MdRadioButtonUnchecked}
          iconColor="text-blue-500"
          iconBg="bg-blue-500/10"
        />
        <StatCard
          title="In Progress"
          value={stats?.byStatus["In Progress"] ?? 0}
          icon={MdAutorenew}
          iconColor="text-amber-500"
          iconBg="bg-amber-500/10"
        />
        <StatCard
          title="Resolved"
          value={stats?.byStatus.Resolved ?? stats?.byStatus.Closed ?? 0}
          icon={MdCheckCircle}
          iconColor="text-green-500"
          iconBg="bg-green-500/10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <VelocityChart data={trendChartData} />
        <PriorityChart data={priorityChartData} />
      </div>

      <RecentIssuesList issues={issues} isLoading={recentLoading} />
    </div>
  );
};
