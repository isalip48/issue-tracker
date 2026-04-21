import {
  MdPerson,
  MdCalendarToday,
  MdCheckCircle,
  MdLocalOffer,
  MdCancel,
  MdRefresh,
  MdPeople,
  MdSchedule,
  MdBolt,
  MdTrackChanges,
  MdFolder,
} from "react-icons/md";
import { formatDate, formatRelativeTime } from "@/utils";
import type { Issue } from "@/types";
import { StatusWorkflow } from "@/components/issues/StatusWorkflow";

const SidebarCardHeader = ({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) => (
  <div className="flex items-center gap-3 px-6 py-5 border-b border-border/60 bg-secondary/10">
    <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-500">
      {icon}
    </div>
    <h3 className="text-xs font-black uppercase tracking-widest text-foreground">
      {title}
    </h3>
  </div>
);

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

const UserChip = ({
  name,
  color = "bg-brand-500/20 text-brand-500",
}: {
  name: string;
  color?: string;
}) => (
  <div className="flex items-center gap-1.5 justify-end">
    <div
      className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-semibold ${color}`}
    >
      {name.charAt(0).toUpperCase()}
    </div>
    <span className="text-sm text-foreground">{name}</span>
  </div>
);

interface IssueDetailSidebarProps {
  issue: Issue;
  canResolve: boolean;
  canClose: boolean;
  canReopen: boolean;
  onResolve: () => void;
  onClose: () => void;
  onReopen: () => void;
}

export const IssueDetailSidebar = ({
  issue,
  canResolve,
  canClose,
  canReopen,
  onResolve,
  onClose,
  onReopen,
}: IssueDetailSidebarProps) => {
  const reporter = issue.reporter as { name: string };
  const assignee = issue.assignee as { name?: string } | undefined;
  const hasActions = canResolve || canClose || canReopen;

  return (
    <div className="space-y-4 text-[11px] uppercase font-black tracking-widest text-muted-foreground">
      <div className="bg-card border border-border/60 rounded-3xl overflow-hidden shadow-xl shadow-foreground/[0.02]">
        <SidebarCardHeader icon={<MdFolder size={16} />} title="Project" />
        <div className="p-6">
          <div className="flex flex-col gap-1">
            <span className="text-base font-bold text-foreground normal-case tracking-normal">
              {issue.project?.name || "No Project"}
            </span>
            {issue.project?.description && (
              <p className="text-xs text-muted-foreground font-medium normal-case tracking-normal line-clamp-2">
                {issue.project.description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
      <div className="bg-card border border-border/60 rounded-3xl overflow-hidden shadow-xl shadow-foreground/[0.02]">
        <SidebarCardHeader icon={<MdPeople size={16} />} title="People" />
        <div className="p-6 space-y-4">
          <DetailRow label="Reporter" icon={<MdPerson size={12} />}>
            <UserChip name={reporter?.name ?? "Unknown"} />
          </DetailRow>

          <DetailRow label="Assignee" icon={<MdPerson size={12} />}>
            {assignee?.name ? (
              <UserChip
                name={assignee.name}
                color="bg-green-500/20 text-green-500"
              />
            ) : (
              <span className="text-xs text-muted-foreground italic">
                Unassigned
              </span>
            )}
          </DetailRow>

          {(issue.tags?.length ?? 0) > 0 && (
            <>
              <div className="border-t border-border/50" />
              <DetailRow label="Tags" icon={<MdLocalOffer size={12} />}>
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

      <div className="bg-card border border-border/60 rounded-3xl overflow-hidden shadow-xl shadow-foreground/[0.02]">
        <SidebarCardHeader icon={<MdSchedule size={16} />} title="Timeline" />
        <div className="p-6 space-y-4">
          <DetailRow label="Created" icon={<MdCalendarToday size={12} />}>
            <div>
              <p className="text-sm text-foreground">
                {formatDate(issue.createdAt)}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatRelativeTime(issue.createdAt)}
              </p>
            </div>
          </DetailRow>

          <DetailRow label="Updated" icon={<MdCalendarToday size={12} />}>
            <p className="text-sm text-foreground">
              {issue.updatedAt ? formatRelativeTime(issue.updatedAt) : "Never"}
            </p>
          </DetailRow>

          {issue.resolvedAt && (
            <DetailRow label="Resolved" icon={<MdCheckCircle size={12} />}>
              <p className="text-sm text-green-500">
                {formatDate(issue.resolvedAt)}
              </p>
            </DetailRow>
          )}
        </div>
      </div>

      <div className="bg-card border border-border/60 rounded-3xl overflow-hidden shadow-xl shadow-foreground/[0.02]">
        <SidebarCardHeader
          icon={<MdTrackChanges size={16} />}
          title="Status Pipeline"
        />
        <div className="px-5 py-6">
          <StatusWorkflow currentStatus={issue.status} />
        </div>
      </div>

      {hasActions && (
        <div className="bg-card border border-border/60 rounded-3xl overflow-hidden shadow-xl shadow-foreground/[0.02]">
          <SidebarCardHeader
            icon={<MdBolt size={16} />}
            title="Quick Actions"
          />
          <div className="p-6 space-y-3">
            {canResolve && (
              <button
                onClick={onResolve}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500/20 transition-colors"
              >
                <MdCheckCircle size={16} />
                Mark as Resolved
              </button>
            )}

            {canReopen && (
              <button
                onClick={onReopen}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
              >
                <MdRefresh size={16} />
                Reopen Issue
              </button>
            )}

            {canClose && (
              <button
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-secondary text-muted-foreground border border-border hover:text-foreground hover:bg-border transition-colors"
              >
                <MdCancel size={16} />
                Close Issue
              </button>
            )}
          </div>
        </div>
      )}
    </div>
    </div>
  );
};
