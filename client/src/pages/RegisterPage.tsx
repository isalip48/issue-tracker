import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdArrowForward } from "react-icons/md";
import { useRegister } from "../hooks/useAuth";
import { FormInput } from "../components/shared/FormInput";
import { registerSchema, type RegisterFormData } from "../utils";
import { AuthLayout } from "../components/layout/AuthLayout";
import { RegisterVisual } from "../components/auth/RegisterVisual";

export const RegisterPage = () => {
  const { mutate: registerMutation, isPending } = useRegister();
  const navigate = useNavigate();

  const {
    register: field,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch("password", "");

  const getStrength = (pw: string): number => {
    let s = 0;
    if (pw.length >= 6) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[a-z]/.test(pw)) s++;
    if (/\d/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  };

  const strength = getStrength(password);

  const strengthMeta = [
    { label: "", bgClass: "bg-border", textClass: "text-transparent" },
    { label: "Weak", bgClass: "bg-red-500", textClass: "text-red-500" },
    { label: "Weak", bgClass: "bg-red-500", textClass: "text-red-500" },
    { label: "Fair", bgClass: "bg-amber-500", textClass: "text-amber-500" },
    { label: "Good", bgClass: "bg-brand-500", textClass: "text-brand-500" },
    {
      label: "Strong",
      bgClass: "bg-emerald-500",
      textClass: "text-emerald-500",
    },
  ][strength] || {
    label: "",
    bgClass: "bg-border",
    textClass: "text-transparent",
  };

  const onSubmit = (data: RegisterFormData) => {
    const { confirmPassword: _, ...credentials } = data;
    registerMutation(credentials, {
      onSuccess: () => navigate("/dashboard", { replace: true }),
    });
  };

  const leftBottomContent = (
    <div className="space-y-4">
      <div className="h-[2px] w-8 bg-primary rounded-full opacity-80" />
      <p className="text-[14px] text-muted-foreground leading-relaxed pr-8">
        Minimalist workflow management. Streamline your bug tracking, sprint
        planning, and feature releases from day one.
      </p>
    </div>
  );

  return (
    <AuthLayout
      animationClass="animate-in slide-in-from-right-8 fade-in duration-500"
      leftHeadline="Everything you need."
      leftSubHeadline="Nothing you don't."
      leftVisual={<RegisterVisual />}
      leftBottomContent={leftBottomContent}
      topBadge="Get started"
      title={
        <>
          Create your
          <br />
          account.
        </>
      }
      subtitle="Join teams tracking issues smarter."
      bottomLinkText="Already have an account?"
      bottomLinkTo="/login"
      bottomLinkActionText="Sign in"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-[11px] font-medium tracking-[0.05em] uppercase mb-1.5 text-muted-foreground">
            Full name
          </label>
          <FormInput
            type="text"
            placeholder="Jane Doe"
            error={errors.name?.message}
            {...field("name")}
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium tracking-[0.05em] uppercase mb-1.5 text-muted-foreground">
            Email
          </label>
          <FormInput
            type="email"
            placeholder="you@company.com"
            error={errors.email?.message}
            {...field("email")}
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium tracking-[0.05em] uppercase mb-1.5 text-muted-foreground">
            Password
          </label>
          <FormInput
            type="password"
            placeholder="Min. 6 characters"
            error={errors.password?.message}
            {...field("password")}
          />

          {password && (
            <div className="mt-2 space-y-1.5">
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-[2px] flex-1 rounded-full transition-all duration-500 ${
                      i < strength ? strengthMeta.bgClass : "bg-foreground/10"
                    }`}
                  />
                ))}
              </div>
              {strengthMeta.label && (
                <p className="text-[10px] text-foreground/40">
                  Strength:{" "}
                  <span className={`font-medium ${strengthMeta.textClass}`}>
                    {strengthMeta.label}
                  </span>
                </p>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="block text-[11px] font-medium tracking-[0.05em] uppercase mb-1.5 text-muted-foreground">
            Confirm password
          </label>
          <FormInput
            type="password"
            placeholder="Re-enter password"
            error={errors.confirmPassword?.message}
            {...field("confirmPassword")}
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="group relative w-full h-[42px] mt-6 rounded-lg transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 overflow-hidden bg-secondary/40 text-foreground border border-border/50 shadow-sm hover:bg-secondary/80 hover:border-border"
        >
          {isPending ? (
            <span className="w-4 h-4 border-2 rounded-full animate-spin border-background/20 border-t-background" />
          ) : (
            <>
              <span className="text-[13px] font-semibold relative z-10 transition-transform group-hover:-translate-x-0.5 duration-300">
                Create account
              </span>
            </>
          )}
        </button>
      </form>
    </AuthLayout>
  );
};
