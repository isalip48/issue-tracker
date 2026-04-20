import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useIssue, useUpdateIssue } from "../hooks/useIssues";
import { IssueFormFields } from "@/components/shared/IssueFormFields";
import { StatusBadge } from "../components/shared/StatusBadge";
import { issueFormSchema, type IssueFormData } from "../utils";
import { SubmitButton } from "@/components/shared/SubmitButton";
import { PageHeader } from "@/components/shared/PageHeader";

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

  if (isLoading) return <EditSkeleton />;

  if (!issue)
    return (
      <NotFound message="Issue not found" onBack={() => navigate("/issues")} />
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

const EditSkeleton = () => (
  <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
    <div className="h-10 w-48 bg-muted rounded-lg" />
    <div className="bg-card border border-border rounded-xl p-6 space-y-4">
      <div className="h-6 w-24 bg-muted rounded" />
      <div className="h-10 bg-muted rounded-lg" />
      <div className="h-48 bg-muted rounded-xl" />
    </div>
  </div>
);

const NotFound = ({
  message,
  onBack,
}: {
  message: string;
  onBack: () => void;
}) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
    <p className="text-muted-foreground">{message}</p>
    <button
      onClick={onBack}
      className="px-4 py-2 rounded-lg bg-secondary text-sm font-medium hover:bg-border transition-colors"
    >
      Go back
    </button>
  </div>
);
