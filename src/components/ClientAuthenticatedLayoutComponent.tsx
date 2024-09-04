"use client";

import { useEffect, useState, ReactNode } from "react";
import { Header } from "./Header";
import { MessagesSideBar } from "./MessagesSidebar";
import { MessageCircleMore } from "lucide-react";

export const ClientAuthenticatedLayoutComponent = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isMessageSidebarOpen, setIsMessageSidebarOpen] =
    useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const authStore = localStorage.getItem("auth-store");
      if (authStore) {
        try {
          const parsedAuthStore = JSON.parse(authStore);
          setIsAuthenticated(Boolean(parsedAuthStore?.state?.token));
        } catch (error) {
          console.error("Error parsing auth-store from localStorage", error);
        }
      }
    }
  }, []);

  return (
    <>
      {isAuthenticated && (
        <>
          <Header openMessagesSideBar={() => setIsMessageSidebarOpen(true)} />
          <MessagesSideBar
            isMessageSidebarOpen={isMessageSidebarOpen}
            setIsMessageSidebarOpen={setIsMessageSidebarOpen}
          />
        </>
      )}
    </>
  );
};
