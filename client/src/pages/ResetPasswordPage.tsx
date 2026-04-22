import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useResetPassword, useResetPasswordDirect } from "@/hooks/useAuth";
import { FormInput } from "@/components/shared/FormInput";
import { AsyncButton } from "@/components/shared/AsyncButton";
import { resetPasswordSchema, type ResetPasswordFormData } from "@/utils";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { LoginVisual } from "@/components/auth/LoginVisual";
import { useEffect } from "react";
import { toast } from "sonner";

export const ResetPasswordPage = () => {
  const { token } = useParams<{ token: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { mutate: resetPassword, isPending } = useResetPassword();
  const { mutate: resetDirect, isPending: isDirectPending } =
    useResetPasswordDirect();

  const email = (location.state as { email?: string })?.email;

  useEffect(() => {
    if (!token && !email) {
      toast.error("Invalid reset attempt. Please try again.");
      navigate("/forgot-password", { replace: true });
    }
  }, [token, email, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    if (token && token !== "direct") {
      resetPassword(
        { token, data },
        { onSuccess: () => navigate("/login", { replace: true }) }
      );
    } else if (email) {
      resetDirect(
        { email, password: data.password, confirmPassword: data.confirmPassword },
        { onSuccess: () => navigate("/login", { replace: true }) }
      );
    }
  };

  const leftBottomContent = (
    <div className="space-y-4">
      <div className="h-[2px] w-8 bg-primary rounded-full opacity-80" />
      <p className="text-[14px] text-muted-foreground leading-relaxed pr-8">
        Create a new, strong password for your account to regain access.
      </p>
    </div>
  );

  return (
    <AuthLayout
      animationClass="animate-in slide-in-from-left-8 fade-in duration-500"
      leftHeadline="Set a new"
      leftSubHeadline="secure password."
      leftVisual={<LoginVisual />}
      leftBottomContent={leftBottomContent}
      topBadge="Security"
      title={
        <>
          Reset
          <br />
          password.
        </>
      }
      subtitle="Update your credentials."
      bottomLinkText="Cancel reset?"
      bottomLinkTo="/login"
      bottomLinkActionText="Back to sign in"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-[11px] font-medium tracking-[0.05em] uppercase mb-1.5 text-muted-foreground">
            New Password
          </label>
          <FormInput
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password")}
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium tracking-[0.05em] uppercase mb-1.5 text-muted-foreground">
            Confirm New Password
          </label>
          <FormInput
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
        </div>

        <div className="flex justify-end">
          <AsyncButton
            type="submit"
            isLoading={isPending || isDirectPending}
            className="mt-6"
          >
            Update password
          </AsyncButton>
        </div>
      </form>
    </AuthLayout>
  );
};
