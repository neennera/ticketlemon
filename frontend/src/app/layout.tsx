import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/app/components/Header";
import Footer from "./components/Footer";

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative animation-pulse w-screen min-h-screen space-y-10  flex flex-col items-center justify-items-center px-8 py-20 sm:px-20
          bg-gradient-to-b from-yellow-600  to-zinc-200 bg-400% animate-gradient`}
      >
        <Header />
        {children}
        <Footer />
        <div className="w-screen h-screen -z-20 fixed inset-0 ">
          <p className="text-5xl absolute top-20 left-15 animate-pulse">🤹‍♂️</p>
          <p className="text-5xl absolute bottom-35 left-45 animate-pulse">
            🎪
          </p>
          <p className="text-5xl absolute top-20 right-15 animate-pulse">🤹‍♀️</p>
          <p className="text-5xl absolute bottom-30 right-45 animate-pulse">
            🎪
          </p>
        </div>
      </body>
    </html>
  );
}
