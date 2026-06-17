import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Play, MessageSquare, Video, CheckCircle2, ChevronRight, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/interviews")({
  component: InterviewPrepPage,
});

function InterviewPrepPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Interview Prep</h1>
          <p className="text-sm text-muted-foreground mt-1">Practice with AI, review questions, and boost your readiness score.</p>
        </div>
        <Button className="bg-gradient-brand text-primary-foreground border-0 shadow-glow shrink-0">
          <Video className="h-4 w-4 mr-2" />
          Start Mock Interview
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass rounded-xl p-5 border-white/5 flex flex-col justify-between">
          <div className="text-sm text-muted-foreground mb-4">Overall Readiness Score</div>
          <div className="flex items-end gap-3">
            <div className="text-5xl font-semibold text-[oklch(0.82_0.14_200)]">78<span className="text-2xl text-muted-foreground">/100</span></div>
          </div>
          <div className="w-full bg-white/10 h-2 mt-4 rounded-full overflow-hidden">
            <div className="bg-[oklch(0.82_0.14_200)] h-full rounded-full" style={{ width: "78%" }} />
          </div>
          <p className="text-xs text-muted-foreground mt-3">You're doing great! Practice behavioral questions to hit 90+.</p>
        </div>

        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          <div className="glass rounded-xl p-5 border-white/5">
            <div className="flex items-center gap-2 text-sm font-medium mb-3">
              <MessageSquare className="h-4 w-4 text-purple-400" /> Behavioral
            </div>
            <div className="text-2xl font-semibold">65%</div>
            <p className="text-xs text-muted-foreground mt-1">Needs improvement</p>
            <Button variant="link" className="px-0 h-auto mt-2 text-xs text-purple-400">Practice now &rarr;</Button>
          </div>
          <div className="glass rounded-xl p-5 border-white/5">
            <div className="flex items-center gap-2 text-sm font-medium mb-3">
              <BarChart className="h-4 w-4 text-green-400" /> Technical
            </div>
            <div className="text-2xl font-semibold">92%</div>
            <p className="text-xs text-muted-foreground mt-1">Excellent</p>
            <Button variant="link" className="px-0 h-auto mt-2 text-xs text-green-400">Review mistakes &rarr;</Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-medium mb-4">Upcoming Interviews</h2>
          <div className="space-y-3">
            {[
              { company: "Linear", role: "Frontend Developer", date: "Friday, 10:00 AM PST", type: "Technical Round" },
            ].map((interview, i) => (
              <div key={i} className="glass rounded-xl p-4 border border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sm">{interview.company} - {interview.role}</h3>
                  <div className="text-xs text-muted-foreground mt-1">{interview.date} • {interview.type}</div>
                </div>
                <Button size="sm" variant="outline" className="bg-white/5 border-white/10">Prep Material</Button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-medium mb-4">Recommended Practice</h2>
          <div className="space-y-3">
            {[
              { title: "React Hooks Deep Dive", questions: 15, time: "20 min" },
              { title: "System Design: News Feed", questions: 5, time: "45 min" },
              { title: "Behavioral: Conflict Resolution", questions: 8, time: "15 min" },
            ].map((topic, i) => (
              <div key={i} className="glass rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors cursor-pointer group flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-sm group-hover:text-[oklch(0.82_0.14_200)] transition-colors">{topic.title}</h3>
                  <div className="text-xs text-muted-foreground mt-1">{topic.questions} questions • {topic.time}</div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-[oklch(0.82_0.14_200)] transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
