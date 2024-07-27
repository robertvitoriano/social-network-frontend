import { LoggedUser } from "@/lib/store/authStore";
import { api } from "./api";

export interface UpdateFields {
  email: string;
  password: string;
  name: string;
  username: string;
  avatar: FileList;
}

export async function updateUserProfile({
  avatar,
  email,
  password,
  name,
  username,
}: UpdateFields): Promise<LoggedUser | void> {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("email", email);
  formData.append("username", username);
  formData.append("password", password);
  if (avatar && avatar[0]) {
    formData.append("avatar", avatar[0]);
  }

  const signUpResponse = await api.patch("/users", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return signUpResponse.data.user;
}
