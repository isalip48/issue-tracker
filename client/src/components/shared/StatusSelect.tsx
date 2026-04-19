import { useState, useRef, useEffect } from "react";
import { IoChevronDown } from "react-icons/io5";
import { cn } from "../../lib/utils";

const STATUS_CONFIG: Record<string, { label: string; text: string }> = {
  Open: { label: "Open", text: "text-blue-400" },
  "In Progress": { label: "In Progress", text: "text-amber-400" },
  Resolved: { label: "Resolved", text: "text-green-400" },
  Closed: { label: "Closed", text: "text-slate-500" },
};

interface StatusSelectProps {
  value: string;
  onChange: (status: string) => void;
}

export const StatusSelect = ({ value, onChange }: StatusSelectProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const config = STATUS_CONFIG[value] ?? STATUS_CONFIG["Open"];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className={cn(
          "w-32 flex items-center justify-center gap-1.5",
          "px-2.5 py-1 rounded-full",
          "border border-white/[0.06] bg-white/[0.02]",
          "text-xs font-medium font-mono transition-opacity hover:opacity-80",
          config.text,
        )}
      >
        {config.label}
        <IoChevronDown
          size={10}
          className={cn(
            "transition-transform duration-150 opacity-40 shrink-0",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div
          className="
          absolute top-full left-1/2 -translate-x-1/2 mt-1.5 z-50
          w-32 rounded-xl overflow-hidden
          bg-[#141418] border border-white/[0.08]
          shadow-[0_8px_24px_rgba(0,0,0,0.5)]
          animate-fade-up
        "
        >
          {Object.entries(STATUS_CONFIG).map(([status, cfg]) => (
            <button
              key={status}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange(status);
                setOpen(false);
              }}
              className={cn(
                "w-full flex items-center justify-center gap-1.5 px-3 py-2.5",
                "text-xs font-medium font-mono transition-colors",
                "hover:bg-white/[0.04]",
                value === status
                  ? cn(cfg.text, "bg-white/[0.03]")
                  : "text-slate-400",
              )}
            >
              {status}
              {value === status && (
                <span className="text-[10px] opacity-40">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
