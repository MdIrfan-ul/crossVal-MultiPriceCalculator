import type { Metadata } from "next";
import { Inter } from "next/font/google";
// @ts-ignore - CSS import is handled by the Next.js build pipeline.
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CrossVal- Multi Price Calculator",
  description: "Secure Document Management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
