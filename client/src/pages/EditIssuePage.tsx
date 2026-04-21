import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useIssue, useUpdateIssue } from "@/hooks/useIssues";
import { IssueFormFields } from "@/components/shared/IssueFormFields";
import { IssueFormActions } from "@/components/shared/IssueFormActions";
import { IssueTips } from "@/components/shared/IssueTips";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { IssueSkeleton } from "@/components/shared/IssueSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { issueFormSchema, type IssueFormData } from "@/utils";

export const EditIssuePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: issueData, isLoading } = useIssue(id!);
  const updateMutation = useUpdateIssue();
  const issue = issueData?.data?.issue;

  const methods = useForm({
    resolver: zodResolver(issueFormSchema),
    defaultValues: {
      status: "Open",
      priority: "Medium",
      severity: "Minor",
      tags: [],
      assignee: "",
      project: "",
    },
  });

  const { isDirty } = methods.formState;

  useEffect(() => {
    if (!issue) return;
    methods.reset({
      title: issue.title,
      description: issue.description,
      status: issue.status as IssueFormData["status"],
      priority: issue.priority as IssueFormData["priority"],
      severity: issue.severity as IssueFormData["severity"],
      tags: issue.tags ?? [],
      assignee:
        typeof issue.assignee === "object"
          ? (issue.assignee as { _id?: string })?._id || ""
          : issue.assignee || "",
      project:
        typeof issue.project === "object"
          ? (issue.project as { _id?: string })?._id || ""
          : issue.project || "",
    });
  }, [issue, methods]);

  const onSubmit = (data: IssueFormData) => {
    const payload = {
      ...data,
      assignee: data.assignee || null,
    };

    updateMutation.mutate(
      { id: id!, data: payload },
      { onSuccess: () => navigate(`/issues/${id}`) },
    );
  };

  if (isLoading) return <IssueSkeleton />;

  if (!issue)
    return (
      <EmptyState
        variant="not-found"
        title="Issue not found"
        action={
          <button
            onClick={() => navigate("/issues")}
            className="px-6 py-2.5 rounded-xl bg-secondary text-foreground hover:bg-border transition-colors font-semibold text-sm"
          >
            Back to Issues
          </button>
        }
      />
    );

  return (
    <div className="flex-1 flex flex-col w-full animate-fade-up">
      <PageHeader
        title="Edit Issue"
        subtitle={
          <div className="flex items-center gap-2">
            <span className="font-mono text-muted-foreground">
              #{id?.slice(-6)}
            </span>
            <span className="text-border">|</span>
            <span>Modify issue details</span>
          </div>
        }
        onBack={() => navigate(`/issues/${id}`)}
        badge={<StatusBadge status={issue.status} />}
        actions={
          isDirty && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-600 bg-amber-500/10 border border-amber-500/20 animate-pulse uppercase tracking-wider">
              Unsaved changes
            </div>
          )
        }
      />

      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="flex-1 flex flex-col"
        >
          <IssueFormFields />
          <IssueTips variant="edit" />

          <div className="flex-1 min-h-8" />

          <IssueFormActions
            isPending={updateMutation.isPending}
            disabled={!isDirty}
            label="Save Changes"
            pendingLabel="Saving…"
            discardLabel="Discard changes"
            onDiscard={() => navigate(-1)}
            secondaryLabel="Preview"
            onSecondary={() => navigate(`/issues/${id}`)}
          />
        </form>
      </FormProvider>
    </div>
  );
};
