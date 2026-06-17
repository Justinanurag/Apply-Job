import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardPreview } from "./DashboardPreview";
import { Counter } from "./Counter";

const brands = ["Northwind", "Acme", "Stark", "Initech", "Hooli", "Umbrella", "Wayne"];

export function Hero() {
  return (
    <section className="relative pt-36 pb-24 md:pt-44 md:pb-28">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs text-muted-foreground">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-[oklch(0.82_0.14_200)] animate-pulse" />
            <Sparkles className="h-3.5 w-3.5 text-[oklch(0.82_0.14_200)]" />
            Introducing AgentPro 2.0 — built for modern job seekers
          </div>

          <h1 className="mt-6 text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05]">
            Your Personal AI
            <br />
            <span className="text-gradient">Job Search Agent</span>
          </h1>

          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Automatically discover jobs, optimize your resume, generate personalized cover letters, and let AI apply while you sleep.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/login" search={{ redirect: "/dashboard" }}>
              <Button size="lg" className="bg-gradient-brand text-primary-foreground border-0 shadow-glow hover:opacity-90 h-12 px-6">
                Start building free
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="h-12 px-6 border-white/10 bg-white/5 hover:bg-white/10">
              <Play className="mr-1 h-4 w-4" /> Watch demo
            </Button>
          </div>
        </motion.div>

        {/* Floating preview */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
          className="relative mt-16 md:mt-20"
        >
          <div className="pointer-events-none absolute inset-x-10 -top-10 h-40 bg-gradient-brand opacity-30 blur-3xl rounded-full" />
          <div className="animate-float-slow">
            <DashboardPreview />
          </div>
        </motion.div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Jobs Analyzed", value: 4_200_000, suffix: "+" },
            { label: "Users Hired", value: 12450 },
            { label: "Time Saved/Week", value: 40, suffix: "h" },
            { label: "Interview Rate", value: 3.5, suffix: "x" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-2xl p-5 text-center">
              <div className="text-2xl md:text-3xl font-semibold text-gradient">
                <Counter to={s.value} />{s.suffix ?? ""}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Trusted by */}
        <div className="mt-16">
          <div className="text-center text-xs uppercase tracking-widest text-muted-foreground">
            Trusted by candidates hired at
          </div>
          <div className="relative mt-6 overflow-hidden mask-fade">
            <div className="flex gap-12 animate-marquee whitespace-nowrap">
              {[...brands, ...brands].map((b, i) => (
                <span key={i} className="text-xl md:text-2xl font-semibold text-muted-foreground/60 hover:text-foreground transition">
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
