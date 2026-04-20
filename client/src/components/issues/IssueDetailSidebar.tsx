import {
  MdPerson,
  MdCalendarToday,
  MdCheckCircle,
  MdLocalOffer,
  MdCancel,
} from "react-icons/md";
import { StatusBadge } from "../shared/StatusBadge";
import { PriorityBadge } from "../shared/PriorityBadge";
import { formatDate, formatRelativeTime } from "../../utils";
import type { Issue } from "../../types";

const DetailRow = ({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="flex items-start justify-between gap-3">
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0 mt-0.5">
      {icon}
      {label}
    </div>
    <div className="text-right">{children}</div>
  </div>
);

const UserRow = ({
  label,
  name,
  color = "bg-brand-500/20 text-brand-500",
}: {
  label: string;
  name: string;
  color?: string;
}) => (
  <DetailRow label={label} icon={<MdPerson size={13} />}>
    <div className="flex items-center gap-1.5">
      <div
        className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-semibold ${color}`}
      >
        {name.charAt(0).toUpperCase()}
      </div>
      <span className="text-sm text-foreground">{name}</span>
    </div>
  </DetailRow>
);

// ── Severity Badge ────────────────────────────────────────────────────────────
const SEVERITY_COLORS: Record<string, string> = {
  Minor: "text-slate-400 bg-slate-500/10 border-slate-500/20",
  Major: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  Critical: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  Blocker: "text-red-400 bg-red-500/10 border-red-500/20",
};

interface IssueDetailSidebarProps {
  issue: Issue;
  canResolve: boolean;
  canClose: boolean;
  onResolve: () => void;
  onClose: () => void;
}

export const IssueDetailSidebar = ({
  issue,
  canResolve,
  canClose,
  onResolve,
  onClose,
}: IssueDetailSidebarProps) => {
  const reporter = issue.reporter as { name: string };
  const assignee = issue.assignee as { name?: string } | undefined;

  return (
    <div className="space-y-4 lg:sticky lg:top-6 self-start">
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-border bg-secondary/20">
          <h2 className="text-sm font-semibold text-foreground">Details</h2>
        </div>

        <div className="px-5 py-4 space-y-4">
          <DetailRow label="Status">
            <StatusBadge status={issue.status} />
          </DetailRow>

          <DetailRow label="Priority">
            <PriorityBadge priority={issue.priority} />
          </DetailRow>

          <DetailRow label="Severity">
            <span
              className={`
              inline-flex items-center px-2 py-0.5 rounded-full
              text-xs font-medium border font-mono
              ${SEVERITY_COLORS[issue.severity] ?? SEVERITY_COLORS.Minor}
            `}
            >
              {issue.severity}
            </span>
          </DetailRow>

          <div className="border-t border-border" />

          <UserRow label="Reporter" name={reporter?.name ?? "Unknown"} />

          {assignee?.name && (
            <UserRow
              label="Assignee"
              name={assignee.name}
              color="bg-green-500/20 text-green-500"
            />
          )}

          <div className="border-t border-border" />

          <DetailRow label="Created" icon={<MdCalendarToday size={13} />}>
            <div>
              <p className="text-sm text-foreground">
                {formatDate(issue.createdAt)}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatRelativeTime(issue.createdAt)}
              </p>
            </div>
          </DetailRow>

          <DetailRow label="Updated" icon={<MdCalendarToday size={13} />}>
            <p className="text-sm text-foreground">
              {issue.updatedAt ? formatRelativeTime(issue.updatedAt) : "Never"}
            </p>
          </DetailRow>

          {issue.resolvedAt && (
            <DetailRow label="Resolved" icon={<MdCheckCircle size={13} />}>
              <p className="text-sm text-green-500">
                {formatDate(issue.resolvedAt)}
              </p>
            </DetailRow>
          )}

          {issue.tags?.length > 0 && (
            <>
              <div className="border-t border-border" />
              <DetailRow label="Tags" icon={<MdLocalOffer size={13} />}>
                <div className="flex flex-wrap gap-1 justify-end">
                  {issue.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md text-xs font-mono font-medium bg-brand-500/10 text-brand-400 border border-brand-500/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </DetailRow>
            </>
          )}
        </div>
      </div>

      {(canResolve || canClose) && (
        <div className="bg-card border border-border rounded-xl p-4 space-y-2">
          <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
            Quick Actions
          </p>

          {canResolve && (
            <button
              onClick={onResolve}
              className="
                w-full flex items-center justify-center gap-2
                px-4 py-2.5 rounded-xl text-sm font-medium
                bg-green-500/10 text-green-500 border border-green-500/20
                hover:bg-green-500/20 transition-colors
              "
            >
              <MdCheckCircle size={16} />
              Mark as Resolved
            </button>
          )}

          {canClose && (
            <button
              onClick={onClose}
              className="
                w-full flex items-center justify-center gap-2
                px-4 py-2.5 rounded-xl text-sm font-medium
                bg-secondary text-muted-foreground border border-border
                hover:text-foreground hover:bg-border transition-colors
              "
            >
              <MdCancel size={16} />
              Close Issue
            </button>
          )}
        </div>
      )}
    </div>
  );
};
