import { useNavigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateIssue } from "@/hooks/useIssues";
import { IssueFormFields } from "@/components/shared/IssueFormFields";
import { IssueFormActions } from "@/components/shared/IssueFormActions";
import { IssueTips } from "@/components/shared/IssueTips";
import { PageHeader } from "@/components/shared/PageHeader";
import { issueFormSchema, type IssueFormData } from "@/utils";

const DEFAULT_DESCRIPTION = `
<h3>Overview</h3>
<p>Provide a brief summary of the issue...</p>
<p></p>
<h3>Steps to Reproduce</h3>
<ol>
  <li>...</li>
</ol>
<p></p>
<h3>Expected Behavior</h3>
<p>What did you expect to happen?</p>
<p></p>
<h3>Actual Behavior</h3>
<p>What actually happened?</p>
<p></p>
`;

export const CreateIssuePage = () => {
  const navigate = useNavigate();
  const createMutation = useCreateIssue();

  const methods = useForm({
    resolver: zodResolver(issueFormSchema),
    defaultValues: {
      status: "Open",
      priority: "Medium",
      severity: "Minor",
      tags: [],
      assignee: "",
      description: DEFAULT_DESCRIPTION,
    },
  });

  const onSubmit = (data: IssueFormData) => {
    createMutation.mutate(data, {
      onSuccess: (response) => {
        navigate(`/issues/${response.data.issue._id}`);
      },
    });
  };

  return (
    <div className="flex-1 flex flex-col w-full animate-fade-up">
      <PageHeader
        title="Create New Issue"
        subtitle="Fill in the details to document a bug or task"
        onBack={() => navigate(-1)}
      />

      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="flex-1 flex flex-col"
        >
          <IssueFormFields />
          <IssueTips variant="create" />

          <div className="flex-1 min-h-8" />

          <IssueFormActions
            isPending={createMutation.isPending}
            label="Create Issue"
            pendingLabel="Creating…"
            discardLabel="Discard draft"
            onDiscard={() => navigate(-1)}
            secondaryLabel="Cancel"
            onSecondary={() => navigate(-1)}
          />
        </form>
      </FormProvider>
    </div>
  );
};
