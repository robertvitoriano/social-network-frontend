import { LoggedUser } from "@/lib/store/authStore";
import { api } from "./api";

export interface UpdateFields {
  email?: string;
  password?: string;
  name?: string;
  username?: string;
  avatar?: FileList;
  cover?: FileList;
  fileBeingUploaded?: "avatar" | "cover";
}

export async function updateUserProfile({
  avatar,
  cover,
  ...data
}: UpdateFields): Promise<LoggedUser | void> {
  const formData = new FormData();

  for (const [propertyName, propertyValue] of Object.entries(data)) {
    formData.append(propertyName, propertyValue);
  }

  if (avatar && avatar[0]) {
    formData.append("avatar", avatar[0]);
  }
  if (cover && cover[0]) {
    formData.append("cover", cover[0]);
  }

  try {
    const signUpResponse = await api.patch("/users", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return signUpResponse.data.user;
  } catch (error) {
    console.error("Error updating profile:", error);
  }
}
