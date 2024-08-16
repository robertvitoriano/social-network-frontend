"use client";

import { useEffect, useState, ReactNode } from "react";

interface ClientAuthenticatedLayoutComponentProps {
  children: ReactNode;
}

export const ClientAuthenticatedLayoutComponent = ({
  children,
}: ClientAuthenticatedLayoutComponentProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

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

  return <>{isAuthenticated && children}</>;
};
