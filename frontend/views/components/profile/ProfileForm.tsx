import { useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload, Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TagInput } from "@/components/profile/TagInput";
import {
  profileFormSchema,
  TECH_STACK_OPTIONS,
  EMPLOYMENT_TYPE_OPTIONS,
  REMOTE_PREFERENCE_OPTIONS,
  SUGGESTED_SKILLS,
  type ProfileFormSchemaValues,
} from "@/lib/validations/profile.schema";
import type { ProfileFormValues, ProfileResponse } from "@/lib/types/profile";
import { cn } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";
import { getAccessToken } from "@/lib/auth/authStore";
import { toast } from "sonner";

interface ProfileFormProps {
  email: string;
  profileData?: ProfileResponse | null;
  onSubmit: (values: ProfileFormValues) => Promise<void>;
  onUploadResume: (payload: { resumeUrl: string; resumeName: string; resumeKey?: string }) => Promise<void>;
  onDeleteResume: () => Promise<void>;
  isSaving?: boolean;
  isUploading?: boolean;
  submitLabel?: string;
  showContinueButton?: boolean;
  onContinueToDashboard?: () => void;
}

const defaultValues: ProfileFormValues = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  currentRole: "",
  experience: 0,
  linkedInUrl: "",
  githubUrl: "",
  portfolioUrl: "",
  currentCompany: "",
  currentCTC: undefined,
  expectedCTC: undefined,
  noticePeriod: undefined,
  employmentType: "",
  skills: [],
  techStacks: [],
  preferredRoles: [],
  preferredLocations: [],
  salaryExpectation: undefined,
  remotePreference: "",
  openToRelocation: false,
};

function mapProfileToForm(profile: ProfileResponse | null | undefined, email: string): ProfileFormValues {
  const p = profile?.profile;
  if (!p) {
    return { ...defaultValues, email, fullName: "" };
  }
  return {
    fullName: p.fullName ?? "",
    email,
    phone: p.phone ?? "",
    location: p.location ?? "",
    currentRole: p.currentRole ?? "",
    experience: p.experience ?? 0,
    linkedInUrl: p.linkedInUrl ?? "",
    githubUrl: p.githubUrl ?? "",
    portfolioUrl: p.portfolioUrl ?? "",
    currentCompany: p.currentCompany ?? "",
    currentCTC: p.currentCTC ?? undefined,
    expectedCTC: p.expectedCTC ?? undefined,
    noticePeriod: p.noticePeriod ?? undefined,
    employmentType: p.employmentType ?? "",
    skills: p.skills ?? [],
    techStacks: p.techStacks ?? [],
    preferredRoles: p.preferredRoles ?? [],
    preferredLocations: p.preferredLocations ?? [],
    salaryExpectation: p.salaryExpectation ?? undefined,
    remotePreference: p.remotePreference ?? undefined,
    openToRelocation: p.openToRelocation ?? false,
  };
}

