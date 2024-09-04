import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";
import { MessagesSideBar } from "@/components/MessagesSidebar";
import { ClientAuthenticatedLayoutComponent } from "@/components/ClientAuthenticatedLayoutComponent";
import { MessageCircleMore } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Social Network",
  description: "A simple network created by Robert Vitoriano",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="relative h-[100vh] flex flex-col overflow-hidden bg-secondary">
          <Toaster />
          <ClientAuthenticatedLayoutComponent />
          <main className="flex h-screen w-full max-w-[550px] m-auto flex-col  bg-secondary text-white">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
