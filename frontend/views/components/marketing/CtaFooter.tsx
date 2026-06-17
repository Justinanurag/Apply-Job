import { Link } from "@tanstack/react-router";
import { ArrowRight, Github, Linkedin, Sparkles, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaFooter() {
  return (
    <section className="relative pb-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="relative overflow-hidden rounded-3xl glass-strong glow-border p-10 md:p-16 text-center shadow-elegant">
          <div className="absolute inset-0 bg-gradient-brand opacity-20" />
          <div className="absolute -inset-20 bg-radial-brand opacity-60" />
          <div className="relative">
            <h2 className="text-4xl md:text-6xl font-semibold tracking-tight">
              Build the future, <span className="text-gradient">today</span>.
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Join thousands of teams shipping AI products with LumenAI.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link to="/login" search={{ redirect: "/dashboard" }}>
                <Button size="lg" className="bg-gradient-brand text-primary-foreground border-0 shadow-glow h-12 px-6">
                  Get started free <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-12 px-6 bg-white/5 border-white/10 hover:bg-white/10">
                Book a demo
              </Button>
            </div>
          </div>
        </div>

        <footer className="mt-16 grid grid-cols-2 md:grid-cols-5 gap-8 text-sm">
          <div className="col-span-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-brand shadow-glow">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </span>
              <span className="font-semibold">Lumen<span className="text-gradient">AI</span></span>
            </div>
            <p className="mt-3 text-muted-foreground max-w-xs">The AI workspace built for product teams. Made with care.</p>
            <div className="mt-4 flex gap-2">
              {[Twitter, Github, Linkedin].map((I, i) => (
                <a key={i} href="#" className="h-9 w-9 grid place-items-center rounded-lg glass hover:bg-white/10 transition">
                  <I className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          {[
            { title: "Product", links: ["Features", "Pricing", "Changelog", "Docs"] },
            { title: "Company", links: ["About", "Customers", "Careers", "Blog"] },
            { title: "Legal", links: ["Privacy", "Terms", "Security", "DPA"] },
          ].map((c) => (
            <div key={c.title}>
              <div className="font-medium">{c.title}</div>
              <ul className="mt-3 space-y-2 text-muted-foreground">
                {c.links.map((l) => <li key={l}><a href="#" className="hover:text-foreground">{l}</a></li>)}
              </ul>
            </div>
          ))}
        </footer>
        <div className="mt-10 border-t border-white/5 pt-6 text-xs text-muted-foreground flex flex-wrap items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} LumenAI Inc. All rights reserved.</p>
          <p>Crafted with intention.</p>
        </div>
      </div>
    </section>
  );
}
