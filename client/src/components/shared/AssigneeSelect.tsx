import { useState, useRef, forwardRef, type SelectHTMLAttributes } from "react";
import { MdPerson } from "react-icons/md";
import { IoChevronDown } from "react-icons/io5";
import { useUsers } from "@/hooks/useUsers";
import { cn } from "@/lib/utils";
import { DropdownOverlay } from "./DropdownOverlay";

interface AssigneeSelectProps extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "onChange"
> {
  error?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export const AssigneeSelect = forwardRef<
  HTMLSelectElement,
  AssigneeSelectProps
>(({ error, className, value, onChange, ...props }, ref) => {
  const { data, isLoading } = useUsers();
  const users = data?.data?.users ?? [];

  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleSelect = (userId: string) => {
    if (onChange) onChange(userId);
    setOpen(false);
  };

  const selectedUser = users.find((u) => u._id === value);
  const displayValue = selectedUser
    ? `${selectedUser.name} (${selectedUser.role})`
    : "Unassigned";

  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-widest">
        <MdPerson size={13} />
        Assignee
      </label>

      <select
        ref={ref}
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
        className="hidden"
        {...props}
      >
        <option value="">Unassigned</option>
        {users.map((user) => (
          <option key={user._id} value={user._id}>
            {user.name}
          </option>
        ))}
      </select>

      <button
        ref={buttonRef}
        type="button"
        disabled={isLoading}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
          "bg-secondary/30 border border-border text-foreground",
          open
            ? "ring-4 ring-brand-500/10 border-brand-500/50 bg-background"
            : "hover:bg-secondary/50",
          error && "border-red-500/50 focus:ring-red-500/10",
          isLoading && "opacity-50 cursor-not-allowed",
          className,
        )}
      >
        <span className={cn(!value && "text-muted-foreground", "truncate")}>
          {isLoading ? "Fetching team..." : displayValue}
        </span>
        <IoChevronDown
          size={14}
          className={cn(
            "text-muted-foreground transition-transform duration-300",
            open && "rotate-180 text-brand-500",
          )}
        />
      </button>

      {error && (
        <p className="text-[10px] font-bold text-red-500 uppercase mt-1 tracking-tight">
          ⚠ {error}
        </p>
      )}

      <DropdownOverlay buttonRef={buttonRef} open={open} setOpen={setOpen}>
        <div
          onMouseDown={(e) => {
            e.preventDefault();
            handleSelect("");
          }}
          className={cn(
            "cursor-pointer px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary/60",
            !value ? "text-brand-500 bg-secondary/40" : "text-muted-foreground",
          )}
        >
          Unassigned
        </div>
        {users.map((u) => (
          <div
            key={u._id}
            onMouseDown={(e) => {
              e.preventDefault();
              handleSelect(u._id);
            }}
            className={cn(
              "cursor-pointer flex justify-between items-center px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary/60",
              value === u._id
                ? "text-brand-500 bg-secondary/40"
                : "text-foreground",
            )}
          >
            <span>{u.name}</span>
            <span className="text-[10px] uppercase font-black opacity-40 tracking-tighter">
              {u.role}
            </span>
          </div>
        ))}
      </DropdownOverlay>
    </div>
  );
});

AssigneeSelect.displayName = "AssigneeSelect";
