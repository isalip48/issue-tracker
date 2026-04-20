import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MdEdit,
  MdDelete,
  MdTitle,
  MdDescription,
  MdLabel,
} from "react-icons/md";

import { useIssue, useUpdateIssue, useDeleteIssue } from "@/hooks/useIssues";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { IssueDetailSidebar } from "@/components/issues/IssueDetailSidebar";
import { StatusChangeDialog } from "@/components/issues/StatusChangeDialog";
import { DeleteConfirmDialog } from "@/components/issues/DeleteConfirmDialog";
import { DetailCard } from "@/components/shared/DetailCard";
import { PageHeader } from "@/components/shared/PageHeader";

export const IssueDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [statusDialog, setStatusDialog] = useState({
    open: false,
    target: null as "Resolved" | "Closed" | null,
  });

  const [deleteDialog, setDeleteDialog] = useState(false);

  const { data: issueData, isLoading, isError } = useIssue(id ?? "");
  const updateMutation = useUpdateIssue();
  const deleteMutation = useDeleteIssue();

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
      <div className="w-full space-y-6 animate-pulse px-6">
        <div className="h-10 w-full bg-muted rounded-lg" />
        <div className="h-64 bg-muted rounded-xl" />
      </div>
    );
  }

  if (isError || !issue) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <MdDelete className="text-red-500" size={28} />
        <p className="text-sm font-medium">Issue not found</p>
        <button
          onClick={() => navigate("/issues")}
          className="px-4 py-2 rounded-lg bg-secondary hover:bg-border transition"
        >
          Back
        </button>
      </div>
    );
  }

  const canResolve = issue.status !== "Resolved" && issue.status !== "Closed";
  const canClose = issue.status !== "Closed";

  return (
    <div className="px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        title="ISSUE DETAILS"
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
              className="p-2.5 rounded-xl border border-border bg-background hover:bg-secondary transition-all"
              title="Edit Issue"
            >
              <MdEdit size={20} className="text-blue-500" />
            </button>
            <button
              onClick={() => setDeleteDialog(true)}
              className="p-2.5 rounded-xl text-red-600 bg-red-500/5 border border-red-500/20 hover:bg-red-500/10 transition-all"
              title="Delete Issue"
            >
              <MdDelete size={20} />
            </button>
          </div>
        }
      />

      {/* CENTERED GRID CONTAINER */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* MAIN CONTENT */}
          <div className="lg:col-span-2 space-y-6">
            <DetailCard className="p-8">
              <div className="space-y-8">
                {/* Title Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MdTitle className="text-brand-500" size={20} />
                    <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                      Issue Heading
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight text-foreground leading-tight">
                    {issue.title}
                  </h1>
                </div>

                {/* Description Section */}
                <div className="space-y-4 pt-6 border-t border-border/50">
                  <div className="flex items-center gap-2">
                    <MdDescription className="text-brand-500" size={20} />
                    <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                      Description
                    </span>
                  </div>
                  <div className="rounded-2xl border border-border bg-secondary/5 p-6 text-sm leading-relaxed min-h-[200px] prose prose-invert max-w-none">
                    {issue.description ? (
                      <div
                        dangerouslySetInnerHTML={{ __html: issue.description }}
                      />
                    ) : (
                      <span className="text-muted-foreground italic">
                        No description provided.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </DetailCard>
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-6 lg:sticky lg:top-24">
            <DetailCard title="Classification" icon={<MdLabel size={18} />}>
              <IssueDetailSidebar
                issue={issue}
                canResolve={canResolve}
                canClose={canClose}
                onResolve={() =>
                  setStatusDialog({ open: true, target: "Resolved" })
                }
                onClose={() =>
                  setStatusDialog({ open: true, target: "Closed" })
                }
              />
            </DetailCard>
          </aside>
        </div>
      </div>

      {/* DIALOGS */}
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
