import { Controller, useFormContext } from "react-hook-form";
import { TipTapEditor } from "@/components/issues/TipTapEditor";
import { TagInput } from "@/components/issues/TagInput";
import { FormSelect } from "@/components/shared/FormSelect";
import { ProjectSelect } from "@/components/shared/ProjectSelect";
import { AssigneeSelect } from "@/components/shared/AssigneeSelect";
import type { IssueFormData } from "@/utils";
import {
  MdDescription,
  MdFlag,
  MdLabel,
  MdTitle,
  MdPerson,
} from "react-icons/md";

const STATUSES = ["Open", "In Progress", "Resolved", "Closed"];
const PRIORITIES = ["Low", "Medium", "High", "Critical"];
const SEVERITIES = ["Minor", "Major", "Critical", "Blocker"];

const SidebarCardHeader = ({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) => (
  <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border/60 bg-secondary/20">
    <span className="text-brand-500">{icon}</span>
    <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
      {title}
    </h3>
  </div>
);

export const IssueFormFields = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<IssueFormData>();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-card border border-border/60 rounded-2xl shadow-lg shadow-foreground/[0.02] divide-y divide-border/50">
        <div className="p-6 space-y-2">
          <div className="flex items-center gap-2 mb-3">
            <MdTitle className="text-brand-500" size={18} />
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Issue Title <span className="text-red-500">*</span>
            </label>
          </div>
          <input
            {...register("title")}
            placeholder="Enter a clear, descriptive title…"
            className="w-full px-4 py-3.5 rounded-xl text-base font-medium bg-secondary/20 border border-border focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500/60 outline-none transition-all placeholder:text-muted-foreground/40"
          />
          {errors.title && (
            <p className="text-xs font-medium text-red-500 mt-1">
              {errors.title.message}
            </p>
          )}
        </div>

        <div className="p-6 space-y-3">
          <div className="flex items-center gap-2">
            <MdDescription className="text-brand-500" size={18} />
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Description
            </label>
          </div>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TipTapEditor
                value={field.value}
                onChange={field.onChange}
                error={errors.description?.message}
              />
            )}
          />
        </div>
      </div>

      <div className="lg:sticky lg:top-24 space-y-4">
        <div className="bg-card border border-border/60 rounded-2xl shadow-lg shadow-foreground/[0.02] overflow-hidden">
          <SidebarCardHeader
            icon={<MdLabel size={15} />}
            title="Classification"
          />
          <div className="p-5 space-y-4">
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <FormSelect label="Status" options={STATUSES} {...field} />
              )}
            />
            <Controller
              name="project"
              control={control}
              render={({ field }) => (
                <ProjectSelect
                  {...field}
                  error={errors.project?.message as string}
                />
              )}
            />
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <FormSelect label="Priority" options={PRIORITIES} {...field} />
              )}
            />
            <Controller
              name="severity"
              control={control}
              render={({ field }) => (
                <FormSelect label="Severity" options={SEVERITIES} {...field} />
              )}
            />
          </div>
        </div>

        <div className="bg-card border border-border/60 rounded-2xl shadow-lg shadow-foreground/[0.02] overflow-hidden">
          <SidebarCardHeader icon={<MdPerson size={15} />} title="Assignment" />
          <div className="p-5 space-y-4">
            <Controller
              name="assignee"
              control={control}
              render={({ field }) => (
                <AssigneeSelect
                  {...field}
                  value={field.value ?? ""}
                  error={errors.assignee?.message as string}
                />
              )}
            />

            <div className="space-y-1.5 pt-1">
              <div className="flex items-center gap-1.5">
                <MdFlag className="text-brand-500" size={13} />
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Tags
                </label>
              </div>
              <Controller
                name="tags"
                control={control}
                render={({ field }) => (
                  <TagInput
                    value={field.value ?? []}
                    onChange={field.onChange}
                    error={errors.tags?.message as string}
                  />
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
