import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { MdAdd, MdBugReport, MdRefresh, MdAssignmentInd } from "react-icons/md";
import {
  useIssues,
  useDeleteIssue,
  useUpdateIssueStatus,
} from "@/hooks/useIssues";
import { IssueFiltersBar } from "@/components/issues/IssueFilters";
import { IssueCard } from "@/components/issues/IssueCard";
import { DeleteConfirmDialog } from "@/components/issues/DeleteConfirmDialog";
import { Pagination } from "@/components/shared/Pagination";
import { SkeletonRow } from "@/components/shared/SkeletonRow";
import { EmptyState } from "@/components/shared/EmptyState";
import { useAuthStore } from "@/store/authStore";
import type { Issue, IssueFilters } from "@/types";
import { exportToCSV, exportToJSON } from "@/utils";
import { cn } from "@/lib/utils";

interface IssueListPageProps {
  /** "me" locks the assignee filter to the logged-in user */
  presetAssignee?: "me";
}

export const IssueListPage = ({ presetAssignee }: IssueListPageProps) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const isMyIssues = presetAssignee === "me";
  // Defensively read either `_id` or the legacy `id` field from the persisted
  // auth store in case the user logged in before ID serialization was standardized.
  const myId =
    user?._id ||
    (user as unknown as Record<string, string> | null)?.["id"] ||
    undefined;

  const [filters, setFilters] = useState<IssueFilters>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    order: "desc",
  });

  // Merge the preset on every render so the assignee lock is never stale
  // even if Zustand hydrates from localStorage after the initial render.
  const effectiveFilters: IssueFilters =
    isMyIssues && myId
      ? { ...filters, assignee: myId }
      : filters;

  const [issueToDelete, setIssueToDelete] = useState<Issue | null>(null);

  const { data, isLoading, isError } = useIssues(effectiveFilters);
  const deleteIssueMutation = useDeleteIssue();
  const updateStatusMutation = useUpdateIssueStatus();

  const issues = data?.data?.issues ?? [];
  const pagination = data?.pagination;

  const handleFilterChange = (newFilters: IssueFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStatusChange = (id: string, status: string) => {
    updateStatusMutation.mutate({ id, status });
  };

  const handleDeleteConfirm = async () => {
    if (!issueToDelete) return;
    await deleteIssueMutation.mutateAsync(issueToDelete._id);
    setIssueToDelete(null);
  };

  const handleExportCSV = () => {
    if (issues.length === 0) {
      toast.error("No issues to export");
      return;
    }
    exportToCSV(issues, "issues");
    toast.success("CSV exported successfully!");
  };

  const handleExportJSON = () => {
    if (issues.length === 0) {
      toast.error("No issues to export");
      return;
    }
    exportToJSON(issues, "issues");
    toast.success("JSON exported successfully!");
  };

  const hasFilters = effectiveFilters.search || effectiveFilters.status || effectiveFilters.priority;

  return (
    <div className="flex flex-col max-h-full space-y-4 animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          {isMyIssues ? (
            <>
              <div className="flex items-center gap-2 mb-0.5">
                <MdAssignmentInd size={20} className="text-brand-500" />
                <h2 className="text-xl font-bold text-foreground">
                  My Issues
                </h2>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                Issues currently assigned to you
              </p>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold text-foreground">All Issues</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Manage and track all your project issues
              </p>
            </>
          )}
        </div>
        <button
          onClick={() => navigate("/issues/new")}
          className="
            flex items-center gap-2 px-4 py-2 rounded-lg
            bg-brand-500 hover:bg-brand-600 text-white
            text-sm font-medium transition-colors shadow-lg shadow-brand-500/20
          "
        >
          <MdAdd size={18} />
          <span className="hidden sm:inline">New Issue</span>
        </button>
      </div>

      <IssueFiltersBar
        filters={effectiveFilters}
        onFilterChange={handleFilterChange}
        onExportCSV={handleExportCSV}
        onExportJSON={handleExportJSON}
        totalItems={pagination?.total ?? 0}
        hideAssigneeFilter={isMyIssues}
      />

      <div className="min-h-0 rounded-xl border border-border bg-card flex flex-col overflow-hidden">
        <div className="flex-shrink-0 hidden md:grid grid-cols-[minmax(0,1fr)_140px_110px_160px_120px_72px] gap-4 px-6 py-2 border-b border-border bg-secondary/30">
          {[
            { label: "Title", align: "text-left" },
            { label: "Project", align: "text-left" },
            { label: "Priority", align: "text-left" },
            { label: "Status", align: "text-center" },
            { label: "Assignee", align: "text-left" },
            { label: "", align: "" },
          ].map(({ label, align }) => (
            <span
              key={label}
              className={cn(
                "text-xs font-medium text-muted-foreground uppercase tracking-wider",
                align,
              )}
            >
              {label}
            </span>
          ))}
        </div>

        {isLoading && <SkeletonRow count={5} variant="issue-list" />}

        {isError && (
          <EmptyState
            icon={MdBugReport}
            title="Failed to load issues"
            description="Check your connection and try again"
            action={
              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-secondary text-sm font-medium hover:bg-border transition-colors"
              >
                <MdRefresh size={16} /> Retry
              </button>
            }
          />
        )}

        {!isLoading && !isError && issues.length === 0 && (
          <EmptyState
            icon={isMyIssues ? MdAssignmentInd : MdBugReport}
            title={
              hasFilters
                ? "No issues match your filters"
                : isMyIssues
                  ? "No issues assigned to you"
                  : "No issues yet"
            }
            description={
              hasFilters
                ? "Try adjusting your search or clearing the filters"
                : isMyIssues
                  ? "You're all caught up! Issues assigned to you will appear here."
                  : "Create your first issue to start tracking bugs and tasks"
            }
            action={
              !hasFilters && !isMyIssues ? (
                <button
                  onClick={() => navigate("/issues/new")}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  <MdAdd size={16} /> Create First Issue
                </button>
              ) : undefined
            }
          />
        )}

        {!isLoading && !isError && issues.length > 0 && (
          <div className="flex-1 overflow-y-auto">
            {issues.map((issue) => (
              <IssueCard
                key={issue._id}
                issue={issue}
                onDelete={setIssueToDelete}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>

      {pagination && pagination.total > 0 && (
        <div className="py-2 border-t border-border mt-auto">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            totalItems={pagination.total}
            itemsPerPage={filters.limit ?? 10}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      <DeleteConfirmDialog
        isOpen={!!issueToDelete}
        title={issueToDelete?.title ?? ""}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIssueToDelete(null)}
        isLoading={deleteIssueMutation.isPending}
      />
    </div>
  );
};
