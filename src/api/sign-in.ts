import { api } from "./api";
export interface SignInBody {
  email: string;
  password: string;
}
export async function signIn({ email, password }: SignInBody) {
  const loginResponse = await api.post("/log-in", { email, password });
  return loginResponse;
}
