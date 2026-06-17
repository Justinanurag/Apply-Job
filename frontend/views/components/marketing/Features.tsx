import { motion } from "framer-motion";
import { Bot, GitBranch, Layers, LineChart, Lock, Workflow } from "lucide-react";
import type { ReactNode } from "react";

type Feature = {
  icon: ReactNode;
  title: string;
  desc: string;
  span?: string;
  accent?: string;
};

const features: Feature[] = [
  {
    icon: <Bot className="h-5 w-5" />,
    title: "Multi-model AI agents",
    desc: "Compose GPT, Claude, and open models into agents that plan, call tools, and self-correct.",
    span: "md:col-span-2 md:row-span-2",
    accent: "from-[oklch(0.72_0.20_295)] to-[oklch(0.70_0.18_240)]",
  },
  {
    icon: <Workflow className="h-5 w-5" />,
    title: "Visual workflows",
    desc: "Drag, connect, deploy. No more brittle scripts.",
  },
  {
    icon: <LineChart className="h-5 w-5" />,
    title: "Realtime analytics",
    desc: "Latency, cost, and quality — observable by default.",
  },
  {
    icon: <Layers className="h-5 w-5" />,
    title: "Prompt versioning",
    desc: "Branch, diff, rollback. Treat prompts like code.",
    span: "md:col-span-2",
  },
  {
    icon: <GitBranch className="h-5 w-5" />,
    title: "Pipelines as code",
    desc: "TypeScript SDK + Git-native deploys.",
  },
  {
    icon: <Lock className="h-5 w-5" />,
    title: "Enterprise security",
    desc: "SOC2, SSO, granular permissions, and audit trails.",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader
          eyebrow="Platform"
          title={<>Everything your team needs to <span className="text-gradient">ship AI faster</span></>}
          desc="A unified workspace for builders, designers, and operators."
        />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[180px]">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.06, duration: 0.5, ease: "easeOut" }}
              className={`group relative overflow-hidden rounded-3xl glass p-6 ${f.span ?? ""}`}
            >
              <div className="absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition" style={{
                background: "radial-gradient(400px circle at var(--x,50%) var(--y,50%), oklch(0.72 0.20 295 / 18%), transparent 60%)"
              }} onMouseMove={(e) => {
                const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                (e.currentTarget as HTMLDivElement).style.setProperty("--x", `${e.clientX - r.left}px`);
                (e.currentTarget as HTMLDivElement).style.setProperty("--y", `${e.clientY - r.top}px`);
              }} />
              <div className="relative flex h-full flex-col">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground shadow-glow">
                  {f.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold tracking-tight">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  desc,
}: {
  eyebrow?: string;
  title: ReactNode;
  desc?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className="mx-auto max-w-2xl text-center"
    >
      {eyebrow && (
        <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-muted-foreground">
          {eyebrow}
        </div>
      )}
      <h2 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight leading-tight">{title}</h2>
      {desc && <p className="mt-4 text-muted-foreground">{desc}</p>}
    </motion.div>
  );
}
