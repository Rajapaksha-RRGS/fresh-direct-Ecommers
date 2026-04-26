import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fresh Direct — Farm-to-Table Marketplace Sri Lanka",
  description:
    "Connect directly with 500+ local Sri Lankan farmers. Harvested today, delivered within 24 hours. Fresh, chemical-free produce at fair prices.",
  keywords:
    "fresh vegetables, Sri Lanka farmers, organic produce, farm to table, fresh direct",
  openGraph: {
    title: "Fresh Direct — Farm-to-Table Marketplace",
    description: "Harvested today, on your table tomorrow.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
