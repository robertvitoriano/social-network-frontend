import { api } from "./api";
export interface updateFields {
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
}: updateFields) {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("email", email);
  formData.append("username", username);
  if (avatar && avatar[0]) {
    formData.append("avatar", avatar[0]);
  }
  const signUpResponse = await api.patch("/users", {
    avatar,
    email,
    password,
    name,
    username,
  });
  console.log({ signUpResponse });
}
