import { createFileRoute, Link, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Activity, Bell, Bot, ChevronDown, FileText, Home,
  LineChart as LineIcon, LogOut, PanelLeftClose, PanelLeft, Plus, Search, Settings, Sparkles, FileSignature, Mail, CheckSquare, MessageSquare, Files, X, Send, Menu
} from "lucide-react";
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BackgroundFx } from "@/components/marketing/BackgroundFx";
import { CommandPalette } from "@/components/marketing/CommandPalette";
import { motion, AnimatePresence } from "framer-motion";
import { ensureAuthenticated } from "@/lib/auth/authApi";
import { ensureProfileComplete } from "@/lib/api/profile";
import { useAuth } from "@/controllers/useAuth";
import { confirmAction, notify } from "@/lib/alerts";

export const Route = createFileRoute("/_app")({
  beforeLoad: async ({ location }) => {
    const user = await ensureAuthenticated();
    if (!user) {
      throw redirect({
        to: "/login",
        search: { redirect: location.pathname },
      });
    }

    const profileStatus = await ensureProfileComplete();
    if (!profileStatus.canAccessDashboard) {
      throw redirect({ to: "/profile/setup" });
    }

    return { user };
  },
  component: AppLayout,
});

const sidebarItems = [
  { icon: Home, label: "Dashboard", path: "/dashboard" },
  { icon: Search, label: "Job Discovery", path: "/jobs" },
  { icon: FileText, label: "AI Resume Studio", path: "/resume" },
  { icon: FileSignature, label: "Cover Letters", path: "/cover-letters" },
  { icon: Bot, label: "Auto Apply Agents", path: "/agents" },
  { icon: Mail, label: "HR Direct Apply", path: "/hr-direct-jobs" },
  { icon: CheckSquare, label: "Applications", path: "/applications" },
  { icon: MessageSquare, label: "Interviews", path: "/interviews" },
  { icon: LineIcon, label: "Analytics", path: "/analytics" },
  { icon: Files, label: "Documents", path: "/documents" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(false);

  const handleLogout = async () => {
    const confirmed = await confirmAction("Log out?", "You will need to sign in again to continue.");
    if (!confirmed) return;

    const toastId = notify.loading("Logging out...");
    try {
      await logout();
      notify.dismiss(toastId);
      notify.success("Logged out successfully");
      await navigate({ to: "/login", search: { redirect: "/dashboard" } });
    } catch {
      notify.dismiss(toastId);
      notify.error("Logout failed");
    }
  };

  const userInitial = user?.name?.charAt(0).toUpperCase() ?? "?";

  return (
    <div className="dark relative min-h-screen text-foreground bg-background overflow-x-hidden">
      <BackgroundFx />

      <SidebarProvider>
        <Sidebar className="border-r border-white/5 glass-strong">
          <SidebarHeader className="py-4 px-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-brand shadow-glow shrink-0">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </span>
              <span className="font-semibold tracking-tight text-lg">
                Agent<span className="text-gradient">Pro</span>
              </span>
            </div>
          </SidebarHeader>
          <SidebarContent className="px-2 py-4">
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.path}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition text-muted-foreground hover:bg-white/5 hover:text-foreground [&.active]:bg-white/10 [&.active]:text-foreground"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="flex-1 min-w-0 flex flex-col h-screen bg-transparent">
          {/* Topbar */}
          <header className="sticky top-0 z-40 glass-strong border-b border-white/5 px-4 md:px-6 py-3 flex items-center gap-3">
            <SidebarTrigger className="shrink-0 md:hidden" />
            <Link to="/" className="hidden sm:flex md:hidden inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-brand shrink-0">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </Link>
            <button
              onClick={() => setCmdOpen(true)}
              className="flex flex-1 max-w-md items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-muted-foreground hover:bg-white/10 transition"
            >
              <Search className="h-4 w-4" />
              <span>Search jobs, resumes, applications…</span>
              <kbd className="ml-auto rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-mono">⌘K</kbd>
            </button>
            <div className="ml-auto flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-xl"><Bell className="h-4 w-4" /></Button>
              <Button className="bg-gradient-brand text-primary-foreground border-0 shadow-glow hidden sm:flex"><Plus className="mr-1 h-4 w-4" />New Application</Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl"
                onClick={() => void handleLogout()}
                title="Log out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
              <div className="h-9 w-9 rounded-full bg-gradient-brand grid place-items-center text-sm font-semibold text-primary-foreground" title={user?.email}>{userInitial}</div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 relative">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>

      {/* Global AI Copilot Toggle */}
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setCopilotOpen(!copilotOpen)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-brand text-primary-foreground shadow-glow grid place-items-center z-50 hover:opacity-90"
      >
        <Sparkles className="h-6 w-6" />
      </motion.button>

      {/* Global AI Copilot Panel */}
      <AnimatePresence>
        {copilotOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] glass-strong border border-white/10 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gradient-brand grid place-items-center text-primary-foreground">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">AgentPro Copilot</h3>
                  <p className="text-[10px] text-[oklch(0.82_0.14_200)]">Online</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setCopilotOpen(false)} className="h-8 w-8 rounded-full hover:bg-white/10">
                <X className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
              <div className="bg-white/10 p-3 rounded-2xl rounded-tl-sm w-[85%] self-start text-sm">
                Hi Maya! I'm your AI job search assistant. I can help you review your resume, match you with jobs, or prepare for interviews. What would you like to do?
              </div>
              
              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-white/5 border-white/10 cursor-pointer hover:bg-white/10">Review Resume</Badge>
                <Badge variant="outline" className="bg-white/5 border-white/10 cursor-pointer hover:bg-white/10">Find Jobs</Badge>
                <Badge variant="outline" className="bg-white/5 border-white/10 cursor-pointer hover:bg-white/10">Mock Interview</Badge>
              </div>
            </div>

            <div className="p-3 border-t border-white/10 bg-black/20">
              <div className="relative">
                <Input className="pr-10 bg-white/5 border-white/10 rounded-full" placeholder="Ask me anything..." />
                <Button size="icon" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full text-muted-foreground hover:text-[oklch(0.82_0.14_200)]">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CommandPalette open={cmdOpen} setOpen={setCmdOpen} />
    </div>
  );
}
