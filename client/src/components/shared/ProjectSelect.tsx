import { useState, useRef, forwardRef } from "react";
import { IoChevronDown } from "react-icons/io5";
import { MdFolder } from "react-icons/md";
import { cn } from "@/lib/utils";
import { DropdownOverlay } from "./DropdownOverlay";
import { useProjects } from "@/hooks/useProjects";

interface ProjectSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  label?: string;
}

export const ProjectSelect = forwardRef<HTMLDivElement, ProjectSelectProps>(
  ({ value, onChange, error, label = "Project" }, ref) => {
    const [open, setOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const { data: projects, isLoading } = useProjects();

    const selectedProject = projects?.find((p) => p._id === value);

    const handleSelect = (projectId: string) => {
      if (onChange) onChange(projectId);
      setOpen(false);
    };

    return (
      <div className="space-y-1.5" ref={ref}>
        <div className="flex items-center gap-1.5">
          <MdFolder className="text-brand-500" size={13} />
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label} <span className="text-red-500">*</span>
          </label>
        </div>

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
            error && "border-red-500/50 ring-red-500/20"
          )}
          disabled={isLoading}
        >
          <span className={cn(!selectedProject && "text-muted-foreground")}>
            {isLoading
              ? "Loading projects..."
              : selectedProject?.name || "Select Project..."}
          </span>
          <IoChevronDown
            size={14}
            className={cn(
              "text-muted-foreground transition-transform duration-200",
              open && "rotate-180 text-brand-500"
            )}
          />
        </button>

        {error && <p className="text-[10px] font-medium text-red-500">{error}</p>}

        <DropdownOverlay buttonRef={buttonRef} open={open} setOpen={setOpen}>
          <div className="max-h-[240px] overflow-y-auto custom-scrollbar">
            {projects?.length === 0 ? (
              <div className="px-4 py-3 text-xs text-muted-foreground italic">
                No projects found. Please create one first.
              </div>
            ) : (
              projects?.map((project) => (
                <button
                  key={project._id}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(project._id);
                  }}
                  className={cn(
                    "w-full flex flex-col items-start px-4 py-2.5 text-sm transition-colors text-left",
                    "hover:bg-secondary/60",
                    value === project._id
                      ? "bg-secondary/40 text-brand-500"
                      : "text-foreground hover:text-foreground"
                  )}
                >
                  <span className="font-medium">{project.name}</span>
                  {project.description && (
                    <span className="text-[10px] text-muted-foreground line-clamp-1">
                      {project.description}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </DropdownOverlay>
      </div>
    );
  }
);

ProjectSelect.displayName = "ProjectSelect";
