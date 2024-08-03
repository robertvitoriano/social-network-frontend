import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Social Network",
  description: "A simple network created by robert vitoriano",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-secondary">{children}</body>
    </html>
  );
}
