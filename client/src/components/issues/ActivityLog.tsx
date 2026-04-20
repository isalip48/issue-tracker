
import { useIssueActivity } from "@/hooks/useIssues";
import { formatRelativeTime } from "@/utils";
import {
  MdEdit,
  MdAdd,
  MdSwapHoriz,
  MdClose,
  MdCheckCircle,
} from "react-icons/md";

interface ActivityLogProps {
  issueId: string;
}

const getActionIcon = (action: string) => {
  if (action.includes("Created"))
    return { icon: MdAdd, color: "text-brand-500", bg: "bg-brand-500/10" };
  if (action.includes("status"))
    return {
      icon: MdSwapHoriz,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    };
  if (action.includes("Closed"))
    return { icon: MdClose, color: "text-slate-400", bg: "bg-slate-500/10" };
  if (action.includes("Resolved"))
    return {
      icon: MdCheckCircle,
      color: "text-green-500",
      bg: "bg-green-500/10",
    };
  return { icon: MdEdit, color: "text-blue-400", bg: "bg-blue-500/10" };
};

interface Activity {
  _id: string;
  action: string;
  user: string | { name: string };
  timestamp: string;
  changes?: Record<string, { from: unknown; to: unknown }>;
}

export const ActivityLog = ({ issueId }: ActivityLogProps) => {
  const { data, isLoading } = useIssueActivity(issueId);
  const activities = data?.data?.activity ?? [];

  if (isLoading) {
    return (
      <div className="space-y-3 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-3 items-start">
            <div className="w-7 h-7 rounded-full bg-muted shrink-0" />
            <div className="flex-1 space-y-1.5 pt-1">
              <div className="h-3 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-6">
        No activity yet
      </p>
    );
  }

  return (
    <div className="space-y-1">
      {activities.map((activity: Activity, index: number) => {
        const { icon: Icon, color, bg } = getActionIcon(activity.action);
        const isLast = index === activities.length - 1;

        return (
          <div key={activity._id} className="flex gap-3 items-start relative">
            {!isLast && (
              <div className="absolute left-[13px] top-7 bottom-0 w-px bg-border" />
            )}

            <div
              className={`
              w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10
              ${bg}
            `}
            >
              <Icon className={color} size={13} />
            </div>

            {/* Content */}
            <div className="flex-1 pb-4 min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-sm text-foreground">
                  <span className="font-medium">
                    {typeof activity.user === "object"
                      ? activity.user.name
                      : "Someone"}
                  </span>
                  <span className="text-muted-foreground">
                    {" "}
                    {activity.action
                      .toLowerCase()
                      .replace("updated ", "updated ")}
                  </span>
                </p>
                <span className="text-xs text-muted-foreground shrink-0">
                  {formatRelativeTime(activity.timestamp)}
                </span>
              </div>

              {activity.changes && Object.keys(activity.changes).length > 0 && (
                <div className="mt-1.5 space-y-1">
                  {Object.entries(activity.changes).map(([field, change]) => (
                    <div
                      key={field}
                      className="flex items-center gap-2 text-xs text-muted-foreground"
                    >
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-secondary border border-border capitalize">
                        {field}
                      </span>
                      <span className="line-through opacity-60">
                        {String((change as { from: unknown }).from)}
                      </span>
                      <span className="text-foreground/60">→</span>
                      <span className="text-foreground">
                        {String((change as { to: unknown }).to)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
