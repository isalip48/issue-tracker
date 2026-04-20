import { Controller, useFormContext } from "react-hook-form";
import { TipTapEditor } from "@/components/issues/TipTapEditor";
import { TagInput } from "@/components/issues/TagInput";
import { FormSelect } from "@/components/shared/FormSelect";
import type { IssueFormData } from "@/utils";
import { MdDescription, MdFlag, MdLabel, MdTitle } from "react-icons/md";

const STATUSES = ["Open", "In Progress", "Resolved", "Closed"];
const PRIORITIES = ["Low", "Medium", "High", "Critical"];
const SEVERITIES = ["Minor", "Major", "Critical", "Blocker"];

export const IssueFormFields = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<IssueFormData>();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-card border border-border/60 rounded-2xl p-8 shadow-xl shadow-foreground/[0.02] space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MdTitle className="text-brand-500" size={20} />
              <label className="text-sm font-bold text-foreground/80 uppercase tracking-wide">
                Issue Title <span className="text-red-500">*</span>
              </label>
            </div>
            <input
              {...register("title")}
              placeholder="Enter a descriptive title..."
              className="w-full px-5 py-4 rounded-xl text-lg font-medium bg-secondary/20 border border-border focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all placeholder:text-muted-foreground/50"
            />
            {errors.title && (
              <p className="text-xs font-medium text-red-500 flex items-center gap-1">
                 {errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MdDescription className="text-brand-500" size={20} />
              <label className="text-sm font-bold text-foreground/80 uppercase tracking-wide">
                Description
              </label>
            </div>
            <div className="rounded-xl overflow-hidden border border-border bg-secondary/10 focus-within:ring-4 focus-within:ring-brand-500/10 transition-all">
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
        </div>
      </div>

      <aside className="space-y-6 lg:sticky lg:top-24">
        <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-lg space-y-6">
          <div className="flex items-center gap-2 border-b border-border pb-4">
            <MdLabel className="text-brand-500" size={18} />
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
              Classification
            </h3>
          </div>

          <div className="space-y-6">
            <div className="group transition-all">
              <FormSelect
                label="Status"
                options={STATUSES}
                {...register("status")}
              />
            </div>
            <div className="group transition-all">
              <FormSelect
                label="Priority"
                options={PRIORITIES}
                {...register("priority")}
              />
            </div>
            <div className="group transition-all">
              <FormSelect
                label="Severity"
                options={SEVERITIES}
                {...register("severity")}
              />
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2">
                <MdFlag className="text-brand-500" size={16} />
                <label className="text-xs font-bold uppercase text-muted-foreground">
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
      </aside>
    </div>
  );
};
