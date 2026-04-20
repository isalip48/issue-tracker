import { useNavigate } from "react-router-dom";
import { MdEdit, MdDelete } from "react-icons/md";
import type { Issue } from "@/types";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { StatusSelect } from "@/components/shared/StatusSelect";
import { formatRelativeTime } from "@/utils";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

interface IssueCardProps {
  issue: Issue;
  onDelete: (issue: Issue) => void;
  onStatusChange: (id: string, status: string) => void;
}

export const IssueCard = ({
  issue,
  onDelete,
  onStatusChange,
}: IssueCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const assignee = issue.assignee as { _id?: string; name?: string } | undefined;
  const reporter = issue.reporter as { _id?: string; name?: string } | undefined;
  const assigneeName = assignee?.name;

  const isAdmin = user?.role?.toLowerCase() === "admin";
  const isReporter = reporter?._id === user?._id;
  const isAssignee = assignee?._id === user?._id;
  const canDelete = isAdmin || isReporter || isAssignee;

  return (
    <div
      className={cn(
        "group grid grid-cols-[minmax(0,1fr)_110px_160px_120px_72px] items-center gap-4 px-6 py-4",
        "border-b border-border/50 last:border-b-0",
        "hover:bg-secondary/40 transition-all duration-200 cursor-pointer",
      )}
      onClick={() => navigate(`/issues/${issue._id}`)}
    >
      <div className="flex flex-col min-w-0 space-y-1.5">
        <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors tracking-tight">
          {issue.title}
        </p>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground font-medium">
          <span className="font-mono">
            #{issue._id.slice(-6)}
          </span>
          <span className="opacity-30">•</span>
          <span>{formatRelativeTime(issue.createdAt)}</span>
          <span className="opacity-30">•</span>
          <span>{reporter?.name || "Anonymous"}</span>
          {issue.tags?.length > 0 && (
            <>
              <span className="opacity-30">•</span>
              <div className="flex items-center gap-1">
                {issue.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="px-1.5 py-0.5 bg-primary/10 text-primary/70 border border-primary/10 rounded text-[10px] font-bold uppercase tracking-wider"
                  >
                    {tag}
                  </span>
                ))}
                {issue.tags.length > 2 && (
                  <span className="text-muted-foreground text-[10px]">
                    +{issue.tags.length - 2}
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex justify-start">
        <PriorityBadge priority={issue.priority} />
      </div>

      <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
        <StatusSelect
          value={issue.status}
          onChange={(status) => onStatusChange(issue._id, status)}
        />
      </div>

      <div className="flex justify-start">
        {assigneeName ? (
          <span className="text-xs text-muted-foreground truncate">
            {assigneeName}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground/50 italic">Unassigned</span>
        )}
      </div>

      <div
        className="flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => navigate(`/issues/${issue._id}/edit`)}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
          title="Edit"
        >
          <MdEdit size={16} />
        </button>
        {canDelete && (
          <button
            onClick={() => onDelete(issue)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
            title="Delete"
          >
            <MdDelete size={16} />
          </button>
        )}
      </div>
    </div>
  );
};
