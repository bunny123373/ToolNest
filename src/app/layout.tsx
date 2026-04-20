import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "ToolNest",
  "description": "Free online tools for everyday work - image tools, PDF tools, text tools, and more.",
"url": "https://toolnest.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://toolnest.com/tools?q={search_term_string}",
    "query-input": "required name=search_term_string"
  },
  "creator": {
    "@type": "Organization",
    "name": "ToolNest"
  }
};

export const metadata: Metadata = {
  title: "ToolNest - 50+ Free Smart Tools in One Place",
  description: "Fast, simple, and powerful online tools built for everyday work. Image tools, PDF tools, text tools, and more.",
  keywords: "online tools, free tools, image tools, PDF tools, text tools, utilities",
  icons: {
    icon: [
      { url: "/qr.png", type: "image/png" },
      { url: "/favicon.ico", rel: "icon" }
    ],
  },
  openGraph: {
    title: "ToolNest - 50+ Free Smart Tools in One Place",
    description: "Fast, simple, and powerful online tools built for everyday work.",
    type: "website",
    url: "https://toolnest.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="google-adsense-account" content="ca-pub-8628683007968578" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8628683007968578" crossOrigin="anonymous"></script>
      </head>
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