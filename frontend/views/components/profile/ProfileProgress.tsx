import { Progress } from "@/components/ui/progress";

interface ProfileProgressProps {
  percent: number;
}

export function ProfileProgress({ percent }: ProfileProgressProps) {
  return (
    <div className="rounded-xl glass border border-white/10 p-4 space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">Profile Completion</span>
        <span className="text-[oklch(0.82_0.14_200)] font-semibold">{percent}% Complete</span>
      </div>
      <Progress value={percent} className="h-2" />
    </div>
  );
}
