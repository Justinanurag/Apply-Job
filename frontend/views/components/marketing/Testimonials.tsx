import { Star } from "lucide-react";
import { SectionHeader } from "./Features";

const items = [
  { name: "Maya Chen", role: "Head of AI, Northwind", text: "LumenAI replaced four tools and shaved weeks off our roadmap. The polish is unreal." },
  { name: "Jordan Park", role: "Founder, Inkwell", text: "We shipped an agent to production in a weekend. The observability alone is worth it." },
  { name: "Eli Adams", role: "Eng Lead, Acme", text: "Prompt versioning + pipelines as code = finally feels like real software engineering." },
  { name: "Ava Singh", role: "PM, Hooli", text: "Our team adopted it on day one. The dashboards are quietly the best part." },
  { name: "Kai Mori", role: "CTO, Initech", text: "Latency dropped 38%, costs by 22%. The unit economics are what closed it for us." },
  { name: "Rhea Patel", role: "DS, Stark", text: "It feels like Linear for AI. Every interaction is delightful." },
];

export function Testimonials() {
  const loop = [...items, ...items];
  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader
          eyebrow="Loved by builders"
          title={<>What teams are saying</>}
          desc="Trusted by AI teams at startups and enterprises."
        />

        <div className="mt-12 relative overflow-hidden mask-fade">
          <div className="flex gap-4 animate-marquee">
            {loop.map((t, i) => (
              <article key={i} className="w-[340px] shrink-0 rounded-2xl glass p-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-brand grid place-items-center text-sm font-semibold text-primary-foreground">
                    {t.name.split(" ").map((s) => s[0]).join("")}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
                <div className="mt-3 flex gap-0.5 text-[oklch(0.82_0.14_200)]">
                  {Array.from({ length: 5 }).map((_, k) => <Star key={k} className="h-3.5 w-3.5 fill-current" />)}
                </div>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">"{t.text}"</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
