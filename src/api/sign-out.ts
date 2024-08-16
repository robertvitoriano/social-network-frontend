import { api } from "./api";

export async function signOut() {
  localStorage.clear();
  await api.post("/log-out");
}
