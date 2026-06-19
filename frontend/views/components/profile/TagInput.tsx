import { useState, KeyboardEvent, FocusEvent } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TagInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  suggestions?: readonly string[];
  className?: string;
}

export function TagInput({
  value,
  onChange,
  placeholder = "Type and press Enter",
  suggestions = [],
  className,
}: TagInputProps) {
  const [input, setInput] = useState("");

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed || value.includes(trimmed)) return;
    onChange([...value, trimmed]);
    setInput("");
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  const flushInput = () => {
    if (input.trim()) addTag(input);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    }
    if (e.key === "Backspace" && !input && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const onBlur = (_e: FocusEvent<HTMLInputElement>) => {
    flushInput();
  };

  const unusedSuggestions = suggestions.filter((s) => !value.includes(s));

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap gap-2 min-h-[42px] rounded-xl border border-white/10 bg-white/5 px-3 py-2">
        {value.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="bg-white/10 border-white/10 gap-1 pr-1"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="rounded-full hover:bg-white/10 p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
          placeholder={value.length === 0 ? placeholder : "Add more…"}
          className="flex-1 min-w-[120px] border-0 bg-transparent shadow-none focus-visible:ring-0 h-7 px-0"
        />
      </div>
      <p className="text-[11px] text-muted-foreground">Press Enter or comma to add a tag</p>
      {unusedSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {unusedSuggestions.slice(0, 8).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => addTag(s)}
              className="text-xs rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-muted-foreground hover:bg-white/10 hover:text-foreground transition"
            >
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
