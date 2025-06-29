import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/app/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TicketLemon 🍋",
  description: "get your ticket now !",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased animation-pulse w-screen min-h-screen space-y-10  flex flex-col items-center justify-items-center px-8 pb-20 py-30 sm:px-20
          bg-gradient-to-b from-yellow-700 via-yellow-400 to-zinc-200 bg-400% animate-gradient`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
