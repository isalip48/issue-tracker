import { useNavigate } from "react-router-dom";
import { MdBugReport, MdChevronRight } from "react-icons/md";
import type { Issue } from "../../types";
import { StatusBadge } from "../shared/StatusBadge";
import { PriorityBadge } from "../shared/PriorityBadge";
import { EmptyState } from "../shared/EmptyState";
import { SkeletonRow } from "../shared/SkeletonRow";
import { formatRelativeTime } from "../../utils";

const PRIORITY_ACCENT: Record<string, string> = {
  Low: "bg-slate-500",
  Medium: "bg-sky-500",
  High: "bg-primary",
  Critical: "bg-rose-500",
};

interface IssueRowProps {
  issue: Issue;
  idx: number;
}

const IssueRow = ({ issue, idx }: IssueRowProps) => {
  const navigate = useNavigate();
  const priorityAccent = PRIORITY_ACCENT[issue.priority] ?? "bg-muted";

  return (
    <div
      onClick={() => navigate(`/issues/${issue._id}`)}
      className="group flex items-center gap-4 px-4 py-3.5 rounded-xl cursor-pointer hover:bg-secondary/50 transition-all duration-200 border border-transparent hover:border-border/30"
    >
      <span className="text-[11px] font-bold text-muted-foreground/40 tabular-nums w-4 shrink-0 select-none">
        {String(idx + 1).padStart(2, "0")}
      </span>

      <div
        className={`w-1 h-8 rounded-full shrink-0 ${priorityAccent} opacity-70`}
      />

      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-foreground truncate group-hover:text-primary transition-colors tracking-tight">
          {issue.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[11px] text-muted-foreground/60">
            {formatRelativeTime(issue.createdAt)}
          </span>
          {issue.reporter && (
            <>
              <span className="text-[11px] text-muted-foreground/30">·</span>
              <span className="text-[11px] text-muted-foreground/60 truncate">
                {issue.reporter.name}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-2 shrink-0">
        <PriorityBadge priority={issue.priority} />
        <StatusBadge status={issue.status} />
      </div>

      <MdChevronRight
        size={16}
        className="text-border group-hover:text-primary shrink-0 transition-all duration-200 group-hover:translate-x-0.5"
      />
    </div>
  );
};

interface RecentIssuesListProps {
  issues: Issue[];
  isLoading: boolean;
}

export const RecentIssuesList = ({
  issues,
  isLoading,
}: RecentIssuesListProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 rounded-2xl border border-border/40 bg-secondary/20 backdrop-blur-md overflow-hidden relative flex flex-col">
      <div className="absolute inset-x-0 -top-px h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="flex items-center justify-between px-6 py-4 border-b border-border/20">
        <div className="flex items-center gap-3">
          <h3 className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground font-semibold">
            Recent Issues
          </h3>
          {issues.length > 0 && (
            <span className="inline-flex items-center rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-[12px] font-bold text-primary">
              {issues.length}
            </span>
          )}
        </div>
        <button
          onClick={() => navigate("/issues")}
          className="group flex items-center gap-1 text-[11px] uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors font-bold"
        >
          View all
          <MdChevronRight
            size={16}
            className="text-primary/50 group-hover:text-primary transition-colors group-hover:translate-x-0.5 duration-200"
          />
        </button>
      </div>

      {isLoading ? (
        <SkeletonRow count={4} variant="dashboard-recent" />
      ) : issues.length === 0 ? (
        <EmptyState
          icon={MdBugReport}
          title="Zero inbox"
          description="No issues currently mapped in the queue."
          variant="default"
        />
      ) : (
        <div className="p-3">
          {issues.map((issue, idx) => (
            <div
              key={issue._id}
              className="border-b border-border/20 last:border-b-0"
            >
              <IssueRow issue={issue} idx={idx} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
