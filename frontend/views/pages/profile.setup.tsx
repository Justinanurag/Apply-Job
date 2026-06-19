import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";

import { Sparkles } from "lucide-react";

import { BackgroundFx } from "@/components/marketing/BackgroundFx";

import { ProfileProgress } from "@/components/profile/ProfileProgress";

import { ProfileForm } from "@/components/profile/ProfileForm";

import { Skeleton } from "@/components/ui/skeleton";

import { ensureAuthenticated } from "@/lib/auth/authApi";

import { ensureProfileComplete } from "@/lib/api/profile";

import { useProfile, useSaveProfile, useUploadResume, useDeleteResume } from "@/controllers/useProfile";

import { notify, alertSuccess } from "@/lib/alerts";

import { getApiErrorMessage } from "@/lib/api/client";

import { describeParsedResumeFields } from "@/lib/profile/parsedResume";

import type { ProfileFormValues } from "@/lib/types/profile";



export const Route = createFileRoute("/profile/setup")({

  beforeLoad: async () => {

    const user = await ensureAuthenticated();

    if (!user) {

      throw redirect({ to: "/login", search: { redirect: "/profile/setup" } });

    }



    const profileStatus = await ensureProfileComplete();

    if (profileStatus.isComplete) {

      throw redirect({ to: "/dashboard" });

    }



    return { user };

  },

  component: ProfileSetupPage,

});



function ProfileSetupPage() {

  const navigate = useNavigate();

  const { data, isLoading, isError } = useProfile();

  const saveProfile = useSaveProfile();

  const uploadResume = useUploadResume();

  const deleteResume = useDeleteResume();



  const canContinue = data?.canAccessDashboard ?? false;



  const handleSubmit = async (values: ProfileFormValues) => {

    const toastId = notify.loading("Saving profile...");

    try {

      const result = await saveProfile.mutateAsync(values);

      notify.dismiss(toastId);

      notify.success("Profile saved successfully");



      if (result.canAccessDashboard && !result.isComplete) {

        notify.info("You can continue to the dashboard or add more details to improve AI matching.");

      }



      if (result.isComplete) {

        await alertSuccess("Profile complete!", "Your profile is fully ready for AI job applications.");

        await navigate({ to: "/dashboard" });

      }

    } catch (err) {

      notify.dismiss(toastId);

      notify.error(getApiErrorMessage(err, "Failed to save profile"));

    }

  };



  const handleUpload = async (payload: { resumeUrl: string; resumeName: string }) => {
    const toastId = notify.loading("Parsing resume...");
    try {
      const result = await uploadResume.mutateAsync(payload);

      notify.dismiss(toastId);



      const parsedSummary = describeParsedResumeFields(result.parsedFromResume);

      if (parsedSummary) {

        notify.success(`Resume parsed — auto-filled: ${parsedSummary}`);

      } else {

        notify.success("Resume uploaded successfully");

      }



      if (result.isComplete) {

        await alertSuccess("Profile complete!", "Your profile is fully ready for AI job applications.");

        await navigate({ to: "/dashboard" });

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



  const goToDashboard = async () => {

    await navigate({ to: "/dashboard" });

  };



  return (

    <div className="dark relative min-h-screen text-foreground bg-background">

      <BackgroundFx />



      <div className="relative mx-auto max-w-3xl px-4 py-8 md:py-12">

        <div className="flex items-center gap-3 mb-6">

          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand shadow-glow">

            <Sparkles className="h-5 w-5 text-primary-foreground" />

          </span>

          <div>

            <h1 className="text-2xl font-semibold tracking-tight">

              {canContinue ? "Complete Your Profile" : "Set Up Your Profile"}

            </h1>

            <p className="text-sm text-muted-foreground">

              {canContinue

                ? "Personal information is saved. Add more details or upload your resume to improve AI matching."

                : "Fill in personal information to access your dashboard. Everything else is optional."}

            </p>

          </div>

        </div>



        {isLoading ? (

          <div className="space-y-4">

            <Skeleton className="h-16 w-full rounded-xl" />

            <Skeleton className="h-48 w-full rounded-xl" />

            <Skeleton className="h-48 w-full rounded-xl" />

          </div>

        ) : isError ? (

          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">

            Failed to load profile. Please refresh the page.

          </div>

        ) : (

          <>

            <div className="mb-6">

              <ProfileProgress percent={data?.completionPercent ?? 0} />

            </div>

            <ProfileForm

              email={data?.email ?? ""}

              profileData={data}

              onSubmit={handleSubmit}

              onUploadResume={handleUpload}

              onDeleteResume={handleDeleteResume}

              isSaving={saveProfile.isPending}

              isUploading={uploadResume.isPending}

              showContinueButton={canContinue}

              onContinueToDashboard={goToDashboard}

            />

          </>

        )}

      </div>

    </div>

  );

}


