import { Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "./Features";
import { motion } from "framer-motion";

const tiers = [
  {
    name: "Starter",
    monthly: 0,
    yearly: 0,
    desc: "For tinkerers and early prototypes.",
    features: ["Up to 3 projects", "10k requests / mo", "Community support", "Basic analytics"],
    cta: "Start free",
  },
  {
    name: "Pro",
    monthly: 29,
    yearly: 24,
    desc: "For shipping teams who need speed.",
    features: ["Unlimited projects", "1M requests / mo", "Prompt versioning", "Realtime analytics", "Priority support"],
    cta: "Start Pro trial",
    featured: true,
  },
  {
    name: "Enterprise",
    monthly: 99,
    yearly: 79,
    desc: "Security, scale, and SLAs.",
    features: ["SSO + SCIM", "SOC2 + audit logs", "Dedicated VPC", "Custom models", "24/7 SLA"],
    cta: "Talk to sales",
  },
];

export function Pricing() {
  const [yearly, setYearly] = useState(true);
  return (
    <section id="pricing" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader
          eyebrow="Pricing"
          title={<>Simple, predictable pricing</>}
          desc="Start free. Scale when you're ready."
        />

        <div className="mt-8 flex items-center justify-center gap-3">
          <span className={`text-sm ${!yearly ? "text-foreground" : "text-muted-foreground"}`}>Monthly</span>
          <button
            onClick={() => setYearly((v) => !v)}
            className="relative h-7 w-12 rounded-full glass"
            aria-label="Toggle billing"
          >
            <span
              className={`absolute top-0.5 h-6 w-6 rounded-full bg-gradient-brand transition-all ${yearly ? "left-[22px]" : "left-0.5"}`}
            />
          </button>
          <span className={`text-sm ${yearly ? "text-foreground" : "text-muted-foreground"}`}>
            Yearly <span className="text-[oklch(0.82_0.14_200)]">-20%</span>
          </span>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
          {tiers.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ y: -4, scale: 1.01 }}
              className={`relative rounded-3xl p-6 ${t.featured ? "glass-strong glow-border shadow-glow" : "glass"}`}
            >
              {t.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-brand px-3 py-1 text-[10px] font-semibold text-primary-foreground uppercase tracking-wider">
                  Most popular
                </div>
              )}
              <div className="text-sm text-muted-foreground">{t.name}</div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-5xl font-semibold tracking-tight">
                  ${yearly ? t.yearly : t.monthly}
                </span>
                <span className="text-muted-foreground text-sm">/mo</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
              <Button
                className={`mt-5 w-full ${t.featured ? "bg-gradient-brand text-primary-foreground border-0" : "bg-white/5 hover:bg-white/10"}`}
                variant={t.featured ? "default" : "outline"}
              >
                {t.cta}
              </Button>
              <ul className="mt-6 space-y-2.5">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 mt-0.5 text-[oklch(0.82_0.14_200)]" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
