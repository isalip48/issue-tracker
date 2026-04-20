import { ActivityLog } from "./ActivityLog";

interface IssueDetailContentProps {
  description: string;
  issueId: string;
}

export const IssueDetailContent = ({
  description,
  issueId,
}: IssueDetailContentProps) => (
  <div className="lg:col-span-2 flex flex-col gap-6">
    <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col flex-1">
      <div className="px-5 py-3 border-b border-border bg-secondary/20 shrink-0">
        <h2 className="text-sm font-semibold text-foreground">Description</h2>
      </div>

      <div
        className="
          px-5 py-4 flex-1
          prose prose-sm prose-slate dark:prose-invert max-w-none
          prose-p:text-muted-foreground prose-p:leading-relaxed
          prose-pre:overflow-x-auto
          min-h-[160px]
        "
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </div>

    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-5 py-3 border-b border-border bg-secondary/20">
        <h2 className="text-sm font-semibold text-foreground">Activity</h2>
      </div>
      <div className="px-5 py-4 min-h-[120px]">
        <ActivityLog issueId={issueId} />
      </div>
    </div>
  </div>
);
