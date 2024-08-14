type GOOGLE_AUTH_KEYS =
  | "clientId"
  | "clientSecret"
  | "endpoint"
  | "redirectURI"
  | "scopes";

export const oauthGoogle: Record<GOOGLE_AUTH_KEYS, string> = {
  clientId: process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID || "",
  clientSecret: process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_SECRET || "",
  endpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  redirectURI: process.env.NEXT_PUBLIC_GOOGLE_OAUTH_REDIRECT_URI || "",
  scopes:
    "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
};
