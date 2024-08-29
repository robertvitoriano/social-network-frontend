import { api } from "./api";

export async function getProfile(userId: string) {
  const profileResponse = await api.get(`/users/${userId}`);
  return profileResponse;
}
