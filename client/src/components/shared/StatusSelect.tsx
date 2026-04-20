import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { IoChevronDown } from "react-icons/io5";
import { cn } from "@/lib/utils";

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
  const buttonRef = useRef<HTMLButtonElement>(null);

  const config = STATUS_CONFIG[value] ?? STATUS_CONFIG["Open"];

  const [pos, setPos] = useState({ top: 0, left: 0 });

  const updatePosition = () => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();

    setPos({
      top: rect.bottom + window.scrollY + 6,
      left: rect.left + rect.width / 2,
    });
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open) updatePosition();
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
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

      {open &&
        createPortal(
          <div
            className="
              fixed z-50 w-32 rounded-xl overflow-hidden
              bg-[#141418] border border-white/[0.08]
              shadow-[0_8px_24px_rgba(0,0,0,0.5)]
            "
            style={{
              top: pos.top,
              left: pos.left,
              transform: "translateX(-50%)",
            }}
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
                  value === status ? cfg.text : "text-slate-400",
                )}
              >
                {status}
                {value === status && (
                  <span className="text-[10px] opacity-40">✓</span>
                )}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </>
  );
};
