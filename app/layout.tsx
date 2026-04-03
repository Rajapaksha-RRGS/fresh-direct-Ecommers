import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fresh Direct — Farm-to-Table Marketplace Sri Lanka",
  description:
    "Connect directly with 500+ local Sri Lankan farmers. Harvested today, delivered within 24 hours. Fresh, chemical-free produce at fair prices.",
  keywords: "fresh vegetables, Sri Lanka farmers, organic produce, farm to table, fresh direct",
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
    <html lang="en">
      <body className="min-h-full flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
