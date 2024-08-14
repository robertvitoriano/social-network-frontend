import { oauthGoogle } from "./../lib/google-auth-keys";

export async function signInGoogle() {
  const query = {
    client_id: oauthGoogle.clientId,
    redirect_uri: oauthGoogle.redirectURI,
    response_type: "code",
    scope: oauthGoogle.scopes,
  };
  const url = new URL(oauthGoogle.endpoint);
  url.search = new URLSearchParams(query).toString();
  window.location.href = url.toString();
}
