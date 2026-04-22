import { useNavigate, useLocation, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "@/hooks/useAuth";
import { FormInput } from "@/components/shared/FormInput";
import { AsyncButton } from "@/components/shared/AsyncButton";
import { loginSchema, type LoginFormData } from "@/utils";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { LoginVisual } from "@/components/auth/LoginVisual";

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
          <div className="flex justify-end mt-1.5">
            <Link
              to="/forgot-password"
              className="text-[11px] font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <div >
          <AsyncButton type="submit" isLoading={isPending}>
            Continue to workspace
          </AsyncButton>
        </div>
      </form>
    </AuthLayout>
  );
};
