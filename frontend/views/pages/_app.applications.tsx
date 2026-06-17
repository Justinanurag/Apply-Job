import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, MoreHorizontal, Calendar, MapPin, Building2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/applications")({
  component: ApplicationsTrackerPage,
});

const INITIAL_COLUMNS = [
  { id: "saved", title: "Saved", color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" },
  { id: "applied", title: "Applied", color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20" },
  { id: "review", title: "Under Review", color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20" },
  { id: "interview", title: "Interview", color: "text-[oklch(0.82_0.14_200)]", bg: "bg-[oklch(0.82_0.14_200)]/10", border: "border-[oklch(0.82_0.14_200)]/20" },
  { id: "offer", title: "Offer", color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/20" },
  { id: "rejected", title: "Rejected", color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/20" },
];

const INITIAL_CARDS = [
  { id: "1", column: "applied", company: "Vercel", role: "Senior Frontend Engineer", location: "San Francisco", date: "Applied 2d ago", source: "Agent" },
  { id: "2", column: "review", company: "Stripe", role: "UI Engineer", location: "Remote", date: "Viewed yesterday", source: "Manual" },
  { id: "3", column: "interview", company: "Linear", role: "Frontend Developer", location: "New York", date: "Interview on Friday", source: "Agent" },
  { id: "4", column: "saved", company: "OpenAI", role: "React Engineer", location: "San Francisco", date: "Saved 1w ago", source: "Manual" },
  { id: "5", column: "rejected", company: "Google", role: "Software Engineer", location: "Remote", date: "Rejected 1m ago", source: "Agent" },
  { id: "6", column: "offer", company: "Anthropic", role: "Frontend Engineer", location: "Remote", date: "Offer received!", source: "Manual" },
];

function ApplicationsTrackerPage() {
  const [cards, setCards] = useState(INITIAL_CARDS);

  // Simple drag and drop state (for visual purposes, a full implementation would use dnd-kit)
  const [draggedCard, setDraggedCard] = useState<string | null>(null);

  return (
    <div className="h-full flex flex-col min-w-0">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Application Tracker</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your pipeline from saved to offer.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-white/5 border-white/10">Export CSV</Button>
          <Button className="bg-gradient-brand text-primary-foreground border-0 shadow-glow">
            <Plus className="h-4 w-4 mr-2" />
            Add Application
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4 custom-scrollbar">
        <div className="flex gap-4 h-full min-w-max">
          {INITIAL_COLUMNS.map(col => (
            <div key={col.id} className="w-80 flex flex-col h-full bg-white/5 border border-white/5 rounded-2xl overflow-hidden shrink-0">
              
              {/* Column Header */}
              <div className="p-4 border-b border-white/5 flex items-center justify-between bg-background/20 backdrop-blur-sm shrink-0">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${col.bg} ${col.color} border ${col.border}`}>
                    {col.title}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">
                    {cards.filter(c => c.column === col.id).length}
                  </span>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>

              {/* Column Body */}
              <div className="flex-1 p-3 overflow-y-auto custom-scrollbar space-y-3">
                {cards.filter(c => c.column === col.id).map(card => (
                  <motion.div
                    layoutId={card.id}
                    key={card.id}
                    draggable
                    onDragStart={() => setDraggedCard(card.id)}
                    onDragEnd={() => setDraggedCard(null)}
                    onDragOver={(e) => {
                      e.preventDefault();
                      if (draggedCard && draggedCard !== card.id) {
                         // Swap or move logic here
                      }
                    }}
                    className="glass border border-white/10 rounded-xl p-4 cursor-grab active:cursor-grabbing hover:border-white/20 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded bg-white/10 grid place-items-center text-xs font-bold shrink-0">
                          {card.company[0]}
                        </div>
                        <span className="font-semibold text-sm truncate">{card.company}</span>
                      </div>
                      <Badge variant="outline" className={`text-[10px] h-5 border-transparent ${card.source === 'Agent' ? 'bg-purple-500/10 text-purple-400' : 'bg-white/10 text-muted-foreground'}`}>
                        {card.source}
                      </Badge>
                    </div>
                    
                    <div className="font-medium text-[15px] leading-tight mb-3">
                      {card.role}
                    </div>
                    
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" /> <span className="truncate">{card.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" /> <span>{card.date}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
