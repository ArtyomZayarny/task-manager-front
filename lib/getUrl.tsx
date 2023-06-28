import { storage } from "@/appwrite";
import { Image } from "@/types";

export const getUrl = async (image: Image | undefined) => {
  if (!image) return;
  if (image) {
    const url = storage.getFilePreview(image.bucketId, image.fileId);
    return url;
  }
};
