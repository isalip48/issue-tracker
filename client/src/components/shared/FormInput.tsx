import { forwardRef, type InputHTMLAttributes, useState } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { cn } from "../../utils";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  hint?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ error, hint, className, type, placeholder, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

    return (
      <div className="space-y-1.5 w-full">
        <div className="relative group w-full">
          <input
            {...props}
            ref={ref}
            type={isPassword && showPassword ? "text" : type}
            placeholder={placeholder}
            className={cn(
              "flex h-[42px] w-full rounded-lg border border-border bg-background/50 px-3.5 py-2 text-[13px] text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all duration-200 placeholder:text-muted-foreground/50 hover:bg-background focus:bg-background focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-red-500/50 focus:border-red-500 focus:ring-red-500/10",
              isPassword && "pr-10",
              className,
            )}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground/80 transition-all rounded-full p-1"
              tabIndex={-1}
            >
              {showPassword ? (
                <MdVisibilityOff size={18} />
              ) : (
                <MdVisibility size={18} />
              )}
            </button>
          )}
        </div>

        {error && (
          <p className="text-xs font-semibold text-red-400 pl-2 animate-slide-in">
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="text-xs text-foreground/40 pl-2">{hint}</p>
        )}
      </div>
    );
  },
);

FormInput.displayName = "FormInput";
