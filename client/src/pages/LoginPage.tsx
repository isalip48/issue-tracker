import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdArrowForward } from "react-icons/md";
import { useLogin } from "../hooks/useAuth";
import { FormInput } from "../components/shared/FormInput";
import { loginSchema, type LoginFormData } from "../utils";
import { AuthLayout } from "../components/layout/AuthLayout";
import { LoginVisual } from "../components/auth/LoginVisual";

export const LoginPage = () => {
  const { mutate: login, isPending } = useLogin();
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ||
    "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login(data, { onSuccess: () => navigate(from, { replace: true }) });
  };

  const leftBottomContent = (
    <div className="space-y-4">
      <div className="h-[2px] w-8 bg-primary rounded-full opacity-80" />
      <p className="text-[14px] text-muted-foreground leading-relaxed pr-8">
        A high-performance issue tracking system. Designed to clear the noise so
        your team can focus on building.
      </p>
    </div>
  );

  return (
    <AuthLayout
      animationClass="animate-in slide-in-from-left-8 fade-in duration-500"
      leftHeadline="Ship faster."
      leftSubHeadline="Break nothing."
      leftVisual={<LoginVisual />}
      leftBottomContent={leftBottomContent}
      topBadge="Sign in"
      title={
        <>
          Welcome
          <br />
          back.
        </>
      }
      subtitle="Continue to your workspace."
      bottomLinkText="No account yet?"
      bottomLinkTo="/register"
      bottomLinkActionText="Create one"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-[11px] font-medium tracking-[0.05em] uppercase mb-1.5 text-muted-foreground">
            Email
          </label>
          <FormInput
            type="email"
            placeholder="you@company.com"
            error={errors.email?.message}
            {...register("email")}
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium tracking-[0.05em] uppercase mb-1.5 text-muted-foreground">
            Password
          </label>
          <FormInput
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password")}
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
                Continue to workspace
              </span>
            </>
          )}
        </button>
      </form>
    </AuthLayout>
  );
};
