import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useIssue, useUpdateIssue } from "@/hooks/useIssues";
import { IssueFormFields } from "@/components/shared/IssueFormFields";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { issueFormSchema, type IssueFormData } from "@/utils";
import { SubmitButton } from "@/components/shared/SubmitButton";
import { PageHeader } from "@/components/shared/PageHeader";
import { IssueSkeleton } from "@/components/shared/IssueSkeleton";
import { NotFoundState } from "@/components/shared/NotFoundState";

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
          ? (issue.assignee as { _id: string })?._id
          : issue.assignee,
    });
  }, [issue, methods]);

  const onSubmit = (data: IssueFormData) => {
    updateMutation.mutate(
      { id: id!, data },
      { onSuccess: () => navigate(`/issues/${id}`) },
    );
  };

  if (isLoading) return <IssueSkeleton />;

  if (!issue)
    return (
      <NotFoundState message="Issue not found" onBack={() => navigate("/issues")} />
    );

  return (
    <div className="px-6 animate-fade-up">
      <PageHeader
        title="Edit Issue"
        subtitle={
          <div className="flex items-center gap-2">
            <span>#{id?.slice(-6)}</span>
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

      {/* CONSISTENT CENTERED CONTAINER */}
      <div className="max-w-6xl mx-auto">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
            <IssueFormFields />

            <div className="flex items-center justify-between pt-8 border-t border-border/60">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="text-sm font-medium text-muted-foreground hover:text-red-400 transition"
              >
                Discard changes
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate(`/issues/${id}`)}
                  className="px-5 py-2.5 rounded-xl border border-border text-sm font-semibold hover:bg-secondary transition"
                >
                  Preview
                </button>
                <SubmitButton
                  isPending={updateMutation.isPending}
                  disabled={!isDirty}
                  label="Save Changes"
                  pendingLabel="Saving..."
                />
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

