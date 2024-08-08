import { api } from "./api";
export interface signUpBody {
  email: string;
  password: string;
  name: string;
  username: string;
}
export async function signUp({ email, password, name, username }: signUpBody) {
  await api.post("/users", {
    email,
    password,
    name,
    username,
  });
}
