import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
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

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export const Route = createFileRoute("/register")({
  beforeLoad: async () => {
    const user = await ensureAuthenticated();
    if (user) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = async (values: RegisterForm) => {
    const toastId = notify.loading("Creating your account...");
    try {
      await registerUser(values.name, values.email, values.password);
      toast.dismiss(toastId);
      notify.success("Account created successfully!");
      await alertSuccess("Welcome to AgentPro!", "You can now sign in with your new account.");
      await navigate({ to: "/login", search: { redirect: "/dashboard" } });
    } catch (err) {
      toast.dismiss(toastId);
      notify.error(getApiErrorMessage(err, "Registration failed"));
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
          <h1 className="text-2xl font-semibold tracking-tight">Create account</h1>
          <p className="text-sm text-muted-foreground text-center">
            Start your AI-powered job search journey
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              autoComplete="name"
              placeholder="John Doe"
              className="bg-white/5 border-white/10"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

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
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
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
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" search={{ redirect: "/dashboard" }} className="text-[oklch(0.82_0.14_200)] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
