import { api } from "./api";

export async function signOut() {
  await api.post("/log-out");
}
