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
  title: "Construction SaaS - AI-Powered Construction Management",
  description: "Automate your construction business with AI-powered invoice processing, RFI management, change orders, and daily reports. Integrates seamlessly with QuickBooks.",
  keywords: ["construction management", "construction software", "AI invoice processing", "QuickBooks integration", "RFI management", "change orders", "daily reports", "construction SaaS"],
  authors: [{ name: "Construction SaaS Team" }],
  creator: "Construction SaaS",
  publisher: "Construction SaaS",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Construction SaaS - AI-Powered Construction Management",
    description: "Stop wasting hours on paperwork. Let AI handle invoice processing, RFIs, and daily reports while you focus on building great projects.",
    siteName: "Construction SaaS",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Construction SaaS - AI-Powered Construction Management",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Construction SaaS - AI-Powered Construction Management",
    description: "Automate your construction business with AI. Save 10+ hours per week.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes here when ready
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
