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
import { JOB_ROLE_PRESETS, JOB_SOURCE_OPTIONS } from "@/lib/constants/jobFilters";

export interface JobFiltersState {
  keyword: string;
  location: string;
  source: string;
}

interface JobFiltersProps {
  filters: JobFiltersState;
  onChange: (filters: JobFiltersState) => void;
  resultCount?: number;
}

export function JobFilters({ filters, onChange, resultCount }: JobFiltersProps) {
  const hasActiveFilters =
    Boolean(filters.keyword.trim()) ||
    Boolean(filters.location.trim()) ||
    filters.source !== "all";

  const setKeyword = (keyword: string) => onChange({ ...filters, keyword });
  const setLocation = (location: string) => onChange({ ...filters, location });
  const setSource = (source: string) => onChange({ ...filters, source });

  const clearFilters = () => {
    onChange({ keyword: "", location: "", source: "all" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-base font-semibold">
          <Filter className="h-5 w-5 text-muted-foreground" />
          Filters
        </div>
        {typeof resultCount === "number" && (
          <Badge variant="secondary" className="bg-white/5 border-white/10 font-normal">
            {resultCount} matching
          </Badge>
        )}
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Search Jobs</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9 bg-white/5 border-white/10 w-full"
              placeholder="e.g. React, Developer..."
              value={filters.keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9 bg-white/5 border-white/10 w-full"
              placeholder="e.g. Remote, India..."
              value={filters.location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Source</label>
          <Select value={filters.source} onValueChange={setSource}>
            <SelectTrigger className="w-full bg-white/5 border-white/10">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              {JOB_SOURCE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {hasActiveFilters && (
          <Button
            variant="outline"
            className="w-full bg-white/5 border-white/10 hover:bg-white/10 transition-colors mt-2"
            onClick={clearFilters}
          >
            <X className="h-4 w-4 mr-2" />
            Clear All Filters
          </Button>
        )}
      </div>

      <div className="space-y-3 pt-4 border-t border-white/10">
        <p className="text-sm font-medium text-muted-foreground">Popular Roles</p>
        <div className="flex flex-wrap gap-2">
          {JOB_ROLE_PRESETS.map((role) => {
            const active = filters.keyword.toLowerCase() === role.toLowerCase();
            return (
              <Badge
                key={role}
                variant={active ? "default" : "secondary"}
                className={`cursor-pointer transition-all ${
                  active
                    ? "bg-gradient-brand text-primary-foreground border-0 shadow-md scale-105"
                    : "bg-white/5 hover:bg-white/10 border-white/5 font-normal text-muted-foreground"
                }`}
                onClick={() => setKeyword(active ? "" : role)}
              >
                {role}
              </Badge>
            );
          })}
        </div>
      </div>
    </div>
  );
}