export function ProfileForm({
  email,
  profileData,
  onSubmit,
  onUploadResume,
  onDeleteResume,
  isSaving,
  isUploading,
  submitLabel = "Save Profile",
  showContinueButton,
  onContinueToDashboard,
}: ProfileFormProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileFormSchemaValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: mapProfileToForm(profileData, email),
    values: mapProfileToForm(profileData, email),
  });

  const resume = profileData?.profile;

  const { startUpload, isUploading: isUtUploading } = useUploadThing("pdfUploader", {
    headers: () => {
      const token = getAccessToken();
      return token ? { Authorization: `Bearer ${token}` } : {};
    },
    onClientUploadComplete: async (res) => {
      const file = res[0];
      if (!file) return;
      await onUploadResume({
        resumeUrl: file.url,
        resumeName: file.name,
        resumeKey: file.key,
      });
    },
    onUploadError: (error) => {
      toast.error(error.message);
    },
  });

  const isCurrentlyUploading = isUtUploading || Boolean(isUploading);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      form.setError("root", { message: "File must be under 5MB" });
      return;
    }
    await startUpload([file]);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <form onSubmit={form.handleSubmit((values) => onSubmit(values as ProfileFormValues))} className="space-y-6 pb-24">
      {/* Personal Information */}
      <Card className="glass border-white/10 rounded-xl">
        <CardHeader>
          <CardTitle className="text-lg">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label>Full Name</Label>
            <Input className="bg-white/5 border-white/10" {...form.register("fullName")} />
            {form.formState.errors.fullName && (
              <p className="text-xs text-destructive">{form.formState.errors.fullName.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input className="bg-white/5 border-white/10" value={email} readOnly disabled />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input className="bg-white/5 border-white/10" {...form.register("phone")} />
            {form.formState.errors.phone && (
              <p className="text-xs text-destructive">{form.formState.errors.phone.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Location</Label>
            <Input className="bg-white/5 border-white/10" placeholder="City, Country" {...form.register("location")} />
            {form.formState.errors.location && (
              <p className="text-xs text-destructive">{form.formState.errors.location.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Current Role</Label>
            <Input className="bg-white/5 border-white/10" placeholder="e.g. Frontend Developer" {...form.register("currentRole")} />
            {form.formState.errors.currentRole && (
              <p className="text-xs text-destructive">{form.formState.errors.currentRole.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Experience (years)</Label>
            <Input type="number" min={0} max={40} className="bg-white/5 border-white/10" {...form.register("experience")} />
            {form.formState.errors.experience && (
              <p className="text-xs text-destructive">{form.formState.errors.experience.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Professional Links */}
      <Card className="glass border-white/10 rounded-xl">
        <CardHeader>
          <CardTitle className="text-lg">Professional Links <span className="text-sm font-normal text-muted-foreground">(Optional)</span></CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label>LinkedIn URL</Label>
            <Input className="bg-white/5 border-white/10" placeholder="https://linkedin.com/in/..." {...form.register("linkedInUrl")} />
          </div>
          <div className="space-y-2">
            <Label>GitHub URL</Label>
            <Input className="bg-white/5 border-white/10" placeholder="https://github.com/..." {...form.register("githubUrl")} />
          </div>
          <div className="space-y-2">
            <Label>Portfolio URL</Label>
            <Input className="bg-white/5 border-white/10" placeholder="https://..." {...form.register("portfolioUrl")} />
          </div>
        </CardContent>
      </Card>

      {/* Career Details */}
      <Card className="glass border-white/10 rounded-xl">
        <CardHeader>
          <CardTitle className="text-lg">Career Details <span className="text-sm font-normal text-muted-foreground">(Optional)</span></CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label>Current Company</Label>
            <Input className="bg-white/5 border-white/10" {...form.register("currentCompany")} />
          </div>
          <div className="space-y-2">
            <Label>Current CTC (annual)</Label>
            <Input type="number" className="bg-white/5 border-white/10" {...form.register("currentCTC")} />
          </div>
          <div className="space-y-2">
            <Label>Expected CTC (annual)</Label>
            <Input type="number" className="bg-white/5 border-white/10" {...form.register("expectedCTC")} />
          </div>
          <div className="space-y-2">
            <Label>Notice Period (days)</Label>
            <Input type="number" className="bg-white/5 border-white/10" {...form.register("noticePeriod")} />
          </div>
          <div className="space-y-2">
            <Label>Employment Type</Label>
            <Controller
              control={form.control}
              name="employmentType"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {EMPLOYMENT_TYPE_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card className="glass border-white/10 rounded-xl">
        <CardHeader>
          <CardTitle className="text-lg">Skills <span className="text-sm font-normal text-muted-foreground">(Optional)</span></CardTitle>
        </CardHeader>
        <CardContent>
          <Controller
            control={form.control}
            name="skills"
            render={({ field }) => (
              <TagInput
                value={field.value}
                onChange={field.onChange}
                placeholder="Add a skill and press Enter"
                suggestions={SUGGESTED_SKILLS}
              />
            )}
          />
        </CardContent>
      </Card>

      {/* Tech Stack */}
      <Card className="glass border-white/10 rounded-xl">
        <CardHeader>
          <CardTitle className="text-lg">Tech Stack <span className="text-sm font-normal text-muted-foreground">(Optional)</span></CardTitle>
        </CardHeader>
        <CardContent>
          <Controller
            control={form.control}
            name="techStacks"
            render={({ field }) => (
              <div className="flex flex-wrap gap-2">
                {TECH_STACK_OPTIONS.map((stack) => {
                  const selected = field.value.includes(stack);
                  return (
                    <button
                      key={stack}
                      type="button"
                      onClick={() => {
                        if (selected) {
                          field.onChange(field.value.filter((s) => s !== stack));
                        } else {
                          field.onChange([...field.value, stack]);
                        }
                      }}
                      className={cn(
                        "rounded-full px-3 py-1.5 text-sm border transition",
                        selected
                          ? "bg-gradient-brand text-primary-foreground border-transparent"
                          : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"
                      )}
                    >
                      {stack}
                    </button>
                  );
                })}
              </div>
            )}
          />
        </CardContent>
      </Card>

      {/* Job Preferences */}
      <Card className="glass border-white/10 rounded-xl">
        <CardHeader>
          <CardTitle className="text-lg">Job Preferences <span className="text-sm font-normal text-muted-foreground">(Optional)</span></CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Preferred Roles</Label>
            <Controller
              control={form.control}
              name="preferredRoles"
              render={({ field }) => (
                <TagInput
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="e.g. Frontend Developer, Full Stack Engineer"
                />
              )}
            />
          </div>
          <div className="space-y-2">
            <Label>Preferred Locations</Label>
            <Controller
              control={form.control}
              name="preferredLocations"
              render={({ field }) => (
                <TagInput
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="e.g. Bangalore, Remote US"
                />
              )}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Salary Expectation (annual)</Label>
              <Input type="number" className="bg-white/5 border-white/10" {...form.register("salaryExpectation")} />
            </div>
            <div className="space-y-2">
              <Label>Remote Preference</Label>
              <Controller
                control={form.control}
                name="remotePreference"
                render={({ field }) => (
                  <Select value={field.value ?? ""} onValueChange={(v) => field.onChange(v || undefined)}>
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue placeholder="Select preference" />
                    </SelectTrigger>
                    <SelectContent>
                      {REMOTE_PREFERENCE_OPTIONS.map((opt) => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <div>
              <Label>Open to Relocation</Label>
              <p className="text-xs text-muted-foreground">Willing to relocate for the right opportunity</p>
            </div>
            <Controller
              control={form.control}
              name="openToRelocation"
              render={({ field }) => (
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Resume Upload */}
      <Card className="glass border-white/10 rounded-xl">
        <CardHeader>
          <CardTitle className="text-lg">Resume Upload <span className="text-sm font-normal text-muted-foreground">(Optional — auto-fills profile)</span></CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {resume?.resumeUrl ? (
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="h-5 w-5 text-[oklch(0.82_0.14_200)] shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{resume.resumeName ?? "Uploaded Resume"}</p>
                  {resume.resumeUploadedAt && (
                    <p className="text-xs text-muted-foreground">
                      Uploaded {new Date(resume.resumeUploadedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-white/10"
                  onClick={() => fileRef.current?.click()}
                  disabled={isCurrentlyUploading}
                >
                  Replace
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => void onDeleteResume()}
                  disabled={isCurrentlyUploading}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={isCurrentlyUploading}
              className="w-full flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 bg-white/5 py-10 hover:bg-white/10 transition"
            >
              {isCurrentlyUploading ? (
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              ) : (
                <Upload className="h-8 w-8 text-muted-foreground" />
              )}
              <p className="text-sm font-medium">Upload Resume (PDF or DOCX, max 5MB)</p>
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
            onChange={(e) => void handleFileChange(e)}
          />
        </CardContent>
      </Card>

      {/* Sticky Save */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 glass-strong px-4 py-4">
        <div className="mx-auto max-w-3xl flex justify-end gap-2">
          {showContinueButton && onContinueToDashboard && (
            <Button
              type="button"
              variant="outline"
              className="border-white/10"
              onClick={onContinueToDashboard}
            >
              Continue to Dashboard
            </Button>
          )}
          <Button
            type="submit"
            disabled={isSaving}
            className="bg-gradient-brand text-primary-foreground border-0 shadow-glow min-w-[140px]"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              submitLabel
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
