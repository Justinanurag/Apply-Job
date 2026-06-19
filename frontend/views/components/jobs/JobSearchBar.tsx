import { Loader2, MapPin, RefreshCw, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface JobSearchBarProps {
  keyword: string;
  location: string;
  onKeywordChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onSearch: () => void;
  onRefresh: () => void;
  isSearching?: boolean;
  isRefreshing?: boolean;
}

export function JobSearchBar({
  keyword,
  location,
  onKeywordChange,
  onLocationChange,
  onSearch,
  onRefresh,
  isSearching,
  isRefreshing,
}: JobSearchBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") onSearch();
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] shadow-sm backdrop-blur-sm overflow-hidden">
      {/* Mobile: stacked fields with clear input boxes */}
      <div className="flex flex-col gap-3 p-3 md:hidden">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            className="h-11 pl-10 bg-white/5 border-white/10 rounded-xl"
            placeholder="Job title or keyword"
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="relative">
          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            className="h-11 pl-10 bg-white/5 border-white/10 rounded-xl"
            placeholder="Location"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="flex gap-2">
          <Button
            className="flex-1 h-11 bg-gradient-brand text-primary-foreground border-0 shadow-md hover:opacity-90"
            onClick={onSearch}
            disabled={isSearching}
          >
            {isSearching ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            Find Jobs
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-11 w-11 shrink-0 border-white/10 bg-white/5"
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh jobs"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Desktop / tablet: single horizontal bar */}
      <div className="hidden md:flex items-center gap-1 p-2">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            className="h-11 pl-10 pr-4 bg-transparent border-0 shadow-none focus-visible:ring-0 rounded-xl"
            placeholder="Job title or keyword"
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="w-px h-8 bg-white/10 shrink-0" aria-hidden />

        <div className="relative w-[200px] lg:w-[240px] shrink-0">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            className="h-11 pl-10 pr-4 bg-transparent border-0 shadow-none focus-visible:ring-0 rounded-xl"
            placeholder="Location"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="flex items-center gap-2 pl-1 shrink-0">
          <Button
            className="h-11 px-6 bg-gradient-brand text-primary-foreground border-0 shadow-md hover:opacity-90 whitespace-nowrap"
            onClick={onSearch}
            disabled={isSearching}
          >
            {isSearching ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            Find Jobs
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11 hover:bg-white/10"
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh jobs"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>
    </div>
  );
}
