import { motion } from "framer-motion";
import { Activity, BarChart3, Bot, Folder, Home, Search, Send, Settings, Sparkles, Zap } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

const sparkData = Array.from({ length: 24 }).map((_, i) => ({
  v: 30 + Math.sin(i / 2) * 20 + Math.random() * 18,
}));

const messages = [
  { role: "user", text: "Summarize last week's user signups and suggest 3 retention experiments." },
  { role: "ai", text: "Signups grew 18.4% WoW, peaking Wednesday. Three experiments to try:" },
];

export function DashboardPreview() {
  return (
    <div className="relative rounded-3xl glass-strong glow-border overflow-hidden shadow-elegant">
      {/* Top bar */}
      <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-red-500/70" />
        <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
        <span className="h-3 w-3 rounded-full bg-green-500/70" />
        <div className="ml-3 flex items-center gap-2 rounded-md bg-white/5 px-3 py-1 text-xs text-muted-foreground w-72 max-w-[40%]">
          <Search className="h-3 w-3" /> app.lumenai.dev / workspace
        </div>
      </div>

      <div className="grid grid-cols-12 min-h-[460px]">
        {/* Sidebar */}
        <aside className="col-span-2 hidden md:flex flex-col border-r border-white/5 p-3 gap-1">
          {[
            { icon: Home, label: "Home", active: true },
            { icon: Bot, label: "Agents" },
            { icon: Folder, label: "Projects" },
            { icon: BarChart3, label: "Analytics" },
            { icon: Activity, label: "Activity" },
            { icon: Settings, label: "Settings" },
          ].map((i) => (
            <button
              key={i.label}
              className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition ${
                i.active ? "bg-white/10 text-foreground" : "text-muted-foreground hover:bg-white/5"
              }`}
            >
              <i.icon className="h-3.5 w-3.5" />
              {i.label}
            </button>
          ))}
        </aside>

        {/* Main */}
        <div className="col-span-12 md:col-span-7 p-5 space-y-4">
          {/* KPI cards */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Requests", value: "184.2k", trend: "+12.4%" },
              { label: "Latency", value: "284ms", trend: "-8.1%" },
              { label: "Success", value: "99.7%", trend: "+0.2%" },
            ].map((k) => (
              <div key={k.label} className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k.label}</div>
                <div className="mt-1 text-lg font-semibold">{k.value}</div>
                <div className="text-[10px] text-[oklch(0.82_0.14_200)]">{k.trend}</div>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium">Throughput</div>
              <span className="text-[10px] text-muted-foreground">Last 24h</span>
            </div>
            <div className="h-28">
              <ResponsiveContainer>
                <AreaChart data={sparkData}>
                  <defs>
                    <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.72 0.20 295)" stopOpacity={0.7} />
                      <stop offset="100%" stopColor="oklch(0.72 0.20 295)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="v" stroke="oklch(0.82 0.14 200)" strokeWidth={2} fill="url(#hg)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chat */}
          <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3 space-y-2">
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.3 }}
                className={`flex gap-2 text-xs ${m.role === "user" ? "" : "text-muted-foreground"}`}
              >
                <span className={`h-5 w-5 rounded-md flex items-center justify-center text-[10px] ${m.role === "user" ? "bg-white/10" : "bg-gradient-brand"}`}>
                  {m.role === "user" ? "U" : <Sparkles className="h-3 w-3" />}
                </span>
                <p className="leading-relaxed">{m.text}</p>
              </motion.div>
            ))}
            <div className="flex gap-2 text-xs text-muted-foreground">
              <span className="h-5 w-5 rounded-md bg-gradient-brand flex items-center justify-center"><Sparkles className="h-3 w-3" /></span>
              <span className="inline-flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-foreground/70 animate-bounce" />
                <span className="h-1.5 w-1.5 rounded-full bg-foreground/70 animate-bounce [animation-delay:120ms]" />
                <span className="h-1.5 w-1.5 rounded-full bg-foreground/70 animate-bounce [animation-delay:240ms]" />
              </span>
            </div>
            <div className="mt-2 flex items-center gap-2 rounded-lg border border-white/10 bg-background/40 px-2 py-1.5">
              <Zap className="h-3.5 w-3.5 text-[oklch(0.82_0.14_200)]" />
              <input
                className="flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground"
                placeholder="Ask LumenAI anything..."
                readOnly
              />
              <button className="rounded-md bg-gradient-brand p-1.5"><Send className="h-3 w-3 text-primary-foreground" /></button>
            </div>
          </div>
        </div>

        {/* Activity */}
        <div className="col-span-12 md:col-span-3 border-l border-white/5 p-4 space-y-3">
          <div className="text-xs font-medium">Live activity</div>
          {[
            { who: "Maya", what: "deployed pipeline v12", time: "2s" },
            { who: "Jordan", what: "ran retention prompt", time: "14s" },
            { who: "Eli", what: "invited 3 members", time: "1m" },
            { who: "Ava", what: "trained model finetune", time: "3m" },
            { who: "Kai", what: "exported analytics", time: "6m" },
          ].map((a, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              className="flex items-start gap-2 text-[11px]"
            >
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[oklch(0.82_0.14_200)]" />
              <div className="flex-1">
                <p><span className="font-medium">{a.who}</span> <span className="text-muted-foreground">{a.what}</span></p>
                <p className="text-muted-foreground/70">{a.time} ago</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
