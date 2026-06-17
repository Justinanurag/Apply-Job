import { motion } from "framer-motion";
import { Cpu, MessageSquare, Rocket, Settings2, Workflow as WorkflowIcon } from "lucide-react";
import { SectionHeader } from "./Features";

const steps = [
  { icon: MessageSquare, title: "Prompt", desc: "Describe the outcome in natural language." },
  { icon: Cpu, title: "AI processing", desc: "Models reason, retrieve, and call tools." },
  { icon: WorkflowIcon, title: "Pipeline", desc: "Composable automations run in parallel." },
  { icon: Settings2, title: "Result", desc: "Structured output ready for your stack." },
  { icon: Rocket, title: "Deploy", desc: "Ship to prod with one click — observed by default." },
];

export function WorkflowSection() {
  return (
    <section id="workflow" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader
          eyebrow="Workflow"
          title={<>From prompt to production — <span className="text-gradient">in minutes</span></>}
          desc="Every step is observable, replayable, and version-controlled."
        />

        <div className="mt-16 relative">
          <div className="hidden md:block absolute top-9 left-[8%] right-[8%] h-px bg-gradient-to-r from-transparent via-[oklch(0.72_0.20_295_/_60%)] to-transparent" />
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="relative text-center"
              >
                <div className="relative mx-auto h-18 w-18">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-brand blur-xl opacity-50" />
                  <div className="relative mx-auto h-16 w-16 rounded-2xl glass-strong flex items-center justify-center shadow-glow">
                    <s.icon className="h-6 w-6 text-foreground" />
                  </div>
                </div>
                <div className="mt-4 text-xs text-muted-foreground">Step {i + 1}</div>
                <div className="mt-1 font-semibold">{s.title}</div>
                <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
