import React from "react";
import { UploadDropzone } from "@/lib/uploadthing";
import { toast } from "sonner";

interface PdfUploaderProps {
  onUploadComplete?: (url: string) => void;
  onUploadError?: (error: Error) => void;
}

import { getAccessToken } from "@/lib/auth/authStore";

export function PdfUploader({ onUploadComplete, onUploadError }: PdfUploaderProps) {
  return (
    <div className="w-full max-w-md mx-auto p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
      <h3 className="text-lg font-semibold text-center mb-4">Upload PDF</h3>
      <UploadDropzone
        endpoint="pdfUploader"
        url="/api/uploadthing"
        headers={{
          Authorization: `Bearer ${getAccessToken()}`
        }}
        onClientUploadComplete={(res) => {
          if (res && res.length > 0) {
            const uploadedUrl = res[0].url;
            toast.success("PDF uploaded successfully!");
            onUploadComplete?.(uploadedUrl);
          }
        }}
        onUploadError={(error: Error) => {
          toast.error(`Upload failed: ${error.message}`);
          onUploadError?.(error);
        }}
        config={{ mode: "auto" }}
      />
    </div>
  );
}
