import { createUploadthing } from "uploadthing/express";
import { UploadThingError } from "uploadthing/server";
import { getUserFromRequest } from "../utils/authFromRequest.js";

const f = createUploadthing();

export const uploadRouter = {
  pdfUploader: f(
    {
      pdf: { maxFileSize: "5MB", maxFileCount: 1 },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
        maxFileSize: "5MB",
        maxFileCount: 1,
      },
    },
    { awaitServerData: true }
  )
    .middleware(async ({ req }) => {
      const user = await getUserFromRequest(req);
      if (!user) {
        throw new UploadThingError("You must be logged in to upload a resume");
      }
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return {
        uploadedBy: metadata.userId,
        url: file.url,
        name: file.name,
        key: file.key,
      };
    }),
};
