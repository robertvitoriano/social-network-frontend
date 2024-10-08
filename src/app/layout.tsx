import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ClientAuthenticatedLayoutComponent } from "@/components/ClientAuthenticatedLayoutComponent";

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
        <div className="relative h-[100vh] flex flex-col bg-secondary">
          <Toaster />
          <ClientAuthenticatedLayoutComponent />
          <div className="overflow-auto">
            <main className="flex h-screen w-full max-w-[550px] m-auto flex-col  bg-secondary text-white">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
