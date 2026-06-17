import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BackgroundFx } from "@/components/marketing/BackgroundFx";
import { Navbar } from "@/components/marketing/Navbar";
import { Hero } from "@/components/marketing/Hero";
import { Features } from "@/components/marketing/Features";
import { WorkflowSection } from "@/components/marketing/Workflow";
import { Testimonials } from "@/components/marketing/Testimonials";
import { Pricing } from "@/components/marketing/Pricing";
import { Faq } from "@/components/marketing/Faq";
import { CtaFooter } from "@/components/marketing/CtaFooter";
import { CommandPalette } from "@/components/marketing/CommandPalette";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AgentPro — Your Personal AI Job Search Agent" },
      { name: "description", content: "Automatically discover jobs, optimize your resume, generate personalized cover letters, and let AI apply while you sleep." },
      { property: "og:title", content: "AgentPro — Your Personal AI Job Search Agent" },
      { property: "og:description", content: "The ultimate AI platform for your job search." },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const [cmdOpen, setCmdOpen] = useState(false);
  return (
    <div className="dark relative min-h-screen text-foreground bg-background overflow-x-hidden">
      <BackgroundFx />
      <Navbar onOpenCmd={() => setCmdOpen(true)} />
      <main>
        <Hero />
        <Features />
        <WorkflowSection />
        <Testimonials />
        <Pricing />
        <Faq />
        <CtaFooter />
      </main>
      <CommandPalette open={cmdOpen} setOpen={setCmdOpen} />
    </div>
  );
}
