import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, FileSignature, Copy, Download, Edit3, Save, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_app/cover-letters")({
  component: CoverLettersPage,
});

function CoverLettersPage() {
  const [jobDescription, setJobDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setCoverLetter(`Dear Hiring Manager,

I am writing to express my strong interest in the role at your company. With my background in frontend development and my expertise in React and TypeScript, I am confident in my ability to contribute effectively to your team.

At my previous role, I successfully migrated a legacy monolith to Next.js App Router, resulting in a 45% improvement in LCP. I am passionate about building intuitive and performant user interfaces, and I am drawn to your company's commitment to excellence.

I would welcome the opportunity to discuss how my skills and experiences align with your needs. Thank you for your time and consideration.

Sincerely,
Maya Chen`);
      setIsGenerating(false);
    }, 1500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-full gap-6">
      <div className="flex-1 flex flex-col min-w-0 max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Cover Letter Generator</h1>
          <p className="text-sm text-muted-foreground mt-1">Generate personalized cover letters tailored to specific job descriptions.</p>
        </div>

        <div className="glass-strong rounded-2xl border border-white/5 p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Job Description</label>
            <Textarea 
              placeholder="Paste the job description here..." 
              className="min-h-[200px] bg-white/5 border-white/10"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tone & Style</label>
            <div className="flex gap-2">
              <Button variant="outline" className="bg-white/10 border-white/20 text-foreground">Professional</Button>
              <Button variant="outline" className="bg-white/5 border-white/10 text-muted-foreground">Enthusiastic</Button>
              <Button variant="outline" className="bg-white/5 border-white/10 text-muted-foreground">Direct</Button>
            </div>
          </div>

          <Button 
            className="w-full bg-gradient-brand text-primary-foreground border-0 shadow-glow" 
            onClick={handleGenerate}
            disabled={!jobDescription || isGenerating}
          >
            {isGenerating ? "Generating..." : <><Sparkles className="h-4 w-4 mr-2" /> Generate Cover Letter</>}
          </Button>
        </div>
      </div>

      <div className="flex-1 hidden md:flex flex-col">
        {coverLetter ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-medium text-muted-foreground">Generated Letter</h2>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="bg-white/5 border-white/10 h-8" onClick={handleCopy}>
                  {copied ? <Check className="h-3.5 w-3.5 mr-1.5" /> : <Copy className="h-3.5 w-3.5 mr-1.5" />} 
                  {copied ? "Copied" : "Copy"}
                </Button>
                <Button size="sm" variant="outline" className="bg-white/5 border-white/10 h-8">
                  <Download className="h-3.5 w-3.5 mr-1.5" /> PDF
                </Button>
              </div>
            </div>
            
            <div className="flex-1 glass-strong rounded-2xl border border-white/5 bg-white p-8 overflow-y-auto custom-scrollbar shadow-xl text-black">
              <Textarea 
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="w-full h-full min-h-[400px] bg-transparent border-none resize-none focus-visible:ring-0 text-gray-800 leading-relaxed p-0 text-base"
              />
            </div>
          </motion.div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-white/10 rounded-2xl m-4 p-8 text-center">
            <FileSignature className="h-12 w-12 mb-4 opacity-20" />
            <p>Paste a job description and click generate to see your custom cover letter here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
