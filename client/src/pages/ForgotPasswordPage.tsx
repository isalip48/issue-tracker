import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "@/components/shared/FormInput";
import { AsyncButton } from "@/components/shared/AsyncButton";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/utils";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { LoginVisual } from "@/components/auth/LoginVisual";

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    navigate("/reset-password/direct", { state: { email: data.email } });
  };

  const leftBottomContent = (
    <div className="space-y-4">
      <div className="h-[2px] w-8 bg-primary rounded-full opacity-80" />
      <p className="text-[14px] text-muted-foreground leading-relaxed pr-8">
        Enter your email address to proceed with resetting your password.
      </p>
    </div>
  );

  return (
    <AuthLayout
      animationClass="animate-in slide-in-from-left-8 fade-in duration-500"
      leftHeadline="Lost access?"
      leftSubHeadline="We've got you covered."
      leftVisual={<LoginVisual />}
      leftBottomContent={leftBottomContent}
      topBadge="Security"
      title={
        <>
          Forgot
          <br />
          password.
        </>
      }
      subtitle="Reset your credentials."
      bottomLinkText="Remembered it?"
      bottomLinkTo="/login"
      bottomLinkActionText="Back to sign in"
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

        <div className="flex justify-end">
          <AsyncButton type="submit" className="mt-6">
            Continue
          </AsyncButton>
        </div>
      </form>
    </AuthLayout>
  );
};
