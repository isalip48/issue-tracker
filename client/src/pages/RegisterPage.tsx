import { useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegister } from "@/hooks/useAuth";
import { FormInput } from "@/components/shared/FormInput";
import { AsyncButton } from "@/components/shared/AsyncButton";
import { registerSchema, type RegisterFormData } from "@/utils";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { RegisterVisual } from "@/components/auth/RegisterVisual";

export const RegisterPage = () => {
  const { mutate: registerMutation, isPending } = useRegister();
  const navigate = useNavigate();

  const {
    register: field,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const password = useWatch({
    control,
    name: "password",
    defaultValue: "",
  });

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
    const credentials = {
      name: data.name,
      email: data.email,
      password: data.password,
    };
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

        <AsyncButton type="submit" isLoading={isPending} className="mt-6">
          Create account
        </AsyncButton>
      </form>
    </AuthLayout>
  );
};
