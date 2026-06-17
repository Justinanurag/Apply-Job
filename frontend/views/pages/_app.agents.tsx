import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, Play, Pause, Settings, Activity, Plus, FileText, MapPin, DollarSign, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/_app/agents")({
  component: AutoApplyAgentsPage,
});

const AGENTS = [
  {
    id: "linkedin",
    name: "LinkedIn Agent",
    status: "running",
    appliedToday: 14,
    dailyLimit: 20,
    roles: ["Frontend Engineer", "React Developer"],
    locations: ["Remote", "San Francisco"],
    salary: "$140k+",
    lastActive: "2 mins ago"
  },
  {
    id: "indeed",
    name: "Indeed Agent",
    status: "paused",
    appliedToday: 0,
    dailyLimit: 15,
    roles: ["Fullstack Developer"],
    locations: ["Remote"],
    salary: "$120k+",
    lastActive: "1 day ago"
  },
  {
    id: "wellfound",
    name: "Wellfound Agent",
    status: "running",
    appliedToday: 5,
    dailyLimit: 10,
    roles: ["UI Engineer", "Frontend Developer"],
    locations: ["Remote", "New York"],
    salary: "$130k+",
    lastActive: "1 hour ago"
  }
];

function AutoApplyAgentsPage() {
  const [agents, setAgents] = useState(AGENTS);

  const toggleAgent = (id: string) => {
    setAgents(agents.map(a => 
      a.id === id ? { ...a, status: a.status === "running" ? "paused" : "running" } : a
    ));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Auto Apply Agents</h1>
          <p className="text-sm text-muted-foreground mt-1">Configure your AI agents to automatically apply to jobs matching your criteria.</p>
        </div>
        <Button className="bg-gradient-brand text-primary-foreground border-0 shadow-glow shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          Create Custom Agent
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="glass rounded-xl p-5 border-white/5">
          <div className="text-sm text-muted-foreground mb-1">Total Auto Applies</div>
          <div className="text-3xl font-semibold">1,204</div>
        </div>
        <div className="glass rounded-xl p-5 border-white/5">
          <div className="text-sm text-muted-foreground mb-1">Active Agents</div>
          <div className="text-3xl font-semibold">2 <span className="text-sm text-muted-foreground font-normal">/ 5</span></div>
        </div>
        <div className="glass rounded-xl p-5 border-white/5">
          <div className="text-sm text-muted-foreground mb-1">Daily Limit Reached</div>
          <div className="text-3xl font-semibold">19 <span className="text-sm text-muted-foreground font-normal">/ 45</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {agents.map((agent, i) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`glass rounded-2xl p-6 border transition-all ${agent.status === 'running' ? 'border-[oklch(0.82_0.14_200)]/30' : 'border-white/5'}`}
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              
              {/* Agent Header */}
              <div className="flex items-start gap-4 md:w-1/3">
                <div className={`h-12 w-12 rounded-xl grid place-items-center shrink-0 ${agent.status === 'running' ? 'bg-gradient-brand text-primary-foreground shadow-glow' : 'bg-white/5 text-muted-foreground'}`}>
                  <Bot className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    {agent.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`inline-flex items-center gap-1.5 text-xs ${agent.status === 'running' ? 'text-[oklch(0.82_0.14_200)]' : 'text-muted-foreground'}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${agent.status === 'running' ? 'bg-[oklch(0.82_0.14_200)] animate-pulse' : 'bg-muted-foreground'}`} />
                      {agent.status === 'running' ? 'Active' : 'Paused'}
                    </span>
                    <span className="text-xs text-muted-foreground">• Last active: {agent.lastActive}</span>
                  </div>
                </div>
              </div>

              {/* Agent Stats */}
              <div className="flex-1 grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                  <div className="text-xs text-muted-foreground mb-1">Applied Today</div>
                  <div className="font-medium">{agent.appliedToday} / {agent.dailyLimit}</div>
                  <div className="w-full bg-white/10 h-1 mt-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-brand h-full rounded-full" 
                      style={{ width: `${(agent.appliedToday / agent.dailyLimit) * 100}%` }}
                    />
                  </div>
                </div>
                
                {/* Configuration Summary */}
                <div className="bg-white/5 rounded-xl p-3 border border-white/5 text-xs text-muted-foreground space-y-1.5 flex flex-col justify-center">
                  <div className="flex items-center gap-2"><Target className="h-3 w-3 shrink-0" /> <span className="truncate">{agent.roles.join(", ")}</span></div>
                  <div className="flex items-center gap-2"><MapPin className="h-3 w-3 shrink-0" /> <span className="truncate">{agent.locations.join(", ")}</span></div>
                  <div className="flex items-center gap-2"><DollarSign className="h-3 w-3 shrink-0" /> <span className="truncate">{agent.salary}</span></div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex md:flex-col justify-end gap-2 md:w-32 shrink-0">
                <Button 
                  onClick={() => toggleAgent(agent.id)}
                  variant={agent.status === 'running' ? "outline" : "default"}
                  className={agent.status === 'running' ? "bg-white/5 border-white/10 w-full" : "bg-white text-black hover:bg-white/90 w-full"}
                >
                  {agent.status === 'running' ? <><Pause className="h-4 w-4 mr-2" /> Pause</> : <><Play className="h-4 w-4 mr-2" /> Start</>}
                </Button>
                <Button variant="ghost" className="bg-white/5 border border-white/5 hover:bg-white/10 w-full">
                  <Settings className="h-4 w-4 mr-2" /> Config
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
