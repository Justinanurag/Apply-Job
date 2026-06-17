import { createFileRoute, Link, redirect, useNavigate, useSearch } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { BackgroundFx } from "@/components/marketing/BackgroundFx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/controllers/useAuth";
import { getApiErrorMessage } from "@/lib/api/client";
import { ensureAuthenticated } from "@/lib/auth/authApi";
import { alertSuccess, notify } from "@/lib/alerts";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: (search.redirect as string) || "/dashboard",
  }),
  beforeLoad: async () => {
    const user = await ensureAuthenticated();
    if (user) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { redirect: redirectTo } = useSearch({ from: "/login" });
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginForm) => {
    const toastId = notify.loading("Signing in...");
    try {
      await login(values.email, values.password);
      toast.dismiss(toastId);
      notify.success("Welcome back!");
      await alertSuccess("Login successful", "Redirecting to your dashboard...");
      await navigate({ to: redirectTo });
    } catch (err) {
      toast.dismiss(toastId);
      const message = getApiErrorMessage(err, "Login failed");
      notify.error(message);
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
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground text-center">
            Sign in to your AgentPro account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="bg-white/5 border-white/10"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                to="/forgot-password"
                className="text-xs text-[oklch(0.82_0.14_200)] hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className="bg-white/5 border-white/10"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-brand text-primary-foreground border-0 shadow-glow"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link to="/register" search={{}} className="text-[oklch(0.82_0.14_200)] hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
