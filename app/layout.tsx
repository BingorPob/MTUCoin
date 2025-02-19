import type React from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import { Navigation } from "@/components/Navigation";
import { ThemeProvider } from "@/components/theme-provider";
import SessionProviderWrapper from "@/components/session-provider-wrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "JelqAI",
  description: "The official website for JelqAI",
  generator: "v0.dev",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  console.log("Rendering RootLayout");

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SessionProviderWrapper>
            <Navigation />
            <main className="container mx-auto px-4 py-8">{children}</main>
          </SessionProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
