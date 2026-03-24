import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MahaKrushi AI – Maharashtra Smart Farming Platform",
  description: "AI-powered agriculture intelligence for Maharashtra farmers. Real-time weather, satellite crop health, mandi prices, disease detection and more.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
