import { useState, useRef, useEffect, useLayoutEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { IoChevronDown } from "react-icons/io5";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<string, { label: string; text: string }> = {
  Open: { label: "Open", text: "text-blue-500" },
  "In Progress": { label: "In Progress", text: "text-amber-500" },
  Resolved: { label: "Resolved", text: "text-green-500" },
  Closed: { label: "Closed", text: "text-muted-foreground" },
};

interface StatusSelectProps {
  value: string;
  onChange: (status: string) => void;
}

export const StatusSelect = ({ value, onChange }: StatusSelectProps) => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const config = STATUS_CONFIG[value] ?? STATUS_CONFIG["Open"];

  const updatePosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setPos({
      top: rect.bottom + 6,
      left: rect.left + rect.width / 2,
    });
  }, []);

  useLayoutEffect(() => {
    if (open) {
      updatePosition();
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
    }
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, updatePosition]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        buttonRef.current &&
        !buttonRef.current.contains(target) &&
        (!portalRef.current || !portalRef.current.contains(target))
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          updatePosition();
          setOpen((o) => !o);
        }}
        className={cn(
          "w-32 flex items-center justify-center gap-1.5",
          "px-2.5 py-1 rounded-full",
          "border border-border bg-secondary/50",
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
            ref={portalRef}
            className="fixed z-50 w-32 rounded-xl overflow-hidden bg-card border border-border shadow-[0_8px_24px_rgba(0,0,0,0.15)]"
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
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onChange(status);
                  setOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-center gap-1.5 px-3 py-2.5",
                  "text-xs font-medium font-mono transition-colors",
                  "hover:bg-secondary/60",
                  value === status ? cfg.text : "text-muted-foreground",
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
