import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Sparkles } from "lucide-react";
import { BackgroundFx } from "@/components/marketing/BackgroundFx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/lib/auth/authApi";
import { getApiErrorMessage } from "@/lib/api/client";
import { alertSuccess, notify } from "@/lib/alerts";
import { toast } from "sonner";

const emailSchema = z.object({
  email: z.string().trim().email("Please enter a valid email"),
});

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

const passwordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type EmailForm = z.infer<typeof emailSchema>;
type OtpForm = z.infer<typeof otpSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");

  const emailForm = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const otpForm = useForm<OtpForm>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSendOtp = async (values: EmailForm) => {
    const toastId = notify.loading("Sending OTP to your email...");
    try {
      const message = await authApi.forgotPassword(values.email);
      setEmail(values.email);
      toast.dismiss(toastId);
      notify.success(message);
      setStep(2);
    } catch (err) {
      toast.dismiss(toastId);
      notify.error(getApiErrorMessage(err, "Failed to send OTP"));
    }
  };

  const onVerifyOtp = async (values: OtpForm) => {
    const toastId = notify.loading("Verifying OTP...");
    try {
      const token = await authApi.verifyOtp(email, values.otp);
      setResetToken(token);
      toast.dismiss(toastId);
      notify.success("OTP verified!");
      setStep(3);
    } catch (err) {
      toast.dismiss(toastId);
      notify.error(getApiErrorMessage(err, "Invalid OTP"));
    }
  };

  const onResetPassword = async (values: PasswordForm) => {
    const toastId = notify.loading("Resetting password...");
    try {
      const message = await authApi.resetPassword(resetToken, values.password);
      toast.dismiss(toastId);
      await alertSuccess("Password reset!", message);
      await navigate({ to: "/login", search: { redirect: "/dashboard" } });
    } catch (err) {
      toast.dismiss(toastId);
      notify.error(getApiErrorMessage(err, "Failed to reset password"));
    }
  };

  return (
    <div className="dark relative min-h-screen text-foreground bg-background overflow-hidden flex items-center justify-center p-4">
      <BackgroundFx />

      <div className="relative w-full max-w-md rounded-2xl glass-strong border border-white/10 p-8 shadow-2xl">
        <div className="flex flex-col items-center gap-2 mb-8">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-brand shadow-glow">
            <Sparkles className="h-6 w-6 text-primary-foreground" />
          </span>
          <h1 className="text-2xl font-semibold tracking-tight">Reset password</h1>
          <p className="text-sm text-muted-foreground text-center">
            {step === 1 && "Enter your email to receive an OTP"}
            {step === 2 && "Enter the 6-digit OTP sent to your email"}
            {step === 3 && "Set your new password"}
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 w-8 rounded-full transition-colors ${
                step >= s ? "bg-gradient-brand" : "bg-white/10"
              }`}
            />
          ))}
        </div>

        {step === 1 && (
          <form onSubmit={emailForm.handleSubmit(onSendOtp)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="bg-white/5 border-white/10"
                {...emailForm.register("email")}
              />
              {emailForm.formState.errors.email && (
                <p className="text-xs text-destructive">
                  {emailForm.formState.errors.email.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              disabled={emailForm.formState.isSubmitting}
              className="w-full bg-gradient-brand text-primary-foreground border-0 shadow-glow"
            >
              {emailForm.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send OTP"
              )}
            </Button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={otpForm.handleSubmit(onVerifyOtp)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">OTP</Label>
              <Input
                id="otp"
                inputMode="numeric"
                maxLength={6}
                placeholder="123456"
                className="bg-white/5 border-white/10 tracking-[0.5em] text-center text-lg"
                {...otpForm.register("otp")}
              />
              {otpForm.formState.errors.otp && (
                <p className="text-xs text-destructive">
                  {otpForm.formState.errors.otp.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              disabled={otpForm.formState.isSubmitting}
              className="w-full bg-gradient-brand text-primary-foreground border-0 shadow-glow"
            >
              {otpForm.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify OTP"
              )}
            </Button>
            <Button type="button" variant="ghost" className="w-full" onClick={() => setStep(1)}>
              Change email
            </Button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={passwordForm.handleSubmit(onResetPassword)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="bg-white/5 border-white/10"
                {...passwordForm.register("password")}
              />
              {passwordForm.formState.errors.password && (
                <p className="text-xs text-destructive">
                  {passwordForm.formState.errors.password.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="bg-white/5 border-white/10"
                {...passwordForm.register("confirmPassword")}
              />
              {passwordForm.formState.errors.confirmPassword && (
                <p className="text-xs text-destructive">
                  {passwordForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              disabled={passwordForm.formState.isSubmitting}
              className="w-full bg-gradient-brand text-primary-foreground border-0 shadow-glow"
            >
              {passwordForm.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Reset password"
              )}
            </Button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link to="/login" search={{ redirect: "/dashboard" }} className="text-[oklch(0.82_0.14_200)] hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
