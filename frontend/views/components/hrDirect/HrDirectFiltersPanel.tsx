import { Filter, MapPin, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import type { HrDirectFilters } from "@/lib/types/hrDirectJob";

interface HrDirectFiltersPanelProps {
  filters: Required<Pick<HrDirectFilters, "search" | "location" | "source" | "workMode" | "experience">> & {
    minMatchScore: number;
  };
  onChange: (filters: HrDirectFiltersPanelProps["filters"]) => void;
  resultCount?: number;
}

export function HrDirectFiltersPanel({ filters, onChange, resultCount }: HrDirectFiltersPanelProps) {
  const hasActive =
    Boolean(filters.search?.trim()) ||
    Boolean(filters.location?.trim()) ||
    filters.source !== "all" ||
    filters.workMode !== "all" ||
    Boolean(filters.experience?.trim()) ||
    filters.minMatchScore > 0;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Filter className="h-4 w-4 text-muted-foreground" />
          Filters
        </div>
        {typeof resultCount === "number" && (
          <Badge variant="secondary" className="bg-white/5 border-white/10 font-normal">
            {resultCount} jobs
          </Badge>
        )}
      </div>

      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9 bg-white/5 border-white/10"
            placeholder="Keyword..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
          />
        </div>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9 bg-white/5 border-white/10"
            placeholder="Location..."
            value={filters.location}
            onChange={(e) => onChange({ ...filters, location: e.target.value })}
          />
        </div>
        <Input
          className="bg-white/5 border-white/10"
          placeholder="Experience e.g. 3-5 years"
          value={filters.experience}
          onChange={(e) => onChange({ ...filters, experience: e.target.value })}
        />
        <Select
          value={filters.workMode}
          onValueChange={(workMode: "all" | "remote" | "onsite" | "hybrid") =>
            onChange({ ...filters, workMode })
          }
        >
          <SelectTrigger className="bg-white/5 border-white/10">
            <SelectValue placeholder="Work mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All modes</SelectItem>
            <SelectItem value="remote">Remote</SelectItem>
            <SelectItem value="onsite">Onsite</SelectItem>
            <SelectItem value="hybrid">Hybrid</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.source}
          onValueChange={(source) => onChange({ ...filters, source })}
        >
          <SelectTrigger className="bg-white/5 border-white/10">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sources</SelectItem>
            <SelectItem value="linkedin">LinkedIn</SelectItem>
            <SelectItem value="naukri">Naukri</SelectItem>
            <SelectItem value="indeed">Indeed</SelectItem>
          </SelectContent>
        </Select>

        <div className="space-y-2 pt-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Min match score</span>
            <span>{filters.minMatchScore}%</span>
          </div>
          <Slider
            value={[filters.minMatchScore]}
            onValueChange={([v]) => onChange({ ...filters, minMatchScore: v })}
            max={100}
            step={5}
          />
        </div>

        {hasActive && (
          <Button
            variant="outline"
            className="w-full border-white/10 bg-white/5"
            onClick={() =>
              onChange({
                search: "",
                location: "",
                source: "all",
                workMode: "all",
                experience: "",
                minMatchScore: 0,
              })
            }
          >
            <X className="h-4 w-4 mr-2" />
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}
