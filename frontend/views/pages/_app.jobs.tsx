import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Briefcase, DollarSign, Filter, Star, Zap, ChevronRight, CheckCircle2, AlertCircle, Sparkles, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/jobs")({
  component: JobDiscoveryPage,
});

const JOBS = [
  {
    id: "1",
    title: "Senior Frontend Engineer",
    company: "Vercel",
    location: "San Francisco, CA (Remote)",
    salary: "$160k - $210k",
    type: "Full-time",
    match: 94,
    atsScore: 88,
    requiredSkills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    missingSkills: ["GraphQL"],
    postedAt: "2 hours ago",
    description: "We are looking for a Senior Frontend Engineer to help build the future of the web...",
  },
  {
    id: "2",
    title: "Fullstack Developer",
    company: "Stripe",
    location: "Remote",
    salary: "$150k - $200k",
    type: "Full-time",
    match: 85,
    atsScore: 72,
    requiredSkills: ["React", "Node.js", "PostgreSQL", "TypeScript"],
    missingSkills: ["Ruby", "AWS"],
    postedAt: "5 hours ago",
    description: "Join Stripe to build economic infrastructure for the internet...",
  },
  {
    id: "3",
    title: "UI Engineer",
    company: "Linear",
    location: "New York, NY",
    salary: "$140k - $180k",
    type: "Full-time",
    match: 98,
    atsScore: 95,
    requiredSkills: ["React", "TypeScript", "Framer Motion", "CSS"],
    missingSkills: [],
    postedAt: "1 day ago",
    description: "Help us build the magical issue tracker that teams love...",
  }
];

function JobDiscoveryPage() {
  const [selectedJob, setSelectedJob] = useState<typeof JOBS[0] | null>(null);

  return (
    <div className="flex h-full gap-6">
      <div className="flex-1 flex flex-col min-w-0">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Job Discovery</h1>
          <p className="text-sm text-muted-foreground mt-1">AI matched roles based on your profile.</p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9 bg-white/5 border-white/10" placeholder="Job title, keywords, or company..." />
          </div>
          <div className="relative flex-1 sm:max-w-xs">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9 bg-white/5 border-white/10" placeholder="City, state, or Remote" />
          </div>
          <Button variant="outline" className="bg-white/5 border-white/10 shrink-0">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Badge variant="secondary" className="bg-white/10 hover:bg-white/15 cursor-pointer border-transparent">Remote Only</Badge>
          <Badge variant="secondary" className="bg-white/10 hover:bg-white/15 cursor-pointer border-transparent">Senior Level</Badge>
          <Badge variant="secondary" className="bg-white/10 hover:bg-white/15 cursor-pointer border-transparent">$150k+</Badge>
          <Badge variant="secondary" className="bg-[oklch(0.82_0.14_200)]/20 text-[oklch(0.82_0.14_200)] hover:bg-[oklch(0.82_0.14_200)]/30 border-transparent cursor-pointer">
            <Sparkles className="h-3 w-3 mr-1" />
            High Match (&gt;90%)
          </Badge>
        </div>

        {/* Job List */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          {JOBS.map((job) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setSelectedJob(job)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${selectedJob?.id === job.id ? "bg-white/10 border-white/20" : "glass hover:bg-white/5 border-white/5"}`}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-brand grid place-items-center text-primary-foreground font-bold text-lg shrink-0">
                    {job.company[0]}
                  </div>
                  <div>
                    <h3 className="font-medium text-lg leading-tight">{job.title}</h3>
                    <div className="text-muted-foreground text-sm mt-1">{job.company}</div>
                    
                    <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.location}</div>
                      <div className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" />{job.type}</div>
                      <div className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" />{job.salary}</div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant="outline" className={`border-transparent ${job.match >= 90 ? "bg-[oklch(0.82_0.14_200)]/20 text-[oklch(0.82_0.14_200)]" : "bg-white/10"}`}>
                    <Zap className="h-3 w-3 mr-1" />
                    {job.match}% Match
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">{job.postedAt}</span>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2">
                {job.requiredSkills.slice(0, 3).map(s => (
                  <Badge key={s} variant="secondary" className="bg-white/5 text-xs font-normal text-muted-foreground border-white/5">{s}</Badge>
                ))}
                {job.missingSkills.length > 0 && (
                  <Badge variant="secondary" className="bg-red-500/10 text-red-400 text-xs font-normal border-red-500/20">
                    Missing: {job.missingSkills[0]}
                  </Badge>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Side Panel Drawer equivalent */}
      <AnimatePresence>
        {selectedJob && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 420, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="hidden xl:flex flex-col shrink-0 glass-strong border border-white/10 rounded-2xl overflow-hidden"
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between sticky top-0 bg-background/50 backdrop-blur-md z-10">
              <h2 className="font-medium">Job Overview</h2>
              <Button variant="ghost" size="icon" onClick={() => setSelectedJob(null)} className="h-8 w-8 rounded-full hover:bg-white/10">
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 rounded-2xl bg-gradient-brand grid place-items-center text-primary-foreground font-bold text-2xl shrink-0">
                  {selectedJob.company[0]}
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{selectedJob.title}</h2>
                  <div className="text-muted-foreground">{selectedJob.company}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                  <div className="text-xs text-muted-foreground mb-1">ATS Score</div>
                  <div className="text-lg font-semibold flex items-center gap-2">
                    {selectedJob.atsScore}%
                    {selectedJob.atsScore > 80 ? <CheckCircle2 className="h-4 w-4 text-green-400" /> : <AlertCircle className="h-4 w-4 text-yellow-400" />}
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                  <div className="text-xs text-muted-foreground mb-1">AI Match</div>
                  <div className="text-lg font-semibold flex items-center gap-2 text-[oklch(0.82_0.14_200)]">
                    {selectedJob.match}%
                    <Sparkles className="h-4 w-4" />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <section>
                  <h3 className="font-medium mb-3 flex items-center gap-2"><Star className="h-4 w-4 text-yellow-400" /> AI Resume Suggestions</h3>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-muted-foreground space-y-2">
                    {selectedJob.missingSkills.length > 0 ? (
                      <p>Consider adding a side project that uses <strong>{selectedJob.missingSkills.join(", ")}</strong> to improve your ATS score by ~8%.</p>
                    ) : (
                      <p>Your resume is highly optimized for this role. Emphasize your recent achievements in <strong>{selectedJob.requiredSkills[0]}</strong>.</p>
                    )}
                  </div>
                </section>

                <section>
                  <h3 className="font-medium mb-3">About the Role</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedJob.description}
                    <br/><br/>
                    This is a placeholder for the full job description. In a real app, this would contain the complete text scraped from the original listing, formatted nicely.
                  </p>
                </section>
              </div>
            </div>

            <div className="p-4 border-t border-white/10 bg-background/50 backdrop-blur-md sticky bottom-0 grid grid-cols-2 gap-3">
              <Button variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10">Save</Button>
              <Button className="bg-gradient-brand text-primary-foreground border-0 shadow-glow hover:opacity-90">Auto Apply <Zap className="h-3 w-3 ml-1.5" /></Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
