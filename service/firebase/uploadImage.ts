import "firebase/storage";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { firebaseStorage } from "@/utils/firebase/firebaseConfig";

type Keys = {
  folderName:
    | "profile_picture_images"
    | "generation_images"
    | "update_ai_images"
    | "creator_verification_image"
    | "chat_images"
    | "add_post"
    | "offering_images";

  file: Blob | Uint8Array | ArrayBuffer;
  metadata: Record<string, any>;
};

export async function uploadImageToStorage({
  folderName,
  file,
  metadata,
}: Keys) {
  try {
    const randomNumber = Math.floor(Math.random() * 90000) + 10000;

    const timestamp = Date.now();
    const extension = "jpeg";
    const storagePath = `${folderName}/${randomNumber}_${timestamp}.${extension}`;

    const storageRef = ref(firebaseStorage, storagePath);

    // 'file' comes from the Blob or File API
    await uploadBytes(storageRef, file, metadata);

    const imageUrl = await getDownloadURL(storageRef);

    return imageUrl;
  } catch (error) {
    console.error("Error while uploading image to Firebase Storage:", error);
    throw error;
  }
}
