import { Skeleton } from "../ui/skeleton";

interface SkeletonRowProps {
  count?: number;
  variant?: "issue-list" | "dashboard-recent";
}

const IssueListSkeleton = () => (
  <div className="flex items-center gap-4 px-5 py-4">
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/3" />
    </div>
    <Skeleton className="w-16 h-5 rounded-full" />
    <Skeleton className="w-20 h-5 rounded-full" />
  </div>
);

const DashboardRecentSkeleton = () => (
  <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/20">
    <Skeleton className="w-6 h-6 rounded-full shrink-0" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-3.5 w-3/4" />
      <Skeleton className="h-2.5 w-1/2" />
    </div>
    <Skeleton className="w-20 h-5 rounded-full" />
    <Skeleton className="w-16 h-5 rounded-full" />
  </div>
);

export const SkeletonRow = ({
  count = 4,
  variant = "issue-list",
}: SkeletonRowProps) => {
  const Row =
    variant === "dashboard-recent"
      ? DashboardRecentSkeleton
      : IssueListSkeleton;

  return (
    <div
      className={
        variant === "issue-list"
          ? "divide-y divide-border"
          : "p-4 space-y-3 animate-pulse"
      }
    >
      {Array.from({ length: count }).map((_, i) => (
        <Row key={i} />
      ))}
    </div>
  );
};
