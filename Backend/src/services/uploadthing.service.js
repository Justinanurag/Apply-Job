import { UTApi } from "uploadthing/server";
import { env } from "../config/env.js";

let utapi;

export const getUTApi = () => {
  if (!utapi) {
    if (!env.uploadthingToken) {
      throw new Error("UploadThing is not configured");
    }
    utapi = new UTApi({ token: env.uploadthingToken });
  }
  return utapi;
};

export const deleteUploadThingFile = async (fileKey) => {
  if (!fileKey || !env.uploadthingToken) return;
  try {
    const api = getUTApi();
    await api.deleteFiles(fileKey);
  } catch (error) {
    console.warn("UploadThing delete warning:", error.message);
  }
};
