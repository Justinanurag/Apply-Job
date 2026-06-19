import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface JobPageHeaderProps {
  onProfileMatch: () => void;
  isProfileMatching?: boolean;
}

export function JobPageHeader({ onProfileMatch, isProfileMatching }: JobPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-5">
      <div className="min-w-0">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Discover Jobs</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Find and manage your next opportunity.
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="w-full sm:w-auto shrink-0 border-white/15 bg-white/5 hover:bg-white/10 h-10 px-4"
        onClick={onProfileMatch}
        disabled={isProfileMatching}
      >
        {isProfileMatching ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Sparkles className="h-4 w-4 mr-2 text-primary" />
        )}
        Profile Match
      </Button>
    </div>
  );
}
