export const IssueSkeleton = () => (
  <div className="max-w-6xl mx-auto space-y-8 animate-pulse px-6 pt-4">
    <div className="flex flex-col gap-2">
      <div className="h-4 w-24 bg-muted rounded" />
      <div className="h-8 w-64 bg-muted rounded-lg" />
    </div>
    <div className="bg-secondary/10 border border-border/40 rounded-3xl p-8 space-y-6">
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-3">
          <div className="h-4 w-20 bg-muted/60 rounded" />
          <div className="h-10 w-full bg-muted rounded-xl" />
        </div>
        <div className="space-y-3">
          <div className="h-4 w-20 bg-muted/60 rounded" />
          <div className="h-10 w-full bg-muted rounded-xl" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-4 w-20 bg-muted/60 rounded" />
        <div className="h-32 w-full bg-muted rounded-xl" />
      </div>
    </div>
  </div>
);
