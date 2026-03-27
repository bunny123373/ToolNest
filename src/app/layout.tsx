import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ToolNest - 50+ Free Smart Tools in One Place",
  description: "Fast, simple, and powerful online tools built for everyday work. Image tools, PDF tools, text tools, and more.",
  keywords: "online tools, free tools, image tools, PDF tools, text tools, utilities",
  openGraph: {
    title: "ToolNest - 50+ Free Smart Tools in One Place",
    description: "Fast, simple, and powerful online tools built for everyday work.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full flex flex-col bg-surface text-text-primary`}>
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}