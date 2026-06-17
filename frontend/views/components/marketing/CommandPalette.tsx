import { useEffect } from "react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { BarChart3, Bot, Home, Rocket, Settings, Sparkles } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

export function CommandPalette({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  const go = (to: string) => { setOpen(false); navigate({ to }); };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search anything…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigate">
          <CommandItem onSelect={() => go("/")}><Home className="mr-2 h-4 w-4" /> Home</CommandItem>
          <CommandItem onSelect={() => go("/dashboard")}><BarChart3 className="mr-2 h-4 w-4" /> Dashboard</CommandItem>
        </CommandGroup>
        <CommandGroup heading="Actions">
          <CommandItem><Sparkles className="mr-2 h-4 w-4" /> New prompt</CommandItem>
          <CommandItem><Bot className="mr-2 h-4 w-4" /> Create agent</CommandItem>
          <CommandItem><Rocket className="mr-2 h-4 w-4" /> Deploy pipeline</CommandItem>
          <CommandItem><Settings className="mr-2 h-4 w-4" /> Open settings</CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
