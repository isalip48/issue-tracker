// client/src/pages/CreateIssuePage.tsx
import { useNavigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdArrowBack, MdAddCircleOutline } from "react-icons/md"; // Added icons for consistency
import { useCreateIssue } from "@/hooks/useIssues";
import { IssueFormFields } from "@/components/shared/IssueFormFields";
import { issueFormSchema, type IssueFormData } from "../utils";
import { SubmitButton } from "@/components/shared/SubmitButton";

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
    <div className=" flex-1 flex flex-col w-full animate-fade-up px-4">
      
      <div className="flex items-center justify-between mb-10 pb-6 border-b border-border/50">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-foreground">Create New Issue</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Fill in the details to document a bug or task
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
          >
            <MdArrowBack size={18} />
            Back
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full">
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="flex-1 flex flex-col"
          >
            <IssueFormFields />

            <div className="mt-8 pt-6  flex justify-between pb-12">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="text-sm font-medium text-muted-foreground hover:text-red-400 transition-colors"
              >
                Discard draft
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-2.5 rounded-xl text-sm font-medium border border-border text-muted-foreground hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <SubmitButton
                  isPending={createMutation.isPending}
                  label="Create Issue"
                  pendingLabel="Creating..."
                />
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};