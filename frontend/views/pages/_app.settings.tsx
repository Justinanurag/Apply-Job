import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import { ProfileProgress } from "@/components/profile/ProfileProgress";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfile, usePatchProfile, useUploadResume, useDeleteResume } from "@/controllers/useProfile";
import { notify } from "@/lib/alerts";
import { getApiErrorMessage } from "@/lib/api/client";
import { describeParsedResumeFields } from "@/lib/profile/parsedResume";
import type { ProfileFormValues } from "@/lib/types/profile";

export const Route = createFileRoute("/_app/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { data, isLoading, isError } = useProfile();
  const patchProfile = usePatchProfile();
  const uploadResume = useUploadResume();
  const deleteResume = useDeleteResume();

  const handleSubmit = async (values: ProfileFormValues) => {
    const toastId = notify.loading("Updating profile...");
    try {
      await patchProfile.mutateAsync(values);
      notify.dismiss(toastId);
      notify.success("Profile updated");
    } catch (err) {
      notify.dismiss(toastId);
      notify.error(getApiErrorMessage(err, "Failed to update profile"));
    }
  };

  const handleUpload = async (payload: { resumeUrl: string; resumeName: string }) => {
    const toastId = notify.loading("Parsing resume...");
    try {
      const result = await uploadResume.mutateAsync(payload);
      notify.dismiss(toastId);

      const parsedSummary = describeParsedResumeFields(result.parsedFromResume);
      if (parsedSummary) {
        notify.success(`Resume uploaded — auto-filled: ${parsedSummary}`);
      } else {
        notify.success("Resume uploaded successfully");
      }
    } catch (err) {
      notify.dismiss(toastId);
      notify.error(getApiErrorMessage(err, "Failed to upload resume"));
    }
  };

  const handleDeleteResume = async () => {
    const toastId = notify.loading("Removing resume...");
    try {
      await deleteResume.mutateAsync();
      notify.dismiss(toastId);
      notify.success("Resume removed");
    } catch (err) {
      notify.dismiss(toastId);
      notify.error(getApiErrorMessage(err, "Failed to delete resume"));
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand shadow-glow">
          <Settings className="h-5 w-5 text-primary-foreground" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Profile Settings</h1>
          <p className="text-sm text-muted-foreground">
            Update your profile anytime. Only personal information is required for dashboard access.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          Failed to load profile. Please refresh the page.
        </div>
      ) : (
        <>
          <ProfileProgress percent={data?.completionPercent ?? 0} />
          <ProfileForm
            email={data?.email ?? ""}
            profileData={data}
            onSubmit={handleSubmit}
            onUploadResume={handleUpload}
            onDeleteResume={handleDeleteResume}
            isSaving={patchProfile.isPending}
            isUploading={uploadResume.isPending}
            submitLabel="Update Profile"
          />
        </>
      )}
    </div>
  );
}
