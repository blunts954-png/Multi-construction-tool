import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Construction SaaS - AI-Powered Project Management",
  description: "Streamline your construction business with AI-powered invoice processing, RFI management, and QuickBooks integration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
