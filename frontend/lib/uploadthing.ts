import { generateReactHelpers } from "@uploadthing/react";

export type OurFileRouter = {
  pdfUploader: {
    input: void;
    output: {
      uploadedBy: string;
      url: string;
      name: string;
      key: string;
    };
  };
};

export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>({
  url: "/api/uploadthing",
});
