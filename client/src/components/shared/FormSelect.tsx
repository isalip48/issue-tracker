import { useState, useRef, forwardRef, type SelectHTMLAttributes } from "react";
import { IoChevronDown } from "react-icons/io5";
import { cn } from "@/lib/utils";
import { DropdownOverlay } from "./DropdownOverlay";

interface FormSelectProps extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "onChange"
> {
  label: string;
  options: string[];
  labelClass?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  (
    { label, options, labelClass, className, value, onChange, ...props },
    ref,
  ) => {
    const [open, setOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleSelect = (option: string) => {
      if (onChange) onChange(option);
      setOpen(false);
    };

    return (
      <div className="space-y-1.5">
        <label
          className={cn(
            "text-xs font-medium uppercase tracking-wider",
            labelClass ?? "text-muted-foreground",
          )}
        >
          {label}
        </label>

        <select
          ref={ref}
          value={value ?? ""}
          onChange={(e) => onChange?.(e.target.value)}
          className="hidden"
          {...props}
        >
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>

        <button
          ref={buttonRef}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setOpen((o) => !o);
          }}
          className={cn(
            "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm cursor-pointer",
            "bg-secondary/50 border border-border text-foreground transition-all duration-200",
            open
              ? "ring-2 ring-brand-500/50 border-transparent bg-secondary/80"
              : "hover:bg-secondary/70",
            className,
          )}
        >
          <span className={cn(!value && "text-muted-foreground")}>
            {value || "Select..."}
          </span>
          <IoChevronDown
            size={14}
            className={cn(
              "text-muted-foreground transition-transform duration-200",
              open && "rotate-180 text-brand-500",
            )}
          />
        </button>

        <DropdownOverlay buttonRef={buttonRef} open={open} setOpen={setOpen}>
          {options.map((o) => (
            <button
              key={o}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(o);
              }}
              className={cn(
                "w-full flex items-center px-4 py-2.5 text-sm font-medium transition-colors text-left",
                "hover:bg-secondary/60",
                value === o
                  ? "bg-secondary/40 text-brand-500"
                  : "text-foreground hover:text-foreground",
              )}
            >
              {o}
            </button>
          ))}
        </DropdownOverlay>
      </div>
    );
  },
);

FormSelect.displayName = "FormSelect";
