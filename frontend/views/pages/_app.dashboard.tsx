import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Activity, LayoutGrid, Zap, CheckCircle, Clock, Calendar } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/controllers/useAuth";

export const Route = createFileRoute("/_app/dashboard")({
  component: DashboardPage,
});

const applicationsData = Array.from({ length: 14 }).map((_, i) => ({
  day: `D${i + 1}`,
  applications: Math.round(5 + Math.sin(i / 2) * 5 + Math.random() * 8),
}));

const platformBreakdown = ["LinkedIn", "Indeed", "Glassdoor", "Wellfound", "Direct"].map((n) => ({
  name: n, value: Math.round(10 + Math.random() * 40),
}));

function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Welcome back, {firstName}</h1>
          <p className="text-sm text-muted-foreground">Here's your job search progress today.</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="bg-white/5 border border-white/10">Last 14 days</Badge>
        </div>
      </motion.div>

      {/* Analytics cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Jobs Found Today", value: "142", trend: "+12", icon: Zap },
          { label: "Applications Sent", value: "34", trend: "+8", icon: CheckCircle },
          { label: "Interviews Scheduled", value: "3", trend: "+1", icon: Calendar },
          { label: "ATS Score Avg", value: "88%", trend: "+5%", icon: Activity },
        ].map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl glass p-5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">{k.label}</span>
              <span className="h-8 w-8 rounded-lg bg-gradient-brand grid place-items-center text-primary-foreground"><k.icon className="h-4 w-4" /></span>
            </div>
            <div className="mt-3 text-2xl font-semibold">{k.value}</div>
            <div className="text-xs text-[oklch(0.82_0.14_200)]">{k.trend} vs last week</div>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl glass p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Applications Over Time</div>
              <p className="text-xs text-muted-foreground">Volume of sent applications</p>
            </div>
            <Badge variant="secondary" className="bg-white/5 border border-white/10">14d</Badge>
          </div>
          <div className="mt-3 h-64">
            <ResponsiveContainer>
              <AreaChart data={applicationsData}>
                <defs>
                  <linearGradient id="dg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.72 0.20 295)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="oklch(0.72 0.20 295)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" />
                <XAxis dataKey="day" stroke="oklch(1 0 0 / 30%)" fontSize={11} />
                <YAxis stroke="oklch(1 0 0 / 30%)" fontSize={11} />
                <Tooltip contentStyle={{ background: "oklch(0.18 0.03 270)", border: "1px solid oklch(1 0 0 / 10%)", borderRadius: 12 }} />
                <Area type="monotone" dataKey="applications" stroke="oklch(0.82 0.14 200)" strokeWidth={2} fill="url(#dg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl glass p-5">
          <div className="font-medium">Platform Breakdown</div>
          <p className="text-xs text-muted-foreground">Applications by source</p>
          <div className="mt-3 h-64">
            <ResponsiveContainer>
              <BarChart data={platformBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" />
                <XAxis dataKey="name" stroke="oklch(1 0 0 / 30%)" fontSize={10} />
                <YAxis stroke="oklch(1 0 0 / 30%)" fontSize={10} />
                <Tooltip contentStyle={{ background: "oklch(0.18 0.03 270)", border: "1px solid oklch(1 0 0 / 10%)", borderRadius: 12 }} />
                <Bar dataKey="value" fill="oklch(0.72 0.20 295)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Projects + activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl glass p-5">
          <div className="flex items-center justify-between">
            <div className="font-medium flex items-center gap-2"><LayoutGrid className="h-4 w-4" /> Auto Apply Agents Status</div>
            <Button size="sm" variant="ghost">View all</Button>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { name: "LinkedIn Agent", desc: "Target: Frontend React roles", applied: "142", status: "Running" },
              { name: "Indeed Agent", desc: "Target: Fullstack Next.js", applied: "84", status: "Running" },
              { name: "Wellfound Agent", desc: "Target: Startup roles", applied: "32", status: "Paused" },
              { name: "Glassdoor Agent", desc: "Target: Remote UI/UX", applied: "0", status: "Configuring" },
            ].map((p) => (
              <div key={p.name} className="group rounded-xl border border-white/5 bg-white/[0.03] p-4 hover:border-white/15 transition">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <p className="text-xs text-muted-foreground mt-0.5">{p.desc}</p>
                  </div>
                  <Badge variant="secondary" className="bg-white/5 border border-white/10 text-[10px]">{p.status}</Badge>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{p.applied} applied</span>
                  <span className="opacity-0 group-hover:opacity-100 transition text-[oklch(0.82_0.14_200)]">Manage →</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl glass p-5">
          <div className="font-medium flex items-center gap-2"><Activity className="h-4 w-4" /> Recent Activity Feed</div>
          <div className="mt-4 space-y-4">
            {[
              { title: "Interview Scheduled", desc: "Frontend Engineer at Vercel", time: "10m" },
              { title: "Application Sent", desc: "React Developer at Stripe", time: "1h" },
              { title: "Agent Started", desc: "LinkedIn Agent resumed", time: "2h" },
              { title: "Resume Optimized", desc: "Updated for Next.js roles", time: "5h" },
              { title: "Application Viewed", desc: "UI Engineer at Linear", time: "1d" },
            ].map((a, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <div className="relative">
                  <div className="h-8 w-8 rounded-full bg-gradient-brand grid place-items-center text-primary-foreground"><Clock className="h-3.5 w-3.5" /></div>
                  {i < 4 && <div className="absolute left-1/2 top-8 h-6 w-px bg-white/10 -translate-x-1/2" />}
                </div>
                <div>
                  <p><span className="font-medium">{a.title}</span></p>
                  <p className="text-xs text-muted-foreground">{a.desc}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{a.time} ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
