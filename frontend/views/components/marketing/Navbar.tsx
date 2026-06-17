import { Link } from "@tanstack/react-router";
import { Menu, Search, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { label: "Features", href: "#features" },
  { label: "Workflow", href: "#workflow" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar({ onOpenCmd }: { onOpenCmd: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4">
        <div
          className={`flex items-center justify-between rounded-2xl border px-4 py-2.5 transition-all duration-500 ${
            scrolled ? "glass-strong shadow-elegant" : "border-transparent"
          }`}
        >
          <Link to="/" className="flex items-center gap-2 group">
            <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-brand shadow-glow">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </span>
            <span className="text-base font-semibold tracking-tight">Lumen<span className="text-gradient">AI</span></span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-white/5"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCmd}
              className="hidden sm:flex items-center gap-2 rounded-lg border border-border/60 bg-white/5 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-white/10 transition"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Quick search</span>
              <kbd className="ml-2 rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-mono">⌘K</kbd>
            </button>
            <Link to="/login" search={{ redirect: "/dashboard" }} className="hidden md:inline-flex">
              <Button variant="ghost" size="sm">Dashboard</Button>
            </Link>
            <Link to="/login" search={{ redirect: "/dashboard" }}>
              <Button size="sm" className="bg-gradient-brand text-primary-foreground border-0 shadow-glow hover:opacity-90">
                Get started
              </Button>
            </Link>
            <button className="md:hidden p-2 rounded-lg hover:bg-white/5" onClick={() => setOpen((v) => !v)} aria-label="Menu">
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden mt-2 rounded-2xl glass-strong p-3"
            >
              {links.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-white/5 text-sm">
                  {l.label}
                </a>
              ))}
              <Link to="/login" search={{ redirect: "/dashboard" }} className="block px-3 py-2 rounded-lg hover:bg-white/5 text-sm">
                Get started
              </Link>
              <Link to="/login" search={{ redirect: "/dashboard" }} className="block px-3 py-2 rounded-lg hover:bg-white/5 text-sm">
                Sign in
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
