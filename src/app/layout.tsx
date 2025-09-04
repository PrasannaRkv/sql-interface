import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SQL Runner",
  description:
    "Access and manage your saved SQL queries. Quickly select, run, or delete previously saved queries from local storage.",
  keywords: [
    "SQL Runner",
    "Saved Queries",
    "SQL Playground",
    "Query Editor",
    "Database",
    "SQL Tools",
  ],
  authors: [{ name: "Prasanna Rkv" }],
  openGraph: {
    title: "SQL Runner",
    description:
      "Quickly access and manage your saved SQL queries directly in SQL Runner.",
    type: "website",
    url: "https://sql-interface-orcin.vercel.app/",
    siteName: "SQL Runner",
  },
  twitter: {
    card: "summary",
    title: "SQL Runner",
    description:
      "Quickly access and manage your saved SQL queries directly in SQL Runner.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
