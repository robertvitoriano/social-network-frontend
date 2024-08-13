export async function signInGoogle() {
  window.open(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, "_self");
}
