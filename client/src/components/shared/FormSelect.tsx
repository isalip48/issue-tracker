// Reusable labeled select — used across Create, Edit pages
import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label:      string;
  options:    string[];
  labelClass?: string;
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, options, labelClass, className, ...props }, ref) => (
    <div className="space-y-1.5">
      <label className={cn(
        "text-xs font-medium uppercase tracking-wider",
        labelClass ?? "text-muted-foreground"
      )}>
        {label}
      </label>
      <select
        ref={ref}
        className={cn(
          "w-full px-3 py-2.5 rounded-lg text-sm cursor-pointer",
          "bg-secondary/50 border border-border text-foreground",
          "focus:outline-none focus:ring-2 focus:ring-brand-500/50",
          "focus:border-transparent transition-all",
          className
        )}
        {...props}
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  )
);

FormSelect.displayName = "FormSelect";