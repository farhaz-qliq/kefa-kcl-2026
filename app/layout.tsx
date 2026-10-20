import type { Metadata } from "next";
import { Anton, Inter } from "next/font/google";
import "./globals.css";

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KEFA KCL 2026 — Presented by La Perfume",
  description: "7-a-side football tournament — 16 teams, 4 groups. Follow live scores, standings, fixtures and stats.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${anton.variable} ${inter.variable}`}>
      <body className="bg-surface text-navy overflow-hidden">{children}</body>
    </html>
  );
}
