import { useState, type KeyboardEvent, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { cn } from "@/lib/utils";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  error?: string;
  maxTags?: number;
}

export const TagInput = ({
  value = [],
  onChange,
  error,
  maxTags = 8,
}: TagInputProps) => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (raw: string) => {
    // Clean the tag — lowercase, trim, no spaces
    const tag = raw.trim().toLowerCase().replace(/\s+/g, "-");

    if (!tag || value.includes(tag) || value.length >= maxTags) {
      setInputValue("");
      return;
    }

    onChange([...value, tag]);
    setInputValue("");
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    }

    if (e.key === "Backspace" && !inputValue && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div className="space-y-2">
      <div
        onClick={() => inputRef.current?.focus()}
        className={cn(
          "min-h-[44px] w-full flex flex-wrap gap-1.5 items-center",
          "px-3 py-2 rounded-xl border bg-secondary/30",
          "cursor-text transition-all duration-150",
          error
            ? "border-red-500/40"
            : "border-border focus-within:border-brand-500/50 focus-within:shadow-[0_0_0_3px_rgba(99,102,241,0.08)]",
        )}
      >
        {value.map((tag) => (
          <span
            key={tag}
            className="
              inline-flex items-center gap-1.5
              px-2.5 py-1 rounded-lg
              bg-brand-500/10 text-brand-400
              text-xs font-medium font-mono
              border border-brand-500/20
            "
          >
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(tag);
              }}
              className="text-brand-400/60 hover:text-brand-400 transition-colors"
            >
              <IoClose size={12} />
            </button>
          </span>
        ))}

        {value.length < maxTags && (
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => inputValue && addTag(inputValue)}
            placeholder={
              value.length === 0 ? "Add tags (press Enter or comma)" : ""
            }
            className="
              flex-1 min-w-[140px] bg-transparent outline-none
              text-sm text-foreground placeholder:text-muted-foreground
            "
          />
        )}
      </div>

      {error ? (
        <p className="text-xs text-red-500">⚠ {error}</p>
      ) : (
        <p className="text-xs text-muted-foreground">
          Press{" "}
          <kbd className="px-1 py-0.5 rounded bg-secondary border border-border text-[10px] font-mono">
            Enter
          </kbd>{" "}
          or{" "}
          <kbd className="px-1 py-0.5 rounded bg-secondary border border-border text-[10px] font-mono">
            ,
          </kbd>{" "}
          to add a tag
          {value.length > 0 && ` · ${maxTags - value.length} remaining`}
        </p>
      )}
    </div>
  );
};
