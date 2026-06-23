import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "iPedia — The Verified Encyclopedia",
  description: "AI-drafted, expert-verified articles on science, medicine, technology, economics, history, and more.",
  keywords: ["encyclopedia", "wiki", "verified", "AI", "science", "medicine", "technology"],
  openGraph: {
    title: "iPedia — The Verified Encyclopedia",
    description: "AI-drafted, expert-verified articles on key topics in science, medicine, technology, and beyond.",
    url: "https://ipedia.app",
    siteName: "iPedia",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-screen flex flex-col" style={{ background: "var(--background)" }}>
        <Header />
        <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
