"use client";
import { useEffect } from "react";
import "../globals.css";
import { useAuthStore } from "@/lib/store/authStore";
import { useRouter } from "next/navigation";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const setLoggedUser = useAuthStore((state) => state.setLoggedUser);
  const loggedUser = useAuthStore((state) => state.loggedUser);
  const setToken = useAuthStore((state) => state.setToken);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const user = urlParams.get("user");

    if (token && user) {
      setToken(token);
      setLoggedUser(JSON.parse(user));
      location.href = "/";
    }

    const redirectUrl = localStorage.getItem("redirectUrl");

    if (redirectUrl && loggedUser.id) {
      localStorage.removeItem("redirectUrl");
      location.href = redirectUrl;
    }
  }, [loggedUser.id]);
  return <div className="bg-secondary">{children}</div>;
}
