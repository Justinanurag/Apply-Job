import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeader } from "./Features";

const faqs = [
  { q: "Which models does LumenAI support?", a: "GPT-4o, Claude 3.5, Gemini, Llama, Mistral, and any custom model via our SDK." },
  { q: "Is my data used to train models?", a: "Never. Your data is private by default and isolated per workspace." },
  { q: "Can I self-host?", a: "Yes — Enterprise plans include single-tenant VPC deployments on AWS, GCP, and Azure." },
  { q: "Do you offer a free tier?", a: "Yes. The Starter plan is free forever with 10k requests/mo." },
  { q: "How does pricing scale?", a: "Transparent usage-based pricing after included requests. No surprise bills — alerts at 50/80/100%." },
  { q: "Is there an API?", a: "A first-class TypeScript SDK and REST API, plus webhooks and CLI." },
];

export function Faq() {
  return (
    <section id="faq" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-4">
        <SectionHeader eyebrow="FAQ" title={<>Frequently asked questions</>} />
        <Accordion type="single" collapsible className="mt-10 space-y-2">
          {faqs.map((f, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="glass rounded-2xl px-4 border-0"
            >
              <AccordionTrigger className="text-left hover:no-underline">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
