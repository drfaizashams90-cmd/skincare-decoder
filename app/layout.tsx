import type { Metadata } from "next";
import { Gruppo, Montserrat } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

const gruppo = Gruppo({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-gruppo",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Free Skincare Ingredient Checker Pakistan | SkinVerse.pk",
  description:
    "Paste or scan any skincare product's ingredient list to instantly check for irritants, acne triggers, and banned or restricted substances. Free tool by SkinVerse.pk, built for Pakistani skin.",
  keywords: [
    "skincare ingredient checker",
    "ingredient checker Pakistan",
    "cosmetic ingredient analyzer",
    "is this ingredient safe",
    "check skincare ingredients Pakistan",
  ],
  metadataBase: new URL("https://tools.skinverse.pk"),
  openGraph: {
    title: "Free Skincare Ingredient Checker Pakistan | SkinVerse.pk",
    description:
      "Instantly check any skincare product's ingredients for safety, irritants, and acne triggers. Built for Pakistani skin by SkinVerse.pk.",
    url: "https://tools.skinverse.pk",
    siteName: "skinverse.pk",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Skincare Ingredient Checker Pakistan | SkinVerse.pk",
    description:
      "Instantly check any skincare product's ingredients for safety, irritants, and acne triggers.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${gruppo.variable} ${montserrat.variable} font-body`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
