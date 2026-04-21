import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdEdit, MdDelete, MdDescription, MdPerson } from "react-icons/md";

import { useIssue, useUpdateIssue, useDeleteIssue } from "@/hooks/useIssues";
import { useAuthStore } from "@/store/authStore";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { IssueDetailSidebar } from "@/components/issues/IssueDetailSidebar";
import {
  StatusChangeDialog,
  type TargetStatus,
} from "@/components/issues/StatusChangeDialog";
import { DeleteConfirmDialog } from "@/components/issues/DeleteConfirmDialog";
import { PageHeader } from "@/components/shared/PageHeader";
import { formatRelativeTime } from "@/utils";
import { EmptyState } from "@/components/shared/EmptyState";

export const IssueDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [statusDialog, setStatusDialog] = useState<{
    open: boolean;
    target: TargetStatus | null;
  }>({ open: false, target: null });
  const [deleteDialog, setDeleteDialog] = useState(false);

  const { data: issueData, isLoading, isError } = useIssue(id ?? "");
  const updateMutation = useUpdateIssue();
  const deleteMutation = useDeleteIssue();
  const { user } = useAuthStore();
  const issue = issueData?.data?.issue;

  if (!id) {
    navigate("/issues", { replace: true });
    return null;
  }

  const handleStatusChange = () => {
    if (!statusDialog.target) return;
    updateMutation.mutate(
      { id, data: { status: statusDialog.target } },
      { onSuccess: () => setStatusDialog({ open: false, target: null }) },
    );
  };

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(id);
    navigate("/issues", { replace: true });
  };

  if (isLoading) {
    return (
      <div className="w-full space-y-6 animate-pulse">
        <div className="h-12 w-full bg-muted rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          <div className="space-y-1">
            <div className="h-64 bg-muted rounded-2xl" />
            <div className="h-48 bg-muted rounded-2xl" />
          </div>
          <div className="space-y-4">
            <div className="h-44 bg-muted rounded-2xl" />
            <div className="h-32 bg-muted rounded-2xl" />
            <div className="h-24 bg-muted rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !issue) {
    return (
      <EmptyState
        variant="not-found"
        title="Issue not found"
        description="The issue may have been deleted or the link is invalid."
        action={
          <button
            onClick={() => navigate("/issues")}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition"
          >
            Back to Issues
          </button>
        }
      />
    );
  }

  const reporter = issue.reporter as { name: string } | undefined;
  const canResolve = issue.status !== "Resolved" && issue.status !== "Closed";
  const canClose = issue.status !== "Closed";
  const canReopen = issue.status === "Closed" || issue.status === "Resolved";

  return (
    <div className="flex-1 flex flex-col w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        title="Issue Details"
        subtitle={
          <div className="flex items-center gap-2">
            <span className="font-mono text-muted-foreground">
              #{id.slice(-6)}
            </span>
            <span className="text-border">|</span>
            <PriorityBadge priority={issue.priority} />
            <span className="text-border">|</span>
            <StatusBadge status={issue.status} />
          </div>
        }
        onBack={() => navigate("/issues")}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/issues/${id}/edit`)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-background text-sm font-medium hover:bg-secondary transition-all"
              title="Edit Issue"
            >
              <MdEdit size={16} className="text-blue-500" />
              Edit
            </button>
            {(() => {
              const assignee = issue.assignee as { _id?: string } | undefined;
              const reporter = issue.reporter as { _id?: string } | undefined;
              const isAdmin = user?.role?.toLowerCase() === "admin";
              const isReporter = reporter?._id === user?._id;
              const isAssignee = assignee?._id === user?._id;
              const canDelete = isAdmin || isReporter || isAssignee;
              return canDelete ? (
                <button
                  onClick={() => setDeleteDialog(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium text-red-500 bg-red-500/5 border border-red-500/20 hover:bg-red-500/10 transition-all"
                  title="Delete Issue"
                >
                  <MdDelete size={16} />
                  Delete
                </button>
              ) : null;
            })()}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
        <div className="space-y-6">
          <div className="relative overflow-hidden bg-card border border-border/60 rounded-3xl shadow-xl shadow-foreground/[0.02]">
            <div className="relative p-8 md:p-10 space-y-6">
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground font-medium">
                <span className="font-mono bg-background border border-border/80 px-3 py-1 rounded-lg text-foreground shadow-sm">
                  #{id.slice(-6)}
                </span>
                {reporter?.name && (
                  <>
                    <span className="text-border/50">/</span>
                    <span className="flex items-center gap-1.5 text-foreground/80">
                      <MdPerson size={16} className="text-brand-500" />
                      {reporter.name}
                    </span>
                  </>
                )}
                <span className="text-border/50">/</span>
                <span>Opened {formatRelativeTime(issue.createdAt)}</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground leading-[1.15]">
                {issue.title}
              </h1>
            </div>
          </div>

          <div className="relative overflow-hidden bg-card border border-border/60 rounded-3xl shadow-xl shadow-foreground/[0.02]">
            <div className="relative p-8 md:p-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20 shadow-inner">
                  <MdDescription size={20} />
                </div>
                <div>
                  <h2 className="text-sm font-black uppercase tracking-widest text-foreground">
                    Description
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Details and context
                  </p>
                </div>
              </div>

              {issue.description ? (
                <div
                  className="prose dark:prose-invert max-w-none text-[15px] leading-[1.75] text-foreground/90 selection:bg-brand-500/30
                             prose-headings:font-bold prose-headings:tracking-tight prose-a:text-brand-400 prose-a:no-underline hover:prose-a:underline"
                  dangerouslySetInnerHTML={{ __html: issue.description }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[220px] rounded-2xl border-2 border-dashed border-border/60 bg-background/50 text-center px-6 gap-4">
                  <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center text-muted-foreground/40">
                    <MdDescription size={28} />
                  </div>
                  <div>
                    <p className="text-[15px] font-semibold text-foreground/70">
                      No description provided
                    </p>
                    <p className="text-sm text-muted-foreground mt-1.5 max-w-sm mx-auto">
                      There are no additional details for this issue. Click{" "}
                      <strong className="text-foreground">Edit</strong> to add
                      context.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24">
          <IssueDetailSidebar
            issue={issue}
            canResolve={canResolve}
            canClose={canClose}
            canReopen={canReopen}
            onResolve={() =>
              setStatusDialog({ open: true, target: "Resolved" })
            }
            onClose={() => setStatusDialog({ open: true, target: "Closed" })}
            onReopen={() => setStatusDialog({ open: true, target: "Open" })}
          />
        </aside>
      </div>

      <StatusChangeDialog
        isOpen={statusDialog.open}
        targetStatus={statusDialog.target ?? "Resolved"}
        issueTitle={issue.title}
        onConfirm={handleStatusChange}
        onCancel={() => setStatusDialog({ open: false, target: null })}
        isLoading={updateMutation.isPending}
      />
      <DeleteConfirmDialog
        isOpen={deleteDialog}
        title={issue.title}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog(false)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
