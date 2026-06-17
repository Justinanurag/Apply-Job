import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Sparkles, History, CheckCircle2, AlertTriangle, Plus, Trash2, GripVertical, FileBadge, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/resume")({
  component: ResumeStudioPage,
});

function ResumeStudioPage() {
  const [activeTab, setActiveTab] = useState("experience");

  return (
    <div className="flex h-full gap-6">
      {/* Left Panel: Builder */}
      <div className="flex-1 flex flex-col min-w-0 max-w-3xl">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">AI Resume Studio</h1>
            <p className="text-sm text-muted-foreground mt-1">Optimize your resume for ATS and specific job descriptions.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="bg-white/5 border-white/10 hidden sm:flex">
              <History className="h-4 w-4 mr-2" />
              History
            </Button>
            <Button className="bg-gradient-brand text-primary-foreground border-0 shadow-glow">
              <Sparkles className="h-4 w-4 mr-2" />
              Optimize
            </Button>
          </div>
        </div>

        {/* ATS Score Panel */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass rounded-xl p-4 flex flex-col justify-between border-white/5">
            <div className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
              ATS Score <CheckCircle2 className="h-4 w-4 text-green-400" />
            </div>
            <div className="text-3xl font-semibold">92%</div>
            <div className="mt-2 text-xs text-green-400">Excellent match for Target Roles</div>
          </div>
          <div className="md:col-span-2 glass rounded-xl p-4 border-white/5">
            <div className="text-sm font-medium mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-400" /> Keyword Gap Analysis
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">React (Found)</Badge>
              <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">TypeScript (Found)</Badge>
              <Badge variant="secondary" className="bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20 cursor-pointer">+ Add GraphQL</Badge>
              <Badge variant="secondary" className="bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20 cursor-pointer">+ Add Next.js 14</Badge>
            </div>
          </div>
        </div>

        {/* Builder Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar mb-4 shrink-0">
          {[
            { id: "personal", label: "Personal Info" },
            { id: "experience", label: "Experience" },
            { id: "projects", label: "Projects" },
            { id: "skills", label: "Skills" },
            { id: "education", label: "Education" },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === t.id 
                  ? "bg-white/10 text-foreground border border-white/10 shadow-sm" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground border border-transparent"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Editor Area */}
        <div className="flex-1 glass-strong rounded-2xl border border-white/5 p-6 overflow-y-auto custom-scrollbar">
          {activeTab === "experience" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Work Experience</h3>
                <Button size="sm" variant="ghost" className="h-8 text-muted-foreground hover:text-foreground">
                  <Plus className="h-4 w-4 mr-1" /> Add Role
                </Button>
              </div>

              {[1, 2].map((i) => (
                <div key={i} className="group relative bg-white/5 border border-white/10 rounded-xl p-4 transition-all focus-within:border-[oklch(0.82_0.14_200)]/50">
                  <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-grab text-muted-foreground">
                    <GripVertical className="h-4 w-4" />
                  </div>
                  <div className="pl-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs text-muted-foreground">Company</label>
                        <Input defaultValue={i === 1 ? "Acme Corp" : "Initech"} className="h-9 bg-white/5 border-white/10" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-muted-foreground">Role</label>
                        <Input defaultValue={i === 1 ? "Senior Frontend Engineer" : "Frontend Developer"} className="h-9 bg-white/5 border-white/10" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs text-muted-foreground">Start Date</label>
                        <Input defaultValue={i === 1 ? "Jan 2022" : "Mar 2020"} className="h-9 bg-white/5 border-white/10" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-muted-foreground">End Date</label>
                        <Input defaultValue={i === 1 ? "Present" : "Dec 2021"} className="h-9 bg-white/5 border-white/10" />
                      </div>
                    </div>
                    <div className="space-y-1.5 relative">
                      <label className="text-xs text-muted-foreground flex justify-between">
                        Description
                        <span className="text-[oklch(0.82_0.14_200)] flex items-center cursor-pointer hover:underline">
                          <Sparkles className="h-3 w-3 mr-1" /> Rewrite with AI
                        </span>
                      </label>
                      <textarea 
                        className="w-full min-h-[100px] rounded-md bg-white/5 border border-white/10 p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[oklch(0.82_0.14_200)]"
                        defaultValue={i === 1 
                          ? "• Architected and migrated legacy monolith to Next.js App Router, improving LCP by 45%.\n• Mentored 3 junior developers and established frontend testing standards using Playwright." 
                          : "• Developed core UI components using React and Tailwind CSS.\n• Integrated REST APIs for the main dashboard."}
                      />
                    </div>
                  </div>
                  <Button size="icon" variant="ghost" className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {activeTab !== "experience" && (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
              <FileBadge className="h-12 w-12 mb-4 opacity-20" />
              <p>Select the {activeTab} tab to edit.</p>
              <p className="text-sm mt-1">This is a structural preview.</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel: Live Preview */}
      <div className="hidden lg:flex w-[400px] xl:w-[500px] shrink-0 flex-col">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="font-medium text-muted-foreground">Live Preview</h2>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="bg-white/5 border-white/10 h-8">
              <Save className="h-3.5 w-3.5 mr-1.5" /> Save
            </Button>
            <Button size="sm" variant="outline" className="bg-white/5 border-white/10 h-8">
              <Download className="h-3.5 w-3.5 mr-1.5" /> PDF
            </Button>
          </div>
        </div>
        
        <div className="flex-1 glass-strong rounded-2xl border border-white/5 bg-white p-8 overflow-y-auto custom-scrollbar shadow-xl text-black">
          {/* Mock PDF Resume Content */}
          <div className="space-y-6">
            <div className="text-center border-b pb-4">
              <h1 className="text-2xl font-serif font-bold text-gray-900 tracking-tight">Maya Chen</h1>
              <p className="text-sm text-gray-600 mt-1">San Francisco, CA • maya@example.com • github.com/mayachen</p>
            </div>
            
            <div>
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2 border-b border-gray-200 pb-1">Experience</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold text-gray-900">Acme Corp</h3>
                    <span className="text-sm text-gray-600">Jan 2022 - Present</span>
                  </div>
                  <div className="text-sm font-medium text-gray-800 italic">Senior Frontend Engineer</div>
                  <ul className="list-disc list-outside ml-4 mt-2 text-sm text-gray-700 space-y-1">
                    <li>Architected and migrated legacy monolith to Next.js App Router, improving LCP by 45%.</li>
                    <li>Mentored 3 junior developers and established frontend testing standards using Playwright.</li>
                  </ul>
                </div>
                <div>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold text-gray-900">Initech</h3>
                    <span className="text-sm text-gray-600">Mar 2020 - Dec 2021</span>
                  </div>
                  <div className="text-sm font-medium text-gray-800 italic">Frontend Developer</div>
                  <ul className="list-disc list-outside ml-4 mt-2 text-sm text-gray-700 space-y-1">
                    <li>Developed core UI components using React and Tailwind CSS.</li>
                    <li>Integrated REST APIs for the main dashboard.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2 border-b border-gray-200 pb-1">Skills</h2>
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-gray-900">Languages:</span> TypeScript, JavaScript, HTML, CSS<br/>
                <span className="font-semibold text-gray-900">Frameworks:</span> React, Next.js, Node.js, Tailwind CSS<br/>
                <span className="font-semibold text-gray-900">Tools:</span> Git, Webpack, Vite, Docker
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
